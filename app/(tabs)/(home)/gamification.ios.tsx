
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { CircularProgress } from '@/components/CircularProgress';
import { useHabits } from '@/hooks/useHabits';
import { useGamification } from '@/hooks/useGamification';
import { useThemeColors } from '@/styles/commonStyles';
import { Badge, Challenge } from '@/types/gamification';

export default function GamificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { habits } = useHabits();
  const {
    userLevel,
    earnedBadges,
    challenges,
    getAvailableBadges,
    loading,
  } = useGamification(habits);

  const availableBadges = getAvailableBadges();
  const styles = createStyles(colors);

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View>
              <Text style={styles.levelTitle}>Level {userLevel.level}</Text>
              <Text style={styles.levelSubtitle}>
                {userLevel.currentXP} / {userLevel.xpToNextLevel} XP
              </Text>
            </View>
            <View style={styles.levelIconContainer}>
              <IconSymbol
                ios_icon_name="star.fill"
                android_material_icon_name="star"
                size={40}
                color={colors.secondary}
              />
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${(userLevel.currentXP / userLevel.xpToNextLevel) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.totalXPText}>Total XP: {userLevel.totalXP}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Challenges</Text>
          {challenges.filter(c => !c.completed).length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol
                ios_icon_name="flag.fill"
                android_material_icon_name="flag"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No active challenges</Text>
            </View>
          ) : (
            <View style={styles.challengesList}>
              {challenges
                .filter(c => !c.completed)
                .map((challenge, index) => (
                  <ChallengeCard key={index} challenge={challenge} colors={colors} />
                ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Earned Badges ({earnedBadges.length})
          </Text>
          {earnedBadges.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol
                ios_icon_name="rosette"
                android_material_icon_name="workspace_premium"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No badges earned yet</Text>
              <Text style={styles.emptySubtext}>
                Complete habits to earn your first badge!
              </Text>
            </View>
          ) : (
            <View style={styles.badgesGrid}>
              {earnedBadges.map((badge, index) => (
                <BadgeCard key={index} badge={badge} earned={true} colors={colors} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Available Badges ({availableBadges.length})
          </Text>
          <View style={styles.badgesGrid}>
            {availableBadges.map((badge, index) => (
              <BadgeCard key={index} badge={badge} earned={false} colors={colors} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function BadgeCard({
  badge,
  earned,
  colors,
}: {
  badge: Badge;
  earned: boolean;
  colors: ReturnType<typeof useThemeColors>;
}) {
  return (
    <View
      style={[
        styles.badgeCard,
        { backgroundColor: colors.card, opacity: earned ? 1 : 0.5 },
      ]}
    >
      <View
        style={[
          styles.badgeIconContainer,
          { backgroundColor: badge.color + '20' },
        ]}
      >
        <IconSymbol
          ios_icon_name={badge.icon}
          android_material_icon_name="workspace_premium"
          size={32}
          color={badge.color}
        />
      </View>
      <Text style={[styles.badgeName, { color: colors.text }]} numberOfLines={1}>
        {badge.name}
      </Text>
      <Text style={[styles.badgeDescription, { color: colors.textSecondary }]} numberOfLines={2}>
        {badge.description}
      </Text>
      {earned && badge.earnedAt && (
        <View style={styles.earnedBadge}>
          <IconSymbol
            ios_icon_name="checkmark.circle.fill"
            android_material_icon_name="check_circle"
            size={16}
            color={colors.primary}
          />
        </View>
      )}
    </View>
  );
}

function ChallengeCard({
  challenge,
  colors,
}: {
  challenge: Challenge;
  colors: ReturnType<typeof useThemeColors>;
}) {
  const progress = (challenge.currentCount / challenge.targetCount) * 100;

  return (
    <View style={[styles.challengeCard, { backgroundColor: colors.card }]}>
      <View style={styles.challengeHeader}>
        <View
          style={[
            styles.challengeIconContainer,
            { backgroundColor: challenge.color + '20' },
          ]}
        >
          <IconSymbol
            ios_icon_name={challenge.icon}
            android_material_icon_name="flag"
            size={24}
            color={challenge.color}
          />
        </View>
        <View style={styles.challengeInfo}>
          <Text style={[styles.challengeTitle, { color: colors.text }]}>
            {challenge.title}
          </Text>
          <Text style={[styles.challengeDescription, { color: colors.textSecondary }]}>
            {challenge.description}
          </Text>
        </View>
      </View>
      <View style={styles.challengeProgress}>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${progress}%`, backgroundColor: challenge.color },
            ]}
          />
        </View>
        <Text style={[styles.challengeProgressText, { color: colors.textSecondary }]}>
          {challenge.currentCount} / {challenge.targetCount}
        </Text>
      </View>
      <View style={styles.challengeReward}>
        <IconSymbol
          ios_icon_name="star.fill"
          android_material_icon_name="star"
          size={16}
          color={colors.secondary}
        />
        <Text style={[styles.rewardText, { color: colors.text }]}>
          {challenge.reward} XP
        </Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.textSecondary + '20',
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    placeholder: {
      width: 32,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 120,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    levelCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginTop: 20,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    levelHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    levelTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
    },
    levelSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    levelIconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.secondary + '20',
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: colors.textSecondary + '20',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    totalXPText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'right',
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
    },
    badgesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    badgeCard: {
      width: '48%',
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      position: 'relative',
    },
    badgeIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    badgeName: {
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 4,
    },
    badgeDescription: {
      fontSize: 12,
      lineHeight: 16,
    },
    earnedBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
    },
    challengesList: {
      gap: 12,
    },
    challengeCard: {
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    challengeHeader: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    challengeIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    challengeInfo: {
      flex: 1,
    },
    challengeTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 4,
    },
    challengeDescription: {
      fontSize: 13,
      lineHeight: 18,
    },
    challengeProgress: {
      marginBottom: 12,
    },
    challengeProgressText: {
      fontSize: 12,
      marginTop: 4,
      textAlign: 'right',
    },
    challengeReward: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    rewardText: {
      fontSize: 14,
      fontWeight: '600',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
      marginTop: 12,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
  });
