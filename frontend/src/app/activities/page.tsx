'use client';

import { motion } from 'framer-motion';
import { useWellnessData } from '@/hooks/useWellnessData';
import { 
  CheckCircle2, 
  X as XIcon, // Renamed to avoid confusion with the close icon
  Send, 
  Calendar, 
  Zap, 
  ArrowRight, 
  Wallet,
  Coins
} from 'lucide-react';
import TelegramWebApp from '@twa-dev/sdk';

export default function EarnPage() {
  const { xp, tasks, completeTask } = useWellnessData();

  // Social tasks for the UAE audience
  const socialTasks = [
    { 
        id: 'daily_checkin', 
        title: 'Daily Wellness Check-in', 
        reward: 20, 
        icon: <Calendar className="text-blue-500" />, 
        type: 'daily' 
    },
    { 
        id: 'follow_x', 
        title: 'Follow Nafas on X', 
        reward: 100, 
        icon: <XIcon className="text-slate-900" />, 
        link: 'https://x.com/nafas_uae' 
    },
    { 
        id: 'join_tg', 
        title: 'Join Nafas Community', 
        reward: 50, 
        icon: <Send className="text-blue-400" />, 
        link: 'https://t.me/NafasUAE' 
    },
    { 
        id: 'connect_wallet', 
        title: 'Link TON Wallet', 
        reward: 150, 
        icon: <Wallet className="text-emerald-500" />, 
        type: 'wallet' 
    },
  ];

  const handleTask = (task: any) => {
    if (tasks[task.id]) return;
    
    // Immediate haptic feedback for the click
    TelegramWebApp.HapticFeedback.impactOccurred('light');

    if (task.link) {
      TelegramWebApp.openLink(task.link);
      // Simulate verification period
      setTimeout(() => {
        completeTask(task.id, task.reward);
        TelegramWebApp.HapticFeedback.notificationOccurred('success');
      }, 3000);
    } else {
      completeTask(task.id, task.reward);
      TelegramWebApp.HapticFeedback.notificationOccurred('success');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto pb-32">
      
      {/* Dynamic Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">💰 Earn</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Accumulate Wellness Value</p>
        </div>
        <div className="bg-slate-900 text-white px-5 py-2.5 rounded-[1.5rem] flex items-center gap-2 shadow-xl border-t border-white/10">
            <Zap size={16} className="text-emerald-400 fill-emerald-400" />
            <span className="font-black text-lg">{xp}</span>
        </div>
      </div>

      {/* Task Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Social Quests</p>
            <p className="text-[10px] font-bold text-emerald-600 uppercase">New tasks daily</p>
        </div>
        
        {socialTasks.map((task) => (
          <motion.div 
            key={task.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleTask(task)}
            className={`glass-card p-5 rounded-[2.2rem] flex items-center justify-between border-white/60 transition-all duration-500 ${
                tasks[task.id] 
                ? 'bg-emerald-50/50 border-emerald-200/50 opacity-70' 
                : 'bg-white/40 hover:bg-white/60 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner border border-white/50">
                {task.icon}
              </div>
              <div>
                <h3 className="text-[15px] font-black text-slate-800 leading-tight">{task.title}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                    <Coins size={12} className="text-emerald-500" />
                    <p className="text-xs font-black text-emerald-600">+{task.reward} XP</p>
                </div>
              </div>
            </div>
            
            <div className="pr-2">
                {tasks[task.id] ? (
                  <div className="bg-emerald-500 text-white p-1.5 rounded-full">
                    <CheckCircle2 size={18} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="bg-slate-900 text-white p-2.5 rounded-2xl shadow-lg">
                    <ArrowRight size={18} />
                  </div>
                )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rewards Teaser Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 relative overflow-hidden bg-gradient-to-br from-emerald-500 to-blue-600 p-8 rounded-[2.8rem] text-white shadow-2xl"
      >
         <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
         <div className="relative z-10 text-center">
             <span className="text-4xl mb-4 block animate-bounce">🎁</span>
             <h4 className="text-lg font-black uppercase tracking-widest mb-2">Token Generation Event</h4>
             <p className="text-[10px] text-emerald-100 font-bold leading-relaxed uppercase opacity-80">
                In Phase 2, your total XP will determine your <br/> $NAF token Airdrop allocation.
             </p>
             <div className="mt-6 bg-white/20 backdrop-blur-md py-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter">
                Keep checking in to maximize your share
             </div>
         </div>
      </motion.div>

    </div>
  );
}
