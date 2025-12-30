
import { HabitInsight, HabitPattern, HabitSuggestion } from '@/types/aiInsights';
import { Habit } from '@/types/habit';
import { calculateStreak, calculateCompletionRate } from './habitStats';

export function generateInsights(habits: Habit[]): HabitInsight[] {
  const insights: HabitInsight[] = [];

  habits.forEach(habit => {
    const streak = calculateStreak(habit.completedDates);
    const completionRate = calculateCompletionRate(habit.completedDates, habit.createdAt);

    if (streak >= 7 && streak < 30) {
      insights.push({
        id: `insight-${habit.id}-streak`,
        type: 'achievement',
        title: `${habit.name} is on fire! 🔥`,
        description: `You've maintained a ${streak}-day streak. Keep it up to reach 30 days!`,
        icon: 'flame.fill',
        color: '#E74C3C',
        priority: 'high',
        actionable: false,
        createdAt: new Date().toISOString(),
        dismissed: false,
      });
    }

    if (completionRate < 50 && habit.completedDates.length > 7) {
      insights.push({
        id: `insight-${habit.id}-low-rate`,
        type: 'warning',
        title: `${habit.name} needs attention`,
        description: `Your completion rate is ${Math.round(completionRate)}%. Consider adjusting your goal or reminder time.`,
        icon: 'exclamationmark.triangle.fill',
        color: '#F39C12',
        priority: 'medium',
        actionable: true,
        action: {
          label: 'Adjust Habit',
          habitId: habit.id,
        },
        createdAt: new Date().toISOString(),
        dismissed: false,
      });
    }

    const lastCompletion = habit.completedDates[habit.completedDates.length - 1];
    if (lastCompletion) {
      const daysSinceCompletion = Math.floor(
        (Date.now() - new Date(lastCompletion).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceCompletion >= 3) {
        insights.push({
          id: `insight-${habit.id}-inactive`,
          type: 'warning',
          title: `Missing ${habit.name}?`,
          description: `It's been ${daysSinceCompletion} days since you last completed this habit. Get back on track!`,
          icon: 'clock.badge.exclamationmark.fill',
          color: '#E74C3C',
          priority: 'high',
          actionable: true,
          action: {
            label: 'Complete Now',
            habitId: habit.id,
          },
          createdAt: new Date().toISOString(),
          dismissed: false,
        });
      }
    }
  });

  if (habits.length > 0) {
    const avgCompletionRate = habits.reduce((sum, habit) => {
      return sum + calculateCompletionRate(habit.completedDates, habit.createdAt);
    }, 0) / habits.length;

    if (avgCompletionRate >= 80) {
      insights.push({
        id: 'insight-overall-great',
        type: 'achievement',
        title: 'You\'re crushing it! 💪',
        description: `Your overall completion rate is ${Math.round(avgCompletionRate)}%. You're building amazing habits!`,
        icon: 'star.fill',
        color: '#27AE60',
        priority: 'high',
        actionable: false,
        createdAt: new Date().toISOString(),
        dismissed: false,
      });
    }
  }

  insights.push({
    id: 'tip-consistency',
    type: 'tip',
    title: 'Consistency is key',
    description: 'Studies show that it takes 21-66 days to form a new habit. Stay consistent!',
    icon: 'lightbulb.fill',
    color: '#29ABE2',
    priority: 'low',
    actionable: false,
    createdAt: new Date().toISOString(),
    dismissed: false,
  });

  return insights.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

export function analyzeHabitPatterns(habit: Habit): HabitPattern {
  const completedDates = habit.completedDates.map(d => new Date(d));
  const dayOfWeekCounts: { [key: string]: number } = {};
  
  completedDates.forEach(date => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    dayOfWeekCounts[dayName] = (dayOfWeekCounts[dayName] || 0) + 1;
  });

  const bestDays = Object.entries(dayOfWeekCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([day]) => day);

  return {
    habitId: habit.id,
    habitName: habit.name,
    bestDays,
    bestTimeOfDay: 'morning',
    averageCompletionRate: calculateCompletionRate(habit.completedDates, habit.createdAt),
    correlations: [],
  };
}

export function generateHabitSuggestions(existingHabits: Habit[]): HabitSuggestion[] {
  const existingCategories = new Set(existingHabits.map(h => h.icon));
  
  const allSuggestions: HabitSuggestion[] = [
    {
      id: 'suggest-meditation',
      name: 'Daily Meditation',
      icon: 'brain.head.profile',
      color: '#9B59B6',
      reason: 'Reduce stress and improve focus',
      category: 'Mental Health',
      difficulty: 'easy',
      estimatedTime: '10 minutes',
      benefits: ['Reduces stress', 'Improves focus', 'Better sleep'],
    },
    {
      id: 'suggest-exercise',
      name: 'Morning Exercise',
      icon: 'figure.run',
      color: '#E74C3C',
      reason: 'Boost energy and physical health',
      category: 'Fitness',
      difficulty: 'medium',
      estimatedTime: '30 minutes',
      benefits: ['Increases energy', 'Improves mood', 'Better health'],
    },
    {
      id: 'suggest-reading',
      name: 'Read for 20 minutes',
      icon: 'book.fill',
      color: '#3498DB',
      reason: 'Expand knowledge and reduce screen time',
      category: 'Learning',
      difficulty: 'easy',
      estimatedTime: '20 minutes',
      benefits: ['Expands knowledge', 'Reduces stress', 'Better vocabulary'],
    },
    {
      id: 'suggest-water',
      name: 'Drink 8 glasses of water',
      icon: 'drop.fill',
      color: '#29ABE2',
      reason: 'Stay hydrated for better health',
      category: 'Health',
      difficulty: 'easy',
      estimatedTime: 'Throughout day',
      benefits: ['Better hydration', 'Clearer skin', 'More energy'],
    },
    {
      id: 'suggest-gratitude',
      name: 'Gratitude Journal',
      icon: 'heart.text.square.fill',
      color: '#F2BE22',
      reason: 'Improve mental well-being',
      category: 'Mental Health',
      difficulty: 'easy',
      estimatedTime: '5 minutes',
      benefits: ['Positive mindset', 'Better mood', 'Reduced anxiety'],
    },
    {
      id: 'suggest-sleep',
      name: 'Sleep 8 hours',
      icon: 'bed.double.fill',
      color: '#34495E',
      reason: 'Essential for recovery and health',
      category: 'Health',
      difficulty: 'medium',
      estimatedTime: '8 hours',
      benefits: ['Better recovery', 'Improved focus', 'Stronger immune system'],
    },
  ];

  return allSuggestions.filter(suggestion => 
    !existingCategories.has(suggestion.icon)
  ).slice(0, 4);
}
