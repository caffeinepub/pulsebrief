import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PrototypeSession {
  email: string | null;
  setEmail: (email: string) => void;
  clearEmail: () => void;
}

export const usePrototypeSession = create<PrototypeSession>()(
  persist(
    (set) => ({
      email: null,
      setEmail: (email) => set({ email }),
      clearEmail: () => set({ email: null }),
    }),
    {
      name: 'pulsebrief-session',
    }
  )
);
