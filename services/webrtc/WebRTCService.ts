import 'webrtc-adapter';
import { SignalingClient } from './SignalingClient';

interface WebRTCConfig {
  iceServers: RTCIceServer[];
  optional?: RTCConfiguration;
}

interface SignalingMessage {
  type: string;
  data: any;
}

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private signalingClient: SignalingClient | null = null;

  constructor(private config: WebRTCConfig) {}

  async initialize(signalingClient: SignalingClient) {
    this.signalingClient = signalingClient;
    
    try {
      // Create peer connection
      this.peerConnection = new RTCPeerConnection({
        iceServers: this.config.iceServers,
        ...this.config.optional,
      });

      // Set up event handlers
      this.setupPeerConnectionHandlers();

      // Create data channel for text messages
      this.dataChannel = this.peerConnection.createDataChannel('messageChannel', {
        ordered: true,
      });

      this.setupDataChannelHandlers();

      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      // Add tracks to peer connection
      this.localStream.getTracks().forEach((track) => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize WebRTC:', error);
      throw error;
    }
  }

  private setupPeerConnectionHandlers() {
    if (!this.peerConnection) return;

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.signalingClient) {
        this.signalingClient.sendSignal('ice-candidate', event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
    };

    this.peerConnection.onnegotiationneeded = async () => {
      try {
        if (this.peerConnection) {
          const offer = await this.peerConnection.createOffer();
          await this.peerConnection.setLocalDescription(offer);

          if (this.signalingClient) {
            this.signalingClient.sendSignal('offer', offer);
          }
        }
      } catch (error) {
        console.error('Error during negotiation:', error);
      }
    };
  }

  private setupDataChannelHandlers() {
    if (!this.dataChannel) return;

    this.dataChannel.onmessage = (event) => {
      console.log('Received message:', event.data);
    };

    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
    };

    this.dataChannel.onclose = () => {
      console.log('Data channel closed');
    };
  }

  async handleSignalingMessage(message: SignalingMessage) {
    if (!this.peerConnection) return;

    try {
      switch (message.type) {
        case 'offer':
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.data));
          const answer = await this.peerConnection.createAnswer();
          await this.peerConnection.setLocalDescription(answer);
          
          if (this.signalingClient) {
            this.signalingClient.sendSignal('answer', answer);
          }
          break;

        case 'answer':
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.data));
          break;

        case 'ice-candidate':
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(message.data));
          break;
      }
    } catch (error) {
      console.error('Error handling signaling message:', error);
      throw error;
    }
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  async sendMessage(message: string) {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(message);
    }
  }

  close() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    
    if (this.dataChannel) {
      this.dataChannel.close();
    }
    
    if (this.peerConnection) {
      this.peerConnection.close();
    }

    if (this.signalingClient) {
      this.signalingClient.disconnect();
    }

    this.localStream = null;
    this.remoteStream = null;
    this.dataChannel = null;
    this.peerConnection = null;
    this.signalingClient = null;
  }
}