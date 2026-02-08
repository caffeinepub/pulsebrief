// Deterministic, date-seeded daily brief generator
// Generates macro-themed content (rates, crypto sentiment, risk appetite)
// No live market data - static placeholder content only

interface DailyBriefContent {
  summary: string;
  keyDrivers: string[];
  watchNext: string[];
  riskCatalysts: Array<{ description: string; impact: string }>;
  bullishScore: number;
  volatilityScore: number;
  liquidityScore: number;
  signalNoiseScore: number;
}

interface YesterdayBrief {
  summary: string;
  keyDrivers: string[];
}

// Seed-based pseudo-random number generator for deterministic output
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

// Get day key from date (YYYY-MM-DD format)
export function getDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Convert day key to numeric seed
function dayKeyToSeed(dayKey: string): number {
  let hash = 0;
  for (let i = 0; i < dayKey.length; i++) {
    hash = ((hash << 5) - hash) + dayKey.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Content variants for different themes
const summaryVariants = [
  'Global markets navigating rate policy uncertainty with mixed sentiment across asset classes',
  'Risk appetite showing cautious optimism amid evolving central bank guidance',
  'Crypto markets consolidating as traditional assets digest macro developments',
  'Volatility elevated across markets as investors assess policy trajectory',
  'Markets balancing growth concerns against resilient economic data',
  'Liquidity conditions tightening as central banks maintain restrictive stance',
  'Sentiment fragile with investors monitoring rate expectations closely',
  'Risk-on momentum building despite persistent macro headwinds',
];

const keyDriverVariants = [
  ['Central bank policy signals driving rate expectations', 'Bitcoin testing key technical levels amid regulatory clarity', 'Equity markets digesting earnings and macro data'],
  ['Fed commentary influencing Treasury yields and dollar strength', 'Crypto sentiment improving on institutional adoption trends', 'Tech sector volatility reflecting valuation concerns'],
  ['Rate path uncertainty weighing on risk asset positioning', 'Digital asset markets consolidating after recent moves', 'Credit spreads widening on growth concerns'],
  ['Inflation data shaping policy outlook and market pricing', 'Crypto regulatory developments influencing sentiment', 'Equity valuations adjusting to higher-for-longer rates'],
  ['Global growth indicators mixed across major economies', 'Bitcoin correlation with risk assets remaining elevated', 'Sector rotation reflecting defensive positioning'],
  ['Monetary policy divergence creating cross-asset volatility', 'Crypto market structure evolving with ETF flows', 'Bond market pricing in extended restrictive policy'],
  ['Economic data surprising to the upside supporting sentiment', 'Digital asset liquidity improving across major pairs', 'Earnings season revealing margin pressure themes'],
  ['Geopolitical developments adding risk premium to markets', 'Crypto adoption metrics showing steady progress', 'Market breadth narrowing as leadership concentrates'],
];

const watchNextVariants = [
  ['Central bank meeting minutes and policy guidance', 'Key economic data releases (CPI, employment)', 'Major crypto exchange regulatory updates'],
  ['Fed speakers and rate path commentary', 'Corporate earnings from market leaders', 'Bitcoin ETF flow data and institutional activity'],
  ['Treasury auction results and yield curve dynamics', 'Crypto legislation progress in major jurisdictions', 'GDP and productivity data releases'],
  ['Inflation metrics and core price trends', 'Digital asset custody and infrastructure news', 'Credit market stress indicators'],
  ['Employment data and wage growth figures', 'Crypto market structure developments', 'Sector-specific earnings guidance'],
  ['Global PMI data and manufacturing trends', 'Bitcoin mining difficulty and hash rate', 'Central bank balance sheet changes'],
];

const riskCatalystVariants = [
  [
    { description: 'Central bank policy error risk', impact: 'High' },
    { description: 'Crypto regulatory uncertainty', impact: 'Medium' },
    { description: 'Geopolitical tensions escalating', impact: 'Medium' },
  ],
  [
    { description: 'Recession probability increasing', impact: 'High' },
    { description: 'Digital asset market liquidity stress', impact: 'Medium' },
    { description: 'Credit market deterioration', impact: 'High' },
  ],
  [
    { description: 'Inflation proving more persistent', impact: 'High' },
    { description: 'Crypto exchange counterparty risk', impact: 'Medium' },
    { description: 'Equity valuation compression', impact: 'Medium' },
  ],
  [
    { description: 'Rate volatility disrupting markets', impact: 'Medium' },
    { description: 'Regulatory crackdown on crypto', impact: 'High' },
    { description: 'Earnings disappointments spreading', impact: 'Medium' },
  ],
];

// Generate scores based on seed (0-10 range)
function generateScores(random: () => number) {
  return {
    bullishScore: Math.floor(random() * 5) + 4, // 4-8 range
    volatilityScore: Math.floor(random() * 5) + 4, // 4-8 range
    liquidityScore: Math.floor(random() * 5) + 4, // 4-8 range
    signalNoiseScore: Math.floor(random() * 5) + 4, // 4-8 range
  };
}

// Check if content collides with yesterday's
function hasCollision(
  todayContent: { summary: string; keyDrivers: string[] },
  yesterdayBrief?: YesterdayBrief
): boolean {
  if (!yesterdayBrief) return false;
  
  // Check summary collision
  if (todayContent.summary === yesterdayBrief.summary) return true;
  
  // Check if all 3 primary key drivers are identical (as a set)
  const todayDrivers = todayContent.keyDrivers.slice(0, 3).sort().join('|');
  const yesterdayDrivers = yesterdayBrief.keyDrivers.slice(0, 3).sort().join('|');
  if (todayDrivers === yesterdayDrivers) return true;
  
  return false;
}

// Generate daily brief with collision avoidance
export function generateDailyBrief(
  date: Date,
  yesterdayBrief?: YesterdayBrief
): DailyBriefContent {
  const dayKey = getDayKey(date);
  let baseSeed = dayKeyToSeed(dayKey);
  let variantOffset = 0;
  let content: DailyBriefContent;
  
  // Try up to 10 variants to avoid collision
  do {
    const seed = baseSeed + variantOffset;
    const random = seededRandom(seed);
    
    const summaryIdx = Math.floor(random() * summaryVariants.length);
    const keyDriverIdx = Math.floor(random() * keyDriverVariants.length);
    const watchNextIdx = Math.floor(random() * watchNextVariants.length);
    const riskCatalystIdx = Math.floor(random() * riskCatalystVariants.length);
    const scores = generateScores(random);
    
    content = {
      summary: summaryVariants[summaryIdx],
      keyDrivers: keyDriverVariants[keyDriverIdx],
      watchNext: watchNextVariants[watchNextIdx],
      riskCatalysts: riskCatalystVariants[riskCatalystIdx],
      ...scores,
    };
    
    // Check for collision
    if (!hasCollision(content, yesterdayBrief)) {
      break;
    }
    
    variantOffset++;
  } while (variantOffset < 10);
  
  return content;
}

// Convert generated content to backend format
export function toBriefMutationData(content: DailyBriefContent) {
  return {
    summary: content.summary,
    riskCatalysts: content.riskCatalysts.map((catalyst, idx) => [
      BigInt(idx + 1),
      catalyst.description,
      catalyst.impact,
    ]) as [bigint, string, string][],
    bullishScore: BigInt(content.bullishScore),
    volatilityScore: BigInt(content.volatilityScore),
    liquidityScore: BigInt(content.liquidityScore),
    signalNoiseScore: BigInt(content.signalNoiseScore),
    keyDrivers: content.keyDrivers,
    watchNext: content.watchNext,
  };
}
