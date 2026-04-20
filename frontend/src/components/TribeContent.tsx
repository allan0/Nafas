'use client';

import { useState, useRef } from 'react';
import { 
  Heart, MessageCircle, Share2, Gift, Play, Users, 
  MapPin, Globe, Zap, Camera, Plus, ExternalLink,
  ChevronRight, Search, X, Video, Image as ImageIcon, Send,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useWellnessData } from '@/hooks/useWellnessData';
import TelegramWebApp from '@twa-dev/sdk';

export default function TribeContent() {
  const [tonConnectUI] = useTonConnectUI();
  const { events, xp, isLoaded, logActivity } = useWellnessData();
  
  // Tab Management
  const [activeTab, setActiveTab] = useState<'hubs' | 'feed'>('feed');
  
  // State for simulated SocialFi
  const [showPostModal, setShowPostModal] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  
  // Initial high-fidelity community feed
  const [posts, setPosts] = useState([
    { 
      id: 'p1', user: 'Yogi_Amal', avatar: '🧘‍♀️', 
      image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=600', 
      caption: 'Sunrise flow at Hatta Mountains. Air quality is 10/10. Breath is deep. 🏔️',
      likes: 54, location: 'Hatta, UAE', type: 'yoga'
    },
    { 
      id: 'p2', user: 'DXB_Runner', avatar: '🏃‍♂️', 
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600', 
      caption: 'Evening 10k at Dubai Marina. The protocol keeps me cool. 💎',
      likes: 142, location: 'Dubai Marina', type: 'run'
    }
  ]);

  const [newPost, setNewPost] = useState({ caption: '', location: '' });

  // --- LOGIC: CREATE SOCIAL PROOF ---
  const handleCreatePost = () => {
    if (!newPost.caption) return;
    const post = {
      id: Date.now().toString(),
      user: 'You',
      avatar: '👤',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600', 
      caption: newPost.caption,
      likes: 0,
      location: newPost.location || 'UAE Protocol Hub',
      type: 'user'
    };
    setPosts([post, ...posts]);
    setShowPostModal(false);
    setNewPost({ caption: '', location: '' });
    
    // Reward XP for sharing proof
    logActivity('task', 'Shared Social Proof', 30);
    TelegramWebApp.HapticFeedback.notificationOccurred('success');
  };

  const handleTip = (user: string) => {
    if (!tonConnectUI.connected) {
      alert("Link your TON wallet to tip $NAF.");
      return;
    }
    TelegramWebApp.showPopup({
      title: 'SocialFi Tipping',
      message: `Authorize 50 $NAF transfer to ${user}?`,
      buttons: [{ id: 'ok', type: 'default', text: 'Confirm TLE' }]
    });
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-transparent pb-32">
      
      {/* 1. TRIBE NAVIGATION & HEADER */}
      <div className="p-6 pt-10 bg-white/40 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6 px-1">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">The Tribe</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-500" /> Decentralized Wellness
                </p>
            </div>
            <button 
                onClick={() => setIsLiveMode(true)}
                className="group relative w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-500/20 active:scale-90 transition-all border-t border-white/20"
            >
                <Video size={22} fill="white" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                </span>
            </button>
        </div>

        {/* Professional Switcher */}
        <div className="flex bg-slate-200/50 p-1.5 rounded-[1.4rem]">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${activeTab === 'feed' ? 'bg-white shadow-md text-slate-900 scale-[1.02]' : 'text-slate-500'}`}
          >
            Protocol Feed
          </button>
          <button 
            onClick={() => setActiveTab('hubs')}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${activeTab === 'hubs' ? 'bg-white shadow-md text-slate-900 scale-[1.02]' : 'text-slate-500'}`}
          >
            Live Hubs
          </button>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          
          {/* TAB: COMMUNITY FEED */}
          {activeTab === 'feed' && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} key="feed" className="space-y-12">
                {posts.map((post) => (
                    <div key={post.id} className="glass-card p-0 rounded-[3rem] overflow-hidden border-white/60 shadow-2xl bg-white/60">
                        {/* Header */}
                        <div className="p-6 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black italic shadow-lg border-2 border-white">{post.avatar}</div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 leading-none lowercase">@{post.user}</h4>
                                    <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1 tracking-widest flex items-center gap-1">
                                        <MapPin size={10} /> {post.location}
                                    </p>
                                </div>
                            </div>
                            <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 active:scale-90 transition-transform"><Share2 size={18}/></button>
                        </div>

                        {/* High Fidelity Proof Image */}
                        <div className="mx-4 relative overflow-hidden rounded-[2.5rem] border-4 border-white shadow-xl aspect-square">
                            <img src={post.image} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" alt="session-proof" />
                            <div className="absolute top-5 right-5 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white border border-white/20">
                                <Zap size={14} fill="currentColor" className="text-emerald-400" />
                            </div>
                        </div>

                        {/* Content & Interaction */}
                        <div className="p-8 pt-6">
                            <p className="text-sm text-slate-800 font-medium leading-relaxed mb-8 italic">
                                "{post.caption}"
                            </p>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-rose-50 text-rose-500 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 active:bg-rose-100 transition-all border border-rose-100">
                                    <Heart size={18} fill="currentColor" /> {post.likes}
                                </button>
                                <button 
                                    onClick={() => handleTip(post.user)}
                                    className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                                >
                                    <Gift size={18} className="text-emerald-400" /> Tip 50 $NAF
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
          )}

          {/* TAB: LIVE HUBS (Direct Link to Profile Events) */}
          {activeTab === 'hubs' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="hubs" className="space-y-6">
                <div className="flex justify-between items-center px-2 mb-2">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active UAE Protocol Hubs</h2>
                    <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-black text-emerald-600 uppercase">Live</span>
                    </div>
                </div>

                {events.filter(e => e.isPublic).length > 0 ? events.filter(e => e.isPublic).map(hub => (
                    <motion.div key={hub.id} whileTap={{ scale: 0.98 }} className="glass-card p-0 rounded-[2.8rem] overflow-hidden border-white/60 shadow-2xl relative bg-white/40">
                        <div className="h-48 bg-slate-200 relative overflow-hidden">
                            <img src={hub.banner || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600'} className="w-full h-full object-cover grayscale opacity-70" alt="hub" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-8 flex flex-col justify-end">
                                <h3 className="text-white text-2xl font-black uppercase italic leading-tight tracking-tighter">{hub.title}</h3>
                                {hub.link && <p className="text-blue-400 text-[10px] font-bold uppercase mt-2 flex items-center gap-1"><ExternalLink size={12}/> Protocol Asset Attached</p>}
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <MapPin size={14} className="text-rose-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{hub.location}</span>
                            </div>
                            <button 
                                onClick={() => TelegramWebApp.openLink(`https://www.google.com/maps/search/${hub.location}`)}
                                className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl border-t border-white/10"
                            >
                                Enter Hub Navigation
                            </button>
                        </div>
                    </motion.div>
                )) : (
                    <div className="py-24 text-center glass-card rounded-[3rem] border-dashed border-slate-300 opacity-40">
                        <Globe size={48} className="mx-auto mb-4 text-slate-300" />
                        <p className="text-xs font-black uppercase tracking-widest">No Public Hubs Discovered</p>
                        <p className="text-[9px] font-bold uppercase mt-2">Initialize a hub from your Profile</p>
                    </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. FLOATING ACTION BUTTON: SHARE PROOF */}
      <motion.button 
        whileTap={{ scale: 0.85 }}
        onClick={() => setShowPostModal(true)}
        className="fixed bottom-28 right-6 w-16 h-16 bg-slate-900 text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-center z-50 border-4 border-white active:bg-slate-800 transition-colors"
      >
        <Plus size={32} strokeWidth={3} />
      </motion.button>

      {/* 3. MODAL: BROADCAST POST */}
      <AnimatePresence>
        {showPostModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex items-end">
                <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white w-full rounded-t-[4rem] p-10 pb-16 shadow-2xl border-t-4 border-emerald-500">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-black text-slate-900 italic uppercase underline decoration-emerald-500 decoration-4 underline-offset-8">Broadcast Proof</h2>
                        <button onClick={() => setShowPostModal(false)} className="p-3 bg-slate-100 rounded-full active:scale-75 transition-transform"><X size={20}/></button>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="w-full h-56 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-4 group active:bg-slate-100 transition-all cursor-pointer">
                            <div className="p-5 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                <Camera size={32} className="text-slate-300" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capture Wellness Asset</p>
                        </div>
                        <input 
                            value={newPost.caption} onChange={e => setNewPost({...newPost, caption: e.target.value})}
                            className="w-full p-6 bg-slate-50 rounded-[2rem] border-none outline-none font-bold text-sm shadow-inner" placeholder="Encryption Caption..." 
                        />
                        <button onClick={handleCreatePost} className="w-full py-6 bg-slate-900 text-white rounded-[2.2rem] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all">Publish to Tribe Feed</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MODAL: GO LIVE BROADCAST */}
      <AnimatePresence>
        {isLiveMode && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-slate-900 flex flex-col">
                <div className="flex-1 relative flex items-center justify-center p-10">
                    <div className="absolute top-12 left-8 flex items-center gap-3">
                        <div className="bg-rose-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full animate-pulse tracking-widest shadow-lg shadow-rose-600/30">LIVE</div>
                        <div className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                            <Users size={14} /> 0
                        </div>
                    </div>
                    <button onClick={() => setIsLiveMode(false)} className="absolute top-12 right-8 p-3 bg-white/10 rounded-2xl text-white active:rotate-90 transition-transform"><X size={24} /></button>
                    
                    <div className="text-center">
                        <div className="w-36 h-36 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 border-4 border-white/5 border-dashed relative">
                             <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
                             <Camera size={48} className="text-white opacity-10" />
                        </div>
                        <h2 className="text-4xl font-black text-white italic uppercase mb-4 tracking-tighter">Protocol Hub</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto">
                            Initializing neural connection... <br/> Prepare to stream wellness energy to the decentralized tribe.
                        </p>
                    </div>
                </div>
                <div className="p-10 border-t border-white/5 bg-slate-900/80 backdrop-blur-md">
                    <button className="w-full py-7 bg-white text-slate-900 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl active:scale-95 transition-all">Start Protocol Broadcast</button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
