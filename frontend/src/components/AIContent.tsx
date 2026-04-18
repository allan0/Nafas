'use client';
import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

// Replace with your Render URL
const API_URL = "https://nafas-backend.onrender.com"; 

export default function AIContent() {
  const [messages, setMessages] = useState([{ 
    role: 'ai', 
    content: "Hello! I'm Nafas AI. How can I help you with your wellness today?" 
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: currentInput, location: "Dubai" }),
      });
      
      const data = await response.json();
      
      if (data.status === "success" && data.recommendations.length > 0) {
        const rec = data.recommendations[0];
        const aiMsg = `✨ ${rec.pose || rec.topic || 'Recommendation'}\n\n${rec.secret || 'Tip'}: ${rec.detail || rec.benefit}`;
        setMessages(prev => [...prev, { role: 'ai', content: aiMsg }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Backend is currently waking up... please try again in a few seconds." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-3xl max-w-[85%] shadow-sm ${m.role === 'user' ? 'bg-emerald-500 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && <Loader2 className="animate-spin text-emerald-500 mx-auto" />}
      </div>
      
      <div className="flex gap-2 bg-white p-2 rounded-3xl shadow-lg">
        <input 
          className="flex-1 p-3 pl-4 outline-none text-sm"
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about Yoga, Smoking, Endurance..."
        />
        <button onClick={handleSend} className="bg-emerald-500 p-3 rounded-2xl text-white active:scale-90 transition">
          <Send size={20}/>
        </button>
      </div>
    </div>
  );
}
