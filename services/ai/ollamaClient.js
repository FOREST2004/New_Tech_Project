// services/ai/ollamaClient.js
import fetch from 'node-fetch';
import { AI_CONFIG } from '../../config/ai.config.js';

export async function chatOllama({ messages, stream = false }) {
  const res = await fetch(`${AI_CONFIG.host}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      messages,
      stream,
      options: AI_CONFIG.options,
    }),
  });
  return res;
}

export async function generateOllama({ prompt, stream = false }) {
  const res = await fetch(`${AI_CONFIG.host}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: AI_CONFIG.model, prompt, stream }),
  });
  return res;
}

export async function embedOllama({ text, model = 'nomic-embed-text' }) {
  const res = await fetch(`${AI_CONFIG.host}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt: text }),
  });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json(); // { embedding: number[] }
  return json.embedding;
}

export async function listModels() {
  const res = await fetch(`${AI_CONFIG.host}/api/tags`);
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { models: [...] }
}
