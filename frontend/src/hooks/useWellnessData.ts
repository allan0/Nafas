'use client';
import { useState, useEffect } from 'react';

export interface HistoryItem {
  id: string;
  type: 'breath' | 'run' | 'walk' | 'yoga' | 'meditation' | 'task';
  title: string;
  xp: number;
  date: string;
  value?: string; // e.g. "5.2 km" or "1000 steps"
}

export interface WellnessEvent {
  id: string;
  title: string;
  date: string;
  isPublic: boolean;
  banner?: string;
  location?: string;
  link?: string;
}

export function useWellnessData() {
  const [xp, setXp] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [vitality, setVitality] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [events, setEvents] = useState<WellnessEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedXp = localStorage.getItem('nafas_xp');
      const savedHistory = localStorage.getItem('nafas_history');
      const savedVit = localStorage.getItem('nafas_vitality');
      const savedStreak = localStorage.getItem('nafas_streak');
      const savedTasks = localStorage.getItem('nafas_tasks');
      const savedEvents = localStorage.getItem('nafas_events');
      const lastDate = localStorage.getItem('nafas_last_date');

      if (savedXp) setXp(parseInt(savedXp));
      if (savedVit) setVitality(parseInt(savedVit));
      if (savedStreak) {
        const s = parseInt(savedStreak);
        // Streak Logic: If more than 24h passed since lastDate, reset streak
        if (lastDate) {
          const hoursPassed = (new Date().getTime() - new Date(lastDate).getTime()) / 3600000;
          if (hoursPassed > 48) {
            setStreak(0);
            localStorage.setItem('nafas_streak', '0');
          } else {
            setStreak(s);
          }
        }
      }
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedEvents) setEvents(JSON.parse(savedEvents));

      setIsLoaded(true);
    }
  }, []);

  const logActivity = (type: HistoryItem['type'], title: string, rewardXp: number, value?: string) => {
    const now = new Date();
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      xp: rewardXp,
      date: now.toISOString(),
      value
    };

    const newXp = xp + rewardXp;
    const newHistory = [newItem, ...history];
    
    // Update State
    setXp(newXp);
    setHistory(newHistory);
    setVitality(v => Math.min(100, v + 2));

    // Persistence
    localStorage.setItem('nafas_xp', newXp.toString());
    localStorage.setItem('nafas_history', JSON.stringify(newHistory));
    localStorage.setItem('nafas_last_date', now.toISOString());
    
    // Update streak if it's a new day
    const lastDate = localStorage.getItem('nafas_last_date');
    if (!lastDate || new Date(lastDate).toDateString() !== now.toDateString()) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('nafas_streak', newStreak.toString());
    }
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
    logActivity('task', 'Quest Completed', reward);
  };

  return { xp, history, vitality, streak, tasks, events, isLoaded, logActivity, completeTask, addEvent };
}
