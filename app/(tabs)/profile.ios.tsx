
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { ProgressChart } from '@/components/ProgressChart';
import { useHabits } from '@/hooks/useHabits';
import { colors } from '@/styles/commonStyles';
import { getHabitStats } from '@/utils/habitStats';
import { getRandomQuote } from '@/utils/motivationalQuotes';

export default function ProfileScreen() {
  const { habits } = useHabits();
  const [quote] = useState(getRandomQuote());

  const totalStats = habits.reduce(
    (acc, habit) => {
      const stats = getHabitStats(habit);
      return {
        totalCompleted: acc.totalCompleted + stats.totalCompleted,
        totalCurrentStreak: acc.totalCurrentStreak + stats.currentStreak,
        totalLongestStreak: Math.max(acc.totalLongestStreak, stats.longestStreak),
        avgCompletionRate: acc.avgCompletionRate + stats.completionRate,
      };
    },
    { totalCompleted: 0, totalCurrentStreak: 0, totalLongestStreak: 0, avgCompletionRate: 0 }
  );

  const avgCompletionRate = habits.length > 0 
    ? Math.round(totalStats.avgCompletionRate / habits.length) 
    : 0;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Progress & Stats</Text>
          <Text style={styles.subtitle}>Track your journey to better habits</Text>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Overall Completion Rate</Text>
          <View style={styles.chartContainer}>
            <ProgressChart percentage={avgCompletionRate} />
          </View>
          <Text style={styles.chartSubtext}>
            Keep up the great work!
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check_circle"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.statValue}>{totalStats.totalCompleted}</Text>
            <Text style={styles.statLabel}>Total Completed</Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol
              ios_icon_name="flame.fill"
              android_material_icon_name="local_fire_department"
              size={32}
              color={colors.secondary}
            />
            <Text style={styles.statValue}>{totalStats.totalCurrentStreak}</Text>
            <Text style={styles.statLabel}>Active Streaks</Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={32}
              color={colors.accent}
            />
            <Text style={styles.statValue}>{totalStats.totalLongestStreak}</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol
              ios_icon_name="list.bullet"
              android_material_icon_name="list"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.statValue}>{habits.length}</Text>
            <Text style={styles.statLabel}>Total Habits</Text>
          </View>
        </View>

        <View style={styles.motivationCard}>
          <Text style={styles.motivationTitle}>Daily Motivation</Text>
          <Text style={styles.motivationText}>{quote}</Text>
        </View>

        <View style={styles.habitsBreakdown}>
          <Text style={styles.breakdownTitle}>Habits Breakdown</Text>
          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No habits to display</Text>
            </View>
          ) : (
            habits.map((habit) => {
              const stats = getHabitStats(habit);
              return (
                <View key={habit.id} style={styles.habitBreakdownCard}>
                  <View style={styles.habitBreakdownHeader}>
                    <IconSymbol
                      ios_icon_name={habit.icon}
                      android_material_icon_name={habit.icon}
                      size={24}
                      color={habit.color}
                    />
                    <Text style={styles.habitBreakdownName}>{habit.name}</Text>
                  </View>
                  <View style={styles.habitBreakdownStats}>
                    <View style={styles.habitBreakdownStat}>
                      <Text style={styles.habitBreakdownValue}>{stats.currentStreak}</Text>
                      <Text style={styles.habitBreakdownLabel}>Current</Text>
                    </View>
                    <View style={styles.habitBreakdownStat}>
                      <Text style={styles.habitBreakdownValue}>{stats.longestStreak}</Text>
                      <Text style={styles.habitBreakdownLabel}>Longest</Text>
                    </View>
                    <View style={styles.habitBreakdownStat}>
                      <Text style={styles.habitBreakdownValue}>{stats.completionRate}%</Text>
                      <Text style={styles.habitBreakdownLabel}>Rate</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
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
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  chartContainer: {
    marginVertical: 16,
  },
  chartSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  motivationCard: {
    backgroundColor: colors.highlight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  motivationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  motivationText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.text,
    lineHeight: 22,
  },
  habitsBreakdown: {
    marginBottom: 24,
  },
  breakdownTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  habitBreakdownCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  habitBreakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitBreakdownName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  habitBreakdownStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  habitBreakdownStat: {
    alignItems: 'center',
  },
  habitBreakdownValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  habitBreakdownLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
