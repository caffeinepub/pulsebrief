import { cn } from '@/lib/utils';

interface ScorePillProps {
  score: number;
  max: number;
  size?: 'sm' | 'default' | 'lg';
}

export default function ScorePill({ score, max, size = 'default' }: ScorePillProps) {
  const percentage = (score / max) * 100;
  
  const getColor = () => {
    if (percentage >= 70) return 'bg-green-500/20 text-green-500 border-green-500/30';
    if (percentage >= 40) return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    return 'bg-destructive/20 text-destructive border-destructive/30';
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-full border',
        getColor(),
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'default' && 'px-3 py-1 text-sm',
        size === 'lg' && 'px-6 py-3 text-3xl'
      )}
    >
      {score}/{max}
    </div>
  );
}
