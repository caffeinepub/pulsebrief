import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';

export function useBriefQueries(enabled: boolean = true) {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const briefs = useQuery({
    queryKey: ['briefs'],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listDailyBriefs();
      return result.sort((a, b) => Number(b[1].date - a[1].date));
    },
    enabled: enabled && !!actor && !isFetching,
  });

  const todaysBrief = useQuery({
    queryKey: ['todaysBrief'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTodaysBrief();
    },
    enabled: enabled && !!actor && !isFetching,
  });

  const createBriefMutation = useMutation({
    mutationFn: async (data: {
      summary: string;
      riskCatalysts: [bigint, string, string][];
      bullishScore: bigint;
      volatilityScore: bigint;
      liquidityScore: bigint;
      signalNoiseScore: bigint;
      keyDrivers: string[];
      watchNext: string[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createDailyBrief(
        data.summary,
        data.riskCatalysts,
        data.bullishScore,
        data.volatilityScore,
        data.liquidityScore,
        data.signalNoiseScore,
        data.keyDrivers,
        data.watchNext
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefs'] });
      queryClient.invalidateQueries({ queryKey: ['todaysBrief'] });
    },
  });

  return {
    briefs: briefs.data,
    todaysBrief: todaysBrief.data,
    isLoading: briefs.isLoading,
    createBriefMutation,
  };
}
