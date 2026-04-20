'use client';

import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
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
  Timer,
  ExternalLink
} from 'lucide-react';
import TelegramWebApp from '@twa-dev/sdk';

export default function EarnContent() {
  const { xp, tasks, completeTask, isLoaded } = useWellnessData();

  if (!isLoaded) return null;

  const socialTasks = [
    { id: 'daily_checkin', title: 'Daily Protocol Access', reward: 25, icon: <Calendar className="text-blue-500" />, desc: 'Claim your daily consistency bonus' },
    { id: 'follow_x', title: 'Follow Nafas on X', reward: 100, icon: <XIcon className="text-slate-900" />, link: 'https://x.com/nafas_uae', desc: 'Get the latest UAE health alpha' },
    { id: 'join_tg', title: 'Join The Tribe', reward: 50, icon: <Send className="text-blue-400" />, link: 'https://t.me/NafasUAE', desc: 'Connect with 5k+ Protocol members' },
    { id: 'connect_wallet', title: 'Sync TON Wallet', reward: 150, icon: <Wallet className="text-emerald-500" />, desc: 'Identity verification for $NAF drops' },
  ];

  const handleTask = (task: any) => {
    if (tasks[task.id]) return;
    try { TelegramWebApp.HapticFeedback.notificationOccurred('success'); } catch(e) {}

    if (task.link) {
      TelegramWebApp.openLink(task.link);
      setTimeout(() => completeTask(task.id, task.reward), 3000);
    } else {
      completeTask(task.id, task.reward);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto pb-32">
      <div className="flex items-center justify-between mb-10 pt-6">
        <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">💰 EARN</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Protocol Value Index</p>
        </div>
        <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex flex-col items-end shadow-2xl">
            <span className="text-[8px] font-black text-emerald-400 uppercase">Balance</span>
            <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-emerald-400 fill-emerald-400" />
                <span className="font-black text-xl">{xp}</span>
            </div>
        </div>
      </div>

      <AnimatePresence>
        {!tasks['daily_checkin'] && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={() => handleTask(socialTasks[0])}
              className="mb-10 p-1 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-[2.8rem] shadow-xl active:scale-95 cursor-pointer"
            >
                <div className="bg-white/90 backdrop-blur-md rounded-[2.7rem] p-7 flex justify-between items-center">
                    <div className="flex items-center gap-5">
                        <div className="text-4xl animate-bounce">🎁</div>
                        <div>
                            <h3 className="font-black text-slate-900 text-xl leading-none uppercase italic">Daily Yield</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Tap to Claim +25 XP</p>
                        </div>
                    </div>
                    <ArrowRight className="text-emerald-500" />
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {socialTasks.slice(1).map((task) => (
          <motion.div 
            key={task.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTask(task)}
            className={`glass-card p-5 rounded-[2.2rem] flex items-center justify-between border-white/60 transition-all ${tasks[task.id] ? 'opacity-40 grayscale' : ''}`}
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner border border-slate-50 text-xl">{task.icon}</div>
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight uppercase italic">{task.title}</h3>
                <div className="flex items-center gap-1.5 mt-2 bg-emerald-500/5 w-fit px-2 py-1 rounded-lg">
                    <Coins size={12} className="text-emerald-500" />
                    <p className="text-[11px] font-black text-emerald-600">+{task.reward} XP</p>
                </div>
              </div>
            </div>
            {tasks[task.id] ? <CheckCircle2 className="text-emerald-500" size={24} /> : <div className="bg-slate-900 text-white p-3 rounded-2xl"><ArrowRight size={18} /></div>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
