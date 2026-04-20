'use client';

import dynamic from 'next/dynamic';

/**
 * Premium Loading State
 * A minimalist, "Zen" placeholder that appears while 
 * the high-fidelity dashboard is initializing.
 */
const ZenLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#A5D8F8]">
    <div className="relative">
      {/* Soft pulse animation for the loader */}
      <div className="w-24 h-24 bg-white/30 rounded-full animate-ping absolute inset-0" />
      <div className="w-24 h-24 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center relative">
        <span className="text-2xl animate-pulse">🌬️</span>
      </div>
    </div>
    <p className="mt-8 text-xs tracking-[0.5em] text-slate-500 uppercase font-medium">
      Breathe In
    </p>
  </div>
);

/**
 * Dynamic Import of the Dashboard
 * 'ssr: false' ensures this component NEVER runs on the server, 
 * preventing crashes during Vercel builds.
 */
 
const EarnContent = dynamic(() => import('@/components/EarnContent'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-emerald-600 font-bold uppercase tracking-widest">Loading Earn Vault...</div>
    </div>
  )
});

export default function EarnPage() {
  return <EarnContent />;
}
const MainDashboard = dynamic(() => import('@/components/MainDashboard'), { 
  ssr: false,
  loading: () => <ZenLoader />
});

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <MainDashboard />
    </main>
  );
}
