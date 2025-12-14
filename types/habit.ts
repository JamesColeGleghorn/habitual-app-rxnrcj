
export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  reminderTime?: string;
  completedDates: string[];
  createdAt?: string;
  dates?: { [date: string]: boolean };
  customImage?: string; // URI to custom image
}

export interface HabitCompletion {
  habitId: string;
  date: string;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  completionRate: number;
}
