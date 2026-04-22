'use client';
import { useState, useEffect, useCallback } from 'react';

// --- DEFINITIVE INTERFACES ---
export interface HistoryItem {
  id: string;
  type: 'breath' | 'run' | 'walk' | 'yoga' | 'meditation' | 'task' | 'habit';
  title: string;
  xp: number;
  date: string;
  value?: string; 
}

export interface WellnessEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  link: string; 
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
}

export interface HabitStats {
    dailyWater: number;
    dailyCigs: number;
    fruitHabit: number;
}

export function useWellnessData() {
  const [xp, setXp] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [vitality, setVitality] = useState<number>(85); // Starts at base 85%
  const [streak, setStreak] = useState<number>(0);
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [events, setEvents] = useState<WellnessEvent[]>([]);
  
  // Bio-Identity State
  const [healthProfile, setHealthProfile] = useState<UserHealthProfile>({
    bodyType: 'Mesomorph', weight: '75', height: '175', ethnicity: 'Arab', age: '30'
  });

  // Daily Habit State
  const [habits, setHabits] = useState<HabitStats>({
    dailyWater: 0, dailyCigs: 0, fruitHabit: 0
  });

  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. INITIAL LOAD
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const load = (k: string) => localStorage.getItem(k);
      try {
        if (load('nafas_xp')) setXp(parseInt(load('nafas_xp')!));
        if (load('nafas_history')) setHistory(JSON.parse(load('nafas_history')!));
        if (load('nafas_tasks')) setTasks(JSON.parse(load('nafas_tasks')!));
        if (load('nafas_events')) setEvents(JSON.parse(load('nafas_events')!));
        if (load('nafas_health')) setHealthProfile(JSON.parse(load('nafas_health')!));
        if (load('nafas_habits')) setHabits(JSON.parse(load('nafas_habits')!));
        if (load('nafas_streak')) setStreak(parseInt(load('nafas_streak')!));
      } catch (e) { console.error("Neural Sync Error", e); }
      setIsLoaded(true);
    }
  }, []);

  // 2. AUTO-SAVE ON CHANGE
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('nafas_xp', xp.toString());
    localStorage.setItem('nafas_history', JSON.stringify(history));
    localStorage.setItem('nafas_tasks', JSON.stringify(tasks));
    localStorage.setItem('nafas_events', JSON.stringify(events));
    localStorage.setItem('nafas_health', JSON.stringify(healthProfile));
    localStorage.setItem('nafas_habits', JSON.stringify(habits));
  }, [xp, history, tasks, events, healthProfile, habits, isLoaded]);

  // 3. ACTIONS
  const logActivity = useCallback((type: HistoryItem['type'], title: string, rewardXp: number, value?: string) => {
    const newItem: HistoryItem = { 
        id: Math.random().toString(36).substr(2, 9), 
        type, title, xp: rewardXp, 
        date: new Date().toISOString(), 
        value 
    };
    setHistory(prev => [newItem, ...prev]);
    setXp(prev => prev + rewardXp);
  }, []);

  const updateHealth = (data: Partial<UserHealthProfile>) => {
    setHealthProfile(prev => ({ ...prev, ...data }));
  };

  const trackHabit = (type: keyof HabitStats, amount: number) => {
    setHabits(prev => {
        const newVal = Math.max(0, prev[type] + amount);
        // Bonus XP for every 4 glasses of water
        if (type === 'dailyWater' && newVal % 4 === 0 && newVal !== 0) {
            logActivity('habit', 'Hydration Milestone', 10);
        }
        return { ...prev, [type]: newVal };
    });
  };

  const addEvent = (e: WellnessEvent) => setEvents(prev => [e, ...prev]);
  
  const completeTask = (taskId: string, reward: number) => {
    if (tasks[taskId]) return;
    setTasks(prev => ({ ...prev, [taskId]: true }));
    logActivity('task', taskId.replace('_', ' '), reward);
  };

  // 4. DATA PACKAGER FOR AI
  // This creates the exact schema the backend /recommend endpoint expects
  const getBioSummary = () => {
      return {
          profile: healthProfile,
          habits: habits,
          history: history.slice(0, 10), // Send only recent history for context
      };
  };

  const getActiveRoutine = () => {
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 11) return 'morning';
    if (hr >= 20 || hr < 5) return 'evening';
    return 'locked';
  };

  return {
    xp, history, vitality, streak, tasks, events, healthProfile, habits, isLoaded, userCoords,
    setUserCoords, getActiveRoutine, logActivity, updateHealth, trackHabit, addEvent, completeTask, getBioSummary
  };
}
