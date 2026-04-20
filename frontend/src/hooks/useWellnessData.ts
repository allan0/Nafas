'use client';
import { useState, useEffect } from 'react';

export function useWellnessData() {
  const [xp, setXp] = useState<number>(0);
  const [tasks, setTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedXp = localStorage.getItem('nafas_xp');
    const savedTasks = localStorage.getItem('nafas_tasks');
    if (savedXp) setXp(parseInt(savedXp));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  const addXp = (amount: number) => {
    const newXp = xp + amount;
    setXp(newXp);
    localStorage.setItem('nafas_xp', newXp.toString());
  };

  const completeTask = (taskId: string, reward: number) => {
    if (tasks[taskId]) return; // Prevent double claiming
    const newTasks = { ...tasks, [taskId]: true };
    setTasks(newTasks);
    localStorage.setItem('nafas_tasks', JSON.stringify(newTasks));
    addXp(reward);
  };

  return { xp, tasks, addXp, completeTask };
}
