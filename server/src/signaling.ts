import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

interface Room {
  id: string;
  clients: string[];
}

class SignalingServer {
  private app: express.Application;
  private server: any;
  private io: Server;
  private rooms: Map<string, Room>;

  constructor(port: number = 3001) {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    this.rooms = new Map();

    this.setupSocketHandlers();
    this.startServer(port);
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket<DefaultEventsMap>) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle room creation/joining
      socket.on('join-room', (roomId: string) => {
        this.handleRoomJoin(socket, roomId);
      });

      // Handle WebRTC signaling
      socket.on('signal', (data: { roomId: string, type: string, data: any }) => {
        this.handleSignaling(socket, data);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnection(socket);
      });
    });
  }

  private handleRoomJoin(socket: Socket, roomId: string): void {
    let room = this.rooms.get(roomId);

    if (!room) {
      room = { id: roomId, clients: [] };
      this.rooms.set(roomId, room);
    }

    // Maximum 2 clients per room (peer-to-peer)
    if (room.clients.length >= 2) {
      socket.emit('room-full');
      return;
    }

    // Join the room
    socket.join(roomId);
    room.clients.push(socket.id);

    // Notify clients
    if (room.clients.length === 2) {
      this.io.to(roomId).emit('room-ready');
    } else {
      socket.emit('waiting-for-peer');
    }
  }

  private handleSignaling(socket: Socket, data: { roomId: string, type: string, data: any }): void {
    const { roomId, type, data: signalData } = data;
    const room = this.rooms.get(roomId);

    if (!room) {
      console.error(`Room ${roomId} not found`);
      return;
    }

    // Broadcast the signal to other peers in the room
    socket.to(roomId).emit('signal', {
      type,
      data: signalData,
      from: socket.id
    });
  }

  private handleDisconnection(socket: Socket): void {
    console.log(`Client disconnected: ${socket.id}`);

    // Remove client from all rooms
    this.rooms.forEach((room, roomId) => {
      const index = room.clients.indexOf(socket.id);
      if (index !== -1) {
        room.clients.splice(index, 1);
        if (room.clients.length === 0) {
          this.rooms.delete(roomId);
        } else {
          // Notify remaining clients
          this.io.to(roomId).emit('peer-disconnected', socket.id);
        }
      }
    });
  }

  private startServer(port: number): void {
    this.server.listen(port, () => {
      console.log(`Signaling server listening on port ${port}`);
    });
  }
}

export default SignalingServer;