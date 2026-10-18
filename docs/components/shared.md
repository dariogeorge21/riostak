# Shared components

## `Header.tsx`
Fixed, edge-to-edge (`w-full`) translucent cream navigation bar (Server Component):
- **Left Corner (`shrink-0`)**: `Wordmark` anchored flush to the left edge alongside a vertical hairline divider and the live-pulsing `RIOSTAK // EST. 2026 — Empirical Flourishing` identity stamp (visible on both mobile and desktop).
- **Center Architectural Bridge (`flex-1`)**: Fills the middle span between the left brand cluster and right navigation cluster with diamond-capped hairline rules and an `OFFICE 1 • OFFICE 2 • OFFICE 3` telemetry pill on wide viewports.
- **Right Corner (`shrink-0`)**: Anchors `DesktopNav`, the sculpted `Start Learning` CTA pill (`/courses`), and `MobileNav` flush to the right edge with no leftover outer container margins.

## `DesktopNav.tsx`
Client leaf rendering the right-aligned floating pill navigation dock (`lg:flex`). Uses `usePathname()` to highlight the active route with a high-contrast `bg-primary text-cream` pill, monospace index prefix (`01`–`05`), and gold status dot (`aria-current="page"`).

## `MobileNav.tsx`
Client leaf disclosure menu for viewports below `lg` providing the exact same navigation functionalities as desktop:
- Displays the `OFFICE 1 • OFFICE 2 • OFFICE 3` telemetry header.
- Renders all `SITE_NAV_LINKS` (`01`–`05`) as pill items with `usePathname()` active-route highlighting (`bg-primary text-cream` + gold dot).
- Includes the identical `Start Learning` (`/courses`) CTA button with the circular gold arrow badge.
- Closes on link click or `Escape` (returning focus to the trigger).

## `Footer.tsx`
Brand blurb, two link columns, and a newsletter block, aligned to the site-wide `max-w-screen-2xl` container. The newsletter form is intentionally **disabled** with an explanatory "Subscriptions open soon" note, because no subscription backend exists yet. Enable it by wiring a Server Action. Privacy/Terms links from the design are omitted until those pages exist.

## `Wordmark.tsx`
RIOSTAK logotype linking home. Used by header and footer.

## `Icons.tsx`
Inline decorative SVGs (`ArrowForwardIcon`, `ArrowDownwardIcon`, `VerifiedIcon`) replacing the design's external Material Symbols font to avoid an extra network request.
