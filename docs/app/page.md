# `app/page.tsx`

Landing page entrypoint (Server Component). Renders `main` containing, in order:
`Hero` → `About` → `Audience` → `Framework` → `Initiatives` → `Blogs` → `Impact` → `Contact` (wrapped by the global `Header` and `Footer` in `app/layout.tsx`).

`main` carries `pt-20` to clear the fixed 5rem header. The page renders exactly one `<h1>` (in `Hero`).

## Live Data Integration & Suspense Streaming
- `Initiatives` (Section 04): Streamed via `<Suspense fallback={<InitiativesSkeleton />}>` invoking `getCourses()` from `@/app/actions/courseActions`. Displays live course offerings with YouTube seminar indicators.
- `Blogs` (Section 05): Streamed via `<Suspense fallback={<BlogsSkeleton />}>` invoking `getPublishedBlogs()` from `@/app/actions/blogActions`. Features live peer-reviewed monographs and field notes with direct links to `/blogs`.

Navigation targets are in-page anchors: `#about`, `#audience`, `#framework`, `#initiatives` (`#learn`, `#research`, `#library`), `#blogs`, `#impact`, `#contact`.
