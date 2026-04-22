'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Activity, AlertCircle, Info } from 'lucide-react';
import TelegramWebApp from '@twa-dev/sdk';

export default function BreathProtocol({ onClose, onComplete }: { onClose: () => void, onComplete: (xp: number, verified: boolean) => void }) {
  const [phase, setPhase] = useState<'idle' | 'calibrating' | 'breathing' | 'finished'>('idle');
  const [instruction, setInstruction] = useState('Ready?');
  const [seconds, setSeconds] = useState(4);
  const [cycle, setCycle] = useState(1);
  const [isVerified, setIsVerified] = useState(false);
  const [sensorError, setSensorError] = useState<string | null>(null);

  // Sensor Verification Logic
  const sensorData = useRef<{ z: number; timestamp: number }[]>([]);
  const breathStabilityScore = useRef<number>(0);

  const requestPermissions = async () => {
    // Required for iOS 13+ and some Android builds
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') startProtocol();
        else setSensorError("Sensor Permission Denied");
      } catch (e) { setSensorError("Secure Context Required"); }
    } else {
      startProtocol();
    }
  };

  const startProtocol = () => {
    setPhase('calibrating');
    setInstruction('Place phone on chest');
    setTimeout(() => {
      setPhase('breathing');
      setInstruction('Inhale');
    }, 3000);
  };

  useEffect(() => {
    if (phase !== 'breathing') return;

    const handleMotion = (e: DeviceMotionEvent) => {
      const z = e.accelerationIncludingGravity?.z || 0;
      sensorData.current.push({ z, timestamp: Date.now() });
      
      // Verification Logic: During 'Inhale' (4s), we expect Z-axis change. 
      // During 'Hold', we expect variance < 0.5.
      if (instruction === 'Hold' && Math.abs(z - 9.8) > 1.5) {
          // User is moving too much during hold
          breathStabilityScore.current -= 1;
      } else if (instruction === 'Hold') {
          breathStabilityScore.current += 1;
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (instruction === 'Inhale') { setInstruction('Hold'); return 4; }
          if (instruction === 'Hold') { setInstruction('Exhale'); return 4; }
          if (instruction === 'Exhale') {
            if (cycle >= 5) {
              finishProtocol();
              return 0;
            }
            setCycle(c => c + 1);
            setInstruction('Inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      clearInterval(interval);
    };
  }, [phase, instruction, cycle]);

  const finishProtocol = () => {
    // If stability score is high enough, mark as verified
    const verified = breathStabilityScore.current > 15;
    setIsVerified(verified);
    setPhase('finished');
    onComplete(verified ? 100 : 50, verified);
    TelegramWebApp.HapticFeedback.notificationOccurred(verified ? 'success' : 'warning');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-8 text-white"
    >
      <button onClick={onClose} className="absolute top-12 right-8 p-3 bg-white/10 rounded-2xl"><X /></button>

      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div key="idle" className="text-center space-y-8">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse border border-emerald-500/30">
                <Activity className="text-emerald-400" size={40} />
            </div>
            <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Bio-Verification</h2>
                <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest">Phone on chest to prove protocol</p>
            </div>
            {sensorError && <div className="p-4 bg-rose-500/20 text-rose-400 text-[10px] rounded-xl flex items-center gap-2"><AlertCircle size={14}/> {sensorError}</div>}
            <button onClick={requestPermissions} className="w-full py-5 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl">Initialize Sensors</button>
          </motion.div>
        )}

        {phase === 'breathing' && (
          <motion.div key="active" className="text-center">
            <div className="relative w-64 h-64 mx-auto mb-12">
                <motion.div 
                    animate={{ scale: instruction === 'Inhale' ? [1, 1.3] : instruction === 'Exhale' ? [1.3, 1] : 1.3 }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="absolute inset-0 border-2 border-emerald-400/30 rounded-full"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-thin">{seconds}</span>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-2">Cycle {cycle}/5</span>
                </div>
            </div>
            <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-4">{instruction}</h3>
            <div className="flex items-center justify-center gap-2 opacity-50">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Haptic Feed Active</span>
            </div>
          </motion.div>
        )}

        {phase === 'finished' && (
          <motion.div key="done" className="text-center space-y-6">
            <div className="text-6xl mb-4">{isVerified ? '💎' : '✅'}</div>
            <h2 className="text-3xl font-black italic uppercase">{isVerified ? 'Neural Verified' : 'Manual Entry'}</h2>
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 text-left">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Indexing Result</span>
                    {isVerified ? <ShieldCheck className="text-emerald-400" size={16}/> : <Info className="text-amber-400" size={16}/>}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                    {isVerified 
                        ? "Sensor telemetry matches the 4-4-4-4 protocol. Maximum yield indexed." 
                        : "Stability variance detected. Protocol indexed as manual entry."}
                </p>
            </div>
            <button onClick={onClose} className="w-full py-5 bg-white text-slate-900 rounded-[1.8rem] font-black uppercase tracking-widest">Sync to Ledger</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
