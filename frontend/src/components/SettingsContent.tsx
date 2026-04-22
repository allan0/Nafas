'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Droplets, Cigarette, Lock, Unlock, 
  Moon, Sun, CheckCircle2, Plus, Save, 
  ArrowLeft, Target, Ruler, Globe, Apple,
  Dna, Weight, Scale, Info, X, ClipboardCheck, Settings as SettingsIcon,
  RefreshCw, Hash
} from 'lucide-react';
import { useWellnessData } from '@/hooks/useWellnessData';
import TelegramWebApp from '@twa-dev/sdk';

export default function SettingsContent({ onBack }: { onBack: () => void }) {
  const { 
    healthProfile, updateHealth, trackHabit, 
    habits, getActiveRoutine, 
    logActivity, isLoaded 
  } = useWellnessData();

  const [editMode, setEditMode] = useState(false);
  const activeRoutine = getActiveRoutine();

  // Local state for the reflection intention
  const [showReflection, setShowReflection] = useState(false);
  const [tomorrowGoal, setTomorrowGoal] = useState('');

  // Data Options for AI Categorization
  const bodyTypes = ['Ectomorph', 'Mesomorph', 'Endomorph', 'Athletic', 'Lean'];
  const ethnicities = ['Arab', 'South Asian', 'East Asian', 'European', 'African', 'Hispanic', 'Other'];

  const handleSaveProfile = () => {
    setEditMode(false);
    // Notify the user via Telegram Haptics and Popup
    try {
        TelegramWebApp.HapticFeedback.notificationOccurred('success');
        TelegramWebApp.showPopup({ 
            title: 'Neural Sync Complete',
            message: 'Your Bio-Identity has been indexed. The AI will now adjust your protocols based on your ethnicity and morphology.' 
        });
    } catch (e) { console.log("System sync complete"); }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-transparent pb-40">
      
      {/* 1. STICKY PROTOCOL HEADER */}
      <div className="p-6 pt-10 flex items-center justify-between sticky top-0 bg-white/60 backdrop-blur-xl z-50 border-b border-white/20">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-xl active:scale-90 transition-transform">
          <ArrowLeft size={20} className="text-slate-900" />
        </button>
        <div className="text-center">
            <h1 className="text-xl font-black uppercase italic tracking-tighter">Bio-Protocol</h1>
            <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Architect Level</p>
        </div>
        <button 
            onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
            className={`p-2 rounded-xl transition-all ${editMode ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-900 text-white shadow-slate-200'} shadow-lg`}
        >
            {editMode ? <Save size={20} /> : <SettingsIcon size={20} />}
        </button>
      </div>

      <div className="p-6 space-y-8">
        
        {/* 2. PHYSICAL NEURAL INDEX (The data the AI needs) */}
        <div className="glass-card p-8 rounded-[3rem] border-white/60 shadow-2xl bg-white/40">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-900 text-emerald-400 rounded-2xl shadow-lg"><Dna size={20} /></div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Identity Index</h3>
            </div>
            {editMode && <span className="text-[10px] font-black text-emerald-500 animate-pulse uppercase">Editing</span>}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {/* Ethnicity/Ancestry */}
            <div className="col-span-2 space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Globe size={10}/> Ancestry Profile</p>
              {editMode ? (
                <select 
                  value={healthProfile.ethnicity} 
                  onChange={(e) => updateHealth({ ethnicity: e.target.value })}
                  className="w-full p-4 bg-white rounded-2xl text-xs font-black outline-none border border-slate-100 shadow-inner"
                >
                  {ethnicities.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              ) : (
                <div className="p-4 bg-white/50 rounded-2xl text-xs font-black text-slate-700 border border-white/10 italic">
                  {healthProfile.ethnicity}
                </div>
              )}
            </div>

            {/* Height */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Ruler size={10}/> Stature (CM)</p>
              <input 
                disabled={!editMode}
                type="number"
                value={healthProfile.height}
                onChange={(e) => updateHealth({ height: e.target.value })}
                className="w-full p-4 bg-white disabled:bg-transparent rounded-2xl text-xs font-black outline-none border border-slate-100 disabled:border-white/10 shadow-inner"
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Scale size={10}/> Mass (KG)</p>
              <input 
                disabled={!editMode}
                type="number"
                value={healthProfile.weight}
                onChange={(e) => updateHealth({ weight: e.target.value })}
                className="w-full p-4 bg-white disabled:bg-transparent rounded-2xl text-xs font-black outline-none border border-slate-100 disabled:border-white/10 shadow-inner"
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Hash size={10}/> Solar Cycles</p>
                <input 
                    disabled={!editMode}
                    type="number"
                    value={healthProfile.age}
                    onChange={(e) => updateHealth({ age: e.target.value })}
                    className="w-full p-4 bg-white disabled:bg-transparent rounded-2xl text-xs font-black outline-none border border-slate-100 disabled:border-white/10 shadow-inner"
                />
            </div>

            {/* Morphology */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Target size={10}/> Morphology</p>
              {editMode ? (
                <select 
                  value={healthProfile.bodyType} 
                  onChange={(e) => updateHealth({ bodyType: e.target.value })}
                  className="w-full p-4 bg-white rounded-2xl text-xs font-black outline-none border border-slate-100 shadow-inner"
                >
                  {bodyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              ) : (
                <div className="p-4 bg-white/50 rounded-2xl text-xs font-black text-slate-700 border border-white/20 italic">
                  {healthProfile.bodyType}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. DAILY HABIT LOGGING (Neural Feedback) */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Behavioral Indexing</p>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Water */}
            <div className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between bg-blue-50/20 border-white/40 shadow-xl">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-xl border border-blue-50"><Droplets size={28} /></div>
                    <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase italic leading-none">Hydration</h4>
                        <p className="text-[10px] font-bold text-blue-400 mt-1 uppercase">{habits.dailyWater} / 10 Units</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => trackHabit('dailyWater', -1)} className="w-10 h-10 bg-white text-slate-400 rounded-xl flex items-center justify-center shadow-sm active:scale-90 transition">X</button>
                    <button onClick={() => trackHabit('dailyWater', 1)} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition"><Plus /></button>
                </div>
            </div>

            {/* Combustion (Smoking) */}
            <div className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between bg-rose-50/20 border-white/40 shadow-xl">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-xl border border-rose-50"><Cigarette size={28} /></div>
                    <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase italic leading-none">Combustion</h4>
                        <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase">{habits.dailyCigs} Inhaled</p>
                    </div>
                </div>
                <button onClick={() => trackHabit('dailyCigs', 1)} className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition"><Plus /></button>
            </div>

            {/* Micronutrients */}
            <div className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between bg-emerald-50/20 border-white/40 shadow-xl">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl border border-emerald-50"><Apple size={28} /></div>
                    <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase italic leading-none">Micros</h4>
                        <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase">{habits.fruitHabit} Servings</p>
                    </div>
                </div>
                <button onClick={() => trackHabit('fruitHabit', 1)} className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition"><CheckCircle2 /></button>
            </div>
          </div>
        </div>

        {/* 4. TEMPORAL PROTOCOLS */}
        <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 italic">Time-Locked Hubs</p>
            
            <div className={`glass-card p-6 rounded-[2.5rem] flex items-center justify-between border-white/60 shadow-xl ${activeRoutine === 'morning' ? 'bg-white border-amber-200' : 'opacity-40 grayscale'}`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 rounded-xl text-amber-500"><Sun size={24} /></div>
                    <div>
                        <span className="text-sm font-black uppercase italic text-slate-900 block leading-none">Morning Alignment</span>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Status: {activeRoutine === 'morning' ? 'Unlocked' : 'Locked'}</p>
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
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Focus: Intention Setting</p>
                    </div>
                </div>
                {activeRoutine === 'evening' ? <Unlock size={16} className="text-indigo-500 animate-pulse" /> : <Lock size={16} className="text-slate-300" />}
            </div>
        </div>
      </div>

      {/* 5. INTENTION REFLECTION MODAL */}
      <AnimatePresence>
        {showReflection && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex items-end">
                <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white w-full rounded-t-[4rem] p-10 pb-16 shadow-2xl border-t-4 border-indigo-500">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-black text-slate-900 italic uppercase underline decoration-indigo-500 decoration-4 underline-offset-8">Reflection</h2>
                        <button onClick={() => setShowReflection(false)} className="p-3 bg-slate-100 rounded-full"><X size={20}/></button>
                    </div>
                    
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Tomorrow's Core Intention</p>
                            <textarea 
                                value={tomorrowGoal}
                                onChange={(e) => setTomorrowGoal(e.target.value)}
                                className="w-full p-6 bg-slate-50 rounded-[2rem] border-none outline-none font-bold text-sm h-32 shadow-inner focus:ring-2 ring-indigo-500/20 transition-all"
                                placeholder="State your primary wellness objective..."
                            />
                        </div>
                        
                        <button 
                            onClick={() => {
                                logActivity('task', 'Nightly Protocol Indexed', 50);
                                setShowReflection(false);
                            }}
                            className="w-full py-6 bg-slate-900 text-white rounded-[2.2rem] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                        >
                            Log Intention & Claim 50 XP
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
