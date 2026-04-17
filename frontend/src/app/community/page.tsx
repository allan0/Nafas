'use client';

import { useState } from 'react';
import { Users, Gift, Play } from 'lucide-react';

const liveStreams = [
  { id: 1, creator: "Lena Yoga", title: "Morning Flow Yoga", viewers: 42, reward: 50 },
  { id: 2, creator: "Alex Breathwork", title: "4-7-8 Breathing", viewers: 19, reward: 30 },
];

const feedPosts = [
  { id: 1, creator: "MindfulMia", tip: "Start your day with 3 deep breaths 💨", time: "2h ago" },
  { id: 2, creator: "WellnessWave", tip: "Herbal tea ritual for calm evenings 🌿", time: "5h ago" },
];

export default function Community() {
  const [selectedAmount, setSelectedAmount] = useState(50);

  const handleTip = (creator: string, amount: number) => {
    // In real implementation this will call tipCreator on the NafasToken contract via TON
    alert(`💸 Tipped ${amount} NAF to ${creator}!\n\nTransaction sent on TON blockchain.`);
  };

  return (
    <div className="p-6 max-w-md mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-1">Community & Live</h1>
        <p className="text-slate-600">Connect, watch, and support creators</p>
      </div>

      {/* Live Streams Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-xl flex items-center gap-2">
            <Play className="text-red-500" /> Live Now
          </h2>
          <span className="text-sm text-emerald-600">2 live</span>
        </div>

        <div className="space-y-4">
          {liveStreams.map((stream) => (
            <div key={stream.id} className="bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm">
              <div className="h-40 bg-gradient-to-br from-[#7CC6E8] to-[#4ECDC4] relative flex items-center justify-center">
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                  ● LIVE
                </div>
                <div className="text-white text-center">
                  <div className="text-2xl font-semibold">{stream.title}</div>
                  <div className="text-sm opacity-90">with {stream.creator}</div>
                </div>
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">{stream.viewers} watching</div>
                </div>
                <button 
                  onClick={() => handleTip(stream.creator, stream.reward)}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-medium transition"
                >
                  <Gift size={18} />
                  Tip {stream.reward} NAF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feed / Tips Section */}
      <div>
        <h2 className="font-semibold text-xl mb-4">Community Feed</h2>
        <div className="space-y-4">
          {feedPosts.map((post) => (
            <div key={post.id} className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#A5D8F8] to-[#7CC6E8] rounded-full"></div>
                <div>
                  <div className="font-medium">{post.creator}</div>
                  <div className="text-xs text-slate-500">{post.time}</div>
                </div>
              </div>

              <div className="text-slate-700 mb-5 leading-relaxed">
                “{post.tip}”
              </div>

              <div className="flex gap-3">
                {[30, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleTip(post.creator, amt)}
                    className="flex-1 bg-white border border-slate-200 hover:border-emerald-400 hover:text-emerald-600 transition py-3 rounded-2xl text-sm font-medium"
                  >
                    Tip {amt} NAF
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-slate-500">
        All tips are sent instantly using the NafasToken contract on TON
      </div>
    </div>
  );
}
