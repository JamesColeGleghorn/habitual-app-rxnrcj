
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('wellness-reminders', {
        name: 'Wellness Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#29ABE2',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

export async function scheduleWellnessReminders() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Water reminder - every 2 hours
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Hydration Reminder',
        body: 'Time to drink a glass of water! Stay hydrated.',
        sound: 'default',
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60 * 60 * 2,
        repeats: true,
        channelId: 'wellness-reminders',
      },
    });

    // Bedtime reminder - 10 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌙 Bedtime Reminder',
        body: 'Consider winding down for better sleep. Aim for 7-8 hours.',
        sound: 'default',
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 22,
        minute: 0,
        repeats: true,
        channelId: 'wellness-reminders',
      },
    });

    // Stretch break - every 3 hours
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧘 Stretch Break',
        body: 'Time to stand up and stretch! Your posture will thank you.',
        sound: 'default',
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60 * 60 * 3,
        repeats: true,
        channelId: 'wellness-reminders',
      },
    });

    // Focus time - 10 AM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 Focus Time',
        body: 'Ready for a Pomodoro session? 25 minutes of focused work.',
        sound: 'default',
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 10,
        minute: 0,
        repeats: true,
        channelId: 'wellness-reminders',
      },
    });

    // Morning motivation - 7 AM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌅 Good Morning!',
        body: 'Start your day strong. Log your wellness activities today!',
        sound: 'default',
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 7,
        minute: 0,
        repeats: true,
        channelId: 'wellness-reminders',
      },
    });

    console.log('Wellness reminders scheduled successfully');
  } catch (error) {
    console.error('Error scheduling wellness reminders:', error);
  }
}

export async function cancelAllReminders() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All reminders cancelled');
  } catch (error) {
    console.error('Error cancelling reminders:', error);
  }
}
