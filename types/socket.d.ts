import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

declare module 'next' {
  export interface NextApiResponse extends NextApiResponse {
    socket: Socket & {
      server: NetServer & {
        io: SocketIOServer;
      };
    };
  }
}