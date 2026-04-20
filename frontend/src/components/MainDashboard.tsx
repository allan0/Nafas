'use client';

import { useEffect, useState } from 'react';
import { Award, Flame, MapPin, Zap, Sparkles, User, Globe, Loader2 } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';
import BreathProtocol from './BreathProtocol';
import Link from 'next/link';

// Your updated Render URL
const API_URL = "https://nafas-jur5.onrender.com";

export default function MainDashboard() {
  const [tonConnectUI] = useTonConnectUI();
  const [user, setUser] = useState<any>(null);
  const [xp, setXp] = useState(1250);
  const [nearby, setNearby] = useState<any[]>([]); // Initialized as empty array to prevent .map() crash
  const [showProtocol, setShowProtocol] = useState(false);
  const [vitality, setVitality] = useState(0);
  const [isLoadingNearby, setIsLoadingNearby] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = TelegramWebApp;
      tg.ready();
      tg.expand();
      
      // Load user data from Telegram
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
      
      // Animate the Vitality Bar on load
      setTimeout(() => setVitality(87), 500);

      // Fetch Live Nearby Data with Error Handling
      const getNearbyData = async () => {
        setIsLoadingNearby(true);
        try {
          const res = await fetch(`${API_URL}/nearby`);
          if (!res.ok) throw new Error("Backend responded with error");
          const data = await res.json();
          // Safety: ensure data.spots exists and is an array
          setNearby(data.spots || []); 
        } catch (e) { 
          console.error("Nearby data offline or 404. Using fallback list."); 
          // Fallback UI data so the app doesn't look empty if API is waking up
          setNearby([]);
        } finally {
          setIsLoadingNearby(false);
        }
      };
      getNearbyData();
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full scrollbar-hide pb-32">
      
      {/* 1. TOP BAR: Profile, XP, Wallet LED */}
      <div className="p-6 flex justify-between items-center bg-white/20 backdrop-blur-md sticky top-0 z-40 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl border-2 border-white overflow-hidden bg-slate-100 shadow-inner flex items-center justify-center">
            {user?.photo_url ? (
              <img src={user.photo_url} alt="pfp" className="w-full h-full object-cover" />
            ) : (
              <User className="text-slate-400" size={20} />
            )}
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nafas Protocol</p>
            <p className="text-sm font-black text-slate-900 flex items-center gap-1">
              {xp} <span className="text-[10px] text-emerald-500 italic font-bold">XP</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Wallet LED Indicator */}
          <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-2xl border border-white/50 shadow-sm">
            <motion.div 
              animate={{ 
                opacity: [1, 0.4, 1],
                scale: tonConnectUI.connected ? [1, 1.2, 1] : [1, 1, 1]
              }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className={`w-2.5 h-2.5 rounded-full ${tonConnectUI.connected ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'}`}
            />
            <span className="text-[10px] font-black uppercase text-slate-800 tracking-tighter">
              {tonConnectUI.connected ? 'Wallet On' : 'Wallet Off'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* 2. PROGRESS BAR: Moving Vitality */}
        <div className="text-center py-6">
          <div className="flex justify-between items-end mb-3 px-2">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Vitality Capacity</h3>
             <span className="text-sm font-black text-slate-800">{vitality}%</span>
          </div>
          
          <div className="relative w-full h-6 bg-white/30 rounded-3xl overflow-hidden border border-white/50 p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${vitality}%` }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="h-full rounded-2xl bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-500 shadow-lg relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>

        {/* 3. NEARBY: Real Data Map Feature */}
        <div className="glass-card rounded-[2.5rem] p-6 border-white/40">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black flex items-center gap-2 text-slate-700 uppercase tracking-widest">
              <Globe size={14} className="text-blue-500" />
              UAE Live Map
            </h3>
            <button 
              onClick={() => TelegramWebApp.openLink(`https://www.google.com/maps/search/wellness+near+me/`)}
              className="text-[9px] font-black text-blue-600 bg-blue-500/10 px-4 py-2 rounded-xl uppercase tracking-tighter active:scale-95 transition"
            >
              Open Full Map
            </button>
          </div>
          
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1 scrollbar-hide">
            {isLoadingNearby ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Loader2 className="animate-spin text-slate-300" />
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Syncing with Dubai Satellite...</p>
              </div>
            ) : nearby && nearby.length > 0 ? (
              nearby.map((spot, i) => (
                <motion.div 
                  whileTap={{ scale: 0.97 }}
                  onClick={() => TelegramWebApp.openLink(`https://www.google.com/maps?q=${spot.lat},${spot.lng}`)}
                  key={i} 
                  className="flex items-center justify-between bg-white/50 p-4 rounded-[1.5rem] border border-white/20 active:bg-white/80 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <MapPin size={14} className="text-emerald-500" />
                    </div>
                    <div>
                        <span className="text-sm font-bold block text-slate-800 leading-none mb-1">{spot.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Wellness Spot</span>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter">
                    {spot.activity}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No activities nearby</p>
                <p className="text-[9px] text-slate-300 mt-1">Try moving to a more active area</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. PRIMARY ACTION BUTTON */}
        <div className="px-2">
            <button 
                onClick={() => setShowProtocol(true)}
                className="w-full bg-slate-900 text-white py-6 rounded-[2.2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-[0.96] transition-all hover:bg-slate-800 border-t border-white/10"
            >
                Begin Breath Protocol
            </button>
        </div>
      </div>

      {/* 5. FLOATING AI BUTTON */}
      <Link href="/ai">
        <motion.div 
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          className="fixed bottom-28 right-6 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-emerald-400 z-50 cursor-pointer"
        >
          <Sparkles className="text-emerald-500" size={24} />
          {/* Unread dot */}
          <div className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
        </motion.div>
      </Link>

      {/* 6. MODAL: Breath Protocol */}
      <AnimatePresence>
        {showProtocol && (
          <BreathProtocol 
            onClose={() => setShowProtocol(false)} 
            onComplete={(newXp) => {
              setXp(prev => prev + newXp);
              setVitality(v => Math.min(100, v + 3));
              TelegramWebApp.HapticFeedback.notificationOccurred('success');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
