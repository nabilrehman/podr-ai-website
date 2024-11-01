'use client';

import React, { useState, useEffect, useRef } from 'react';
import AudioRecorder from './AudioRecorder';
import { Socket } from 'socket.io-client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isInterim?: boolean;
}

const VoiceChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const lastFinalTranscriptRef = useRef<string>('');

  const handleTranscriptionUpdate = async (text: string, isFinal: boolean) => {
    if (isFinal) {
      // Only process if the transcript is different from the last one
      if (text !== lastFinalTranscriptRef.current) {
        lastFinalTranscriptRef.current = text;
        
        // Add user message
        const userMessage: Message = {
          role: 'user',
          content: text
        };
        setMessages(prev => [...prev, userMessage]);
        
        // Process with AI
        await processAIResponse(text);
      }
      setCurrentTranscript('');
    } else {
      // Update the current transcript for interim results
      setCurrentTranscript(text);
    }
  };

  const processAIResponse = async (text: string) => {
    try {
      setIsProcessing(true);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('AI processing failed');
      }

      const data = await response.json();
      
      // Add AI response
      const aiMessage: Message = {
        role: 'assistant',
        content: data.response
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error processing message:', error);
      // Handle error appropriately
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <AudioRecorder onTranscriptionUpdate={handleTranscriptionUpdate} />
      </div>
      
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-100 ml-auto'
                : 'bg-gray-100'
            } max-w-[80%] ${message.isInterim ? 'opacity-70' : ''}`}
          >
            <p className="text-sm font-semibold mb-1">
              {message.role === 'user' ? 'You' : 'AI'}
            </p>
            <p>{message.content}</p>
          </div>
        ))}
        
        {/* Show current transcript */}
        {currentTranscript && (
          <div className="p-4 rounded-lg bg-blue-50 ml-auto max-w-[80%] opacity-70">
            <p className="text-sm font-semibold mb-1">You (speaking)</p>
            <p>{currentTranscript}</p>
          </div>
        )}
        
        {isProcessing && (
          <div className="text-center">
            <p className="text-gray-500">AI is thinking...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceChat;