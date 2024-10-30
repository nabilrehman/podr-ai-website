'use client';

import { motion } from 'framer-motion';

interface MessageBubbleProps {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const MessageBubble = ({ text, sender, timestamp }: MessageBubbleProps) => {
  const isAI = sender === 'ai';

  return (
    <motion.div
      className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isAI
            ? 'bg-white text-gray-800 shadow-sm'
            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
        }`}
      >
        <p className="text-sm">{text}</p>
        <p className={`text-xs mt-1 ${isAI ? 'text-gray-400' : 'text-orange-100'}`}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
};

export default MessageBubble;