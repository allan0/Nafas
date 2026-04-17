
'use client';

import dynamic from 'next/dynamic';

// This is the magic fix for "window is not defined"
const MainDashboard = dynamic(() => import('@/components/MainDashboard'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-emerald-600 font-medium">Breathe in...</div>
    </div>
  )
});

export default function Home() {
  return <MainDashboard />;
}

