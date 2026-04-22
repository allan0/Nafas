'use client';

import { useState, useMemo } from 'react';
import { 
  Award, Flame, Calendar as CalIcon, Wallet as WalletIcon, 
  Settings as SettingsIcon, History, Plus, MapPin, Image as ImageIcon,
  ChevronRight, BarChart3, Zap, Clock, X, Globe, Lock, 
  Play, Trash2, User, Info, Activity, Edit3, Scale
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
    xp, history, habits, healthProfile, events, addEvent, deleteEvent, isLoaded 
  } = useWellnessData();
  
  const [activeTab, setActiveTab] = useState<'analysis' | 'calendar' | 'wallet'>('analysis');
  const [showEventModal, setShowEventModal] = useState(false);

  // --- NEURAL ANALYSIS ENGINE ---
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

    // Neural BMI Calculation for visual feedback
    const hMeters = parseFloat(healthProfile.height) / 100;
    const bmi = (parseFloat(healthProfile.weight) / (hMeters * hMeters)).toFixed(1);

    return { 
      todayKm: tKm.toFixed(2), 
      yesterdayKm: yKm.toFixed(2), 
      diff: Math.abs(difference).toFixed(2), 
      improved: difference >= 0,
      bmi: bmi
    };
  }, [history, healthProfile]);

  const handleCreateEvent = () => {
    const title = prompt("Hub Name?");
    if (!title) return;
    const newEvent: WellnessEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description: "Community-hosted wellness protocol.",
      location: "UAE",
      link: "",
      date: new Date().toISOString(),
      isPublic: true,
      banner: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600",
    };
    addEvent(newEvent);
    TelegramWebApp.HapticFeedback.notificationOccurred('success');
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-transparent pb-40">
      
      {/* 1. IDENTITY HEADER */}
      <div className="flex flex-col items-center mb-10 pt-10">
        <div className="relative group">
            <div className="w-28 h-28 bg-slate-900 rounded-[3rem] flex items-center justify-center shadow-2xl border-4 border-emerald-500/20">
                <span className="text-4xl text-emerald-400 font-black italic">
                    {healthProfile.ethnicity.charAt(0) || 'N'}
                </span>
            </div>
            <button 
                onClick={onOpenSettings}
                className="absolute -bottom-1 -right-1 bg-white text-slate-900 p-2.5 rounded-2xl shadow-lg active:scale-90 transition-transform border border-slate-100"
            >
                <SettingsIcon size={18} />
            </button>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mt-6 tracking-tighter uppercase italic leading-none">
            {TelegramWebApp.initDataUnsafe?.user?.first_name || 'Protocol Seeker'}
        </h1>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Level: Architect • {healthProfile.bodyType}</p>
      </div>

      {/* 2. NEURAL TAB NAV */}
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
            
            {/* TAB: ANALYSIS (Visualizing what AI sees) */}
            {activeTab === 'analysis' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="analysis" className="space-y-6">
                <div className="glass-card p-8 rounded-[2.8rem] bg-slate-900 text-white overflow-hidden relative shadow-2xl">
                    <BarChart3 className="absolute -top-4 -right-4 text-emerald-500 opacity-10" size={120} />
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Protocol Yield</p>
                    <h3 className="text-xl font-black leading-tight italic">
                        {perfData.improved 
                            ? `Neural indexing up by ${perfData.diff}km today. Protocol stability high.` 
                            : `Activity drop detected. AI recommends a short Box Breath session.`}
                    </h3>
                    
                    <div className="mt-8 flex items-end gap-6 h-16">
                        <div className="flex-1 flex flex-col gap-2">
                             <div className="w-full bg-white/10 rounded-t-xl" style={{height: '40%'}} />
                             <span className="text-[7px] font-black uppercase opacity-40 text-center">Yesterday</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                             <motion.div initial={{height: 0}} animate={{height: '90%'}} className="w-full bg-gradient-to-t from-emerald-500 to-blue-400 rounded-t-xl" />
                             <span className="text-[7px] font-black uppercase text-emerald-400 text-center">Today</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-6 rounded-[2.2rem] border-white/50 bg-white/40">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1"><Scale size={10}/> Bio-BMI</p>
                        <div className="font-black text-2xl text-slate-800">{perfData.bmi} <span className="text-[10px] text-emerald-500">IDx</span></div>
                    </div>
                    <div className="glass-card p-6 rounded-[2.2rem] border-white/50 bg-white/40">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1"><Zap size={10}/> Total XP</p>
                        <div className="font-black text-2xl text-slate-800">{xp} <span className="text-[10px] text-amber-500">$NAF</span></div>
                    </div>
                </div>
              </motion.div>
            )}

            {/* TAB: CALENDAR (Hub Management) */}
            {activeTab === 'calendar' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="calendar" className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-sm font-black text-slate-900 uppercase italic">Protocol Hubs</h3>
                    <button onClick={handleCreateEvent} className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl active:scale-90 transition-transform"><Plus size={20}/></button>
                </div>
                <div className="space-y-5">
                    {events.length > 0 ? events.map(ev => (
                        <div key={ev.id} className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between border-white/60 bg-white/40 shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400"><Globe size={24}/></div>
                                <div>
                                    <h4 className="font-black text-slate-900 uppercase italic text-sm">{ev.title}</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{ev.location} Protocol</p>
                                </div>
                            </div>
                            <button onClick={() => deleteEvent(ev.id)} className="p-3 text-rose-300 active:text-rose-500"><Trash2 size={18}/></button>
                        </div>
                    )) : (
                        <div className="py-20 text-center glass-card rounded-[2.5rem] border-dashed border-slate-300 opacity-30">
                            <CalIcon size={40} className="mx-auto mb-2 text-slate-300" />
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Hub Radius Empty</p>
                        </div>
                    )}
                </div>
              </motion.div>
            )}

            {/* TAB: WALLET (SocialFi Interface) */}
            {activeTab === 'wallet' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key="wallet" className="text-center pt-8 space-y-8">
                <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border border-white text-emerald-500"><WalletIcon size={48} /></div>
                <div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{xp} <span className="text-sm italic text-emerald-500 uppercase">$NAF</span></h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Mined Wellness Assets</p>
                </div>
                <div className="flex justify-center"><TonConnectButton /></div>
                
                <div className="text-left space-y-3 pt-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">Neural Ledger History</p>
                    {history.slice(0, 5).map(h => (
                        <div key={h.id} className="glass-card p-5 rounded-[1.8rem] flex justify-between items-center border-white/40 bg-white/40 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm"><Zap size={16} fill="currentColor"/></div>
                                <div>
                                  <p className="text-xs font-black text-slate-800 uppercase italic leading-none mb-1">{h.title}</p>
                                  <p className="text-[8px] text-slate-400 font-bold uppercase">{new Date(h.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p className="text-sm font-black text-emerald-600">+{h.xp}</p>
                        </div>
                    ))}
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
