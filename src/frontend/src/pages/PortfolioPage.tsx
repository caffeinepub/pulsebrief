import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingUp, AlertTriangle, CheckCircle2, Eye, Lock } from 'lucide-react';
import { usePortfolioQueries } from '@/queries/portfolioQueries';
import { toast } from 'sonner';
import AssetEditor from '@/components/portfolio/AssetEditor';
import FreeAssetEditor from '@/components/portfolio/FreeAssetEditor';
import LoadingState from '@/components/states/LoadingState';
import StandardScore from '@/components/common/StandardScore';
import DemoStateIndicator from '@/components/common/DemoStateIndicator';
import { useRequirePrototypeSignIn } from '@/hooks/useRequirePrototypeSignIn';
import { useProEntitlement } from '@/queries/entitlementQueries';
import { useNavigate } from '@tanstack/react-router';
import { analyzeFreePortfolio, type FreeAsset } from '@/lib/freePortfolioAnalysis';

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
  const navigate = useNavigate();
  const { isSignedIn } = useRequirePrototypeSignIn();
  const { isPro, isLoading: proLoading } = useProEntitlement();
  const { snapshots, isLoading: snapshotsLoading, createSnapshotMutation } = usePortfolioQueries(isSignedIn && isPro);
  
  const [showEditor, setShowEditor] = useState(false);
  const [freeAssets, setFreeAssets] = useState<FreeAsset[]>([]);
  const [freeAnalysis, setFreeAnalysis] = useState<ReturnType<typeof analyzeFreePortfolio> | null>(null);

  const latestSnapshot = snapshots?.[0];
  const isLoading = isSignedIn && (proLoading || (isPro && snapshotsLoading));

  const handleRunAnalysis = () => {
    // Logged out: show info
    if (!isSignedIn) {
      toast.info('Viewing sample portfolio');
      return;
    }

    // Free user: run local analysis
    if (!isPro) {
      if (freeAssets.length === 0) {
        toast.error('Add at least one asset to analyze');
        return;
      }
      const analysis = analyzeFreePortfolio(freeAssets);
      setFreeAnalysis(analysis);
      toast.success('Portfolio analysis complete');
      return;
    }

    // Pro user: create backend snapshot
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
        toast.success('Portfolio snapshot saved');
      },
      onError: (error: any) => {
        if (error?.message?.includes('Pro upgrade required')) {
          toast.error('Pro upgrade required to save portfolio');
        } else {
          toast.error('Failed to save portfolio snapshot');
        }
      },
    });
  };

  const handleToggleEditor = () => {
    if (!isSignedIn) {
      toast.info('Viewing sample portfolio');
      return;
    }
    setShowEditor(!showEditor);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  // Determine what data to display
  let displayData: any = null;
  
  if (!isSignedIn) {
    // Logged out: show demo
    displayData = DEMO_SNAPSHOT;
  } else if (!isPro) {
    // Free user: show local analysis or empty state
    if (freeAnalysis) {
      displayData = {
        assets: freeAssets.map(a => ({
          id: BigInt(a.id),
          name: a.name,
          ticker: a.ticker,
          allocation: BigInt(a.allocation),
          timeHorizon: a.timeHorizon,
          averageEntryPrice: a.averageEntryPrice ? BigInt(Math.floor(a.averageEntryPrice * 100)) : null,
        })),
        healthScore: BigInt(freeAnalysis.healthScore),
        risks: freeAnalysis.risks,
        opportunities: freeAnalysis.opportunities,
      };
    }
  } else {
    // Pro user: show latest snapshot
    displayData = latestSnapshot;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Portfolio Health Check</h1>
            {!isSignedIn && <DemoStateIndicator />}
          </div>
          <p className="text-muted-foreground">
            {!isSignedIn 
              ? 'Sample portfolio preview' 
              : !isPro 
                ? 'Analyze up to 3 assets (no saving or history)'
                : 'Track and save your portfolio over time'
            }
          </p>
        </div>
        <div className="flex gap-2">
          {isSignedIn && (
            <>
              <Button variant="outline" onClick={handleToggleEditor}>
                <Plus className="mr-2 h-4 w-4" />
                {showEditor ? 'Hide Editor' : isPro ? 'Add Assets' : 'Manage Assets'}
              </Button>
              <Button 
                onClick={handleRunAnalysis} 
                disabled={createSnapshotMutation.isPending}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                {createSnapshotMutation.isPending ? 'Analyzing...' : isPro ? 'Run & Save Health Check' : 'Run Health Check'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Free user upgrade prompt */}
      {isSignedIn && !isPro && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold mb-1">Upgrade to Pro</h3>
                  <p className="text-sm text-muted-foreground">
                    Save portfolios, track changes over time, and enable alerts
                  </p>
                </div>
              </div>
              <Button onClick={() => navigate({ to: '/library' })}>
                Upgrade to Pro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asset Editor */}
      {showEditor && isSignedIn && (
        <>
          {isPro ? (
            <Card>
              <CardHeader>
                <CardTitle>Asset Editor</CardTitle>
                <CardDescription>Add and manage your portfolio assets</CardDescription>
              </CardHeader>
              <CardContent>
                <AssetEditor />
              </CardContent>
            </Card>
          ) : (
            <FreeAssetEditor assets={freeAssets} onAssetsChange={setFreeAssets} />
          )}
        </>
      )}

      {/* Portfolio Analysis Display */}
      {displayData && (
        <div className="space-y-6">
          {/* Main Portfolio Health Score */}
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
                  <CardTitle className="text-base">Watch next</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {displayData.risks[1] || displayData.opportunities[1] || 'Monitor market conditions'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Assets List */}
          {displayData.assets && displayData.assets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayData.assets.map((asset: any) => (
                    <div
                      key={Number(asset.id)}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.ticker} • {asset.timeHorizon}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{Number(asset.allocation)}%</div>
                        {asset.averageEntryPrice && (
                          <div className="text-sm text-muted-foreground">
                            Entry: ${(Number(asset.averageEntryPrice) / 100).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Full Risk & Opportunity Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {displayData.risks.map((risk: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {displayData.opportunities.map((opp: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Empty state for free users */}
      {isSignedIn && !isPro && !freeAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>No Analysis Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add assets and run a health check to see your portfolio analysis.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
