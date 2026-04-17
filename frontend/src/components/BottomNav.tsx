'use client';

import { Home, Leaf, Users, Sparkles, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Activities', icon: Leaf, path: '/activities' },
  { name: 'Community', icon: Users, path: '/community' },
  { name: 'AI', icon: Sparkles, path: '/ai' },
  { name: 'Profile', icon: User, path: '/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState('/');

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 wave-nav py-3 px-6">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-white/70 hover:text-white'}`}
            >
              <div className={`p-2 rounded-full ${isActive ? 'bg-white/20' : ''}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] mt-1 font-medium tracking-wide">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
