'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const ProfileContent = dynamic(() => import('@/components/ProfileContent'), { ssr: false });
const SettingsContent = dynamic(() => import('@/components/SettingsContent'), { ssr: false });

export default function ProfilePage() {
  const [view, setView] = useState<'profile' | 'settings'>('profile');

  return (
    <main className="min-h-screen">
      {view === 'profile' ? (
        // We pass a prop to ProfileContent to trigger settings (need to update ProfileContent next)
        <ProfileContent onOpenSettings={() => setView('settings')} />
      ) : (
        <SettingsContent onBack={() => setView('profile')} />
      )}
    </main>
  );
}
