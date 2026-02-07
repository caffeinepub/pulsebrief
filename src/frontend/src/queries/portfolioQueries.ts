import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';

export function usePortfolioQueries(enabled: boolean = true) {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const snapshots = useQuery({
    queryKey: ['portfolio-snapshots'],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listPortfolioSnapshots();
      return result.sort((a, b) => Number(b[1].date - a[1].date));
    },
    enabled: enabled && !!actor && !isFetching,
  });

  const addAssetMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      ticker: string;
      allocation: bigint;
      timeHorizon: string;
      averageEntryPrice: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addAsset(
        data.name,
        data.ticker,
        data.allocation,
        data.timeHorizon,
        data.averageEntryPrice
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-snapshots'] });
    },
  });

  const createSnapshotMutation = useMutation({
    mutationFn: async (data: {
      healthScore: bigint;
      risks: string[];
      opportunities: string[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createPortfolioSnapshot(
        data.healthScore,
        data.risks,
        data.opportunities
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-snapshots'] });
    },
  });

  return {
    snapshots: snapshots.data,
    isLoading: snapshots.isLoading,
    addAssetMutation,
    createSnapshotMutation,
  };
}
