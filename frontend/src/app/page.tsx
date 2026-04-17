'use client';
import { useEffect, useState } from 'react';
import TelegramWebApp from '@twa-dev/sdk';

const UAE_SPOTS = [
  { name: "Kite Beach Yoga", lat: 25.164, lng: 55.201, activity: "Yoga" },
  { name: "Al Qudra Cycle Track", lat: 24.83, lng: 55.37, activity: "Endurance" },
  { name: "JBR Beach Run", lat: 25.07, lng: 55.13, activity: "Running" }
];

export default function NearbyRecommendations() {
  const [nearby, setNearby] = useState<any[]>([]);

  useEffect(() => {
    // 1. Request Location from Telegram
    if (TelegramWebApp.LocationManager) {
      TelegramWebApp.LocationManager.init(() => {
        const userLoc = TelegramWebApp.LocationManager.getLocation();
        if (userLoc) {
          findNearby(userLoc.latitude, userLoc.longitude);
        }
      });
    } else {
      // Fallback for browser testing
      navigator.geolocation.getCurrentPosition((pos) => {
        findNearby(pos.coords.latitude, pos.coords.longitude);
      });
    }
  }, []);

  const findNearby = (lat: number, lng: number) => {
    // Simple Haversine or distance logic to find spots within 10km
    const filtered = UAE_SPOTS.filter(spot => {
        const dist = Math.sqrt(Math.pow(spot.lat - lat, 2) + Math.pow(spot.lng - lng, 2));
        return dist < 0.1; // roughly 10km
    });
    setNearby(filtered);
  };

  return (
    <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
      <h3 className="font-bold mb-2">📍 Nearby in UAE</h3>
      {nearby.length > 0 ? (
        nearby.map((spot, i) => (
          <div key={i} className="text-sm p-2 border-b border-white/10 flex justify-between">
            <span>{spot.name}</span>
            <span className="text-emerald-600">{spot.activity}</span>
          </div>
        ))
      ) : (
        <p className="text-xs text-slate-500">Finding nearby wellness events...</p>
      )}
    </div>
  );
}
