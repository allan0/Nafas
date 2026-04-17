
'use client';

import { useEffect, useState } from 'react';
import { Award, Flame } from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';

const UAE_SPOTS = [
  { name: "Kite Beach Yoga", lat: 25.164, lng: 55.201, activity: "Yoga" },
  { name: "Al Qudra Cycle Track", lat: 24.83, lng: 55.37, activity: "Endurance" },
  { name: "JBR Beach Run", lat: 25.07, lng: 55.13, activity: "Running" }
];

export default function MainDashboard() {
  const [username, setUsername] = useState("Wellness Seeker");
  const [wellnessScore] = useState(87);
  const [nearby, setNearby] = useState<any[]>([]);

  const findNearby = (lat: number, lng: number) => {
    const filtered = UAE_SPOTS.filter(spot => {
        const dist = Math.sqrt(Math.pow(spot.lat - lat, 2) + Math.pow(spot.lng - lng, 2));
        return dist < 0.1; 
    });
    setNearby(filtered);
  };

  useEffect(() => {
    const tg = TelegramWebApp;
    try {
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) {
        setUsername(tg.initDataUnsafe.user.first_name || "Wellness Seeker");
      }

      if (tg.LocationManager) {
        tg.LocationManager.init(() => {
          tg.LocationManager.getLocation((data) => {
            if (data) findNearby(data.latitude, data.longitude);
          });
        });
      }
    } catch (e) {
      console.log("Web environment detected");
    }
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto relative z-10 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Hello, {username} 🌿</h1>
          <p className="text-slate-600">Nafas Wellness AI</p>
        </div>
        <div className="flex items-center gap-3">
          <TonConnectButton />
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 mb-8 shadow-xl text-center">
        <div className="text-6xl font-bold text-emerald-500 mb-2">{wellnessScore}</div>
        <div className="text-sm uppercase tracking-widest text-slate-500">Wellness Score</div>
      </div>

      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 mb-8">
        <h3 className="font-bold mb-2">📍 Nearby UAE Spots</h3>
        {nearby.length > 0 ? (
          nearby.map((spot, i) => (
            <div key={i} className="text-sm p-2 border-b border-white/10 flex justify-between">
              <span>{spot.name}</span>
              <span className="text-emerald-600">{spot.activity}</span>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500">Looking for nearby events...</p>
        )}
      </div>
    </div>
  );
}

