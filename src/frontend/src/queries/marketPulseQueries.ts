import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import type { MarketPulseUpdate } from '@/backend';

export function useMarketPulseQueries(enabled: boolean = true) {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const updates = useQuery({
    queryKey: ['marketPulseUpdates'],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listMarketPulseUpdates();
      // Sort by timestamp descending (most recent first)
      return result.sort((a, b) => Number(b[1].timestamp - a[1].timestamp));
    },
    enabled: !!actor && !isFetching && enabled,
  });

  const createUpdateMutation = useMutation({
    mutationFn: async ({ updateText, previousUpdateText }: { updateText: string; previousUpdateText: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createMarketPulseUpdate(updateText, previousUpdateText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketPulseUpdates'] });
    },
  });

  return {
    updates: updates.data || [],
    isLoading: updates.isLoading,
    createUpdateMutation,
  };
}
