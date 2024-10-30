'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface VoiceFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTryVoice: () => void;
}

const VoiceFeatureModal = ({ isOpen, onClose, onTryVoice }: VoiceFeatureModalProps) => {
  const modalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Audio Wave Animation */}
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div
                      className="w-1 bg-orange-500 rounded-full animate-wave"
                      style={{
                        height: `${100 - i * 20}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-3">
              Characters now have a voice
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              Hear your chats out loud with natural voice responses
            </p>

            <button
              onClick={onTryVoice}
              className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            >
              Try with voice
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VoiceFeatureModal;