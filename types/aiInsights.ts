
export interface HabitInsight {
  id: string;
  type: 'suggestion' | 'pattern' | 'warning' | 'achievement' | 'tip';
  title: string;
  description: string;
  icon: string;
  color: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  action?: {
    label: string;
    habitId?: string;
  };
  createdAt: string;
  dismissed: boolean;
}

export interface HabitPattern {
  habitId: string;
  habitName: string;
  bestDays: string[];
  bestTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  averageCompletionRate: number;
  correlations: {
    habitId: string;
    habitName: string;
    strength: number;
  }[];
}

export interface HabitSuggestion {
  id: string;
  name: string;
  icon: string;
  color: string;
  reason: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  benefits: string[];
}
