
import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/types/habit';
import { habitStorage } from '@/utils/habitStorage';
import { getTodayDateString } from '@/utils/habitStats';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      const loadedHabits = await habitStorage.getHabits();
      setHabits(loadedHabits);
    } catch (error) {
      console.error('Error in loadHabits:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const addHabit = useCallback(async (habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => {
    try {
      const newHabit: Habit = {
        ...habit,
        id: Date.now().toString(),
        completedDates: [],
        createdAt: new Date().toISOString(),
      };
      await habitStorage.addHabit(newHabit);
      await loadHabits();
    } catch (error) {
      console.error('Error in addHabit:', error);
      throw error;
    }
  }, [loadHabits]);

  const updateHabit = useCallback(async (habitId: string, updates: Partial<Habit>) => {
    try {
      await habitStorage.updateHabit(habitId, updates);
      await loadHabits();
    } catch (error) {
      console.error('Error in updateHabit:', error);
      throw error;
    }
  }, [loadHabits]);

  const deleteHabit = useCallback(async (habitId: string) => {
    try {
      await habitStorage.deleteHabit(habitId);
      await loadHabits();
    } catch (error) {
      console.error('Error in deleteHabit:', error);
      throw error;
    }
  }, [loadHabits]);

  const toggleHabitCompletion = useCallback(async (habitId: string) => {
    try {
      const today = getTodayDateString();
      await habitStorage.toggleHabitCompletion(habitId, today);
      await loadHabits();
    } catch (error) {
      console.error('Error in toggleHabitCompletion:', error);
      throw error;
    }
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
