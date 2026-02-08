import { useEffect, useRef } from 'react';
import { useMarketPulseQueries } from '@/queries/marketPulseQueries';
import { generateMarketPulse, formatMarketPulseUpdate, parseMarketPulseUpdate } from '@/lib/marketPulseGenerator';

const UPDATE_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours
const MIN_TIME_BETWEEN_UPDATES_MS = 2 * 60 * 60 * 1000; // 2 hours minimum

export function useAutoCreateMarketPulse(enabled: boolean) {
  const { updates, createUpdateMutation } = useMarketPulseQueries(enabled);
  const lastCheckRef = useRef<number>(0);
  const isCreatingRef = useRef(false);

  useEffect(() => {
    if (!enabled || isCreatingRef.current) return;

    const checkAndCreate = () => {
      const now = Date.now();
      
      // Prevent rapid repeat attempts
      if (now - lastCheckRef.current < 60000) return; // 1 minute cooldown
      lastCheckRef.current = now;

      // Get most recent update
      const latestUpdate = updates[0]?.[1];
      
      if (!latestUpdate) {
        // No updates exist, create first one
        createFirstUpdate();
        return;
      }

      const lastUpdateTime = Number(latestUpdate.timestamp) / 1000000;
      const timeSinceLastUpdate = now - lastUpdateTime;

      // Check if enough time has passed for a new update
      if (timeSinceLastUpdate >= UPDATE_INTERVAL_MS) {
        createNewUpdate(latestUpdate.updateText);
      }
    };

    const createFirstUpdate = async () => {
      if (isCreatingRef.current) return;
      isCreatingRef.current = true;

      try {
        const content = generateMarketPulse(new Date());
        const updateText = formatMarketPulseUpdate(content);
        
        await createUpdateMutation.mutateAsync({
          updateText,
          previousUpdateText: '',
        });
      } catch (error) {
        console.error('Failed to create first market pulse update:', error);
      } finally {
        isCreatingRef.current = false;
      }
    };

    const createNewUpdate = async (previousUpdateText: string) => {
      if (isCreatingRef.current) return;
      isCreatingRef.current = true;

      try {
        const previousParsed = parseMarketPulseUpdate(previousUpdateText);
        const content = generateMarketPulse(new Date(), previousParsed || undefined);
        const updateText = formatMarketPulseUpdate(content);
        
        // Verify it's different from previous
        if (updateText === previousUpdateText) {
          console.warn('Generated identical update, skipping');
          return;
        }

        await createUpdateMutation.mutateAsync({
          updateText,
          previousUpdateText,
        });
      } catch (error) {
        console.error('Failed to create market pulse update:', error);
      } finally {
        isCreatingRef.current = false;
      }
    };

    // Check immediately on mount
    checkAndCreate();

    // Set up interval for periodic checks
    const intervalId = setInterval(checkAndCreate, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [enabled, updates, createUpdateMutation]);

  return {
    isAutoCreating: isCreatingRef.current,
  };
}
