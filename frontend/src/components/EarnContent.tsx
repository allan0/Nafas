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
  Clock
} from 'lucide-react';
import TelegramWebApp from '@twa-dev/sdk';

export default function EarnContent() {
  const { xp, tasks, completeTask, isLoaded } = useWellnessData();

  if (!isLoaded) return null;

  const socialTasks = [
    { 
      id: 'daily_checkin', 
      title: 'Daily Protocol Check-in', 
      reward: 25, 
      icon: <Calendar className="text-blue-500" />,
      desc: 'Claim your daily mindfulness bonus'
    },
    { 
      id: 'follow_x', 
      title: 'Follow Nafas on X', 
      reward: 100, 
      icon: <XIcon className="text-slate-900" />, 
      link: 'https://x.com/nafas_uae',
      desc: 'Stay updated with UAE wellness news'
    },
    { 
      id: 'join_tg', 
      title: 'Join Tribe Community', 
      reward: 50, 
      icon: <Send className="text-blue-400" />, 
      link: 'https://t.me/NafasUAE',
      desc: 'Chat with other Protocol members'
    },
    { 
      id: 'connect_wallet', 
      title: 'Link TON Wallet', 
      reward: 150, 
      icon: <Wallet className="text-emerald-500" />,
      desc: 'Required for future $NAF airdrops'
    },
  ];

  const handleTask = (task: any) => {
    if (tasks[task.id]) return;
    
    // Premium Haptic feedback
    TelegramWebApp.HapticFeedback.impactOccurred('medium');

    if (task.link) {
      TelegramWebApp.openLink(task.link);
      // Simulate a "Verification" delay
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
      
      {/* 1. WEALTH HEADER */}
      <div className="flex items-center justify-between mb-10 pt-4">
        <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
                💰 EARN
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Mining Wellness Value</p>
        </div>
        <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-slate-900 text-white px-5 py-3 rounded-[1.8rem] flex flex-col items-end shadow-2xl border-t border-white/10"
        >
            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Global Balance</span>
            <div className="flex items-center gap-2">
                <Zap size={14} className="text-emerald-400 fill-emerald-400" />
                <span className="font-black text-xl">{xp}</span>
            </div>
        </motion.div>
      </div>

      {/* 2. FEATURED DAILY REWARD */}
      {!tasks['daily_checkin'] && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => handleTask(socialTasks[0])}
            className="mb-8 p-1 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-[2.5rem] shadow-xl active:scale-95 transition-transform cursor-pointer"
          >
              <div className="bg-white/90 backdrop-blur-md rounded-[2.4rem] p-6 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-3xl animate-bounce">
                          🎁
                      </div>
                      <div>
                          <h3 className="font-black text-slate-800 text-lg leading-none">Daily Bonus</h3>
                          <p className="text-xs text-slate-500 mt-1 font-medium">Resetting in 14h 22m</p>
                      </div>
                  </div>
                  <div className="text-right">
                      <p className="text-emerald-600 font-black text-xl">+25</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Claim</p>
                  </div>
              </div>
          </motion.div>
      )}

      {/* 3. SOCIAL QUESTS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Mindfulness Quests</h4>
            <div className="flex items-center gap-1">
                <Clock size={10} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Verified Live</span>
            </div>
        </div>
        
        {socialTasks.slice(1).map((task) => (
          <motion.div 
            key={task.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleTask(task)}
            className={`glass-card p-5 rounded-[2.2rem] flex items-center justify-between border-white/50 transition-all duration-500 ${
                tasks[task.id] 
                ? 'bg-emerald-50/40 border-emerald-200/50 opacity-60 grayscale' 
                : 'bg-white/40 hover:bg-white/60 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner border border-white/50 text-xl">
                {task.icon}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 leading-tight">{task.title}</h3>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{task.desc}</p>
                <div className="flex items-center gap-1.5 mt-2">
                    <Coins size={12} className="text-emerald-500" />
                    <p className="text-xs font-black text-emerald-600">+{task.reward} XP</p>
                </div>
              </div>
            </div>
            
            <div className="pr-1">
                {tasks[task.id] ? (
                  <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 size={16} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border-t border-white/10">
                    <ArrowRight size={16} />
                  </div>
                )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 4. PRE-TOKEN PHASE WARNING */}
      <div className="mt-12 bg-slate-900/5 rounded-[2.5rem] p-8 border border-dashed border-slate-300 text-center">
         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Zap size={20} className="text-amber-500 fill-amber-500" />
         </div>
         <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">XP Conversion Protocol</h5>
         <p className="text-[10px] text-slate-500 font-bold leading-relaxed px-4">
            Your accumulated XP is being indexed for the **$NAF Token Generation Event**. 
            Abusing the system will result in protocol blacklisting.
         </p>
      </div>

    </div>
  );
}
