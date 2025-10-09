// config/ai.config.js
export const AI_CONFIG = {
    host: process.env.OLLAMA_HOST,
    model: process.env.OLLAMA_MODEL,
    options: {
      temperature: Number(process.env.OLLAMA_TEMP) || 1.0,
      top_p: Number(process.env.OLLAMA_TOP_P) || 0.95,
      top_k: Number(process.env.OLLAMA_TOP_K) || 64,
      min_p: Number(process.env.OLLAMA_MIN_P) || 0.0,
    },
  };
  