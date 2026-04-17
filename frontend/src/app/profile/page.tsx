'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Wallet, 
  Flame, 
  Award, 
  History, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';

// --- TYPES ---
interface Transaction {
  id: string;
  type: 'Reward' | 'Tip' | 'Burn';
  amount: string;
  date: string;
  status: 'Confirmed' | 'Pending';
}

export default function ProfilePage() {
  const userFriendlyAddress = useTonAddress();
  const [username, setUsername] = useState("Wellness Seeker");
  const [streak] = useState(14); // Mock data
  const [totalNaf] = useState("2,450.50");

  const [transactions] = useState<Transaction[]>([
    { id: 'tx1', type: 'Reward', amount: '+45.00', date: '2 hours ago', status: 'Confirmed' },
    { id: 'tx2', type: 'Tip', amount: '-10.00', date: 'Yesterday', status: 'Confirmed' },
    { id: 'tx3', type: 'Reward', amount: '+120.00', date: '3 days ago', status: 'Confirmed' },
  ]);

  useEffect(() => {
    const tg = TelegramWebApp;
    if (tg.initDataUnsafe?.user) {
      setUsername(tg.initDataUnsafe.user.first_name || "Wellness Seeker");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/30 pb-32">
      {/* Profile Header */}
      <div className="bg-white px-6 pt-16 pb-12 rounded-b-[3.5rem] shadow-sm border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-[2rem] p-1 shadow-xl mb-4 rotate-3">
             <div className="w-full h-full bg-white rounded-[1.8rem] flex items-center justify-center text-4xl">
               🌿
             </div>
          </div>
          
          <h1 className="text-3xl font-black text-slate-900">{username}</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Nafas Level 4 • Zen Master</p>
          
          <div className="mt-6">
            <TonConnectButton />
          </div>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto -mt-8 relative z-20">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <Flame size={18} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest">Streak</span>
            </div>
            <div className="text-2xl font-black text-slate-800">{streak} Days</div>
            <div className="text-[10px] text-slate-400 mt-1 font-bold">Top 5% in UAE</div>
          </div>
          
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Award size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Badges</span>
            </div>
            <div className="text-2xl font-black text-slate-800">12 Earned</div>
            <div className="text-[10px] text-slate-400 mt-1 font-bold">Next: Al Qudra Hero</div>
          </div>
        </div>

        {/* Wallet Management Section */}
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Wallet Management</h2>
        <div className="bg-slate-900 rounded-[2.5rem] p-7 mb-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent opacity-50 group-hover:opacity-100 transition duration-700" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                <Wallet size={24} className="text-emerald-400" />
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available Balance</div>
                <div className="text-3xl font-black">{totalNaf} <span className="text-emerald-400 text-lg">NAF</span></div>
              </div>
            </div>

            {userFriendlyAddress ? (
              <div className="flex items-center justify-between bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400">TON ADDRESS</span>
                  <span className="text-xs font-mono text-emerald-100">{userFriendlyAddress.slice(0, 6)}...{userFriendlyAddress.slice(-6)}</span>
                </div>
                <ExternalLink size={16} className="text-slate-500" />
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic text-center p-4 bg-white/5 rounded-2xl border border-dashed border-white/20">
                Connect wallet to synchronize on-chain assets
              </div>
            )}
            
            <button className="w-full mt-6 bg-white text-slate-900 py-4 rounded-2xl font-black text-sm hover:bg-emerald-50 transition active:scale-95">
              Withdraw to Exchange
            </button>
          </div>
        </div>

        {/* History Section */}
        <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Recent Activity</h2>
            <button className="text-xs font-bold text-emerald-600 flex items-center">
              View All <ChevronRight size={14} />
            </button>
        </div>
        
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white p-5 rounded-3xl flex items-center justify-between border border-slate-100 hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${
                  tx.type === 'Reward' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'
                }`}>
                  {tx.type === 'Reward' ? <TrendingUp size={20} /> : <History size={20} />}
                </div>
                <div>
                  <div className="font-black text-slate-800 text-sm">{tx.type}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{tx.date}</div>
                </div>
              </div>
              <div className={`font-black ${tx.type === 'Reward' ? 'text-emerald-600' : 'text-slate-800'}`}>
                {tx.amount}
              </div>
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div className="mt-12 pt-8 border-t border-slate-200">
           <button className="w-full flex items-center justify-between p-6 bg-rose-50 rounded-3xl text-rose-600 font-black text-sm active:scale-95 transition">
             Log Out from Mini App
             <LogOut size={20} />
           </button>
           <p className="text-center text-[10px] text-slate-400 mt-6 font-medium">
             Nafas Protocol v1.0.0-beta • Securely hosted on TON Blockchain
           </p>
        </div>
      </div>
    </div>
  );
}
