import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StreamingMessageProps {
  message: string;
  isComplete: boolean;
}

const StreamingMessage: React.FC<StreamingMessageProps> = ({ message, isComplete }) => {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message]);

  return (
    <div ref={messageRef} className="flex justify-start mb-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[80%] p-4 rounded-2xl bg-white/95 border border-white/30"
      >
        <div className="prose prose-sm">
          {message}
          {!isComplete && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-block ml-1"
            >
              ▊
            </motion.span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StreamingMessage;