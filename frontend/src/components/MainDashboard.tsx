'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Zap, Sparkles, User, Globe, Loader2, Navigation, 
  Play, ChevronRight, Wind, MapPin, 
  Target, Info, Activity, X, CheckCircle2,
  Compass, ArrowRight, Camera, ExternalLink, Timer
} from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWellnessData } from '@/hooks/useWellnessData';

// Shared Modal Components
import BreathProtocol from './BreathProtocol';
import WellnessMap from './WellnessMap';

// --- DATA: 20 AUTHENTIC YOGA PROTOCOLS ---
const YOGA_LIB = [
  { id: 'y1', title: 'Mountain', name: 'Tadasana', inst: 'Stand tall, feet together. Ground through four corners of feet. Reach crown to sky.', xp: 10 },
  { id: 'y2', title: 'Tree', name: 'Vrikshasana', inst: 'Balance on one leg. Place foot on inner thigh. Palms at heart center.', xp: 15 },
  { id: 'y3', title: 'Downward Dog', name: 'Adho Mukha', inst: 'Inverted V-shape. Press palms into floor. Lift hips. Stretch hamstrings.', xp: 20 },
  { id: 'y4', title: 'Warrior I', name: 'Virabhadrasana I', inst: 'Lunge forward. Back foot at 45 degrees. Hips square. Arms high.', xp: 25 },
  { id: 'y5', title: 'Warrior II', name: 'Virabhadrasana II', inst: 'Broad stance. Arms parallel to floor. Gaze over front hand.', xp: 25 },
  { id: 'y6', title: 'Triangle', name: 'Trikonasana', inst: 'Lateral stretch. Reach down to shin. Top arm reaching for the sky.', xp: 20 },
  { id: 'y7', title: 'Plank', name: 'Phalakasana', inst: 'Shoulders over wrists. Body in a straight line. Engage core and glutes.', xp: 30 },
  { id: 'y8', title: 'Cobra', name: 'Bhujangasana', inst: 'Lie face down. Peel chest up using back muscles. Keep elbows tucked in.', xp: 20 },
  { id: 'y9', title: 'Child’s Pose', name: 'Balasana', inst: 'Knees wide, big toes touch. Sit on heels. Fold forward, forehead to floor.', xp: 10 },
  { id: 'y10', title: 'Bridge', name: 'Setu Bandha', inst: 'Lie on back, knees bent. Lift hips high. Interlace fingers under back.', xp: 25 },
  { id: 'y11', title: 'Crow', name: 'Bakasana', inst: 'Squat, hands on floor. Knees on triceps. Lean forward and lift feet.', xp: 50 },
  { id: 'y12', title: 'Cat-Cow', name: 'Marjaryasana', inst: 'On all fours. Inhale arch (Cow), exhale round spine (Cat).', xp: 15 },
  { id: 'y13', title: 'Seated Fold', name: 'Paschimottanasana', inst: 'Seated with legs out. Reach for toes with a flat back and long spine.', xp: 20 },
  { id: 'y14', title: 'Boat', name: 'Navasana', inst: 'Balance on sit-bones. Lift legs and arms into a V shape. Core fire.', xp: 35 },
  { id: 'y15', title: 'Eagle', name: 'Garudasana', inst: 'Wrap one leg over other. Wrap arms. Sink into a shallow squat.', xp: 30 },
  { id: 'y16', title: 'Chair', name: 'Utkatasana', inst: 'Feet together. Sit back as if into a chair. Reach arms by ears.', xp: 25 },
  { id: 'y17', title: 'Pigeon', name: 'Kapotasana', inst: 'One knee behind wrist. Extend back leg. Square hips and fold forward.', xp: 20 },
  { id: 'y18', title: 'Side Plank', name: 'Vasisthasana', inst: 'From plank, shift to one hand. Stack feet. Reach top arm to sky.', xp: 30 },
  { id: 'y19', title: 'Upward Dog', name: 'Urdhva Mukha', inst: 'Peel chest up. Straight arms. Lift thighs and knees off the floor.', xp: 25 },
  { id: 'y20', title: 'Corpse Pose', name: 'Shavasana', inst: 'Lie flat on back. Total stillness. Integrate the protocol energy.', xp: 10 },
];

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
  const { xp, vitality, streak, logActivity, isLoaded, userCoords, setUserCoords } = useWellnessData();
  
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'breath' | 'walk' | 'run' | 'yoga' | 'meditation'>('breath');
  const [nearby, setNearby] = useState<any[]>([]);
  const [showProtocol, setShowProtocol] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [selectedYoga, setSelectedYoga] = useState<any>(null);

  // --- Real-time Sensor Engine ---
  const [isTracking, setIsTracking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const accelRef = useRef<number>(0);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) setActiveTab(tabParam as any);

    if (typeof window !== 'undefined') {
      const tg = TelegramWebApp;
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) setUser(tg.initDataUnsafe.user);

      // 1. LOCATION: One-time request then uses cached engine data
      if (!userCoords) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCoords(c);
          runProximityFilter(c.lat, c.lng);
        });
      } else {
        runProximityFilter(userCoords.lat, userCoords.lng);
      }

      // 2. SENSORS: Step counting protocol
      if (isTracking && (activeTab === 'walk' || activeTab === 'run')) {
        const handleMotion = (e: DeviceMotionEvent) => {
          const acc = e.accelerationIncludingGravity;
          if (!acc) return;
          const magnitude = Math.sqrt(acc.x!**2 + acc.y!**2 + acc.z!**2);
          if (Math.abs(magnitude - accelRef.current) > 13.2) { 
            setSteps(s => s + 1);
            setDistance(d => d + (activeTab === 'run' ? 0.0011 : 0.00075));
          }
          accelRef.current = magnitude;
        };
        window.addEventListener('devicemotion', handleMotion);
        return () => window.removeEventListener('devicemotion', handleMotion);
      }
    }
  }, [isTracking, activeTab, userCoords, searchParams, setUserCoords]);

  const runProximityFilter = (lat: number, lng: number) => {
    const getDist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    const hubs = UAE_LOCATIONS.map(h => ({ ...h, dist: getDist(lat, lng, h.lat, h.lng) }))
                               .filter(h => h.dist <= 5.0) // 5KM Filter
                               .sort((a, b) => a.dist - b.dist);
    setNearby(hubs);
  };

  const handleFinishProtocol = () => {
    const earned = Math.floor(steps / 10) + 20;
    logActivity(activeTab as any, `${activeTab.toUpperCase()} Session`, earned, `${distance.toFixed(2)} km`);
    setIsTracking(false); setSteps(0); setDistance(0);
    TelegramWebApp.HapticFeedback.notificationOccurred('success');
  };

  if (!isLoaded) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-400" /></div>;

  return (
    <div className="relative min-h-screen w-full bg-transparent overflow-x-hidden pb-40">
      
      {/* 1. TOP PROTOCOL NAVIGATION */}
      <div className="p-6 flex justify-between items-center sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <motion.div whileTap={{ scale: 0.95 }} onClick={() => router.push('/profile')} className="flex items-center gap-3 cursor-pointer">
          <div className="w-12 h-12 rounded-2xl border-2 border-emerald-400 overflow-hidden shadow-lg bg-white flex items-center justify-center">
            {user?.photo_url ? <img src={user.photo_url} alt="pfp" className="w-full h-full object-cover" /> : <User className="p-2 text-slate-300" />}
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Identity</p>
            <p className="text-xs font-black text-slate-900 leading-none italic">@{user?.username || 'Seeker'}</p>
          </div>
        </motion.div>

        <motion.div whileTap={{ scale: 0.95 }} onClick={() => router.push('/profile?tab=wallet')} className="flex items-center gap-3 bg-slate-900 px-4 py-2.5 rounded-2xl shadow-xl cursor-pointer">
          <div className="text-right">
            <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-tighter leading-none mb-1 italic">Mined</p>
            <p className="text-xs font-black text-white leading-none">{xp} XP</p>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full ${tonConnectUI.connected ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
        </motion.div>
      </div>

      <div className="p-6 space-y-6 relative z-10">
        
        {/* 2. ACTIVITY TAB SELECTOR */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
          {['breath', 'walk', 'run', 'yoga', 'meditation'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white/60 text-slate-400 border border-white/20'}`}>{t}</button>
          ))}
        </div>

        {/* 3. DYNAMIC CONTENT INTERFACE */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-[3rem] p-8 border-white/60 shadow-2xl min-h-[380px] flex flex-col justify-center bg-white/30 backdrop-blur-md">
            
            {activeTab === 'breath' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100"><Wind className="text-emerald-500 animate-pulse" size={32} /></div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Box Breath</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10 italic">Parasympathetic Reset Protocol</p>
                <button onClick={() => setShowProtocol(true)} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">Start 4-4-4-4</button>
              </div>
            )}

            {(activeTab === 'walk' || activeTab === 'run') && (
              <div className="text-center">
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-white/50 p-5 rounded-[2rem] shadow-inner border border-white/60"><p className="text-[9px] font-black text-slate-400 uppercase mb-2">Protocol KM</p><p className="text-4xl font-black text-slate-900 leading-none">{distance.toFixed(3)}</p></div>
                    <div className="bg-white/50 p-5 rounded-[2rem] shadow-inner border border-white/60"><p className="text-[9px] font-black text-slate-400 uppercase mb-2">Live Steps</p><p className="text-4xl font-black text-slate-900 leading-none">{steps}</p></div>
                </div>
                <button onClick={isTracking ? handleFinishProtocol : () => setIsTracking(true)} className={`w-full py-6 rounded-[2.2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all ${isTracking ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900 text-white'}`}>
                    {isTracking ? 'Terminate Session' : `Initialize ${activeTab}`}
                </button>
              </div>
            )}

            {activeTab === 'yoga' && (
              <div className="space-y-4 max-h-[420px] overflow-y-auto scrollbar-hide pr-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic underline decoration-emerald-500 underline-offset-4 mb-4">Select Asana Protocol</p>
                <div className="grid grid-cols-1 gap-3">
                    {YOGA_LIB.map(asana => (
                        <div key={asana.id} onClick={() => setSelectedYoga(asana)} className="bg-white/70 p-5 rounded-[1.8rem] border border-white flex justify-between items-center active:scale-95 transition-all shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shadow-inner"><Activity size={14}/></div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 uppercase italic leading-none">{asana.title}</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{asana.name}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-emerald-500">+{asana.xp} XP</span>
                        </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 4. NEARBY RADIUS HUB (5KM) */}
        <div className="glass-card rounded-[2.8rem] p-7 shadow-sm border-white/30 bg-white/30">
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-xs font-black flex items-center gap-2 text-slate-700 uppercase tracking-widest italic"><Compass size={14} className="text-blue-500 animate-spin-slow" /> Radius Protocols (5KM)</h3>
          </div>
          <div className="space-y-4">
            {nearby.length > 0 ? nearby.map((spot, i) => (
              <motion.div key={i} whileTap={{ scale: 0.98 }} onClick={() => setSelectedSpot(spot)} className="flex items-center justify-between bg-white/50 p-4 rounded-[1.8rem] border border-white/20 active:bg-white shadow-sm cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner"><MapPin size={16} /></div>
                  <div><span className="text-xs font-black text-slate-800 uppercase italic leading-none">{spot.name}</span><p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">{spot.type}</p></div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-blue-600 uppercase italic underline decoration-blue-200">{spot.dist.toFixed(1)}KM</p>
                    <ChevronRight size={14} className="text-slate-200 inline" />
                </div>
              </motion.div>
            )) : (
              <div className="py-12 text-center opacity-30 italic text-[10px] font-bold uppercase tracking-widest border border-dashed border-slate-200 rounded-[2.5rem]">Outside hub radius</div>
            )}
          </div>
        </div>
      </div>

      {/* 5. INDEPENDENT FLOATING AI BUTTON */}
      <motion.button 
        whileTap={{ scale: 0.85 }} onClick={() => router.push('/ai')}
        className="fixed bottom-28 right-6 w-16 h-16 bg-slate-900 text-white rounded-full shadow-[0_25px_60px_rgba(0,0,0,0.4)] flex items-center justify-center z-[100] border-4 border-emerald-400 active:bg-slate-800 transition-colors"
      >
        <Sparkles size={28} className="text-emerald-400" />
      </motion.button>

      {/* --- YOGA INSTRUCTION POP-OUT --- */}
      <AnimatePresence>
        {selectedYoga && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-slate-900/95 backdrop-blur-3xl flex items-center justify-center p-6">
                <div className="bg-white rounded-[4rem] w-full max-w-sm overflow-hidden shadow-2xl relative border border-white/20">
                    <button onClick={() => setSelectedYoga(null)} className="absolute top-8 right-8 p-3 bg-slate-100 rounded-2xl active:scale-75 transition-all"><X size={20}/></button>
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-inner"><Activity size={32}/></div>
                        <h3 className="text-4xl font-black text-slate-900 italic uppercase mb-2 tracking-tighter leading-none">{selectedYoga.title}</h3>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-10">{selectedYoga.name}</p>
                        <div className="bg-slate-50 p-7 rounded-[2.5rem] mb-10 border border-slate-100 text-left">
                             <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest flex items-center gap-2 italic"><Info size={12}/> Protocol Execution</p>
                             <p className="text-xs text-slate-700 font-bold leading-relaxed italic">"{selectedYoga.inst}"</p>
                        </div>
                        <button onClick={() => { logActivity('yoga', selectedYoga.title, selectedYoga.xp); setSelectedYoga(null); }} className="w-full bg-slate-900 text-white py-6 rounded-[2.2rem] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all">Finalize & Index XP</button>
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
