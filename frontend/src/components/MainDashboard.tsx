'use client';

import { useEffect, useState } from 'react';
import { Award, Flame, MapPin, Zap, Wind } from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';

const API_URL = "https://nafas-backend.onrender.com";

export default function MainDashboard() {
  const [username, setUsername] = useState("Seeker");
  const [wellnessScore] = useState(87); // Will be dynamic from DB in future step
  const [nearby, setNearby] = useState<any[]>([]);
  const [haptic, setHaptic] = useState<any>(null);
  const [loadingNearby, setLoadingNearby] = useState(true);

  useEffect(() => {
    // Initialize Telegram Mini App
    if (typeof window !== 'undefined') {
      const tg = TelegramWebApp;
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
      
      setHaptic(tg.HapticFeedback);

      // Get real Telegram user data
      if (tg.initDataUnsafe?.user) {
        setUsername(tg.initDataUnsafe.user.first_name || "Wellness Seeker");
      }
    }

    // Fetch real nearby spots from backend
    const fetchNearby = async () => {
      setLoadingNearby(true);
      try {
        const res = await fetch(`${API_URL}/nearby`);
        const data = await res.json();
        setNearby(data.spots || []);
      } catch (e) {
        console.error("Failed to fetch nearby spots:", e);
        // Graceful fallback
        setNearby([
          { name: "Kite Beach Yoga", activity: "Yoga", location: "Dubai" },
          { name: "Al Qudra Cycle Track", activity: "Cycling", location: "Dubai" }
        ]);
      } finally {
        setLoadingNearby(false);
      }
    };

    fetchNearby();
  }, []);

  const triggerBreathProtocol = () => {
    if (haptic) {
      haptic.impactOccurred('heavy');
      setTimeout(() => haptic.notificationOccurred('success'), 300);
    }
    
    // Premium feel: Start breath session
    alert("🌬️ Breath Protocol Started\n\nInhale deeply for 4 seconds...\nHold for 4...\nExhale slowly for 6...\n\nYou're doing great. Stay consistent!");
    
    // Future: Could trigger a guided breathing animation or audio
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden scrollbar-hide pb-24">
      
      {/* Dynamic Atmospheric Background (Cloud/Aura Effect) */}
      <div className="aura-blur w-[400px] h-[400px] bg-white top-[-100px] left-[-50px]" />
      <div className="aura-blur w-[300px] h-[300px] bg-emerald-200 bottom-[100px] right-[-50px] opacity-40" />

      <div className="p-6 relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-light text-slate-900 tracking-tight">
              {username} <span className="text-xl opacity-50">/ Nafas</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">UAE Mindful Protocol</p>
          </div>
          <TonConnectButton />
        </div>

        {/* Premium Status Bar */}
        <div className="glass-card rounded-[2rem] p-4 flex items-center justify-between border-white/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/50 rounded-2xl flex items-center justify-center text-xl shadow-inner">
              🧘
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Status: Deep Flow</p>
              <p className="text-[9px] text-slate-500">Connected to TON • UAE Ready</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black">
            <Zap size={10} fill="currentColor" /> PREMIUM
          </div>
        </div>

        {/* Wellness Score - Elegant Typography */}
        <div className="py-8 text-center">
          <div className="relative inline-block">
             <span className="text-9xl font-thin tracking-tighter text-slate-900 leading-none">
               {wellnessScore}
             </span>
             <span className="absolute -top-2 -right-6 text-xl font-bold text-emerald-500">%</span>
          </div>
          <p className="text-xs tracking-[0.4em] text-slate-400 uppercase mt-4">Breath Vitality Score</p>
          <p className="text-[10px] text-emerald-600 mt-1">4-day streak 🔥</p>
        </div>

        {/* Nearby Wellness Spots - Live from Backend */}
        <div className="glass-card rounded-[2.5rem] p-6 space-y-6">
          <h3 className="text-sm font-bold flex items-center gap-2 text-slate-700">
            <MapPin size={16} className="text-emerald-500" />
            Nearby Wellness <span className="opacity-30">/ UAE</span>
          </h3>
          
          <div className="space-y-3">
            {loadingNearby ? (
              <div className="text-center py-8 text-slate-400 text-xs">Finding wellness spots near you...</div>
            ) : nearby.length > 0 ? (
              nearby.map((spot, i) => (
                <div key={i} className="flex items-center justify-between bg-white/30 p-4 rounded-3xl border border-white/20 hover:bg-white/50 transition">
                  <div>
                    <span className="text-sm font-semibold block">{spot.name}</span>
                    <span className="text-xs text-slate-500">{spot.location}</span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    {spot.activity}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs italic">No nearby spots found at the moment.</div>
            )}
          </div>
        </div>

        {/* Primary Action - Breath Protocol */}
        <button 
          onClick={triggerBreathProtocol}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-[2rem] font-bold shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
        >
          <Wind className="group-active:rotate-12 transition" size={24} />
          Begin Breath Protocol
        </button>

        {/* Quick Tip */}
        <div className="text-center">
          <p className="text-[10px] text-slate-500">
            Consistent daily breath work improves your score by up to 12% in 7 days
          </p>
        </div>
      </div>
    </div>
  );
}
