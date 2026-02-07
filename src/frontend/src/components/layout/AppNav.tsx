import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, Search, Bell, Library, User } from 'lucide-react';
import ClickableWordmark from '../brand/ClickableWordmark';
import { usePrototypeSession } from '@/state/usePrototypeSession';

const NAV_ITEMS = [
  { path: '/brief', label: 'Today\'s Brief', icon: FileText },
  { path: '/research', label: 'Research', icon: Search },
  { path: '/portfolio', label: 'Portfolio', icon: TrendingUp },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/library', label: 'Library', icon: Library },
];

export default function AppNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { email, clearEmail } = usePrototypeSession();
  const currentPath = routerState.location.pathname;

  const handleLogout = () => {
    clearEmail();
    navigate({ to: '/' });
  };

  return (
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
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

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/profile' })}
            >
              <User className="mr-2 h-4 w-4" />
              {email?.split('@')[0] || 'Profile'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
