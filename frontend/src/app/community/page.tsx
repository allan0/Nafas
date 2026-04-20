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

export default function TribePage() {
  const [tonConnectUI] = useTonConnectUI();
  const { events, history, isLoaded } = useWellnessData();
  const [activeTab, setActiveTab] = useState<'hubs' | 'feed'>('hubs');

  // Filter for only Public Events created by the community
  const publicHubs = events.filter(ev => ev.isPublic);

  // Simulated Global Feed (In Phase 3 this will come from a PostgreSQL DB)
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
    // Transaction logic here...
    alert(`Initializing tipping protocol for ${user}...`);
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-transparent pb-32">
      
      {/* 1. TRIBE HEADER */}
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

        {/* Tab Switcher */}
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
          
          {/* TAB: LIVE HUBS (Public Events) */}
          {activeTab === 'hubs' && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="hubs"
                className="space-y-6"
            >
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Hubs in UAE</h2>
                    <span className="bg-emerald-500 w-2 h-2 rounded-full animate-ping" />
                </div>

                {publicHubs.length > 0 ? publicHubs.map(hub => (
                    <motion.div 
                        whileTap={{ scale: 0.98 }}
                        key={hub.id} 
                        className="glass-card p-0 rounded-[2.8rem] overflow-hidden border-white/60 shadow-2xl relative"
                    >
                        <div className="h-44 bg-slate-200 relative group">
                            <img src={hub.banner} className="w-full h-full object-cover" alt="event" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                                <div className="flex items-center gap-2 mb-1">
                                    <Globe className="text-emerald-400" size={12} />
                                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Public Protocol</span>
                                </div>
                                <h3 className="text-white text-xl font-black uppercase italic leading-none">{hub.title}</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                    <MapPin size={12} />
                                    <span className="text-[10px] font-bold uppercase truncate max-w-[120px]">{hub.location || 'UAE Remote'}</span>
                                </div>
                                <div className="flex -space-x-2">
                                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-300" />)}
                                    <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[8px] text-white font-black">+12</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => TelegramWebApp.openLink(`https://www.google.com/maps/search/${hub.location}`)}
                                className="w-full bg-slate-900 text-white py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl"
                            >
                                Join this Hub <ChevronRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                )) : (
                    <div className="py-20 text-center glass-card rounded-[2.5rem] border-dashed border-slate-300 opacity-40">
                        <Globe size={40} className="mx-auto mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest">No Public Hubs Open</p>
                        <p className="text-[9px] font-bold uppercase mt-2">Create one in your Profile</p>
                    </div>
                )}
            </motion.div>
          )}

          {/* TAB: TRIBE FEED (Shared Photos) */}
          {activeTab === 'feed' && (
            <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} key="feed"
                className="space-y-8"
            >
                {feedItems.map((post) => (
                    <div key={post.id} className="glass-card p-0 rounded-[3rem] overflow-hidden border-white/60 shadow-xl bg-white/60">
                        {/* Post Head */}
                        <div className="p-5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center text-xl shadow-inner">
                                    {post.avatar}
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-800 leading-none">@{post.user}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{post.location}</p>
                                </div>
                            </div>
                            <button className="p-2 text-slate-400"><Share2 size={16}/></button>
                        </div>

                        {/* Image */}
                        <div className="h-80 bg-slate-200 relative overflow-hidden group">
                            <img src={post.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="feed" />
                            <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-xl text-white">
                                <Zap size={14} fill="currentColor" className="text-emerald-400" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-sm text-slate-700 font-medium leading-relaxed mb-6 italic">
                                "{post.caption}"
                            </p>
                            
                            <div className="flex gap-2">
                                <button className="flex-[2] bg-rose-50 text-rose-500 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-sm active:bg-rose-100 transition-all">
                                    <Heart size={16} fill="currentColor" /> {post.likes}
                                </button>
                                <button 
                                    onClick={() => handleTip(post.user)}
                                    className="flex-[3] bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                                >
                                    <Gift size={16} /> Tip 50 NAF
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action: Shared Proof (Future Logic) */}
      <motion.div 
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-28 right-6 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center z-50 border-4 border-white"
      >
        <Plus size={28} />
      </motion.div>

    </div>
  );
}
