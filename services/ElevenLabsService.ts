interface Voice {
  voice_id: string;
  name: string;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
}

class ElevenLabsService {
  private apiKey: string;
  private baseUrl: string = 'https://api.elevenlabs.io/v1';
  private voiceId: string;

  constructor(apiKey: string, voiceId: string) {
    this.apiKey = apiKey;
    this.voiceId = voiceId;
  }

  async textToSpeech(text: string): Promise<ArrayBuffer> {
    const response = await fetch(
      `${this.baseUrl}/text-to-speech/${this.voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }

    return await response.arrayBuffer();
  }

  async getVoices(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        'xi-api-key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch voices');
    }

    return await response.json();
  }

  // Method to handle voice streaming
  async streamVoice(text: string): Promise<ReadableStream> {
    const response = await fetch(
      `${this.baseUrl}/text-to-speech/${this.voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to stream voice');
    }

    return response.body!;
  }

  // Method to play audio from array buffer
  static async playAudio(audioData: ArrayBuffer): Promise<void> {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(audioData);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  }

  // Method to handle real-time voice call simulation
  async startVoiceCall(onAudioData: (data: ArrayBuffer) => void): Promise<void> {
    try {
      // Initial greeting
      const response = await this.textToSpeech(
        "Hello, I'm your AI therapist. I'm here to listen and help you. How are you feeling today?"
      );
      onAudioData(response);

      // Set up audio streaming for continuous conversation
      this.setupAudioStream(onAudioData);
    } catch (error) {
      console.error('Voice call error:', error);
      throw error;
    }
  }

  private setupAudioStream(onAudioData: (data: ArrayBuffer) => void) {
    // Here you would implement WebSocket or WebRTC for real-time audio
    // For now, we'll use a simple polling mechanism
    let isCallActive = true;

    const streamAudio = async () => {
      while (isCallActive) {
        try {
          // Wait for new messages and convert them to speech
          // This is a placeholder - you'd implement your own message queue
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('Audio streaming error:', error);
          isCallActive = false;
        }
      }
    };

    streamAudio();

    return () => {
      isCallActive = false;
    };
  }

  // Utility method to validate API key
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  }

  // Method to get voice settings
  async getVoiceSettings(): Promise<VoiceSettings> {
    const response = await fetch(
      `${this.baseUrl}/voices/${this.voiceId}/settings`,
      {
        headers: {
          'xi-api-key': this.apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get voice settings');
    }

    return await response.json();
  }

  // Method to update voice settings
  async updateVoiceSettings(settings: VoiceSettings): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/voices/${this.voiceId}/settings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify(settings),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update voice settings');
    }
  }
}

export default ElevenLabsService;