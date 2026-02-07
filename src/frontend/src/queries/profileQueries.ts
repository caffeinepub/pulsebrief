import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';

export function useProfileQueries(email: string) {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const profile = useQuery({
    queryKey: ['profile', email],
    queryFn: async () => {
      if (!actor || !email) return null;
      return actor.getProfile(email);
    },
    enabled: !!actor && !isFetching && !!email,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { email: string; timeZone: string; topics: string[] }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateProfile(data.email, data.timeZone, data.topics);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    profile: profile.data,
    isLoading: profile.isLoading,
    updateProfileMutation,
  };
}
