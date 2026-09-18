# COMMVIEW — handover pack

Everything Claude Code needs to start Phase 0. Drop these into a fresh repo in the structure below.

```
repo-root/
├── CLAUDE.md                      ← standing rules, read every session
├── docs/
│   └── BUILD-PLAN.md              ← architecture, content model, diagnostic spec, phases
└── reference/
    ├── index.html                 ← homepage, verified
    ├── blog.html                  ← blog index
    ├── article.html               ← article template
    ├── category.html              ← topic template
    ├── verify.js                  ← Playwright checks, all four pages
    ├── styles/
    │   ├── tokens.css             ← design system tokens
    │   ├── components.css         ← design system component styles
    │   └── chrome.css             ← header, footer, buttons, shared blog CSS
    └── assets/
        ├── commview-logo-primary.svg        ← light backgrounds
        ├── commview-logo-reversed.svg       ← dark, charcoal ground baked in
        ├── commview-logo-reversed-nobg.svg  ← dark, no ground
        ├── commview-logo-mark.svg           ← tile only, favicons and avatars
        └── commview-logo-inline.svg         ← the `<g>` the pages inline as a sprite
```

## What each file is for

**`CLAUDE.md`** — the rules. Locked copy, no redesigning, verification requirements, conventions. Claude Code reads it automatically at the repo root.

**`docs/BUILD-PLAN.md`** — architecture, sitemap, Sanity content model, diagnostic spec, CRM integration and phases. Included. The build plan doc in Claude is the living version, so if it changes there, re-export over this file.

**`reference/*.html`** — the four verified pages. These are the source of truth for markup and CSS. Port them; do not rebuild from the screenshots.

**`reference/verify.js`** — runs Playwright over all four at nine widths checking overflow, console errors, heading order, JSON-LD validity and the interactive pieces. Needs `npm i -D playwright`. Port it to run against the dev server once the Next.js app exists.

**`styles/`** — the same CSS the HTML files carry inline, split out. `tokens.css` and `components.css` come straight from the design system artifact and should not be edited in this repo; `chrome.css` is the shared site furniture.

**`assets/`** — the production logo vectors. The wordmark is outlined, so no font is needed to render it. Never re-set COMMVIEW in live type as a substitute.

## Also worth having to hand

The design system artifact itself, for the full brand book, colour rules and component previews. Claude Code can't read it — it's a Claude artifact, not a file — so anything from it that matters to the build should end up in `CLAUDE.md` or the plan.

## Status of the four pages

| | Copy | Verified |
| --- | --- | --- |
| `index.html` | Locked and approved | Yes |
| `blog.html` | All placeholder | Yes |
| `article.html` | All placeholder | Yes |
| `category.html` | All placeholder | Yes |

Verified means: no horizontal overflow and no console errors at 360, 390, 430, 768, 900, 1024, 1280, 1440 and 1920; one `h1` per page; no heading-level jumps; all JSON-LD parses; progress bar, table of contents, FAQ toggles and mobile menu all work.

## Two fixes that went in late

The header collapsed too late, overflowing between 721px and 800px — the burger now appears at 860px. And the footer logo rendered at 188px on the homepage against 176px on the blog pages; all four are now 176px with identical footer markup, nav and strapline.

## Before Phase 0 starts

Three answers needed: do you own commview.co.uk, is the section called Insight or Blog, and Supabase or Vercel Postgres for diagnostic submissions. The rest can wait for the phase that needs them.
