# `components/landingPage/Initiatives.tsx`

Core Initiatives Section (Server Component, Section 04).

## Responsibilities & Live Integration
- Renders alternating editorial offering articles (`#initiatives`, `#learn`, `#research`, `#library`) inside the `max-w-screen-2xl` container.
- Connects directly to live course data via the `courses?: CourseItem[]` prop (falls back to `INITIAL_SEED_COURSES`).
- Filters for `status === "published"` offerings.
- Replaces static images with interactive YouTube `<iframe>` video players embedded directly inside the alternating Swiss framed plates (`getYoutubeEmbedUrl(offering.youtubeUrl)`).
- Renders dynamic video badges (`Video Seminar Available`) when courses have a configured `youtube_url`.
- Provides primary action CTA linking directly to `/courses#${offering.id}` and a direct external link to watch on YouTube (`"Watch on YouTube ↗"`).
- Implements backwards-compatible anchor IDs (`#learn`, `#research`, `#library`, `#${course.slug}`) to preserve existing in-page navigation from Header and Audience sections.
- Per-offering fields control video column alternation, offset container frames, and caption placement.
