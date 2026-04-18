'use client';
import { Award, Flame, Calendar, Wallet as WalletIcon, Settings, LogOut } from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';

export default function ProfileContent() {
  return (
    <div className="p-6 max-w-md mx-auto pb-28">
      <div className="flex flex-col items-center mb-10">
        <div className="w-28 h-28 bg-gradient-to-br from-[#7CC6E8] to-[#A8E6B8] rounded-full flex items-center justify-center shadow-xl mb-4 relative text-6xl">🌿</div>
        <h1 className="text-3xl font-semibold">Allan</h1>
        <div className="mt-6"><TonConnectButton /></div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white/90 rounded-3xl p-5 text-center shadow-sm">
          <Award className="mx-auto text-emerald-500 mb-3" size={32} />
          <div className="text-2xl font-bold">1245</div>
          <div className="text-[10px] text-slate-500">NAF EARNED</div>
        </div>
        <div className="bg-white/90 rounded-3xl p-5 text-center shadow-sm">
          <Calendar className="mx-auto text-blue-500 mb-3" size={32} />
          <div className="text-2xl font-bold">47</div>
          <div className="text-[10px] text-slate-500">ACTIVITIES</div>
        </div>
        <div className="bg-white/90 rounded-3xl p-5 text-center shadow-sm">
          <Flame className="mx-auto text-orange-500 mb-3" size={32} />
          <div className="text-2xl font-bold">12</div>
          <div className="text-[10px] text-slate-500">STREAK</div>
        </div>
      </div>
    </div>
  );
}
