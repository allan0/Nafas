'use client';

import { useEffect, useState } from 'react';
import { 
  Award, 
  Flame, 
  MapPin, 
  Sparkles, 
  TrendingUp, 
  Zap,
  RefreshCw
} from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import TelegramWebApp from '@twa-dev/sdk';

// --- TYPES ---
interface Recommendation {
  category: string;
  title: string;
  action_plan: string;
  uae_location_tip: string;
  token_reward_estimate: number;
  environmental_advice: string;
}

export default function MainDashboard() {
  const [username, setUsername] = useState("Wellness Seeker");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [wellnessScore] = useState(87);
  const [locationName, setLocationName] = useState("Dubai, UAE");

  useEffect(() => {
    // 1. Initialize Telegram Web App
    const tg = TelegramWebApp;
    try {
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) {
        setUsername(tg.initDataUnsafe.user.first_name || "Wellness Seeker");
      }

      // 2. Request Location for UAE-specific context
      if (tg.LocationManager) {
        tg.LocationManager.init(() => {
          tg.LocationManager.getLocation((data) => {
            if (data) {
                // In a real app, you'd reverse-geocode this
                console.log("Lat:", data.latitude, "Lng:", data.longitude);
                setLocationName("Near Jumeirah"); 
            }
          });
        });
      }
    } catch (e) {
      console.log("Running in standard browser mode");
    }
  }, []);

  // --- API CALL TO BACKEND ---
  const fetchDailyPlan = async (goal: string) => {
    setLoading(true);
    try {
      const response = await fetch('https://your-backend-url.vercel.app/api/v1/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: goal,
          location: locationName,
          experience_level: "intermediate"
        }),
      });
      const data = await response.json();
      setRecommendation(data);
    } catch (error) {
      console.error("Failed to fetch plan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto relative z-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Marhaba, {username} 🌿
          </h1>
          <div className="flex items-center gap-1 text-slate-600 text-sm mt-1">
            <MapPin size={14} className="text-emerald-500" />
            {locationName}
          </div>
        </div>
        <TonConnectButton />
      </div>

      {/* Wellness Score Gauge */}
      <div className="relative mb-8 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex justify-between items-start">
            <div className="text-left">
              <div className="text-5xl font-black text-slate-800">{wellnessScore}</div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 mt-1">
                Wellness Index
              </div>
            </div>
            <div className="bg-emerald-100 p-3 rounded-2xl">
              <TrendingUp className="text-emerald-600" />
            </div>
          </div>
          <div className="mt-6 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 w-[87%] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* AI Action Grid */}
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 px-1">
        AI Consultations
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { id: 'yoga', label: 'Yoga Flow', icon: '🧘‍♀️', color: 'bg-orange-500' },
          { id: 'run', label: 'Endurance', icon: '🏃‍♂️', color: 'bg-blue-500' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => fetchDailyPlan(btn.id)}
            className="bg-white/80 backdrop-blur-lg border border-white/40 p-5 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-all shadow-sm"
          >
            <span className="text-3xl">{btn.icon}</span>
            <span className="font-semibold text-slate-700">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Recommendation Card */}
      {loading ? (
        <div className="bg-white/50 backdrop-blur rounded-3xl p-12 text-center flex flex-col items-center animate-pulse">
          <RefreshCw className="animate-spin text-emerald-500 mb-4" size={32} />
          <p className="text-slate-600 font-medium">Analyzing UAE Environment...</p>
        </div>
      ) : recommendation && (
        <div className="bg-emerald-900 text-white rounded-3xl p-6 mb-8 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={80} />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-emerald-500/30 p-2 rounded-xl">
              <Sparkles size={18} className="text-emerald-300" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              Personalized for you
            </span>
          </div>

          <h3 className="text-xl font-bold mb-2">{recommendation.title}</h3>
          <p className="text-emerald-50/80 text-sm leading-relaxed mb-6">
            {recommendation.action_plan}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/10 backdrop-blur p-3 rounded-2xl">
              <div className="text-[10px] uppercase font-bold text-emerald-300 mb-1">Spot</div>
              <div className="text-xs font-medium truncate">{recommendation.uae_location_tip}</div>
            </div>
            <div className="bg-white/10 backdrop-blur p-3 rounded-2xl">
              <div className="text-[10px] uppercase font-bold text-emerald-300 mb-1">Reward</div>
              <div className="text-xs font-medium">+{recommendation.token_reward_estimate} NAF</div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-start gap-3">
             <Zap size={16} className="text-yellow-400 mt-0.5" />
             <p className="text-[11px] text-emerald-100/70 italic">
               {recommendation.environmental_advice}
             </p>
          </div>
        </div>
      )}

      {/* Social Proof Mini Section */}
      <div className="flex items-center gap-4 px-2">
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#A5D8F8] bg-slate-200" />
          ))}
        </div>
        <p className="text-xs text-slate-700 font-medium">
          <span className="font-bold">1,200+</span> others are breathing with you today
        </p>
      </div>
    </div>
  );
}
