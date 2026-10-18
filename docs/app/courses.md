# `app/courses/page.tsx`

Courses page entrypoint (Server Component) for `/courses`.

- **Hero Section**:
  - Live-pulsing amber classification status (`Dossier 02 // Curricula & Cohort Licensing Open`) and program count stamp (`03 Core Offerings // 2026 Academic Cycle`).
  - Monumental Space Grotesk `<h1>`, Newsreader italic thesis statement, institutional licensing summary, and quick-jump CTAs.
  - Program Index summary card linking directly to each course anchor (`#courses-and-learning-resources`, `#research-and-insights`, `#educational-content-and-guidance`), plus a 4-metric operational strip.
- **Alternating Course Directory (`CourseQuoteSection`)**:
  - Uses the three core offerings from the landing page (`Courses and Learning Resources`, `Research & Insights`, `Educational Content & Guidance`).
  - Alternates left/right column placement per course (Course 01: left course name & plate, right course about & `Request Quote`; Course 02: swapped; Course 03: left course name & plate, right course about & `Request Quote`).
  - Integrates an independent, animated inline quote drawer beneath each course and before the next course.
- **Full-Width Baseline Ticker**: Edge-to-edge baseline bar with `OFFICE 1 • OFFICE 2 • OFFICE 3` and syllabus edition stamps.
- **Layout Shell**: Wrapped by the global `Header` and `Footer` in `app/layout.tsx`.
