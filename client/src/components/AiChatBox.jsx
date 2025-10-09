import { useState } from 'react';
import { chatStream } from '../services/aiService';

export default function AiChatBox() {
  const [input, setInput] = useState('');
  const [out, setOut] = useState('');

  const send = async () => {
    setOut('');
    const messages = [
      { role: 'system', content: 'Bạn là trợ lý cho hệ thống quản lý sự kiện.' },
      { role: 'user', content: input }
    ];
    await chatStream(messages, (token) => setOut((s) => s + token));
  };

  return (
    <div className="p-4 space-y-3">
      <textarea className="w-full border p-2 rounded" rows={3}
        value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={send} className="px-4 py-2 rounded bg-black text-white">
        Gửi
      </button>
      <pre className="whitespace-pre-wrap border p-2 rounded min-h-[120px]">{out}</pre>
    </div>
  );
}
