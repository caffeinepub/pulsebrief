import { Heart } from 'lucide-react';

export default function DisclaimerBar() {
  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
            <p className="font-medium">
              Informational only. Not financial advice.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground/80">
              PulseBrief is in public preview. Some features are limited. Pro (£19/month) coming soon.
            </p>
          </div>
          <p className="flex items-center gap-1.5">
            © 2026. Built with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
