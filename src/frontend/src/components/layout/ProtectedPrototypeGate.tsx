import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { usePrototypeSession } from '@/state/usePrototypeSession';
import PrototypeSignInDialog from '../auth/PrototypeSignInDialog';

export default function ProtectedPrototypeGate({ children }: { children: ReactNode }) {
  const { email } = usePrototypeSession();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [showDialog, setShowDialog] = useState(false);
  const [lastPath, setLastPath] = useState('/');

  useEffect(() => {
    if (!email) {
      // Store the current path before redirecting
      setLastPath(routerState.location.pathname);
      // Default behavior: redirect to profile page
      navigate({ to: '/profile' });
      // Alternative: show modal (uncomment to enable modal mode)
      // setShowDialog(true);
    }
  }, [email, navigate, routerState.location.pathname]);

  const handleDismiss = () => {
    setShowDialog(false);
    // Return to the last non-modal route or home
    const fallbackPath = lastPath === '/profile' ? '/' : lastPath;
    navigate({ to: fallbackPath });
  };

  if (!email) {
    return (
      <>
        {showDialog && (
          <PrototypeSignInDialog
            open={showDialog}
            onOpenChange={setShowDialog}
            onDismiss={handleDismiss}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
}
