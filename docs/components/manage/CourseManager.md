# CourseManager Component (`components/manage/CourseManager.tsx`)

## Overview

Interactive administrative manager for RIOSTAK academic curricula and course offerings, replicating the hidden inline drawer design pattern established in `CourseQuoteSection.tsx`.

## Features

- **Inline Creation & Editing Drawers:** Accordion drawers with cubic-bezier easing (`0fr` to `1fr`), gold border accents, and monospace index badges.
- **Form Fields:** Supports title, index code, subtitle, tags, narrative body, extended institutional context, delivery format, multi-line module highlights, and YouTube video link. (Course code and duration have been removed in favor of YouTube lecture links).
- **YouTube Integration:** Each course incorporates an uploaded YouTube video URL embedded as an interactive iframe on the catalog and accompanied by a direct YouTube visit option.
- **Instant Status Toggling:** Quick action button to toggle course status between Published and Draft.
- **Safety Barriers:** Confirmation dialog for permanent deletions.
