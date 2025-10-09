// controllers/ai.controller.js
import { z } from 'zod';
import { chatOllama, generateOllama, listModels } from '../services/ai/ollamaClient.js';
import { initSSE, sendData, sendEvent, endSSE } from '../utils/sse.js';
import { splitNdjson } from '../utils/parseNdjson.js';
import { sysEventAssistant, promptEventDescription, promptTagsFromDesc, promptRegistrationSummary } from '../services/ai/prompts.js';
// import { upsertEventEmbedding, searchSimilarEvents } from '../services/ai/embeddings.js'; // nếu dùng

const ChatBody = z.object({
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string(),
  })),
});

export async function chatStream(req, res) {
  initSSE(res);
  try {
    const parsed = ChatBody.parse(req.body);
    const streamRes = await chatOllama({ messages: parsed.messages, stream: true });

    if (!streamRes.ok || !streamRes.body) {
      const err = await streamRes.text();
      sendEvent(res, 'error', { error: err });
      return endSSE(res);
    }

    for await (const chunk of streamRes.body) {
      const lines = splitNdjson(chunk);
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          const token = data.message?.content ?? '';
          sendData(res, { token, done: !!data.done });
          if (data.done) return endSSE(res);
        } catch { /* bỏ qua */ }
      }
    }
  } catch (e) {
    sendEvent(res, 'error', { error: e.message });
    endSSE(res);
  }
}

export async function generateOnce(req, res) {
  const { prompt } = req.body ?? {};
  const r = await generateOllama({ prompt, stream: false });
  const json = await r.json();
  res.json(json);
}

export async function getModels(req, res) {
  const tags = await listModels();
  res.json(tags);
}

/** Nghiệp vụ dựng sẵn **/

export async function aiEventDescription(req, res) {
  const { title, lang = 'vi' } = req.body ?? {};
  const sys = sysEventAssistant();
  const user = { role: 'user', content: promptEventDescription(title, lang) };
  const r = await chatOllama({ messages: [sys, user], stream: false });
  const json = await r.json();
  res.json({ content: json?.message?.content ?? '' });
}

export async function aiSuggestTags(req, res) {
  const { description } = req.body ?? {};
  const sys = sysEventAssistant();
  const user = { role: 'user', content: promptTagsFromDesc(description) };
  const r = await chatOllama({ messages: [sys, user], stream: false });
  const json = await r.json();
  // cố gắng parse JSON output
  let parsed = {};
  try { parsed = JSON.parse(json?.message?.content ?? '{}'); } catch {}
  res.json(parsed);
}

export async function aiSummarizeRegistration(req, res) {
  const { answers } = req.body ?? {};
  const sys = sysEventAssistant();
  const user = { role: 'user', content: promptRegistrationSummary(answers) };
  const r = await chatOllama({ messages: [sys, user], stream: false });
  const json = await r.json();
  res.json({ summary: json?.message?.content ?? '' });
}
