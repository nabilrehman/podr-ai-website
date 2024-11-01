import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import FormData from 'form-data';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    const transcriptionResult = await transcribeAudio(audioFile);
    return NextResponse.json({ text: transcriptionResult });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Transcription failed' },
      { status: 500 }
    );
  }
}

async function transcribeAudio(audioBlob: Blob): Promise<string> {
  // Convert Blob to Buffer
  const arrayBuffer = await audioBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Create form data for OpenAI API
  const formData = new FormData();
  formData.append('file', buffer, {
    filename: 'audio.wav',
    contentType: audioBlob.type,
  });
  formData.append('model', 'whisper-1');

  try {
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Transcription failed with status: ${response.status}`);
    }

    const result = await response.json();
    return result.text;
  } catch (error) {
    console.error('Error during transcription:', error);
    throw error;
  }
}