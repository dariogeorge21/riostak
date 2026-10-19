# `components/landingPage/Blogs.tsx`

Scholarly Monographs & Field Notes landing page section (Server Component, Section 05).

## Responsibilities & Behavior
- Accepts an optional `blogs?: BlogItem[]` prop, falling back to `INITIAL_SEED_BLOGS.filter(b => b.status === "published")`.
- Filters only `published` dispatches and surfaces the top 3 most prominent/recent monographs for the landing page index.
- Follows RIOSTAK's Swiss minimalist, editorial typography tokens (`bg-cream`, `text-primary`, `font-display`, `font-mono`).
- Each monograph card displays:
  - Monograph index code (`blog.index_code`, e.g. `01.01`).
  - Label (`blog.label`, e.g. `Editorial Dispatch`, `Field Notes`).
  - Reading duration (`blog.reading_time`).
  - Title linked directly to `/blogs#monograph-${blog.slug}`.
  - Clamped scholarly narrative excerpt.
  - Author attribution (`blog.author_name`, `blog.author_title`).
  - Circular link button directing into the monograph reader.
- Section header links directly to `/blogs` (`Explore All Inquiries ({count})`).
- Includes an empty state for periods where monographs are in peer review.
- Bottom submission banner inviting researchers and fellows to propose abstracts to the secretariat (`/contact`).
