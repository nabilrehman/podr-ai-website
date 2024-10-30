import { io, Socket } from 'socket.io-client';
import { WebRTCService } from './WebRTCService';

interface SignalingConfig {
  serverUrl: string;
  roomId: string;
}

export class SignalingClient {
  private socket: Socket;
  private webrtcService: WebRTCService;
  private roomId: string;

  constructor(config: SignalingConfig, webrtcService: WebRTCService) {
    this.socket = io(config.serverUrl);
    this.webrtcService = webrtcService;
    this.roomId = config.roomId;

    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
      this.joinRoom();
    });

    this.socket.on('room-ready', () => {
      console.log('Room is ready - both peers connected');
    });

    this.socket.on('room-full', () => {
      console.log('Room is full');
    });

    this.socket.on('waiting-for-peer', () => {
      console.log('Waiting for peer to join...');
    });

    this.socket.on('signal', async (data: { type: string; data: any; from: string }) => {
      try {
        await this.webrtcService.handleSignalingMessage({
          type: data.type,
          data: data.data
        });
      } catch (error) {
        console.error('Error handling signal:', error);
      }
    });

    this.socket.on('peer-disconnected', (peerId: string) => {
      console.log(`Peer disconnected: ${peerId}`);
      // Handle peer disconnection (e.g., cleanup, UI updates)
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from signaling server');
    });
  }

  private joinRoom(): void {
    this.socket.emit('join-room', this.roomId);
  }

  public sendSignal(type: string, data: any): void {
    this.socket.emit('signal', {
      roomId: this.roomId,
      type,
      data
    });
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}