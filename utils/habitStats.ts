
import { Habit, HabitStats } from '@/types/habit';

export function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  const sortedDates = completedDates
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const mostRecent = sortedDates[0];
  mostRecent.setHours(0, 0, 0, 0);

  if (mostRecent.getTime() !== today.getTime() && mostRecent.getTime() !== yesterday.getTime()) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const current = sortedDates[i];
    const previous = sortedDates[i - 1];
    
    const dayDiff = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function calculateLongestStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  const sortedDates = completedDates
    .map(d => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const current = sortedDates[i];
    const previous = sortedDates[i - 1];
    
    const dayDiff = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else if (dayDiff > 1) {
      currentStreak = 1;
    }
  }

  return longestStreak;
}

export function getHabitStats(habit: Habit): HabitStats {
  const currentStreak = calculateStreak(habit.completedDates);
  const longestStreak = calculateLongestStreak(habit.completedDates);
  const totalCompleted = habit.completedDates.length;

  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const completionRate = daysSinceCreation > 0 
    ? Math.round((totalCompleted / daysSinceCreation) * 100) 
    : 0;

  return {
    currentStreak,
    longestStreak,
    totalCompleted,
    completionRate,
  };
}

export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function isCompletedToday(habit: Habit): boolean {
  const today = getTodayDateString();
  return habit.completedDates.includes(today);
}
