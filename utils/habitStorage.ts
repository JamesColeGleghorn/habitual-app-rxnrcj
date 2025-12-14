
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '@/types/habit';

const HABITS_KEY = '@habits';

export const habitStorage = {
  async getHabits(): Promise<Habit[]> {
    try {
      const habitsJson = await AsyncStorage.getItem(HABITS_KEY);
      if (habitsJson) {
        return JSON.parse(habitsJson);
      }
      return [];
    } catch (error) {
      console.error('Error loading habits:', error);
      return [];
    }
  },

  async saveHabits(habits: Habit[]): Promise<void> {
    try {
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  },

  async addHabit(habit: Habit): Promise<void> {
    try {
      const habits = await this.getHabits();
      habits.push(habit);
      await this.saveHabits(habits);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  },

  async updateHabit(habitId: string, updates: Partial<Habit>): Promise<void> {
    try {
      const habits = await this.getHabits();
      const index = habits.findIndex(h => h.id === habitId);
      if (index !== -1) {
        habits[index] = { ...habits[index], ...updates };
        await this.saveHabits(habits);
      }
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  },

  async deleteHabit(habitId: string): Promise<void> {
    try {
      const habits = await this.getHabits();
      const filtered = habits.filter(h => h.id !== habitId);
      await this.saveHabits(filtered);
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  },

  async toggleHabitCompletion(habitId: string, date: string): Promise<void> {
    try {
      const habits = await this.getHabits();
      const habit = habits.find(h => h.id === habitId);
      if (habit) {
        const dateIndex = habit.completedDates.indexOf(date);
        if (dateIndex > -1) {
          habit.completedDates.splice(dateIndex, 1);
        } else {
          habit.completedDates.push(date);
        }
        await this.saveHabits(habits);
      }
    } catch (error) {
      console.error('Error toggling habit completion:', error);
    }
  },
};
