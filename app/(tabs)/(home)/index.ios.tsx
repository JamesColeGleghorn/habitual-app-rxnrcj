
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HabitCard } from '@/components/HabitCard';
import { IconSymbol } from '@/components/IconSymbol';
import { useHabits } from '@/hooks/useHabits';
import { useWellness } from '@/hooks/useWellness';
import { useGamification } from '@/hooks/useGamification';
import { useThemeColors } from '@/styles/commonStyles';
import { getRandomQuote } from '@/utils/motivationalQuotes';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { habits, loading, toggleHabitCompletion } = useHabits();
  const { calculateStreak } = useWellness();
  const { userLevel, addXP, checkAndAwardBadges } = useGamification(habits);
  const [quote] = useState(getRandomQuote());
  const wellnessStreak = calculateStreak();

  useEffect(() => {
    if (habits.length > 0) {
      checkAndAwardBadges();
    }
  }, [habits, checkAndAwardBadges]);

  const handleAddHabit = () => {
    router.push('/modal');
  };

  const handleHabitPress = (habitId: string) => {
    console.log('Habit pressed:', habitId);
  };

  const handleToggleHabit = async (habitId: string) => {
    await toggleHabitCompletion(habitId, async (xp) => {
      const leveledUp = await addXP(xp);
      if (leveledUp) {
        console.log('Level up!');
      }
    });
  };

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>Habit Streak</Text>
              <Text style={styles.subtitle}>Build better habits, one day at a time</Text>
            </View>
            <TouchableOpacity 
              style={styles.levelBadge}
              onPress={() => router.push('/(tabs)/(home)/gamification')}
            >
              <IconSymbol
                ios_icon_name="star.fill"
                android_material_icon_name="star"
                size={20}
                color={colors.secondary}
              />
              <Text style={styles.levelText}>Level {userLevel.level}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickAccessSection}>
          <TouchableOpacity 
            style={styles.quickAccessCard}
            onPress={() => router.push('/(tabs)/(home)/dashboard')}
          >
            <View style={styles.quickAccessIcon}>
              <IconSymbol
                ios_icon_name="heart.circle.fill"
                android_material_icon_name="favorite"
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.quickAccessTitle}>Wellness Dashboard</Text>
            <Text style={styles.quickAccessSubtitle}>
              Track steps, water, sleep & more
            </Text>
            {wellnessStreak > 0 && (
              <View style={styles.streakBadge}>
                <IconSymbol
                  ios_icon_name="flame.fill"
                  android_material_icon_name="local_fire_department"
                  size={16}
                  color={colors.secondary}
                />
                <Text style={styles.streakText}>{wellnessStreak} days</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickAccessCard}
            onPress={() => router.push('/(tabs)/(home)/insights')}
          >
            <View style={styles.quickAccessIcon}>
              <IconSymbol
                ios_icon_name="chart.bar.fill"
                android_material_icon_name="bar_chart"
                size={32}
                color={colors.secondary}
              />
            </View>
            <Text style={styles.quickAccessTitle}>Weekly Insights</Text>
            <Text style={styles.quickAccessSubtitle}>
              View trends & correlations
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickAccessSection}>
          <TouchableOpacity 
            style={styles.quickAccessCard}
            onPress={() => router.push('/(tabs)/(home)/gamification')}
          >
            <View style={styles.quickAccessIcon}>
              <IconSymbol
                ios_icon_name="trophy.fill"
                android_material_icon_name="emoji_events"
                size={32}
                color="#FFD700"
              />
            </View>
            <Text style={styles.quickAccessTitle}>Achievements</Text>
            <Text style={styles.quickAccessSubtitle}>
              Badges, challenges & rewards
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickAccessCard}
            onPress={() => router.push('/(tabs)/(home)/ai-insights')}
          >
            <View style={styles.quickAccessIcon}>
              <IconSymbol
                ios_icon_name="brain.head.profile"
                android_material_icon_name="psychology"
                size={32}
                color="#9B59B6"
              />
            </View>
            <Text style={styles.quickAccessTitle}>AI Insights</Text>
            <Text style={styles.quickAccessSubtitle}>
              Smart suggestions & patterns
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.codeCompletionCard}
          onPress={() => router.push('/(tabs)/(home)/code-completion')}
        >
          <View style={styles.codeCompletionIcon}>
            <IconSymbol
              ios_icon_name="chevron.left.forwardslash.chevron.right"
              android_material_icon_name="code"
              size={32}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.codeCompletionContent}>
            <Text style={styles.codeCompletionTitle}>Code Completion Tool</Text>
            <Text style={styles.codeCompletionSubtitle}>
              AI-powered code suggestions with OpenRouter
            </Text>
          </View>
          <IconSymbol
            ios_icon_name="chevron.right"
            android_material_icon_name="chevron_right"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View style={styles.quoteCard}>
          <IconSymbol
            ios_icon_name="quote.bubble.fill"
            android_material_icon_name="format_quote"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.quoteText}>{quote}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today&apos;s Habits</Text>
            <TouchableOpacity onPress={handleAddHabit} style={styles.addButton}>
              <IconSymbol
                ios_icon_name="plus.circle.fill"
                android_material_icon_name="add_circle"
                size={28}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Loading habits...</Text>
            </View>
          ) : habits.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol
                ios_icon_name="sparkles"
                android_material_icon_name="auto_awesome"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No habits yet</Text>
              <Text style={styles.emptySubtext}>Tap the + button to create your first habit</Text>
            </View>
          ) : (
            <View style={styles.habitsList}>
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={() => handleToggleHabit(habit.id)}
                  onPress={() => handleHabitPress(habit.id)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
    marginTop: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  quickAccessSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickAccessCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickAccessIcon: {
    marginBottom: 12,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  quickAccessSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  quoteCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quoteText: {
    flex: 1,
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.text,
    marginLeft: 12,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    padding: 4,
  },
  habitsList: {
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  codeCompletionCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  codeCompletionIcon: {
    marginRight: 16,
  },
  codeCompletionContent: {
    flex: 1,
  },
  codeCompletionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  codeCompletionSubtitle: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 18,
  },
});
