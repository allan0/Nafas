'use client';
import { motion } from 'framer-motion';
import { useWellnessData } from '@/hooks/useWellnessData';
import { CheckCircle2, X as XIcon, Send, Calendar, Zap, ArrowRight, Wallet, Coins } from 'lucide-react';
import TelegramWebApp from '@twa-dev/sdk';

export default function EarnContent() {
  const { xp, tasks, completeTask, isLoaded } = useWellnessData();

  if (!isLoaded) return null; // Prevents mismatch between server/client HTML

  const socialTasks = [
    { id: 'daily_checkin', title: 'Daily Wellness Check-in', reward: 20, icon: <Calendar className="text-blue-500" /> },
    { id: 'follow_x', title: 'Follow Nafas on X', reward: 100, icon: <XIcon className="text-slate-900" />, link: 'https://x.com/nafas_uae' },
    { id: 'join_tg', title: 'Join Nafas Community', reward: 50, icon: <Send className="text-blue-400" />, link: 'https://t.me/NafasUAE' },
    { id: 'connect_wallet', title: 'Link TON Wallet', reward: 150, icon: <Wallet className="text-emerald-500" /> },
  ];

  const handleTask = (task: any) => {
    if (tasks[task.id]) return;
    TelegramWebApp.HapticFeedback.impactOccurred('light');
    if (task.link) {
      TelegramWebApp.openLink(task.link);
      setTimeout(() => completeTask(task.id, task.reward), 2000);
    } else {
      completeTask(task.id, task.reward);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto pb-32">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">💰 EARN</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Wellness Economy</p>
        </div>
        <div className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-xl border-t border-white/10">
          <Zap size={16} className="text-emerald-400 fill-emerald-400" />
          <span className="font-black text-lg">{xp}</span>
        </div>
      </div>

      <div className="space-y-4">
        {socialTasks.map((task) => (
          <motion.div 
            key={task.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTask(task)}
            className={`glass-card p-5 rounded-[2rem] flex items-center justify-between border-white/50 transition-all ${
              tasks[task.id] ? 'opacity-50 grayscale' : 'opacity-100'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">{task.icon}</div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">{task.title}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Coins size={12} className="text-emerald-500" />
                  <p className="text-xs font-black text-emerald-600">+{task.reward} XP</p>
                </div>
              </div>
            </div>
            {tasks[task.id] ? <CheckCircle2 className="text-emerald-500" /> : <div className="bg-slate-100 p-2 rounded-xl"><ArrowRight size={16} className="text-slate-400" /></div>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
