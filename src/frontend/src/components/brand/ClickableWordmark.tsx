import { useNavigate } from '@tanstack/react-router';
import Wordmark from './Wordmark';
import { cn } from '@/lib/utils';

interface ClickableWordmarkProps {
  size?: 'sm' | 'lg';
  className?: string;
}

export default function ClickableWordmark({ size = 'sm', className }: ClickableWordmarkProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate({ to: '/' })}
      className={cn(
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-sm transition-opacity hover:opacity-80',
        className
      )}
      aria-label="Return to PulseBrief home"
    >
      <Wordmark size={size} />
    </button>
  );
}
