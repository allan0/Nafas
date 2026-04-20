'use client';

import { useEffect, useState } from 'react';
import { 
  Award, 
  MapPin, 
  Zap, 
  Sparkles, 
  User, 
  Globe, 
  Loader2, 
  Navigation,
  ExternalLink 
} from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';
import BreathProtocol from './BreathProtocol';
import WellnessMap from './WellnessMap';
import { useWellnessData } from '@/hooks/useWellnessData'; // Real Persistence Hook
import Link from 'next/link';

// Your updated Render URL
const API_URL = "https://nafas-jur5.onrender.com";

export default function MainDashboard() {
  const [tonConnectUI] = useTonConnectUI();
  const { xp, addXp } = useWellnessData(); // Persistent XP from localStorage
  const [user, setUser] = useState<any>(null);
  const [nearby, setNearby] = useState<any[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [showProtocol, setShowProtocol] = useState(false);
  const [vitality, setVitality] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = TelegramWebApp;
      tg.ready();
      tg.expand();
      
      // Load user data from Telegram profile
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
      
      // Animate the Vitality Bar on load (starts from 0 to 87)
      setTimeout(() => setVitality(87), 500);

      // Fetch Real-time Nearby Data from Backend
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`${API_URL}/nearby`);
          if (!res.ok) throw new Error("404");
          const data = await res.json();
          setNearby(data.spots || []);
        } catch (e) { 
          console.error("Backend offline or 404");
          setNearby([]); // Fallback to empty to prevent crash
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full scrollbar-hide pb-32">
      
      {/* 1. TOP BAR: Profile, Persistent XP, Wallet LED */}
      <div className="p-6 flex justify-between items-center bg-white/40 backdrop-blur-xl sticky top-0 z-40 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl border-2 border-white overflow-hidden shadow-md bg-slate-100 flex items-center justify-center">
            {user?.photo_url ? (
              <img src={user.photo_url} alt="pfp" className="w-full h-full object-cover" />
            ) : (
              <User className="text-slate-400" size={20} />
            )}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Status: Active</p>
            <div className="flex items-center gap-1.5">
               <span className="text-sm font-black text-slate-900">{xp}</span>
               <span className="text-[10px] font-bold text-emerald-500 uppercase">XP</span>
            </div>
          </div>
        </div>

        {/* Wallet LED Indicator */}
        <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border border-white shadow-sm">
          <motion.div 
            animate={{ 
              opacity: [1, 0.4, 1],
              scale: tonConnectUI.connected ? [1, 1.2, 1] : [1, 1, 1]
            }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`w-2.5 h-2.5 rounded-full ${
                tonConnectUI.connected 
                ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' 
                : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
            }`}
          />
          <span className="text-[10px] font-black uppercase text-slate-700 tracking-tighter">
            {tonConnectUI.connected ? 'TON Link' : 'No Link'}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* 2. VITALITY PROGRESS: Animated Rounded Bar */}
        <div className="text-center py-4 px-2">
          <div className="flex justify-between items-end mb-3 px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Breath Capacity</h3>
            <span className="text-sm font-black text-slate-800">{vitality}%</span>
          </div>
          <div className="h-5 w-full bg-white/30 rounded-full overflow-hidden border border-white/50 p-1">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${vitality}%` }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-500 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>

        {/* 3. NEARBY WELLNESS: Real-Time Map Data */}
        <div className="glass-card rounded-[2.5rem] p-6 border-white/50 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black flex items-center gap-2 text-slate-700 uppercase tracking-widest">
              <Globe size={14} className="text-blue-500" /> UAE Live Hub
            </h3>
            <button 
              onClick={() => TelegramWebApp.openLink(`https://www.google.com/maps/search/wellness+centers+near+me`)}
              className="flex items-center gap-1 text-[9px] font-black text-blue-600 bg-blue-500/10 px-3 py-2 rounded-xl uppercase transition active:scale-95"
            >
              Pop Map <ExternalLink size={10} />
            </button>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-hide">
            {isLoading ? (
               <div className="py-10 flex flex-col items-center justify-center gap-3">
                 <Loader2 className="animate-spin text-slate-300" />
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pinging Dubai Satellites...</p>
               </div>
            ) : nearby && nearby.length > 0 ? (
              nearby.map((spot, i) => (
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSpot(spot)}
                  key={i} 
                  className="flex items-center justify-between bg-white/50 p-4 rounded-[1.5rem] border border-white/20 shadow-sm active:bg-white/80 transition-all"
                >
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                        <MapPin size={18} />
                      </div>
                      <div>
                          <span className="text-sm font-bold block text-slate-800 leading-tight mb-0.5">{spot.name}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{spot.activity}</span>
                      </div>
                  </div>
                  <Navigation size={16} className="text-slate-300" />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Searching Desert Oases...</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. CALL TO ACTION: Immersive Protocol */}
        <div className="px-2 pt-4">
            <button 
                onClick={() => setShowProtocol(true)}
                className="w-full bg-slate-900 text-white py-6 rounded-[2.2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-[0.96] transition-all hover:bg-slate-800 border-t border-white/10"
            >
                Begin Breath Protocol
            </button>
        </div>
      </div>

      {/* 5. FLOATING AI BUTTON: Only on Home */}
      <Link href="/ai">
        <motion.div 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-28 right-6 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-emerald-400 z-50 cursor-pointer overflow-visible"
        >
          <Sparkles className="text-emerald-500" size={24} />
          {/* Pulsing notification indicator */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
        </motion.div>
      </Link>

      {/* MODAL LAYER: Logic for pop-ups */}
      <AnimatePresence>
        {showProtocol && (
          <BreathProtocol 
            onClose={() => setShowProtocol(false)} 
            onComplete={(earnedXp) => {
              addXp(earnedXp); // Persistent XP Update
              setVitality(v => Math.min(100, v + 4)); // Visual UI boost
              TelegramWebApp.HapticFeedback.notificationOccurred('success');
            }} 
          />
        )}
        {selectedSpot && (
          <WellnessMap spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
