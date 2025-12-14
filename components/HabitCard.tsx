
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { Habit } from '@/types/habit';
import { useThemeColors } from '@/styles/commonStyles';
import { isCompletedToday, getHabitStats } from '@/utils/habitStats';

interface HabitCardProps {
  habit: Habit;
  onToggle: () => void;
  onPress: () => void;
}

export function HabitCard({ habit, onToggle, onPress }: HabitCardProps) {
  const colors = useThemeColors();
  const completed = isCompletedToday(habit);
  const stats = getHabitStats(habit);

  const styles = createStyles(colors);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              completed && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
            onPress={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            activeOpacity={0.7}
          >
            {completed && (
              <IconSymbol
                ios_icon_name="checkmark"
                android_material_icon_name="check"
                size={20}
                color={colors.card}
              />
            )}
          </TouchableOpacity>
          
          <View style={styles.habitInfo}>
            <Text style={styles.habitName}>{habit.name}</Text>
            <View style={styles.streakContainer}>
              <IconSymbol
                ios_icon_name="flame.fill"
                android_material_icon_name="local_fire_department"
                size={16}
                color={stats.currentStreak > 0 ? colors.secondary : colors.textSecondary}
              />
              <Text style={[
                styles.streakText,
                stats.currentStreak > 0 && { color: colors.secondary }
              ]}>
                {stats.currentStreak} day streak
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.iconContainer}>
          <IconSymbol
            ios_icon_name={habit.icon}
            android_material_icon_name={habit.icon}
            size={24}
            color={habit.color}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
