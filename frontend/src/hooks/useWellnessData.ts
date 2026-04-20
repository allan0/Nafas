'use client';
import { useState, useEffect } from 'react';

export function useWellnessData() {
  const [xp, setXp] = useState<number>(0);
  const [tasks, setTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Only run this in the browser
    if (typeof window !== 'undefined') {
      const savedXp = localStorage.getItem('nafas_xp');
      const savedTasks = localStorage.getItem('nafas_tasks');
      if (savedXp) setXp(parseInt(savedXp));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const addXp = (amount: number) => {
    setXp((prev) => {
      const newXp = prev + amount;
      if (typeof window !== 'undefined') {
        localStorage.setItem('nafas_xp', newXp.toString());
      }
      return newXp;
    });
  };

  const completeTask = (taskId: string, reward: number) => {
    setTasks((prev) => {
      if (prev[taskId]) return prev;
      const newTasks = { ...prev, [taskId]: true };
      if (typeof window !== 'undefined') {
        localStorage.setItem('nafas_tasks', JSON.stringify(newTasks));
      }
      addXp(reward);
      return newTasks;
    });
  };

  return { xp, tasks, addXp, completeTask };
}
