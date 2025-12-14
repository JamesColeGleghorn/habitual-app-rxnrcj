
import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';

export function usePedometer() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [pastStepCount, setPastStepCount] = useState(0);

  useEffect(() => {
    let subscription: any;

    const subscribe = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(isAvailable);

        if (isAvailable) {
          const end = new Date();
          const start = new Date();
          start.setHours(0, 0, 0, 0);

          const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
          if (pastStepCountResult) {
            setPastStepCount(pastStepCountResult.steps);
            setCurrentStepCount(pastStepCountResult.steps);
          }

          subscription = Pedometer.watchStepCount(result => {
            setCurrentStepCount(result.steps);
          });
        }
      } catch (error) {
        console.error('Error setting up pedometer:', error);
        setIsPedometerAvailable(false);
      }
    };

    subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return {
    isPedometerAvailable,
    currentStepCount,
    pastStepCount,
  };
}
