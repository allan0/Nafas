'use client';

import dynamic from 'next/dynamic';

/**
 * Clean Dynamic Entry Point
 * Prevents SSR errors and handles the high-fidelity UI loading.
 */
const MainDashboard = dynamic(() => import('@/components/MainDashboard'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#A5D8F8]">
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 bg-white/30 rounded-full animate-ping absolute" />
        <div className="w-20 h-20 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center relative">
          <span className="text-3xl animate-bounce">🌬️</span>
        </div>
      </div>
      <p className="mt-10 text-[10px] tracking-[0.6em] text-slate-500 uppercase font-black animate-pulse">
        Breathe In
      </p>
    </div>
  )
});

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <MainDashboard />
    </main>
  );
}
