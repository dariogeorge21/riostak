# `app/page.tsx`

Landing page entrypoint (Server Component). Renders `main` containing, in order:
`Hero` → `About` → `Audience` → `Framework` → `Initiatives` → `Impact` → `Contact` (wrapped by the global `Header` and `Footer` in `app/layout.tsx`).

`main` carries `pt-20` to clear the fixed 5rem header. The page renders exactly one `<h1>` (in `Hero`).

Navigation targets are in-page anchors: `#about`, `#audience`, `#framework`, `#learn`, `#research`, `#library`, `#impact`, `#contact`.
