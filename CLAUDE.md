# Riostak — Development & Engineering Guidelines

This document outlines the architectural standards, code quality requirements, engineering principles, and design system rules for the **Riostak** project. All contributors and AI assistants must strictly adhere to these guidelines.

---

## Table of Contents

1. [Development Commands](#1-development-commands)
2. [Project Architecture & Modularization](#2-project-architecture--modularization)
3. [Documentation Standards](#3-documentation-standards)
4. [Core Engineering Principles](#4-core-engineering-principles)
5. [React 19 Engineering Standards](#5-react-19-engineering-standards)
6. [Next.js App Router Standards](#6-nextjs-app-router-standards)
7. [UI/UX Quality Standards](#7-uiux-quality-standards)
8. [Comprehensive UI States](#8-comprehensive-ui-states)
9. [Accessibility (WCAG 2.2 AA) Standards](#9-accessibility-wcag-22-aa-standards)
10. [Verification & Quality Assurance](#10-verification--quality-assurance)

---

## 1. Development Commands

Execute standard package scripts using `npm`:

```bash
# Start local development server (with Turbopack)
npm run dev

# Run ESLint to verify code quality
npm run lint

# Create production build
npm run build

# Start production server
npm run start
```

---

## 2. Project Architecture & Modularization

The codebase must follow a modular, feature-oriented structure. Maintain clear separation of concerns, reusable components, and predictable organization across the following hierarchy:

```
riostak/
├── app/                        # Next.js App Router (pages, layouts, route handlers)
│   ├── favicon.ico             # Application favicon
│   ├── globals.css             # Global Tailwind & design token stylesheet
│   ├── layout.tsx              # Root application layout
│   └── page.tsx                # Home / Landing page entrypoint
├── components/                 # Reusable React components
│   ├── Header.tsx              # Global site navigation
│   ├── Footer.tsx              # Global site footer
│   └── landingPage/            # Section-specific components for the landing page
│       ├── Hero.tsx
│       ├── Section1.tsx
│       ├── Section2.tsx
│       ├── Section3.tsx
│       └── ...
├── docs/                       # Architectural and component documentation (mirrors code)
│   ├── app/
│   │   ├── layout.md
│   │   ├── page.md
│   │   ├── globals.md
│   │   └── favicon.md
│   └── components/
│       └── landingPage/
│           ├── Hero.md
│           ├── Section1.md
│           ├── Section2.md
│           ├── Section3.md
│           └── ...
├── public/                     # Static assets (images, icons, fonts)
└── utils/                      # Shared helper functions, validators, and constants
```

### Modularization Rules

- **Component Isolation:** Place high-level, globally reused components in `components/` (e.g., `Header.tsx`, `Footer.tsx`). Place page-specific sections in dedicated subdirectories (e.g., `components/landingPage/`).
- **Separation of Concerns:** Keep routing logic in `app/`, visual and interactive logic in `components/`, and business logic/utilities in `utils/`.
- **Naming Conventions:** Use PascalCase for component files (`Hero.tsx`, `Footer.tsx`) and kebab-case or standard Next.js conventions for route segments (`page.tsx`, `layout.tsx`).

---

## 3. Documentation Standards

Documentation is a first-class citizen and must be maintained in sync with the codebase.

- **Mirror Documentation:** Every major component, page, layout, and style definition must have a corresponding documentation file in `docs/` matching its path.
- **Continuous Updates:** Whenever code is created, refactored, or updated, the relevant documentation in `docs/` must be updated concurrently.
- **Code Comments:** Add clear, concise comments where necessary to explain *why* non-obvious logic exists. Avoid redundant comments that merely restate self-evident code.
- **Document Rationale:** Document architectural decisions, state machines, complex prop contracts, and external API dependencies.

---

## 4. Core Engineering Principles

Your responsibility is to deliver production-ready software that is correct, maintainable, accessible, secure, performant, and visually polished.

- **Correctness over Cleverness:** Write clear, robust code rather than obscure one-liners or premature optimizations.
- **Simplicity over Unnecessary Abstraction:** Do not invent frameworks or helper wrappers until tangible duplication requires it.
- **Readability over Compressed Code:** Prioritize long-term readability and ease of debugging over terse syntax.
- **Reuse over Duplication:** Extract shared patterns only when abstraction is justified and does not introduce brittle coupling.
- **Accessibility & Usability as Requirements:** Treat accessibility as an essential acceptance criterion, not an optional feature.
- **Performance by Design:** Consider performance during implementation (render cycles, bundle size, network requests), not as an afterthought.
- **Preserve Existing Functionality:** Do not break existing features or regressions unless a task explicitly mandates modifications.
- **Verification First:** Never claim a feature works, a test passes, or a build succeeds without executing and verifying it.
- **Zero Hallucination / Mocking in Production:** Never hide errors, fabricate fake data, introduce dummy functionality, or leave unresolved placeholder stubs in production execution paths without explicit authorization.
- **Minimal Blast Radius:** Make the smallest complete change that cleanly solves the problem.
- **Long-term Engineering Mindset:** Build with the discipline of an engineer maintaining this system for years, not someone aiming for a quick demo.

---

## 5. React 19 Engineering Standards

- **Component Responsibility:** Build components around single, well-defined responsibilities. Keep them small enough to comprehend easily, but do not fragment code into micro-components without clear benefit.
- **Extract Shared Logic:** Move complex or shared stateful logic into custom hooks (`use...`) and pure functions into `utils/`.
- **Declarative & Predictable Rendering:** Keep render functions pure and declarative. Never mutate React state or props directly.
- **State Updates:** Always use functional updates (`setCount(prev => prev + 1)`) whenever the next state depends on the previous state.
- **Derived State:** Calculate values on the fly during rendering when possible. Never duplicate values in state that can be derived from existing state or props.
- **List Keys:** Use stable, unique IDs for list keys. Never use array indices as keys when items can be reordered, filtered, added, or deleted.
- **Side Effects:**
  - Restrict side effects to event handlers or explicit effects.
  - Never run side effects or initiate data fetching inside the render phase.
  - Avoid `useEffect` for transformations that can be performed synchronously during render.
  - Never suppress ESLint dependency warnings (`react-hooks/exhaustive-deps`) without a verified, documented rationale.
- **Targeted Optimization:** Do not overuse `useMemo`, `useCallback`, or `React.memo` indiscriminately. Apply memoization only for computationally expensive calculations or stable prop references verified by measurement.
- **Cleanups & Resource Safety:** Always clean up event listeners, timers, subscriptions, AbortControllers, and observers in effect cleanups.
- **Direct DOM Access:** Never manipulate the DOM directly. Use React refs (`useRef`) and idiomatic React APIs when imperative DOM interactions (e.g., focus management, measuring elements) are unavoidable.
- **Rules of Hooks:** Follow the Rules of Hooks strictly—never call hooks inside loops, conditions, or nested functions.

---

## 6. Next.js App Router Standards

### Server & Client Components
- **Server Components by Default:** Keep components as React Server Components (RSC) unless interactive behavior or browser-only APIs are strictly required.
- **Minimal Client Boundaries:** Add `"use client"` only at the leaf nodes that require client-side interactivity, state, or event handlers. Never convert an entire page or layout into a Client Component to satisfy one interactive child.
- **Server Isolation:** Keep server-only logic, database access, privileged operations, and private keys strictly on the server. Never import server-only packages into Client Components.
- **Secret Safety:** Never expose secrets or sensitive configuration via `NEXT_PUBLIC_` environment variables.
- **Server-Side Data Fetching:** Prefer fetching data directly in Server Components or dedicated data layers. Avoid unnecessary client-side fetch requests when data can be securely rendered on the server.

### Routing & Rendering
- **App Router Conventions:** Leverage Next.js conventions appropriately:
  - `layout.tsx` for persistent UI shells and shared wrappers.
  - `page.tsx` for route entrypoints.
  - `loading.tsx` for instant streaming UI / React Suspense boundaries.
  - `error.tsx` for localized error boundaries (must be client components).
  - `not-found.tsx` for 404 handling.
- **Route Groups & Nesting:** Use route groups `(group)` and nested layouts to keep complex routing clean without polluting URL paths.
- **Deliberate Caching & Dynamic Rendering:** Do not use `export const dynamic = 'force-dynamic'` globally without a specific need. Configure caching and revalidation intentionally.
- **Next.js Version Alignment:** Align APIs and conventions with the installed Next.js version (Next.js 16+ App Router, asynchronous request APIs for headers/cookies/params where applicable).
- **Server Actions & Route Handlers:** Use Server Actions for form submissions and mutations; use Route Handlers (`route.ts`) for external API webhooks or REST endpoints. Validate all inputs and enforce authorization on the server.

### Navigation & Metadata
- **Navigation Primitives:** Always use `next/link` for internal links and Next.js navigation hooks (`useRouter`, `usePathname`, `useSearchParams`) for programmatic routing.
- **Metadata Configuration:** Export static `metadata` objects or dynamic `generateMetadata` functions for SEO, Open Graph tags, canonical URLs, and dynamic page titles. Avoid duplicate or conflicting tags across nested routes.

---

## 7. UI/UX Quality Standards

Every interface must prioritize clarity, visual hierarchy, consistency, and intuitive user experience.

### Visual Hierarchy & Spacing
- Establish a deliberate typographic scale, consistent spacing system, and well-balanced contrast ratios.
- Use intentional whitespace to group related controls and guide attention.
- Avoid visual clutter: eliminate excessive drop-shadows, unnecessary gradients, and purely decorative gimmicks that distract from user tasks.
- Adhere strictly to the project's design tokens and brand styling via Tailwind CSS.

### Responsive & Adaptive Layouts
- Design mobile-first, ensuring fluid layouts that scale seamlessly from compact mobile viewports (320px+) to wide desktop monitors.
- Thoroughly test intermediate widths (tablets, foldables, small laptops).
- Prevent horizontal scrollbars, clipped text, or overlapping elements at any viewport width.
- Ensure all touch targets are suitably sized (minimum 44x44px) for touch devices.

### Interaction & Feedback
- **Semantic Controls:** Always use native `<button>` for actions and `<a>` / `<Link>` for navigation. Never attach click handlers to unstyled `<div>` or `<span>` elements.
- **Interactive Feedback:** Provide explicit visual states for every interactive element:
  - Default / Idle
  - Hover
  - Focus-visible (keyboard focus indicators)
  - Active / Pressed
  - Disabled
- **Action Feedback:** Display immediate feedback during long-running tasks (spinners, skeleton loaders, button pending states).
- **Destructive Actions:** Require confirmation dialogs or distinct safety barriers for irreversible or destructive operations.
- **Prevent Duplicate Submissions:** Disable submit triggers and debounce mutation handlers while network requests are in flight.

---

## 8. Comprehensive UI States

Every interactive and data-driven view must account for and gracefully render each of the following states:

| UI State | Requirement |
| :--- | :--- |
| **Initial / Idle** | Clean starting view before user interaction or data triggers. |
| **Loading / Skeleton** | Informative skeletons or loaders that prevent layout shifts (CLS). |
| **Pending / In-Progress** | Clear indication that a submitted action or background task is processing. |
| **Success** | Confirmation banners, toasts, or UI updates acknowledging successful completion. |
| **Empty State** | Helpful messaging, illustration, and recovery/creation CTA when no data exists. |
| **Validation Error** | Clear, contextual inline error messages linked to invalid form inputs. |
| **Server / Request Error** | Actionable error messages with a retry mechanism; no raw stack traces shown to users. |
| **Disabled / Unavailable** | Obvious visual cue when a feature or button cannot currently be used, explaining why if non-obvious. |
| **Partial Data** | Resilient rendering when optional data fields are omitted or partially loaded. |
| **Auth / Access Restricted** | Unambiguous sign-in or permission-denied views with navigation back to safety. |

*Never present a blank screen to the user when an actionable empty or error state can guide them.*

---

## 9. Accessibility (WCAG 2.2 AA) Standards

The application must target **WCAG 2.2 Level AA** compliance across all views.

- **Semantic HTML First:** Use landmark tags (`<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`, `<section>`) and native elements (`<button>`, `<dialog>`, `<form>`, `<input>`) before resorting to custom ARIA constructs.
- **Heading Hierarchy:** Maintain a logical, non-skipping heading structure (`h1` -> `h2` -> `h3`). Exactly one `<h1>` per page.
- **Accessible Forms:**
  - Pair every form input with an explicit `<label htmlFor="...">`.
  - Associate helper text and validation errors using `aria-describedby` and `aria-errormessage`.
  - Mark required inputs with `aria-required="true"`.
- **Keyboard Navigation & Focus Management:**
  - Ensure 100% of interactive controls are operable via keyboard alone (`Tab`, `Enter`, `Space`, `Escape`, arrow keys).
  - Never remove `:focus` outlines without replacing them with an equally prominent `:focus-visible` indicator.
  - Trap and manage focus properly within modal dialogs, slide-overs, and popovers; return focus to the trigger on close.
- **Color & Contrast:**
  - Ensure a minimum contrast ratio of **4.5:1** for regular text and **3:1** for large text and UI components/icons.
  - Never communicate status, error, or critical information using color alone (pair color with text or icons).
- **Motion & Media:**
  - Respect user motion settings using `@media (prefers-reduced-motion: reduce)`.
  - Avoid auto-playing audio or abrupt flashing animations.
  - Provide informative, accurate `alt` text for images; use empty `alt=""` for purely decorative images.
- **Accessible Names:** Provide programmatic labels for icon-only buttons using `aria-label` or visually hidden screen-reader text (`sr-only`).

---

## 10. Verification & Quality Assurance

- **Pre-Commit Verification:** Run `npm run lint` and verify builds compile without TypeScript errors before finalizing work.
- **No Unverified Claims:** Never report that code works or builds pass without executing tests or build commands.
- **Transparent Failure Reporting:** If a command fails or a dependency error occurs, report the full context and error output immediately rather than concealing it.
- **Clean Diff Discipline:** Ensure git commits and file modifications contain only intentional changes directly pertinent to the task. Keep codebases free of leftover debug logs, temporary test files, and commented-out dead code.
