# `components/contact/ContactForm.tsx`

Client leaf component (`"use client"`) providing interactive inquiry submission for `/contact`.

### Features
- **Inquiry Topic Selection**: Interactive radio button chips covering 5 institutional categories (`Academic Fellowship`, `Research Collaboration`, `Curricula & Licensing`, `Press & Monographs`, `General Inquiry`).
- **Form Controls & Validation**:
  - Full Name (required)
  - Institutional Email (required, regex validated)
  - Organization / Institution (optional)
  - Academic / Professional Title (optional)
  - Proposal Overview (required, min 20 chars, live character counter up to 1000)
- **Accessibility**: Full WCAG 2.2 AA compliance with explicit labels, `aria-invalid`, `aria-describedby` linking error messages, and keyboard navigability.
- **Interactive Confirmation Receipt**:
  - Simulates transmission dispatch to the Academic Secretariat.
  - Generates an official reference identifier (`RIO-2026-XXXX`).
  - Displays routing email and 48-hour SLA notice.
  - Allows resetting the form to submit additional inquiries.
