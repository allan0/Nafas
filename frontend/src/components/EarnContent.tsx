'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWellnessData } from '@/hooks/useWellnessData';
import { 
  CheckCircle2, X as XIcon, Send, Calendar, Zap, 
  ArrowRight, Wallet, Coins, Plus, Video, 
  Trash2, Flame, Droplets, Brain, Cigarette, Info
} from 'lucide-react';
import TelegramWebApp from '@twa-dev/sdk';

export default function EarnContent() {
  const { 
    xp, tasks, completeTask, isLoaded, 
    healthProfile, dailyWater, dailyCigs 
  } = useWellnessData();

  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customGoal, setCustomGoal] = useState('');

  if (!isLoaded) return null;

  // --- TAILORED TASK LOGIC ---
  const protocolTasks = [
    { 
      id: 'daily_checkin', 
      title: 'Protocol Access', 
      reward: 20, 
      icon: <Calendar className="text-blue-500" />, 
      active: true,
      desc: 'Verify daily alignment'
    },
    { 
      id: 'reduce_smoke', 
      title: 'Combustion Control', 
      reward: 100, 
      icon: <Cigarette className="text-rose-500" />, 
      active: healthProfile.smokingHabit > 0,
      desc: `Limit to ${Math.max(0, healthProfile.smokingHabit - 2)} units today`
    },
    { 
      id: 'hydration_check', 
      title: 'Deep Hydration', 
      reward: 50, 
      icon: <Droplets className="text-sky-500" />, 
      active: dailyWater < 8,
      desc: 'Target: 8+ glasses today'
    }
  ];

  const handleGoLive = () => {
    TelegramWebApp.HapticFeedback.notificationOccurred('success');
    TelegramWebApp.showPopup({
      title: 'SocialFi Node',
      message: 'Initializing decentralized live stream. Prepare your wellness setup.',
      buttons: [{ id: 'start', type: 'default', text: 'Go Live Now' }]
    });
  };

  const handleAddCustomGoal = () => {
    if (!customGoal.trim()) return;
    completeTask(`custom_${Date.now()}`, 15);
    setCustomGoal('');
    setShowCustomInput(false);
    TelegramWebApp.HapticFeedback.impactOccurred('medium');
  };

  return (
    <div className="p-6 max-w-md mx-auto pb-32">
      
      {/* 1. VAULT HEADER */}
      <div className="flex items-center justify-between mb-8 pt-4">
        <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-emerald-500 decoration-4 underline-offset-4">VAULT</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Index Engagement Value</p>
        </div>
        <motion.div 
            whileTap={{ scale: 0.95 }}
            className="bg-slate-900 text-white px-5 py-3 rounded-[1.8rem] flex flex-col items-end shadow-2xl border-t border-white/10"
        >
            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">Mined Assets</span>
            <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-emerald-400 fill-emerald-400" />
                <span className="font-black text-xl leading-none">{xp}</span>
            </div>
        </motion.div>
      </div>

      {/* 2. SOCIAL-FI: GO LIVE PORTAL (REAL CTA) */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={handleGoLive}
        className="mb-10 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.8rem] text-white shadow-2xl group border border-white/5"
      >
         <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
            <Video size={80} />
         </div>
         <div className="relative z-10">
             <div className="flex items-center gap-2 mb-4 bg-rose-500/10 w-fit px-3 py-1 rounded-full border border-rose-500/20">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                <span className="text-[9px] font-black uppercase tracking-widest text-rose-400">Stream Protocol</span>
             </div>
             <h3 className="text-2xl font-black italic uppercase leading-none mb-2">Initialize Broadcast</h3>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter leading-relaxed mb-6">
                Host a real-time session & earn $NAF <br/> directly via Tribe tipping.
             </p>
             <button className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl">
                Open Camera Hub
             </button>
         </div>
      </motion.div>

      {/* 3. TAILORED QUESTS */}
      <div className="space-y-4 mb-10">
        <div className="flex justify-between items-center px-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tailored Protocols</p>
            <Info size={14} className="text-slate-300" />
        </div>
        
        {protocolTasks.filter(t => t.active).map((task) => (
          <motion.div 
            key={task.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => completeTask(task.id, task.reward)}
            className={`glass-card p-5 rounded-[2.2rem] flex items-center justify-between border-white/50 transition-all duration-500 ${
                tasks[task.id] 
                ? 'bg-emerald-50/30 opacity-40 grayscale' 
                : 'bg-white shadow-sm'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner border border-slate-100 text-xl">{task.icon}</div>
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight uppercase italic">{task.title}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{task.desc}</p>
                <div className="flex items-center gap-1.5 mt-2 bg-emerald-500/5 w-fit px-2 py-1 rounded-lg">
                    <Coins size={12} className="text-emerald-500" />
                    <p className="text-[11px] font-black text-emerald-600">+{task.reward} XP</p>
                </div>
              </div>
            </div>
            {tasks[task.id] ? <CheckCircle2 className="text-emerald-500" size={24} /> : <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-lg border-t border-white/20"><ArrowRight size={18} /></div>}
          </motion.div>
        ))}
      </div>

      {/* 4. CUSTOM TASK ARCHITECT */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">External Protocols</p>
            <button 
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1 hover:underline"
            >
                <Plus size={14} /> Create Task
            </button>
        </div>

        <AnimatePresence>
            {showCustomInput && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="glass-card p-6 rounded-[2.5rem] border-emerald-200 shadow-2xl bg-emerald-50/30">
                        <label className="text-[9px] font-black uppercase text-emerald-600 mb-2 block ml-2">Protocol Goal</label>
                        <input 
                            value={customGoal}
                            onChange={(e) => setCustomGoal(e.target.value)}
                            placeholder="e.g. Eat 2 apples today"
                            className="w-full p-5 bg-white rounded-3xl border-none outline-none text-sm font-bold mb-4 shadow-inner"
                        />
                        <button 
                            onClick={handleAddCustomGoal}
                            className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                        >
                            Commit to Protocol
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="bg-slate-900/5 rounded-[2.5rem] p-8 border border-dashed border-slate-300 text-center">
            <Brain size={32} className="mx-auto text-slate-300 mb-4" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                Nafas Neural Network indexes <br/> manual tasks to adapt your profile.
            </p>
        </div>
      </div>
    </div>
  );
}
