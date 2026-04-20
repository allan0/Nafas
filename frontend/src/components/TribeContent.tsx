'use client';

import { useState } from 'react';
import { 
  Heart, MessageCircle, Share2, Gift, Play, Users, 
  MapPin, Globe, Zap, Camera, Plus, ExternalLink,
  ChevronRight, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useWellnessData } from '@/hooks/useWellnessData';
import TelegramWebApp from '@twa-dev/sdk';

export default function TribeContent() {
  const [tonConnectUI] = useTonConnectUI();
  const { events, isLoaded } = useWellnessData();
  const [activeTab, setActiveTab] = useState<'hubs' | 'feed'>('hubs');

  const publicHubs = events.filter(ev => ev.isPublic);

  const feedItems = [
    { 
      id: 'f1', 
      user: 'Yogi_Sarah', 
      avatar: '🧘‍♀️', 
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500', 
      caption: 'Sunrise flow at Kite Beach. The humidity is rising, but the breath is steady. 🌬️',
      likes: 124,
      location: 'Kite Beach, Dubai'
    },
    { 
      id: 'f2', 
      user: 'RunMaster_DXB', 
      avatar: '🏃‍♂️', 
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=500', 
      caption: 'Completed the Al Qudra 50km Loop. New PR! Feeling indexed. 💎',
      likes: 89,
      location: 'Al Qudra Cycle Track'
    }
  ];

  const handleTip = async (user: string) => {
    if (!tonConnectUI.connected) {
      alert("Link your TON wallet to tip the Tribe!");
      return;
    }
    alert(`Initializing tipping protocol for ${user}...`);
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-transparent pb-32">
      <div className="p-6 pt-10 bg-white/40 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">The Tribe</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Protocol Social Network</p>
            </div>
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <Search size={20} />
            </div>
        </div>

        <div className="flex bg-slate-200/50 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('hubs')}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'hubs' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}
          >
            Live Hubs
          </button>
          <button 
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'feed' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}
          >
            Tribe Feed
          </button>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'hubs' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="hubs" className="space-y-6">
                {publicHubs.map(hub => (
                    <motion.div whileTap={{ scale: 0.98 }} key={hub.id} className="glass-card p-0 rounded-[2.8rem] overflow-hidden border-white/60 shadow-2xl relative">
                        <div className="h-44 bg-slate-200 relative">
                            <img src={hub.banner} className="w-full h-full object-cover" alt="event" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                                <h3 className="text-white text-xl font-black uppercase italic leading-none">{hub.title}</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <button 
                                onClick={() => TelegramWebApp.openLink(`https://www.google.com/maps/search/${hub.location}`)}
                                className="w-full bg-slate-900 text-white py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl"
                            >
                                Join Hub <ChevronRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
          )}

          {activeTab === 'feed' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} key="feed" className="space-y-8">
                {feedItems.map((post) => (
                    <div key={post.id} className="glass-card p-0 rounded-[3rem] overflow-hidden border-white/60 shadow-xl bg-white/60">
                        <div className="p-5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xl">{post.avatar}</div>
                                <div><h4 className="text-xs font-black text-slate-800">@{post.user}</h4></div>
                            </div>
                        </div>
                        <img src={post.image} className="h-80 w-full object-cover" alt="feed" />
                        <div className="p-6">
                            <p className="text-sm text-slate-700 font-medium mb-6 italic">"{post.caption}"</p>
                            <button onClick={() => handleTip(post.user)} className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg">
                                <Gift size={16} /> Tip 50 NAF
                            </button>
                        </div>
                    </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
