'use client';

import { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Gift, 
  Play, 
  Users, 
  ChevronRight,
  Award
} from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';

// --- TYPES ---
interface Creator {
  id: string;
  name: string;
  avatar: string;
  title: string;
  viewers?: number;
  isLive: boolean;
  content: string;
  tags: string[];
  tonAddress: string; // Real TON address for tipping
}

export default function CommunityPage() {
  const [tonConnectUI] = useTonConnectUI();
  const [activeTab, setActiveTab] = useState<'live' | 'feed'>('live');
  const [haptic, setHaptic] = useState<any>(null);
  const [tipping, setTipping] = useState<string | null>(null);

  // Initialize Telegram + Haptics
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = TelegramWebApp;
      tg.ready();
      tg.expand();
      setHaptic(tg.HapticFeedback);
    }
  }, []);

  const creators: Creator[] = [
    { 
      id: 'c1', 
      name: 'Yogi Fatima', 
      avatar: '🧘‍♀️', 
      title: 'Hatta Mountain Flow', 
      viewers: 124, 
      isLive: true, 
      content: 'Morning Vinyasa focusing on cooling breath for the Dubai heat.',
      tags: ['Yoga', 'UAE Nature'],
      tonAddress: "EQD...REPLACE_WITH_REAL_CREATOR_ADDRESS_1" // TODO: Replace with real TON addresses
    },
    { 
      id: 'c2', 
      name: 'Cycling Zayed', 
      avatar: '🚴‍♂️', 
      title: 'Al Qudra 50km Prep', 
      viewers: 89, 
      isLive: true, 
      content: 'Talking about hydration strategies for the Dubai Fitness Challenge.',
      tags: ['Endurance', 'Cycling'],
      tonAddress: "EQD...REPLACE_WITH_REAL_CREATOR_ADDRESS_2"
    },
    { 
      id: 'c3', 
      name: 'Dr. Sarah', 
      avatar: '🦷', 
      title: 'Holistic Dental Tips', 
      isLive: false, 
      content: 'Why oil pulling is the secret to a brighter smile in 30 days.',
      tags: ['Wellness', 'Dental'],
      tonAddress: "EQD...REPLACE_WITH_REAL_CREATOR_ADDRESS_3"
    }
  ];

  // Handle real TON tipping
  const handleTip = async (creator: Creator, amount: number) => {
    if (!tonConnectUI.connected) {
      haptic?.notificationOccurred('error');
      alert("Please connect your TON wallet to send tips!");
      return;
    }

    if (!creator.tonAddress || creator.tonAddress.includes("REPLACE")) {
      haptic?.notificationOccurred('error');
      alert("Creator TON address not configured yet. Coming soon!");
      return;
    }

    setTipping(creator.id);
    haptic?.impactOccurred('medium');

    // TON Transaction payload (real $NAF tipping)
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60,
      messages: [
        {
          address: creator.tonAddress,
          amount: (amount * 1000000000).toString(), // nanotons (adjust for $NAF decimals)
          payload: "" // Optional memo can be added here later
        },
      ],
    };

    try {
      const result = await tonConnectUI.sendTransaction(transaction);
      
      haptic?.notificationOccurred('success');
      
      alert(`🎉 Successfully tipped ${amount} $NAF to ${creator.name}!\n\nTx: ${result.boc.slice(0, 12)}...`);

      console.log(`Tipped ${amount} $NAF to ${creator.name}`, result);

    } catch (e: any) {
      console.error("Transaction failed", e);
      haptic?.notificationOccurred('error');
      alert("Transaction cancelled or failed. Please try again.");
    } finally {
      setTipping(null);
    }
  };

  const handleTabChange = (tab: 'live' | 'feed') => {
    setActiveTab(tab);
    haptic?.selectionChanged();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Community Header */}
      <div className="bg-white p-6 pt-12 rounded-b-[3rem] shadow-sm border-b border-slate-100">
        <h1 className="text-3xl font-black text-slate-900 mb-2">SocialFi</h1>
        <p className="text-slate-500 text-sm mb-6">Support your favorite UAE wellness creators</p>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => handleTabChange('live')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'live' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500'}`}
          >
            Live Now
          </button>
          <button 
            onClick={() => handleTabChange('feed')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'feed' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500'}`}
          >
            Feed
          </button>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        {activeTab === 'live' ? (
          <div className="space-y-6">
            {creators.filter(c => c.isLive).map((creator) => (
              <div key={creator.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
                {/* Video Placeholder */}
                <div className="h-56 bg-gradient-to-br from-slate-900 to-slate-800 relative group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition">
                      <Play className="text-white fill-white ml-1" size={32} />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                    </span>
                    <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Users size={12} /> {creator.viewers}
                    </span>
                  </div>
                </div>

                {/* Creator Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                        {creator.avatar}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800">{creator.name}</h3>
                        <p className="text-xs text-slate-500">{creator.title}</p>
                      </div>
                    </div>
                    <button className="bg-slate-100 p-2 rounded-xl text-slate-400 hover:text-rose-500 transition">
                      <Heart size={20} />
                    </button>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {creator.content}
                  </p>

                  {/* Tip Buttons - Real TON */}
                  <div className="flex gap-2">
                    {[10, 50, 100].map((amt) => (
                      <button 
                        key={amt}
                        disabled={tipping === creator.id}
                        onClick={() => handleTip(creator, amt)}
                        className="flex-1 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-700 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1 group disabled:opacity-70"
                      >
                        <Gift size={14} className="group-hover:animate-bounce" /> 
                        {amt} NAF
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur p-8 rounded-[2rem] text-center border border-dashed border-slate-300">
                <Award size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Community feed curated by Nafas AI is arriving shortly...</p>
                <p className="text-xs text-slate-400 mt-2">Support creators • Earn rewards • Build tribe</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action: Go Live */}
      <div className="fixed bottom-24 right-6">
        <button 
          onClick={() => {
            haptic?.notificationOccurred('success');
            alert("🎥 Go Live feature coming soon! Host your own wellness session and earn $NAF.");
          }}
          className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:rotate-12 transition-all duration-500 active:scale-90 border-4 border-white"
        >
           <Play fill="white" size={24} />
        </button>
      </div>
    </div>
  );
}
