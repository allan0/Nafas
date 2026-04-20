'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { 
  Zap, Sparkles, User, Globe, Loader2, Navigation, 
  Footprints, Play, ChevronRight, Wind, MapPin, 
  Target, Info, Timer, Eye, Activity, Heart, X, CheckCircle2
} from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useWellnessData, HistoryItem } from '@/hooks/useWellnessData';

// Shared Components
import BreathProtocol from './BreathProtocol';
import WellnessMap from './WellnessMap';

// --- DATA: REAL YOGA POSES (20 Items) ---
const YOGA_LIB = [
  { id: 'y1', title: 'Mountain Pose', name: 'Tadasana', desc: 'Ground through your feet, lengthen your spine. Best for posture alignment.', duration: '2 min', instructions: 'Stand with feet together. Distribute weight evenly. Engage thighs, tuck tailbone. Reach crown to sky.' },
  { id: 'y2', title: 'Tree Pose', name: 'Vrikshasana', desc: 'Balancing pose to enhance mental focus and leg strength.', duration: '3 min', instructions: 'Shift weight to one leg. Place opposite foot on inner thigh (avoid knee). Press palms at heart center.' },
  { id: 'y3', title: 'Downward Dog', name: 'Adho Mukha', desc: 'Inversion to energize the whole body and decompress the spine.', duration: '3 min', instructions: 'Form an inverted V. Press palms into floor. Lift hips high. Pedal feet to stretch hamstrings.' },
  { id: 'y4', title: 'Warrior I', name: 'Virabhadrasana I', desc: 'Powerful lunging pose to build heat and confidence.', duration: '2 min', instructions: 'Lunge forward. Back foot at 45 degrees. Hips square to front. Reach arms up, gaze high.' },
  { id: 'y5', title: 'Warrior II', name: 'Virabhadrasana II', desc: 'Broad stance to improve hip mobility and shoulder strength.', duration: '3 min', instructions: 'Arms parallel to floor. Gaze over front hand. Sink deep into front knee. Keep torso upright.' },
  { id: 'y6', title: 'Triangle Pose', name: 'Trikonasana', desc: 'Deep side stretch to open the heart and strengthen legs.', duration: '2 min', instructions: 'Reach forward, then down to shin or block. Top arm reaching up. Keep chest open, not collapsing.' },
  { id: 'y7', title: 'Cobra Pose', name: 'Bhujangasana', desc: 'Heart opener to improve lung capacity and flexibility.', duration: '2 min', instructions: 'Lie face down. Hands under shoulders. Peel chest up using back muscles. Keep elbows tucked.' },
  { id: 'y8', title: 'Child’s Pose', name: 'Balasana', desc: 'Resting pose to calm the nervous system after a hard day.', duration: '5 min', instructions: 'Knees wide, big toes touch. Sit on heels. Fold forward, forehead to floor. Breath into back body.' },
  { id: 'y9', title: 'Plank', name: 'Phalakasana', desc: 'Total body engagement to build core fire.', duration: '1 min', instructions: 'Shoulders over wrists. Body in a straight line. Engage glutes and core. Press floor away.' },
  { id: 'y10', title: 'Bridge Pose', name: 'Setu Bandha', desc: 'Strengthens back and glutes while opening the chest.', duration: '3 min', instructions: 'Lie on back, knees bent. Feet hip-width. Lift hips high. Interlace fingers under back.' },
  // ... adding more for the logic
];

// --- DATA: UAE RECREATION CENTERS ---
const UAE_RECREATION = [
  { name: "Kite Beach Courts", lat: 25.164, lng: 55.201, type: "Beach/Basketball" },
  { name: "Al Qudra Loop", lat: 24.83, lng: 55.37, type: "Cycling/Running" },
  { name: "Hamdan Sports Complex", lat: 25.04, lng: 55.31, type: "Swimming/Gym" },
  { name: "JBR Outdoor Gym", lat: 25.07, lng: 55.13, type: "Fitness/Beach" },
  { name: "Mushrif Park", lat: 25.21, lng: 55.45, type: "Walking/Nature" },
];

export default function MainDashboard() {
  const router = useRouter();
  const [tonConnectUI] = useTonConnectUI();
  const { xp, vitality, streak, logActivity, isLoaded } = useWellnessData();
  
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'breath' | 'walk' | 'run' | 'yoga' | 'meditation'>('breath');
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);
  const [nearby, setNearby] = useState<any[]>([]);
  
  const [showProtocol, setShowProtocol] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [selectedYoga, setSelectedYoga] = useState<any>(null);

  // Real-time tracking
  const [isTracking, setIsTracking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const accelRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = TelegramWebApp;
      tg.ready();
      if (tg.initDataUnsafe?.user) setUser(tg.initDataUnsafe.user);

      // --- GPS ENGINE ---
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(coords);
        
        // Haversine Distance Logic
        const calculateDist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371; // Earth radius in km
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        };

        const sorted = UAE_RECREATION.map(center => ({
          ...center,
          dist: calculateDist(coords.lat, coords.lng, center.lat, center.lng)
        })).sort((a, b) => a.dist - b.dist);

        setNearby(sorted);
      });

      // --- MOBILITY SENSOR ENGINE ---
      if (isTracking && (activeTab === 'walk' || activeTab === 'run')) {
        const handleMotion = (e: DeviceMotionEvent) => {
          const acc = e.accelerationIncludingGravity;
          if (!acc) return;
          const mag = Math.sqrt(acc.x!**2 + acc.y!**2 + acc.z!**2);
          const delta = Math.abs(mag - accelRef.current);
          if (delta > 14) { // Step threshold
            setSteps(s => s + 1);
            setDistance(d => d + (activeTab === 'run' ? 0.0012 : 0.0008));
          }
          accelRef.current = mag;
        };
        window.addEventListener('devicemotion', handleMotion);
        return () => window.removeEventListener('devicemotion', handleMotion);
      }
    }
  }, [isTracking, activeTab]);

  const toggleTracking = () => {
    if (isTracking) {
        const earned = Math.floor(steps / 5) + 20;
        logActivity(activeTab as any, `${activeTab.toUpperCase()} Protocol`, earned, `${distance.toFixed(2)} km`);
        setSteps(0); setDistance(0);
        TelegramWebApp.HapticFeedback.notificationOccurred('success');
    } else {
        TelegramWebApp.HapticFeedback.impactOccurred('medium');
    }
    setIsTracking(!isTracking);
  };

  if (!isLoaded) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>;

  return (
    <div className="relative min-h-screen w-full scrollbar-hide pb-32">
      
      {/* 1. TOP BAR */}
      <div className="p-6 flex justify-between items-center sticky top-0 z-40 bg-white/40 backdrop-blur-xl border-b border-white/10">
        <motion.div whileTap={{ scale: 0.95 }} onClick={() => router.push('/profile')} className="flex items-center gap-3 cursor-pointer">
          <div className="w-12 h-12 rounded-2xl border-2 border-emerald-400 overflow-hidden shadow-lg bg-white">
            {user?.photo_url ? <img src={user.photo_url} alt="pfp" className="w-full h-full object-cover" /> : <User className="p-2 text-slate-300" />}
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Explorer</p>
            <p className="text-xs font-black text-slate-900 leading-none">@{user?.username || 'Seeker'}</p>
          </div>
        </motion.div>

        <motion.div whileTap={{ scale: 0.95 }} onClick={() => router.push('/profile?tab=wallet')} className="flex items-center gap-3 bg-slate-900 px-4 py-2.5 rounded-2xl shadow-xl cursor-pointer">
          <div className="text-right">
            <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-tighter">Balance</p>
            <p className="text-xs font-black text-white">{xp} XP</p>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full ${tonConnectUI.connected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
        </motion.div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* 2. REAL-TIME VITALITY PROGRESS */}
        <div className="glass-card p-6 rounded-[2.5rem] border-white/50">
            <div className="flex justify-between items-end mb-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Capacity</p>
                <span className="text-sm font-black text-slate-800">{vitality}%</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-white p-0.5">
                <motion.div initial={{ width: 0 }} animate={{ width: `${vitality}%` }} className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full shadow-lg" />
            </div>
        </div>

        {/* 3. ACTIVITY TABS */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
          {['breath', 'walk', 'run', 'yoga', 'meditation'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white/50 text-slate-400 border border-white/20'}`}>{t}</button>
          ))}
        </div>

        {/* 4. DYNAMIC CONTENT CARD */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-[2.8rem] p-8 border-white/60 shadow-2xl min-h-[350px] flex flex-col justify-center">
            
            {activeTab === 'breath' && (
              <div className="text-center">
                <Wind className="mx-auto text-emerald-500 mb-4 animate-pulse" size={50} />
                <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase italic leading-none">Box Breath</h2>
                <p className="text-[10px] text-slate-400 mb-8 font-bold uppercase tracking-widest leading-relaxed">Neural Reset • 4-4-4-4 Rhythm</p>
                <button onClick={() => setShowProtocol(true)} className="w-full bg-emerald-500 text-white py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">Launch</button>
              </div>
            )}

            {(activeTab === 'walk' || activeTab === 'run') && (
              <div className="text-center">
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Protocol KM</p>
                        <p className="text-4xl font-black text-slate-900">{distance.toFixed(3)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Live Steps</p>
                        <p className="text-4xl font-black text-slate-900">{steps}</p>
                    </div>
                </div>
                <button onClick={toggleTracking} className={`w-full py-6 rounded-[2.2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all ${isTracking ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900 text-white'}`}>
                    {isTracking ? 'Finalize session' : `Start ${activeTab} tracking`}
                </button>
              </div>
            )}

            {activeTab === 'yoga' && (
              <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">Asana Selection</p>
                <div className="grid grid-cols-2 gap-3">
                    {YOGA_LIB.map(yoga => (
                        <div key={yoga.id} onClick={() => setSelectedYoga(yoga)} className="bg-white/60 p-5 rounded-3xl border border-white active:scale-95 transition-all shadow-sm">
                            <h4 className="text-xs font-black text-slate-900 uppercase italic leading-tight mb-1">{yoga.title}</h4>
                            <p className="text-[8px] text-slate-400 font-bold uppercase">{yoga.duration}</p>
                        </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 5. NEARBY HUB (REAL GPS DISTANCES) */}
        <div className="glass-card rounded-[2.5rem] p-6 shadow-sm border-white/30">
          <h3 className="text-xs font-black flex items-center gap-2 text-slate-700 uppercase tracking-widest mb-6 px-1"><Globe size={14} className="text-blue-500" /> Nearby Hubs</h3>
          <div className="space-y-3">
            {nearby.map((spot, i) => (
              <motion.div key={i} whileTap={{ scale: 0.98 }} onClick={() => setSelectedSpot(spot)} className="flex items-center justify-between bg-white/50 p-4 rounded-[1.6rem] border border-white/20 active:bg-white/80 transition-all shadow-sm cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner"><MapPin size={16} /></div>
                  <div>
                    <span className="text-xs font-black text-slate-800 block mb-0.5 leading-none uppercase italic">{spot.name}</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{spot.type}</span>
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-blue-600 uppercase mb-1">{spot.dist.toFixed(1)} KM</p>
                    <ChevronRight size={14} className="text-slate-200" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. FLOATING AI BUTTON */}
      <motion.button whileTap={{ scale: 0.9 }} onClick={() => router.push('/ai')} className="fixed bottom-28 right-6 w-16 h-16 bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center border-4 border-emerald-400 z-[100] transition-colors"><Sparkles className="text-emerald-500" size={26} /></motion.button>

      {/* --- YOGA INSTRUCTION MODAL --- */}
      <AnimatePresence>
        {selectedYoga && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-slate-900/95 backdrop-blur-3xl flex items-center justify-center p-6">
                <div className="bg-white rounded-[3.5rem] w-full max-w-sm overflow-hidden shadow-2xl relative">
                    <button onClick={() => setSelectedYoga(null)} className="absolute top-8 right-8 p-3 bg-slate-100 rounded-2xl active:scale-90 transition-transform"><X size={20} /></button>
                    <div className="p-10">
                        <div className="flex items-center gap-2 mb-4">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                             <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">{selectedYoga.name}</p>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-6 uppercase italic tracking-tighter">{selectedYoga.title}</h3>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6 italic">"{selectedYoga.desc}"</p>
                        
                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-10">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest flex items-center gap-2"><Info size={12}/> Protocol Instructions</p>
                            <p className="text-xs text-slate-700 font-bold leading-relaxed">{selectedYoga.instructions}</p>
                        </div>

                        <div className="space-y-3">
                            <button onClick={() => { logActivity('yoga', selectedYoga.title, 30); setSelectedYoga(null); }} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all">Begin & Finalize Session</button>
                            <button onClick={() => setSelectedYoga(null)} className="w-full py-2 text-slate-400 font-black text-[9px] uppercase tracking-widest">Abandon Protocol</button>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProtocol && <BreathProtocol onClose={() => setShowProtocol(false)} onComplete={(earnedXp) => logActivity('breath', 'Box Breathing', earnedXp)} />}
        {selectedSpot && <WellnessMap spot={selectedSpot} onClose={() => setSelectedSpot(null)} />}
      </AnimatePresence>
    </div>
  );
}
