import { useNavigate } from '@tanstack/react-router';
import { usePrototypeSession } from '@/state/usePrototypeSession';
import { toast } from 'sonner';

export function useRequirePrototypeSignIn() {
  const navigate = useNavigate();
  const { email } = usePrototypeSession();

  const requireSignIn = (action: string) => {
    if (!email) {
      toast.info(`Sign in required to ${action}`);
      navigate({ to: '/profile' });
      return false;
    }
    return true;
  };

  return {
    isSignedIn: !!email,
    requireSignIn,
  };
}
