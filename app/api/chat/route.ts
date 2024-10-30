import { GoogleGenerativeAI } from '@google/generative-ai';
import { Readable } from 'stream';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// This type should match your frontend Message type
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_CONTEXT = `You are Dr. Emma AI, a compassionate and highly skilled Social Situations Specialist. Your expertise lies in helping people overcome social anxiety and build lasting confidence. Your responses should be:
1. Empathetic and understanding
2. Professional but warm
3. Focused on practical, actionable advice
4. Based on cognitive behavioral therapy principles
5. Encouraging and supportive

Your goal is to help users navigate social situations, build confidence, and develop healthy coping mechanisms.`;

// Initialize the chat model
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Initialize chat history with system context
let chat = model.startChat({
  history: [
    {
      role: 'user',
      parts: INITIAL_CONTEXT,
    },
    {
      role: 'model',
      parts: "I understand my role as Dr. Emma AI, and I'm ready to help users with their social anxiety and confidence building journey.",
    },
  ],
  generationConfig: {
    maxOutputTokens: 1000,
    temperature: 0.7,
  },
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Prepare the readable stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await chat.sendMessageStream(message);

          for await (const chunk of result.stream) {
            const text = chunk.text();
            controller.enqueue(new TextEncoder().encode(text));
          }
          
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    // Return the stream with appropriate headers
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

// Add a helper function to truncate chat history if needed
function truncateChatHistory() {
  if (chat.getHistory().length > 20) {
    // Restart chat but keep the context
    chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: INITIAL_CONTEXT,
        },
        {
          role: 'model',
          parts: "I understand my role as Dr. Emma AI, and I'm ready to help users with their social anxiety and confidence building journey.",
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });
  }
}