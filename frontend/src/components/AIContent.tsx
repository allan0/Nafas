'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, ThermometerSun, Droplet } from 'lucide-react';
import TelegramWebApp from '@twa-dev/sdk';

const API_URL = "https://nafas-backend.onrender.com";

export default function AIContent() {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: "Hello! I'm Nafas AI, your UAE wellness coach. How can I help you today? Ask me about yoga, endurance, dental care, or any goal." 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [haptic, setHaptic] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Telegram Mini App + Haptics
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = TelegramWebApp;
      tg.ready();
      tg.expand();
      setHaptic(tg.HapticFeedback);
    }
  }, []);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    
    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);

    // Haptic feedback on send
    haptic?.impactOccurred('light');

    try {
      const response = await fetch(`${API_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          goal: currentInput, 
          location: "Dubai"  // You can make this dynamic later from user profile
        }),
      });
      
      const data = await response.json();
      
      let aiContent = "";
      
      if (data.status === "success" && data.recommendations?.length > 0) {
        const rec = data.recommendations[0];
        
        if (data.ai_mode) {
          // Live AI response with weather
          aiContent = `✨ ${rec.topic || 'Smart Recommendation'}\n\n` +
                      `${rec.detail}\n\n` +
                      `💡 Safety Tip: ${rec.benefit}\n\n` +
                      `🌡️ ${data.weather || 'UAE conditions considered'}`;
        } else {
          // Fallback mode
          aiContent = `✨ ${rec.pose || rec.topic || 'Recommendation'}\n\n` +
                      `${rec.secret || 'Tip'}: ${rec.detail || rec.benefit}`;
        }
      } else {
        aiContent = "I'm having trouble connecting right now. Please try again in a moment.";
      }

      // Add AI response
      setMessages(prev => [...prev, { role: 'ai', content: aiContent }]);
      
      // Haptic success on reply
      haptic?.notificationOccurred('success');

    } catch (error) {
      console.error("AI request failed:", error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Backend is waking up... please try again in a few seconds. 🌬️" 
      }]);
      haptic?.notificationOccurred('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] p-4 bg-gradient-to-b from-sky-50 to-white">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-3xl max-w-[85%] shadow-sm ${
              m.role === 'user' 
                ? 'bg-emerald-500 text-white rounded-br-none' 
                : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
            }`}>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {m.content}
              </pre>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl rounded-bl-none border border-slate-100 flex items-center gap-3">
              <Loader2 className="animate-spin text-emerald-500" size={20} />
              <span className="text-slate-500 text-sm">Nafas is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="flex gap-2 bg-white p-2 rounded-3xl shadow-lg border border-slate-100">
        <input 
          className="flex-1 p-4 pl-5 outline-none text-sm bg-transparent placeholder:text-slate-400"
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about yoga in heat, quitting smoking, or endurance runs..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          disabled={!input.trim() || isLoading}
          className="bg-emerald-500 p-4 rounded-2xl text-white active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>

      {/* Subtle footer hint */}
      <div className="text-center mt-3">
        <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <ThermometerSun size={12} /> UAE weather-aware • Powered by Nafas AI
        </p>
      </div>
    </div>
  );
}
