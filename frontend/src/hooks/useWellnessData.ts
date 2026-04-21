'use client';
import { useState, useEffect } from 'react';

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
  smokingHabit: number; 
  fruitHabit: number; 
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
    bodyType: '', weight: '', height: '', ethnicity: '', age: '', smokingHabit: 0, fruitHabit: 0, waterGoal: 8
  });
  const [dailyWater, setDailyWater] = useState(0);
  const [dailyCigs, setDailyCigs] = useState(0);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const load = (k: string) => localStorage.getItem(k);
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
      } catch (e) { console.error("Sync Error", e); }
      setIsLoaded(true);
    }
  }, []);

  const sync = (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v));

  const logActivity = (type: HistoryItem['type'], title: string, rewardXp: number, value?: string) => {
    const now = new Date();
    const newItem: HistoryItem = { id: Math.random().toString(36).substr(2, 9), type, title, xp: rewardXp, date: now.toISOString(), value };
    const newHistory = [newItem, ...history];
    const newXp = xp + rewardXp;
    setXp(newXp);
    setHistory(newHistory);
    localStorage.setItem('nafas_xp', newXp.toString());
    sync('nafas_history', newHistory);
  };

  const completeTask = (taskId: string, reward: number) => {
    if (tasks[taskId]) return;
    const newTasks = { ...tasks, [taskId]: true };
    setTasks(newTasks);
    sync('nafas_tasks', newTasks);
    logActivity('task', taskId.replace('_', ' '), reward);
  };

  const updateHealth = (data: Partial<UserHealthProfile>) => {
    const updated = { ...healthProfile, ...data };
    setHealthProfile(updated);
    sync('nafas_health', updated);
  };

  const trackHabit = (type: 'water' | 'cigs' | 'fruit', amount: number) => {
    if (type === 'water') {
      const next = dailyWater + amount;
      setDailyWater(next);
      localStorage.setItem('nafas_water', next.toString());
      if (next % 4 === 0) logActivity('habit', 'Hydration Sync', 10);
    } else if (type === 'cigs') {
      const next = Math.max(0, dailyCigs + amount);
      setDailyCigs(next);
      localStorage.setItem('nafas_cigs', next.toString());
    }
  };

  const addEvent = (e: WellnessEvent) => { const n = [e, ...events]; setEvents(n); sync('nafas_events', n); };
  const updateEvent = (id: string, d: Partial<WellnessEvent>) => { const n = events.map(e => e.id === id ? {...e, ...d} : e); setEvents(n); sync('nafas_events', n); };
  const deleteEvent = (id: string) => { const n = events.filter(e => e.id !== id); setEvents(n); sync('nafas_events', n); };

  const getActiveRoutine = () => {
    if (typeof window === 'undefined') return 'locked';
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 11) return 'morning';
    if (hr >= 20 || hr < 5) return 'evening';
    return 'locked';
  };

  return {
    xp, history, vitality, streak, tasks, events, healthProfile, dailyWater, dailyCigs, isLoaded, userCoords,
    setUserCoords, getActiveRoutine, logActivity, updateHealth, trackHabit, addEvent, updateEvent, deleteEvent, completeTask
  };
}
