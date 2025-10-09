// controllers/ai.controller.js
import { z } from 'zod';
import { chatOllama, generateOllama, listModels } from '../services/ai/ollamaClient.js';
import { initSSE, sendData, sendEvent, endSSE } from '../utils/sse.js';
import { splitNdjson } from '../utils/parseNdjson.js';
import { sysEventAssistant, promptEventDescription, promptTagsFromDesc, promptRegistrationSummary } from '../services/ai/prompts.js';
// Import RAG services
import AIContextService from '../src/services/aiContextService.js';

const ChatBody = z.object({
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string(),
  })),
});

// Initialize AI Context Service
const aiContextService = new AIContextService();

// Enhanced chat stream with RAG
export async function chatStream(req, res) {
  initSSE(res);
  try {
    const parsed = ChatBody.parse(req.body);
    
    // Get the latest user message for context analysis
    const userMessages = parsed.messages.filter(msg => msg.role === 'user');
    const latestUserMessage = userMessages[userMessages.length - 1]?.content || '';
    
    // Get organization ID from session or request (you may need to adjust this based on your auth system)
    const organizationId = req.user?.organizationId || req.session?.organizationId || null;
    
    // Create enhanced prompt with context
    const { enhancedPrompt, context, hasContext } = await aiContextService.enhancePromptWithContext(
      latestUserMessage, 
      organizationId
    );
    
    // Replace the system message with enhanced prompt if we have relevant data
    let enhancedMessages = [...parsed.messages];
    if (hasContext) {
      // Replace or add system message with context
      const systemMessageIndex = enhancedMessages.findIndex(msg => msg.role === 'system');
      const contextSystemMessage = { role: 'system', content: enhancedPrompt };
      
      if (systemMessageIndex >= 0) {
        enhancedMessages[systemMessageIndex] = contextSystemMessage;
      } else {
        enhancedMessages.unshift(contextSystemMessage);
      }
      
      // Log context summary for debugging
      console.log('RAG Context:', aiContextService.getContextSummary(context));
    }

    const streamRes = await chatOllama({ messages: enhancedMessages, stream: true });

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
          // Ollama trả về từng token riêng lẻ trong message.content
          const token = data.message?.content ?? '';
          
          if (token && token.trim()) {
            sendData(res, { token, done: !!data.done });
          }
          if (data.done) {
            // Send suggested questions if we have context
            if (hasContext && context) {
              const suggestions = aiContextService.getSuggestedQuestions(context);
              sendData(res, { suggestions, done: true });
            }
            return endSSE(res);
          }
        } catch { /* bỏ qua */ }
      }
    }
  } catch (e) {
    console.error('Chat stream error:', e);
    sendEvent(res, 'error', { error: e.message });
    endSSE(res);
  }
}

// Enhanced generate once with context
export async function generateOnce(req, res) {
  try {
    const { prompt, organizationId } = req.body ?? {};
    
    // Create enhanced prompt with context
    const { enhancedPrompt, hasContext } = await aiContextService.enhancePromptWithContext(
      prompt, 
      organizationId || req.user?.organizationId || req.session?.organizationId
    );
    
    const finalPrompt = hasContext ? enhancedPrompt : prompt;
    const r = await generateOllama({ prompt: finalPrompt, stream: false });
    const json = await r.json();
    res.json(json);
  } catch (error) {
    console.error('Generate once error:', error);
    res.status(500).json({ error: error.message });
  }
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

// New endpoint to get context information
export async function getContextInfo(req, res) {
  try {
    const { query } = req.query;
    const organizationId = req.user?.organizationId || req.session?.organizationId || null;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const context = await aiContextService.contextService.getRelevantContext(query, organizationId);
    const summary = aiContextService.getContextSummary(context);
    const suggestions = aiContextService.getSuggestedQuestions(context);
    
    res.json({
      context,
      summary,
      suggestions,
      hasContext: context.hasContext || false
    });
  } catch (error) {
    console.error('Get context info error:', error);
    res.status(500).json({ error: error.message });
  }
}
