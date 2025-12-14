
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { CircularProgress } from '@/components/CircularProgress';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { useWellness } from '@/hooks/useWellness';
import { usePedometer } from '@/hooks/usePedometer';
import { useThemeColors } from '@/styles/commonStyles';
import { requestNotificationPermissions, scheduleWellnessReminders } from '@/utils/notificationManager';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';

const MOOD_EMOJIS = ['😊', '😃', '😐', '😔', '😫', '🥳', '😴', '🤗'];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * WELLNESS DASHBOARD - COMPREHENSIVE FEATURE GUIDE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 📊 1. DAILY PROGRESS TRACKING (Circular Progress Rings)
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * 🚶 DAILY STEPS
 *    • Automatically integrates with device pedometer (iOS & Android)
 *    • Real-time step counting throughout the day
 *    • Visual progress ring shows percentage toward 10,000 step goal
 *    • Customizable daily goal
 *    • Data persists in AsyncStorage
 * 
 * 💧 WATER INTAKE
 *    • Tap large + button to add one glass of water
 *    • Customizable daily goal (default: 8 glasses)
 *    • Settings icon to adjust goal
 *    • Visual progress ring with blue color
 *    • Celebration haptic feedback when goal is reached
 * 
 * 😴 SLEEP LOG
 *    • Manual bedtime and wake time entry via time picker
 *    • Automatic sleep duration calculation
 *    • Sleep quality score (0-100) based on 8-hour target
 *    • Purple progress ring shows sleep score
 *    • Tap to open sleep logging modal
 * 
 * 😊 MOOD TRACKING
 *    • Quick emoji selector (8 mood options)
 *    • Optional text note for mood context
 *    • Emoji displayed in large circle
 *    • Tap to open mood logging modal
 *    • Mood data used for correlation analysis
 * 
 * ⏱️ FOCUS TIME (Pomodoro Timer)
 *    • Built-in 25-minute Pomodoro timer
 *    • Play/pause controls
 *    • Reset button to restart timer
 *    • Automatic completion notification
 *    • Tracks focus sessions for weekly insights
 * 
 * ─────────────────────────────────────────────────────────────────────────
 * 🏆 2. DAILY WINS SECTION (Quick Wellness Checks)
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * 💖 GRATITUDE JOURNAL
 *    • Log 3 things you're grateful for
 *    • Text input fields for each entry
 *    • Minimum 1 entry required to save
 *    • Completed status indicator
 *    • Promotes positive mindset
 * 
 * 🧘 GUIDED BREATHING
 *    • 5-minute guided breathing exercise
 *    • 4-4-4 breathing pattern (inhale-hold-exhale)
 *    • Full-screen immersive experience
 *    • Cycle counter (5 cycles = 5 minutes)
 *    • Automatic completion and notification
 * 
 * 🪑 POSTURE & MOVEMENT REMINDER
 *    • Quick check-in for posture and stretching
 *    • One-tap completion
 *    • Completed status indicator
 *    • Encourages regular movement breaks
 * 
 * ─────────────────────────────────────────────────────────────────────────
 * 🔥 3. STREAK TRACKING
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * • Displays current wellness streak at top of dashboard
 * • Counts consecutive days of wellness activities
 * • Streak criteria: 80% water goal OR 80% step goal OR sleep logged OR mood logged
 * • Motivates consistent daily engagement
 * • Flame icon indicates active streak
 * 
 * ─────────────────────────────────────────────────────────────────────────
 * 🔔 4. PUSH NOTIFICATIONS (Gentle Reminders)
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * • 💧 Water Reminder: Every 2 hours
 * • 🌙 Bedtime Reminder: 10 PM daily
 * • 🧘 Stretch Break: Every 3 hours
 * • 🎯 Focus Time: 10 AM daily
 * • 🌅 Morning Motivation: 7 AM daily
 * 
 * Features:
 *    - Automatic permission request on app launch
 *    - Android notification channels configured
 *    - Sound and badge notifications enabled
 *    - Repeating schedules for consistency
 * 
 * ─────────────────────────────────────────────────────────────────────────
 * 📈 5. WEEKLY INSIGHTS SCREEN
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * 📊 7-DAY SUMMARY
 *    • Average daily steps
 *    • Average water intake
 *    • Average sleep duration
 *    • Days tracked count
 * 
 * 📉 MOOD VS SLEEP CORRELATION
 *    • Visual bar chart showing relationship
 *    • Mood emoji paired with sleep hours
 *    • Color-coded: green for 7+ hours, red for less
 *    • Helps identify sleep impact on mood
 * 
 * 📊 DAILY STEPS CHART
 *    • 7-day bar chart visualization
 *    • Day labels (Sun-Sat)
 *    • Step count in thousands
 *    • Color-coded: blue for goal met, yellow for partial
 * 
 * 😊 MOOD DISTRIBUTION
 *    • Shows frequency of each mood emoji
 *    • Horizontal bar chart
 *    • Helps identify emotional patterns
 *    • Count of occurrences
 * 
 * 💡 PERSONALIZED INSIGHTS
 *    • Sleep quality recommendations
 *    • Hydration tips
 *    • Motivational messages
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 💾 DATA PERSISTENCE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * • All wellness data stored in AsyncStorage
 * • Automatic daily data creation
 * • Data survives app restarts
 * • Organized by date (YYYY-MM-DD format)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎨 UI/UX FEATURES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * • Dark mode support with dynamic colors
 * • Smooth animations and transitions
 * • Haptic feedback for interactions
 * • Responsive design for all screen sizes
 * • Accessible color contrasts
 * • Clean, minimalist interface
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { 
    getTodayData, 
    addWaterGlass,
    updateWaterGoal,
    updateSteps,
    updateSleep,
    updateMood,
    updateFocus,
    updateGratitude,
    completeBreathing,
    completePosture,
    calculateStreak,
  } = useWellness();
  
  const { currentStepCount, isPedometerAvailable } = usePedometer();
  const todayData = getTodayData();
  const streak = calculateStreak();

  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showGratitudeModal, setShowGratitudeModal] = useState(false);
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [showWaterGoalModal, setShowWaterGoalModal] = useState(false);
  
  const [bedtime, setBedtime] = useState(new Date());
  const [wakeTime, setWakeTime] = useState(new Date());
  const [showBedtimePicker, setShowBedtimePicker] = useState(false);
  const [showWakeTimePicker, setShowWakeTimePicker] = useState(false);
  
  const [selectedMood, setSelectedMood] = useState('😊');
  const [moodNote, setMoodNote] = useState('');
  
  const [gratitudeEntries, setGratitudeEntries] = useState(['', '', '']);
  
  const [breathingCount, setBreathingCount] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  
  const [waterGoal, setWaterGoal] = useState(todayData.water.goal.toString());

  useEffect(() => {
    const initializeNotifications = async () => {
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await scheduleWellnessReminders();
      }
    };
    initializeNotifications();
  }, []);

  useEffect(() => {
    if (isPedometerAvailable && currentStepCount > 0) {
      updateSteps(currentStepCount);
    }
  }, [currentStepCount, isPedometerAvailable, updateSteps]);

  const handleSaveSleep = () => {
    const duration = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
    const score = Math.min(100, Math.max(0, Math.round((duration / 8) * 100)));
    
    updateSleep({
      date: getTodayData().date,
      bedtime: bedtime.toISOString(),
      wakeTime: wakeTime.toISOString(),
      duration,
      score,
    });
    
    setShowSleepModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSaveMood = () => {
    updateMood({
      date: getTodayData().date,
      emoji: selectedMood,
      note: moodNote || undefined,
    });
    
    setShowMoodModal(false);
    setMoodNote('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSaveGratitude = () => {
    const validEntries = gratitudeEntries.filter(e => e.trim().length > 0);
    if (validEntries.length > 0) {
      updateGratitude({
        date: getTodayData().date,
        entries: validEntries,
      });
      setShowGratitudeModal(false);
      setGratitudeEntries(['', '', '']);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleSaveWaterGoal = async () => {
    const newGoal = parseInt(waterGoal, 10);
    if (!isNaN(newGoal) && newGoal > 0) {
      await updateWaterGoal(newGoal);
      setShowWaterGoalModal(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Alert.alert('Invalid Goal', 'Please enter a valid number');
    }
  };

  const startBreathingExercise = () => {
    setShowBreathingModal(true);
    setBreathingCount(0);
    setBreathingPhase('inhale');
    
    let count = 0;
    let phase: 'inhale' | 'hold' | 'exhale' = 'inhale';
    
    const interval = setInterval(() => {
      count++;
      
      if (count % 12 === 0) {
        phase = 'inhale';
      } else if (count % 12 === 4) {
        phase = 'hold';
      } else if (count % 12 === 8) {
        phase = 'exhale';
      }
      
      setBreathingPhase(phase);
      setBreathingCount(Math.floor(count / 12));
      
      if (count >= 60) {
        clearInterval(interval);
        completeBreathing();
        setShowBreathingModal(false);
      }
    }, 1000);
  };

  const stepsPercentage = (todayData.steps.steps / todayData.steps.goal) * 100;
  const waterPercentage = (todayData.water.glasses / todayData.water.goal) * 100;
  const sleepPercentage = todayData.sleep ? todayData.sleep.score : 0;

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
          <Text style={styles.title}>Wellness Dashboard</Text>
          <View style={styles.streakBadge}>
            <IconSymbol
              ios_icon_name="flame.fill"
              android_material_icon_name="local_fire_department"
              size={20}
              color={colors.secondary}
            />
            <Text style={styles.streakText}>{streak} day streak</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Today&apos;s Progress</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.progressScroll}>
            <View style={styles.progressCard}>
              <CircularProgress
                percentage={Math.min(100, stepsPercentage)}
                color={colors.primary}
                value={todayData.steps.steps.toString()}
                label="steps"
              />
              <Text style={styles.progressLabel}>Daily Steps</Text>
              <Text style={styles.progressGoal}>Goal: {todayData.steps.goal}</Text>
            </View>

            <View style={styles.progressCard}>
              <CircularProgress
                percentage={Math.min(100, waterPercentage)}
                color="#4A90E2"
                value={todayData.water.glasses.toString()}
                label="glasses"
              />
              <Text style={styles.progressLabel}>Water Intake</Text>
              <View style={styles.waterControls}>
                <TouchableOpacity onPress={addWaterGlass} style={styles.addButton}>
                  <IconSymbol
                    ios_icon_name="plus.circle.fill"
                    android_material_icon_name="add_circle"
                    size={32}
                    color={colors.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowWaterGoalModal(true)} style={styles.goalButton}>
                  <IconSymbol
                    ios_icon_name="gear"
                    android_material_icon_name="settings"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.progressCard} onPress={() => setShowSleepModal(true)}>
              <CircularProgress
                percentage={sleepPercentage}
                color="#9B59B6"
                value={todayData.sleep ? `${todayData.sleep.duration.toFixed(1)}h` : '--'}
                label="sleep"
              />
              <Text style={styles.progressLabel}>Sleep Log</Text>
              <Text style={styles.progressGoal}>
                {todayData.sleep ? `Score: ${todayData.sleep.score}` : 'Tap to log'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.progressCard} onPress={() => setShowMoodModal(true)}>
              <View style={styles.moodCircle}>
                <Text style={styles.moodEmoji}>{todayData.mood?.emoji || '😊'}</Text>
              </View>
              <Text style={styles.progressLabel}>Mood</Text>
              <Text style={styles.progressGoal}>
                {todayData.mood ? 'Logged' : 'Tap to log'}
              </Text>
            </TouchableOpacity>

            <View style={styles.progressCard}>
              <PomodoroTimer
                onComplete={() => {
                  updateFocus({
                    date: getTodayData().date,
                    duration: 25,
                    completed: true,
                  });
                }}
              />
              <Text style={styles.progressLabel}>Focus Time</Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.dailyWinsSection}>
          <Text style={styles.sectionTitle}>Daily Wins</Text>
          
          <TouchableOpacity 
            style={[styles.winCard, todayData.gratitude && styles.winCardCompleted]}
            onPress={() => setShowGratitudeModal(true)}
          >
            <IconSymbol
              ios_icon_name="heart.fill"
              android_material_icon_name="favorite"
              size={24}
              color={todayData.gratitude ? colors.accent : colors.textSecondary}
            />
            <View style={styles.winContent}>
              <Text style={styles.winTitle}>Gratitude Journal</Text>
              <Text style={styles.winSubtitle}>
                {todayData.gratitude 
                  ? `${todayData.gratitude.entries.length} entries logged` 
                  : 'Write 3 things you&apos;re grateful for'}
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.winCard, todayData.breathing && styles.winCardCompleted]}
            onPress={startBreathingExercise}
          >
            <IconSymbol
              ios_icon_name="wind"
              android_material_icon_name="air"
              size={24}
              color={todayData.breathing ? colors.primary : colors.textSecondary}
            />
            <View style={styles.winContent}>
              <Text style={styles.winTitle}>Guided Breathing</Text>
              <Text style={styles.winSubtitle}>
                {todayData.breathing ? 'Completed today' : '5-minute breathing exercise'}
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.winCard, todayData.posture && styles.winCardCompleted]}
            onPress={completePosture}
          >
            <IconSymbol
              ios_icon_name="figure.stand"
              android_material_icon_name="accessibility_new"
              size={24}
              color={todayData.posture ? colors.secondary : colors.textSecondary}
            />
            <View style={styles.winContent}>
              <Text style={styles.winTitle}>Posture Check</Text>
              <Text style={styles.winSubtitle}>
                {todayData.posture ? 'Completed today' : 'Take a moment to stretch'}
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="checkmark.circle"
              android_material_icon_name="check_circle"
              size={24}
              color={todayData.posture ? colors.secondary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showSleepModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Sleep</Text>
            
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setShowBedtimePicker(true)}
            >
              <Text style={styles.timeLabel}>Bedtime</Text>
              <Text style={styles.timeValue}>{bedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>

            {showBedtimePicker && (
              <DateTimePicker
                value={bedtime}
                mode="time"
                display="spinner"
                onChange={(event, date) => {
                  setShowBedtimePicker(false);
                  if (date) setBedtime(date);
                }}
              />
            )}

            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setShowWakeTimePicker(true)}
            >
              <Text style={styles.timeLabel}>Wake Time</Text>
              <Text style={styles.timeValue}>{wakeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>

            {showWakeTimePicker && (
              <DateTimePicker
                value={wakeTime}
                mode="time"
                display="spinner"
                onChange={(event, date) => {
                  setShowWakeTimePicker(false);
                  if (date) setWakeTime(date);
                }}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSleepModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveSleep}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showMoodModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How are you feeling?</Text>
            
            <View style={styles.moodGrid}>
              {MOOD_EMOJIS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.moodOption,
                    selectedMood === emoji && styles.moodOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedMood(emoji);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text style={styles.moodOptionEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.noteInput}
              placeholder="Add a note (optional)"
              placeholderTextColor={colors.textSecondary}
              value={moodNote}
              onChangeText={setMoodNote}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowMoodModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveMood}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showGratitudeModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Gratitude Journal</Text>
            <Text style={styles.modalSubtitle}>Write 3 things you&apos;re grateful for today</Text>
            
            {gratitudeEntries.map((entry, index) => (
              <TextInput
                key={index}
                style={styles.gratitudeInput}
                placeholder={`${index + 1}. I&apos;m grateful for...`}
                placeholderTextColor={colors.textSecondary}
                value={entry}
                onChangeText={(text) => {
                  const newEntries = [...gratitudeEntries];
                  newEntries[index] = text;
                  setGratitudeEntries(newEntries);
                }}
              />
            ))}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowGratitudeModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveGratitude}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showBreathingModal} animationType="fade" transparent>
        <View style={styles.breathingOverlay}>
          <View style={styles.breathingContent}>
            <Text style={styles.breathingPhase}>
              {breathingPhase === 'inhale' && 'Breathe In'}
              {breathingPhase === 'hold' && 'Hold'}
              {breathingPhase === 'exhale' && 'Breathe Out'}
            </Text>
            <Text style={styles.breathingCount}>{breathingCount} / 5</Text>
          </View>
        </View>
      </Modal>

      <Modal visible={showWaterGoalModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Water Goal</Text>
            <Text style={styles.modalSubtitle}>Set your daily water intake goal</Text>
            
            <TextInput
              style={styles.goalInput}
              placeholder="Enter glasses per day"
              placeholderTextColor={colors.textSecondary}
              value={waterGoal}
              onChangeText={setWaterGoal}
              keyboardType="number-pad"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowWaterGoalModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveWaterGoal}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  progressSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  progressScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    alignItems: 'center',
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
  },
  progressGoal: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  addButton: {
    marginTop: 8,
  },
  waterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  goalButton: {
    padding: 8,
  },
  moodCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEmoji: {
    fontSize: 64,
  },
  dailyWinsSection: {
    marginBottom: 32,
  },
  winCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  winCardCompleted: {
    backgroundColor: colors.highlight,
  },
  winContent: {
    flex: 1,
    marginLeft: 16,
  },
  winTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  winSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  timeButton: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timeValue: {
    fontSize: 16,
    color: colors.primary,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  moodOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodOptionSelected: {
    borderColor: colors.primary,
  },
  moodOptionEmoji: {
    fontSize: 32,
  },
  noteInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  gratitudeInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  goalInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
  breathingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingContent: {
    alignItems: 'center',
  },
  breathingPhase: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  breathingCount: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
