'use client';
import { useState, useEffect } from 'react';

export function useWellnessData() {
  const [xp, setXp] = useState<number>(0);
  const [vitality, setVitality] = useState<number>(0);
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedXp = localStorage.getItem('nafas_xp');
      const savedVit = localStorage.getItem('nafas_vitality');
      const savedTasks = localStorage.getItem('nafas_tasks');
      
      if (savedXp) setXp(parseInt(savedXp));
      if (savedVit) setVitality(parseInt(savedVit));
      if (savedTasks) {
        try { setTasks(JSON.parse(savedTasks)); } catch (e) { setTasks({}); }
      }
      setIsLoaded(true);
    }
  }, []);

  const addXp = (amount: number) => {
    setXp((prev) => {
      const newXp = prev + amount;
      localStorage.setItem('nafas_xp', newXp.toString());
      return newXp;
    });
  };

  const updateVitality = (amount: number) => {
    setVitality((prev) => {
      const newVit = Math.min(100, prev + amount);
      localStorage.setItem('nafas_vitality', newVit.toString());
      return newVit;
    });
  };

  const completeTask = (taskId: string, reward: number) => {
    setTasks((prev) => {
      if (prev[taskId]) return prev;
      const newTasks = { ...prev, [taskId]: true };
      localStorage.setItem('nafas_tasks', JSON.stringify(newTasks));
      addXp(reward);
      return newTasks;
    });
  };

  return { xp, vitality, tasks, addXp, updateVitality, completeTask, isLoaded };
}
