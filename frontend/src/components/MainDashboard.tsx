'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Zap, Sparkles, User, Globe, Loader2, Navigation, 
  Footprints, Play, ChevronRight, Wind, MapPin, ExternalLink
} from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useWellnessData } from '@/hooks/useWellnessData';

import BreathProtocol from './BreathProtocol';
import WellnessMap from './WellnessMap';

const API_URL = "https://nafas-jur5.onrender.com";

export default function MainDashboard() {
  const router = useRouter();
  const [tonConnectUI] = useTonConnectUI();
  const { xp, vitality, streak, logActivity, isLoaded } = useWellnessData();
  
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'breath' | 'walk' | 'run' | 'yoga' | 'meditation'>('breath');
  const [nearby, setNearby] = useState<any[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [showProtocol, setShowProtocol] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const lastUpdate = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = TelegramWebApp;
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) setUser(tg.initDataUnsafe.user);

      fetch(`${API_URL}/nearby`).then(res => res.json()).then(data => setNearby(data.spots || [])).catch(() => setNearby([]));

      if (isTracking && (activeTab === 'walk' || activeTab === 'run')) {
        const handleMotion = (event: DeviceMotionEvent) => {
          const now = Date.now();
          if (now - lastUpdate.current < 150) return;
          const acc = event.accelerationIncludingGravity;
          if (acc && acc.y && Math.abs(acc.y) > 13) {
            setSteps(s => s + 1);
            setDistance(d => d + 0.0008);
            lastUpdate.current = now;
          }
        };
        window.addEventListener('devicemotion', handleMotion);
        return () => window.removeEventListener('devicemotion', handleMotion);
      }
    }
  }, [isTracking, activeTab]);

  if (!isLoaded) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-400" /></div>;

  return (
    <div className="relative min-h-screen w-full bg-transparent overflow-x-hidden pb-32">
      
      {/* 1. CLEAN TOP BAR */}
      <div className="p-6 flex justify-between items-center sticky top-0 z-40 bg-white/40 backdrop-blur-xl border-b border-white/20">
        <motion.div whileTap={{ scale: 0.95 }} onClick={() => router.push('/profile')} className="flex items-center gap-3 cursor-pointer">
          <div className="w-12 h-12 rounded-2xl border-2 border-emerald-400 overflow-hidden shadow-lg bg-white">
            {user?.photo_url ? <img src={user.photo_url} alt="pfp" className="w-full h-full object-cover" /> : <User className="p-2 text-slate-300" />}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Self</p>
            <p className="text-xs font-black text-slate-900 leading-none">@{user?.username || 'Seeker'}</p>
          </div>
        </motion.div>

        <motion.div whileTap={{ scale: 0.95 }} onClick={() => router.push('/profile?tab=wallet')} className="flex items-center gap-3 bg-slate-900 px-4 py-2.5 rounded-2xl shadow-xl cursor-pointer">
          <div className="text-right">
            <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-tighter">Balance</p>
            <p className="text-xs font-black text-white">{xp} XP</p>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full ${tonConnectUI.connected ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
        </motion.div>
      </div>

      <div className="p-6 space-y-6">
        {/* 2. STATS OVERVIEW */}
        <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-5 rounded-[2.2rem] text-center border-white/50">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Active Streak</p>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-black text-slate-800">{streak}</span>
                    <span className="text-xl">🔥</span>
                </div>
            </div>
            <div className="glass-card p-5 rounded-[2.2rem] border-white/50">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Vitality</p>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-slate-800">{vitality}%</span>
                    <div className="w-1.5 h-10 bg-slate-100 rounded-full relative overflow-hidden">
                        <motion.div animate={{ height: `${vitality}%` }} className="w-full bg-emerald-500 absolute bottom-0 shadow-[0_0_8px_#10b981]" />
                    </div>
                </div>
            </div>
        </div>

        {/* 3. ACTIVITY TABS */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
          {['breath', 'walk', 'run', 'yoga', 'meditation'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white/50 text-slate-400 border border-white/20'}`}>{t}</button>
          ))}
        </div>

        {/* 4. DYNAMIC ACTIVITY CARD */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card rounded-[2.8rem] p-8 border-white/60 shadow-2xl relative overflow-hidden min-h-[300px] flex flex-col justify-center">
            {activeTab === 'breath' && (
              <div className="text-center">
                <Wind className="mx-auto text-emerald-500 mb-4 animate-pulse" size={48} />
                <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase italic">Box Breathing</h2>
                <p className="text-[10px] text-slate-400 mb-8 font-bold uppercase tracking-[0.2em]">4-4-4 Rhythm • Neural Reset</p>
                <button onClick={() => setShowProtocol(true)} className="w-full bg-emerald-500 text-white py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">Begin session</button>
              </div>
            )}

            {(activeTab === 'walk' || activeTab === 'run') && (
              <div className="text-center">
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">KM</p>
                        <p className="text-3xl font-black text-slate-900">{distance.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Steps</p>
                        <p className="text-3xl font-black text-slate-900">{steps}</p>
                    </div>
                </div>
                <button onClick={isTracking ? stopTracking : startTracking} className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all ${isTracking ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900 text-white'}`}>
                    {isTracking ? 'Finish Protocol' : `Start ${activeTab}`}
                </button>
              </div>
            )}

            {activeTab === 'yoga' && (
              <div className="space-y-6">
                 <div className="rounded-[2rem] overflow-hidden h-40 bg-slate-100 border-2 border-white relative shadow-lg">
                    <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500" className="w-full h-full object-cover" alt="yoga" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <h3 className="text-white font-black uppercase text-xs tracking-widest italic">Morning Vinyasa Flow</h3>
                    </div>
                 </div>
                 <button className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"><Play size={14} fill="white"/> Start Session</button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 5. NEARBY HUB */}
        <div className="glass-card rounded-[2.5rem] p-6 shadow-sm border-white/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black flex items-center gap-2 text-slate-700 uppercase tracking-widest">
              <Globe size={14} className="text-blue-500" /> Live UAE Hub
            </h3>
          </div>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1 scrollbar-hide">
            {nearby.map((spot, i) => (
              <motion.div key={i} whileTap={{ scale: 0.98 }} onClick={() => setSelectedSpot(spot)} className="flex items-center justify-between bg-white/50 p-4 rounded-[1.6rem] border border-white/20 shadow-sm cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner"><MapPin size={16} /></div>
                  <div>
                    <span className="text-xs font-black text-slate-800 block leading-none mb-1">{spot.name}</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{spot.activity}</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. CLEAN FLOATING AI BUTTON */}
      <motion.div 
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push('/ai')}
        className="fixed bottom-28 right-6 w-16 h-16 bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-center border-4 border-emerald-400 z-50 cursor-pointer"
      >
        <Sparkles className="text-emerald-500" size={24} />
        <div className="absolute top-0 right-0 w-5 h-5 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full animate-ping" /></div>
      </motion.div>

      <AnimatePresence>
        {showProtocol && <BreathProtocol onClose={() => setShowProtocol(false)} onComplete={(earnedXp) => logActivity('breath', 'Box Breathing', earnedXp)} />}
        {selectedSpot && <WellnessMap spot={selectedSpot} onClose={() => setSelectedSpot(null)} />}
      </AnimatePresence>
    </div>
  );
}

function startTracking() { throw new Error('Function not implemented.'); }
function stopTracking() { throw new Error('Function not implemented.'); }
