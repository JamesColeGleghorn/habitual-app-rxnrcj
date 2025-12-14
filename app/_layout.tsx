
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { requestNotificationPermissions, scheduleWellnessReminders } from '@/utils/notificationManager';
import { habitStorage } from '@/utils/habitStorage';

export default function RootLayout() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize notifications
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
          await scheduleWellnessReminders();
        }

        // Initialize default habits if none exist
        await habitStorage.initializeDefaultHabits();
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="modal" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen 
          name="formsheet" 
          options={{
            presentation: 'formSheet',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen 
          name="transparent-modal" 
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
