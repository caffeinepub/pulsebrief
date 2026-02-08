// Deterministic client-side Market Pulse generator
// Outputs English-only content structured into exactly four labeled sections:
// BREAKING, DEVELOPING, CONTEXT, IMPACT

interface MarketPulseContent {
  breaking: string;
  developing: string;
  context: string;
  impact: string;
}

interface PreviousUpdate {
  breaking?: string;
  developing?: string;
  context?: string;
  impact?: string;
}

// Seed-based pseudo-random number generator for deterministic output
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

// Breaking crypto moves templates
const BREAKING_TEMPLATES = [
  'Bitcoin volatility spike: 4.2% intraday swing as whale wallets move $380M to exchanges. Liquidations accelerating across leveraged positions.',
  'Ethereum network congestion hits 6-month high. Gas fees surge 180% as DeFi protocol exploit triggers mass exit attempts.',
  'Major altcoin crash: SOL down 8.7% in 90 minutes following validator outage reports. Contagion spreading to ecosystem tokens.',
  'Crypto market flash crash: $2.1B liquidated in 15 minutes. BTC briefly touches $41.2K before sharp recovery to $43.8K.',
  'Stablecoin depeg alert: USDC briefly trades at $0.97 amid banking sector rumors. Tether premium expanding to 1.8%.',
  'Bitcoin breaks key resistance at $45K. Volume surge suggests institutional accumulation. Short squeeze potential building.',
  'Crypto regulatory bombshell: SEC announces emergency enforcement action against major exchange. Market-wide selloff underway.',
  'DeFi protocol hack: $120M drained from lending platform. Smart contract vulnerability exploited. Contagion risk elevated.',
  'Bitcoin correlation to tech stocks breaks down. Crypto showing independent strength as equities slide 2.3%.',
  'Altcoin season signal: ETH/BTC ratio surges to 3-month high. Capital rotation from Bitcoin to high-beta alts accelerating.',
];

// Macro catalysts templates
const DEVELOPING_TEMPLATES = [
  'Fed officials signal potential pause in rate hikes. Market pricing in 65% probability of hold at next meeting. Risk assets rallying.',
  'CPI data miss expectations: Core inflation drops to 3.8% vs 4.1% forecast. Treasury yields plunging. Dollar weakening sharply.',
  'Geopolitical tensions escalate: Oil spikes 3.2% on Middle East supply concerns. Safe-haven flows into gold and bonds intensifying.',
  'Central bank divergence widens: ECB maintains hawkish stance while Fed hints at pivot. Currency volatility spiking across majors.',
  'Labor market cracks emerging: Jobless claims jump to 6-month high. Recession fears resurfacing. Growth stocks under pressure.',
  'Treasury auction weak: 10-year yields surge 12bps as foreign demand disappoints. Funding concerns re-emerging for risk assets.',
  'Banking sector stress: Regional bank stocks down 5.4% on deposit flight fears. Credit conditions tightening rapidly.',
  'China stimulus package announced: $280B infrastructure spending plan. Commodity currencies rallying. Risk-on sentiment building.',
  'Fed minutes reveal internal division on policy path. Uncertainty premium rising. Volatility indices jumping across asset classes.',
  'Dollar strength accelerating: DXY breaks above 105. Emerging market currencies under pressure. Carry trade unwind risk elevated.',
];

// Risk-on / risk-off shifts templates
const CONTEXT_TEMPLATES = [
  'Risk-off rotation intensifying: VIX up 18% to 22.4. Investors fleeing high-beta assets. Cash levels at 3-month highs.',
  'Risk appetite returning: Equity put/call ratio drops to 0.68. Speculative positioning rebuilding. Leverage increasing across markets.',
  'Flight to quality: Treasury demand surging. Gold up 1.8%. Crypto risk premium expanding. Defensive positioning dominant.',
  'Liquidity conditions deteriorating: Bid-ask spreads widening across crypto pairs. Market depth down 35% from monthly average.',
  'Sentiment extreme: Fear & Greed Index hits 18 (Extreme Fear). Contrarian buy signals emerging. Capitulation phase potentially near.',
  'Momentum shift confirmed: 50-day MA crosses above 200-day across major crypto assets. Technical breakout attracting systematic flows.',
  'Correlation breakdown: Traditional hedges failing. Bonds and gold both declining with equities. Portfolio protection challenging.',
  'Volatility regime change: Realized vol exceeds implied vol across tenors. Options market repricing tail risk higher.',
  'Credit spreads widening: High-yield OAS up 45bps this week. Risk premium expansion signaling caution across asset classes.',
  'Liquidity flush: Central bank balance sheets expanding. Money supply growth accelerating. Asset price inflation pressures building.',
];

// Impact assessment templates
const IMPACT_TEMPLATES = [
  'Portfolio implications: High-beta crypto exposure vulnerable to further drawdowns. Consider reducing leverage and raising cash buffers.',
  'Trading strategy: Volatility spike creates opportunities for mean-reversion plays. Watch for oversold bounces in quality names.',
  'Risk management priority: Tighten stop-losses on leveraged positions. Elevated liquidation risk in current volatility regime.',
  'Opportunity window: Dip-buying conditions emerging for long-term holders. Accumulation zone for patient capital.',
  'Defensive posture warranted: Shift allocation toward stablecoins and low-volatility assets until clarity emerges.',
  'Breakout confirmation needed: Wait for volume confirmation before adding to positions. False breakout risk elevated.',
  'Macro hedge required: Consider adding gold or Treasury exposure to offset crypto volatility. Portfolio balance critical.',
  'Momentum trade setup: Trend strength building. Consider scaling into positions with tight risk management.',
  'Liquidity trap warning: Avoid large position changes in thin markets. Slippage risk extreme. Use limit orders only.',
  'Regime shift in progress: Reassess portfolio construction assumptions. Historical correlations breaking down.',
];

function selectTemplate(templates: string[], seed: number, previousText?: string): string {
  const random = seededRandom(seed);
  let attempts = 0;
  const maxAttempts = templates.length;
  
  while (attempts < maxAttempts) {
    const index = Math.floor(random() * templates.length);
    const selected = templates[index];
    
    // Check if different from previous
    if (!previousText || selected !== previousText) {
      return selected;
    }
    attempts++;
  }
  
  // Fallback: return any template that's different
  return templates.find(t => t !== previousText) || templates[0];
}

export function generateMarketPulse(
  timestamp: Date,
  previousUpdate?: PreviousUpdate
): MarketPulseContent {
  // Use timestamp components for seeding to ensure different content per generation
  const seed = timestamp.getTime() + timestamp.getMilliseconds();
  
  const breaking = selectTemplate(BREAKING_TEMPLATES, seed, previousUpdate?.breaking);
  const developing = selectTemplate(DEVELOPING_TEMPLATES, seed + 1000, previousUpdate?.developing);
  const context = selectTemplate(CONTEXT_TEMPLATES, seed + 2000, previousUpdate?.context);
  const impact = selectTemplate(IMPACT_TEMPLATES, seed + 3000, previousUpdate?.impact);
  
  return {
    breaking,
    developing,
    context,
    impact,
  };
}

export function formatMarketPulseUpdate(content: MarketPulseContent): string {
  return `BREAKING
${content.breaking}

DEVELOPING
${content.developing}

CONTEXT
${content.context}

IMPACT
${content.impact}`;
}

export function parseMarketPulseUpdate(updateText: string): MarketPulseContent | null {
  const sections = updateText.split('\n\n');
  
  if (sections.length < 4) return null;
  
  const breaking = sections[0].replace('BREAKING\n', '').trim();
  const developing = sections[1].replace('DEVELOPING\n', '').trim();
  const context = sections[2].replace('CONTEXT\n', '').trim();
  const impact = sections[3].replace('IMPACT\n', '').trim();
  
  if (!breaking || !developing || !context || !impact) return null;
  
  return { breaking, developing, context, impact };
}

// Check if two updates are identical
export function areUpdatesIdentical(update1: string, update2: string): boolean {
  const parsed1 = parseMarketPulseUpdate(update1);
  const parsed2 = parseMarketPulseUpdate(update2);
  
  if (!parsed1 || !parsed2) return false;
  
  return (
    parsed1.breaking === parsed2.breaking &&
    parsed1.developing === parsed2.developing &&
    parsed1.context === parsed2.context &&
    parsed1.impact === parsed2.impact
  );
}
