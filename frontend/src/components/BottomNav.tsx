'use client';

import { Home, Leaf, Users, Sparkles, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TelegramWebApp from '@twa-dev/sdk';

const navItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Flow', icon: Leaf, path: '/activities' },
  { name: 'Tribe', icon: Users, path: '/community' },
  { name: 'Coach', icon: Sparkles, path: '/ai' },
  { name: 'Self', icon: User, path: '/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [haptic, setHaptic] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHaptic(TelegramWebApp.HapticFeedback);
    }
  }, []);

  const navigateTo = (path: string) => {
    if (pathname === path) return;
    
    // Premium Haptic: "Selection Changed" light vibration
    haptic?.selectionChanged();
    router.push(path);
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 px-6">
      <div className="max-w-md mx-auto glass-card rounded-[2.5rem] p-2 flex justify-around items-center border-white/40 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigateTo(item.path)}
              className={`relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-500 rounded-3xl ${
                isActive ? 'text-slate-900 scale-110' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {/* Active Glow Indicator */}
              {isActive && (
                <div className="absolute inset-0 bg-white/60 rounded-3xl blur-md -z-10 animate-pulse" />
              )}
              
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 1.5} 
                className="transition-transform duration-300"
              />
              
              <span className={`text-[8px] font-bold uppercase tracking-widest mt-1 transition-opacity duration-300 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
