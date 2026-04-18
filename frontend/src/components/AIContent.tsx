'use client';
import { useState } from 'react';
import { Send, Mic, Loader2 } from 'lucide-react';

const BACKEND_URL = "https://nafas-backend.onrender.com";

export default function AIContent() {
  const [messages, setMessages] = useState([{ role: 'ai', content: "Hello! I'm your Nafas AI Coach." }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const goal = input; setInput(""); setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, location: "Dubai" }),
      });
      const data = await res.json();
      const advice = data.recommendations[0];
      setMessages(prev => [...prev, { role: 'ai', content: `${advice.secret || advice.pose}: ${advice.detail || advice.benefit}` }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting to the desert wind." }]);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-md mx-auto p-6 pb-24">
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-5xl">🌬️</div>
        <h1 className="text-2xl font-semibold">AI Wellness Coach</h1>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-emerald-500 text-white' : 'bg-white'}`}>{m.content}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 p-4 rounded-2xl border" placeholder="Ask me anything..." />
        <button onClick={handleSend} className="bg-emerald-500 p-4 rounded-2xl text-white"><Send size={20}/></button>
      </div>
    </div>
  );
}
