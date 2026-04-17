'use client';

import { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Gift, 
  Play, 
  Users, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';

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
}

export default function CommunityPage() {
  const [tonConnectUI] = useTonConnectUI();
  const [activeTab, setActiveTab] = useState<'live' | 'feed'>('live');

  const creators: Creator[] = [
    { 
      id: 'c1', 
      name: 'Yogi Fatima', 
      avatar: '🧘‍♀️', 
      title: 'Hatta Mountain Flow', 
      viewers: 124, 
      isLive: true, 
      content: 'Morning Vinyasa focusing on cooling breath for the Dubai heat.',
      tags: ['Yoga', 'UAE Nature']
    },
    { 
      id: 'c2', 
      name: 'Cycling Zayed', 
      avatar: '🚴‍♂️', 
      title: 'Al Qudra 50km Prep', 
      viewers: 89, 
      isLive: true, 
      content: 'Talking about hydration strategies for the Dubai Fitness Challenge.',
      tags: ['Endurance', 'Cycling']
    },
    { 
      id: 'c3', 
      name: 'Dr. Sarah', 
      avatar: '🦷', 
      title: 'Holistic Dental Tips', 
      isLive: false, 
      content: 'Why oil pulling is the secret to a brighter smile in 30 days.',
      tags: ['Wellness', 'Dental']
    }
  ];

  // --- TON TRANSACTION LOGIC ---
  const handleTip = async (creatorAddress: string, amount: number) => {
    if (!tonConnectUI.connected) {
      alert("Connect your TON wallet to tip creators!");
      return;
    }

    // This is the production-ready TON transaction payload
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 seconds
      messages: [
        {
          address: creatorAddress, // In production, this is the creator's TON address
          amount: (amount * 100000000).toString(), // Converting NAF to nanotokens (example)
          // payload: "..." // You can add a comment/memo here
        },
      ],
    };

    try {
      const result = await tonConnectUI.sendTransaction(transaction);
      alert(`Successfully tipped ${amount} $NAF! \nTx: ${result.boc.slice(0, 10)}...`);
    } catch (e) {
      console.error("Transaction failed", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Community Header */}
      <div className="bg-white p-6 pt-12 rounded-b-[3rem] shadow-sm border-b border-slate-100">
        <h1 className="text-3xl font-black text-slate-900 mb-2">SocialFi</h1>
        <p className="text-slate-500 text-sm mb-6">Support your favorite wellness creators</p>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('live')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'live' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500'}`}
          >
            Live Now
          </button>
          <button 
            onClick={() => setActiveTab('feed')}
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
                      <Play className="text-white fill-white ml-1" />
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

                  <div className="flex gap-2">
                    {[10, 50, 100].map(amt => (
                      <button 
                        key={amt}
                        onClick={() => handleTip("EQD...REPLACE_WITH_ADDRESS", amt)}
                        className="flex-1 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-700 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1 group"
                      >
                        <Gift size={14} className="group-hover:animate-bounce" /> {amt} NAF
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Feed logic placeholder */}
            <div className="bg-white/80 backdrop-blur p-8 rounded-[2rem] text-center border border-dashed border-slate-300">
                <Award size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Feed content curated by Nafas AI is arriving shortly...</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action: Go Live */}
      <div className="fixed bottom-24 right-6">
        <button className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:rotate-90 transition-all duration-500 active:scale-90 border-4 border-white">
           <Play fill="white" size={24} />
        </button>
      </div>
    </div>
  );
}
