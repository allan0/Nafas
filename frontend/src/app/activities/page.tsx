'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Zap, 
  Trophy, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';

// --- TYPES ---
interface Activity {
  id: string;
  title: string;
  category: string;
  tokens: number;
  duration: string;
  completed: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export default function ActivitiesPage() {
  const [tonConnectUI] = useTonConnectUI();
  const [loading, setLoading] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  
  // Simulated activities synced with the AI Engine
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', title: 'Box Breathing (4-7-8)', category: 'Yoga', tokens: 20, duration: '5 min', completed: false, difficulty: 'Easy' },
    { id: '2', title: 'Nasal Breathing Run', category: 'Endurance', tokens: 60, duration: '30 min', completed: false, difficulty: 'Medium' },
    { id: '3', title: 'Oil Pulling Ritual', category: 'Dental', tokens: 15, duration: '10 min', completed: false, difficulty: 'Easy' },
    { id: '4', title: 'HIIT Session (Indoor)', category: 'Endurance', tokens: 100, duration: '45 min', completed: false, difficulty: 'Hard' },
  ]);

  // Handle Activity Logging
  const handleComplete = async (id: string, tokenAmount: number) => {
    if (!tonConnectUI.connected) {
      alert("Please connect your TON wallet to earn $NAF rewards!");
      return;
    }

    setLoading(id);
    
    // 1. Simulate API verification to Backend
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      // 2. Update local state
      setActivities(prev => prev.map(act => 
        act.id === id ? { ...act, completed: true } : act
      ));
      
      setScore(prev => prev + tokenAmount);
      
      // 3. In production, trigger a 'mint' request to your backend 
      // which has the MINTER_ROLE on the Smart Contract.
      console.log(`Verified activity ${id}. Backend minting ${tokenAmount} $NAF...`);

    } catch (error) {
      console.error("Verification failed");
    } finally {
      setLoading(null);
    }
  };

  const completionRate = (activities.filter(a => a.completed).length / activities.length) * 100;

  return (
    <div className="p-6 max-w-md mx-auto pb-24">
      {/* Progress Header */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-20">
            <Trophy size={80} />
        </div>
        
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Activities</h1>
            <p className="text-slate-400 text-sm mb-6">Complete tasks to mint $NAF</p>
            
            <div className="flex justify-between items-end mb-2">
                <span className="text-4xl font-black">{Math.round(completionRate)}%</span>
                <span className="text-emerald-400 font-bold">+{score} $NAF today</span>
            </div>
            
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 transition-all duration-1000"
                    style={{ width: `${completionRate}%` }}
                />
            </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className={`group relative bg-white rounded-3xl p-6 transition-all duration-300 border-2 ${
                activity.completed ? 'border-emerald-500/50 bg-emerald-50/30' : 'border-transparent hover:shadow-xl'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                    activity.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {activity.completed ? <CheckCircle2 size={20} /> : <Zap size={20} />}
                </div>
                <div>
                  <h3 className={`font-bold ${activity.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {activity.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Clock size={12} /> {activity.duration} • {activity.category}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-black ${activity.completed ? 'text-slate-300' : 'text-emerald-600'}`}>
                    +{activity.tokens}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    $NAF
                </div>
              </div>
            </div>

            {!activity.completed && (
              <button
                disabled={loading !== null}
                onClick={() => handleComplete(activity.id, activity.tokens)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition active:scale-95 disabled:opacity-50"
              >
                {loading === activity.id ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>Complete Activity <ArrowRight size={16} /></>
                )}
              </button>
            )}
            
            {activity.completed && (
                <div className="text-center py-2 text-emerald-600 text-xs font-bold flex items-center justify-center gap-1">
                    Verified on-chain <CheckCircle2 size={14} />
                </div>
            )}
          </div>
        ))}
      </div>

      {/* UAE Context Footer */}
      <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
        <div className="bg-blue-500 text-white p-2 rounded-xl h-fit">
            <Zap size={16} />
        </div>
        <p className="text-xs text-blue-900 leading-relaxed">
            <span className="font-bold">Pro Tip:</span> In the UAE summer, indoor activities yield a 1.2x $NAF multiplier to encourage consistent habits despite the heat.
        </p>
      </div>
    </div>
  );
}
