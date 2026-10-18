# Shared components

## `Header.tsx`
Fixed, translucent cream navigation bar (Server Component). Aligned to the site-wide `max-w-screen-2xl` container with responsive `px-margin lg:px-margin-desktop`. Desktop links come from `SITE_NAV_LINKS` in `utils/navigation.ts`; "Home" is marked `aria-current="page"`. Renders `MobileNav` below `md`. The "Start Learning" CTA is hidden below `sm` and reachable through the mobile menu's links.

## `MobileNav.tsx`
Client leaf — the only client boundary in the header. A toggle button (`aria-expanded`, `aria-controls`, dynamic `aria-label`) reveals a link list; it closes on link click and on `Escape` (returning focus to the toggle). Listener is removed in the effect cleanup.

## `Footer.tsx`
Brand blurb, two link columns, and a newsletter block, aligned to the site-wide `max-w-screen-2xl` container. The newsletter form is intentionally **disabled** with an explanatory "Subscriptions open soon" note, because no subscription backend exists yet. Enable it by wiring a Server Action. Privacy/Terms links from the design are omitted until those pages exist.

## `Wordmark.tsx`
RIOSTAK logotype (gold "K"), linking home. Used by header and footer.

## `Icons.tsx`
Inline decorative SVGs (`ArrowForwardIcon`, `ArrowDownwardIcon`, `VerifiedIcon`) replacing the design's external Material Symbols font to avoid an extra network request.
