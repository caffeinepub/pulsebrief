import { Button } from '@/components/ui/button';
import { Lock, BookMarked } from 'lucide-react';
import { usePrototypeSession } from '@/state/usePrototypeSession';
import { useNavigate } from '@tanstack/react-router';

export default function LibraryHistoryPage() {
  const { email } = usePrototypeSession();
  const navigate = useNavigate();
  const isPro = false; // All users are treated as non-Pro in prototype

  // Logged-out state: Show informative empty state
  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <BookMarked className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">Your Library</h3>
          <p className="text-sm text-muted-foreground mb-8 max-w-md">
            Save your daily briefs, track portfolio health over time, and build your personal market history.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              size="lg"
              onClick={() => navigate({ to: '/profile' })}
            >
              Sign in to access Library
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: '/library' })}
            >
              Upgrade to PulseBrief Pro
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Signed-in but not Pro: Show Pro-locked state
  if (!isPro) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Library</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            Your saved briefs and portfolio history will appear here.
          </p>
          <Button size="lg">
            Upgrade to PulseBrief Pro
          </Button>
        </div>
      </div>
    );
  }

  // Pro user UI would go here (currently unreachable)
  return null;
}
