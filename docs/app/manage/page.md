# Manage Page (`/manage`)

## Overview

The `/manage` route is the administrative control center for RIOSTAK company directors and editorial fellows. It is strictly protected under session-based authentication and provides comprehensive CRUD management for both **Blogs** (editorial monographs) and **Courses** (academic curricula).

## Key Features

- **Route Protection:** Server component checks `getAdminSession()`. Unauthenticated requests are redirected to `/login?redirect=/manage`.
- **Dedicated Sidebar:** Minimalist Swiss sidebar providing section navigation:
  - **Blogs Tab:** Manages blog monographs, publishing state, excerpts, and full text.
  - **Courses Tab:** Manages course syllabi, duration, delivery format, and module highlights.
  - **User Details & Sign Out:** Displays current authenticated user (`sdc`) and one-click session sign-out.
- **Hidden Inline Expandable Drawers:**
  - Both Blogs and Courses implement smooth accordion drawers (`grid-rows-[0fr]` to `grid-rows-[1fr]`) matching the exact UX pattern established in `CourseQuoteSection.tsx`.
  - Top drawer expands for creating new records.
  - Row drawers expand directly below any selected item for inline editing.
  - Delete actions feature a safety confirmation barrier.
