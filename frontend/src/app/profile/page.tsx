'use client';

import { useState } from 'react';
import { Award, Flame, Calendar, Settings, LogOut, Wallet as WalletIcon } from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';

export default function Profile() {
  const [nafEarned, setNafEarned] = useState(1245);
  const [activitiesCompleted, setActivitiesCompleted] = useState(47);
  const [currentStreak, setCurrentStreak] = useState(12);
  const [username] = useState("Allan");

  const transactions = [
    { type: "Reward", amount: "+80", activity: "Meditation session", time: "Today 09:15" },
    { type: "Tip Sent", amount: "-50", activity: "To Lena Yoga", time: "Yesterday 18:40" },
    { type: "Reward", amount: "+30", activity: "Breathing exercise", time: "Yesterday 08:22" },
    { type: "Tip Received", amount: "+100", activity: "From community", time: "2 days ago" },
  ];

  return (
    <div className="p-6 max-w-md mx-auto pb-28">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-28 h-28 bg-gradient-to-br from-[#7CC6E8] via-[#A5D8F8] to-[#A8E6B8] rounded-full flex items-center justify-center shadow-xl mb-4 relative">
          <div className="text-6xl">🌿</div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-xs w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
            ✓
          </div>
        </div>
        
        <h1 className="text-3xl font-semibold">{username}</h1>
        <p className="text-slate-600 mt-1">Breathing my way to calm</p>
        
        <div className="mt-6 flex gap-4">
          <TonConnectButton />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 text-center shadow-sm">
          <Award className="mx-auto text-emerald-500 mb-3" size={32} />
          <div className="text-3xl font-bold text-slate-800">{nafEarned}</div>
          <div className="text-xs text-slate-500 tracking-widest mt-1">NAF EARNED</div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 text-center shadow-sm">
          <Calendar className="mx-auto text-blue-500 mb-3" size={32} />
          <div className="text-3xl font-bold text-slate-800">{activitiesCompleted}</div>
          <div className="text-xs text-slate-500 tracking-widest mt-1">ACTIVITIES</div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 text-center shadow-sm">
          <Flame className="mx-auto text-orange-500 mb-3" size={32} />
          <div className="text-3xl font-bold text-slate-800">{currentStreak}</div>
          <div className="text-xs text-slate-500 tracking-widest mt-1">DAY STREAK</div>
        </div>
      </div>

      {/* Wallet Section */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-7 mb-10 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <WalletIcon className="text-emerald-600" size={28} />
            <div>
              <div className="font-semibold">My NAF Wallet</div>
              <div className="text-xs text-slate-500">on TON Blockchain</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">{nafEarned} NAF</div>
            <div className="text-xs text-slate-500">≈ $12.45</div>
          </div>
        </div>

        <button 
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition mb-4"
          onClick={() => alert("Claiming daily reward... +50 NAF minted!")}
        >
          Claim Daily Reward (+50 NAF)
        </button>

        <div className="text-xs text-center text-slate-500">
          Your TON address will appear here after first connection
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-semibold text-lg">Recent Activity</h2>
          <span className="text-xs text-slate-500">View all →</span>
        </div>

        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div key={index} className="bg-white/80 backdrop-blur rounded-2xl p-5 flex justify-between items-center">
              <div>
                <div className="font-medium">{tx.activity}</div>
                <div className="text-xs text-slate-500">{tx.time}</div>
              </div>
              <div className={`font-semibold ${tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>
                {tx.amount} NAF
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 space-y-5">
        <button className="w-full flex items-center gap-4 py-3 text-left hover:bg-slate-50 rounded-2xl px-4 transition">
          <Settings size={22} className="text-slate-500" />
          <span className="font-medium">Appearance & Theme</span>
        </button>
        
        <button className="w-full flex items-center gap-4 py-3 text-left hover:bg-slate-50 rounded-2xl px-4 transition">
          <div className="w-5 h-5 rounded bg-slate-200"></div>
          <span className="font-medium">Notifications</span>
        </button>
        
        <button className="w-full flex items-center gap-4 py-3 text-left hover:bg-slate-50 rounded-2xl px-4 transition">
          <div>🌍</div>
          <span className="font-medium">Language</span>
        </button>

        <div className="pt-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-4 py-3 text-left text-rose-500 hover:bg-rose-50 rounded-2xl px-4 transition">
            <LogOut size={22} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      <div className="h-16"></div>
    </div>
  );
}
