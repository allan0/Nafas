'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { 
  Zap, Sparkles, User, Globe, Loader2, Navigation, 
  Play, ChevronRight, Wind, MapPin, 
  Target, Info, Activity, X, CheckCircle2,
  Compass, ArrowRight, Camera, ExternalLink, Timer,
  Droplets, Cigarette, Brain, ShieldCheck, Flame, 
  TrendingUp, Ruler
} from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWellnessData } from '@/hooks/useWellnessData';

// Shared Modal Components
import BreathProtocol from './BreathProtocol';
import WellnessMap from './WellnessMap';

const UAE_LOCATIONS = [
  { name: "Kite Beach", lat: 25.164, lng: 55.201, type: "Beach/Sports" },
  { name: "Al Qudra Loop", lat: 24.83, lng: 55.37, type: "Cycling/Run" },
  { name: "Marina Walk", lat: 25.068, lng: 55.13, type: "Running" },
  { name: "Hamdan Pool", lat: 25.043, lng: 55.312, type: "Swimming" },
  { name: "Mushrif Forest", lat: 25.215, lng: 55.454, type: "Walking" },
  { name: "JBR Hub", lat: 25.071, lng: 55.135, type: "Fitness" }
];

export default function MainDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tonConnectUI] = useTonConnectUI();
  
  // Pulling Global Bio-Data & Habits
  const { 
    xp, streak, habits, healthProfile, 
    logActivity, isLoaded, userCoords, setUserCoords 
  } = useWellnessData();
  
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'breath' | 'walk' | 'run' | 'yoga'>('breath');
  const [nearby, setNearby] = useState<any[]>([]);
  const [showProtocol, setShowProtocol] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);

  // --- BIO-SENSOR ENGINE STATE ---
  const [isTracking, setIsTracking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [cadence, setCadence] = useState(0); // Steps Per Minute
  const accelRef = useRef<number>(0);
  const lastStepTime = useRef<number>(Date.now());

  // --- DYNAMIC VITALITY INDEX (Logic based on User Data) ---
  const vitalityIndex = useMemo(() => {
    let score = 75; // Baseline
    // Hydration Bonus
    if (habits.dailyWater >= 8) score += 15;
    else if (habits.dailyWater >= 4) score += 5;
    // Combustion Penalty
    if (habits.dailyCigs > 10) score -= 20;
    else if (habits.dailyCigs > 0) score -= 10;
    else score += 10; // Smoke-free bonus
    // Movement Bonus
    if (steps > 5000) score += 10;
    return Math.min(100, Math.max(0, score));
  }, [habits, steps]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) setActiveTab(tabParam as any);

    if (typeof window !== 'undefined') {
      const tg = TelegramWebApp;
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) setUser(tg.initDataUnsafe.user);

      // 1. GEOLOCATION PROTOCOL
      if (!userCoords) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCoords(c);
          runProximityFilter(c.lat, c.lng);
        });
      }

      // 2. NEURAL ACCELEROMETER ENGINE
      if (isTracking && (activeTab === 'walk' || activeTab === 'run')) {
        const handleMotion = (e: DeviceMotionEvent) => {
          const acc = e.accelerationIncludingGravity;
          if (!acc) return;
          
          const magnitude = Math.sqrt(acc.x!**2 + acc.y!**2 + acc.z!**2);
          const delta = Math.abs(magnitude - accelRef.current);

          // Threshold for a step (Adaptive to UAE gait patterns)
          if (delta > 13.8) { 
            const now = Date.now();
            const timeDiff = (now - lastStepTime.current) / 1000;
            
            // Cadence filter (Proves rhythmic activity)
            const currentCadence = 60 / timeDiff;
            if (currentCadence > 45 && currentCadence < 210) {
              setSteps(s => s + 1);
              setCadence(Math.round(currentCadence));

              // BIO-CALCULATION: Distance based on User Height from Settings
              const userHeightCm = parseFloat(healthProfile.height) || 170;
              const heightM = userHeightCm / 100;
              // Stride multipliers: Walk (~0.415), Run (~1.14)
              const strideFactor = activeTab === 'run' ? 1.14 : 0.415;
              const strideMeters = heightM * strideFactor;
              
              setDistance(d => d + (strideMeters / 1000)); // Adds KM
              lastStepTime.current = now;

              // Periodic Haptic Feedback (Every 100 steps)
              if (steps % 100 === 0) tg.HapticFeedback.impactOccurred('light');
            }
          }
          accelRef.current = magnitude;
        };

        window.addEventListener('devicemotion', handleMotion);
        return () => window.removeEventListener('devicemotion', handleMotion);
      }
    }
  }, [isTracking, activeTab, userCoords, setUserCoords, searchParams, healthProfile.height, steps]);

  const runProximityFilter = (lat: number, lng: number) => {
    const getDist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Earth radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    const hubs = UAE_LOCATIONS.map(h => ({ ...h, dist: getDist(lat, lng, h.lat, h.lng) }))
                               .sort((a, b) => a.dist - b.dist)
                               .slice(0, 3);
    setNearby(hubs);
  };

  const finalizeSession = () => {
    const earnedXp = Math.floor(steps / 20) + 50;
    logActivity(activeTab as any, `${activeTab.toUpperCase()} Protocol`, earnedXp, `${distance.toFixed(2)} km`);
    setIsTracking(false);
    setSteps(0);
    setDistance(0);
    TelegramWebApp.HapticFeedback.notificationOccurred('success');
  };

  if (!isLoaded) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-400" /></div>;

  return (
    <div className="relative min-h-screen w-full bg-transparent overflow-x-hidden pb-44">
      
      {/* 1. TOP NEURAL NAVIGATION */}
      <div className="p-6 flex justify-between items-center sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <motion.div whileTap={{ scale: 0.95 }} onClick={() => router.push('/profile')} className="flex items-center gap-3 cursor-pointer">
          <div className="w-12 h-12 rounded-2xl border-2 border-emerald-400 overflow-hidden shadow-lg bg-slate-900 flex items-center justify-center">
            {user?.photo_url ? <img src={user.photo_url} alt="pfp" className="w-full h-full object-cover" /> : <span className="text-white font-black italic">N</span>}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-900 uppercase leading-none italic">@{user?.username || 'Seeker'}</p>
            <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Bio-Twin Linked</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
            whileTap={{ scale: 0.95 }} 
            onClick={() => router.push('/profile?tab=wallet')}
            className="bg-slate-900 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 cursor-pointer"
        >
          <div className="text-right">
            <p className="text-[7px] font-bold text-emerald-400 uppercase leading-none mb-1 italic">Ledger</p>
            <p className="text-xs font-black text-white leading-none">{xp} XP</p>
          </div>
          <Zap size={14} className={tonConnectUI.connected ? "text-emerald-400 fill-emerald-400" : "text-slate-500"} />
        </motion.div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* 2. VITALITY INDEX CARD (The Core Health UI) */}
        <div className="glass-card rounded-[3rem] p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden shadow-2xl">
            <Brain className="absolute -bottom-6 -right-6 text-emerald-500 opacity-10" size={160} />
            
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Activity size={12} className="text-emerald-400" />
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] italic">Vitality Index</span>
                    </div>
                    <h2 className="text-6xl font-black italic tracking-tighter">{vitalityIndex}%</h2>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stability</p>
                    <div className="flex items-center gap-1 justify-end text-orange-400">
                        <Flame size={18} fill="currentColor" />
                        <span className="text-xl font-black italic">{streak}d</span>
                    </div>
                </div>
            </div>

            {/* Real-time Habit Progress */}
            <div className="mt-10 space-y-5 relative z-10">
                <div className="space-y-2">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                        <span className="flex items-center gap-1 text-blue-400"><Droplets size={10} /> Hydration Alignment</span>
                        <span>{habits.dailyWater}/8 Units</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${(habits.dailyWater / 8) * 100}%` }} 
                            className="h-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]" 
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                        <span className="flex items-center gap-1 text-rose-400"><Cigarette size={10} /> Combustion Index</span>
                        <span className={habits.dailyCigs > 10 ? "text-rose-500" : "text-emerald-400"}>
                            {habits.dailyCigs === 0 ? 'CLEAN' : `${habits.dailyCigs} Units`}
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${Math.min(100, (habits.dailyCigs / 20) * 100)}%` }} 
                            className="h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" 
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* 3. NEURAL ACTIVITY LAB */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
          {['breath', 'walk', 'run', 'yoga'].map((t) => (
            <button 
                key={t} 
                onClick={() => {
                    if(!isTracking) setActiveTab(t as any);
                    TelegramWebApp.HapticFeedback.selectionChanged();
                }} 
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white/60 text-slate-400 border border-white/20'}`}
            >
                {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
            className="glass-card rounded-[3rem] p-8 border-white/60 shadow-2xl min-h-[380px] flex flex-col justify-center bg-white/30 backdrop-blur-md"
          >
            
            {activeTab === 'breath' && (
              <div className="text-center">
                <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-emerald-100">
                    <Wind className="text-emerald-500 animate-pulse" size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter leading-none">Box Breath</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-12 italic px-8">Reset CNS via 4-4-4-4 Telemetry</p>
                <button 
                    onClick={() => setShowProtocol(true)} 
                    className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
                >
                    Initialize Sensor Sync
                </button>
              </div>
            )}

            {(activeTab === 'walk' || activeTab === 'run') && (
              <div className="text-center">
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/50 p-6 rounded-[2.2rem] shadow-inner border border-white/60">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Neural KM</p>
                        <p className="text-4xl font-black text-slate-900 leading-none">{distance.toFixed(3)}</p>
                    </div>
                    <div className="bg-white/50 p-6 rounded-[2.2rem] shadow-inner border border-white/60">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Verified Steps</p>
                        <p className="text-4xl font-black text-slate-900 leading-none">{steps}</p>
                    </div>
                </div>

                {isTracking && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-6 mb-8 text-emerald-600 bg-emerald-50/50 py-4 rounded-3xl border border-emerald-100"
                    >
                        <div className="text-center">
                            <p className="text-[8px] font-black uppercase">Cadence</p>
                            <p className="text-lg font-black">{cadence} <span className="text-[8px]">SPM</span></p>
                        </div>
                        <div className="w-px h-8 bg-emerald-200" />
                        <div className="text-center">
                            <p className="text-[8px] font-black uppercase">Pace</p>
                            <p className="text-lg font-black">{distance > 0 ? (steps / 10).toFixed(1) : '0.0'} <span className="text-[8px]">M/S</span></p>
                        </div>
                    </motion.div>
                )}

                <button 
                    onClick={() => isTracking ? finalizeSession() : setIsTracking(true)} 
                    className={`w-full py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all ${isTracking ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900 text-white'}`}
                >
                    {isTracking ? 'Terminate & Index XP' : `Initialize ${activeTab}`}
                </button>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
                    <Ruler size={12} />
                    <p className="text-[8px] font-bold uppercase tracking-tighter">
                        Calibrated to {healthProfile.height}cm Stature
                    </p>
                </div>
              </div>
            )}

            {activeTab === 'yoga' && (
                <div className="text-center space-y-8">
                    <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border border-indigo-100 text-indigo-500">
                        <Activity size={40} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter leading-none">Asana Hub</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic px-10">Select physical posture for Bio-Alignment</p>
                    </div>
                    <button 
                        onClick={() => router.push('/activities')} 
                        className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
                    >
                        Browse 20+ Protocols
                    </button>
                </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 4. UAE HUB RADIUS (Verified Locations) */}
        <div className="glass-card rounded-[2.8rem] p-7 shadow-sm border-white/30 bg-white/30">
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-xs font-black flex items-center gap-2 text-slate-700 uppercase tracking-widest italic">
                <Compass size={14} className="text-blue-500 animate-spin-slow" /> Proximity Index
            </h3>
            <ShieldCheck size={16} className="text-emerald-500" />
          </div>
          
          <div className="space-y-4">
            {nearby.length > 0 ? nearby.map((spot, i) => (
              <motion.div 
                key={i} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => setSelectedSpot(spot)} 
                className="flex items-center justify-between bg-white/50 p-4 rounded-[1.8rem] border border-white/20 active:bg-white shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                      <MapPin size={16} />
                  </div>
                  <div>
                      <span className="text-xs font-black text-slate-800 uppercase italic leading-none">{spot.name}</span>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">{spot.type} Protocol</p>
                  </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-blue-600 underline decoration-blue-200 underline-offset-2">
                        <TrendingUp size={10} />
                        <p className="text-[9px] font-black uppercase italic">{spot.dist.toFixed(1)}KM</p>
                    </div>
                </div>
              </motion.div>
            )) : (
                <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-widest">Searching Hub Radius...</p>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. INDEPENDENT NEURAL AI TRIGGER */}
      <motion.button 
        whileTap={{ scale: 0.85 }} 
        onClick={() => router.push('/ai')}
        className="fixed bottom-28 right-6 w-16 h-16 bg-slate-900 text-white rounded-full shadow-[0_25px_60px_rgba(0,0,0,0.4)] flex items-center justify-center z-[100] border-4 border-emerald-400 active:bg-slate-800 transition-colors"
      >
        <Sparkles size={28} className="text-emerald-400 animate-pulse" />
      </motion.button>

      {/* PROTOCOL OVERLAYS */}
      <AnimatePresence>
        {showProtocol && (
            <BreathProtocol 
                onClose={() => setShowProtocol(false)} 
                onComplete={(val, verified) => logActivity('breath', verified ? 'Verified Box Breath' : 'Box Breath', val)} 
            />
        )}
        {selectedSpot && (
            <WellnessMap 
                spot={selectedSpot} 
                onClose={() => setSelectedSpot(null)} 
            />
        )}
      </AnimatePresence>
    </div>
  );
}
