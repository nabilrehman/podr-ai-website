import { VertexAI, GenerativeModel, Part } from '@google-cloud/vertexai';
import { SYSTEM_INSTRUCTION, GENERATION_CONFIG, SAFETY_SETTINGS } from '../config/vertex';
import { Storage } from '@google-cloud/storage';

// Initialize Vertex AI
const vertexai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT || 'bap-emea-apigee-3',
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
});

// Initialize Google Cloud Storage
const storage = new Storage();

// Initialize the chat model
const model = new GenerativeModel({
  model: 'gemini-1.5-pro-002',
});

// Initialize chat with system instruction
let chat = model.startChat({
  systemPrompt: SYSTEM_INSTRUCTION,
});

// Function to read file from Google Cloud Storage
async function readFileFromGCS(bucketName: string, fileName: string): Promise<string> {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);
  const [content] = await file.download();
  return content.toString();
}

export async function POST(req: Request) {
  try {
    const { message, attachments } = await req.json();

    // Read the transcript file
    const transcript = await readFileFromGCS('vdobot', 'julien10vid.txt');
    const transcriptPart = Part.fromText(transcript);
    
    // If this is the first message, initialize with transcript
    if (!chat) {
      chat = model.startChat({
        systemPrompt: SYSTEM_INSTRUCTION,
      });
      
      await chat.sendMessage([
        transcriptPart,
        Part.fromText('Your job is to act like Julien and see the transcripts attached of Juliens Videos. You have to really act like Julien and try get get to the root cause of my anxiety by asking me questions and giving opinions similar to how Julien asks questions in his videos. Be very curious and never just give judgements without asking questions but also provide value on the way if you find any value based on Julien\'s sessions in the transcripts. You have to start and open the chat')
      ], {
        generationConfig: GENERATION_CONFIG,
        safetySettings: SAFETY_SETTINGS,
      });
    }

    // Create message parts array
    const messageParts = [Part.fromText(message)];

    // Add any attachments as parts
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        if (attachment.type.startsWith('text/')) {
          messageParts.push(Part.fromText(attachment.content as string));
        }
      }
    }

    // Send message and get response
    const response = await chat.sendMessage(messageParts, {
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    });

    // Create a stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Get the response text
          const responseText = response.text();
          
          // Convert the response to a stream of chunks
          const encoder = new TextEncoder();
          const chunks = encoder.encode(responseText);
          controller.enqueue(chunks);
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    // Return the stream
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}