'use client';

import { useState } from 'react';
import { Clock, Award, Leaf } from 'lucide-react';
import TelegramWebApp from '@twa-dev/sdk';

export default function Activities() {
  const [logged, setLogged] = useState(4);

  const activities = [
    { title: "10-Minute Meditation", duration: "10 min", reward: 30, icon: "🧘" },
    { title: "Mindful Walk", duration: "20 min", reward: 50, icon: "🚶" },
    { title: "Deep Breathing", duration: "5 min", reward: 20, icon: "🌬️" },
    { title: "Gentle Yoga Flow", duration: "15 min", reward: 40, icon: "🧘‍♀️" },
  ];

  const handleLog = (title: string, reward: number) => {
    setLogged(prev => Math.min(prev + 1, 6));
    alert(`✅ Logged: ${title}\n+${reward} NAF minted!`);
  };

  return (
    <div className="p-6 max-w-md mx-auto pb-24">
      <h1 className="text-3xl font-semibold mb-2">Today’s Activities</h1>
      <p className="text-slate-600 mb-8">Log and earn NAF tokens</p>

      <div className="flex justify-center mb-10">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="14" />
            <circle cx="60" cy="60" r="54" fill="none" stroke="#4ECDC4" strokeWidth="14"
              strokeDasharray={339} strokeDashoffset={339 * (1 - logged / 6)} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold">{logged}/6</div>
              <div className="text-sm text-slate-500">today</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((act, i) => (
          <div key={i} className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 flex justify-between items-center">
            <div className="flex items-center gap-5">
              <div className="text-4xl">{act.icon}</div>
              <div>
                <div className="font-semibold">{act.title}</div>
                <div className="text-sm text-slate-500 flex items-center gap-2">
                  <Clock size={16} /> {act.duration}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-emerald-600 font-medium">+{act.reward} NAF</div>
              <button 
                onClick={() => handleLog(act.title, act.reward)}
                className="mt-2 bg-emerald-500 text-white px-6 py-2 rounded-2xl text-sm"
              >
                Log
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
