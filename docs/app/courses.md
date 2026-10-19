# `app/courses/page.tsx`

Courses page entrypoint (Server Component) for `/courses`.

- **Hero Section**:
  - Live-pulsing amber classification status (`Dossier 02 // Curricula & Cohort Licensing Open`) and program count stamp (`03 Core Offerings // 2026 Academic Cycle`).
  - Monumental Space Grotesk `<h1>`, Newsreader italic thesis statement, institutional licensing summary, and quick-jump CTAs.
  - Program Index summary card linking directly to each course anchor (`#courses-and-learning-resources`, `#research-and-insights`, `#educational-content-and-guidance`), plus a 4-metric operational strip.
- **Alternating Course Directory (`CourseQuoteSection`)**:
  - Uses live courses fetched dynamically via `getCourses()` wrapped in `<Suspense fallback={<CourseCatalogSkeleton />}>` with `courseItemToOffering` adapter.
  - Alternates left/right column placement per course (Course 01: left course name & plate, right course about & `Watch Now`; Course 02: swapped; Course 03: left course name & plate, right course about & `Watch Now`).
  - Integrates an interactive YouTube responsive video iframe embed and direct YouTube video lecture link per course.
- **Full-Width Baseline Ticker**: Edge-to-edge baseline bar with `OFFICE 1 • OFFICE 2 • OFFICE 3` and syllabus edition stamps.
- **Layout Shell**: Wrapped by the global `Header` and `Footer` in `app/layout.tsx`.
