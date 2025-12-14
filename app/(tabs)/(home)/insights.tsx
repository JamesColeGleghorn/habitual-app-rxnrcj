
import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWellness } from '@/hooks/useWellness';
import { useThemeColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 200;

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { wellnessData } = useWellness();

  const weeklyData = useMemo(() => {
    const last7Days = wellnessData.slice(-7);
    
    const avgSteps = last7Days.reduce((sum, d) => sum + d.steps.steps, 0) / (last7Days.length || 1);
    const avgWater = last7Days.reduce((sum, d) => sum + d.water.glasses, 0) / (last7Days.length || 1);
    const avgSleep = last7Days.filter(d => d.sleep).reduce((sum, d) => sum + (d.sleep?.duration || 0), 0) / (last7Days.filter(d => d.sleep).length || 1);
    
    const moodSleepCorrelation = last7Days
      .filter(d => d.mood && d.sleep)
      .map(d => ({
        mood: d.mood!.emoji,
        sleep: d.sleep!.duration,
      }));

    // Calculate mood distribution
    const moodCounts: { [key: string]: number } = {};
    last7Days.forEach(d => {
      if (d.mood) {
        moodCounts[d.mood.emoji] = (moodCounts[d.mood.emoji] || 0) + 1;
      }
    });

    // Calculate step distribution
    const stepsByDay = last7Days.map((d, idx) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(d.date).getDay()],
      steps: d.steps.steps,
    }));

    return {
      avgSteps: Math.round(avgSteps),
      avgWater: Math.round(avgWater * 10) / 10,
      avgSleep: Math.round(avgSleep * 10) / 10,
      moodSleepCorrelation,
      daysTracked: last7Days.length,
      moodCounts,
      stepsByDay,
    };
  }, [wellnessData]);

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Platform.OS === 'android' ? 48 : insets.top + 16 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Weekly Insights</Text>
          <Text style={styles.subtitle}>Your wellness trends and patterns</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>7-Day Summary</Text>
          
          <View style={styles.summaryRow}>
            <IconSymbol
              ios_icon_name="figure.walk"
              android_material_icon_name="directions_walk"
              size={24}
              color={colors.primary}
            />
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Average Steps</Text>
              <Text style={styles.summaryValue}>{weeklyData.avgSteps.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <IconSymbol
              ios_icon_name="drop.fill"
              android_material_icon_name="water_drop"
              size={24}
              color="#4A90E2"
            />
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Average Water</Text>
              <Text style={styles.summaryValue}>{weeklyData.avgWater} glasses</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <IconSymbol
              ios_icon_name="moon.fill"
              android_material_icon_name="bedtime"
              size={24}
              color="#9B59B6"
            />
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Average Sleep</Text>
              <Text style={styles.summaryValue}>{weeklyData.avgSleep} hours</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Mood vs Sleep Correlation</Text>
          <Text style={styles.chartSubtitle}>
            How your sleep affects your mood
          </Text>
          
          {weeklyData.moodSleepCorrelation.length > 0 ? (
            <View style={styles.correlationChart}>
              {weeklyData.moodSleepCorrelation.map((item, index) => (
                <View key={index} style={styles.correlationItem}>
                  <Text style={styles.correlationMood}>{item.mood}</Text>
                  <View style={styles.correlationBar}>
                    <View 
                      style={[
                        styles.correlationBarFill,
                        { 
                          width: `${Math.min(100, (item.sleep / 10) * 100)}%`,
                          backgroundColor: item.sleep >= 7 ? colors.primary : colors.accent,
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.correlationValue}>{item.sleep.toFixed(1)}h</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol
                ios_icon_name="chart.bar"
                android_material_icon_name="bar_chart"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>
                Log your mood and sleep for a few days to see correlations
              </Text>
            </View>
          )}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Daily Steps</Text>
          <Text style={styles.chartSubtitle}>
            Your activity over the past week
          </Text>
          
          <View style={styles.stepsChart}>
            {weeklyData.stepsByDay.map((item, index) => {
              const maxSteps = Math.max(...weeklyData.stepsByDay.map(d => d.steps), 10000);
              const barHeight = (item.steps / maxSteps) * CHART_HEIGHT;
              
              return (
                <View key={index} style={styles.stepBarContainer}>
                  <View 
                    style={[
                      styles.stepBar,
                      { 
                        height: barHeight,
                        backgroundColor: item.steps >= 10000 ? colors.primary : colors.secondary,
                      }
                    ]}
                  />
                  <Text style={styles.stepLabel}>{item.day}</Text>
                  <Text style={styles.stepValue}>{Math.round(item.steps / 1000)}k</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Mood Distribution</Text>
          <Text style={styles.chartSubtitle}>
            Your emotional patterns this week
          </Text>
          
          {Object.keys(weeklyData.moodCounts).length > 0 ? (
            <View style={styles.moodDistribution}>
              {Object.entries(weeklyData.moodCounts).map(([mood, count], index) => (
                <View key={index} style={styles.moodDistItem}>
                  <Text style={styles.moodDistEmoji}>{mood}</Text>
                  <View style={styles.moodDistBar}>
                    <View 
                      style={[
                        styles.moodDistBarFill,
                        { width: `${(count / weeklyData.daysTracked) * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.moodDistCount}>{count}x</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Log your mood to see your emotional patterns
              </Text>
            </View>
          )}
        </View>

        <View style={styles.insightCard}>
          <IconSymbol
            ios_icon_name="lightbulb.fill"
            android_material_icon_name="lightbulb"
            size={32}
            color={colors.secondary}
          />
          <Text style={styles.insightTitle}>Insight</Text>
          <Text style={styles.insightText}>
            {weeklyData.avgSleep >= 7 
              ? 'Great job! You&apos;re getting enough sleep. Keep it up!'
              : 'Try to get at least 7-8 hours of sleep for better mood and energy.'}
          </Text>
        </View>

        <View style={styles.insightCard}>
          <IconSymbol
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={32}
            color={colors.primary}
          />
          <Text style={styles.insightTitle}>Tip</Text>
          <Text style={styles.insightText}>
            {weeklyData.avgWater >= 8
              ? 'Excellent hydration! Your body thanks you.'
              : 'Aim for 8 glasses of water daily to stay properly hydrated.'}
          </Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>This Week&apos;s Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weeklyData.daysTracked}</Text>
              <Text style={styles.statLabel}>Days Tracked</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weeklyData.avgSteps}</Text>
              <Text style={styles.statLabel}>Avg Steps</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weeklyData.avgWater}</Text>
              <Text style={styles.statLabel}>Avg Water</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weeklyData.avgSleep}h</Text>
              <Text style={styles.statLabel}>Avg Sleep</Text>
            </View>
          </View>
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
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryContent: {
    marginLeft: 16,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  chartSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  correlationChart: {
    gap: 12,
  },
  correlationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  correlationMood: {
    fontSize: 24,
    width: 32,
  },
  correlationBar: {
    flex: 1,
    height: 32,
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
  },
  correlationBarFill: {
    height: '100%',
    borderRadius: 16,
  },
  correlationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    width: 48,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  insightCard: {
    backgroundColor: colors.highlight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  stepsChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: CHART_HEIGHT + 60,
    marginVertical: 20,
  },
  stepBarContainer: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  stepBar: {
    width: '70%',
    borderRadius: 8,
    minHeight: 4,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  stepValue: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  moodDistribution: {
    gap: 12,
    marginVertical: 16,
  },
  moodDistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moodDistEmoji: {
    fontSize: 24,
    width: 32,
  },
  moodDistBar: {
    flex: 1,
    height: 24,
    backgroundColor: colors.background,
    borderRadius: 12,
    overflow: 'hidden',
  },
  moodDistBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  moodDistCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    width: 32,
    textAlign: 'right',
  },
});
