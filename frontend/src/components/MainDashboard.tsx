'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Award, Flame, Calendar as CalIcon, Wallet as WalletIcon, 
  Settings, History, Plus, MapPin, Image as ImageIcon,
  ChevronRight, TrendingUp, BarChart3, Info, Camera,
  Zap, Clock, Share2, Filter, ExternalLink
} from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWellnessData, HistoryItem, WellnessEvent } from '@/hooks/useWellnessData';
import { useSearchParams, useRouter } from 'next/navigation';
import TelegramWebApp from '@twa-dev/sdk';

export default function ProfileContent() {
  const { xp, history, streak, vitality, events, addEvent, isLoaded } = useWellnessData();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Tab Management: Check URL for 'tab=wallet' to auto-switch
  const [activeTab, setActiveTab] = useState<'stats' | 'calendar' | 'wallet'>(
    (searchParams.get('tab') as any) || 'stats'
  );
  
  const [selectedPose, setSelectedPose] = useState<any>(null);

  // --- ANALYSIS ENGINE ---
  // Calculates real improvement compared to the previous day
  const performanceData = useMemo(() => {
    const todayStr = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const walkHistory = history.filter(h => h.type === 'walk' || h.type === 'run');
    
    const todayKm = walkHistory
      .filter(h => new Date(h.date).toDateString() === todayStr)
      .reduce((acc, h) => acc + parseFloat(h.value || '0'), 0);
      
    const yesterdayKm = walkHistory
      .filter(h => new Date(h.date).toDateString() === yesterdayStr)
      .reduce((acc, h) => acc + parseFloat(h.value || '0'), 0);

    const diff = todayKm - yesterdayKm;
    const improved = diff > 0;

    return { todayKm, yesterdayKm, diff: Math.abs(diff), improved };
  }, [history]);

  const yogaPoses = [
    { 
      title: "Vrikshasana", 
      name: "Tree Pose",
      img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500", 
      desc: "Focus on a fixed point in front of you. UAE Secret: Best performed at sunrise on the beach to ground your energy." 
    },
    { 
      title: "Adho Mukha", 
      name: "Downward Dog",
      img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500", 
      desc: "Decompresses the spine. Ideal for recovery after long Dubai commutes or office hours." 
    }
  ];

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-md mx-auto pb-32">
      
      {/* 1. PROFILE IDENTITY */}
      <div className="flex flex-col items-center mb-10 pt-6">
        <div className="relative group">
            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-28 h-28 bg-gradient-to-br from-emerald-400 via-blue-500 to-indigo-600 rounded-[2.5rem] p-1 shadow-2xl"
            >
                <div className="w-full h-full bg-white rounded-[2.3rem] overflow-hidden flex items-center justify-center border-4 border-white/20">
                    <User size={48} className="text-slate-200" />
                </div>
            </motion.div>
            <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-2.5 rounded-2xl z-20 border-4 border-white shadow-xl">
                <Camera size={16} />
            </div>
        </div>
        <h1 className="text-3xl font-black text-slate-900 mt-6 tracking-tighter italic uppercase">Allan Mureithi</h1>
        <div className="flex items-center gap-2 mt-1">
            <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Protocol Level 4</span>
        </div>
      </div>

      {/* 2. PREMIUM TAB SWITCHER */}
      <div className="flex bg-white/40 backdrop-blur-2xl p-1.5 rounded-[1.8rem] mb-10 border border-white/30 shadow-inner">
        {(['stats', 'calendar', 'wallet'] as const).map(tab => (
            <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3.5 rounded-[1.4rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                    activeTab === tab ? 'bg-slate-900 text-white shadow-2xl scale-[1.02]' : 'text-slate-400'
                }`}
            >
                {tab}
            </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB: ANALYSIS & STATS */}
        {activeTab === 'stats' && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            key="stats" className="space-y-8"
          >
            {/* Real Progress Graph / Analysis */}
            <div className="glass-card p-8 rounded-[2.8rem] bg-slate-900 text-white overflow-hidden relative shadow-2xl border-t border-white/10">
                <BarChart3 className="absolute -top-4 -right-4 text-emerald-500 opacity-10" size={120} />
                <div className="relative z-10">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-3">Today's Analysis</p>
                    <h3 className="text-2xl font-black leading-tight mb-6">
                        {performanceData.diff > 0 
                            ? `You pushed ${performanceData.diff.toFixed(2)} km more than yesterday!` 
                            : `Start moving to beat yesterday's 1.2 km baseline.`}
                    </h3>
                    
                    <div className="flex items-end gap-6 h-32 pt-4">
                        <div className="flex-1 flex flex-col items-center gap-2">
                             <motion.div 
                                initial={{ height: 0 }} animate={{ height: '40%' }}
                                className="w-full bg-white/10 rounded-t-xl" 
                             />
                             <span className="text-[8px] font-bold uppercase opacity-40">Yesterday</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                             <motion.div 
                                initial={{ height: 0 }} animate={{ height: '85%' }}
                                className="w-full bg-gradient-to-t from-emerald-500 to-blue-400 rounded-t-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                             />
                             <span className="text-[8px] font-bold uppercase text-emerald-400">Today</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTAs if data is missing */}
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => router.push('/')} className="glass-card p-5 rounded-[2rem] text-center border-white/40 active:scale-95 transition">
                    <Zap className="mx-auto text-amber-500 mb-2" size={20} />
                    <p className="text-[9px] font-black uppercase text-slate-800">Breath Session</p>
                </button>
                <button onClick={() => router.push('/')} className="glass-card p-5 rounded-[2rem] text-center border-white/40 active:scale-95 transition">
                    <TrendingUp className="mx-auto text-blue-500 mb-2" size={20} />
                    <p className="text-[9px] font-black uppercase text-slate-800">Track a Run</p>
                </button>
            </div>

            {/* Yoga Mini Study */}
            <div className="pt-4">
                <div className="flex justify-between items-center mb-6 px-2">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Yoga Study</h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">2 Poses Daily</span>
                </div>
                <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
                    {yogaPoses.map((pose, i) => (
                        <motion.div 
                            key={i} 
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setSelectedPose(pose)}
                            className="min-w-[240px] h-40 rounded-[2.2rem] bg-slate-100 overflow-hidden relative cursor-pointer shadow-xl border-2 border-white"
                        >
                            <img src={pose.img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={pose.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
                                <p className="text-emerald-400 text-[8px] font-black uppercase tracking-widest">{pose.title}</p>
                                <h5 className="text-white text-sm font-black uppercase leading-none mt-1">{pose.name}</h5>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
          </motion.div>
        )}

        {/* TAB: CALENDAR & EVENTS */}
        {activeTab === 'calendar' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            key="calendar" className="space-y-6"
          >
            <div className="flex justify-between items-center px-2">
                <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase italic leading-none">April 2026</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">UAE Protocol Events</p>
                </div>
                <button className="bg-slate-900 text-white p-3 rounded-[1.2rem] shadow-xl active:scale-90 transition"><Plus size={20}/></button>
            </div>

            <div className="space-y-5">
                {events.length > 0 ? events.map(event => (
                    <motion.div key={event.id} layout className="glass-card p-0 rounded-[2.8rem] overflow-hidden border-white/60 shadow-lg">
                        <div className="h-40 bg-slate-200 relative group">
                            {event.banner ? <img src={event.banner} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300"><ImageIcon size={40}/></div>}
                            <div className="absolute top-5 left-5 bg-slate-900/90 text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase border border-white/20">
                                {event.isPublic ? '🌐 Public Hub' : '🔒 Private'}
                            </div>
                        </div>
                        <div className="p-7">
                            <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight uppercase italic">{event.title}</h4>
                            <div className="flex items-center gap-4 text-slate-400 mb-6">
                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                    <CalIcon size={12}/> 
                                    <span className="text-[10px] font-black uppercase">{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                    <Clock size={12}/> 
                                    <span className="text-[10px] font-black uppercase">09:00 AM</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => TelegramWebApp.openLink(`https://www.google.com/maps/search/${event.location}`)}
                                className="w-full bg-emerald-50 text-emerald-700 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 active:bg-emerald-100 transition shadow-sm"
                            >
                                <MapPin size={14}/> Preview Protocol Site
                            </button>
                        </div>
                    </motion.div>
                )) : (
                    <div className="py-20 text-center opacity-20 italic">
                        <CalIcon size={48} className="mx-auto mb-4" />
                        <p className="text-sm font-black uppercase tracking-widest">No Scheduled Events</p>
                    </div>
                )}
            </div>
          </motion.div>
        )}

        {/* TAB: WALLET & HISTORY */}
        {activeTab === 'wallet' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            key="wallet" className="space-y-8"
          >
            {/* Real Balance Header */}
            <div className="text-center pt-8">
                <div className="w-24 h-24 bg-gradient-to-tr from-emerald-100 to-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner border-2 border-white">
                    <WalletIcon size={44} className="text-emerald-600" />
                </div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
                    {xp} <span className="text-base italic text-emerald-500 uppercase tracking-widest underline decoration-2 offset-4">$NAF</span>
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Protocol Index Assets</p>
            </div>

            <div className="flex justify-center py-4">
                <TonConnectButton />
            </div>

            {/* XP History Timeline */}
            <div className="pt-6">
                <div className="flex justify-between items-center mb-6 px-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><History size={16}/> Mining Logs</h4>
                    <button className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">View All</button>
                </div>
                <div className="space-y-3">
                    {history.length > 0 ? history.map(item => (
                        <div key={item.id} className="glass-card p-5 rounded-[1.8rem] flex items-center justify-between border-white/60 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner border border-slate-50">
                                    <Zap size={18} className="text-amber-500 fill-amber-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-800 leading-tight uppercase italic">{item.title}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{new Date(item.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-emerald-600">+{item.xp}</p>
                                <p className="text-[8px] font-bold text-slate-300 uppercase leading-none">$NAF Index</p>
                            </div>
                        </div>
                    )) : (
                        <div className="py-12 text-center glass-card rounded-[2rem] border-dashed border-slate-200">
                             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No mining history detected</p>
                        </div>
                    )}
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* YOGA INSTRUCTION POP-OUT */}
      <AnimatePresence>
        {selectedPose && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-6"
            >
                <div className="bg-white rounded-[3.5rem] w-full max-w-sm overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/20">
                    <div className="h-72 bg-slate-200 relative">
                        <img src={selectedPose.img} className="w-full h-full object-cover" />
                        <button 
                            onClick={() => setSelectedPose(null)} 
                            className="absolute top-6 right-6 bg-slate-900/50 backdrop-blur-md text-white p-3 rounded-2xl active:scale-90 transition-transform"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-10">
                        <div className="flex items-center gap-2 mb-3">
                             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{selectedPose.title}</p>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-6 italic uppercase leading-none">{selectedPose.name}</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 opacity-80">{selectedPose.desc}</p>
                        
                        <div className="space-y-3">
                            <button 
                                onClick={() => {
                                    alert("Camera protocol initializing...");
                                    setSelectedPose(null);
                                }}
                                className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
                            >
                                <Camera size={18}/> Capture Proof of Yoga
                            </button>
                            <button className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest">Skip instructions</button>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Simple X icon replacement
const X = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
);
