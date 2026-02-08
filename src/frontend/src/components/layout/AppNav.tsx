import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Radio, TrendingUp, Search, Bell, Library, MessageSquare } from 'lucide-react';
import ClickableWordmark from '../brand/ClickableWordmark';
import { toast } from 'sonner';

const NAV_ITEMS = [
  { path: '/brief', label: 'LIVE Market Pulse', icon: Radio },
  { path: '/research', label: 'Research', icon: Search },
  { path: '/portfolio', label: 'Portfolio', icon: TrendingUp },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/library', label: 'Library', icon: Library },
];

const FEEDBACK_FORM_URL = 'https://forms.gle/gQA8LJEqMBNJsooL6';

export default function AppNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleFeedbackClick = () => {
    window.open(FEEDBACK_FORM_URL, '_blank', 'noopener,noreferrer');
    toast.success('Thanks — your feedback helps shape what we build next.');
  };

  return (
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <ClickableWordmark size="sm" />
          
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate({ to: item.path })}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFeedbackClick}
              className="font-semibold"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Give Feedback
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
