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
    // This is a simplified version. In a real implementation, 
    // you'd want to handle WebSocket connections or WebRTC
    try {
      const response = await this.textToSpeech("Hello, I'm here to help you.");
      onAudioData(response);
    } catch (error) {
      console.error('Voice call error:', error);
      throw error;
    }
  }
}

export default ElevenLabsService;