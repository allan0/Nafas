'use client';
import { useEffect, useState } from 'react';
import { Award, MapPin, Zap, Sparkles, User, Globe, Loader2, Navigation } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';
import BreathProtocol from './BreathProtocol';
import WellnessMap from './WellnessMap';
import Link from 'next/link';

const API_URL = "https://nafas-jur5.onrender.com";

export default function MainDashboard() {
  const [tonConnectUI] = useTonConnectUI();
  const [user, setUser] = useState<any>(null);
  const [xp, setXp] = useState(1250);
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
      if (tg.initDataUnsafe?.user) setUser(tg.initDataUnsafe.user);
      
      setTimeout(() => setVitality(87), 500);

      const fetchData = async () => {
        try {
          const res = await fetch(`${API_URL}/nearby`);
          const data = await res.json();
          setNearby(data.spots || []);
        } catch (e) { console.error("Offline"); }
        finally { setIsLoading(false); }
      };
      fetchData();
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full scrollbar-hide pb-32">
      {/* 1. Header with Wallet LED & PFP */}
      <div className="p-6 flex justify-between items-center bg-white/30 backdrop-blur-xl sticky top-0 z-40 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl border-2 border-white overflow-hidden shadow-lg">
            {user?.photo_url ? <img src={user.photo_url} alt="pfp" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center"><User className="text-slate-400" /></div>}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wellness XP</p>
            <p className="text-sm font-black text-slate-900">{xp}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-white shadow-sm">
          <motion.div 
            animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
            className={`w-2.5 h-2.5 rounded-full ${tonConnectUI.connected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`}
          />
          <span className="text-[10px] font-black uppercase text-slate-700">TON</span>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* 2. Vitality Progress Bar */}
        <div className="text-center py-4">
          <div className="flex justify-between items-end mb-3 px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Breath Vitality</h3>
            <span className="text-sm font-black text-slate-700">{vitality}%</span>
          </div>
          <div className="h-4 w-full bg-white/40 rounded-full overflow-hidden border border-white/50 p-0.5">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${vitality}%` }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full shadow-inner"
            />
          </div>
        </div>

        {/* 3. Nearby Wellness Section */}
        <div className="glass-card rounded-[2.5rem] p-6 border-white/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black flex items-center gap-2 text-slate-700 uppercase tracking-widest">
              <Globe size={14} className="text-blue-500" /> UAE Live Hub
            </h3>
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
               <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-slate-300" /></div>
            ) : nearby.map((spot, i) => (
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSpot(spot)}
                key={i} 
                className="flex items-center justify-between bg-white/60 p-4 rounded-2xl border border-white/20 shadow-sm"
              >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><MapPin size={18} /></div>
                    <div>
                        <span className="text-sm font-bold block text-slate-800">{spot.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{spot.activity}</span>
                    </div>
                </div>
                <Navigation size={16} className="text-slate-300" />
              </motion.div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setShowProtocol(true)}
          className="w-full bg-slate-900 text-white py-6 rounded-[2.2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
        >
          Begin Breath Protocol
        </button>
      </div>

      {/* Floating AI Button */}
      <Link href="/ai">
        <motion.div 
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          className="fixed bottom-10 right-6 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-emerald-400 z-50 cursor-pointer"
        >
          <Sparkles className="text-emerald-500" size={24} />
          <div className="absolute top-0 right-0 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
        </motion.div>
      </Link>

      {/* Modals */}
      <AnimatePresence>
        {showProtocol && (
          <BreathProtocol onClose={() => setShowProtocol(false)} onComplete={(newXp) => { setXp(prev => prev + newXp); setVitality(v => Math.min(100, v + 5)); }} />
        )}
        {selectedSpot && (
          <WellnessMap spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
