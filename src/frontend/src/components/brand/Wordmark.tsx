import { cn } from '@/lib/utils';

interface WordmarkProps {
  size?: 'sm' | 'lg';
  className?: string;
}

export default function Wordmark({ size = 'sm', className }: WordmarkProps) {
  return (
    <img
      src="/assets/generated/pulsebrief-wordmark.dim_1200x300.png"
      alt="PulseBrief"
      className={cn(
        'object-contain',
        size === 'sm' && 'h-8',
        size === 'lg' && 'h-16',
        className
      )}
    />
  );
}
