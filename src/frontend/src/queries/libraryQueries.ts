import { useQuery } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';

export function useLibraryQueries() {
  const { actor, isFetching } = useActor();

  const briefs = useQuery({
    queryKey: ['library-briefs'],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listDailyBriefs();
      return result.sort((a, b) => Number(b[1].date - a[1].date));
    },
    enabled: !!actor && !isFetching,
  });

  const research = useQuery({
    queryKey: ['library-research'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listResearchItems();
    },
    enabled: !!actor && !isFetching,
  });

  const snapshots = useQuery({
    queryKey: ['library-snapshots'],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listPortfolioSnapshots();
      return result.sort((a, b) => Number(b[1].date - a[1].date));
    },
    enabled: !!actor && !isFetching,
  });

  return {
    briefs: briefs.data,
    research: research.data,
    snapshots: snapshots.data,
    isLoading: briefs.isLoading || research.isLoading || snapshots.isLoading,
  };
}
