
import { useState, useEffect, useCallback } from 'react';
import { Habit } from '@/types/habit';
import { habitStorage } from '@/utils/habitStorage';
import { getTodayDateString } from '@/utils/habitStats';
import * as Haptics from 'expo-haptics';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedHabits = await habitStorage.getHabits();
      setHabits(loadedHabits);
    } catch (err) {
      console.error('Error in loadHabits:', err);
      setError('Failed to load habits. Please try again.');
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
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        completedDates: [],
        createdAt: new Date().toISOString(),
      };
      await habitStorage.addHabit(newHabit);
      await loadHabits();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error('Error in addHabit:', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw new Error('Failed to add habit. Please try again.');
    }
  }, [loadHabits]);

  const updateHabit = useCallback(async (habitId: string, updates: Partial<Habit>) => {
    try {
      await habitStorage.updateHabit(habitId, updates);
      await loadHabits();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (err) {
      console.error('Error in updateHabit:', err);
      throw new Error('Failed to update habit. Please try again.');
    }
  }, [loadHabits]);

  const deleteHabit = useCallback(async (habitId: string) => {
    try {
      await habitStorage.deleteHabit(habitId);
      await loadHabits();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error('Error in deleteHabit:', err);
      throw new Error('Failed to delete habit. Please try again.');
    }
  }, [loadHabits]);

  const toggleHabitCompletion = useCallback(async (habitId: string, onXPEarned?: (xp: number) => void) => {
    try {
      const today = getTodayDateString();
      await habitStorage.toggleHabitCompletion(habitId, today);
      
      const habit = habits.find(h => h.id === habitId);
      const isCompleting = habit && !habit.completedDates.includes(today);
      
      if (isCompleting) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (onXPEarned) {
          const xp = 10;
          onXPEarned(xp);
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      await loadHabits();
    } catch (err) {
      console.error('Error in toggleHabitCompletion:', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw new Error('Failed to toggle habit. Please try again.');
    }
  }, [loadHabits, habits]);

  return {
    habits,
    loading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    refreshHabits: loadHabits,
  };
}
