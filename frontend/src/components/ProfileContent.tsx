'use client';

import { useState, useMemo } from 'react';
import { 
  Award, Flame, Calendar as CalIcon, Wallet as WalletIcon, 
  Settings as SettingsIcon, History, Plus, MapPin, Image as ImageIcon,
  ChevronRight, BarChart3, Camera, Zap, Clock, X, Globe, Lock, 
  Link as LinkIcon, Play, Trash2, Save, User, Droplets, Cigarette, Info
} from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWellnessData, WellnessEvent } from '@/hooks/useWellnessData';
import TelegramWebApp from '@twa-dev/sdk';

// --- PROPS INTERFACE ---
interface ProfileProps {
  onOpenSettings: () => void;
}

export default function ProfileContent({ onOpenSettings }: ProfileProps) {
  const { 
    xp, history, streak, vitality, events, addEvent, isLoaded,
    healthProfile, dailyWater, dailyCigs
  } = useWellnessData();
  
  const [activeTab, setActiveTab] = useState<'analysis' | 'calendar' | 'habits' | 'wallet'>('analysis');
  const [showEventModal, setShowEventModal] = useState(false);
  
  // Advanced Event Form State
  const [newEv, setNewEv] = useState({
    title: '',
    desc: '',
    location: '',
    link: '',
    isPublic: true
  });

  // --- ANALYSIS ENGINE ---
  const performance = useMemo(() => {
    if (!history || history.length === 0) return { improved: false, diff: "0" };
    
    const today = new Date().toDateString();
    const yesterday = new Date(); 
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const movement = history.filter(h => h.type === 'walk' || h.type === 'run');
    
    const getKm = (dateStr: string) => movement
      .filter(h => new Date(h.date).toDateString() === dateStr)
      .reduce((acc, h) => acc + parseFloat(h.value || '0'), 0);
    
    const tKm = getKm(today);
    const yKm = getKm(yesterdayStr);
    
    return {
      tKm,
      yKm,
      diff: (tKm - yKm).toFixed(2),
      improved: tKm >= yKm
    };
  }, [history]);

  const handleCreateEvent = () => {
    if (!newEv.title || !newEv.location) {
      alert("Protocol requires a Title and Location Tag.");
      return;
    }

    const event: WellnessEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEv.title,
      description: newEv.desc,
      date: new Date().toISOString(),
      isPublic: newEv.isPublic,
      location: newEv.location,
      link: newEv.link,
      banner: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600",
    };

    addEvent(event);
    setShowEventModal(false);
    setNewEv({ title: '', desc: '', location: '', link: '', isPublic: true });
    TelegramWebApp.HapticFeedback.notificationOccurred('success');
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-md mx-auto pb-32">
      
      {/* 1. IDENTITY HEADER */}
      <div className="flex flex-col items-center mb-10 pt-6">
        <div className="relative group">
            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-28 h-28 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl border-4 border-white/20"
            >
                <span className="text-4xl text-emerald-400 font-black italic">A</span>
            </motion.div>
            
            {/* SETTINGS TRIGGER */}
            <button 
                onClick={onOpenSettings}
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-2.5 rounded-2xl border-4 border-white shadow-lg active:scale-90 transition-transform"
            >
                <SettingsIcon size={18} />
            </button>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mt-6 tracking-tighter uppercase italic leading-none">Allan Mureithi</h1>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Level 4 Protocol Architect</p>
      </div>

      {/* 2. NAVIGATION SUB-TABS */}
      <div className="flex bg-white/40 backdrop-blur-xl p-1.5 rounded-2xl mb-10 border border-white/30 overflow-x-auto scrollbar-hide">
        {(['analysis', 'calendar', 'habits', 'wallet'] as const).map(tab => (
            <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}
            >
                {tab}
            </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB: ANALYSIS & PROGRESS */}
        {activeTab === 'analysis' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="analysis" className="space-y-6">
            <div className="glass-card p-8 rounded-[2.8rem] bg-slate-900 text-white overflow-hidden relative shadow-2xl">
                <BarChart3 className="absolute -top-4 -right-4 text-emerald-500 opacity-10" size={120} />
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Efficiency Analysis</p>
                <h3 className="text-xl font-black leading-tight italic">
                    {parseFloat(performance.diff) > 0 
                        ? `You pushed ${performance.diff}km harder today!` 
                        : `Baseline: ${performance.yKm}km yesterday. Match the protocol.`}
                </h3>
                
                {/* Simplified Progress Graph */}
                <div className="mt-8 flex items-end gap-4 h-24">
                    <div className="flex-1 bg-white/10 rounded-t-xl" style={{height: '30%'}} />
                    <motion.div 
                        initial={{height: 0}} 
                        animate={{height: '80%'}} 
                        className="flex-1 bg-gradient-to-t from-emerald-500 to-blue-400 rounded-t-xl shadow-[0_0_20px_#10b981]" 
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-5 rounded-[2.2rem] border-white/40">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Active Streak</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-slate-800">{streak}</span>
                        <Flame size={18} className="text-orange-500" />
                    </div>
                </div>
                <div className="glass-card p-5 rounded-[2.2rem] border-white/40">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Vitality</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-slate-800">{vitality}%</span>
                        <Zap size={18} className="text-emerald-500" />
                    </div>
                </div>
            </div>
          </motion.div>
        )}

        {/* TAB: CALENDAR (Create & Manage) */}
        {activeTab === 'calendar' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="calendar" className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-sm font-black text-slate-900 uppercase italic">Your Events</h3>
                <button 
                    onClick={() => setShowEventModal(true)} 
                    className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl active:scale-90 transition-transform"
                >
                    <Plus size={20}/>
                </button>
            </div>
            <div className="space-y-4">
                {events.map(ev => (
                    <div key={ev.id} className="glass-card p-0 rounded-[2.8rem] overflow-hidden border-white/60 shadow-lg">
                        <div className="h-40 bg-slate-200 relative">
                            {ev.banner ? <img src={ev.banner} className="w-full h-full object-cover" alt="event" /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300"><ImageIcon size={40}/></div>}
                            <div className="absolute top-4 left-4 bg-slate-900 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase">
                                {ev.isPublic ? 'Public Hub' : 'Private'}
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="font-black text-slate-900 uppercase italic mb-2 leading-none">{ev.title}</h4>
                            <p className="text-xs text-slate-500 mb-6 font-medium line-clamp-2">{ev.description}</p>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => TelegramWebApp.openLink(`https://www.google.com/maps/search/${ev.location}`)} 
                                    className="flex-1 bg-emerald-50 text-emerald-600 py-4 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2"
                                >
                                    <MapPin size={14}/> {ev.location}
                                </button>
                                {ev.link && (
                                    <button 
                                        onClick={() => TelegramWebApp.openLink(ev.link!)} 
                                        className="p-4 bg-rose-50 text-rose-500 rounded-xl"
                                    >
                                        <Play size={18} fill="currentColor"/>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* TAB: HABITS & BIO */}
        {activeTab === 'habits' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key="habits" className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-5 rounded-[2.2rem] border-white/50 shadow-lg">
                    <Droplets className="text-blue-500 mb-3" size={24}/>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Hydration</p>
                    <span className="text-2xl font-black text-slate-900">{dailyWater} <span className="text-[10px] text-slate-300">GL</span></span>
                  </div>
                  <div className="glass-card p-5 rounded-[2.2rem] border-white/50 shadow-lg">
                    <Cigarette className="text-rose-500 mb-3" size={24}/>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Combustion</p>
                    <span className="text-2xl font-black text-slate-900">{dailyCigs} <span className="text-[10px] text-slate-300">UN</span></span>
                  </div>
            </div>
            
            <div className="glass-card p-8 rounded-[2.8rem] border-white/50 shadow-xl bg-white/60">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Physical Profile</p>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Morphology</span>
                        <span className="text-xs font-black text-slate-900 uppercase italic">{healthProfile.bodyType || 'Seeker'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Mass</span>
                        <span className="text-xs font-black text-slate-900 uppercase italic">{healthProfile.weight || '0'} KG</span>
                    </div>
                </div>
            </div>
          </motion.div>
        )}

        {/* TAB: WALLET */}
        {activeTab === 'wallet' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="wallet" className="text-center pt-8 space-y-8">
            <div className="w-28 h-28 bg-emerald-50 rounded-[2.8rem] flex items-center justify-center mx-auto shadow-inner border-2 border-white text-emerald-500">
                <WalletIcon size={52} />
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{xp} <span className="text-sm italic text-emerald-500 uppercase">$NAF</span></h2>
            <div className="flex justify-center"><TonConnectButton /></div>
            
            <div className="pt-8 space-y-3 px-2 text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-4">Latest Mining Logs</p>
                {history.slice(0, 3).map(h => (
                    <div key={h.id} className="glass-card p-5 rounded-[1.8rem] flex justify-between items-center border-white/40">
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase italic">{h.title}</p>
                          <p className="text-[9px] text-slate-400 font-bold">{new Date(h.date).toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs font-black text-emerald-600">+{h.xp}</span>
                    </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EVENT CREATION MODAL */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-end">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-[4rem] w-full p-10 pb-16 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black uppercase italic text-slate-900">Broadcast Hub</h3>
                    <button onClick={() => setShowEventModal(false)} className="p-3 bg-slate-100 rounded-full"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                    <input 
                        value={newEv.title} 
                        onChange={e => setNewEv({...newEv, title: e.target.value})} 
                        className="w-full p-6 bg-slate-50 rounded-[1.5rem] border-none outline-none font-black text-sm uppercase italic" 
                        placeholder="Event Title" 
                    />
                    <textarea 
                        value={newEv.desc} 
                        onChange={e => setNewEv({...newEv, desc: e.target.value})} 
                        className="w-full p-6 bg-slate-50 rounded-[1.5rem] border-none outline-none font-bold text-xs" 
                        placeholder="Protocol Description (Brief)" 
                    />
                    <div className="flex gap-2">
                        <div className="flex-1 bg-slate-50 rounded-[1.5rem] flex items-center px-4 gap-2">
                            <MapPin size={14} className="text-slate-400" />
                            <input 
                                value={newEv.location} 
                                onChange={e => setNewEv({...newEv, location: e.target.value})} 
                                className="w-full py-6 bg-transparent border-none outline-none font-black text-[10px] uppercase" 
                                placeholder="Paste Location Name" 
                            />
                        </div>
                        <div className="flex-1 bg-slate-50 rounded-[1.5rem] flex items-center px-4 gap-2">
                            <LinkIcon size={14} className="text-slate-400" />
                            <input 
                                value={newEv.link} 
                                onChange={e => setNewEv({...newEv, link: e.target.value})} 
                                className="w-full py-6 bg-transparent border-none outline-none font-bold text-[10px]" 
                                placeholder="YouTube / Social Link" 
                            />
                        </div>
                    </div>
                    
                    <button onClick={() => setNewEv({...newEv, isPublic: !newEv.isPublic})} className="w-full py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2">
                        {newEv.isPublic ? <Globe size={12}/> : <Lock size={12}/>} Visibility: {newEv.isPublic ? 'Public Tribe Feed' : 'Private Archive'}
                    </button>

                    <button 
                        onClick={handleCreateEvent} 
                        className="w-full bg-emerald-500 text-white py-6 rounded-[2.2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-emerald-500/20 mt-6"
                    >
                        Initialize Broadcast
                    </button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
