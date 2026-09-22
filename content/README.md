# CommView content contract — v1.0

This directory is owned by the **content pipeline**. ChatGPT authors one JSON file per
page here and nothing else. The pillar renderer (`components/pillar/PillarPage.tsx`, styled by
`styles/pillar.css`) turns each file into a page. The two sides never touch each other's files.

- **ChatGPT owns:** `content/**` — page JSON and assets (`content/assets/…`).
- **Claude owns:** `app/`, `components/`, `styles/`, `lib/`, config — the implementation.
- **Handoff:** a GitHub PR. **Human gate:** the Vercel preview. Blog posts go to Sanity, not here.

Author against **`page.schema.json`** (JSON Schema 2020-12). `scripts/validate-content.mjs` runs the
schema plus the rules below and **fails the build** on any error.

## Rules

1. **Ownership.** Only files under `content/`. One page per file: `content/<slug>.json`, where
   `<slug>` matches the URL and the file's `slug` field. Assets under `content/assets/`.
2. **British English** throughout.
3. **Headings control their own line breaks.** A heading may be a string (wraps naturally) or an
   array of strings, where each element becomes one forced line. Prefer the array for anything that
   should break at a specific point. e.g. `["More signal.", "Less noise.", "Real growth."]`.
4. **Original copy, yes. Invented facts, no.** ChatGPT may write original marketing copy — headlines,
   section prose, CTAs — from approved CommView positioning and source material. It must **not**
   invent facts, proof, client claims, statistics, prices, testimonials or capabilities. Any
   unsupported factual claim uses a literal `"TODO: …"` string rather than an assumption; the renderer
   shows TODOs as visible placeholders, never as finished text.
5. **Stats carry evidence.** Every stat needs `evidence: "verified" | "needs-verification"`.
   `needs-verification` stats show with a flag in dev/preview (for QA) but are **never rendered in
   production**. Use `context` to record where a number comes from.
6. **Accent is fixed by pillar**, and the schema enforces it:
   `gtm-leadership → cyan`, `growth → green`, `product → blue`, `operational-ai → pink`,
   `corporate → neutral`. Colour hex values live in `styles/tokens.css`, never in content.
7. **Homepage is locked.** No `content/home.json`, ever.
8. **Internal links are declared** in `meta.internalLinks` with a `purpose`. The validator warns when a
   declared link isn't actually rendered on the page — useful SEO QA for pillar→cluster linking.
9. **`targetKeyword`** (per section) records the search intent a section exists to serve. Not rendered;
   protects the H2 architecture from well-meaning edits that strip the intent.
10. **No new layouts.** ChatGPT can't invent a section `type` or diagram `kind`. If a page needs
    something the schema doesn't cover, leave a `notes` field describing it; Claude builds the
    component once and, if reusable, promotes it into the schema (a new schema version).

## Section types

`lead` · `grid` · `venn` · `stepper` · `stats` · `callout` · `comparison` · `logos` · `faq` · `cta`.
Diagram kinds (hero visual): `hub` · `overlap` · `stack` · `image` · `none`.

See `growth.json` — the reference implementation — for a complete, valid example of every part.
