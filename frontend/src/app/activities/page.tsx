'use client';
import dynamic from 'next/dynamic';

const EarnContent = dynamic(() => import('@/components/EarnContent'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf6f9]">
      <div className="animate-pulse text-emerald-600 font-black uppercase tracking-widest text-xs">
        Opening Vault...
      </div>
    </div>
  )
});

export default function EarnPage() {
  return <EarnContent />;
}
