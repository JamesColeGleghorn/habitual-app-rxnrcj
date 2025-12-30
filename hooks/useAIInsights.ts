
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HabitInsight, HabitPattern, HabitSuggestion } from '@/types/aiInsights';
import { Habit } from '@/types/habit';
import {
  generateInsights,
  analyzeHabitPatterns,
  generateHabitSuggestions,
} from '@/utils/aiInsightsEngine';

const STORAGE_KEY = '@ai_insights_dismissed';

export function useAIInsights(habits: Habit[]) {
  const [insights, setInsights] = useState<HabitInsight[]>([]);
  const [patterns, setPatterns] = useState<HabitPattern[]>([]);
  const [suggestions, setSuggestions] = useState<HabitSuggestion[]>([]);
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadDismissedInsights = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setDismissedInsights(new Set(JSON.parse(data)));
      }
    } catch (error) {
      console.error('Error loading dismissed insights:', error);
    }
  }, []);

  const analyzeHabits = useCallback(async () => {
    try {
      setLoading(true);
      await loadDismissedInsights();

      const generatedInsights = generateInsights(habits);
      const filteredInsights = generatedInsights.filter(
        insight => !dismissedInsights.has(insight.id)
      );
      setInsights(filteredInsights);

      const habitPatterns = habits
        .filter(habit => habit.completedDates.length >= 7)
        .map(habit => analyzeHabitPatterns(habit));
      setPatterns(habitPatterns);

      const habitSuggestions = generateHabitSuggestions(habits);
      setSuggestions(habitSuggestions);
    } catch (error) {
      console.error('Error analyzing habits:', error);
    } finally {
      setLoading(false);
    }
  }, [habits, dismissedInsights, loadDismissedInsights]);

  useEffect(() => {
    analyzeHabits();
  }, [analyzeHabits]);

  const dismissInsight = useCallback(async (insightId: string) => {
    try {
      const newDismissed = new Set(dismissedInsights);
      newDismissed.add(insightId);
      setDismissedInsights(newDismissed);
      
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(newDismissed))
      );

      setInsights(insights.filter(i => i.id !== insightId));
    } catch (error) {
      console.error('Error dismissing insight:', error);
    }
  }, [dismissedInsights, insights]);

  const clearDismissedInsights = useCallback(async () => {
    try {
      setDismissedInsights(new Set());
      await AsyncStorage.removeItem(STORAGE_KEY);
      await analyzeHabits();
    } catch (error) {
      console.error('Error clearing dismissed insights:', error);
    }
  }, [analyzeHabits]);

  return {
    insights,
    patterns,
    suggestions,
    loading,
    dismissInsight,
    clearDismissedInsights,
    refreshInsights: analyzeHabits,
  };
}
