# Blogs Page (`/blogs`)

## Overview

The `/blogs` route hosts RIOSTAK's open-access publication series: **Despatches & Scholarly Monographs**. It dynamically displays published monographs from the Supabase database with fallback to curated initial monographs.

## Key Features

- **Scholarly Swiss Minimalism:** Strict typography scale using Space Grotesk for headings, Newsreader Serif for quotes and excerpts, and Hanken Grotesk for body copy.
- **Dynamic Catalog:** Fetches published monographs via `getPublishedBlogs()`.
- **Category Filtering:** Filter monographs across series (*Editorial Dispatches*, *Fellowship Essays*, *Monograph Series*, *Working Papers*).
- **Inline Reading Drawers:** Clicking "Read Full Monograph" expands the complete article directly beneath the monograph row using smooth CSS grid transition animations with citation guidelines and keyboard dismissal (`Escape`).
- **Baseline Ticker:** Full-width architectural status ticker referencing active global fellowship desks (Cambridge, Zurich, Singapore).
