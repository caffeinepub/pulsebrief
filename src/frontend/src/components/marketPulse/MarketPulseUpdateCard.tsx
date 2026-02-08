import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Info, Target } from 'lucide-react';
import { parseMarketPulseText } from './marketPulseParsing';

interface MarketPulseUpdateCardProps {
  updateText: string;
  timestamp: bigint;
}

export default function MarketPulseUpdateCard({ updateText, timestamp }: MarketPulseUpdateCardProps) {
  const parsed = parseMarketPulseText(updateText);
  
  if (!parsed) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Unable to parse update content</p>
        </CardContent>
      </Card>
    );
  }
  
  const date = new Date(Number(timestamp) / 1000000);
  const timeAgo = getTimeAgo(date);
  
  return (
    <Card className="border-pulse-border bg-pulse-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-pulse-timestamp uppercase tracking-wider">
            {timeAgo}
          </span>
          <span className="text-xs px-2 py-1 rounded bg-pulse-live text-pulse-live-text font-semibold uppercase tracking-wide">
            LIVE
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* BREAKING - Urgent red accent */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-pulse-urgent" />
            <h3 className="text-sm font-bold uppercase tracking-wide text-pulse-urgent">
              Breaking
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-pulse-text pl-6">
            {parsed.breaking}
          </p>
        </div>
        
        {/* DEVELOPING - Amber accent */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-pulse-developing" />
            <h3 className="text-sm font-bold uppercase tracking-wide text-pulse-developing">
              Developing
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-pulse-text pl-6">
            {parsed.developing}
          </p>
        </div>
        
        {/* CONTEXT - Info blue accent */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-pulse-context" />
            <h3 className="text-sm font-bold uppercase tracking-wide text-pulse-context">
              Context
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-pulse-text pl-6">
            {parsed.context}
          </p>
        </div>
        
        {/* IMPACT - Target accent */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-pulse-impact" />
            <h3 className="text-sm font-bold uppercase tracking-wide text-pulse-impact">
              Impact
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-pulse-text pl-6">
            {parsed.impact}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
