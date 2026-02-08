# Specification

## Summary
**Goal:** Switch the app UI into “Feedback Mode” by using a single “Give Feedback” CTA that links to an external Google Form, while removing early-access and pricing copy from header/footer.

**Planned changes:**
- Replace any “Join Early Access” and/or email-capture UI elements with a single CTA labeled exactly “Give Feedback” across the app, without changing other features.
- Update the primary navigation “Give Feedback” CTA to open https://forms.gle/gQA8LJEqMBNJsooL6 in a new browser tab (no in-app feedback modal from the nav CTA).
- After the user initiates the feedback submission flow, show an in-app thank-you message exactly: “Thanks — your feedback helps shape what we build next.”
- Remove “Pro (£19/month) coming soon” from the footer and remove any other pricing mentions from the header and footer.

**User-visible outcome:** Users only see a “Give Feedback” CTA (no early-access/email capture), clicking it opens the Google Form in a new tab, a thank-you message is shown in-app after initiating feedback, and no pricing appears in the header or footer.
