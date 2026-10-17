# `app/page.tsx`

Landing page entrypoint (Server Component). Composes, in order:
`Header` → `main` (`Hero`, `Section1`–`Section6`) → `Footer`.

`main` carries `pt-20` to clear the fixed 5rem header. The page renders exactly one `<h1>` (in `Hero`).

Navigation targets are in-page anchors: `#about`, `#audience`, `#framework`, `#learn`, `#research`, `#library`, `#impact`, `#contact`.
