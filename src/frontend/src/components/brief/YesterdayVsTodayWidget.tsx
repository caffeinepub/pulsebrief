import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import type { DailyBrief } from '@/backend';

interface YesterdayVsTodayWidgetProps {
  today?: DailyBrief;
  yesterday?: DailyBrief;
}

export default function YesterdayVsTodayWidget({ today, yesterday }: YesterdayVsTodayWidgetProps) {
  if (!today || !yesterday) {
    return (
      <Card className="opacity-60">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Yesterday vs Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">No previous brief to compare yet.</p>
        </CardContent>
      </Card>
    );
  }

  const comparisons = [
    {
      label: 'Bullish Score',
      today: Number(today.bullishScore),
      yesterday: Number(yesterday.bullishScore),
    },
    {
      label: 'Volatility',
      today: Number(today.volatilityScore),
      yesterday: Number(yesterday.volatilityScore),
    },
    {
      label: 'Liquidity',
      today: Number(today.liquidityScore),
      yesterday: Number(yesterday.liquidityScore),
    },
  ];

  return (
    <Card className="opacity-75">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">Yesterday vs Today</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {comparisons.map((comp) => {
            const delta = comp.today - comp.yesterday;
            const isUp = delta > 0;
            const isDown = delta < 0;
            const isFlat = delta === 0;

            return (
              <div key={comp.label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{comp.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comp.today}</span>
                  {isUp && (
                    <div className="flex items-center gap-1 text-green-500">
                      <ArrowUp className="h-3 w-3" />
                      <span className="text-xs">+{delta}</span>
                    </div>
                  )}
                  {isDown && (
                    <div className="flex items-center gap-1 text-destructive">
                      <ArrowDown className="h-3 w-3" />
                      <span className="text-xs">{delta}</span>
                    </div>
                  )}
                  {isFlat && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Minus className="h-3 w-3" />
                      <span className="text-xs">0</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
