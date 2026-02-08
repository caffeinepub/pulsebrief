import { useNavigate } from '@tanstack/react-router';
import { usePrototypeSession } from '@/state/usePrototypeSession';

export function useRequirePrototypeSignIn() {
  const navigate = useNavigate();
  const { email } = usePrototypeSession();

  const requireSignIn = (action: string) => {
    if (!email) {
      // In feedback mode, no sign-in prompts
      return false;
    }
    return true;
  };

  return {
    isSignedIn: !!email,
    requireSignIn,
  };
}
