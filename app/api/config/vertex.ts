import { SafetySetting } from '@google-cloud/vertexai';

export const SYSTEM_INSTRUCTION = `Your job is to act like Julien and see the transcripts attached of Juliens Videos. You have to really act like Julien and try get get to the root cause of my anxiety by asking me questions and giving opinions similar to how Julien asks questions in his videos. Be very curious and never just give judgements without asking questions but also provide value on the way if you find any value based on Julien's sessions in the transcripts. You have to start and open the chat`;

export const GENERATION_CONFIG = {
  maxOutputTokens: 8192,
  temperature: 1,
  topP: 0.95,
};

export const SAFETY_SETTINGS = [
  {
    category: SafetySetting.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: SafetySetting.HarmBlockThreshold.OFF,
  },
  {
    category: SafetySetting.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: SafetySetting.HarmBlockThreshold.OFF,
  },
  {
    category: SafetySetting.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: SafetySetting.HarmBlockThreshold.OFF,
  },
  {
    category: SafetySetting.HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: SafetySetting.HarmBlockThreshold.OFF,
  },
];