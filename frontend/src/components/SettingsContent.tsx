'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Gauge, Droplets, Cigarette, Apple, Lock, Unlock, 
  Moon, Sun, CheckCircle2, Plus, Save, ChevronRight, 
  ArrowLeft, ClipboardCheck, Target, Coffee, Settings as SettingsIcon
} from 'lucide-react';
import { useWellnessData } from '@/hooks/useWellnessData';
import TelegramWebApp from '@twa-dev/sdk';

export default function SettingsContent({ onBack }: { onBack: () => void }) {
  const { 
    healthProfile, updateHealth, trackHabit, 
    dailyWater, dailyCigs, getActiveRoutine, 
    xp, logActivity, isLoaded 
  } = useWellnessData();

  const [editMode, setEditMode] = useState(false);
  const activeRoutine = getActiveRoutine(); // 'morning' | 'evening' | 'locked'

  // Reflection State
  const [showReflection, setShowReflection] = useState(false);
  const [tomorrowGoal, setTomorrowGoal] = useState('');

  const bodyTypes = ['Ectomorph', 'Mesomorph', 'Endomorph', 'Athletic', 'Curvy'];

  const handleSaveProfile = () => {
    setEditMode(false);
    TelegramWebApp.HapticFeedback.notificationOccurred('success');
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-transparent pb-32">
      {/* 1. HEADER */}
      <div className="p-6 pt-10 flex items-center justify-between sticky top-0 bg-white/60 backdrop-blur-xl z-50 border-b border-white/20">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-xl active:scale-90 transition-transform"><ArrowLeft size={20} /></button>
        <h1 className="text-xl font-black uppercase italic tracking-tighter">Protocol Settings</h1>
        <button 
            onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
            className={`p-2 rounded-xl transition-all ${editMode ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}
        >
            {editMode ? <Save size={20} /> : <SettingsIcon size={20} />}
        </button>
      </div>

      <div className="p-6 space-y-8">
        
        {/* 2. HEALTH PROFILE CARD (Progressive Update) */}
        <div className="glass-card p-6 rounded-[2.5rem] border-white/60 shadow-xl bg-white/40">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 shadow-inner"><User size={18} /></div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Physical Bio-Data</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[8px] font-black text-slate-400 uppercase ml-2">Morphology</p>
              {editMode ? (
                <select 
                  value={healthProfile.bodyType} 
                  onChange={(e) => updateHealth({ bodyType: e.target.value })}
                  className="w-full p-3 bg-white rounded-2xl text-xs font-bold outline-none border border-slate-100"
                >
                  <option value="">Select Type</option>
                  {bodyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              ) : (
                <div className="p-3 bg-white/50 rounded-2xl text-xs font-black text-slate-700 border border-white/20">{healthProfile.bodyType || 'Not set'}</div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-[8px] font-black text-slate-400 uppercase ml-2">Net Mass (KG)</p>
              <input 
                disabled={!editMode}
                type="number"
                value={healthProfile.weight}
                onChange={(e) => updateHealth({ weight: e.target.value })}
                placeholder="00"
                className="w-full p-3 bg-white disabled:bg-transparent rounded-2xl text-xs font-black outline-none border border-slate-100 disabled:border-white/20"
              />
            </div>
          </div>
        </div>

        {/* 3. HABIT TRACKERS (Daily Mining) */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 italic">Daily Habit Protocol</p>
          
          {/* Water Tracker */}
          <div className="glass-card p-5 rounded-[2.2rem] flex items-center justify-between border-white/50 shadow-lg bg-white/40">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner">
                    <Droplets size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase italic">Hydration</h4>
                    <p className="text-[10px] font-bold text-blue-400 uppercase">{dailyWater} Glasses Indexed</p>
                </div>
            </div>
            <button 
              onClick={() => { trackHabit('water', 1); TelegramWebApp.HapticFeedback.impactOccurred('light'); }}
              className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center active:scale-90 transition shadow-lg"
            >
                <Plus size={20} />
            </button>
          </div>

          {/* Smoking Tracker */}
          <div className="glass-card p-5 rounded-[2.2rem] flex items-center justify-between border-white/50 shadow-lg bg-white/40">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-inner">
                    <Cigarette size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase italic">Combustion</h4>
                    <p className="text-[10px] font-bold text-rose-400 uppercase">{dailyCigs} Units Today</p>
                </div>
            </div>
            <button 
              onClick={() => { trackHabit('cigs', 1); TelegramWebApp.HapticFeedback.notificationOccurred('warning'); }}
              className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center active:scale-90 transition border border-rose-200"
            >
                <Plus size={20} />
            </button>
          </div>
        </div>

        {/* 4. TEMPORAL ROUTINES (Morning/Evening) */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 italic">Temporal Gates</p>
          
          {/* Morning Gate */}
          <div className={`glass-card p-6 rounded-[2.5rem] border-white/60 transition-all ${activeRoutine === 'morning' ? 'bg-white shadow-2xl border-amber-200' : 'opacity-40 grayscale'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <Sun className={activeRoutine === 'morning' ? 'text-amber-500' : 'text-slate-400'} size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase italic">Sunrise Alignment</h3>
                </div>
                {activeRoutine !== 'morning' && <Lock size={16} className="text-slate-400" />}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-6 tracking-widest">Available 05:00 — 11:00 GST</p>
            <button 
                disabled={activeRoutine !== 'morning'}
                className="w-full py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest disabled:bg-slate-200"
            >
                Start Morning Sequence
            </button>
          </div>

          {/* Evening Gate */}
          <div className={`glass-card p-6 rounded-[2.5rem] border-white/60 transition-all ${activeRoutine === 'evening' ? 'bg-white shadow-2xl border-indigo-200' : 'opacity-40 grayscale'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <Moon className={activeRoutine === 'evening' ? 'text-indigo-600' : 'text-slate-400'} size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase italic">Evening Wind-down</h3>
                </div>
                {activeRoutine === 'evening' ? <Unlock size={16} className="text-emerald-500 animate-pulse" /> : <Lock size={16} className="text-slate-400" />}
            </div>
            <button 
                onClick={() => setShowReflection(true)}
                disabled={activeRoutine !== 'evening'}
                className="w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-200"
            >
                Launch End-of-Day Reflection
            </button>
          </div>
        </div>
      </div>

      {/* 5. REFLECTION QUESTIONNAIRE MODAL */}
      <AnimatePresence>
        {showReflection && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex items-end"
            >
                <motion.div 
                    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                    className="bg-white w-full rounded-t-[4rem] p-10 pb-16 shadow-2xl border-t-4 border-indigo-500"
                >
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-black text-slate-900 italic uppercase underline decoration-indigo-500 decoration-4 underline-offset-8">Reflection</h2>
                        <button onClick={() => setShowReflection(false)} className="p-3 bg-slate-100 rounded-full active:scale-75 transition-transform"><XIcon size={20}/></button>
                    </div>
                    
                    <div className="space-y-8">
                        <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-inner">
                            <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Drunk Required Water?</span>
                            <CheckCircle2 size={24} className={dailyWater >= 8 ? 'text-emerald-500' : 'text-slate-200'} />
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tomorrow's Core Intention</p>
                            <textarea 
                                value={tomorrowGoal}
                                onChange={(e) => setTomorrowGoal(e.target.value)}
                                className="w-full p-6 bg-slate-50 rounded-[2rem] border-none outline-none font-bold text-sm h-32 shadow-inner focus:ring-2 ring-indigo-500/20 transition-all"
                                placeholder="Write down your focus for tomorrow..."
                            />
                        </div>
                        
                        <button 
                            onClick={() => {
                                logActivity('task', 'Daily Protocol Reflection', 50);
                                TelegramWebApp.HapticFeedback.notificationOccurred('success');
                                setShowReflection(false);
                            }}
                            className="w-full py-6 bg-slate-900 text-white rounded-[2.2rem] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                        >
                            Finalize Reflection & Index 50 XP
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple X icon helper
const XIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
);
