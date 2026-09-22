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

## SEO / AEO baseline (enforced by the validator)

Every page is checked against these. Structural faults are **errors** (fail the build).
Content-quality checks are **warnings** by default and become **errors** under `SEO_STRICT=1`
— flip that in the build once the current pages are clean, and no non-compliant page can merge.

Guaranteed by the renderer (can't regress): exactly one `<h1>`, clean `H1 → H2 → H3`
hierarchy, semantic sections, `lang="en-GB"`, canonical, `noindex` pre-launch, and JSON-LD
(`Service` / `FAQPage` / `BreadcrumbList`) built from `meta.schemaTypes`.

Enforced from the content:
- **Title** contains the `primaryKeyword` and is ≤ 60 chars.
- **Meta description** contains the `primaryKeyword`, 70–160 chars.
- **Primary keyword appears in the hero** (h1 / eyebrow / sub) — above the fold.
- **`FAQPage` ⇔ a `faq` section** with items (and a faq section should declare FAQPage — AEO).
- **`BreadcrumbList` ⇔ `meta.breadcrumb`.**
- **Every internal link resolves to a real route** — no 404s. Declared `internalLinks` must
  actually render on the page; rendered `href`s must point to a route that exists.
- One `primaryKeyword` per URL (no cannibalisation). Section `targetKeyword`s record intent.

H1 wording is a brand/style choice (punchy H1s are fine); the keyword lives in title, eyebrow
and H2s. The validator does not force the keyword into the H1.

## Section types

`lead` · `grid` · `venn` · `stepper` · `stats` · `callout` · `comparison` · `logos` · `faq` · `cta`.
Diagram kinds (hero visual): `hub` · `overlap` · `stack` · `image` · `none`.

See `growth.json` — the reference implementation — for a complete, valid example of every part.
