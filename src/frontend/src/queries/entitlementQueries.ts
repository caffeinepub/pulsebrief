import { useQuery } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';

export function useProEntitlement() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['pro-entitlement'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isProUser();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isPro: query.data ?? false,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
