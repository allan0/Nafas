'use client';

import { useEffect, useState } from 'react';
import { Award, Flame, MapPin, Zap } from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';

const API_URL = "https://nafas-backend.onrender.com";

export default function MainDashboard() {
  const [username, setUsername] = useState("Seeker");
  const [wellnessScore] = useState(87);
  const [nearby, setNearby] = useState<any[]>([]);
  const [haptic, setHaptic] = useState<any>(null);

  useEffect(() => {
    // 1. Initialize Telegram Premium Features
    if (typeof window !== 'undefined') {
      const tg = TelegramWebApp;
      tg.ready();
      tg.expand(); // Forces full-screen "App" mode
      tg.enableClosingConfirmation(); // Prevents accidental swipes
      setHaptic(tg.HapticFeedback);
      
      if (tg.initDataUnsafe?.user) {
        setUsername(tg.initDataUnsafe.user.first_name || "Seeker");
      }
    }

    // 2. Fetch Nearby Spots from Backend
    const fetchNearby = async () => {
      try {
        const res = await fetch(`${API_URL}/nearby`);
        const data = await res.json();
        setNearby(data.spots);
      } catch (e) {
        console.log("Backend offline");
      }
    };
    fetchNearby();
  }, []);

  const triggerActivity = () => {
    // Premium Feel: Vibrate the phone on click
    haptic?.notificationOccurred('success');
    alert("Breath session started... 🌬️");
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden scrollbar-hide pb-24">
      
      {/* Dynamic Atmospheric Background (Real Clouds effect) */}
      <div className="aura-blur w-[400px] h-[400px] bg-white top-[-100px] left-[-50px]" />
      <div className="aura-blur w-[300px] h-[300px] bg-emerald-200 bottom-[100px] right-[-50px] opacity-40" />

      <div className="p-6 relative z-10 space-y-8">
        
        {/* Header: Minimalist & Clean */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-light text-slate-900 tracking-tight">
              {username} <span className="text-xl opacity-50">/ Nafas</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">UAE Mindful Protocol</p>
          </div>
          <TonConnectButton />
        </div>

        {/* Premium Emoji Status Bar */}
        <div className="glass-card rounded-[2rem] p-4 flex items-center justify-between border-white/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/50 rounded-2xl flex items-center justify-center text-xl shadow-inner">
              🧘
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Status: Deep Flow</p>
              <p className="text-[9px] text-slate-500">Connected to TON</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black">
            <Zap size={10} fill="currentColor" /> PREMIUM
          </div>
        </div>

        {/* Main Score: Focus on Typography */}
        <div className="py-8 text-center">
          <div className="relative inline-block">
             <span className="text-9xl font-thin tracking-tighter text-slate-900 leading-none">
               {wellnessScore}
             </span>
             <span className="absolute -top-2 -right-6 text-xl font-bold text-emerald-500">%</span>
          </div>
          <p className="text-xs tracking-[0.4em] text-slate-400 uppercase mt-4">Breath Vitality</p>
        </div>

        {/* Nearby Map Card */}
        <div className="glass-card rounded-[2.5rem] p-6 space-y-6">
          <h3 className="text-sm font-bold flex items-center gap-2 text-slate-700">
            <MapPin size={16} className="text-emerald-500" />
            Nearby Wellness <span className="opacity-30">/ UAE</span>
          </h3>
          
          <div className="space-y-3">
            {nearby.length > 0 ? (
              nearby.map((spot, i) => (
                <div key={i} className="flex items-center justify-between bg-white/30 p-4 rounded-3xl border border-white/20">
                  <span className="text-sm font-semibold">{spot.name}</span>
                  <div className="text-[10px] font-bold text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    {spot.activity}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-slate-400 text-xs italic">Syncing with Dubai landmarks...</div>
            )}
          </div>
        </div>

        {/* Primary Action */}
        <button 
          onClick={triggerActivity}
          className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-bold shadow-2xl active:scale-[0.98] transition-all hover:bg-slate-800"
        >
          Begin Breath Protocol
        </button>

      </div>
    </div>
  );
}
