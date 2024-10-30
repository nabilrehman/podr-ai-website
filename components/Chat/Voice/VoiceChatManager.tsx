import React, { useEffect, useRef, useState } from 'react';
import { WebRTCService } from '../../../services/webrtc/WebRTCService';
import { SignalingClient } from '../../../services/webrtc/SignalingClient';
import { webRTCConfig } from '../../../services/webrtc/config';
import styles from './VoiceChat.module.css';

interface VoiceChatManagerProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;  // Used to create unique room IDs
  onVoiceStateChange?: (state: VoiceChatState) => void;
}

export enum VoiceChatState {
  INITIALIZING = 'initializing',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}

export const VoiceChatManager: React.FC<VoiceChatManagerProps> = ({
  isOpen,
  onClose,
  sessionId,
  onVoiceStateChange
}) => {
  const [chatState, setChatState] = useState<VoiceChatState>(VoiceChatState.DISCONNECTED);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const webrtcRef = useRef<WebRTCService | null>(null);
  const signalingRef = useRef<SignalingClient | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize voice chat
  useEffect(() => {
    if (isOpen) {
      initializeVoiceChat();
    }
    return () => cleanup();
  }, [isOpen]);

  // Update parent component about state changes
  useEffect(() => {
    onVoiceStateChange?.(chatState);
  }, [chatState, onVoiceStateChange]);

  const initializeVoiceChat = async () => {
    try {
      setChatState(VoiceChatState.INITIALIZING);
      
      // Create WebRTC service
      webrtcRef.current = new WebRTCService(webRTCConfig);
      
      // Create signaling client with room ID based on session
      const roomId = `voice-${sessionId}`;
      signalingRef.current = new SignalingClient({
        serverUrl: process.env.NEXT_PUBLIC_SIGNALING_SERVER || 'http://localhost:3001',
        roomId
      }, webrtcRef.current);

      // Initialize WebRTC with signaling
      await webrtcRef.current.initialize(signalingRef.current);
      
      // Set up audio processing
      setupAudioProcessing();
      
      setChatState(VoiceChatState.CONNECTING);
    } catch (err) {
      console.error('Failed to initialize voice chat:', err);
      setError('Failed to initialize voice chat. Please check your microphone permissions.');
      setChatState(VoiceChatState.ERROR);
    }
  };

  const setupAudioProcessing = () => {
    const localStream = webrtcRef.current?.getLocalStream();
    if (!localStream) return;

    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(localStream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      // Start audio level monitoring
      updateAudioLevel();
    } catch (err) {
      console.error('Failed to setup audio processing:', err);
    }
  };

  const updateAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate audio level (0-100)
    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    const normalizedLevel = Math.min(100, (average / 256) * 100);
    
    setAudioLevel(normalizedLevel);
    
    // Continue monitoring
    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  };

  const handleMuteToggle = () => {
    if (!webrtcRef.current) return;

    const localStream = webrtcRef.current.getLocalStream();
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // Toggle mute state
      });
      setIsMuted(!isMuted);
    }
  };

  const cleanup = () => {
    // Stop audio monitoring
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    // Close WebRTC connection
    if (webrtcRef.current) {
      webrtcRef.current.close();
    }

    // Reset state
    setChatState(VoiceChatState.DISCONNECTED);
    setError(null);
    setAudioLevel(0);
    setIsMuted(false);
  };

  const handleEndCall = () => {
    cleanup();
    onClose();
  };

  return (
    <div className={`${styles.voiceChatContainer} ${isOpen ? styles.open : ''}`}>
      <div className={styles.voiceChatControls}>
        {error ? (
          <div className={styles.error}>
            {error}
            <button onClick={handleEndCall}>Close</button>
          </div>
        ) : (
          <>
            <div className={styles.status}>
              {chatState === VoiceChatState.INITIALIZING && 'Initializing...'}
              {chatState === VoiceChatState.CONNECTING && 'Connecting...'}
              {chatState === VoiceChatState.CONNECTED && 'Connected'}
            </div>
            
            <div className={styles.audioIndicator} style={{ height: `${audioLevel}%` }} />
            
            <div className={styles.controls}>
              <button
                className={`${styles.muteButton} ${isMuted ? styles.muted : ''}`}
                onClick={handleMuteToggle}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? '🔇' : '🎤'}
              </button>
              
              <button
                className={styles.endCallButton}
                onClick={handleEndCall}
                aria-label="End call"
              >
                📞
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};