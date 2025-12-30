
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '@/types/habit';

const HABITS_KEY = '@habits';
let saveQueue: Promise<void> = Promise.resolve();

export const habitStorage = {
  async getHabits(): Promise<Habit[]> {
    try {
      const habitsJson = await AsyncStorage.getItem(HABITS_KEY);
      if (habitsJson) {
        const habits = JSON.parse(habitsJson);
        const validHabits = habits.map((h: any) => ({
          ...h,
          completedDates: Array.isArray(h.completedDates) ? h.completedDates : [],
          createdAt: h.createdAt || new Date().toISOString(),
        }));
        console.log('Loaded habits:', validHabits.length);
        return validHabits;
      }
      console.log('No habits found, returning empty array');
      return [];
    } catch (error) {
      console.error('Error loading habits:', error);
      return [];
    }
  },

  async saveHabits(habits: Habit[]): Promise<void> {
    saveQueue = saveQueue.then(async () => {
      try {
        const validHabits = habits.map(h => ({
          ...h,
          completedDates: Array.isArray(h.completedDates) ? h.completedDates : [],
          createdAt: h.createdAt || new Date().toISOString(),
        }));
        await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(validHabits));
        console.log('Saved habits:', validHabits.length);
      } catch (error) {
        console.error('Error saving habits:', error);
        throw error;
      }
    });
    return saveQueue;
  },

  async addHabit(habit: Habit): Promise<void> {
    try {
      const habits = await this.getHabits();
      const newHabit = {
        ...habit,
        completedDates: [],
        createdAt: habit.createdAt || new Date().toISOString(),
      };
      habits.push(newHabit);
      await this.saveHabits(habits);
      console.log('Added habit:', newHabit.name);
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  },

  async updateHabit(habitId: string, updates: Partial<Habit>): Promise<void> {
    try {
      const habits = await this.getHabits();
      const index = habits.findIndex(h => h.id === habitId);
      if (index !== -1) {
        habits[index] = { 
          ...habits[index], 
          ...updates,
          completedDates: Array.isArray(updates.completedDates) 
            ? updates.completedDates 
            : habits[index].completedDates,
        };
        await this.saveHabits(habits);
        console.log('Updated habit:', habitId);
      } else {
        console.warn('Habit not found for update:', habitId);
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  },

  async deleteHabit(habitId: string): Promise<void> {
    try {
      const habits = await this.getHabits();
      const filtered = habits.filter(h => h.id !== habitId);
      await this.saveHabits(filtered);
      console.log('Deleted habit:', habitId);
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
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
          console.log('Uncompleted habit:', habit.name, 'on', date);
        } else {
          habit.completedDates.push(date);
          console.log('Completed habit:', habit.name, 'on', date);
        }
        await this.saveHabits(habits);
      } else {
        console.warn('Habit not found for toggle:', habitId);
      }
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      throw error;
    }
  },

  async clearAllHabits(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HABITS_KEY);
      console.log('Cleared all habits');
    } catch (error) {
      console.error('Error clearing habits:', error);
      throw error;
    }
  },

  async initializeDefaultHabits(): Promise<void> {
    try {
      const existingHabits = await this.getHabits();
      if (existingHabits.length === 0) {
        const now = new Date().toISOString();
        const defaultHabits: Habit[] = [
          {
            id: '1',
            name: 'Drink Water',
            icon: 'water_drop',
            color: '#4A90E2',
            completedDates: [],
            createdAt: now,
          },
          {
            id: '2',
            name: 'Exercise',
            icon: 'fitness_center',
            color: '#29ABE2',
            completedDates: [],
            createdAt: now,
          },
          {
            id: '3',
            name: 'Read',
            icon: 'menu_book',
            color: '#F2BE22',
            completedDates: [],
            createdAt: now,
          },
        ];
        await this.saveHabits(defaultHabits);
        console.log('Default habits initialized');
      }
    } catch (error) {
      console.error('Error initializing default habits:', error);
    }
  },
};
