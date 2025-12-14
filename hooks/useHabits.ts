
import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/types/habit';
import { habitStorage } from '@/utils/habitStorage';
import { getTodayDateString } from '@/utils/habitStats';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHabits = useCallback(async () => {
    setLoading(true);
    const loadedHabits = await habitStorage.getHabits();
    setHabits(loadedHabits);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const addHabit = useCallback(async (habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    await habitStorage.addHabit(newHabit);
    await loadHabits();
  }, [loadHabits]);

  const updateHabit = useCallback(async (habitId: string, updates: Partial<Habit>) => {
    await habitStorage.updateHabit(habitId, updates);
    await loadHabits();
  }, [loadHabits]);

  const deleteHabit = useCallback(async (habitId: string) => {
    await habitStorage.deleteHabit(habitId);
    await loadHabits();
  }, [loadHabits]);

  const toggleHabitCompletion = useCallback(async (habitId: string) => {
    const today = getTodayDateString();
    await habitStorage.toggleHabitCompletion(habitId, today);
    await loadHabits();
  }, [loadHabits]);

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    refreshHabits: loadHabits,
  };
}
