# BlogManager Component (`components/manage/BlogManager.tsx`)

## Overview

Interactive administrative manager for RIOSTAK editorial monographs and blog dispatches.

## Features

- **Search & Filter:** Instant client-side filtering across monograph titles, excerpts, authors, and index codes, as well as status filtering (`all`, `published`, `draft`).
- **Hidden Inline Animated Creation Drawer:** Expands from the top of the list via `grid-rows-[1fr]` with gold border accent and validated form fields.
- **Hidden Inline Animated Edit Drawer:** Expands directly beneath any selected monograph row for in-place editing.
- **Inline Safety Confirmation:** Confirmation barrier for destructive deletion requests.
- **Optimistic State Updates:** React 19 `useTransition` for smooth, responsive feedback during database mutations.
