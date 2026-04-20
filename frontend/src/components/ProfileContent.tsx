'use client';

import { useState, useEffect } from 'react';
import { 
  Award, Flame, Calendar as CalIcon, Wallet as WalletIcon, 
  Settings, History, Plus, MapPin, Image as ImageIcon,
  ChevronRight, TrendingUp, BarChart3, Info, Camera, Zap
} from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWellnessData, HistoryItem, WellnessEvent } from '@/hooks/useWellnessData';
import { useSearchParams } from 'next/navigation';
import TelegramWebApp from '@twa-dev/sdk';

export default function ProfileContent() {
  const { xp, history, streak, vitality, events, addEvent, isLoaded } = useWellnessData();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'calendar' | 'wallet'>(
    (searchParams.get('tab') as any) || 'stats'
  );
  
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedPose, setSelectedPose] = useState<any>(null);

  // Analysis Logic: Calculate if we did better than yesterday
  const getWalkAnalysis = () => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const walkHistory = history.filter(h => h.type === 'walk' || h.type === 'run');
    const todayKm = walkHistory.filter(h => new Date(h.date).toDateString() === today)
                    .reduce((acc, h) => acc + parseFloat(h.value || '0'), 0);
    const yesterdayKm = walkHistory.filter(h => new Date(h.date).toDateString() === yesterday.toDateString())
                    .reduce((acc, h) => acc + parseFloat(h.value || '0'), 0);
    
    const diff = todayKm - yesterdayKm;
    return { todayKm, diff };
  };

  const analysis = getWalkAnalysis();

  const yogaPoses = [
    { title: "Tree Pose", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400", desc: "Find balance and focus. Keep your foot away from the knee joint." },
    { title: "Warrior II", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400", desc: "Build leg strength and heat. Gaze over your front hand." }
  ];

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-md mx-auto pb-32">
      
      {/* 1. PROFILE HEADER */}
      <div className="flex flex-col items-center mb-8 pt-4">
        <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10">
                <span className="text-4xl text-white font-black">A</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-2 rounded-xl z-20 border-2 border-white">
                <Settings size={14} />
            </div>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mt-4 tracking-tighter">Allan M.</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Master Protocol Member</p>
      </div>

      {/* 2. TAB NAVIGATOR */}
      <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl mb-8 border border-white/20">
        {(['stats', 'calendar', 'wallet'] as const).map(tab => (
            <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'
                }`}
            >
                {tab}
            </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="stats" className="space-y-6">
            
            {/* Real Analysis Card */}
            <div className="glass-card p-6 rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative">
                <BarChart3 className="absolute top-4 right-4 text-emerald-500 opacity-30" size={60} />
                <p className="text-[9px] font-black text-emerald-400 uppercase mb-2">Performance Data</p>
                <h3 className="text-xl font-bold mb-4 leading-tight">
                    {analysis.diff >= 0 ? `You walked ${analysis.diff.toFixed(2)} km more than yesterday!` : `Keep pushing! You're ${Math.abs(analysis.diff).toFixed(2)} km behind yesterday.`}
                </h3>
                <div className="flex gap-4">
                    <div className="bg-white/10 px-4 py-2 rounded-xl">
                        <p className="text-[8px] opacity-50 uppercase">Today</p>
                        <p className="font-bold text-sm">{analysis.todayKm.toFixed(2)} km</p>
                    </div>
                </div>
            </div>

            {/* XP History List */}
            <div>
                <div className="flex justify-between items-center mb-4 px-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><History size={14}/> XP History</h4>
                    <span className="text-[10px] text-emerald-600 font-bold">Total: {xp} XP</span>
                </div>
                <div className="space-y-3">
                    {history.length > 0 ? history.slice(0, 5).map(item => (
                        <div key={item.id} className="glass-card p-4 rounded-2xl flex items-center justify-between border-white/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Zap size={14} className="text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800">{item.title}</p>
                                    <p className="text-[9px] text-slate-400 uppercase">{item.value || 'Completed'}</p>
                                </div>
                            </div>
                            <span className="text-xs font-black text-emerald-600">+{item.xp}</span>
                        </div>
                    )) : (
                        <div className="w-full py-10 glass-card rounded-[2rem] border-dashed border-slate-300 text-slate-400 text-xs font-bold text-center">
                            No history yet. Start a protocol.
                        </div>
                    )}
                </div>
            </div>

            {/* Yoga Mini Gallery */}
            <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-4">Daily Yoga Study</h4>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {yogaPoses.map((pose, i) => (
                        <motion.div 
                            key={i} 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedPose(pose)}
                            className="min-w-[200px] h-32 rounded-3xl bg-slate-100 overflow-hidden relative cursor-pointer"
                        >
                            <img src={pose.img} className="w-full h-full object-cover" alt={pose.title} />
                            <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                                <p className="text-white text-xs font-black uppercase tracking-tighter">{pose.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
          </motion.div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="calendar" className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Protocol Calendar</h3>
                <button onClick={() => setShowEventModal(true)} className="bg-slate-900 text-white p-2 rounded-xl shadow-lg"><Plus size={18}/></button>
            </div>

            <div className="space-y-4">
                {events.length > 0 ? events.map(event => (
                    <div key={event.id} className="glass-card p-0 rounded-[2.5rem] overflow-hidden border-white/50">
                        <div className="h-32 bg-slate-200 relative">
                            {event.banner ? <img src={event.banner} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="text-slate-400"/></div>}
                            <div className="absolute top-4 left-4 bg-slate-900/80 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase">
                                {event.isPublic ? 'Public Event' : 'Private'}
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="font-black text-slate-800 mb-1">{event.title}</h4>
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase mb-4">
                                <CalIcon size={12}/> {new Date(event.date).toLocaleDateString()}
                            </div>
                            {event.location && (
                                <button 
                                    onClick={() => TelegramWebApp.openLink(`https://www.google.com/maps/search/${event.location}`)}
                                    className="w-full bg-emerald-50 text-emerald-700 py-3 rounded-2xl text-[9px] font-black uppercase flex items-center justify-center gap-2"
                                >
                                    <MapPin size={12}/> Preview Location
                                </button>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 opacity-30 italic text-sm font-bold uppercase tracking-widest">
                        Your calendar is clear.
                    </div>
                )}
            </div>
          </motion.div>
        )}

        {/* WALLET TAB */}
        {activeTab === 'wallet' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="wallet" className="space-y-6 text-center pt-8">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-inner">
                <WalletIcon size={48} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{xp} <span className="text-sm italic text-emerald-500 uppercase tracking-widest">$NAF</span></h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-10 leading-relaxed">
                Tokens are indexed for the UAE Protocol Airdrop.
            </p>
            
            <div className="pt-8 flex justify-center">
                <TonConnectButton />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-10 px-4">
                <div className="glass-card p-5 rounded-3xl border-white/50">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">History</p>
                    <button className="text-xs font-bold text-slate-800 flex items-center gap-1 mx-auto">View All <ChevronRight size={14}/></button>
                </div>
                <div className="glass-card p-5 rounded-3xl border-white/50 opacity-50">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Swap</p>
                    <button className="text-xs font-bold text-slate-400 cursor-not-allowed">Coming Soon</button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* YOGA POSE POP-OUT */}
      <AnimatePresence>
        {selectedPose && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6"
            >
                <div className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden shadow-2xl">
                    <div className="h-64 bg-slate-200 relative">
                        <img src={selectedPose.img} className="w-full h-full object-cover" />
                        <button onClick={() => setSelectedPose(null)} className="absolute top-6 right-6 bg-black/50 text-white p-2 rounded-full"><Plus className="rotate-45"/></button>
                    </div>
                    <div className="p-8">
                        <h3 className="text-2xl font-black text-slate-900 mb-4">{selectedPose.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-8">{selectedPose.desc}</p>
                        <button 
                            onClick={() => alert("Photo capture logic triggered")}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2"
                        >
                            <Camera size={16}/> Update Tribe Feed
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
