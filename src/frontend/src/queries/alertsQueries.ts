import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';

const PREDEFINED_RULES = [
  { condition: 'High market risk', frequency: 'daily' },
  { condition: 'Rising volatility', frequency: 'daily' },
  { condition: 'Portfolio health deterioration', frequency: 'daily' },
];

export function useAlertsQueries() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const rules = useQuery({
    queryKey: ['alert-rules'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAlertRules();
    },
    enabled: !!actor && !isFetching,
  });

  const createRuleMutation = useMutation({
    mutationFn: async (data: { condition: string; frequency: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createAlertRule(data.condition, data.frequency);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-rules'] });
    },
  });

  const toggleRuleMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.toggleAlertRule(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-rules'] });
    },
  });

  const ensurePredefinedRules = async () => {
    if (!actor || !rules.data) return;

    const existingConditions = new Set(rules.data.map(([_, rule]) => rule.condition));

    for (const predefined of PREDEFINED_RULES) {
      if (!existingConditions.has(predefined.condition)) {
        try {
          await actor.createAlertRule(predefined.condition, predefined.frequency);
        } catch (error) {
          console.error('Failed to create predefined rule:', error);
        }
      }
    }

    if (rules.data.length !== PREDEFINED_RULES.length) {
      queryClient.invalidateQueries({ queryKey: ['alert-rules'] });
    }
  };

  return {
    rules: rules.data,
    isLoading: rules.isLoading,
    createRuleMutation,
    toggleRuleMutation,
    ensurePredefinedRules,
  };
}
