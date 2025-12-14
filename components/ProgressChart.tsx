
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useThemeColors } from '@/styles/commonStyles';

interface ProgressChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export function ProgressChart({ percentage, size = 120, strokeWidth = 12 }: ProgressChartProps) {
  const colors = useThemeColors();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;
  const dashOffset = circumference - progress;

  const styles = createStyles(colors, size);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <svg width={size} height={size} style={{ position: 'absolute' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.background}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.primary}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <View style={styles.textContainer}>
          <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
        </View>
      </View>
    );
  }

  const circleStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: strokeWidth,
  };

  const progressAngle = (percentage / 100) * 360;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[circleStyle, { borderColor: colors.background }]} />
      <View 
        style={[
          circleStyle, 
          { 
            borderColor: colors.primary,
            position: 'absolute',
            borderTopColor: percentage >= 25 ? colors.primary : 'transparent',
            borderRightColor: percentage >= 50 ? colors.primary : 'transparent',
            borderBottomColor: percentage >= 75 ? colors.primary : 'transparent',
            borderLeftColor: percentage >= 100 ? colors.primary : 'transparent',
            transform: [{ rotate: '-90deg' }]
          }
        ]} 
      />
      <View style={styles.textContainer}>
        <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>, size: number) => StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
});
