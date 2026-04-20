'use client';
import { motion } from 'framer-motion';
import { X, Navigation2, Map as MapIcon, Camera } from 'lucide-react';

interface MapProps {
  spot: { name: string, lat: number, lng: number, activity: string };
  onClose: () => void;
}

export default function WellnessMap({ spot, onClose }: MapProps) {
  // We use the Embed API. Note: For a real production app, you'd use a Google API Key.
  // This URL format works for previewing locations.
  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${spot.lat},${spot.lng}&zoom=18&maptype=satellite`;
  
  // Direct link for Street View / Navigation
  const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;

  return (
    <motion.div 
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[70] bg-white flex flex-col"
    >
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b">
        <div>
          <h2 className="text-xl font-black text-slate-900">{spot.name}</h2>
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">{spot.activity} Center</p>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500"><X /></button>
      </div>

      {/* Map Viewport */}
      <div className="flex-1 bg-slate-200 relative">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?q=${spot.lat},${spot.lng}&output=embed&layer=c`}
        ></iframe>
        
        {/* Floating Overlay for Navigation */}
        <div className="absolute bottom-10 left-0 right-0 px-6">
          <div className="glass-card p-6 rounded-[2rem] shadow-2xl flex gap-4">
            <button 
              onClick={() => window.open(navigationUrl, '_blank')}
              className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2"
            >
              <Navigation2 size={16} fill="white" /> Start Navigation
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
