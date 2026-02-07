import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { usePrototypeSession } from '@/state/usePrototypeSession';
import LandingPage from './LandingPage';

export default function RootPage() {
  const { email } = usePrototypeSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      navigate({ to: '/brief' });
    }
  }, [email, navigate]);

  if (email) {
    return null;
  }

  return <LandingPage />;
}
