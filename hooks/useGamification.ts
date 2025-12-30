
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Badge, Achievement, UserLevel, Challenge } from '@/types/gamification';
import { Habit } from '@/types/habit';
import {
  BADGES,
  calculateUserLevel,
  calculateXPForCompletion,
  checkBadgeEarned,
  generateDailyChallenges,
  generateWeeklyChallenges,
} from '@/utils/gamificationEngine';
import * as Haptics from 'expo-haptics';

const STORAGE_KEYS = {
  TOTAL_XP: '@gamification_total_xp',
  EARNED_BADGES: '@gamification_earned_badges',
  CHALLENGES: '@gamification_challenges',
};

export function useGamification(habits: Habit[]) {
  const [totalXP, setTotalXP] = useState(0);
  const [userLevel, setUserLevel] = useState<UserLevel>(calculateUserLevel(0));
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGamificationData = useCallback(async () => {
    try {
      const [xpData, badgesData, challengesData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TOTAL_XP),
        AsyncStorage.getItem(STORAGE_KEYS.EARNED_BADGES),
        AsyncStorage.getItem(STORAGE_KEYS.CHALLENGES),
      ]);

      const xp = xpData ? parseInt(xpData, 10) : 0;
      setTotalXP(xp);
      setUserLevel(calculateUserLevel(xp));

      if (badgesData) {
        setEarnedBadges(JSON.parse(badgesData));
      }

      if (challengesData) {
        const parsedChallenges = JSON.parse(challengesData);
        const today = new Date().toISOString().split('T')[0];
        const validChallenges = parsedChallenges.filter((c: Challenge) => 
          c.endDate >= today
        );
        setChallenges(validChallenges);
      } else {
        const newChallenges = [
          ...generateDailyChallenges(),
          ...generateWeeklyChallenges(),
        ];
        setChallenges(newChallenges);
        await AsyncStorage.setItem(
          STORAGE_KEYS.CHALLENGES,
          JSON.stringify(newChallenges)
        );
      }
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGamificationData();
  }, [loadGamificationData]);

  const addXP = useCallback(async (xp: number) => {
    try {
      const newTotalXP = totalXP + xp;
      const oldLevel = userLevel.level;
      const newLevel = calculateUserLevel(newTotalXP);

      setTotalXP(newTotalXP);
      setUserLevel(newLevel);
      await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_XP, newTotalXP.toString());

      if (newLevel.level > oldLevel) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      return newLevel.level > oldLevel;
    } catch (error) {
      console.error('Error adding XP:', error);
      return false;
    }
  }, [totalXP, userLevel]);

  const checkAndAwardBadges = useCallback(async () => {
    try {
      const newBadges: Badge[] = [];
      const earnedBadgeIds = new Set(earnedBadges.map(b => b.id));

      for (const badge of BADGES) {
        if (!earnedBadgeIds.has(badge.id) && checkBadgeEarned(badge, habits)) {
          const earnedBadge = { ...badge, earnedAt: new Date().toISOString() };
          newBadges.push(earnedBadge);
        }
      }

      if (newBadges.length > 0) {
        const updatedBadges = [...earnedBadges, ...newBadges];
        setEarnedBadges(updatedBadges);
        await AsyncStorage.setItem(
          STORAGE_KEYS.EARNED_BADGES,
          JSON.stringify(updatedBadges)
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return newBadges;
      }

      return [];
    } catch (error) {
      console.error('Error checking badges:', error);
      return [];
    }
  }, [habits, earnedBadges]);

  const updateChallengeProgress = useCallback(async (challengeId: string, increment: number = 1) => {
    try {
      const updatedChallenges = challenges.map(challenge => {
        if (challenge.id === challengeId) {
          const newCount = challenge.currentCount + increment;
          const completed = newCount >= challenge.targetCount;
          return { ...challenge, currentCount: newCount, completed };
        }
        return challenge;
      });

      setChallenges(updatedChallenges);
      await AsyncStorage.setItem(
        STORAGE_KEYS.CHALLENGES,
        JSON.stringify(updatedChallenges)
      );

      const completedChallenge = updatedChallenges.find(
        c => c.id === challengeId && c.completed && !challenges.find(ch => ch.id === challengeId)?.completed
      );

      if (completedChallenge) {
        await addXP(completedChallenge.reward);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      return false;
    }
  }, [challenges, addXP]);

  const getAvailableBadges = useCallback(() => {
    const earnedBadgeIds = new Set(earnedBadges.map(b => b.id));
    return BADGES.filter(badge => !earnedBadgeIds.has(badge.id));
  }, [earnedBadges]);

  return {
    totalXP,
    userLevel,
    earnedBadges,
    challenges,
    loading,
    addXP,
    checkAndAwardBadges,
    updateChallengeProgress,
    getAvailableBadges,
    refreshGamification: loadGamificationData,
  };
}
