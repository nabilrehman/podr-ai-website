'use client';

import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm here to help you with anxiety management. Let me know what's on your mind.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">AI Psychologist</h2>
        <p className="text-sm text-gray-500">Online and ready to help</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            text={message.text}
            sender={message.sender}
            timestamp={message.timestamp}
          />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area with Voice Features */}
      <InputArea
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        profileImage="/images/ai-therapist.jpg"
        name="AI Psychologist"
      />
    </div>
  );
};

export default ChatWindow;