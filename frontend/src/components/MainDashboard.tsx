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
import { useWellnessData } from '@/hooks/useWellnessData';
import Link from 'next/link';

// Your persistent Render Backend
const API_URL = "https://nafas-jur5.onrender.com";

export default function MainDashboard() {
  const [tonConnectUI] = useTonConnectUI();
  
  // Real Persistent Data Hook
  const { xp, vitality, addXp, updateVitality, isLoaded: dataLoaded } = useWellnessData();
  
  const [user, setUser] = useState<any>(null);
  const [nearby, setNearby] = useState<any[]>([]); // Initialized as empty to prevent .map() crashes
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [showProtocol, setShowProtocol] = useState(false);
  const [isLoadingNearby, setIsLoadingNearby] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = TelegramWebApp;
      tg.ready();
      tg.expand();
      
      // Get Real Telegram Profile Info
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }

      // Fetch Real-time Nearby Hub Data
      const fetchNearby = async () => {
        setIsLoadingNearby(true);
        try {
          const res = await fetch(`${API_URL}/nearby`);
          if (!res.ok) throw new Error("API Offline");
          const data = await res.json();
          setNearby(data.spots || []);
        } catch (e) {
          console.error("Using fallback/empty nearby list");
          setNearby([]); 
        } finally {
          setIsLoadingNearby(false);
        }
      };
      fetchNearby();
    }
  }, []);

  // Show a clean loading state until localStorage is read
  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#A5D8F8]">
        <Loader2 className="animate-spin text-white w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full scrollbar-hide pb-32">
      
      {/* 1. TOP BAR: Identity & Wallet LED */}
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
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">
              Welcome, {user?.first_name || 'Seeker'}
            </p>
            <div className="flex items-center gap-1.5">
               <span className="text-sm font-black text-slate-900">{xp}</span>
               <span className="text-[10px] font-bold text-emerald-500 uppercase italic">XP</span>
            </div>
          </div>
        </div>

        {/* System Status: Wallet LED */}
        <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border border-white shadow-sm">
          <motion.div 
            animate={{ opacity: [1, 0.4, 1] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`w-2.5 h-2.5 rounded-full ${
                tonConnectUI.connected 
                ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' 
                : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
            }`}
          />
          <span className="text-[10px] font-black uppercase text-slate-700 tracking-tighter">
            {tonConnectUI.connected ? 'TON Active' : 'No Wallet'}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* 2. REAL VITALITY PROGRESS BAR */}
        <div className="text-center py-4 px-2">
          <div className="flex justify-between items-end mb-3 px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Breathe Vitality</h3>
            <span className="text-sm font-black text-slate-800">{vitality}%</span>
          </div>
          <div className="h-5 w-full bg-white/30 rounded-full overflow-hidden border border-white/50 p-1 shadow-inner">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${vitality}%` }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-500 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>

        {/* 3. NEARBY WELLNESS: Live Data Hub */}
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
          
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-hide">
            {isLoadingNearby ? (
               <div className="py-10 flex flex-col items-center justify-center gap-3">
                 <Loader2 className="animate-spin text-slate-300" />
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Syncing Satellites...</p>
               </div>
            ) : nearby && nearby.length > 0 ? (
              nearby.map((spot, i) => (
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSpot(spot)}
                  key={i} 
                  className="flex items-center justify-between bg-white/50 p-4 rounded-[1.8rem] border border-white/20 shadow-sm active:bg-white/80 transition-all"
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
                  <Navigation size={16} className="text-slate-300 mr-2" />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Scanning UAE landscape...</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. MAIN ACTION: Protocol Launcher */}
        <div className="px-2 pt-2">
            <button 
                onClick={() => setShowProtocol(true)}
                className="w-full bg-slate-900 text-white py-6 rounded-[2.2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-[0.96] transition-all hover:bg-slate-800 border-t border-white/10"
            >
                Begin Breath Protocol
            </button>
        </div>
      </div>

      {/* 5. FLOATING AI COACH BUTTON */}
      <Link href="/ai">
        <motion.div 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-28 right-6 w-16 h-16 bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-center border-4 border-emerald-400 z-50 cursor-pointer"
        >
          <Sparkles className="text-emerald-500" size={24} />
          {/* Notification Dot */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
        </motion.div>
      </Link>

      {/* MODAL LAYER: Logic for Pop-outs */}
      <AnimatePresence>
        {showProtocol && (
          <BreathProtocol 
            onClose={() => setShowProtocol(false)} 
            onComplete={(earnedXp) => {
              addXp(earnedXp); // Real Persistent Save
              updateVitality(4); // Grow Vitality Bar
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
