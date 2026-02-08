import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radio, RefreshCw } from 'lucide-react';
import { useMarketPulseQueries } from '@/queries/marketPulseQueries';
import { toast } from 'sonner';
import LoadingState from '@/components/states/LoadingState';
import DemoStateIndicator from '@/components/common/DemoStateIndicator';
import { useRequirePrototypeSignIn } from '@/hooks/useRequirePrototypeSignIn';
import { useAutoCreateMarketPulse } from '@/hooks/useAutoCreateMarketPulse';
import { generateMarketPulse, formatMarketPulseUpdate, parseMarketPulseUpdate, areUpdatesIdentical } from '@/lib/marketPulseGenerator';
import MarketPulseUpdateCard from '@/components/marketPulse/MarketPulseUpdateCard';
import { DEMO_MARKET_PULSE_UPDATES } from '@/lib/marketPulseDemoContent';
import { Badge } from '@/components/ui/badge';

const MAX_RETRY_ATTEMPTS = 5;

export default function TodaysBriefPage() {
  const { isSignedIn } = useRequirePrototypeSignIn();
  const { updates, isLoading, createUpdateMutation } = useMarketPulseQueries(isSignedIn);
  const { isAutoCreating } = useAutoCreateMarketPulse(isSignedIn);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    // In demo mode, show info message
    if (!isSignedIn) {
      toast.info('Viewing sample content');
      return;
    }

    setIsGenerating(true);

    try {
      const latestUpdate = updates[0]?.[1];
      const previousUpdateText = latestUpdate?.updateText || '';
      const previousParsed = previousUpdateText ? parseMarketPulseUpdate(previousUpdateText) : undefined;

      let attempts = 0;
      let newUpdateText = '';
      let isUnique = false;

      // Bounded retry logic to avoid duplicates
      while (attempts < MAX_RETRY_ATTEMPTS && !isUnique) {
        const content = generateMarketPulse(new Date(Date.now() + attempts * 1000), previousParsed || undefined);
        newUpdateText = formatMarketPulseUpdate(content);
        
        // Check if different from previous
        if (!previousUpdateText || !areUpdatesIdentical(newUpdateText, previousUpdateText)) {
          isUnique = true;
        } else {
          attempts++;
        }
      }

      if (!isUnique) {
        toast.error('Unable to generate unique update. Please try again in a moment.');
        return;
      }

      await createUpdateMutation.mutateAsync({
        updateText: newUpdateText,
        previousUpdateText,
      });

      toast.success('Market pulse update generated successfully');
    } catch (error: any) {
      console.error('Failed to generate market pulse update:', error);
      if (error.message?.includes('must be new information')) {
        toast.error('Update must contain new information. Please try again.');
      } else {
        toast.error('Failed to generate update');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // In demo mode, use sample data; when signed in, use real data
  const displayUpdates = isSignedIn ? updates : DEMO_MARKET_PULSE_UPDATES.map((u, i) => [BigInt(i), u] as [bigint, typeof u]);

  if (isSignedIn && (isLoading || isAutoCreating)) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">LIVE Market Pulse</h1>
            {!isSignedIn && <DemoStateIndicator />}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-muted-foreground">
              Real-time market intelligence • Multiple updates daily
            </p>
            <Badge variant="outline" className="bg-pulse-live/10 text-pulse-live border-pulse-live/30">
              <Radio className="mr-1.5 h-3 w-3" />
              AI-Generated
            </Badge>
          </div>
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || createUpdateMutation.isPending}
          className="bg-pulse-urgent hover:bg-pulse-urgent/90"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${(isGenerating || createUpdateMutation.isPending) ? 'animate-spin' : ''}`} />
          {isGenerating || createUpdateMutation.isPending ? 'Generating...' : 'Generate Update'}
        </Button>
      </div>

      {/* Disclaimer */}
      <Card className="border-pulse-border bg-pulse-card/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5 bg-pulse-live/10 text-pulse-live border-pulse-live/30 shrink-0">
              AI
            </Badge>
            <p className="text-sm text-pulse-text leading-relaxed">
              <strong>AI-generated live market pulse</strong> based on real-time news interpretation, not price feeds. 
              This is informational content for awareness and context. Not financial advice.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Updates Feed */}
      <div className="space-y-4">
        {displayUpdates.length === 0 ? (
          <Card className="border-pulse-border">
            <CardHeader>
              <CardTitle>No updates yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate your first market pulse update to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          displayUpdates.map(([id, update]) => (
            <MarketPulseUpdateCard
              key={Number(id)}
              updateText={update.updateText}
              timestamp={update.timestamp}
            />
          ))
        )}
      </div>
    </div>
  );
}
