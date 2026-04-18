'use client';

import { useState } from 'react';
import { Send, Mic, Loader2 } from 'lucide-react';

// Replace this with your actual Render URL after deployment
const BACKEND_URL = "https://nafas-backend.onrender.com";

export default function AICoach() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your Nafas AI Coach. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // 1. Add User Message to UI
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // 2. Call the FastAPI Backend
      const response = await fetch(`${BACKEND_URL}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: currentInput,
          location: "Dubai"
        }),
      });

      const data = await response.json();

      if (data.status === "success" && data.recommendations.length > 0) {
        // 3. Format the Recommendation
        const rec = data.recommendations[0];
        
        // Handle different data shapes (Yoga vs Endurance vs Dental)
        const title = rec.pose || rec.topic || rec.plan || "AI Insight";
        const secret = rec.secret || "Wellness Secret";
        const detail = rec.detail || rec.benefit || "";
        
        const formattedResponse = `✨ **${title}**\n\n*${secret}*: ${detail}`;
        
        setMessages(prev => [...prev, { role: 'ai', content: formattedResponse }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: "I've processed your request. Focus on deep breathing while I gather more specific data for you." }]);
      }
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting to the desert wind (Backend Offline). Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-md mx-auto p-6 pb-24">
      {/* AI Header */}
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#7CC6E8] to-[#A5D8F8] rounded-full flex items-center justify-center mb-4 shadow-inner">
          {isLoading ? (
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          ) : (
            <span className="text-5xl">🌬️</span>
          )}
        </div>
        <h1 className="text-2xl font-semibold">Your AI Wellness Coach</h1>
        <p className="text-slate-600 text-sm">Always here to guide your breath</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-8 pr-2 scrollbar-hide">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-5 py-4 rounded-3xl shadow-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-emerald-500 text-white rounded-br-none'
                  : 'bg-white/90 backdrop-blur-xl text-slate-800 rounded-bl-none border border-white/20'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/50 backdrop-blur-xl px-5 py-3 rounded-3xl rounded-bl-none animate-pulse text-slate-400 text-sm italic">
              Nafas is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["Yoga", "Endurance", "Quit smoking", "Dental secrets"].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => { setInput(suggestion); }}
            className="bg-white/70 hover:bg-white text-xs font-medium text-slate-600 px-5 py-2 rounded-2xl transition-all active:scale-95 border border-white/40"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex gap-3">
        <button className="w-12 h-12 bg-white/80 backdrop-blur rounded-2xl flex items-center justify-center text-slate-600 shadow-sm active:scale-90 transition">
          <Mic size={24} />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isLoading ? "Please wait..." : "How can I help you today?"}
            className="w-full bg-white/90 backdrop-blur-xl border border-transparent focus:border-emerald-400 rounded-3xl py-4 px-6 text-sm outline-none shadow-sm transition-all"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-90 ${
            isLoading || !input.trim() ? 'bg-slate-300 text-slate-500' : 'bg-emerald-500 text-white hover:bg-emerald-600'
          }`}
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
}
