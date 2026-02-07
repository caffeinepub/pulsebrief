import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ScorePill from './ScorePill';

interface StandardScoreProps {
  label: string;
  score: number;
  max?: number;
  explanation: string;
}

export default function StandardScore({ label, score, max = 10, explanation }: StandardScoreProps) {
  // Ensure explanation is exactly one sentence (sanitize to single sentence)
  const sanitizeToOneSentence = (text: string): string => {
    // Split by sentence-ending punctuation and take first sentence
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const firstSentence = sentences[0]?.trim() || text.trim();
    // Ensure it ends with a period if it doesn't have ending punctuation
    return firstSentence.match(/[.!?]$/) ? firstSentence : firstSentence + '.';
  };

  const singleSentenceExplanation = sanitizeToOneSentence(explanation);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{label}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">{singleSentenceExplanation}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ScorePill score={score} max={max} />
      </div>
      <p className="text-xs text-muted-foreground">Why this score today: {singleSentenceExplanation}</p>
    </div>
  );
}
