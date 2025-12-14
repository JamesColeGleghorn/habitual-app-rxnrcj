
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useThemeColors } from '@/styles/commonStyles';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  value?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function CircularProgress({ 
  percentage, 
  size = 140, 
  strokeWidth = 12,
  color,
  label,
  value
}: CircularProgressProps) {
  const colors = useThemeColors();
  const progressColor = color || colors.primary;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [percentage, animatedValue]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const styles = createStyles(colors, size);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.textSecondary + '20'}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.textContainer}>
        {value ? (
          <>
            <Text style={styles.valueText}>{value}</Text>
            {label && <Text style={styles.labelText}>{label}</Text>}
          </>
        ) : (
          <>
            <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
            {label && <Text style={styles.labelText}>{label}</Text>}
          </>
        )}
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
  valueText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
});
