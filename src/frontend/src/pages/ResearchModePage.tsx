import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Save } from 'lucide-react';
import { useResearchQueries } from '@/queries/researchQueries';
import { toast } from 'sonner';
import ScorePill from '@/components/common/ScorePill';
import LoadingState from '@/components/states/LoadingState';

const SEED_TOPICS = [
  'Bitcoin ETF Impact',
  'Fed Rate Policy',
  'AI Sector Growth',
  'Crypto Regulation',
  'DeFi Trends',
  'Geopolitical Risk',
];

export default function ResearchModePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { researchItems, isLoading, createResearchMutation, saveResearchMutation } = useResearchQueries();

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    
    const placeholderResearch = {
      topic,
      summary: `Comprehensive analysis of ${topic} and its market implications. Current trends suggest significant developments ahead with multiple catalysts on the horizon.`,
      keyPoints: [
        'Strong institutional interest driving momentum',
        'Regulatory clarity improving market conditions',
        'Technical indicators showing bullish divergence',
        'Correlation with traditional markets weakening',
      ],
      risks: [
        'Regulatory uncertainty in key jurisdictions',
        'Market volatility during transition periods',
        'Liquidity concerns in extreme scenarios',
      ],
      catalysts: [
        'Major institutional announcements expected',
        'Policy decisions from regulatory bodies',
        'Technical upgrades and network improvements',
      ],
      score: BigInt(7),
      justification: 'Strong fundamentals with manageable risks. Multiple positive catalysts offset near-term uncertainty. Favorable risk-reward profile for medium-term outlook.',
    };

    createResearchMutation.mutate(placeholderResearch, {
      onSuccess: () => {
        toast.success('Research generated successfully');
      },
      onError: () => {
        toast.error('Failed to generate research');
      },
    });
  };

  const handleSave = (id: bigint) => {
    saveResearchMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Saved to library');
      },
      onError: () => {
        toast.error('Failed to save');
      },
    });
  };

  const currentResearch = researchItems?.find(([_, item]) => item.topic === selectedTopic)?.[1];

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Research Mode</h1>
        <p className="text-muted-foreground">Deep dive into market topics and trends</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3">Popular Topics</h2>
        <div className="flex flex-wrap gap-2">
          {SEED_TOPICS.map((topic) => (
            <Badge
              key={topic}
              variant={selectedTopic === topic ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => handleTopicSelect(topic)}
            >
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      {currentResearch && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{currentResearch.topic}</CardTitle>
                    <CardDescription>Research Analysis</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSave(currentResearch.id)}
                    disabled={currentResearch.saved || saveResearchMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {currentResearch.saved ? 'Saved' : 'Save to Library'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-sm text-muted-foreground">{currentResearch.summary}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Key Points</h3>
                  <ul className="space-y-2">
                    {currentResearch.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Risks</h3>
                  <ul className="space-y-2">
                    {currentResearch.risks.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-destructive mt-1">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Catalysts</h3>
                  <ul className="space-y-2">
                    {currentResearch.catalysts.map((catalyst, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{catalyst}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Research Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center py-6">
                  <ScorePill score={Number(currentResearch.score)} max={10} size="lg" />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Justification</h4>
                  <p className="text-sm text-muted-foreground">{currentResearch.justification}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
