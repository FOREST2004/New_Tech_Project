// utils/sse.js
export function initSSE(res) {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    // CORS nếu frontend/vite chạy khác origin
    res.flushHeaders?.();
  }
  export function sendData(res, data) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
  export function sendEvent(res, event, data) {
    res.write(`event: ${event}\n`);
    sendData(res, data);
  }
  export function endSSE(res) {
    res.end();
  }
  