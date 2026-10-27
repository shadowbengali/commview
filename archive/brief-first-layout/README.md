# Brief — first-pass layout (retired)

The original prospect-brief layout. It was served at `/brief/[token]` until the
"audit dossier" layout (`components/brief/BriefDossier.tsx`) was chosen as the
single design and promoted to that route.

Kept here for reference only. Nothing imports these files, and `archive/` is
excluded from the TypeScript build (see `tsconfig.json`).

- `BriefPage.tsx` — the component (`.br-*` classes)
- `brief.css` — its stylesheet

The live template is `components/brief/BriefDossier.tsx` with
`styles/brief-dossier.css`, rendered by `app/(site)/brief/[token]/page.tsx`.
