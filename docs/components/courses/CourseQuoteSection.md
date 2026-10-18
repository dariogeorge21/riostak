# `components/courses/CourseQuoteSection.tsx`

Client leaf component (`"use client"`) rendering the alternating course rows and per-course inline animated `Request Quote` forms on `/courses`.

- **Alternating Layout (`CourseRow`)**:
  - Even rows (`01`, `03`): Left column displays course index, tags, syllabus code, title, subtitle, and framed editorial image plate; right column displays the course overview, extended curriculum context, 4-module deliverables grid, delivery metadata, and the `Request Quote` trigger button.
  - Odd rows (`02`): Columns swap places on desktop (`lg:order-2` / `lg:order-1`) so course about appears on the left and course name/plate appears on the right.
- **Inline Animated Quote Drawer**:
  - Positioned directly below each course's 2-column grid and above the next course.
  - Uses CSS grid row transitions (`grid-rows-[0fr]` to `grid-rows-[1fr]`) with opacity easing (`cubic-bezier(0.22,1,0.36,1)`) for smooth expand/collapse animation.
  - Each course maintains isolated state (`isOpen`, `values`, `errors`, `isSubmitting`, `submittedQuote`).
  - Supports keyboard dismissal via `Escape` (`useEffect` with listener cleanup) and manages `tabIndex` when collapsed so hidden inputs are not tab-focusable.
- **Form Fields & Dummy Submission**:
  - Selectable radio-chip groups for **Cohort Size** and **Delivery Format**.
  - Validated inputs for **Full Name**, **Work / Academic Email**, **Institution / Organization**, **Preferred Start Window**, and **Curriculum Customization Notes**.
  - Simulates quote submission (`550ms`) and transitions into a verified confirmation dossier displaying a generated reference code (`RIO-QT-XX-XXXX`) with options to request another quote or close the drawer.
