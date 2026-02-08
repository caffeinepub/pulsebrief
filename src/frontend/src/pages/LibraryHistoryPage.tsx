import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Library, Lock } from 'lucide-react';
import { useLibraryQueries } from '@/queries/libraryQueries';
import { useProEntitlement } from '@/queries/entitlementQueries';
import { useRequirePrototypeSignIn } from '@/hooks/useRequirePrototypeSignIn';
import LoadingState from '@/components/states/LoadingState';
import { useNavigate } from '@tanstack/react-router';

export default function LibraryHistoryPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useRequirePrototypeSignIn();
  const { isPro, isLoading: proLoading } = useProEntitlement();
  const { briefs, research, snapshots, isLoading: libraryLoading } = useLibraryQueries();

  const isLoading = isSignedIn && (proLoading || (isPro && libraryLoading));

  if (isLoading) {
    return <LoadingState />;
  }

  // Logged-out state: informative empty state
  if (!isSignedIn) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Library & History</h1>
            <p className="text-muted-foreground">
              Your saved briefs, research, and portfolio snapshots
            </p>
          </div>
        </div>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
              <Library className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Library & History</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Access your saved market briefs, research items, and portfolio snapshots in one place.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Signed-in non-Pro state: locked state with upgrade CTA
  if (!isPro) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Library & History</h1>
            <p className="text-muted-foreground">
              Your saved briefs, research, and portfolio snapshots
            </p>
          </div>
        </div>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
              <Lock className="h-12 w-12 text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Upgrade to Pro</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  Save and access your market briefs, research, and portfolio history with PulseBrief Pro.
                </p>
                <Button size="lg">
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pro user state: show content (currently unreachable in practice)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Library & History</h1>
          <p className="text-muted-foreground">
            Your saved briefs, research, and portfolio snapshots
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Briefs</CardTitle>
            <CardDescription>{briefs?.length || 0} saved</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => navigate({ to: '/brief' })}>
              View Briefs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Research Items</CardTitle>
            <CardDescription>{research?.length || 0} saved</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => navigate({ to: '/research' })}>
              View Research
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Snapshots</CardTitle>
            <CardDescription>{snapshots?.length || 0} saved</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => navigate({ to: '/portfolio' })}>
              View Snapshots
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
