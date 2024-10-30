'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon, MicrophoneIcon, PhoneIcon } from '@heroicons/react/24/solid';
import VoiceFeatureModal from './VoiceFeatureModal';
import VoiceCallModal from './VoiceCallModal';
import ElevenLabsService from '@/services/ElevenLabsService';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  isProcessing?: boolean;
  profileImage: string;
  name: string;
}

const InputArea = ({ onSendMessage, isProcessing, profileImage, name }: InputAreaProps) => {
  const [message, setMessage] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const elevenlabsService = useRef<ElevenLabsService | null>(null);

  useEffect(() => {
    // Initialize ElevenLabs service
    // Note: In production, use environment variables
    elevenlabsService.current = new ElevenLabsService(
      'your-api-key',
      'default-voice-id'
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const startVoiceCall = async () => {
    setIsCallModalOpen(true);
    try {
      await elevenlabsService.current?.startVoiceCall((audioData) => {
        ElevenLabsService.playAudio(audioData);
      });
    } catch (error) {
      console.error('Failed to start voice call:', error);
      setIsCallModalOpen(false);
    }
  };

  return (
    <>
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[44px] max-h-[200px] pr-24"
              style={{ height: '44px' }}
            />
            
            <div className="absolute right-2 bottom-1.5 flex gap-2">
              <motion.button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="p-2 rounded-lg text-orange-500 hover:bg-orange-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MicrophoneIcon className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                type="button"
                onClick={startVoiceCall}
                className="p-2 rounded-lg text-orange-500 hover:bg-orange-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PhoneIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={!message.trim() || isProcessing}
            className={`p-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg 
              ${(!message.trim() || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:from-orange-600 hover:to-orange-700'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </motion.button>
        </form>
      </div>

      <VoiceFeatureModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTryVoice={() => {
          setIsVoiceModalOpen(false);
          // Implement voice input logic
        }}
      />

      <VoiceCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        profileImage={profileImage}
        name={name}
      />
    </>
  );
};

export default InputArea;