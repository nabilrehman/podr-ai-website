import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import speech from '@google-cloud/speech';

interface TranscriptionSocket extends SocketServer {
  broadcast: {
    emit: (event: string, ...args: any[]) => void;
  };
}

export function setupTranscriptionServer(server: HTTPServer) {
  const io = new SocketServer(server, {
    path: '/transcription',
  });

  const speechClient = new speech.SpeechClient();

  io.on('connection', (socket) => {
    console.log('Client connected for transcription');

    let recognizeStream: any = null;

    socket.on('startStream', () => {
      // Create the streaming recognition request
      recognizeStream = speechClient
        .streamingRecognize({
          config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
            enableAutomaticPunctuation: true,
            model: 'default',
            useEnhanced: true,
            // Add medical or counseling specific phrases here if needed
            speechContexts: [{
              phrases: [
                'anxiety',
                'depression',
                'therapy',
                'counseling',
                'mental health',
                'stress',
                'emotions',
                'feelings',
                // Add more relevant phrases
              ]
            }]
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

            // If this is the final result, send it for AI processing
            if (isFinal) {
              socket.emit('finalTranscription', transcription);
            }
          }
        })
        .on('end', () => {
          console.log('Streaming recognition ended');
        });
    });

    socket.on('audioData', (data: Buffer) => {
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
      console.log('Client disconnected from transcription');
      if (recognizeStream) {
        recognizeStream.end();
        recognizeStream = null;
      }
    });
  });

  return io;
}