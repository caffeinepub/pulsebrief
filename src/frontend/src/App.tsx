import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import RootPage from './pages/RootPage';
import ProfilePage from './pages/ProfilePage';
import TodaysBriefPage from './pages/TodaysBriefPage';
import ResearchModePage from './pages/ResearchModePage';
import PortfolioPage from './pages/PortfolioPage';
import AlertsRulesPage from './pages/AlertsRulesPage';
import LibraryHistoryPage from './pages/LibraryHistoryPage';
import AppShell from './components/layout/AppShell';
import ProtectedPrototypeGate from './components/layout/ProtectedPrototypeGate';

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Outlet />
      <Toaster />
    </ThemeProvider>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RootPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

// Public app routes (accessible without sign-in)
const publicAppRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public-app',
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});

const todaysBriefRoute = createRoute({
  getParentRoute: () => publicAppRoute,
  path: '/brief',
  component: TodaysBriefPage,
});

const portfolioRoute = createRoute({
  getParentRoute: () => publicAppRoute,
  path: '/portfolio',
  component: PortfolioPage,
});

const libraryRoute = createRoute({
  getParentRoute: () => publicAppRoute,
  path: '/library',
  component: LibraryHistoryPage,
});

// Protected routes (require sign-in)
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: () => (
    <ProtectedPrototypeGate>
      <AppShell>
        <Outlet />
      </AppShell>
    </ProtectedPrototypeGate>
  ),
});

const researchRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/research',
  component: ResearchModePage,
});

const alertsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/alerts',
  component: AlertsRulesPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  profileRoute,
  publicAppRoute.addChildren([
    todaysBriefRoute,
    portfolioRoute,
    libraryRoute,
  ]),
  protectedRoute.addChildren([
    researchRoute,
    alertsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
