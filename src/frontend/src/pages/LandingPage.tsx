import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import ClickableWordmark from '@/components/brand/ClickableWordmark';
import Wordmark from '@/components/brand/Wordmark';
import DisclaimerBar from '@/components/compliance/DisclaimerBar';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <ClickableWordmark size="sm" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <Wordmark size="lg" className="mx-auto" />
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              Your daily market brief + portfolio health in one place.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Fast clarity. Signal over noise. Built for crypto & macro.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 h-auto"
              onClick={() => navigate({ to: '/brief' })}
            >
              View Today's Brief
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 h-auto"
              onClick={() => navigate({ to: '/portfolio' })}
            >
              Add Portfolio
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Clear Insights</h3>
              <p className="text-sm text-muted-foreground">
                Numeric scores with concise explanations. No fluff.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Risk Awareness</h3>
              <p className="text-sm text-muted-foreground">
                Portfolio health monitoring with proactive alerts.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">User Controlled</h3>
              <p className="text-sm text-muted-foreground">
                Your assets, allocations, and time horizons. Your rules.
              </p>
            </div>
          </div>
        </div>
      </main>

      <DisclaimerBar />
    </div>
  );
}
