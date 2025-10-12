// client/src/services/aiService.js

// Lấy base URL từ environment hoặc sử dụng default
const getBaseUrl = () => {
  // Trong production, sử dụng URL của Heroku backend
  if (import.meta.env.PROD) {
    return 'https://thuan-test1.herokuapp.com';
  }
  // Trong development, sử dụng localhost
  return 'http://localhost:4321';
};

export async function chatStream(messages, onToken) {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ messages }),
    });
    
    if (!res.ok) {
      throw new Error(`AI service error: ${res.status} ${res.statusText}`);
    }
    
    if (!res.body) {
      throw new Error('AI stream failed - no response body');
    }
  
    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
  
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
  
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || '';
      for (const part of parts) {
        if (part.startsWith('data: ')) {
          try {
            const payload = JSON.parse(part.slice(6));
            if (payload.token && payload.token.trim()) {
              onToken?.(payload.token, !!payload.done);
            }
            if (payload.done) break;
          } catch (e) {
            console.warn('Failed to parse SSE data:', part);
          }
        }
      }
    }
}

export async function aiEventDescription(title, lang = 'vi') {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/ai/event/description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, lang }),
    });
    return res.json();
}

export async function aiSuggestTags(description) {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/ai/event/suggest-tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ description }),
    });
    return res.json();
}
  