// client/src/services/aiService.js
export async function chatStream(messages, onToken) {
    const res = await fetch('http://localhost:4321/api/ai/test-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // nếu bạn dùng cookie session
      body: JSON.stringify({ messages }),
    });
    if (!res.ok || !res.body) throw new Error('AI stream failed');
  
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
    const res = await fetch('/api/ai/event/description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, lang }),
    });
    return res.json(); // { content }
  }
  
  export async function aiSuggestTags(description) {
    const res = await fetch('/api/ai/event/suggest-tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ description }),
    });
    return res.json(); // { tags:[], category:"" }
  }
  