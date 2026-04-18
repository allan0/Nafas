'use client';
import { useEffect, useState } from 'react';
import { Award, Flame, Calendar, Wallet as WalletIcon, Settings, LogOut } from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';

export default function ProfileContent() {
  const [username, setUsername] = useState("Allan");
  const [haptic, setHaptic] = useState<any>(null);

  // Initialize Telegram + Haptics + User Data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = TelegramWebApp;
      tg.ready();
      tg.expand();

      setHaptic(tg.HapticFeedback);

      // Pull real Telegram user name
      if (tg.initDataUnsafe?.user) {
        setUsername(tg.initDataUnsafe.user.first_name || "Wellness Seeker");
      }
    }
  }, []);

  const triggerHaptic = (type: 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy') => {
    if (haptic) {
      if (['success', 'error', 'warning'].includes(type)) {
        haptic.notificationOccurred(type);
      } else {
        haptic.impactOccurred(type);
      }
    }
  };

  // Sample stats (will be dynamic from backend/DB in future step)
  const stats = {
    nafEarned: 1245,
    activitiesCompleted: 47,
    currentStreak: 12,
  };

  return (
    <div className="p-6 max-w-md mx-auto pb-28 min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-10">
        <div 
          onClick={() => triggerHaptic('light')}
          className="w-28 h-28 bg-gradient-to-br from-[#7CC6E8] to-[#A8E6B8] rounded-full flex items-center justify-center shadow-xl mb-4 relative text-6xl cursor-pointer active:scale-95 transition-transform"
        >
          🌿
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">{username}</h1>
        <p className="text-sm text-slate-500 mt-1">UAE Wellness Advocate</p>
        
        {/* TON Wallet Connect */}
        <div className="mt-6 w-full max-w-[240px]">
          <TonConnectButton />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div 
          onClick={() => triggerHaptic('medium')}
          className="bg-white/90 rounded-3xl p-5 text-center shadow-sm active:scale-[0.97] transition-all cursor-pointer"
        >
          <Award className="mx-auto text-emerald-500 mb-3" size={32} />
          <div className="text-2xl font-bold text-slate-900">{stats.nafEarned}</div>
          <div className="text-[10px] text-slate-500 tracking-widest">NAF EARNED</div>
        </div>

        <div 
          onClick={() => triggerHaptic('medium')}
          className="bg-white/90 rounded-3xl p-5 text-center shadow-sm active:scale-[0.97] transition-all cursor-pointer"
        >
          <Calendar className="mx-auto text-blue-500 mb-3" size={32} />
          <div className="text-2xl font-bold text-slate-900">{stats.activitiesCompleted}</div>
          <div className="text-[10px] text-slate-500 tracking-widest">ACTIVITIES</div>
        </div>

        <div 
          onClick={() => triggerHaptic('medium')}
          className="bg-white/90 rounded-3xl p-5 text-center shadow-sm active:scale-[0.97] transition-all cursor-pointer"
        >
          <Flame className="mx-auto text-orange-500 mb-3" size={32} />
          <div className="text-2xl font-bold text-slate-900">{stats.currentStreak}</div>
          <div className="text-[10px] text-slate-500 tracking-widest">DAY STREAK</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <button 
          onClick={() => {
            triggerHaptic('light');
            alert("Settings panel coming soon – customize your Nafas experience here.");
          }}
          className="w-full bg-white flex items-center gap-4 p-5 rounded-3xl shadow-sm active:bg-slate-50 transition"
        >
          <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center">
            <Settings size={22} className="text-slate-600" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold">App Settings</div>
            <div className="text-xs text-slate-500">Notifications, preferences, goals</div>
          </div>
          <ChevronRight size={20} className="text-slate-400" />
        </button>

        <button 
          onClick={() => {
            triggerHaptic('heavy');
            if (confirm("Disconnect wallet and logout?")) {
              alert("Wallet disconnected. See you soon! 🌬️");
            }
          }}
          className="w-full bg-white flex items-center gap-4 p-5 rounded-3xl shadow-sm active:bg-slate-50 transition text-rose-600"
        >
          <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center">
            <LogOut size={22} />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold">Logout</div>
            <div className="text-xs text-slate-500">Disconnect TON wallet</div>
          </div>
          <ChevronRight size={20} className="text-rose-400" />
        </button>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-12">
        <p className="text-[10px] text-slate-400">
          Nafas • Built for the UAE • Breathe Better, Live Stronger
        </p>
      </div>
    </div>
  );
}
