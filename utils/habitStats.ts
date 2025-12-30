
import { Habit, HabitStats } from '@/types/habit';

export function calculateStreak(completedDates: string[]): number {
  if (!completedDates || completedDates.length === 0) return 0;

  const sortedDates = completedDates
    .map(d => new Date(d))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => b.getTime() - a.getTime());

  if (sortedDates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const mostRecent = new Date(sortedDates[0]);
  mostRecent.setHours(0, 0, 0, 0);

  if (mostRecent.getTime() !== today.getTime() && mostRecent.getTime() !== yesterday.getTime()) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i]);
    const previous = new Date(sortedDates[i - 1]);
    
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
  if (!completedDates || completedDates.length === 0) return 0;

  const sortedDates = completedDates
    .map(d => new Date(d))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (sortedDates.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i]);
    const previous = new Date(sortedDates[i - 1]);
    
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
  const totalCompleted = habit.completedDates?.length || 0;

  const createdDate = habit.createdAt ? new Date(habit.createdAt) : new Date();
  const daysSinceCreation = Math.max(1, Math.floor(
    (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1);

  const completionRate = daysSinceCreation > 0 
    ? Math.min(100, Math.round((totalCompleted / daysSinceCreation) * 100))
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
  return habit.completedDates?.includes(today) || false;
}
