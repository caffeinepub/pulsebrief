import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingUp, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';
import { usePortfolioQueries } from '@/queries/portfolioQueries';
import { toast } from 'sonner';
import AssetEditor from '@/components/portfolio/AssetEditor';
import LoadingState from '@/components/states/LoadingState';
import StandardScore from '@/components/common/StandardScore';
import DemoStateIndicator from '@/components/common/DemoStateIndicator';
import { useRequirePrototypeSignIn } from '@/hooks/useRequirePrototypeSignIn';

// Sample demo data
const DEMO_SNAPSHOT = {
  date: BigInt(Date.now() * 1000000),
  assets: [
    {
      id: BigInt(1),
      name: 'Bitcoin',
      ticker: 'BTC',
      allocation: BigInt(40),
      timeHorizon: '2 years',
      averageEntryPrice: BigInt(4500000),
    },
    {
      id: BigInt(2),
      name: 'Ethereum',
      ticker: 'ETH',
      allocation: BigInt(25),
      timeHorizon: '2 years',
      averageEntryPrice: BigInt(280000),
    },
    {
      id: BigInt(3),
      name: 'Solana',
      ticker: 'SOL',
      allocation: BigInt(15),
      timeHorizon: '6 months',
      averageEntryPrice: null,
    },
  ],
  allocation: BigInt(80),
  healthScore: BigInt(72),
  risks: [
    'High concentration in crypto assets (80%)',
    'Correlation risk during market stress events',
    'Limited exposure to defensive assets',
  ],
  opportunities: [
    'Diversification into emerging DeFi protocols',
    'Rebalancing to capture mean reversion',
    'Adding macro hedges for tail risk protection',
  ],
};

export default function PortfolioPage() {
  const { isSignedIn, requireSignIn } = useRequirePrototypeSignIn();
  const { snapshots, isLoading, createSnapshotMutation } = usePortfolioQueries(isSignedIn);
  const [showEditor, setShowEditor] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const latestSnapshot = snapshots?.[0]?.[1];

  const handleRunAnalysis = () => {
    // In demo mode, prompt sign-in
    if (!requireSignIn('save a portfolio')) {
      return;
    }

    const placeholderAnalysis = {
      healthScore: BigInt(72),
      risks: [
        'High concentration in crypto assets (65%)',
        'Correlation risk during market stress events',
        'Limited exposure to defensive assets',
      ],
      opportunities: [
        'Diversification into emerging DeFi protocols',
        'Rebalancing to capture mean reversion',
        'Adding macro hedges for tail risk protection',
      ],
    };

    createSnapshotMutation.mutate(placeholderAnalysis, {
      onSuccess: () => {
        toast.success('Portfolio analysis complete');
        setAnalysis(placeholderAnalysis);
      },
      onError: () => {
        toast.error('Failed to run analysis');
      },
    });
  };

  const handleToggleEditor = () => {
    // In demo mode, prompt sign-in when trying to add assets
    if (!isSignedIn && !showEditor) {
      requireSignIn('save a portfolio');
      return;
    }
    setShowEditor(!showEditor);
  };

  if (isSignedIn && isLoading) {
    return <LoadingState />;
  }

  // In demo mode, use sample data; when signed in, use real data
  const displayData = isSignedIn ? (analysis || latestSnapshot) : DEMO_SNAPSHOT;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Portfolio Health Check</h1>
            {!isSignedIn && <DemoStateIndicator />}
          </div>
          <p className="text-muted-foreground">Simple summary of your portfolio status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleToggleEditor}>
            <Plus className="mr-2 h-4 w-4" />
            {showEditor ? 'Hide Editor' : isSignedIn ? 'Add Assets' : 'Sign In to Add'}
          </Button>
          <Button onClick={handleRunAnalysis} disabled={createSnapshotMutation.isPending}>
            <TrendingUp className="mr-2 h-4 w-4" />
            {createSnapshotMutation.isPending ? 'Analyzing...' : isSignedIn ? 'Run Health Check' : 'Sign In to Save'}
          </Button>
        </div>
      </div>

      {showEditor && isSignedIn && (
        <Card>
          <CardHeader>
            <CardTitle>Asset Editor</CardTitle>
            <CardDescription>Add and manage your portfolio assets</CardDescription>
          </CardHeader>
          <CardContent>
            <AssetEditor />
          </CardContent>
        </Card>
      )}

      {displayData && (
        <div className="space-y-6">
          {/* Main Portfolio Health Score (0-100) with Standardized Presentation */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Portfolio Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <StandardScore
                label="Overall Health"
                score={Number(displayData.healthScore)}
                max={100}
                explanation="Composite assessment of diversification, risk exposure, and portfolio balance."
              />
              <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Number(displayData.healthScore)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* 3 Short Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-base">Primary risk</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {displayData.risks[0] || 'No significant risks identified'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-base">Primary strength</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {displayData.opportunities[0] || 'Portfolio is well-positioned'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">What to monitor next</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {displayData.risks[1] || 'Monitor market conditions regularly'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Current Holdings */}
          {displayData.assets && displayData.assets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Current Holdings</CardTitle>
                <CardDescription>{displayData.assets.length} asset{displayData.assets.length !== 1 ? 's' : ''} in portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayData.assets.map((asset: any) => (
                    <div key={Number(asset.id)} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">{asset.ticker}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{Number(asset.allocation)}%</p>
                        <p className="text-xs text-muted-foreground">{asset.timeHorizon}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
