
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
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
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [percentage, animatedValue]);

  const styles = createStyles(colors, size);

  if (Platform.OS === 'web') {
    const progress = (percentage / 100) * circumference;
    const dashOffset = circumference - progress;

    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <svg width={size} height={size} style={{ position: 'absolute' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.textSecondary + '20'}
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
          <Text style={styles.labelText}>Complete</Text>
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

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[circleStyle, { borderColor: colors.textSecondary + '20' }]} />
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
        <Text style={styles.labelText}>Complete</Text>
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
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 4,
  },
});
