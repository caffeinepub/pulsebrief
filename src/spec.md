# Specification

## Summary
**Goal:** Let logged-out users access the Library route and see an informative empty state with sign-in and upgrade calls to action.

**Planned changes:**
- Update routing/guard behavior so unauthenticated users can navigate to `/library` without redirecting to `/profile`, while keeping the AppShell/header visible.
- In `frontend/src/pages/LibraryHistoryPage.tsx`, add a logged-out empty state with the exact provided title, description, and two CTAs (primary + visually subtle secondary).
- Wire CTAs to existing navigation: primary goes to `/profile`; secondary goes to an existing in-app route that already shows the Pro upgrade experience (no new page/route).
- Preserve the current signed-in, non-Pro locked Library empty state (including existing copy and Upgrade CTA behavior); only the logged-out state changes.

**User-visible outcome:** Logged-out users can open `/library` and see an informational Library screen with buttons to sign in or upgrade, while signed-in non-Pro users continue to see the existing Pro-locked Library message.
