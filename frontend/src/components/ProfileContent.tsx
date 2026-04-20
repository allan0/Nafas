'use client';

import { useState, useMemo } from 'react';
import { 
  Award, Flame, Calendar as CalIcon, Wallet as WalletIcon, 
  Settings, History, Plus, MapPin, Image as ImageIcon,
  ChevronRight, BarChart3, Camera, Zap, Clock, X, Globe, Lock, Link as LinkIcon
} from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWellnessData, WellnessEvent } from '@/hooks/useWellnessData';
import { useSearchParams, useRouter } from 'next/navigation';
import TelegramWebApp from '@twa-dev/sdk';

export default function ProfileContent() {
  const { xp, history, streak, events, addEvent, isLoaded } = useWellnessData();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'calendar' | 'wallet'>(
    (searchParams.get('tab') as any) || 'stats'
  );
  
  // Event Form State
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEv, setNewEv] = useState({
    title: '',
    desc: '',
    location: '',
    link: '',
    isPublic: true
  });

  const performanceData = useMemo(() => {
    const todayStr = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const walkHistory = history.filter(h => h.type === 'walk' || h.type === 'run');
    const todayKm = walkHistory.filter(h => new Date(h.date).toDateString() === todayStr).reduce((acc, h) => acc + parseFloat(h.value || '0'), 0);
    const yesterdayKm = walkHistory.filter(h => new Date(h.date).toDateString() === yesterday.toDateString()).reduce((acc, h) => acc + parseFloat(h.value || '0'), 0);
    return { diff: Math.abs(todayKm - yesterdayKm), improved: todayKm > yesterdayKm };
  }, [history]);

  const handleCreateEvent = () => {
    if (!newEv.title) return;
    const event: WellnessEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEv.title,
      date: new Date().toISOString(),
      isPublic: newEv.isPublic,
      location: newEv.location,
      banner: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500", // Default Banner
    };
    addEvent(event);
    setShowEventModal(false);
    setNewEv({ title: '', desc: '', location: '', link: '', isPublic: true });
    TelegramWebApp.HapticFeedback.notificationOccurred('success');
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-md mx-auto pb-32">
      
      {/* 1. IDENTITY */}
      <div className="flex flex-col items-center mb-10 pt-6">
        <div className="relative">
            <div className="w-24 h-24 bg-slate-900 rounded-[2.2rem] flex items-center justify-center shadow-2xl border-4 border-white/20">
                <span className="text-4xl text-emerald-400 font-black italic">A</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-2 rounded-xl border-4 border-white shadow-lg">
                <Settings size={14} />
            </div>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mt-6 tracking-tighter uppercase italic">Allan Mureithi</h1>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Level 4 Wellness Architect</p>
      </div>

      {/* 2. TABS */}
      <div className="flex bg-white/40 backdrop-blur-xl p-1.5 rounded-2xl mb-10 border border-white/30">
        {(['stats', 'calendar', 'wallet'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}>{tab}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STATS VIEW */}
        {activeTab === 'stats' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="stats" className="space-y-6">
            <div className="glass-card p-8 rounded-[2.8rem] bg-slate-900 text-white overflow-hidden relative shadow-2xl">
                <BarChart3 className="absolute -top-4 -right-4 text-emerald-500 opacity-10" size={120} />
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Protocol Analysis</p>
                <h3 className="text-xl font-black leading-tight italic">
                    {performanceData.diff > 0 ? `You pushed ${performanceData.diff.toFixed(2)}km more than yesterday!` : 'Syncing yesterday\'s data baseline...'}
                </h3>
                <div className="mt-8 flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-full border border-white/5">
                    <Flame size={14} className="text-orange-400" />
                    <span className="text-xs font-black uppercase tracking-tighter">{streak} Day Streak</span>
                </div>
            </div>

            <div className="pt-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-4">Mining History</h4>
                <div className="space-y-3">
                    {history.slice(0, 4).map(item => (
                        <div key={item.id} className="glass-card p-4 rounded-2xl flex items-center justify-between border-white/50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-amber-500"><Zap size={18} fill="currentColor"/></div>
                                <div><p className="text-xs font-black text-slate-800 uppercase">{item.title}</p><p className="text-[9px] text-slate-400 font-bold">{new Date(item.date).toLocaleDateString()}</p></div>
                            </div>
                            <span className="text-xs font-black text-emerald-600">+{item.xp}</span>
                        </div>
                    ))}
                </div>
            </div>
          </motion.div>
        )}

        {/* CALENDAR VIEW */}
        {activeTab === 'calendar' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="calendar" className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-sm font-black text-slate-900 uppercase italic">Your Events</h3>
                <button onClick={() => setShowEventModal(true)} className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl active:scale-90 transition-transform"><Plus size={20}/></button>
            </div>

            <div className="space-y-4">
                {events.map(ev => (
                    <div key={ev.id} className="glass-card p-0 rounded-[2.5rem] overflow-hidden border-white/60 shadow-lg">
                        <div className="h-32 bg-slate-200 relative">
                            <img src={ev.banner} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute top-4 left-4 bg-slate-900 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                                {ev.isPublic ? <Globe size={10}/> : <Lock size={10}/>} {ev.isPublic ? 'Public' : 'Private'}
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="font-black text-slate-900 uppercase italic leading-none mb-4">{ev.title}</h4>
                            <div className="flex gap-2">
                                <button onClick={() => TelegramWebApp.openLink(`https://www.google.com/maps/search/${ev.location}`)} className="flex-1 bg-emerald-50 text-emerald-600 py-3 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2"><MapPin size={12}/> Location</button>
                                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl"><LinkIcon size={14}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* WALLET VIEW */}
        {activeTab === 'wallet' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key="wallet" className="text-center pt-8 space-y-8">
            <div className="w-28 h-28 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border-2 border-white"><WalletIcon size={50} className="text-emerald-500" /></div>
            <div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{xp} <span className="text-sm italic text-emerald-500">$NAF</span></h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Circulating Wellness Credits</p>
            </div>
            <div className="flex justify-center"><TonConnectButton /></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE EVENT MODAL */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-end">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-[3rem] w-full p-8 pb-12 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black uppercase italic text-slate-900">New Protocol Event</h3>
                    <button onClick={() => setShowEventModal(false)} className="p-2 bg-slate-100 rounded-full"><X/></button>
                </div>
                
                <div className="space-y-4">
                    <input value={newEv.title} onChange={e => setNewEv({...newEv, title: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold text-sm" placeholder="Event Title (e.g. Kite Beach Yoga)" />
                    <input value={newEv.location} onChange={e => setNewEv({...newEv, location: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-bold text-sm" placeholder="Paste Location Name" />
                    <div className="flex gap-2">
                        <button onClick={() => setNewEv({...newEv, isPublic: true})} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase border-2 transition-all ${newEv.isPublic ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-100 text-slate-400'}`}>Public Hub</button>
                        <button onClick={() => setNewEv({...newEv, isPublic: false})} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase border-2 transition-all ${!newEv.isPublic ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-100 text-slate-400'}`}>Private</button>
                    </div>
                    <button onClick={handleCreateEvent} className="w-full bg-emerald-500 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20 mt-4">Broadcast Event</button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
