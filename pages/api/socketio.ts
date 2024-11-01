import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import speech from '@google-cloud/speech';

export const config = {
  api: {
    bodyParser: false,
  },
};

const speechClient = new speech.SpeechClient();

const ioHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!res.socket.server.io) {
    const path = '/api/socketio';
    console.log('New Socket.io server...');
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      console.log('Client connected');
      let recognizeStream: any = null;

      socket.on('startStream', () => {
        console.log('Starting stream...');
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
        if (recognizeStream) {
          recognizeStream.end();
          recognizeStream = null;
        }
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;