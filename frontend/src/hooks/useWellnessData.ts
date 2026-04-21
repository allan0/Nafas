'use client';
import { useState, useEffect, useCallback } from 'react';

// --- TYPE DEFINITIONS ---
export interface HistoryItem {
  id: string;
  type: 'breath' | 'run' | 'walk' | 'yoga' | 'meditation' | 'task' | 'habit';
  title: string;
  xp: number;
  date: string;
  value?: string; // e.g., "5.20 km" or "1,200 steps"
}

export interface WellnessEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  link: string; // YouTube or external link
  date: string;
  isPublic: boolean;
  banner: string;
}

export interface UserHealthProfile {
  bodyType: string;
  weight: string;
  height: string;
  ethnicity: string;
  age: string;
  smokingHabit: number; // Cigs per day baseline
  waterGoal: number;
}

export function useWellnessData() {
  const [xp, setXp] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [vitality, setVitality] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [events, setEvents] = useState<WellnessEvent[]>([]);
  const [healthProfile, setHealthProfile] = useState<UserHealthProfile>({
    bodyType: '', weight: '', height: '', ethnicity: '', age: '', smokingHabit: 0, waterGoal: 8
  });
  const [dailyWater, setDailyWater] = useState(0);
  const [dailyCigs, setDailyCigs] = useState(0);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- PERSISTENCE: LOAD ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const load = (key: string) => localStorage.getItem(key);
      try {
        if (load('nafas_xp')) setXp(parseInt(load('nafas_xp')!));
        if (load('nafas_history')) setHistory(JSON.parse(load('nafas_history')!));
        if (load('nafas_vitality')) setVitality(parseInt(load('nafas_vitality')!));
        if (load('nafas_streak')) setStreak(parseInt(load('nafas_streak')!));
        if (load('nafas_tasks')) setTasks(JSON.parse(load('nafas_tasks')!));
        if (load('nafas_events')) setEvents(JSON.parse(load('nafas_events')!));
        if (load('nafas_health')) setHealthProfile(JSON.parse(load('nafas_health')!));
        if (load('nafas_water')) setDailyWater(parseInt(load('nafas_water')!));
        if (load('nafas_cigs')) setDailyCigs(parseInt(load('nafas_cigs')!));
        
        // Streak Validation: Check if day was missed
        const lastDate = load('nafas_last_date');
        if (lastDate) {
          const hoursSinceLast = (new Date().getTime() - new Date(lastDate).getTime()) / 3600000;
          if (hoursSinceLast > 48) {
            setStreak(0);
            localStorage.setItem('nafas_streak', '0');
          }
        }
      } catch (e) {
        console.error("Protocol Data Corruption - Resetting State", e);
      }
      setIsLoaded(true);
    }
  }, []);

  // --- PERSISTENCE: SAVE HELPER ---
  const sync = (key: string, data: any) => {
    localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
  };

  // --- CORE ACTIONS ---
  const logActivity = (type: HistoryItem['type'], title: string, rewardXp: number, value?: string) => {
    const now = new Date();
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      type, title, xp: rewardXp, date: now.toISOString(), value
    };

    setHistory(prev => {
      const updated = [newItem, ...prev];
      sync('nafas_history', updated);
      return updated;
    });

    setXp(prev => {
      const updated = prev + rewardXp;
      sync('nafas_xp', updated);
      return updated;
    });

    setVitality(v => {
      const next = Math.min(100, v + 2);
      sync('nafas_vitality', next);
      return next;
    });

    // Update Streak logic
    const lastDate = localStorage.getItem('nafas_last_date');
    if (!lastDate || new Date(lastDate).toDateString() !== now.toDateString()) {
      setStreak(s => {
        const next = s + 1;
        sync('nafas_streak', next);
        return next;
      });
    }
    sync('nafas_last_date', now.toISOString());
  };

  const completeTask = (taskId: string, reward: number) => {
    setTasks(prev => {
      const updated = { ...prev, [taskId]: true };
      sync('nafas_tasks', updated);
      return updated;
    });
    logActivity('task', `Quest: ${taskId.split('_')[0]}`, reward);
  };

  const updateHealth = (data: Partial<UserHealthProfile>) => {
    setHealthProfile(prev => {
      const updated = { ...prev, ...data };
      sync('nafas_health', updated);
      return updated;
    });
  };

  const trackHabit = (type: 'water' | 'cigs', amount: number) => {
    if (type === 'water') {
      setDailyWater(prev => {
        const next = prev + amount;
        sync('nafas_water', next);
        if (next % 4 === 0) logActivity('habit', 'Hydration Goal', 10);
        return next;
      });
    } else {
      setDailyCigs(prev => {
        const next = Math.max(0, prev + amount);
        sync('nafas_cigs', next);
        return next;
      });
    }
  };

  const addEvent = (event: WellnessEvent) => {
    setEvents(prev => {
      const updated = [event, ...prev];
      sync('nafas_events', updated);
      return updated;
    });
  };

  const updateEvent = (id: string, data: Partial<WellnessEvent>) => {
    setEvents(prev => {
      const updated = prev.map(ev => ev.id === id ? { ...ev, ...data } : ev);
      sync('nafas_events', updated);
      return updated;
    });
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => {
      const updated = prev.filter(ev => ev.id !== id);
      sync('nafas_events', updated);
      return updated;
    });
  };

  const getActiveRoutine = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'morning';
    if (hour >= 20 || hour < 5) return 'evening';
    return 'locked';
  };

  return {
    xp, history, vitality, streak, tasks, events,
    healthProfile, dailyWater, dailyCigs, isLoaded, userCoords,
    setUserCoords, getActiveRoutine, logActivity, updateHealth, 
    trackHabit, addEvent, updateEvent, deleteEvent, completeTask
  };
}
