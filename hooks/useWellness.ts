
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyWellness, StepData, WaterIntake, SleepLog, MoodEntry, FocusSession, GratitudeEntry } from '@/types/wellness';
import * as Haptics from 'expo-haptics';

const WELLNESS_STORAGE_KEY = '@wellness_data';

export function useWellness() {
  const [wellnessData, setWellnessData] = useState<DailyWellness[]>([]);
  const [loading, setLoading] = useState(true);

  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const loadWellnessData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(WELLNESS_STORAGE_KEY);
      if (data) {
        setWellnessData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading wellness data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveWellnessData = useCallback(async (data: DailyWellness[]) => {
    try {
      await AsyncStorage.setItem(WELLNESS_STORAGE_KEY, JSON.stringify(data));
      setWellnessData(data);
    } catch (error) {
      console.error('Error saving wellness data:', error);
    }
  }, []);

  const getTodayData = useCallback((): DailyWellness => {
    const today = getTodayDateString();
    const existing = wellnessData.find(d => d.date === today);
    
    if (existing) {
      return existing;
    }

    return {
      date: today,
      steps: { date: today, steps: 0, goal: 10000 },
      water: { date: today, glasses: 0, goal: 8 },
    };
  }, [wellnessData]);

  const updateTodayData = useCallback(async (updates: Partial<DailyWellness>) => {
    const today = getTodayDateString();
    const todayData = getTodayData();
    const updatedData = { ...todayData, ...updates, date: today };
    
    const newWellnessData = wellnessData.filter(d => d.date !== today);
    newWellnessData.push(updatedData);
    
    await saveWellnessData(newWellnessData);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [wellnessData, getTodayData, saveWellnessData]);

  const addWaterGlass = useCallback(async () => {
    const todayData = getTodayData();
    const newGlasses = todayData.water.glasses + 1;
    
    await updateTodayData({
      water: { ...todayData.water, glasses: newGlasses },
    });
    
    if (newGlasses >= todayData.water.goal) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [getTodayData, updateTodayData]);

  const updateWaterGoal = useCallback(async (newGoal: number) => {
    const todayData = getTodayData();
    await updateTodayData({
      water: { ...todayData.water, goal: newGoal },
    });
  }, [getTodayData, updateTodayData]);

  const updateSteps = useCallback(async (steps: number) => {
    const todayData = getTodayData();
    await updateTodayData({
      steps: { ...todayData.steps, steps },
    });
  }, [getTodayData, updateTodayData]);

  const updateSleep = useCallback(async (sleep: SleepLog) => {
    await updateTodayData({ sleep });
  }, [updateTodayData]);

  const updateMood = useCallback(async (mood: MoodEntry) => {
    await updateTodayData({ mood });
  }, [updateTodayData]);

  const updateFocus = useCallback(async (focus: FocusSession) => {
    await updateTodayData({ focus });
  }, [updateTodayData]);

  const updateGratitude = useCallback(async (gratitude: GratitudeEntry) => {
    await updateTodayData({ gratitude });
  }, [updateTodayData]);

  const completeBreathing = useCallback(async () => {
    const today = getTodayDateString();
    await updateTodayData({
      breathing: { date: today, completed: true },
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [updateTodayData]);

  const completePosture = useCallback(async () => {
    const today = getTodayDateString();
    await updateTodayData({
      posture: { date: today, completed: true },
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [updateTodayData]);

  const calculateStreak = useCallback((): number => {
    if (wellnessData.length === 0) return 0;

    const sortedData = [...wellnessData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = new Date(today);

    for (const data of sortedData) {
      const dataDate = new Date(data.date);
      dataDate.setHours(0, 0, 0, 0);

      if (dataDate.getTime() === currentDate.getTime()) {
        const isComplete = 
          data.water.glasses >= data.water.goal * 0.8 ||
          data.steps.steps >= data.steps.goal * 0.8 ||
          data.sleep !== undefined ||
          data.mood !== undefined;

        if (isComplete) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return streak;
  }, [wellnessData]);

  useEffect(() => {
    loadWellnessData();
  }, [loadWellnessData]);

  return {
    wellnessData,
    loading,
    getTodayData,
    addWaterGlass,
    updateWaterGoal,
    updateSteps,
    updateSleep,
    updateMood,
    updateFocus,
    updateGratitude,
    completeBreathing,
    completePosture,
    calculateStreak,
    refreshData: loadWellnessData,
  };
}
