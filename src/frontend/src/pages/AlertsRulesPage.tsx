import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { useAlertsQueries } from '@/queries/alertsQueries';
import { toast } from 'sonner';
import LoadingState from '@/components/states/LoadingState';

const PREDEFINED_RULES = [
  {
    condition: 'High market risk',
    frequency: 'daily',
    icon: AlertTriangle,
    description: 'Notifies you when overall market risk indicators exceed safe thresholds.',
  },
  {
    condition: 'Rising volatility',
    frequency: 'daily',
    icon: Activity,
    description: 'Alerts you when price swings intensify beyond normal trading ranges.',
  },
  {
    condition: 'Portfolio health deterioration',
    frequency: 'daily',
    icon: TrendingUp,
    description: 'Warns you when your portfolio health score drops significantly.',
  },
];

export default function AlertsRulesPage() {
  const { rules, isLoading, createRuleMutation, toggleRuleMutation, ensurePredefinedRules } = useAlertsQueries();

  useEffect(() => {
    if (rules && !isLoading) {
      ensurePredefinedRules();
    }
  }, [rules, isLoading, ensurePredefinedRules]);

  const handleToggle = (id: bigint) => {
    toggleRuleMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Alert rule updated');
      },
      onError: () => {
        toast.error('Failed to update rule');
      },
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  const getRuleStatus = (condition: string) => {
    const rule = rules?.find(([_, r]) => r.condition === condition);
    return rule ? { id: rule[0], active: rule[1].active } : null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alerts & Rules</h1>
        <p className="text-muted-foreground">Simple guardian-style monitoring toggles</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alert Rules</CardTitle>
          <CardDescription>Enable or disable alerts with a simple toggle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {PREDEFINED_RULES.map((rule) => {
            const status = getRuleStatus(rule.condition);
            const Icon = rule.icon;

            return (
              <div
                key={rule.condition}
                className="flex items-start justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{rule.condition}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                  </div>
                </div>
                <Switch
                  checked={status?.active || false}
                  onCheckedChange={() => status && handleToggle(status.id)}
                  disabled={!status}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Alerts Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            • Alerts are checked daily based on your portfolio and market conditions
          </p>
          <p>
            • You'll be notified when any enabled rule condition is met
          </p>
          <p>
            • Toggle rules on or off anytime to customize your monitoring
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
