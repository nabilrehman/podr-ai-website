const { VertexAI } = require('@google-cloud/vertexai');
global.fetch = require('node-fetch');
global.Headers = fetch.Headers;

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
    project: 'bap-emea-apigee-3',
    location: 'us-central1',  // your region
    apiKey: process.env.GOOGLE_AI_API_KEY
});

// Initialize generative model
const model = 'gemini-pro';
const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generation_config: {
        max_output_tokens: 2048,
        temperature: 0.9,
        top_p: 1,
    },
});

async function chat() {
    const chat = generativeModel.startChat();
    
    const message = 'What services can you help me with?';

    const result = await chat.sendMessage(message);
    const response = await result.response;
    console.log('Response: ', JSON.stringify(response));
}

module.exports = { chat };