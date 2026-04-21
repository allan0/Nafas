'use client';

import { useState, useMemo } from 'react';
import { 
  Award, Flame, Calendar as CalIcon, Wallet as WalletIcon, 
  Settings as SettingsIcon, History, Plus, MapPin, Image as ImageIcon,
  ChevronRight, BarChart3, Camera, Zap, Clock, X, Globe, Lock, 
  Play, Trash2, Save, User, Info, ExternalLink, Activity, Edit3
} from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWellnessData, WellnessEvent } from '@/hooks/useWellnessData';
import TelegramWebApp from '@twa-dev/sdk';

interface ProfileProps {
  onOpenSettings: () => void;
}

export default function ProfileContent({ onOpenSettings }: ProfileProps) {
  const { 
    xp, history, streak, vitality, events, addEvent, updateEvent, deleteEvent, isLoaded 
  } = useWellnessData();
  
  const [activeTab, setActiveTab] = useState<'analysis' | 'calendar' | 'wallet'>('analysis');
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingHub, setEditingHub] = useState<WellnessEvent | null>(null);

  // Form State for Events
  const [eventForm, setEventForm] = useState({
    title: '', desc: '', location: '', link: '', isPublic: true
  });

  // --- ANALYSIS ENGINE: Dynamic Performance Logic ---
  const perfData = useMemo(() => {
    if (!history || history.length === 0) return { todayKm: 0, yesterdayKm: 0, diff: "0", improved: false };
    
    const todayStr = new Date().toDateString();
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const moveLogs = history.filter(h => h.type === 'walk' || h.type === 'run');
    
    const getKm = (dStr: string) => moveLogs
      .filter(h => new Date(h.date).toDateString() === dStr)
      .reduce((acc, h) => acc + parseFloat(h.value || '0'), 0);
    
    const tKm = getKm(todayStr);
    const yKm = getKm(yesterdayStr);
    const difference = tKm - yKm;

    return { 
      todayKm: tKm.toFixed(2), 
      yesterdayKm: yKm.toFixed(2), 
      diff: Math.abs(difference).toFixed(2), 
      improved: difference >= 0 
    };
  }, [history]);

  const handleCreateEvent = () => {
    if (!eventForm.title) return;
    const newEvent: WellnessEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: eventForm.title,
      description: eventForm.desc,
      location: eventForm.location,
      link: eventForm.link,
      date: new Date().toISOString(),
      isPublic: eventForm.isPublic,
      banner: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600",
    };
    addEvent(newEvent);
    setShowEventModal(false);
    setEventForm({ title: '', desc: '', location: '', link: '', isPublic: true });
    TelegramWebApp.HapticFeedback.notificationOccurred('success');
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-transparent pb-40">
      
      {/* 1. IDENTITY HEADER */}
      <div className="flex flex-col items-center mb-10 pt-10">
        <div className="relative group">
            <div className="w-28 h-28 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl border-4 border-white/20">
                <span className="text-4xl text-emerald-400 font-black italic">A</span>
            </div>
            <button 
                onClick={onOpenSettings}
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-2.5 rounded-2xl border-4 border-white shadow-lg active:scale-90 transition-transform"
            >
                <SettingsIcon size={18} />
            </button>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mt-6 tracking-tighter uppercase italic leading-none">Allan Mureithi</h1>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Protocol Level: Architect</p>
      </div>

      {/* 2. TAB NAVIGATION */}
      <div className="px-6">
        <div className="flex bg-white/40 backdrop-blur-xl p-1.5 rounded-2xl mb-10 border border-white/30 shadow-inner">
            {(['analysis', 'calendar', 'wallet'] as const).map(tab => (
                <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </div>

      <div className="px-6 relative z-10">
        <AnimatePresence mode="wait">
            
            {/* TAB: ANALYSIS */}
            {activeTab === 'analysis' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="analysis" className="space-y-6">
                <div className="glass-card p-8 rounded-[2.8rem] bg-slate-900 text-white overflow-hidden relative shadow-2xl">
                    <BarChart3 className="absolute -top-4 -right-4 text-emerald-500 opacity-10" size={120} />
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Mining Efficiency</p>
                    <h3 className="text-xl font-black leading-tight italic">
                        {parseFloat(perfData.diff) > 0 
                            ? `Protocol Optimized: +${perfData.diff}km gained over yesterday.` 
                            : `Baseline: ${perfData.yesterdayKm}km. Maintain protocol to avoid indexing drop.`}
                    </h3>
                    
                    {/* Visual Comparison Graph */}
                    <div className="mt-8 flex items-end gap-6 h-20">
                        <div className="flex-1 flex flex-col gap-2">
                             <div className="w-full bg-white/10 rounded-t-xl" style={{height: '35%'}} />
                             <span className="text-[7px] font-black uppercase opacity-40 text-center">Yesterday</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                             <motion.div initial={{height: 0}} animate={{height: '85%'}} className="w-full bg-gradient-to-t from-emerald-500 to-blue-400 rounded-t-xl shadow-[0_0_20px_#10b981]" />
                             <span className="text-[7px] font-black uppercase text-emerald-400 text-center">Today</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-5 rounded-[2.2rem] border-white/50 bg-white/40">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Streak</p>
                        <div className="flex items-center gap-2 font-black text-2xl text-slate-800">{streak} <Flame size={18} className="text-orange-500" /></div>
                    </div>
                    <div className="glass-card p-5 rounded-[2.2rem] border-white/50 bg-white/40">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Vitality</p>
                        <div className="flex items-center gap-2 font-black text-2xl text-slate-800">{vitality}% <Activity size={18} className="text-emerald-500" /></div>
                    </div>
                </div>
              </motion.div>
            )}

            {/* TAB: CALENDAR (CRUD) */}
            {activeTab === 'calendar' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="calendar" className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-sm font-black text-slate-900 uppercase italic">Active Hubs</h3>
                    <button onClick={() => setShowEventModal(true)} className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl active:scale-90 transition-transform"><Plus size={20}/></button>
                </div>
                <div className="space-y-5">
                    {events.length > 0 ? events.map(ev => (
                        <div key={ev.id} className="glass-card p-0 rounded-[2.8rem] overflow-hidden border-white/60 shadow-lg bg-white/40">
                            <div className="h-40 bg-slate-200 relative">
                                <img src={ev.banner} className="w-full h-full object-cover opacity-80" alt="event" />
                                <button 
                                    onClick={() => setEditingHub(ev)}
                                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white active:scale-90 transition-transform border border-white/20"
                                >
                                    <Edit3 size={18} />
                                </button>
                            </div>
                            <div className="p-6">
                                <h4 className="font-black text-slate-900 uppercase italic mb-1">{ev.title}</h4>
                                <p className="text-xs text-slate-500 mb-6 italic line-clamp-2">"{ev.description}"</p>
                                <div className="flex gap-2">
                                    <button onClick={() => TelegramWebApp.openLink(`https://www.google.com/maps/search/${ev.location}`)} className="flex-1 bg-slate-900 text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl"><MapPin size={14}/> {ev.location}</button>
                                    {ev.link && <button onClick={() => TelegramWebApp.openLink(ev.link)} className="p-4 bg-emerald-50 text-emerald-600 rounded-xl active:bg-emerald-100"><Play size={18} fill="currentColor"/></button>}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center glass-card rounded-[2.5rem] border-dashed border-slate-300 opacity-30">
                            <CalIcon size={40} className="mx-auto mb-2 text-slate-300" />
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Protocol Hub Empty</p>
                        </div>
                    )}
                </div>
              </motion.div>
            )}

            {/* TAB: WALLET */}
            {activeTab === 'wallet' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key="wallet" className="text-center pt-8 space-y-8">
                <div className="w-28 h-28 bg-emerald-50 rounded-[2.8rem] flex items-center justify-center mx-auto shadow-inner border border-white text-emerald-500"><WalletIcon size={52} /></div>
                <div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{xp} <span className="text-sm italic text-emerald-500 uppercase underline decoration-2">$NAF</span></h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Verified Mining Assets</p>
                </div>
                <div className="flex justify-center mb-10"><TonConnectButton /></div>
                
                <div className="text-left space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">Ledger Logs</p>
                    {history.slice(0, 5).map(h => (
                        <div key={h.id} className="glass-card p-5 rounded-[1.8rem] flex justify-between items-center border-white/40 bg-white/40 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-amber-500"><Zap size={16} fill="currentColor"/></div>
                                <div>
                                  <p className="text-xs font-black text-slate-800 uppercase italic leading-none mb-1">{h.title}</p>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase">{new Date(h.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-emerald-600">+{h.xp}</p>
                                <p className="text-[8px] font-bold text-slate-300 uppercase">Index</p>
                            </div>
                        </div>
                    ))}
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* MODAL: CREATE NEW HUB */}
      <AnimatePresence>
        {showEventModal && (
          <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-end">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-[4rem] w-full p-10 pb-16 shadow-2xl border-t-4 border-emerald-500">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black uppercase italic text-slate-900 italic underline decoration-emerald-500 decoration-4 underline-offset-8">Initialize Hub</h3>
                    <button onClick={() => setShowEventModal(false)} className="p-3 bg-slate-100 rounded-full active:scale-75 transition-transform"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                    <input value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none font-black text-sm uppercase shadow-inner" placeholder="Hub Name" />
                    <textarea value={eventForm.desc} onChange={e => setEventForm({...eventForm, desc: e.target.value})} className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none font-bold text-xs h-32 shadow-inner" placeholder="Protocol Description" />
                    <div className="grid grid-cols-2 gap-3">
                        <input value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} className="p-6 bg-slate-50 rounded-2xl border-none outline-none font-black text-[10px] uppercase shadow-inner" placeholder="UAE Tag (e.g. JBR)" />
                        <input value={eventForm.link} onChange={e => setEventForm({...eventForm, link: e.target.value})} className="p-6 bg-slate-50 rounded-2xl border-none outline-none font-bold text-[10px] shadow-inner" placeholder="Protocol URL (YouTube)" />
                    </div>
                    <button onClick={handleCreateEvent} className="w-full bg-slate-900 text-white py-6 rounded-[2.2rem] font-black uppercase text-xs tracking-widest shadow-2xl mt-6 active:scale-95 transition-all">Broadcast to Tribe</button>
                </div>
            </motion.div>
          </div>
        )}

        {/* MODAL: EDIT HUB */}
        {editingHub && (
          <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex items-end">
            <div className="bg-white w-full rounded-t-[4rem] p-10 pb-16 shadow-2xl">
              <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-8">Modify Protocol Hub</h2>
              <div className="space-y-4">
                <input value={editingHub.title} onChange={e => setEditingHub({...editingHub, title: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm shadow-inner" />
                <textarea value={editingHub.description} onChange={e => setEditingHub({...editingHub, description: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-xs h-32 shadow-inner" />
                <div className="flex gap-2">
                    <button onClick={() => { updateEvent(editingHub.id, editingHub); setEditingHub(null); }} className="flex-[2] py-6 bg-slate-900 text-white rounded-[2.2rem] font-black text-xs uppercase shadow-xl">Update Instance</button>
                    <button onClick={() => { deleteEvent(editingHub.id); setEditingHub(null); }} className="flex-1 p-6 bg-rose-50 text-rose-500 rounded-2xl shadow-sm flex items-center justify-center"><Trash2 size={24}/></button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
