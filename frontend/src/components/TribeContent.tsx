'use client';

import { useState } from 'react';
import { 
  Heart, Share2, Gift, Play, Users, MapPin, Globe, Zap, 
  Camera, Plus, ExternalLink, ChevronRight, X, 
  Video, Edit3, Trash2, ShieldCheck, Send, Info, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useWellnessData, WellnessEvent } from '@/hooks/useWellnessData';
import TelegramWebApp from '@twa-dev/sdk';

export default function TribeContent() {
  const [tonConnectUI] = useTonConnectUI();
  const { events, history, logActivity, isLoaded } = useWellnessData();
  
  const [activeTab, setActiveTab] = useState<'feed' | 'hubs'>('feed');
  const [showPostModal, setShowPostModal] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);

  // --- MOCK COMMUNITY DATA (Bio-Indexed Users) ---
  const [posts, setPosts] = useState([
    { 
        id: 'p1', user: 'Sarah_DXB', avatar: '🧘', 
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600', 
        protocol: 'Sitali Pranayama',
        caption: 'Cooling breath protocol active at Kite Beach. Core temp down by 2 degrees. 🌬️',
        likes: 42, location: 'Jumeirah', verified: true 
    },
    { 
        id: 'p2', user: 'Zayed_Protocol', avatar: '🏃', 
        image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600', 
        protocol: 'Zone 2 Endurance',
        caption: 'Evening 12k at Al Qudra. Metabolism optimized. 💎',
        likes: 128, location: 'Al Qudra', verified: true 
    }
  ]);

  const [newPost, setNewPost] = useState({ caption: '', location: '' });

  const handleBroadcastProof = () => {
    if (!newPost.caption) return;
    const post = {
      id: Date.now().toString(),
      user: 'Architect_You',
      avatar: '👤',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600',
      protocol: 'Manual Alignment',
      caption: newPost.caption,
      likes: 0,
      location: newPost.location || 'UAE Hub',
      verified: true
    };
    setPosts([post, ...posts]);
    setShowPostModal(false);
    setNewPost({ caption: '', location: '' });
    
    // XP Reward for community engagement
    logActivity('task', 'Tribe Proof Broadcast', 30);
    
    try {
        TelegramWebApp.HapticFeedback.notificationOccurred('success');
    } catch (e) { console.log("Proof indexed."); }
  };

  const handleTip = (user: string) => {
    if (!tonConnectUI.connected) {
      TelegramWebApp.showAlert("Please link your TON Wallet in the 'Self' tab to tip the tribe.");
      return;
    }
    
    TelegramWebApp.showConfirm(`Send 50 $NAF Tip to @${user}?`, (confirmed) => {
        if (confirmed) {
            // Logic for blockchain transaction goes here
            TelegramWebApp.showPopup({
                title: 'Transaction Initialized',
                message: 'Broadcasting tip to the TON blockchain node.',
                buttons: [{ type: 'ok' }]
            });
        }
    });
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-transparent pb-44"> 
      
      {/* 1. TRIBE HEADER */}
      <div className="p-6 pt-10 bg-white/40 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">The Tribe</h1>
                <div className="flex items-center gap-1.5 mt-1">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decentralized Protocol</p>
                </div>
            </div>
            <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLiveMode(true)}
                className="relative w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-500/20 border-t border-white/20"
            >
                <Video size={22} fill="white" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                </span>
            </motion.button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/50 p-1 rounded-2xl">
          <button onClick={() => setActiveTab('feed')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'feed' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Tribe Feed</button>
          <button onClick={() => setActiveTab('hubs')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'hubs' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Live Hubs</button>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          
          {/* TAB: PROTOCOL FEED */}
          {activeTab === 'feed' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="feed" className="space-y-10">
                {posts.map((post) => (
                    <div key={post.id} className="glass-card p-0 rounded-[3rem] overflow-hidden border-white/60 shadow-2xl bg-white/60">
                        <div className="p-6 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black italic border-2 border-white shadow-lg">{post.avatar}</div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <h4 className="text-sm font-black text-slate-900 leading-none">@{post.user}</h4>
                                        {post.verified && <ShieldCheck size={12} className="text-blue-500" />}
                                    </div>
                                    <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1 tracking-widest">{post.location}</p>
                                </div>
                            </div>
                            <Share2 size={18} className="text-slate-300" />
                        </div>

                        <div className="mx-4 relative rounded-[2.5rem] overflow-hidden border-4 border-white aspect-[4/3] shadow-xl">
                            <img src={post.image} className="w-full h-full object-cover" alt="proof" />
                            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">{post.protocol}</span>
                            </div>
                        </div>

                        <div className="p-8 pt-6">
                            <p className="text-sm text-slate-800 font-medium italic mb-8 leading-relaxed">"{post.caption}"</p>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-slate-50 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 border border-slate-100 active:bg-slate-100 transition-all">
                                    <Heart size={18} /> {post.likes}
                                </button>
                                <button onClick={() => handleTip(post.user)} className="flex-[2.5] bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                                    <Gift size={18} className="text-emerald-400" /> Tip 50 $NAF
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
          )}

          {/* TAB: LIVE HUB INDEX */}
          {activeTab === 'hubs' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="hubs" className="space-y-6">
                <div className="flex justify-between items-center px-2 mb-2">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Hub Proximity Index</h2>
                    <Globe className="text-blue-500 animate-spin-slow" size={16} />
                </div>

                {events.map(hub => (
                    <div key={hub.id} className="glass-card p-0 rounded-[2.8rem] overflow-hidden border-white/60 shadow-2xl relative bg-white/40">
                        <div className="h-44 bg-slate-200 relative overflow-hidden">
                            <img src={hub.banner} className="w-full h-full object-cover grayscale opacity-60" alt="hub" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 p-8 flex flex-col justify-end">
                                <div className="flex items-center gap-2 mb-2">
                                    <Flame size={14} className="text-orange-500" />
                                    <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">Live Hub</span>
                                </div>
                                <h3 className="text-white text-2xl font-black uppercase italic leading-tight tracking-tighter">{hub.title}</h3>
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 italic">"{hub.description}"</p>
                            <button 
                                onClick={() => TelegramWebApp.openLink(`https://www.google.com/maps/search/${hub.location}`)} 
                                className="w-full bg-slate-900 text-white py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                            >
                                <MapPin size={14} className="text-emerald-400"/> Navigate to Hub
                            </button>
                        </div>
                    </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FLOATING BROADCAST TRIGGER */}
      <motion.button 
        whileTap={{ scale: 0.85 }} onClick={() => setShowPostModal(true)}
        className="fixed bottom-28 right-6 w-16 h-16 bg-slate-900 text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-center z-50 border-4 border-white active:bg-slate-800"
      >
        <Camera size={28} strokeWidth={2.5} />
      </motion.button>

      {/* MODAL: BROADCAST PROOF */}
      <AnimatePresence>
        {showPostModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex items-end">
                <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white w-full rounded-t-[4rem] p-10 pb-16 shadow-2xl">
                    <div className="flex justify-between items-center mb-8 px-2">
                        <h2 className="text-2xl font-black text-slate-900 italic uppercase underline decoration-emerald-500 decoration-4 underline-offset-8">Broadcast Proof</h2>
                        <button onClick={() => setShowPostModal(false)} className="p-3 bg-slate-100 rounded-full active:scale-75 transition-transform"><X size={20}/></button>
                    </div>
                    <div className="space-y-6">
                        <div className="w-full h-44 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-3 active:bg-slate-100 transition-all">
                            <Camera size={32} className="text-slate-300" />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Upload Neural Proof</p>
                        </div>
                        <input value={newPost.caption} onChange={e => setNewPost({...newPost, caption: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[1.5rem] border-none outline-none font-bold text-sm shadow-inner" placeholder="Log your protocol details..." />
                        <input value={newPost.location} onChange={e => setNewPost({...newPost, location: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[1.5rem] border-none outline-none font-bold text-sm shadow-inner" placeholder="UAE Location (e.g. Marina Walk)" />
                        <button onClick={handleBroadcastProof} className="w-full py-6 bg-slate-900 text-white rounded-[2.2rem] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all">Broadcast to the Tribe</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
