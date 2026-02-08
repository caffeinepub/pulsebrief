import { useEffect, useRef } from 'react';
import { generateDailyBrief, getDayKey, toBriefMutationData } from '@/lib/dailyBriefGenerator';
import { useBriefQueries } from '@/queries/briefQueries';

// Hook to auto-create today's brief on page load (once per day)
export function useAutoCreateTodaysBrief(isSignedIn: boolean) {
  const { briefs, createBriefMutation } = useBriefQueries(isSignedIn);
  const hasAttemptedRef = useRef(false);
  
  useEffect(() => {
    // Only run for signed-in users
    if (!isSignedIn) return;
    
    // Only attempt once per mount
    if (hasAttemptedRef.current) return;
    
    // Wait for briefs to load
    if (!briefs) return;
    
    // Check if we already have a brief for today
    const now = new Date();
    const todayKey = getDayKey(now);
    
    const todayBrief = briefs.find(([_, brief]) => {
      const briefDate = new Date(Number(brief.date) / 1000000);
      return getDayKey(briefDate) === todayKey;
    });
    
    // If today's brief exists, no need to create
    if (todayBrief) {
      hasAttemptedRef.current = true;
      return;
    }
    
    // Get yesterday's brief for collision avoidance
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = getDayKey(yesterday);
    
    const yesterdayBrief = briefs.find(([_, brief]) => {
      const briefDate = new Date(Number(brief.date) / 1000000);
      return getDayKey(briefDate) === yesterdayKey;
    });
    
    const yesterdayContent = yesterdayBrief ? {
      summary: yesterdayBrief[1].summary,
      keyDrivers: yesterdayBrief[1].keyDrivers,
    } : undefined;
    
    // Generate and create today's brief
    hasAttemptedRef.current = true;
    const content = generateDailyBrief(now, yesterdayContent);
    const mutationData = toBriefMutationData(content);
    
    createBriefMutation.mutate(mutationData);
  }, [isSignedIn, briefs, createBriefMutation]);
  
  return {
    isAutoCreating: createBriefMutation.isPending && !hasAttemptedRef.current,
  };
}
