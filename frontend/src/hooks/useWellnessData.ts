'use client';
import { useState, useEffect } from 'react';

// --- TYPES ---
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
  date: string;
  isPublic: boolean;
  banner?: string;
  location: string;
  link?: string;
}

export interface UserHealthProfile {
  bodyType: string;
  weight: string;
  height: string;
  goals: string[];
  smokingHabit: number;
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
    bodyType: '', weight: '', height: '', goals: [], smokingHabit: 0, waterGoal: 2
  });
  
  const [dailyWater, setDailyWater] = useState(0);
  const [dailyCigs, setDailyCigs] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

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
      } catch (e) { console.error("Persistence Load Error", e); }
      setIsLoaded(true);
    }
  }, []);

  const save = (key: string, val: any) => {
    localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
  };

  const logActivity = (type: HistoryItem['type'], title: string, rewardXp: number, value?: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      type, title, xp: rewardXp, date: new Date().toISOString(), value
    };
    const newHistory = [newItem, ...history];
    const newXp = xp + rewardXp;
    setXp(newXp);
    setHistory(newHistory);
    setVitality(v => Math.min(100, v + 2));
    save('nafas_xp', newXp);
    save('nafas_history', newHistory);
  };

  const completeTask = (taskId: string, reward: number) => {
    if (tasks[taskId]) return;
    const newTasks = { ...tasks, [taskId]: true };
    setTasks(newTasks);
    save('nafas_tasks', newTasks);
    logActivity('task', 'Quest Completed', reward);
  };

  const updateHealth = (data: Partial<UserHealthProfile>) => {
    const newProfile = { ...healthProfile, ...data };
    setHealthProfile(newProfile);
    save('nafas_health', newProfile);
  };

  const trackHabit = (type: 'water' | 'cigs', amount: number) => {
    if (type === 'water') {
      const next = dailyWater + amount;
      setDailyWater(next);
      save('nafas_water', next);
      if (next % 4 === 0) logActivity('habit', 'Hydration Goal', 10);
    } else {
      const next = Math.max(0, dailyCigs + amount);
      setDailyCigs(next);
      save('nafas_cigs', next);
    }
  };

  const addEvent = (event: WellnessEvent) => {
    const newEvents = [event, ...events];
    setEvents(newEvents);
    save('nafas_events', newEvents);
  };

  const getActiveRoutine = () => {
    if (typeof window === 'undefined') return 'locked';
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'morning';
    if (hour >= 20 || hour < 5) return 'evening';
    return 'locked';
  };

  return {
    xp, history, vitality, streak, tasks, events,
    healthProfile, dailyWater, dailyCigs, isLoaded,
    getActiveRoutine, logActivity, updateHealth, trackHabit, addEvent, completeTask
  };
}
