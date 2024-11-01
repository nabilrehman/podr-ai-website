import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';
import speech from '@google-cloud/speech';

export const dynamic = 'force-dynamic';

const speechClient = new speech.SpeechClient();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket?.server?.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socketio',
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      console.log('Client connected');

      let recognizeStream: any = null;

      socket.on('startStream', () => {
        recognizeStream = speechClient
          .streamingRecognize({
            config: {
              encoding: 'LINEAR16',
              sampleRateHertz: 16000,
              languageCode: 'en-US',
              enableAutomaticPunctuation: true,
              model: 'default',
              useEnhanced: true,
            },
            interimResults: true,
          })
          .on('error', (error) => {
            console.error('Speech recognition error:', error);
            socket.emit('error', error.message);
          })
          .on('data', (data) => {
            if (data.results[0] && data.results[0].alternatives[0]) {
              const transcription = data.results[0].alternatives[0].transcript;
              const isFinal = data.results[0].isFinal;

              socket.emit('transcription', {
                text: transcription,
                isFinal: isFinal
              });
            }
          });
      });

      socket.on('audioData', (data) => {
        if (recognizeStream) {
          recognizeStream.write(data);
        }
      });

      socket.on('endStream', () => {
        if (recognizeStream) {
          recognizeStream.end();
          recognizeStream = null;
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
        if (recognizeStream) {
          recognizeStream.end();
          recognizeStream = null;
        }
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}

// Handle WebSocket upgrade
export const OPTIONS = GET;