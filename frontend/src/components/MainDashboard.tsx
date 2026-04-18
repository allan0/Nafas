'use client';
import { useEffect, useState } from 'react';
import { Award, Flame, MapPin } from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';

const API_URL = "https://nafas-backend.onrender.com";

export default function MainDashboard() {
  const [username, setUsername] = useState("Wellness Seeker");
  const [wellnessScore] = useState(87);
  const [nearby, setNearby] = useState<any[]>([]);

  useEffect(() => {
    // 1. Initialize Telegram
    const tg = TelegramWebApp;
    try {
      tg.ready();
      if (tg.initDataUnsafe?.user) {
        setUsername(tg.initDataUnsafe.user.first_name || "Wellness Seeker");
      }
    } catch (e) { console.log("Web View Mode"); }

    // 2. Fetch Nearby Spots from Backend
    const fetchNearby = async () => {
      try {
        const res = await fetch(`${API_URL}/nearby`);
        const data = await res.json();
        setNearby(data.spots);
      } catch (e) { console.log("Backend offline"); }
    };
    fetchNearby();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto relative z-10 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Hello, {username} 🌿</h1>
          <p className="text-slate-600 text-sm">Breathe deep, live better</p>
        </div>
        <TonConnectButton />
      </div>

      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 mb-8 shadow-xl text-center border border-white/50">
        <div className="text-6xl font-bold text-emerald-500 mb-2">{wellnessScore}</div>
        <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">Wellness Score</div>
        
        <div className="mt-6 flex items-center justify-center gap-2 bg-emerald-50 px-4 py-2 rounded-full w-fit mx-auto">
          <Flame className="text-orange-500" size={18} />
          <span className="text-sm font-medium">5-day streak</span>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/20">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-emerald-600" />
          Nearby UAE Spots
        </h3>
        <div className="space-y-3">
          {nearby.length > 0 ? (
            nearby.map((spot, i) => (
              <div key={i} className="bg-white/60 p-4 rounded-2xl flex justify-between items-center">
                <span className="font-medium text-slate-700">{spot.name}</span>
                <span className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full">
                  {spot.activity || 'Event'}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-slate-400 text-sm italic">
              Waking up the server...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
