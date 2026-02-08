// Sample LIVE Market Pulse updates for demo/not-signed-in mode

export const DEMO_MARKET_PULSE_UPDATES = [
  {
    id: BigInt(1),
    timestamp: BigInt(Date.now() * 1000000),
    updateText: `BREAKING
Bitcoin volatility spike: 4.2% intraday swing as whale wallets move $380M to exchanges. Liquidations accelerating across leveraged positions.

DEVELOPING
Fed officials signal potential pause in rate hikes. Market pricing in 65% probability of hold at next meeting. Risk assets rallying.

CONTEXT
Risk-off rotation intensifying: VIX up 18% to 22.4. Investors fleeing high-beta assets. Cash levels at 3-month highs.

IMPACT
Portfolio implications: High-beta crypto exposure vulnerable to further drawdowns. Consider reducing leverage and raising cash buffers.`,
  },
  {
    id: BigInt(2),
    timestamp: BigInt((Date.now() - 4 * 60 * 60 * 1000) * 1000000), // 4 hours ago
    updateText: `BREAKING
Ethereum network congestion hits 6-month high. Gas fees surge 180% as DeFi protocol exploit triggers mass exit attempts.

DEVELOPING
CPI data miss expectations: Core inflation drops to 3.8% vs 4.1% forecast. Treasury yields plunging. Dollar weakening sharply.

CONTEXT
Risk appetite returning: Equity put/call ratio drops to 0.68. Speculative positioning rebuilding. Leverage increasing across markets.

IMPACT
Trading strategy: Volatility spike creates opportunities for mean-reversion plays. Watch for oversold bounces in quality names.`,
  },
  {
    id: BigInt(3),
    timestamp: BigInt((Date.now() - 8 * 60 * 60 * 1000) * 1000000), // 8 hours ago
    updateText: `BREAKING
Major altcoin crash: SOL down 8.7% in 90 minutes following validator outage reports. Contagion spreading to ecosystem tokens.

DEVELOPING
Geopolitical tensions escalate: Oil spikes 3.2% on Middle East supply concerns. Safe-haven flows into gold and bonds intensifying.

CONTEXT
Flight to quality: Treasury demand surging. Gold up 1.8%. Crypto risk premium expanding. Defensive positioning dominant.

IMPACT
Risk management priority: Tighten stop-losses on leveraged positions. Elevated liquidation risk in current volatility regime.`,
  },
];
