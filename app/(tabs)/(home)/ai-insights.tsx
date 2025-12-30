
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { useHabits } from '@/hooks/useHabits';
import { useAIInsights } from '@/hooks/useAIInsights';
import { useThemeColors } from '@/styles/commonStyles';
import { HabitInsight, HabitSuggestion } from '@/types/aiInsights';

export default function AIInsightsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { habits } = useHabits();
  const { insights, patterns, suggestions, loading, dismissInsight } = useAIInsights(habits);

  const styles = createStyles(colors);

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: 48 }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Analyzing your habits...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: 48 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Insights</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Insights</Text>
          {insights.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol
                ios_icon_name="brain.head.profile"
                android_material_icon_name="psychology"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No insights yet</Text>
              <Text style={styles.emptySubtext}>
                Complete more habits to get personalized insights
              </Text>
            </View>
          ) : (
            <View style={styles.insightsList}>
              {insights.map((insight, index) => (
                <InsightCard
                  key={index}
                  insight={insight}
                  colors={colors}
                  onDismiss={() => dismissInsight(insight.id)}
                />
              ))}
            </View>
          )}
        </View>

        {patterns.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Patterns</Text>
            <View style={styles.patternsList}>
              {patterns.map((pattern, index) => (
                <View key={index} style={[styles.patternCard, { backgroundColor: colors.card }]}>
                  <Text style={[styles.patternTitle, { color: colors.text }]}>
                    {pattern.habitName}
                  </Text>
                  <View style={styles.patternDetail}>
                    <IconSymbol
                      ios_icon_name="calendar"
                      android_material_icon_name="calendar_today"
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={[styles.patternText, { color: colors.textSecondary }]}>
                      Best days: {pattern.bestDays.join(', ')}
                    </Text>
                  </View>
                  <View style={styles.patternDetail}>
                    <IconSymbol
                      ios_icon_name="chart.line.uptrend.xyaxis"
                      android_material_icon_name="trending_up"
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={[styles.patternText, { color: colors.textSecondary }]}>
                      Completion rate: {Math.round(pattern.averageCompletionRate)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {suggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Habits</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Based on your current habits and goals
            </Text>
            <View style={styles.suggestionsList}>
              {suggestions.map((suggestion, index) => (
                <SuggestionCard key={index} suggestion={suggestion} colors={colors} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function InsightCard({
  insight,
  colors,
  onDismiss,
}: {
  insight: HabitInsight;
  colors: ReturnType<typeof useThemeColors>;
  onDismiss: () => void;
}) {
  const getIconName = () => {
    switch (insight.type) {
      case 'achievement':
        return 'star.fill';
      case 'warning':
        return 'exclamationmark.triangle.fill';
      case 'tip':
        return 'lightbulb.fill';
      case 'pattern':
        return 'chart.line.uptrend.xyaxis';
      default:
        return 'info.circle.fill';
    }
  };

  return (
    <View style={[styles.insightCard, { backgroundColor: colors.card }]}>
      <View style={styles.insightHeader}>
        <View
          style={[
            styles.insightIconContainer,
            { backgroundColor: insight.color + '20' },
          ]}
        >
          <IconSymbol
            ios_icon_name={getIconName()}
            android_material_icon_name="info"
            size={24}
            color={insight.color}
          />
        </View>
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <IconSymbol
            ios_icon_name="xmark.circle.fill"
            android_material_icon_name="cancel"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.insightTitle, { color: colors.text }]}>
        {insight.title}
      </Text>
      <Text style={[styles.insightDescription, { color: colors.textSecondary }]}>
        {insight.description}
      </Text>
      {insight.actionable && insight.action && (
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: insight.color }]}>
          <Text style={styles.actionButtonText}>{insight.action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function SuggestionCard({
  suggestion,
  colors,
}: {
  suggestion: HabitSuggestion;
  colors: ReturnType<typeof useThemeColors>;
}) {
  const getDifficultyColor = () => {
    switch (suggestion.difficulty) {
      case 'easy':
        return '#27AE60';
      case 'medium':
        return '#F39C12';
      case 'hard':
        return '#E74C3C';
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={[styles.suggestionCard, { backgroundColor: colors.card }]}>
      <View style={styles.suggestionHeader}>
        <View
          style={[
            styles.suggestionIconContainer,
            { backgroundColor: suggestion.color + '20' },
          ]}
        >
          <IconSymbol
            ios_icon_name={suggestion.icon}
            android_material_icon_name="add_task"
            size={32}
            color={suggestion.color}
          />
        </View>
        <View style={styles.suggestionInfo}>
          <Text style={[styles.suggestionTitle, { color: colors.text }]}>
            {suggestion.name}
          </Text>
          <View style={styles.suggestionMeta}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor() + '20' },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor() },
                ]}
              >
                {suggestion.difficulty}
              </Text>
            </View>
            <Text style={[styles.timeText, { color: colors.textSecondary }]}>
              {suggestion.estimatedTime}
            </Text>
          </View>
        </View>
      </View>
      <Text style={[styles.suggestionReason, { color: colors.textSecondary }]}>
        {suggestion.reason}
      </Text>
      <View style={styles.benefitsList}>
        {suggestion.benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check_circle"
              size={16}
              color={colors.primary}
            />
            <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
              {benefit}
            </Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: suggestion.color }]}
      >
        <IconSymbol
          ios_icon_name="plus"
          android_material_icon_name="add"
          size={16}
          color="#FFFFFF"
        />
        <Text style={styles.addButtonText}>Add Habit</Text>
      </TouchableOpacity>
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
    section: {
      marginTop: 24,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    sectionSubtitle: {
      fontSize: 14,
      marginBottom: 16,
    },
    insightsList: {
      gap: 12,
    },
    insightCard: {
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    insightHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    insightIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dismissButton: {
      padding: 4,
    },
    insightTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 8,
    },
    insightDescription: {
      fontSize: 14,
      lineHeight: 20,
    },
    actionButton: {
      marginTop: 12,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    patternsList: {
      gap: 12,
    },
    patternCard: {
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    patternTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 12,
    },
    patternDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    patternText: {
      fontSize: 14,
    },
    suggestionsList: {
      gap: 16,
    },
    suggestionCard: {
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    suggestionHeader: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    suggestionIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    suggestionInfo: {
      flex: 1,
    },
    suggestionTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 8,
    },
    suggestionMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    difficultyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    difficultyText: {
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    timeText: {
      fontSize: 12,
    },
    suggestionReason: {
      fontSize: 14,
      marginBottom: 12,
      lineHeight: 20,
    },
    benefitsList: {
      gap: 8,
      marginBottom: 16,
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    benefitText: {
      fontSize: 13,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      borderRadius: 8,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
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
