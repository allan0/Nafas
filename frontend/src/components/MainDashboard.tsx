'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Zap, Sparkles, User, Globe, Loader2, Navigation, 
  Footprints, Play, ChevronRight, Wind, MapPin, 
  Target, Info, Timer, Eye, Activity, Heart, X, CheckCircle2,
  Compass, ArrowRight, Camera
} from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useWellnessData } from '@/hooks/useWellnessData';

// Shared Modal Components
import BreathProtocol from './BreathProtocol';
import WellnessMap from './WellnessMap';

// --- DATA: REAL YOGA PROTOCOLS (20 Poses) ---
const YOGA_ASANAS = [
  { id: 'y1', title: 'Mountain', name: 'Tadasana', desc: 'Neutral alignment and grounding.', duration: 2, xp: 10, instructions: 'Stand with feet together. Engage thighs, tuck tailbone. Reach crown to sky.' },
  { id: 'y2', title: 'Tree', name: 'Vrikshasana', desc: 'Focus and unilateral balance.', duration: 3, xp: 15, instructions: 'Shift weight to one leg. Place foot on inner thigh (avoid knee). Palms at heart center.' },
  { id: 'y3', title: 'Downward Dog', name: 'Adho Mukha', desc: 'Spinal decompression and inversion.', duration: 3, xp: 20, instructions: 'Form an inverted V. Press palms into floor. Lift hips high. Stretch hamstrings.' },
  { id: 'y4', title: 'Warrior I', name: 'Virabhadrasana I', desc: 'Building heat and lower body power.', duration: 4, xp: 25, instructions: 'Lunge forward. Back foot at 45 degrees. Hips square to front. Reach arms high.' },
  { id: 'y5', title: 'Warrior II', name: 'Virabhadrasana II', desc: 'Hip opening and stamina focus.', duration: 4, xp: 25, instructions: 'Arms parallel to floor. Gaze over front hand. Sink deep into front knee.' },
  { id: 'y6', title: 'Triangle', name: 'Trikonasana', desc: 'Lateral expansion and leg stretch.', duration: 3, xp: 20, instructions: 'Reach forward then down to shin. Top arm reaching up. Keep chest open.' },
  { id: 'y7', title: 'Plank', name: 'Phalakasana', desc: 'Core stabilization and arm heat.', duration: 2, xp: 30, instructions: 'Shoulders over wrists. Body in a straight line. Engage glutes and core.' },
  { id: 'y8', title: 'Cobra', name: 'Bhujangasana', desc: 'Heart opening and lung expansion.', duration: 3, xp: 20, instructions: 'Lie face down. Hands under shoulders. Peel chest up using back muscles.' },
  { id: 'y9', title: 'Child’s Pose', name: 'Balasana', desc: 'Parasympathetic reset and rest.', duration: 5, xp: 10, instructions: 'Knees wide, big toes touch. Sit on heels. Fold forward, forehead to floor.' },
  { id: 'y10', title: 'Bridge', name: 'Setu Bandha', desc: 'Glute activation and chest opening.', duration: 3, xp: 25, instructions: 'Lie on back, knees bent. Lift hips high. Interlace fingers under back.' },
  { id: 'y11', title: 'Crow', name: 'Bakasana', desc: 'Advanced arm balance and focus.', duration: 1, xp: 50, instructions: 'Squat down, hands on floor. Rest knees on triceps. Lean forward and lift feet.' },
  { id: 'y12', title: 'Cat-Cow', name: 'Marjaryasana', desc: 'Spinal fluidity and breath sync.', duration: 3, xp: 15, instructions: 'On all fours. Inhale to arch back (Cow), exhale to round spine (Cat).' },
  { id: 'y13', title: 'Seated Fold', name: 'Paschimottanasana', desc: 'Deep hamstring release.', duration: 4, xp: 20, instructions: 'Seated with legs out. Reach for toes. Lengthen spine as you fold.' },
  { id: 'y14', title: 'Boat', name: 'Navasana', desc: 'Isometric core strength.', duration: 2, xp: 35, instructions: 'Balance on sit-bones. Lift legs and arms to form a V. Keep chest lifted.' },
  { id: 'y15', title: 'Eagle', name: 'Garudasana', desc: 'Joint detoxification and focus.', duration: 3, xp: 30, instructions: 'Wrap one leg over the other. Wrap arms. Sink into a shallow squat.' },
  { id: 'y16', title: 'Chair', name: 'Utkatasana', desc: 'Building metabolic fire.', duration: 2, xp: 25, instructions: 'Feet together. Sit back as if in a chair. Reach arms up by ears.' },
  { id: 'y17', title: 'Pigeon', name: 'Kapotasana', desc: 'Deep emotional release in hips.', duration: 5, xp: 20, instructions: 'Bring one knee forward behind wrist. Extend back leg. Square hips and fold.' },
  { id: 'y18', title: 'Side Plank', name: 'Vasisthasana', desc: 'Oblique strength and balance.', duration: 2, xp: 30, instructions: 'From plank, shift to one hand. Stack feet. Reach top arm to sky.' },
  { id: 'y19', title: 'Upward Dog', name: 'Urdhva Mukha', desc: 'Advanced back extension.', duration: 2, xp: 25, instructions: 'Peel chest up. Straighten arms. Lift thighs and knees off floor.' },
  { id: 'y20', title: 'Corpse Pose', name: 'Shavasana', desc: 'Full protocol integration.', duration: 7, xp: 10, instructions: 'Lie flat on back. Arms at sides. Total stillness. Integrate the session.' },
];

const UAE_HUBS = [
  { name: "Kite Beach", lat: 25.164, lng: 55.201, type: "Beach/Basketball" },
  { name: "Al Qudra Loop", lat: 24.83, lng: 55.37, type: "Cycling" },
  { name: "Marina Walk", lat: 25.068, lng: 55.13, type: "Running" },
  { name: "Hamdan Pool", lat: 25.043, lng: 55.312, type: "Swimming" },
  { name: "Mushrif Forest", lat: 25.215, lng: 55.454, type: "Walking" },
];

export default function MainDashboard() {
  const router = useRouter();
  const [tonConnectUI] = useTonConnectUI();
  const { xp, vitality, streak, logActivity, isLoaded, userCoords, setUserCoords } = useWellnessData();
  
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'breath' | 'walk' | 'run' | 'yoga' | 'meditation'>('breath');
  const [nearby, setNearby] = useState<any[]>([]);
  const [showProtocol, setShowProtocol] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [selectedYoga, setSelectedYoga] = useState<any>(null);

  // --- Real-time Motion Engine ---
  const [isTracking, setIsTracking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const accelRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = TelegramWebApp;
      tg.ready();
      if (tg.initDataUnsafe?.user) setUser(tg.initDataUnsafe.user);

      // 1. LOCATION LOGIC: Request once and cache globally
      if (!userCoords) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCoords(coords);
          run5kmFilter(coords.lat, coords.lng);
        });
      } else {
        run5kmFilter(userCoords.lat, userCoords.lng);
      }

      // 2. MOBILITY SENSOR: Real step counting
      if (isTracking && (activeTab === 'walk' || activeTab === 'run')) {
        const handleMotion = (e: DeviceMotionEvent) => {
          const acc = e.accelerationIncludingGravity;
          if (!acc) return;
          const magnitude = Math.sqrt(acc.x!**2 + acc.y!**2 + acc.z!**2);
          if (Math.abs(magnitude - accelRef.current) > 13.0) {
            setSteps(s => s + 1);
            setDistance(d => d + (activeTab === 'run' ? 0.0012 : 0.0008));
          }
          accelRef.current = magnitude;
        };
        window.addEventListener('devicemotion', handleMotion);
        return () => window.removeEventListener('devicemotion', handleMotion);
      }
    }
  }, [isTracking, activeTab, userCoords]);

  const run5kmFilter = (lat: number, lng: number) => {
    const getDist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    const sorted = UAE_HUBS.map(h => ({ ...h, dist: getDist(lat, lng, h.lat, h.lng) }))
                           .filter(h => h.dist <= 5.0) // ONLY WITHIN 5KM
                           .sort((a, b) => a.dist - b.dist);
    setNearby(sorted);
  };

  const finalizeActivity = () => {
    const earned = Math.floor(steps / 10) + 20;
    logActivity(activeTab as any, `${activeTab.toUpperCase()} Protocol`, earned, `${distance.toFixed(2)} km`);
    setIsTracking(false); setSteps(0); setDistance(0);
    TelegramWebApp.HapticFeedback.notificationOccurred('success');
  };

  if (!isLoaded) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-400" /></div>;

  return (
    <div className="relative min-h-screen w-full bg-transparent overflow-x-hidden pb-32">
      
      {/* 1. TOP NAVIGATION BAR */}
      <div className="p-6 flex justify-between items-center sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-white/10">
        <motion.div whileTap={{ scale: 0.95 }} onClick={() => router.push('/profile')} className="flex items-center gap-3 cursor-pointer">
          <div className="w-12 h-12 rounded-2xl border-2 border-emerald-400 overflow-hidden shadow-lg bg-white">
            {user?.photo_url ? <img src={user.photo_url} alt="pfp" className="w-full h-full object-cover" /> : <User className="p-2 text-slate-300" />}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Explorer</span>
            <span className="text-xs font-black text-slate-900 leading-none">@{user?.username || 'Seeker'}</span>
          </div>
        </motion.div>

        <motion.div whileTap={{ scale: 0.95 }} onClick={() => router.push('/profile?tab=wallet')} className="flex items-center gap-3 bg-slate-900 px-4 py-2.5 rounded-2xl shadow-xl cursor-pointer">
          <div className="text-right">
            <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-tighter leading-none mb-1">Airdrop Score</p>
            <p className="text-xs font-black text-white leading-none">{xp} XP</p>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full ${tonConnectUI.connected ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
        </motion.div>
      </div>

      <div className="p-6 space-y-6 relative z-10">
        
        {/* 2. ACTIVITY TAB SYSTEM */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
          {['breath', 'walk', 'run', 'yoga', 'meditation'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white/60 text-slate-400 border border-white/20'}`}>{t}</button>
          ))}
        </div>

        {/* 3. DYNAMIC INTERACTION CARD */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-[3rem] p-8 border-white/60 shadow-2xl min-h-[380px] flex flex-col justify-center">
            
            {activeTab === 'breath' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><Wind className="text-emerald-500 animate-pulse" size={32} /></div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Box Breath</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">Neural Optimization Protocol</p>
                <button onClick={() => setShowProtocol(true)} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">Launch</button>
              </div>
            )}

            {(activeTab === 'walk' || activeTab === 'run') && (
              <div className="text-center">
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-slate-50 p-5 rounded-[2rem] shadow-inner"><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Index KM</p><p className="text-4xl font-black text-slate-900 leading-none">{distance.toFixed(3)}</p></div>
                    <div className="bg-slate-50 p-5 rounded-[2rem] shadow-inner"><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Live Steps</p><p className="text-4xl font-black text-slate-900 leading-none">{steps}</p></div>
                </div>
                <button onClick={isTracking ? finalizeActivity : () => setIsTracking(true)} className={`w-full py-6 rounded-[2.2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all ${isTracking ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900 text-white'}`}>
                    {isTracking ? 'Terminate & Log' : `Initialize ${activeTab}`}
                </button>
              </div>
            )}

            {activeTab === 'yoga' && (
              <div className="space-y-4 max-h-[420px] overflow-y-auto scrollbar-hide pr-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">Select Asana Protocol</p>
                <div className="grid grid-cols-1 gap-3">
                    {YOGA_ASANAS.map(asana => (
                        <div key={asana.id} onClick={() => setSelectedYoga(asana)} className="bg-white/60 p-5 rounded-[1.8rem] border border-white flex justify-between items-center active:scale-95 transition-all shadow-sm">
                            <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase italic leading-none">{asana.title}</h4>
                                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{asana.duration} Minutes</p>
                            </div>
                            <div className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl">
                                <Zap size={10} className="text-emerald-600 fill-emerald-600" />
                                <span className="text-[10px] font-black text-emerald-600">{asana.xp}</span>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 4. NEARBY RADIUS HUB (5KM FILTER) */}
        <div className="glass-card rounded-[2.8rem] p-7 shadow-sm border-white/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black flex items-center gap-2 text-slate-700 uppercase tracking-widest"><Compass size={14} className="text-blue-500 animate-spin-slow" /> Proximity Hubs (5KM)</h3>
          </div>
          <div className="space-y-4">
            {nearby.length > 0 ? nearby.map((spot, i) => (
              <motion.div key={i} whileTap={{ scale: 0.98 }} onClick={() => setSelectedSpot(spot)} className="flex items-center justify-between bg-white/50 p-4 rounded-[1.6rem] border border-white/20 active:bg-white shadow-sm cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner"><MapPin size={16} /></div>
                  <div><span className="text-xs font-black text-slate-800 uppercase italic leading-none">{spot.name}</span><p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">{spot.type}</p></div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-blue-600 uppercase italic underline">{spot.dist.toFixed(1)}KM</p>
                    <ChevronRight size={14} className="text-slate-200 inline" />
                </div>
              </motion.div>
            )) : (
              <div className="py-12 text-center opacity-30 italic text-[10px] font-bold uppercase tracking-widest border border-dashed border-slate-200 rounded-[2rem]">Scanning local protocol hub radius...</div>
            )}
          </div>
        </div>
      </div>

      {/* 5. INDEPENDENT FLOATING AI BUTTON */}
      <motion.button 
        whileTap={{ scale: 0.85 }} onClick={() => router.push('/ai')}
        className="fixed bottom-28 right-6 w-16 h-16 bg-slate-900 text-white rounded-full shadow-[0_25px_60px_rgba(0,0,0,0.4)] flex items-center justify-center z-[100] border-4 border-emerald-400 active:bg-slate-800"
      >
        <Sparkles size={28} className="text-emerald-400" />
      </motion.button>

      {/* 6. YOGA INSTRUCTION MODAL */}
      <AnimatePresence>
        {selectedYoga && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-slate-900/95 backdrop-blur-3xl flex items-center justify-center p-6">
                <div className="bg-white rounded-[4rem] w-full max-w-sm overflow-hidden shadow-2xl relative border border-white/20">
                    <button onClick={() => setSelectedYoga(null)} className="absolute top-8 right-8 p-3 bg-slate-100 rounded-2xl active:scale-75 transition-all"><X size={20}/></button>
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-inner"><Activity size={32}/></div>
                        <h3 className="text-4xl font-black text-slate-900 italic uppercase mb-2 tracking-tighter leading-none">{selectedYoga.title}</h3>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-10">{selectedYoga.name}</p>
                        <div className="bg-slate-50 p-6 rounded-[2.5rem] mb-10 border border-slate-100 text-left">
                             <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest flex items-center gap-2"><Info size={12}/> Session Protocol</p>
                             <p className="text-xs text-slate-700 font-bold leading-relaxed">{selectedYoga.instructions}</p>
                        </div>
                        <button onClick={() => { logActivity('yoga', selectedYoga.title, selectedYoga.xp); setSelectedYoga(null); }} className="w-full bg-slate-900 text-white py-6 rounded-[2.2rem] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all">Complete & Index {selectedYoga.xp} XP</button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProtocol && <BreathProtocol onClose={() => setShowProtocol(false)} onComplete={(val) => logActivity('breath', 'Box Breathing', val)} />}
        {selectedSpot && <WellnessMap spot={selectedSpot} onClose={() => setSelectedSpot(null)} />}
      </AnimatePresence>
    </div>
  );
}
