'use client';
import dynamic from 'next/dynamic';

const TribeContent = dynamic(() => import('@/components/TribeContent'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcf6f9]">
      <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center animate-pulse">
        <span className="text-2xl">🌍</span>
      </div>
      <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Connecting Hubs</p>
    </div>
  )
});

export default function CommunityPage() {
  return <TribeContent />;
}
