
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { useThemeColors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

interface PomodoroTimerProps {
  onComplete: () => void;
}

export function PomodoroTimer({ onComplete }: PomodoroTimerProps) {
  const colors = useThemeColors();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onComplete();
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Text>
      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleTimer} style={styles.button}>
          <IconSymbol
            ios_icon_name={isRunning ? 'pause.fill' : 'play.fill'}
            android_material_icon_name={isRunning ? 'pause' : 'play_arrow'}
            size={24}
            color={colors.card}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={resetTimer} style={[styles.button, styles.resetButton]}>
          <IconSymbol
            ios_icon_name="arrow.clockwise"
            android_material_icon_name="refresh"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.textSecondary + '40',
  },
});
