'use client';

import { motion } from 'framer-motion';
import { useWellnessData } from '@/hooks/useWellnessData';
import { 
  CheckCircle2, 
  X as XIcon, 
  Send, 
  Calendar, 
  Zap, 
  ArrowRight, 
  Wallet,
  Coins,
  Gift,
  Timer,
  ExternalLink
} from 'lucide-react';
import TelegramWebApp from '@twa-dev/sdk';

export default function EarnContent() {
  const { xp, tasks, completeTask, isLoaded } = useWellnessData();

  if (!isLoaded) return null;

  const socialTasks = [
    { 
      id: 'daily_checkin', 
      title: 'Daily Protocol Access', 
      reward: 25, 
      icon: <Calendar className="text-blue-500" />,
      desc: 'Claim your daily consistency bonus',
      type: 'internal'
    },
    { 
      id: 'follow_x', 
      title: 'Follow Nafas on X', 
      reward: 100, 
      icon: <XIcon className="text-slate-900" />, 
      link: 'https://x.com/nafas_uae',
      desc: 'Get the latest UAE health alpha',
      type: 'social'
    },
    { 
      id: 'join_tg', 
      title: 'Join The Tribe', 
      reward: 50, 
      icon: <Send className="text-blue-400" />, 
      link: 'https://t.me/NafasUAE',
      desc: 'Connect with 5k+ Protocol members',
      type: 'social'
    },
    { 
      id: 'connect_wallet', 
      title: 'Sync TON Wallet', 
      reward: 150, 
      icon: <Wallet className="text-emerald-500" />,
      desc: 'Identity verification for $NAF drops',
      type: 'web3'
    },
  ];

  const handleTask = (task: any) => {
    if (tasks[task.id]) return;
    
    // Premium tactile response
    try {
        TelegramWebApp.HapticFeedback.notificationOccurred('success');
    } catch(e) {}

    if (task.link) {
      TelegramWebApp.openLink(task.link);
      // Simulate verification period (3 seconds)
      setTimeout(() => {
        completeTask(task.id, task.reward);
      }, 3000);
    } else {
      completeTask(task.id, task.reward);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto pb-32">
      
      {/* 1. VAULT HEADER */}
      <div className="flex items-center justify-between mb-10 pt-6 px-1">
        <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                <span className="italic">💰 EARN</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                Protocol Value Indexing
            </p>
        </div>
        <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-slate-900 text-white px-5 py-3 rounded-[1.8rem] flex flex-col items-end shadow-2xl border-t border-white/10"
        >
            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">Total Mining</span>
            <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-emerald-400 fill-emerald-400" />
                <span className="font-black text-xl leading-none">{xp}</span>
            </div>
        </motion.div>
      </div>

      {/* 2. DAILY MULTIPLIER CARD */}
      <AnimatePresence>
        {!tasks['daily_checkin'] && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={() => handleTask(socialTasks[0])}
              className="mb-10 p-1 bg-gradient-to-br from-emerald-400 via-blue-500 to-indigo-600 rounded-[2.8rem] shadow-[0_20px_40px_rgba(16,185,129,0.2)] active:scale-95 transition-transform cursor-pointer"
            >
                <div className="bg-white/90 backdrop-blur-md rounded-[2.7rem] p-7 flex justify-between items-center border border-white/50">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-4xl shadow-inner animate-pulse">
                            🎁
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-xl leading-none uppercase italic">Daily Yield</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <Timer size={12} className="text-slate-400" />
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Resets at 00:00 GST</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-emerald-600 font-black text-2xl leading-none">+25</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase mt-1">XP</p>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* 3. SOCIAL & WEB3 QUESTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Mindfulness Quests</h4>
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Live Tasks</span>
            </div>
        </div>
        
        {socialTasks.slice(1).map((task) => (
          <motion.div 
            key={task.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTask(task)}
            className={`glass-card p-5 rounded-[2.2rem] flex items-center justify-between border-white/60 transition-all duration-500 ${
                tasks[task.id] 
                ? 'bg-emerald-50/40 border-emerald-200/50 opacity-50 grayscale' 
                : 'bg-white/40 hover:bg-white/60 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner border border-slate-50 text-xl">
                {task.icon}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight uppercase italic">{task.title}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{task.desc}</p>
                <div className="flex items-center gap-1.5 mt-2 bg-emerald-500/5 w-fit px-2 py-1 rounded-lg">
                    <Coins size={12} className="text-emerald-500" />
                    <p className="text-[11px] font-black text-emerald-600">+{task.reward} XP</p>
                </div>
              </div>
            </div>
            
            <div className="pr-1">
                {tasks[task.id] ? (
                  <div className="bg-emerald-500 text-white p-2.5 rounded-full shadow-lg">
                    <CheckCircle2 size={16} strokeWidth={4} />
                  </div>
                ) : (
                  <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border-t border-white/10">
                    <ArrowRight size={18} />
                  </div>
                )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 4. TGE (TOKEN GENERATION EVENT) TEASER */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-14 relative overflow-hidden bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-[0_30px_60px_rgba(0,0,0,0.3)] border-t border-white/10"
      >
         {/* Decorative logic */}
         <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[60px]" />
         <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[60px]" />

         <div className="relative z-10 text-center">
             <div className="bg-white/10 backdrop-blur-md w-fit mx-auto px-4 py-1 rounded-full mb-6 border border-white/10">
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400">Phase 1: Mining</p>
             </div>
             
             <h4 className="text-2xl font-black uppercase tracking-tighter italic mb-4 leading-tight">
                Your XP is your <br/> $NAF Allocation
             </h4>
             
             <p className="text-[11px] text-slate-400 font-medium leading-relaxed px-2 mb-8">
                Every XP point earned in Phase 1 will be indexed for the **UAE Protocol Airdrop**. 
                Conversion rates will be announced in Q3 2026.
             </p>

             <button 
                onClick={() => TelegramWebApp.openLink('https://nafas.io/whitepaper')}
                className="w-full bg-white text-slate-900 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2"
             >
                Read Whitepaper <ExternalLink size={12} />
             </button>
         </div>
      </motion.div>

      {/* Bottom Padding for the Nav Bar */}
      <div className="h-10" />

    </div>
  );
}
