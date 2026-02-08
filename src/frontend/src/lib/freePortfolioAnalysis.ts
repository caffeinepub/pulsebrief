export interface FreeAsset {
  id: number;
  name: string;
  ticker: string;
  allocation: number;
  timeHorizon: string;
  averageEntryPrice?: number;
}

export interface FreePortfolioAnalysis {
  healthScore: number;
  risks: string[];
  opportunities: string[];
}

export function analyzeFreePortfolio(assets: FreeAsset[]): FreePortfolioAnalysis {
  if (assets.length === 0) {
    return {
      healthScore: 0,
      risks: ['No assets in portfolio'],
      opportunities: ['Add assets to begin analysis'],
    };
  }

  // Calculate total allocation
  const totalAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);

  // Simple health score calculation (placeholder logic)
  let healthScore = 50; // Base score

  // Bonus for diversification
  if (assets.length >= 2) healthScore += 15;
  if (assets.length === 3) healthScore += 10;

  // Penalty for over-allocation
  if (totalAllocation > 100) healthScore -= 20;

  // Bonus for proper allocation
  if (totalAllocation >= 80 && totalAllocation <= 100) healthScore += 15;

  // Clamp between 0-100
  healthScore = Math.max(0, Math.min(100, healthScore));

  // Generate risks
  const risks: string[] = [];
  if (totalAllocation > 100) {
    risks.push(`Over-allocated portfolio (${totalAllocation}% total)`);
  }
  if (totalAllocation < 50) {
    risks.push(`Under-allocated portfolio (${totalAllocation}% total)`);
  }
  if (assets.length === 1) {
    risks.push('Single asset concentration risk');
  }
  if (assets.length === 2) {
    risks.push('Limited diversification with only 2 assets');
  }

  // Check for high concentration in single asset
  const maxAllocation = Math.max(...assets.map(a => a.allocation));
  if (maxAllocation > 50) {
    risks.push(`High concentration in ${assets.find(a => a.allocation === maxAllocation)?.name} (${maxAllocation}%)`);
  }

  if (risks.length === 0) {
    risks.push('Monitor market conditions regularly');
  }

  // Generate opportunities
  const opportunities: string[] = [];
  if (assets.length < 3) {
    opportunities.push('Add more assets to improve diversification');
  }
  if (totalAllocation < 100) {
    opportunities.push(`Allocate remaining ${100 - totalAllocation}% to complete portfolio`);
  }
  opportunities.push('Consider time horizon alignment with market conditions');

  return {
    healthScore,
    risks,
    opportunities,
  };
}
