
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: number;
  category: 'streak' | 'completion' | 'variety' | 'consistency' | 'special';
  earnedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  color: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface UserLevel {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  targetCount: number;
  currentCount: number;
  reward: number;
  startDate: string;
  endDate: string;
  completed: boolean;
  icon: string;
  color: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  totalPoints: number;
  level: number;
  streak: number;
  rank: number;
}
