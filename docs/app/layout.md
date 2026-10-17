# `app/layout.tsx`

Root layout for every route.

- Loads **Space Grotesk** (headlines/labels), **Hanken Grotesk** (body) and **Newsreader** (serif accents, wordmark) through `next/font/google`, self-hosted with `display: swap`.
- Each font exposes a CSS variable (`--font-space-grotesk`, `--font-hanken-grotesk`, `--font-newsreader`) consumed by the `@theme inline` block in [globals](./globals.md).
- Exports the site-wide `metadata` (title and description).
