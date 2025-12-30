
import { Badge, Achievement, UserLevel, Challenge } from '@/types/gamification';
import { Habit } from '@/types/habit';
import { calculateStreak, calculateCompletionRate } from './habitStats';

export const BADGES: Badge[] = [
  {
    id: 'first-step',
    name: 'First Step',
    description: 'Complete your first habit',
    icon: 'star.fill',
    color: '#F2BE22',
    requirement: 1,
    category: 'completion',
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'flame.fill',
    color: '#E74C3C',
    requirement: 7,
    category: 'streak',
  },
  {
    id: 'month-master',
    name: 'Month Master',
    description: 'Maintain a 30-day streak',
    icon: 'crown.fill',
    color: '#9B59B6',
    requirement: 30,
    category: 'streak',
  },
  {
    id: 'century-club',
    name: 'Century Club',
    description: 'Complete 100 habits',
    icon: 'trophy.fill',
    color: '#FFD700',
    requirement: 100,
    category: 'completion',
  },
  {
    id: 'variety-seeker',
    name: 'Variety Seeker',
    description: 'Track 5 different habits',
    icon: 'sparkles',
    color: '#29ABE2',
    requirement: 5,
    category: 'variety',
  },
  {
    id: 'consistency-king',
    name: 'Consistency King',
    description: 'Achieve 90% completion rate',
    icon: 'checkmark.seal.fill',
    color: '#27AE60',
    requirement: 90,
    category: 'consistency',
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete habits before 8 AM for 7 days',
    icon: 'sunrise.fill',
    color: '#F39C12',
    requirement: 7,
    category: 'special',
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete habits after 10 PM for 7 days',
    icon: 'moon.stars.fill',
    color: '#34495E',
    requirement: 7,
    category: 'special',
  },
];

export function calculateUserLevel(totalXP: number): UserLevel {
  const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 100;
  const xpForNextLevel = Math.pow(level, 2) * 100;
  const currentXP = totalXP - xpForCurrentLevel;
  const xpToNextLevel = xpForNextLevel - xpForCurrentLevel;

  return {
    level,
    currentXP,
    xpToNextLevel,
    totalXP,
  };
}

export function calculateXPForCompletion(habit: Habit, streak: number): number {
  let baseXP = 10;
  
  if (streak >= 7) baseXP += 5;
  if (streak >= 30) baseXP += 10;
  if (streak >= 100) baseXP += 20;
  
  return baseXP;
}

export function checkBadgeEarned(badge: Badge, habits: Habit[]): boolean {
  switch (badge.category) {
    case 'completion': {
      const totalCompletions = habits.reduce(
        (sum, habit) => sum + habit.completedDates.length,
        0
      );
      return totalCompletions >= badge.requirement;
    }
    case 'streak': {
      const maxStreak = Math.max(
        ...habits.map(habit => calculateStreak(habit.completedDates))
      );
      return maxStreak >= badge.requirement;
    }
    case 'variety': {
      return habits.length >= badge.requirement;
    }
    case 'consistency': {
      const avgCompletionRate = habits.reduce((sum, habit) => {
        const rate = calculateCompletionRate(habit.completedDates, habit.createdAt);
        return sum + rate;
      }, 0) / habits.length;
      return avgCompletionRate >= badge.requirement;
    }
    default:
      return false;
  }
}

export function generateDailyChallenges(): Challenge[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return [
    {
      id: `daily-${today.toISOString().split('T')[0]}-1`,
      title: 'Perfect Day',
      description: 'Complete all your habits today',
      type: 'daily',
      targetCount: 1,
      currentCount: 0,
      reward: 50,
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
      completed: false,
      icon: 'star.circle.fill',
      color: '#F2BE22',
    },
    {
      id: `daily-${today.toISOString().split('T')[0]}-2`,
      title: 'Early Achiever',
      description: 'Complete 3 habits before noon',
      type: 'daily',
      targetCount: 3,
      currentCount: 0,
      reward: 30,
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
      completed: false,
      icon: 'sunrise.fill',
      color: '#F39C12',
    },
  ];
}

export function generateWeeklyChallenges(): Challenge[] {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      id: `weekly-${today.toISOString().split('T')[0]}`,
      title: 'Weekly Warrior',
      description: 'Complete all habits for 7 consecutive days',
      type: 'weekly',
      targetCount: 7,
      currentCount: 0,
      reward: 200,
      startDate: today.toISOString(),
      endDate: nextWeek.toISOString(),
      completed: false,
      icon: 'flame.fill',
      color: '#E74C3C',
    },
  ];
}
