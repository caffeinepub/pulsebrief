import { ReactNode } from 'react';
import AppNav from './AppNav';
import DisclaimerBar from '../compliance/DisclaimerBar';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNav />
      <main className="flex-1 container mx-auto px-6 py-8">
        {children}
      </main>
      <DisclaimerBar />
    </div>
  );
}
