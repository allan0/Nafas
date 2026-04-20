'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Trophy } from 'lucide-react';
import TelegramWebApp from '@twa-dev/sdk';

export default function BreathProtocol({ onClose, onComplete }: { onClose: () => void, onComplete: (xp: number) => void }) {
  const [phase, setPhase] = useState<'idle' | 'breathing' | 'finished'>('idle');
  const [timer, setTimer] = useState(5); // 5 cycles
  const [seconds, setSeconds] = useState(4);
  const [instruction, setInstruction] = useState('Ready?');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Safe Haptics
  const triggerHaptic = (type: 'light' | 'success') => {
    try {
      if (type === 'light') TelegramWebApp.HapticFeedback.impactOccurred('light');
      if (type === 'success') TelegramWebApp.HapticFeedback.notificationOccurred('success');
    } catch (e) { console.log("Haptics not supported"); }
  };

  useEffect(() => {
    if (phase === 'breathing') {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            if (instruction === 'Inhale') {
              setInstruction('Hold');
              triggerHaptic('light');
              return 4;
            } else if (instruction === 'Hold') {
              setInstruction('Exhale');
              triggerHaptic('light');
              return 4;
            } else {
              if (timer <= 1) {
                clearInterval(timerRef.current!);
                setPhase('finished');
                triggerHaptic('success');
                onComplete(50);
                return 0;
              }
              setTimer(t => t - 1);
              setInstruction('Inhale');
              triggerHaptic('light');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, instruction, timer]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-slate-900 flex flex-col items-center justify-center p-8 text-white"
    >
      <button onClick={onClose} className="absolute top-10 right-6 p-2 bg-white/10 rounded-full"><X /></button>

      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div key="idle" className="text-center">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 mx-auto animate-pulse">
                <span className="text-4xl">🌬️</span>
            </div>
            <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter">Box Breathing</h2>
            <p className="text-slate-400 text-sm mb-8 italic">4s In • 4s Hold • 4s Out</p>
            <button 
                onClick={() => { setPhase('breathing'); setInstruction('Inhale'); }} 
                className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30"
            >
              Start session
            </button>
          </motion.div>
        )}

        {phase === 'breathing' && (
          <motion.div key="active" className="text-center">
            <motion.div 
              animate={{ 
                scale: instruction === 'Inhale' ? [1, 1.4] : instruction === 'Exhale' ? [1.4, 1] : 1.4,
                boxShadow: instruction === 'Hold' ? "0 0 40px rgba(52, 211, 153, 0.3)" : "0 0 0px rgba(0,0,0,0)"
              }}
              transition={{ duration: 4, ease: "linear" }}
              className="w-56 h-56 border-2 border-emerald-400/50 rounded-full flex items-center justify-center mb-12 relative"
            >
              <div className="absolute inset-0 bg-emerald-400/10 rounded-full blur-xl" />
              <span className="text-7xl font-thin relative z-10">{seconds}</span>
            </motion.div>
            <h3 className="text-5xl font-black tracking-tighter uppercase mb-2">{instruction}</h3>
            <p className="text-emerald-400 font-bold uppercase tracking-[0.3em] text-[10px]">Cycle {6 - timer} of 5</p>
          </motion.div>
        )}

        {phase === 'finished' && (
          <motion.div key="done" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-3xl font-black mb-2">Well Done!</h2>
            <p className="text-emerald-400 font-bold mb-10 uppercase tracking-widest">+50 XP Earned</p>
            <button onClick={onClose} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest">Done</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
