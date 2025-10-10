// config/ai.config.js
export const AI_CONFIG = {
    host: process.env.OLLAMA_HOST || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "hf.co/unsloth/gemma-3-270m-it-GGUF:Q5_K_XL",
    options: {
      temperature: Number(process.env.OLLAMA_TEMP) || 0.7,
      top_p: Number(process.env.OLLAMA_TOP_P) || 0.9,
      top_k: Number(process.env.OLLAMA_TOP_K) || 40,
      min_p: Number(process.env.OLLAMA_MIN_P) || 0.05,
    },
  };
  