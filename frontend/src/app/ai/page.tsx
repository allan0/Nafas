'use client';

import { useState } from 'react';
import { Send, Mic } from 'lucide-react';

export default function AICoach() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your Nafas AI Coach. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Let's try a simple 4-7-8 breathing exercise together. Inhale for 4, hold for 7, exhale for 8.",
        "Great choice! Would you like a personalized 5-minute mindfulness plan for today?",
        "I recommend logging a short meditation session. You'll earn 30 NAF instantly.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setMessages(prev => [...prev, { role: 'ai', content: randomResponse }]);
    }, 800);

    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-md mx-auto p-6 pb-24">
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#7CC6E8] to-[#A5D8F8] rounded-full flex items-center justify-center mb-4 shadow-inner">
          <span className="text-5xl">🌬️</span>
        </div>
        <h1 className="text-2xl font-semibold">Your AI Wellness Coach</h1>
        <p className="text-slate-600 text-sm">Always here to guide your breath</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-8 pr-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-5 py-4 rounded-3xl ${
                msg.role === 'user'
                  ? 'bg-emerald-500 text-white rounded-br-none'
                  : 'bg-white/90 backdrop-blur-xl text-slate-800 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["Breathing guide", "Daily plan", "Mood check", "Stress relief"].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setInput(suggestion)}
            className="bg-white/70 hover:bg-white text-sm px-5 py-2 rounded-2xl transition"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex gap-3">
        <button className="w-12 h-12 bg-white/80 backdrop-blur rounded-2xl flex items-center justify-center text-slate-600">
          <Mic size={24} />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="How can I help you breathe better today?"
            className="w-full bg-white/90 backdrop-blur-xl border border-transparent focus:border-emerald-400 rounded-3xl py-4 px-6 text-sm outline-none"
          />
        </div>
        <button
          onClick={handleSend}
          className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl flex items-center justify-center transition"
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
}
