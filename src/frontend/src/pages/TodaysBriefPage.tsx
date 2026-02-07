import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useBriefQueries } from '@/queries/briefQueries';
import { toast } from 'sonner';
import StandardScore from '@/components/common/StandardScore';
import YesterdayVsTodayWidget from '@/components/brief/YesterdayVsTodayWidget';
import LoadingState from '@/components/states/LoadingState';
import EmptyState from '@/components/states/EmptyState';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import DemoStateIndicator from '@/components/common/DemoStateIndicator';
import { useRequirePrototypeSignIn } from '@/hooks/useRequirePrototypeSignIn';

// Sample demo data
const DEMO_BRIEF = {
  date: BigInt(Date.now() * 1000000),
  summary: 'Markets showing mixed signals with elevated volatility',
  riskScore: [
    { id: BigInt(1), description: 'Fed policy uncertainty', impact: 'High' },
    { id: BigInt(2), description: 'Geopolitical tensions', impact: 'Medium' },
    { id: BigInt(3), description: 'Crypto regulatory concerns', impact: 'Medium' },
  ],
  bullishScore: BigInt(6),
  volatilityScore: BigInt(7),
  liquidityScore: BigInt(5),
  signalNoiseScore: BigInt(6),
  keyDrivers: [
    'Federal Reserve maintaining hawkish stance on rates',
    'Bitcoin consolidating near key support levels',
    'Tech earnings season showing mixed results',
  ],
  watchNext: [
    'FOMC meeting minutes release',
    'Major crypto exchange regulatory developments',
    'Q4 GDP preliminary estimates',
  ],
};

export default function TodaysBriefPage() {
  const { isSignedIn, requireSignIn } = useRequirePrototypeSignIn();
  const { briefs, isLoading, createBriefMutation } = useBriefQueries(isSignedIn);
  const [currentBrief, setCurrentBrief] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const latestBrief = briefs?.[0]?.[1];
  const yesterdayBrief = briefs?.[1]?.[1];

  const handleGenerate = () => {
    // In demo mode, prompt sign-in
    if (!requireSignIn('generate a real daily brief')) {
      return;
    }

    const placeholderBrief = {
      summary: 'Markets showing mixed signals with elevated volatility',
      riskCatalysts: [
        [BigInt(1), 'Fed policy uncertainty', 'High'],
        [BigInt(2), 'Geopolitical tensions', 'Medium'],
        [BigInt(3), 'Crypto regulatory concerns', 'Medium'],
      ] as [bigint, string, string][],
      bullishScore: BigInt(6),
      volatilityScore: BigInt(7),
      liquidityScore: BigInt(5),
      signalNoiseScore: BigInt(6),
      keyDrivers: [
        'Federal Reserve maintaining hawkish stance on rates',
        'Bitcoin consolidating near key support levels',
        'Tech earnings season showing mixed results',
      ],
      watchNext: [
        'FOMC meeting minutes release',
        'Major crypto exchange regulatory developments',
        'Q4 GDP preliminary estimates',
      ],
    };

    createBriefMutation.mutate(placeholderBrief, {
      onSuccess: () => {
        toast.success('Today\'s brief generated successfully');
        setCurrentBrief(placeholderBrief);
      },
      onError: () => {
        toast.error('Failed to generate brief');
      },
    });
  };

  // In demo mode, use sample data; when signed in, use real data
  const displayBrief = isSignedIn ? (currentBrief || latestBrief) : DEMO_BRIEF;

  if (isSignedIn && isLoading) {
    return <LoadingState />;
  }

  if (isSignedIn && !displayBrief) {
    return (
      <EmptyState
        title="No brief available"
        description="Generate today's market brief to get started"
        action={
          <Button onClick={handleGenerate} disabled={createBriefMutation.isPending}>
            <Sparkles className="mr-2 h-4 w-4" />
            {createBriefMutation.isPending ? 'Generating...' : 'Generate Today\'s Brief'}
          </Button>
        }
      />
    );
  }

  const date = new Date(Number(displayBrief.date) / 1000000);

  // Truncate bullets to max 12 words
  const truncateToWords = (text: string, maxWords: number): string => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const keyBullets = displayBrief.keyDrivers.slice(0, 3).map((driver: string) => 
    truncateToWords(driver, 12)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Today's Brief</h1>
            {!isSignedIn && <DemoStateIndicator />}
          </div>
          <p className="text-muted-foreground">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Button onClick={handleGenerate} disabled={createBriefMutation.isPending}>
          <Sparkles className="mr-2 h-4 w-4" />
          {createBriefMutation.isPending ? 'Generating...' : isSignedIn ? 'Regenerate' : 'Sign In to Generate'}
        </Button>
      </div>

      {/* 60-Second Read - Primary Brief Module */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">What matters today</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Exactly 3 Bullet Points (max 12 words each) */}
          <div>
            <ul className="space-y-3">
              {keyBullets.map((bullet: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exactly 3 Scores (0-10) with one-line explanations */}
          <div className="space-y-4">
            <StandardScore
              label="Bullish/Bearish"
              score={Number(displayBrief.bullishScore)}
              explanation="Market sentiment based on price action and momentum signals."
            />
            <StandardScore
              label="Volatility"
              score={Number(displayBrief.volatilityScore)}
              explanation="Expected price movement intensity and market stress levels."
            />
            <StandardScore
              label="Liquidity"
              score={Number(displayBrief.liquidityScore)}
              explanation="Market depth and ease of executing trades without slippage."
            />
          </div>

          {/* Bottom Line - Single Short Paragraph */}
          <div>
            <h3 className="font-semibold mb-2">Bottom line</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {displayBrief.summary}. Focus on {displayBrief.watchNext[0]?.toLowerCase() || 'key market developments'} as the primary catalyst for today's session.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Yesterday vs Today Widget - De-emphasized (only show when signed in) */}
      {isSignedIn && <YesterdayVsTodayWidget today={displayBrief} yesterday={yesterdayBrief} />}

      {/* Detailed Content - Collapsed by Default */}
      <Collapsible open={showDetails} onOpenChange={setShowDetails}>
        <Card>
          <CardHeader>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                <CardTitle className="text-base">Additional Details</CardTitle>
                {showDetails ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Key Drivers</h4>
                  <div className="space-y-3">
                    {displayBrief.riskScore.map((catalyst: any, idx: number) => (
                      <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{catalyst.description}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          catalyst.impact === 'High' ? 'bg-destructive/20 text-destructive' :
                          catalyst.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-green-500/20 text-green-500'
                        }`}>
                          {catalyst.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">What to Watch Next</h4>
                  <ul className="space-y-2">
                    {displayBrief.watchNext.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
