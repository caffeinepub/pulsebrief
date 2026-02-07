import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';

export function useResearchQueries() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const researchItems = useQuery({
    queryKey: ['research'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listResearchItems();
    },
    enabled: !!actor && !isFetching,
  });

  const createResearchMutation = useMutation({
    mutationFn: async (data: {
      topic: string;
      summary: string;
      keyPoints: string[];
      risks: string[];
      catalysts: string[];
      score: bigint;
      justification: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createResearchItem(
        data.topic,
        data.summary,
        data.keyPoints,
        data.risks,
        data.catalysts,
        data.score,
        data.justification
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research'] });
    },
  });

  const saveResearchMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveResearchItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research'] });
    },
  });

  return {
    researchItems: researchItems.data,
    isLoading: researchItems.isLoading,
    createResearchMutation,
    saveResearchMutation,
  };
}
