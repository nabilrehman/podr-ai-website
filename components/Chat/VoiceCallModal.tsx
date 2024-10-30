'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneIcon, MicrophoneIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileImage: string;
  name: string;
}

const VoiceCallModal = ({ isOpen, onClose, profileImage, name }: VoiceCallModalProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Simulate connection delay
      const timer = setTimeout(() => {
        setIsConnecting(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const contentVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 0.1 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(235,241,245,0.95)]"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={modalVariants}
        >
          <motion.div
            className="flex flex-col items-center p-8"
            variants={contentVariants}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg">
              <img
                src={profileImage}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-2xl font-semibold mb-2">{name}</h2>
            <p className="text-gray-600 mb-8">
              {isConnecting ? "Connecting..." : "In call"}
            </p>

            <div className="flex gap-6">
              <button
                onClick={handleMuteToggle}
                className={`p-4 rounded-full transition-all duration-300 ${
                  isMuted
                    ? "bg-gray-200 text-gray-600"
                    : "bg-white text-orange-500 shadow-lg hover:shadow-xl"
                }`}
              >
                <MicrophoneIcon className="w-6 h-6" />
              </button>

              <button
                onClick={onClose}
                className="p-4 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 hover:shadow-xl transition-all duration-300"
              >
                <PhoneIcon className="w-6 h-6 rotate-135" />
              </button>
            </div>
          </motion.div>

          {/* Wave Animation Background */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 border-4 border-orange-500 rounded-full animate-ripple"
                  style={{
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceCallModal;