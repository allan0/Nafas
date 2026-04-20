'use client';
import { motion } from 'framer-motion';
import { useWellnessData } from '@/hooks/useWellnessData';
import { CheckCircle2, Twitter, Send, Calendar, Zap, ArrowRight, Wallet } from 'lucide-react';
import TelegramWebApp from '@twa-dev/sdk';

export default function EarnPage() {
  const { xp, tasks, completeTask } = useWellnessData();

  const socialTasks = [
    { id: 'daily_checkin', title: 'Daily Wellness Check-in', reward: 20, icon: <Calendar className="text-blue-500" />, type: 'daily' },
    { id: 'follow_x', title: 'Follow Nafas on X', reward: 100, icon: <Twitter className="text-sky-500" />, link: 'https://x.com/nafas_uae' },
    { id: 'join_tg', title: 'Join Nafas Community', reward: 50, icon: <Send className="text-blue-400" />, link: 'https://t.me/NafasUAE' },
    { id: 'connect_wallet', title: 'Connect TON Wallet', reward: 150, icon: <Wallet className="text-emerald-500" />, type: 'wallet' },
  ];

  const handleTask = (task: any) => {
    if (tasks[task.id]) return;
    
    if (task.link) {
      TelegramWebApp.openLink(task.link);
      // Simulate verification - in real app, backend checks API
      setTimeout(() => {
        completeTask(task.id, task.reward);
        TelegramWebApp.HapticFeedback.notificationOccurred('success');
      }, 2000);
    } else {
      completeTask(task.id, task.reward);
      TelegramWebApp.HapticFeedback.notificationOccurred('success');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto pb-32">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">💰 Earn</h1>
        <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl flex items-center gap-2">
            <Zap size={14} className="text-emerald-400 fill-emerald-400" />
            <span className="font-bold">{xp} XP</span>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Wellness Quests</p>
        
        {socialTasks.map((task) => (
          <motion.div 
            key={task.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTask(task)}
            className={`glass-card p-5 rounded-[2rem] flex items-center justify-between border-white/50 transition-all ${tasks[task.id] ? 'opacity-60' : 'opacity-100'}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                {task.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">{task.title}</h3>
                <p className="text-xs font-black text-emerald-600">+{task.reward} XP</p>
              </div>
            </div>
            
            {tasks[task.id] ? (
              <CheckCircle2 className="text-emerald-500" />
            ) : (
              <div className="bg-slate-900 text-white p-2 rounded-xl">
                <ArrowRight size={16} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-10 bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2.5rem] text-center">
         <span className="text-3xl mb-2 block">🎁</span>
         <h4 className="text-sm font-black text-emerald-800 uppercase tracking-widest">Rewards Coming</h4>
         <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase">Convert XP to $NAF tokens in Phase 2</p>
      </div>
    </div>
  );
}
