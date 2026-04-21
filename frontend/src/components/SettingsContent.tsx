'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Droplets, Cigarette, Lock, Unlock, 
  Moon, Sun, CheckCircle2, Plus, Save, 
  ArrowLeft, Target, Ruler, Globe, Apple,
  Dna, Weight, Scale, Info, X, ClipboardCheck
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
  const activeRoutine = getActiveRoutine();

  // Reflection State
  const [showReflection, setShowReflection] = useState(false);
  const [tomorrowGoal, setTomorrowGoal] = useState('');

  const bodyTypes = ['Ectomorph', 'Mesomorph', 'Endomorph', 'Athletic', 'Lean'];
  const ethnicities = ['Arab', 'South Asian', 'East Asian', 'European', 'African', 'Hispanic', 'Other'];

  const handleSaveProfile = () => {
    setEditMode(false);
    TelegramWebApp.HapticFeedback.notificationOccurred('success');
    TelegramWebApp.showPopup({ 
        title: 'Identity Synced',
        message: 'Your Bio-Protocol data has been indexed for AI optimization.' 
    });
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-transparent pb-40">
      
      {/* 1. STICKY HEADER */}
      <div className="p-6 pt-10 flex items-center justify-between sticky top-0 bg-white/60 backdrop-blur-xl z-50 border-b border-white/20">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-xl active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-slate-900" />
        </button>
        <h1 className="text-xl font-black uppercase italic tracking-tighter">Bio-Protocol</h1>
        <button 
            onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
            className={`p-2 rounded-xl transition-all ${editMode ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-900 text-white shadow-slate-200'} shadow-lg`}
        >
            {editMode ? <Save size={20} /> : <Dna size={20} />}
        </button>
      </div>

      <div className="p-6 space-y-8">
        
        {/* 2. PHYSICAL BIO-IDENTITY (Expanded) */}
        <div className="glass-card p-8 rounded-[3rem] border-white/60 shadow-2xl bg-white/40">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20"><User size={20} /></div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Physical Bio-Data</h3>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <div className="col-span-2 space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Globe size={10}/> Ancestry / Ethnicity</p>
              {editMode ? (
                <select 
                  value={healthProfile.ethnicity} 
                  onChange={(e) => updateHealth({ ethnicity: e.target.value })}
                  className="w-full p-4 bg-white rounded-2xl text-xs font-black outline-none border border-slate-100 shadow-inner"
                >
                  <option value="">Select Ancestry</option>
                  {ethnicities.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              ) : (
                <div className="p-4 bg-white/50 rounded-2xl text-xs font-black text-slate-700 border border-white/10 italic">
                  {healthProfile.ethnicity || 'Not Indexed'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Ruler size={10}/> Height</p>
              <div className="relative">
                  <input 
                    disabled={!editMode}
                    value={healthProfile.height}
                    onChange={(e) => updateHealth({ height: e.target.value })}
                    placeholder="175"
                    className="w-full p-4 bg-white disabled:bg-transparent rounded-2xl text-xs font-black outline-none border border-slate-100 disabled:border-white/10 shadow-inner"
                  />
                  <span className="absolute right-4 top-4 text-[9px] font-black text-slate-300 uppercase">CM</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Scale size={10}/> Mass</p>
              <div className="relative">
                  <input 
                    disabled={!editMode}
                    value={healthProfile.weight}
                    onChange={(e) => updateHealth({ weight: e.target.value })}
                    placeholder="75"
                    className="w-full p-4 bg-white disabled:bg-transparent rounded-2xl text-xs font-black outline-none border border-slate-100 disabled:border-white/10 shadow-inner"
                  />
                  <span className="absolute right-4 top-4 text-[9px] font-black text-slate-300 uppercase">KG</span>
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Target size={10}/> Morphology</p>
              {editMode ? (
                <select 
                  value={healthProfile.bodyType} 
                  onChange={(e) => updateHealth({ bodyType: e.target.value })}
                  className="w-full p-4 bg-white rounded-2xl text-xs font-black outline-none border border-slate-100 shadow-inner"
                >
                  <option value="">Select Morphology</option>
                  {bodyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              ) : (
                <div className="p-4 bg-white/50 rounded-2xl text-xs font-black text-slate-700 border border-white/20 italic">
                  {healthProfile.bodyType || 'Calculating...'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. DAILY HABIT MINING */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Resource Management</p>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Water */}
            <div className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between bg-blue-50/20 border-white/40 shadow-xl">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-xl border border-blue-50"><Droplets size={28} /></div>
                    <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase italic leading-none">Hydration</h4>
                        <p className="text-[10px] font-bold text-blue-400 mt-1 uppercase">{dailyWater} / 10 Glasses</p>
                    </div>
                </div>
                <button onClick={() => trackHabit('water', 1)} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition"><Plus /></button>
            </div>

            {/* Smoking */}
            <div className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between bg-rose-50/20 border-white/40 shadow-xl">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-xl border border-rose-50"><Cigarette size={28} /></div>
                    <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase italic leading-none">Combustion</h4>
                        <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase">{dailyCigs} Units Tracked</p>
                    </div>
                </div>
                <button onClick={() => trackHabit('cigs', 1)} className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition"><Plus /></button>
            </div>

            {/* Fruits (Micros) */}
            <div className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between bg-emerald-50/20 border-white/40 shadow-xl">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl border border-emerald-50"><Apple size={28} /></div>
                    <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase italic leading-none">Micro-Intake</h4>
                        <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase">Daily Fruit Quota</p>
                    </div>
                </div>
                <button onClick={() => logActivity('habit', 'Fruit Protocol', 5)} className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition"><CheckCircle2 /></button>
            </div>
          </div>
        </div>

        {/* 4. TEMPORAL GATEWAYS */}
        <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Protocol Hubs</p>
            
            <div className={`glass-card p-6 rounded-[2.5rem] flex items-center justify-between border-white/60 shadow-xl ${activeRoutine === 'morning' ? 'bg-white border-amber-200' : 'opacity-40 grayscale'}`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 rounded-xl text-amber-500"><Sun size={24} className={activeRoutine === 'morning' ? 'animate-spin-slow' : ''} /></div>
                    <div>
                        <span className="text-sm font-black uppercase italic text-slate-900 block leading-none">Morning Alignment</span>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Gated: 05:00 - 11:00</p>
                    </div>
                </div>
                {activeRoutine === 'morning' ? <Unlock size={16} className="text-emerald-500" /> : <Lock size={16} className="text-slate-300" />}
            </div>
            
            <div 
              onClick={() => activeRoutine === 'evening' && setShowReflection(true)}
              className={`glass-card p-6 rounded-[2.5rem] flex items-center justify-between border-white/60 shadow-xl cursor-pointer active:scale-[0.98] transition-all ${activeRoutine === 'evening' ? 'bg-white border-indigo-300' : 'opacity-40 grayscale'}`}
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Moon size={24} /></div>
                    <div>
                        <span className="text-sm font-black uppercase italic text-slate-900 block leading-none">Evening Reflection</span>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Gated: 20:00 - 05:00</p>
                    </div>
                </div>
                {activeRoutine === 'evening' ? <Unlock size={16} className="text-indigo-500 animate-pulse" /> : <Lock size={16} className="text-slate-300" />}
            </div>
        </div>
      </div>

      {/* 5. MODAL: NIGHTLY PROTOCOL REFLECTION */}
      <AnimatePresence>
        {showReflection && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex items-end">
                <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white w-full rounded-t-[4rem] p-10 pb-16 shadow-2xl border-t-4 border-indigo-500">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-black text-slate-900 italic uppercase underline decoration-indigo-500 decoration-4 underline-offset-8">Reflection</h2>
                        <button onClick={() => setShowReflection(false)} className="p-3 bg-slate-100 rounded-full active:scale-75 transition-transform"><X size={20}/></button>
                    </div>
                    
                    <div className="space-y-8">
                        <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-inner">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2"><ClipboardCheck size={16}/> Protocol Checklist</span>
                            <CheckCircle2 size={24} className={dailyWater >= 8 ? 'text-emerald-500' : 'text-slate-200'} />
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tomorrow's Core Optimization</p>
                            <textarea 
                                value={tomorrowGoal}
                                onChange={(e) => setTomorrowGoal(e.target.value)}
                                className="w-full p-6 bg-slate-50 rounded-[2rem] border-none outline-none font-bold text-sm h-32 shadow-inner focus:ring-2 ring-indigo-500/20 transition-all"
                                placeholder="Type target here (e.g. 5km Al Qudra)..."
                            />
                        </div>
                        
                        <button 
                            onClick={() => {
                                logActivity('task', 'Daily Reflection', 50);
                                TelegramWebApp.HapticFeedback.notificationOccurred('success');
                                setShowReflection(false);
                            }}
                            className="w-full py-6 bg-slate-900 text-white rounded-[2.2rem] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                        >
                            Log Reflection & Archive Day
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
