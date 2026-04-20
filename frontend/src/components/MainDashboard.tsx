'use client';
import { useEffect, useState } from 'react';
import { Award, Flame, MapPin, Zap, Sparkles, User, Globe } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';
import BreathProtocol from './BreathProtocol';
import Link from 'next/link';

const API_URL = "https://nafas-jur5.onrender.com";

export default function MainDashboard() {
  const [tonConnectUI] = useTonConnectUI();
  const [user, setUser] = useState<any>(null);
  const [xp, setXp] = useState(1250);
  const [nearby, setNearby] = useState<any[]>([]);
  const [showProtocol, setShowProtocol] = useState(false);
  const [vitality, setVitality] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = TelegramWebApp;
      tg.ready();
      setUser(tg.initDataUnsafe?.user);
      
      // Animate the Vitality Bar on load
      setTimeout(() => setVitality(87), 500);

      // Fetch Live Nearby Data
      const getNearbyData = async () => {
        try {
          const res = await fetch(`${API_URL}/nearby`);
          const data = await res.json();
          setNearby(data.spots);
        } catch (e) { console.error("Nearby data offline"); }
      };
      getNearbyData();
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full scrollbar-hide pb-32">
      {/* 1. TOP BAR: Profile, XP, Wallet LED */}
      <div className="p-6 flex justify-between items-center bg-white/20 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200">
            {user?.photo_url ? <img src={user.photo_url} alt="pfp" /> : <User className="p-2 text-slate-400" />}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Wellness XP</p>
            <p className="text-sm font-black text-slate-900">{xp}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Wallet LED Indicator */}
          <div className="flex items-center gap-2 bg-white/40 px-3 py-1.5 rounded-full border border-white/30 shadow-sm">
            <motion.div 
              animate={{ opacity: [1, 0.4, 1] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={`w-2.5 h-2.5 rounded-full ${tonConnectUI.connected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'}`}
            />
            <span className="text-[9px] font-black uppercase text-slate-700">TON</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* 2. PROGRESS BAR: Moving Vitality */}
        <div className="text-center py-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Breath Vitality</h3>
          <div className="relative w-full h-4 bg-white/30 rounded-full overflow-hidden border border-white/50">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${vitality}%` }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-500 relative"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </motion.div>
          </div>
          <p className="text-5xl font-black text-slate-800 mt-4 tracking-tighter">{vitality}%</p>
        </div>

        {/* 3. NEARBY: Real Data Map Feature */}
        <div className="glass-card rounded-[2.5rem] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-700 uppercase tracking-tight">
              <Globe size={16} className="text-blue-500" />
              UAE Wellness Map
            </h3>
            <button 
              onClick={() => TelegramWebApp.openLink(`https://www.google.com/maps/search/wellness+near+me/`)}
              className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl uppercase"
            >
              Pop Map
            </button>
          </div>
          
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
            {nearby.map((spot, i) => (
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => TelegramWebApp.openLink(`https://www.google.com/maps?q=${spot.lat},${spot.lng}`)}
                key={i} 
                className="flex items-center justify-between bg-white/40 p-4 rounded-2xl border border-white/20 active:bg-white/60 transition-all"
              >
                <div>
                    <span className="text-sm font-bold block text-slate-800">{spot.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium tracking-tight">Nearby UAE Activity</span>
                </div>
                <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg shadow-emerald-500/20">
                  {spot.activity}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setShowProtocol(true)}
          className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-bold shadow-2xl active:scale-[0.98] transition-all hover:bg-slate-800"
        >
          Begin Breath Protocol
        </button>
      </div>

      {/* 4. FLOATING AI BUTTON */}
      <Link href="/ai">
        <motion.div 
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          className="fixed bottom-28 right-6 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-emerald-400 z-50 cursor-pointer"
        >
          <Sparkles className="text-emerald-500" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
        </motion.div>
      </Link>

      {/* 5. MODAL: Breath Protocol */}
      <AnimatePresence>
        {showProtocol && (
          <BreathProtocol 
            onClose={() => setShowProtocol(false)} 
            onComplete={(newXp) => {
              setXp(prev => prev + newXp);
              setVitality(v => Math.min(100, v + 2));
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
