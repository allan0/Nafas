'use client';

import { motion } from 'framer-motion';
import { X, Navigation, Map as MapIcon, Compass, ExternalLink } from 'lucide-react';
import TelegramWebApp from '@twa-dev/sdk';

interface MapProps {
  spot: { name: string, lat: number, lng: number, activity: string };
  onClose: () => void;
}

export default function WellnessMap({ spot, onClose }: MapProps) {
  // Deep link for Google Maps Navigation
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}&travelmode=driving`;
  
  // Embed URL for a clean Satellite/Street hybrid view
  const embedUrl = `https://maps.google.com/maps?q=${spot.lat},${spot.lng}&t=k&z=17&ie=UTF8&iwloc=&output=embed`;

  const handleNavigation = () => {
    TelegramWebApp.HapticFeedback.impactOccurred('heavy');
    TelegramWebApp.openLink(googleMapsUrl);
  };

  return (
    <motion.div 
      initial={{ y: '100%' }} 
      animate={{ y: 0 }} 
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[70] bg-white flex flex-col overflow-hidden"
    >
      {/* 1. MAP HEADER */}
      <div className="p-6 flex justify-between items-center bg-white border-b border-slate-100 shadow-sm relative z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Compass className="animate-spin-slow" size={20} />
            </div>
            <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">{spot.name}</h2>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    {spot.activity} Protocol Location
                </p>
            </div>
        </div>
        <button 
            onClick={onClose} 
            className="p-3 bg-slate-100 rounded-2xl text-slate-500 active:scale-90 transition-transform"
        >
            <X size={20} strokeWidth={3} />
        </button>
      </div>

      {/* 2. INTERACTIVE VIEWPORT */}
      <div className="flex-1 bg-slate-200 relative">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'contrast(1.1) brightness(0.9)' }}
          loading="lazy"
          allowFullScreen
          src={embedUrl}
        ></iframe>

        {/* Floating Street View Badge */}
        <div className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/20">
            <MapIcon size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Live Satellite Feed</span>
        </div>
      </div>

      {/* 3. ACTION FOOTER */}
      <div className="p-8 bg-white border-t border-slate-100 pb-12">
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Coordinates</p>
                <p className="text-[11px] font-bold text-slate-700">{spot.lat.toFixed(3)}, {spot.lng.toFixed(3)}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Distance</p>
                <p className="text-[11px] font-bold text-slate-700">Calculated on launch</p>
            </div>
        </div>

        <button 
          onClick={handleNavigation}
          className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <Navigation size={18} fill="white" /> Start Protocol Route
        </button>
        
        <p className="text-center mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <ExternalLink size={12} /> External Provider: Google Maps
        </p>
      </div>
    </motion.div>
  );
}
