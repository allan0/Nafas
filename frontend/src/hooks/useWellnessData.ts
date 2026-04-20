'use client';
import { useState, useEffect } from 'react';

// --- TYPES ---
export interface HistoryItem {
  id: string;
  type: 'breath' | 'run' | 'walk' | 'yoga' | 'meditation' | 'task';
  title: string;
  xp: number;
  date: string; // ISO string
  value?: string; // e.g., "5.2 km" or "15 mins"
}

export interface WellnessEvent {
  id: string;
  title: string;
  date: string;
  isPublic: boolean;
  banner?: string;
  location?: string;
  type: 'yoga' | 'meetup' | 'run';
}

export function useWellnessData() {
  const [xp, setXp] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [vitality, setVitality] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lastDate, setLastDate] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [events, setEvents] = useState<WellnessEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load everything from LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedXp = localStorage.getItem('nafas_xp');
      const savedHistory = localStorage.getItem('nafas_history');
      const savedVit = localStorage.getItem('nafas_vitality');
      const savedStreak = localStorage.getItem('nafas_streak');
      const savedLastDate = localStorage.getItem('nafas_last_date');
      const savedTasks = localStorage.getItem('nafas_tasks');
      const savedEvents = localStorage.getItem('nafas_events');

      if (savedXp) setXp(parseInt(savedXp));
      if (savedVit) setVitality(parseInt(savedVit));
      if (savedStreak) setStreak(parseInt(savedStreak));
      if (savedLastDate) setLastDate(savedLastDate);
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedEvents) setEvents(JSON.parse(savedEvents));

      // Streak Logic: Check if we need to reset or increment
      checkStreak(savedLastDate, parseInt(savedStreak || '0'));
      
      setIsLoaded(true);
    }
  }, []);

  const checkStreak = (lastDateStr: string | null, currentStreak: number) => {
    if (!lastDateStr) return;
    
    const today = new Date().toDateString();
    const last = new Date(lastDateStr).toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (today === last) return; // Already counted today

    if (yesterday.toDateString() === last) {
      // Streak continues - this is handled when they log their first activity of the day
    } else {
      // Streak broken
      setStreak(0);
      localStorage.setItem('nafas_streak', '0');
    }
  };

  const logActivity = (type: HistoryItem['type'], title: string, rewardXp: number, value?: string) => {
    const today = new Date();
    const dateStr = today.toISOString();
    
    // 1. Update XP
    const newXp = xp + rewardXp;
    setXp(newXp);
    localStorage.setItem('nafas_xp', newXp.toString());

    // 2. Update History
    const newItem: HistoryItem = { id: Math.random().toString(36).substr(2, 9), type, title, xp: rewardXp, date: dateStr, value };
    const newHistory = [newItem, ...history];
    setHistory(newHistory);
    localStorage.setItem('nafas_history', JSON.stringify(newHistory));

    // 3. Update Streak
    const lastDateObj = lastDate ? new Date(lastDate).toDateString() : null;
    if (lastDateObj !== today.toDateString()) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setLastDate(dateStr);
      localStorage.setItem('nafas_streak', newStreak.toString());
      localStorage.setItem('nafas_last_date', dateStr);
    }

    // 4. Update Vitality
    const newVit = Math.min(100, vitality + 5);
    setVitality(newVit);
    localStorage.setItem('nafas_vitality', newVit.toString());
  };

  const addEvent = (event: WellnessEvent) => {
    const newEvents = [...events, event];
    setEvents(newEvents);
    localStorage.setItem('nafas_events', JSON.stringify(newEvents));
  };

  const completeTask = (taskId: string, reward: number) => {
    if (tasks[taskId]) return;
    const newTasks = { ...tasks, [taskId]: true };
    setTasks(newTasks);
    localStorage.setItem('nafas_tasks', JSON.stringify(newTasks));
    logActivity('task', 'Social Quest Completed', reward);
  };

  return { 
    xp, 
    history, 
    vitality, 
    streak, 
    tasks, 
    events,
    isLoaded, 
    logActivity, 
    completeTask,
    addEvent
  };
}
