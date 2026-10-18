# `app/globals.css`

Tailwind v4 entry stylesheet; all design tokens come from the Stitch *FINAL DESIGN* screen and live in `@theme`.

| Group | Tokens |
| :--- | :--- |
| Brand | `cream #EFEBE0`, `cream-deep #E5E0D2`, `navy #0B1F44`, `navy-deep #001433`, `gold #D4A22A` |
| Semantic | `primary`, `secondary`, `surface-*`, `on-surface(-variant)`, `outline*` (Material-style) |
| Spacing | `space-xs…space-3xl`, `gutter`, `gutter-desktop`, `margin`, `margin-desktop` |
| Type | `headline-xl/lg/md/sm` (+ `-mobile`), `title-md`, `body-lg/md/sm`, `label-lg/md/xs` — each bundles size, line-height, tracking and weight |
| Fonts | `font-sans` (Hanken Grotesk), `font-display` (Space Grotesk), `font-serif` (Newsreader) |

Base layer: smooth scrolling on `html` with `[id] { scroll-margin-top: 5rem }` for the fixed header (avoiding `scroll-padding-top` on `html` so Next.js route-transition scroll checks stay at `scrollY = 0`), a gold `:focus-visible` ring, and a `prefers-reduced-motion` override that disables animation/transition.
