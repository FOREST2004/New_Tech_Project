// config/ai.config.js
export const AI_CONFIG = {
    host: process.env.OLLAMA_HOST,
    model: process.env.OLLAMA_MODEL,
    options: {
      temperature: Number(process.env.OLLAMA_TEMP),
      top_p: Number(process.env.OLLAMA_TOP_P),
    },
  };
  