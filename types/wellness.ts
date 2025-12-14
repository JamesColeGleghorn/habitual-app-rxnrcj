
export interface StepData {
  date: string;
  steps: number;
  goal: number;
}

export interface WaterIntake {
  date: string;
  glasses: number;
  goal: number;
}

export interface SleepLog {
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  score: number;
}

export interface MoodEntry {
  date: string;
  emoji: string;
  note?: string;
}

export interface FocusSession {
  date: string;
  duration: number;
  completed: boolean;
}

export interface GratitudeEntry {
  date: string;
  entries: string[];
}

export interface BreathingSession {
  date: string;
  completed: boolean;
}

export interface PostureReminder {
  date: string;
  completed: boolean;
}

export interface DailyWellness {
  date: string;
  steps: StepData;
  water: WaterIntake;
  sleep?: SleepLog;
  mood?: MoodEntry;
  focus?: FocusSession;
  gratitude?: GratitudeEntry;
  breathing?: BreathingSession;
  posture?: PostureReminder;
}

export interface WellnessStreak {
  current: number;
  longest: number;
}
