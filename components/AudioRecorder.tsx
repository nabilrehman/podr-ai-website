'use client';

import React, { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface AudioRecorderProps {
  onTranscriptionUpdate: (text: string, isFinal: boolean) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscriptionUpdate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const initSocket = async () => {
      try {
        // Initialize socket server
        await fetch('/api/socketio');
        
        // Connect to socket
        const socket = io({
          path: '/api/socketio',
        });

        socket.on('connect', () => {
          console.log('Socket connected');
        });

        socket.on('error', (error: string) => {
          setError(`Transcription error: ${error}`);
        });

        // Add transcription listener here after socket is initialized
        socket.on('transcription', (data: { text: string; isFinal: boolean }) => {
          onTranscriptionUpdate(data.text, data.isFinal);
        });

        socketRef.current = socket;
      } catch (error) {
        console.error('Socket initialization error:', error);
        setError('Failed to initialize voice chat connection');
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      cleanup();
    };
  }, [onTranscriptionUpdate]);

  const cleanup = () => {
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      cleanup(); // Clean up any existing connections

      // Get microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000
        } 
      });
      mediaStreamRef.current = stream;

      // Create audio context and processor
      const audioContext = new AudioContext({
        sampleRate: 16000,
        latencyHint: 'interactive'
      });
      audioContextRef.current = audioContext;

      // Create source node
      const source = audioContext.createMediaStreamSource(stream);

      // Create processor node
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorNodeRef.current = processor;

      // Process audio data
      processor.onaudioprocess = (e) => {
        if (socketRef.current?.connected) {
          const inputData = e.inputBuffer.getChannelData(0);
          // Convert float32 array to 16-bit PCM
          const pcmData = Int16Array.from(inputData.map(n => n * 0x7FFF));
          socketRef.current.emit('audioData', pcmData.buffer);
        }
      };

      // Connect nodes
      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsRecording(true);
      setError('');

      // Signal start of stream to server
      socketRef.current?.emit('startStream');

    } catch (err) {
      setError('Error accessing microphone. Please ensure microphone permissions are granted.');
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    // Signal end of stream to server
    socketRef.current?.emit('endStream');
    
    cleanup();
    setIsRecording(false);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded-full ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white font-semibold transition-colors`}
      >
        {isRecording ? 'Stop Conversation' : 'Start Conversation'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AudioRecorder;