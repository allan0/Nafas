'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Brain, RefreshCw, Zap, Info, Bot, MapPin, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWellnessData } from '@/hooks/useWellnessData';
import { useRouter } from 'next/navigation';
import TelegramWebApp from '@twa-dev/sdk';

// --- RESPONSE SCHEMA ---
interface AIProtocolResponse {
  analysis: string;
  title: string;
  plan: string;
  safety_tip: string;
  uae_location: string;
  redirect_hint: 'yoga' | 'run' | 'breath' | 'weight_loss' | null;
}

interface Message {
  role: 'ai' | 'user';
  content?: string;
  protocol?: AIProtocolResponse; // New structured field
}

const API_URL = "https://nafas-jur5.onrender.com";

export default function AIContent() {
  const router = useRouter();
  const { getBioSummary, isLoaded } = useWellnessData();
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      content: "Protocol AI online. Bio-identity indexed. How shall we optimize your wellness architecture today?",
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async (forcedText?: string) => {
    const textToSend = forcedText || input;
    if (!textToSend.trim() || isLoading) return;

    // 1. Package Bio-Twin Context
    const bioContext = getBioSummary();

    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          goal: textToSend, 
          ...bioContext, // Spreads profile, habits, and history
          location: "Dubai"
        }),
      });
      
      if (!response.ok) throw new Error("Connection Error");

      const result = await response.json();
      
      if (result.status === "success") {
        const aiMsg: Message = { 
            role: 'ai', 
            protocol: result.data // Structured AI Data
        };
        setMessages(prev => [...prev, aiMsg]);
        TelegramWebApp.HapticFeedback.notificationOccurred('success');
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Neural Node is waking up. Please retry in a few seconds." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden bg-transparent">
      
      {/* AI STATUS HEADER */}
      <div className="flex flex-col items-center py-4 bg-white/20 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Bio-Sync Active</span>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 italic">Neural Protocol Engine</p>
      </div>

      {/* MESSAGE FEED */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 p-6 scrollbar-hide pb-20">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex flex-col max-w-[90%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* 1. Standard Text Message */}
                {m.content && (
                    <div className={`p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm border ${
                    m.role === 'user' 
                        ? 'bg-slate-900 text-white border-white/10 rounded-br-none' 
                        : 'bg-white/80 backdrop-blur-md text-slate-800 border-white/40 rounded-bl-none'
                    }`}>
                        <p>{m.content}</p>
                    </div>
                )}

                {/* 2. Structured Protocol Card */}
                {m.protocol && (
                    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl">
                        <div className="bg-slate-900 p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="text-emerald-400" size={14} />
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Personalized Protocol</span>
                            </div>
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{m.protocol.title}</h3>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Bio-Analysis */}
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1"><Brain size={12}/> AI Bio-Analysis</p>
                                <p className="text-xs text-slate-600 font-medium italic leading-relaxed">"{m.protocol.analysis}"</p>
                            </div>

                            {/* The Plan */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-900 uppercase mb-3">Execution Steps</p>
                                <p className="text-xs text-slate-700 leading-relaxed font-bold">{m.protocol.plan}</p>
                            </div>

                            {/* Safety & UAE Location */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                                    <p className="text-[8px] font-black text-rose-500 uppercase mb-1 flex items-center gap-1"><ShieldAlert size={10}/> Safety</p>
                                    <p className="text-[10px] font-bold text-rose-700 leading-tight">{m.protocol.safety_tip}</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-[8px] font-black text-blue-500 uppercase mb-1 flex items-center gap-1"><MapPin size={10}/> UAE Spot</p>
                                    <p className="text-[10px] font-bold text-blue-700 leading-tight">{m.protocol.uae_location}</p>
                                </div>
                            </div>

                            {/* Smart Redirect */}
                            {m.protocol.redirect_hint && (
                                <button 
                                    onClick={() => router.push(`/?tab=${m.protocol?.redirect_hint}`)}
                                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                                >
                                    Launch {m.protocol.redirect_hint} Hub
                                </button>
                            )}
                        </div>
                    </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-3 border border-white/20">
              <Loader2 className="animate-spin text-emerald-500" size={16} />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Neural Mapping...</span>
            </div>
          </div>
        )}
      </div>

      {/* INPUT ZONE */}
      <div className="p-6 pb-12 bg-white/10 backdrop-blur-xl border-t border-white/10">
        <div className="glass-card p-2 rounded-[2.5rem] flex items-center gap-2 border-white/60 shadow-2xl bg-white/90">
            <input 
              disabled={isLoading}
              className="flex-1 p-4 pl-6 outline-none text-sm font-bold bg-transparent placeholder-slate-300 text-slate-900"
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Query the protocol..."
            />
            <motion.button 
              whileTap={{ scale: 0.85 }}
              onClick={() => handleSend()} 
              disabled={isLoading || !input.trim()}
              className="bg-slate-900 text-white p-4 rounded-[1.8rem] shadow-xl disabled:bg-slate-200"
            >
              <Send size={20} fill={isLoading ? "none" : "currentColor"} />
            </motion.button>
        </div>
      </div>
    </div>
  );
}
