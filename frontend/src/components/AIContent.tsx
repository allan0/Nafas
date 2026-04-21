'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Brain, RefreshCw, Zap, Info, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWellnessData } from '@/hooks/useWellnessData';
import { useRouter } from 'next/navigation';

// --- STRICT TYPES FOR BUILD SAFETY ---
interface ChatAction {
  label: string;
  target?: string;
  retry?: boolean;
  retryText?: string;
}

interface Message {
  role: 'ai' | 'user';
  content: string;
  action: ChatAction | null;
}

const API_URL = "https://nafas-jur5.onrender.com";

export default function AIContent() {
  const router = useRouter();
  const { healthProfile, isLoaded } = useWellnessData();
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      content: "Protocol AI online. Bio-identity indexed. How shall we optimize your wellness architecture today?",
      action: null 
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (forcedText?: string) => {
    const textToSend = forcedText || input;
    if (!textToSend.trim() || isLoading) return;

    // 1. Add User Message
    const userMsg: Message = { role: 'user', content: textToSend, action: null };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          goal: textToSend, 
          profile: healthProfile // Sends Height, Weight, Ethnicity, Smoking
        }),
      });
      
      if (!response.ok) throw new Error("Cold Start");

      const data = await response.json();
      
      if (data.status === "success" && data.recommendations.length > 0) {
        const rec = data.recommendations[0];
        const aiContent = `✨ **Protocol Insight**\n\n${rec.detail}\n\n**Benefit:** ${rec.benefit}`;
        
        // 2. Map Redirects from Backend hints
        let smartAction: ChatAction | null = null;
        if (data.redirect_hint === 'yoga') {
            smartAction = { label: 'Enter Yoga Hub', target: '/?tab=yoga' };
        } else if (data.redirect_hint === 'run' || data.redirect_hint === 'walk') {
            smartAction = { label: 'Launch Tracker', target: '/?tab=run' };
        } else if (data.redirect_hint === 'breath') {
            smartAction = { label: 'Start Breath Protocol', target: '/?tab=breath' };
        }

        const aiMsg: Message = { role: 'ai', content: aiContent, action: smartAction };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (error) {
      // 3. Handle Backend Waking Up (Cold Start)
      const errorMsg: Message = { 
        role: 'ai', 
        content: "Nafas Node is waking up. The protocol connection is being restored. Please retry in 10 seconds.",
        action: { label: 'Retry Transmission', retry: true, retryText: textToSend }
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden bg-transparent">
      
      {/* AI HEADER */}
      <div className="flex flex-col items-center py-6 bg-white/20 backdrop-blur-md border-b border-white/10">
        <div className="relative">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl border border-emerald-500/20">
                <Brain className="text-emerald-400 animate-pulse" size={28} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4 italic">Neural Protocol Engine</p>
      </div>

      {/* MESSAGE FEED */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 p-6 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex flex-col max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-5 rounded-[2.2rem] text-sm font-medium leading-relaxed shadow-sm border ${
                  m.role === 'user' 
                    ? 'bg-slate-900 text-white border-white/10 rounded-br-none' 
                    : 'bg-white/80 backdrop-blur-md text-slate-800 border-white/40 rounded-bl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>

                {/* ACTION BUTTONS (SMART REDIRECTS) */}
                {m.action && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        if (m.action?.retry) handleSend(m.action.retryText);
                        else router.push(m.action?.target || '/');
                    }}
                    className={`mt-3 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl transition-all ${
                        m.action.retry ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white shadow-emerald-500/20'
                    }`}
                  >
                    {m.action.retry ? <RefreshCw size={14}/> : <Zap size={14} fill="white"/>}
                    {m.action.label}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-3 border border-white/20">
              <Loader2 className="animate-spin text-emerald-500" size={16} />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Processing Bio-Context...</span>
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
        <div className="mt-4 flex justify-center gap-4 opacity-40">
             <span className="text-[8px] font-black text-slate-500 uppercase flex items-center gap-1"><Info size={10}/> End-to-End Encryption</span>
             <span className="text-[8px] font-black text-slate-500 uppercase flex items-center gap-1"><Bot size={10}/> Bio-Adaptive AI</span>
        </div>
      </div>
    </div>
  );
}
