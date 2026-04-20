'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Zap, Sparkles, User, Globe, Loader2, Navigation, 
  Footprints, Timer, Play, CheckCircle2, ChevronRight,
  Wind, MapPin, Camera, Image as ImageIcon
} from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useWellnessData } from '@/hooks/useWellnessData';

// Modals/Components (We will create these next)
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
  
  // Real-time tracking refs
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = TelegramWebApp;
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) setUser(tg.initDataUnsafe.user);

      // API Call for nearby
      fetch(`${API_URL}/nearby`).then(res => res.json()).then(data => setNearby(data.spots || []));

      // Android Step Counter API (Mocking sensor logic via DeviceMotion for Web compatibility)
      if (isTracking && (activeTab === 'walk' || activeTab === 'run')) {
        const handleMotion = (event: DeviceMotionEvent) => {
          const acc = event.accelerationIncludingGravity;
          if (acc && acc.y && acc.y > 12) { // Sensitivity threshold
            setSteps(s => s + 1);
            setDistance(d => d + 0.0008); // Approx km per step
          }
        };
        window.addEventListener('devicemotion', handleMotion);
        return () => window.removeEventListener('devicemotion', handleMotion);
      }
    }
  }, [isTracking, activeTab]);

  const startTracking = () => {
    startTimeRef.current = Date.now();
    setIsTracking(true);
    TelegramWebApp.HapticFeedback.notificationOccurred('success');
  };

  const stopTracking = () => {
    setIsTracking(false);
    const earnedXp = Math.floor(steps / 10) + 10;
    logActivity(activeTab as any, `${activeTab.toUpperCase()} Session`, earnedXp, `${distance.toFixed(2)} km`);
    setSteps(0);
    setDistance(0);
    alert(`Session Saved! You earned ${earnedXp} XP 🏆`);
  };

  if (!isLoaded) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>;

  return (
    <div className="relative min-h-screen w-full scrollbar-hide pb-32">
      
      {/* 1. INTERACTIVE TOP BAR */}
      <div className="p-6 flex justify-between items-center bg-white/40 backdrop-blur-xl sticky top-0 z-40 border-b border-white/10">
        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/profile')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl border-2 border-emerald-400 overflow-hidden shadow-lg bg-white">
            {user?.photo_url ? <img src={user.photo_url} alt="pfp" className="w-full h-full object-cover" /> : <User className="p-2 text-slate-400" />}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Self</p>
            <p className="text-xs font-black text-slate-900 leading-none">@{user?.username || 'Seeker'}</p>
          </div>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/profile?tab=wallet')}
          className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-2xl shadow-xl border-t border-white/10 cursor-pointer"
        >
          <div className="flex flex-col items-end">
            <p className="text-[8px] font-bold text-emerald-400 uppercase">Balance</p>
            <p className="text-sm font-black text-white leading-none">{xp} XP</p>
          </div>
          <div className={`w-3 h-3 rounded-full ${tonConnectUI.connected ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'}`} />
        </motion.div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* 2. REAL STREAK & VITALITY */}
        <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-[2rem] text-center border-white/40">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Current Streak</p>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-black text-slate-800">{streak}</span>
                    <span className="text-xl">🔥</span>
                </div>
            </div>
            <div className="glass-card p-4 rounded-[2rem] text-center border-white/40">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Vitality</p>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-black text-slate-800">{vitality}%</span>
                    <div className="w-2 h-8 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div animate={{ height: `${vitality}%` }} className="w-full bg-emerald-500 absolute bottom-0" />
                    </div>
                </div>
            </div>
        </div>

        {/* 3. ACTIVITY TABS */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
          {['breath', 'walk', 'run', 'yoga', 'meditation'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === t ? 'bg-slate-900 text-white shadow-xl' : 'bg-white/50 text-slate-500 border border-white/20'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* 4. DYNAMIC ACTIVITY CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card rounded-[2.5rem] p-8 border-white/60 shadow-2xl relative overflow-hidden"
          >
            {activeTab === 'breath' && (
              <div className="text-center py-6">
                <Wind className="mx-auto text-emerald-500 mb-4" size={48} />
                <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase italic">Box Breathing</h2>
                <p className="text-xs text-slate-500 mb-8 px-4 font-medium leading-relaxed">Reset your nervous system with a professional 4-4-4 rhythm.</p>
                <button onClick={() => setShowProtocol(true)} className="w-full bg-emerald-500 text-white py-5 rounded-[1.8rem] font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all">Begin Session</button>
              </div>
            )}

            {(activeTab === 'walk' || activeTab === 'run') && (
              <div className="text-center py-4">
                <div className="flex justify-around mb-8">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Distance</p>
                        <p className="text-3xl font-black text-slate-800">{distance.toFixed(2)}<span className="text-xs ml-1">KM</span></p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Steps</p>
                        <p className="text-3xl font-black text-slate-800">{steps}</p>
                    </div>
                </div>
                
                {isTracking ? (
                  <button onClick={stopTracking} className="w-full bg-rose-500 text-white py-6 rounded-[1.8rem] font-black text-sm uppercase tracking-widest animate-pulse">Finish & Claim XP</button>
                ) : (
                  <button onClick={startTracking} className="w-full bg-slate-900 text-white py-6 rounded-[1.8rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3">
                    <Play fill="white" size={18} /> Start Tracking
                  </button>
                )}
              </div>
            )}

            {activeTab === 'yoga' && (
              <div className="space-y-6">
                 <div className="rounded-3xl overflow-hidden h-40 bg-slate-100 border-2 border-white relative">
                    <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500" className="w-full h-full object-cover opacity-80" alt="yoga" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-4">
                        <h3 className="text-white font-black uppercase text-xs tracking-widest">Morning Sun Salutation</h3>
                    </div>
                 </div>
                 <div className="flex items-center justify-between">
                    <button className="flex-1 bg-white border border-slate-200 py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2"><Camera size={14}/> Add Photo</button>
                    <div className="w-4" />
                    <button onClick={() => alert("Yoga Flow Start")} className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20">Start Flow</button>
                 </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 5. NEARBY LIVE HUB */}
        <div className="glass-card rounded-[2.5rem] p-6">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-xs font-black flex items-center gap-2 text-slate-700 uppercase tracking-widest">
              <Globe size={14} className="text-blue-500" /> UAE Live Hub
            </h3>
            <button onClick={() => TelegramWebApp.openLink('https://www.google.com/maps/search/wellness')} className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl uppercase">Native Map</button>
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
            {nearby.map((spot, i) => (
              <div key={i} onClick={() => setSelectedSpot(spot)} className="flex items-center justify-between bg-white/40 p-4 rounded-[1.5rem] border border-white/20 active:scale-95 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600"><MapPin size={14} /></div>
                  <span className="text-xs font-bold text-slate-800">{spot.name}</span>
                </div>
                <ChevronRight size={14} className="text-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. FLOATING AI BUTTON */}
      <motion.div 
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push('/ai')}
        className="fixed bottom-28 right-6 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-emerald-400 z-50 cursor-pointer"
      >
        <Sparkles className="text-emerald-500" size={24} />
        <div className="absolute top-0 right-0 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showProtocol && <BreathProtocol onClose={() => setShowProtocol(false)} onComplete={(xp) => logActivity('breath', 'Box Breathing', xp)} />}
        {selectedSpot && <WellnessMap spot={selectedSpot} onClose={() => setSelectedSpot(null)} />}
      </AnimatePresence>
    </div>
  );
}
