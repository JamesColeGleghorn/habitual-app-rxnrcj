
export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  level: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  badges: string[];
  isPublic: boolean;
  createdAt: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface SharedProgress {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  habitName: string;
  streak: number;
  message?: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export interface FriendChallenge {
  id: string;
  creatorId: string;
  participantIds: string[];
  habitName: string;
  duration: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  leaderboard: {
    userId: string;
    username: string;
    completions: number;
  }[];
}
