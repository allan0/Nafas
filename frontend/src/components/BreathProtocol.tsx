'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, RotateCcw, Trophy, Volume2 } from 'lucide-react';
import TelegramWebApp from '@twa-dev/sdk';

export default function BreathProtocol({ onClose, onComplete }: { onClose: () => void, onComplete: (xp: number) => void }) {
  const [phase, setPhase] = useState<'idle' | 'breathing' | 'finished'>('idle');
  const [timer, setTimer] = useState(5); // 5 cycles
  const [seconds, setSeconds] = useState(4);
  const [instruction, setInstruction] = useState('Ready?');

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let interval: any;
    if (phase === 'breathing' && timer > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 1) {
            if (instruction === 'Inhale') {
              setInstruction('Hold');
              speak("Hold");
              return 4;
            } else if (instruction === 'Hold') {
              setInstruction('Exhale');
              speak("Exhale");
              return 4;
            } else {
              setTimer(t => t - 1);
              if (timer > 1) {
                setInstruction('Inhale');
                speak("Inhale");
                return 4;
              }
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timer === 0 && phase === 'breathing') {
      setPhase('finished');
      TelegramWebApp.HapticFeedback.notificationOccurred('success');
      onComplete(50); // Award 50 XP
    }
    return () => clearInterval(interval);
  }, [phase, seconds, timer, instruction]);

  const startProtocol = () => {
    setPhase('breathing');
    setInstruction('Inhale');
    speak("Inhale through your nose");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-slate-900 flex flex-col items-center justify-center p-8 text-white"
    >
      <button onClick={onClose} className="absolute top-10 right-6 p-2 bg-white/10 rounded-full"><X /></button>

      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div key="idle" className="text-center">
            <h2 className="text-3xl font-light mb-8 uppercase tracking-widest">Box Breath</h2>
            <button onClick={startProtocol} className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50">
              <Play fill="white" size={32} />
            </button>
          </motion.div>
        )}

        {phase === 'breathing' && (
          <motion.div key="active" className="text-center">
            <motion.div 
              animate={{ scale: instruction === 'Inhale' ? [1, 1.5] : instruction === 'Exhale' ? [1.5, 1] : 1.5 }}
              transition={{ duration: 4, ease: "linear" }}
              className="w-48 h-48 border-4 border-emerald-400 rounded-full flex items-center justify-center mb-12"
            >
              <span className="text-5xl font-bold">{seconds}</span>
            </motion.div>
            <h3 className="text-4xl font-light tracking-widest uppercase">{instruction}</h3>
            <p className="mt-4 text-slate-400">Cycle {6 - timer} of 5</p>
          </motion.div>
        )}

        {phase === 'finished' && (
          <motion.div key="done" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
            <Trophy size={80} className="text-amber-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-2">Protocol Complete!</h2>
            <p className="text-emerald-400 font-bold mb-8">+50 XP EARNED</p>
            <button onClick={onClose} className="bg-white text-slate-900 px-12 py-4 rounded-2xl font-bold">Return Home</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
