'use client';

import { useState, useMemo } from 'react';
import { 
  Heart, Share2, Gift, Play, Users, MapPin, Globe, Zap, 
  Camera, Plus, ExternalLink, ChevronRight, Search, X, 
  Video, Edit3, Trash2, Youtube, ShieldCheck, Send, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useWellnessData, WellnessEvent } from '@/hooks/useWellnessData';
import TelegramWebApp from '@twa-dev/sdk';

export default function TribeContent() {
  const [tonConnectUI] = useTonConnectUI();
  const { 
    events, updateEvent, deleteEvent, logActivity, 
    isLoaded, xp, healthProfile 
  } = useWellnessData();
  
  const [activeTab, setActiveTab] = useState<'feed' | 'hubs'>('feed');
  const [showPostModal, setShowPostModal] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [editingHub, setEditingHub] = useState<WellnessEvent | null>(null);

  // --- STATE: COMMUNITY FEED ---
  const [posts, setPosts] = useState([
    { 
        id: 'p1', user: 'Yogi_Sarah', avatar: '🧘‍♀️', 
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600', 
        caption: 'Morning flow at Kite Beach. The humidity is indexing high! 🌊',
        likes: 24, location: 'Dubai', type: 'yoga'
    },
    { 
        id: 'p2', user: 'Zayed_Protocol', avatar: '🏃‍♂️', 
        image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600', 
        caption: '5km Maffetone run complete. Heat management is key. 💎',
        likes: 156, location: 'Al Qudra', type: 'run'
    }
  ]);
  const [newPost, setNewPost] = useState({ caption: '', location: '' });

  // --- ACTIONS: SOCIAL ---
  const handleBroadcastProof = () => {
    if (!newPost.caption) return;
    const post = {
      id: Date.now().toString(),
      user: 'You',
      avatar: '👤',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600',
      caption: newPost.caption,
      likes: 0,
      location: newPost.location || 'UAE Protocol Hub'
    };
    setPosts([post, ...posts]);
    setShowPostModal(false);
    setNewPost({ caption: '', location: '' });
    logActivity('task', 'Community Proof Shared', 30);
    TelegramWebApp.HapticFeedback.notificationOccurred('success');
  };

  const handleTip = (user: string) => {
    if (!tonConnectUI.connected) {
      alert("Link TON Wallet to Tip.");
      return;
    }
    TelegramWebApp.showPopup({
      title: 'Social-Fi Authorization',
      message: `Send 50 $NAF to ${user}?`,
      buttons: [{ id: 'ok', type: 'default', text: 'Confirm Transfer' }]
    });
  };

  const handleUpdateHub = () => {
    if (editingHub) {
      updateEvent(editingHub.id, editingHub);
      setEditingHub(null);
      TelegramWebApp.HapticFeedback.notificationOccurred('success');
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-transparent pb-40"> {/* pb-40 prevents BottomNav overlap */}
      
      {/* 1. TRIBE HEADER */}
      <div className="p-6 pt-10 bg-white/40 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">The Tribe</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-500" /> Decentralized Social-Fi
                </p>
            </div>
            <button 
                onClick={() => setIsLiveMode(true)}
                className="group relative w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-500/20 active:scale-90 transition-all border-t border-white/20"
            >
                <Video size={22} fill="white" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                </span>
            </button>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex bg-slate-200/50 p-1.5 rounded-[1.2rem]">
          <button onClick={() => setActiveTab('feed')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'feed' ? 'bg-white shadow-md text-slate-900 scale-[1.02]' : 'text-slate-500'}`}>Tribe Feed</button>
          <button onClick={() => setActiveTab('hubs')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'hubs' ? 'bg-white shadow-md text-slate-900 scale-[1.02]' : 'text-slate-500'}`}>Live Hubs</button>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          
          {/* TAB: FEED */}
          {activeTab === 'feed' && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} key="feed" className="space-y-12">
                {posts.map((post) => (
                    <div key={post.id} className="glass-card p-0 rounded-[3rem] overflow-hidden border-white/60 shadow-2xl bg-white/60">
                        <div className="p-6 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black italic shadow-lg border-2 border-white">{post.avatar}</div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 leading-none lowercase">@{post.user}</h4>
                                    <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1 tracking-widest flex items-center gap-1"><MapPin size={10} /> {post.location}</p>
                                </div>
                            </div>
                            <Share2 size={18} className="text-slate-300" />
                        </div>
                        <div className="mx-4 relative rounded-[2.5rem] overflow-hidden border-4 border-white aspect-square shadow-xl">
                            <img src={post.image} className="w-full h-full object-cover" alt="proof" />
                            <div className="absolute top-5 right-5 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white border border-white/20">
                                <Zap size={14} fill="currentColor" className="text-emerald-400" />
                            </div>
                        </div>
                        <div className="p-8 pt-6">
                            <p className="text-sm text-slate-800 font-medium italic mb-8 leading-relaxed">"{post.caption}"</p>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-rose-50 text-rose-500 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 border border-rose-100"><Heart size={18} fill="currentColor" /> {post.likes}</button>
                                <button onClick={() => handleTip(post.user)} className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"><Gift size={18} className="text-emerald-400" /> Tip 50 $NAF</button>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
          )}

          {/* TAB: LIVE HUBS (Public Events) */}
          {activeTab === 'hubs' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="hubs" className="space-y-6">
                <div className="flex justify-between items-center px-2 mb-2">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Hubs</h2>
                    <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-black text-emerald-600 uppercase">Indexing Live</span>
                    </div>
                </div>

                {events.filter(e => e.isPublic).length > 0 ? events.filter(e => e.isPublic).map(hub => (
                    <motion.div key={hub.id} className="glass-card p-0 rounded-[2.8rem] overflow-hidden border-white/60 shadow-2xl relative bg-white/40">
                        <div className="h-48 bg-slate-200 relative overflow-hidden">
                            <img src={hub.banner || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600'} className="w-full h-full object-cover grayscale opacity-70" alt="hub" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-8 flex flex-col justify-end">
                                <h3 className="text-white text-2xl font-black uppercase italic leading-tight tracking-tighter">{hub.title}</h3>
                                {hub.link && <div className="flex items-center gap-2 mt-2 text-blue-400 text-[10px] font-black uppercase"><Youtube size={14}/> Asset Linked</div>}
                            </div>
                            {/* EDIT BUTTON for creator */}
                            <button 
                                onClick={() => setEditingHub(hub)}
                                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white active:scale-90 transition-transform"
                            >
                                <Edit3 size={18} />
                            </button>
                        </div>
                        <div className="p-8">
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 italic">"{hub.description}"</p>
                            <div className="flex gap-2">
                                <button onClick={() => TelegramWebApp.openLink(`https://www.google.com/maps/search/${hub.location}`)} className="flex-1 bg-slate-900 text-white py-5 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl"><MapPin size={14}/> Location</button>
                                {hub.link && <button onClick={() => TelegramWebApp.openLink(hub.link!)} className="p-4 bg-emerald-50 text-emerald-600 rounded-[1.5rem]"><ExternalLink size={18}/></button>}
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="py-24 text-center glass-card rounded-[3rem] border-dashed border-slate-300 opacity-40">
                        <Globe size={48} className="mx-auto mb-4 text-slate-300" />
                        <p className="text-xs font-black uppercase tracking-widest">No Public Hubs</p>
                    </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FLOATING ACTION: UPLOAD PROOF */}
      <motion.button 
        whileTap={{ scale: 0.85 }} onClick={() => setShowPostModal(true)}
        className="fixed bottom-28 right-6 w-16 h-16 bg-slate-900 text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-center z-50 border-4 border-white"
      >
        <Plus size={32} strokeWidth={3} />
      </motion.button>

      {/* --- MODAL: BROADCAST PROOF --- */}
      <AnimatePresence>
        {showPostModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex items-end">
                <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white w-full rounded-t-[4rem] p-10 pb-16 shadow-2xl border-t-4 border-emerald-500">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-slate-900 italic uppercase">Broadcast Proof</h2>
                        <button onClick={() => setShowPostModal(false)} className="p-3 bg-slate-100 rounded-full"><X size={20}/></button>
                    </div>
                    <div className="space-y-6">
                        <div className="w-full h-44 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-3 active:bg-slate-100 cursor-pointer">
                            <Camera size={32} className="text-slate-300" />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Capture Protocol Asset</p>
                        </div>
                        <input value={newPost.caption} onChange={e => setNewPost({...newPost, caption: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[1.5rem] border-none outline-none font-bold text-sm shadow-inner" placeholder="Encryption Caption..." />
                        <input value={newPost.location} onChange={e => setNewPost({...newPost, location: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[1.5rem] border-none outline-none font-bold text-sm shadow-inner" placeholder="Dubai, Hatta, Al Qudra..." />
                        <button onClick={handleBroadcastProof} className="w-full py-6 bg-slate-900 text-white rounded-[2.2rem] font-black uppercase text-xs tracking-widest shadow-2xl">Broadcast to Tribe Feed</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODAL: EDIT HUB --- */}
      <AnimatePresence>
        {editingHub && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex items-end">
                <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white w-full rounded-t-[4rem] p-10 pb-16 shadow-2xl border-t-4 border-slate-900">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-slate-900 italic uppercase">Modify Protocol</h2>
                        <button onClick={() => setEditingHub(null)} className="p-3 bg-slate-100 rounded-full"><X size={20}/></button>
                    </div>
                    <div className="space-y-4">
                        <input value={editingHub.title} onChange={e => setEditingHub({...editingHub, title: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[1.5rem] border-none outline-none font-bold text-sm shadow-inner" />
                        <textarea value={editingHub.description} onChange={e => setEditingHub({...editingHub, description: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[1.5rem] border-none outline-none font-bold text-xs h-32 shadow-inner" />
                        <div className="flex gap-2">
                            <button onClick={handleUpdateHub} className="flex-[2] py-6 bg-slate-900 text-white rounded-[2.2rem] font-black uppercase text-xs shadow-2xl">Update Instance</button>
                            <button onClick={() => { deleteEvent(editingHub.id); setEditingHub(null); }} className="flex-1 py-6 bg-rose-50 text-rose-500 rounded-[2.2rem] flex items-center justify-center active:bg-rose-100"><Trash2 size={20}/></button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODAL: GO LIVE --- */}
      <AnimatePresence>
        {isLiveMode && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-slate-900 flex flex-col p-10 justify-center text-center">
                <button onClick={() => setIsLiveMode(false)} className="absolute top-10 right-8 text-white p-3 bg-white/10 rounded-2xl"><X size={28}/></button>
                <div className="w-36 h-36 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-10 border-4 border-rose-500/10 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-rose-500 animate-ping opacity-20" />
                    <Video size={54} className="text-rose-500" />
                </div>
                <h2 className="text-4xl font-black text-white italic uppercase mb-4 tracking-tighter leading-none">Initialize Broadcast</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-12 max-w-xs mx-auto">Connecting to Protocol Social-Fi Nodes... Prepare to mine engagement credits.</p>
                <button className="w-full py-7 bg-white text-slate-900 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95 transition-all">Launch Live Stream</button>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
