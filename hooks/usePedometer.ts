
import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';

export function usePedometer() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: any = null;

    const initPedometer = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(isAvailable);

        if (isAvailable) {
          const end = new Date();
          const start = new Date();
          start.setHours(0, 0, 0, 0);

          try {
            const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
            if (pastStepCountResult) {
              setCurrentStepCount(pastStepCountResult.steps);
            }
          } catch (err) {
            console.error('Error getting past step count:', err);
          }

          subscription = Pedometer.watchStepCount(result => {
            if (result && typeof result.steps === 'number') {
              setCurrentStepCount(prev => prev + result.steps);
            }
          });
        }
      } catch (err) {
        console.error('Error initializing pedometer:', err);
        setError('Failed to initialize pedometer');
        setIsPedometerAvailable(false);
      }
    };

    initPedometer();

    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, []);

  return {
    isPedometerAvailable,
    currentStepCount,
    error,
  };
}
