# COMMVIEW — build rules

Read `docs/BUILD-PLAN.md` first. It has the architecture, sitemap, content model, diagnostic spec and phases. This file is the standing rules for working in this repo.

## Non-negotiables

**The homepage copy is locked.** Do not rewrite, shorten, expand or paraphrase it. Do not invent headings, testimonials, case studies or statistics. Do not add or rename services. Do not reintroduce "Strategy" as a standalone service — there are four capabilities: GTM Leadership, Growth, Product, Operational AI.

**Use the supplied logo file.** Never recreate the wordmark in HTML, never set "COMMVIEW" in live type as a substitute, never alter its proportions.

**Never invent copy.** If a page needs words that don't exist, put a visible `TODO:` placeholder and say so. Placeholder copy that reads as finished is worse than an obvious gap.

**Port, don't redesign.** `reference/` holds three verified static mocks. Their CSS is complete and checked for contrast and overflow at nine widths. Lift it verbatim. If a layout looks wrong after porting, the markup is wrong, not the CSS.

## Stack

Next.js 15 App Router, TypeScript, Sanity v3 with the Studio embedded at `/studio`, Vercel.

Plain CSS only — no Tailwind, no UI library, no CSS-in-JS, no state manager. Styles live in `styles/` as token and component sheets, imported once in the root layout.

## Conventions

- Server Components by default. `'use client'` only where there is real interactivity: the teleprompter, capability panels, article TOC and progress, the diagnostic.
- Every GROQ query lives in `lib/sanity/queries.ts`. Nothing else imports the Sanity client.
- Every CRM call goes through `lib/crm/index.ts`. No vendor SDK imported anywhere else.
- Diagnostic scoring is pure functions in `lib/diagnostic/scoring.ts`, with unit tests.
- Design tokens only. No hex values in component CSS — if a colour is missing, it is a design system question, not a local fix.
- British English throughout, in code comments and content.

## Colour coding

Fixed across the whole site. GTM Leadership `--brand-cyan`, Growth `--accent-green`, Product `--brand-blue`, Operational AI `--accent-pink`. Passed down as `--c` on a section or card, never hardcoded per component.

## Verification — required before saying a task is done

Do not eyeball. Measure.

- Playwright screenshots at 360, 390, 430, 768, 900, 1024, 1280, 1440 and 1920. Assert `scrollWidth <= clientWidth` at every width.
- Assert no console errors on every route.
- One `<h1>` per page, no heading-level jumps.
- Every JSON-LD block parses.
- Interactive pieces actually work: progress bar advances, TOC highlights, FAQ toggles, mobile menu opens.

`reference/verify.js` does all of this for the static mocks. Port it to run against the dev server and extend it per route.

Known trap: Google Fonts may be blocked in sandboxes, so layout checks silently run in a fallback face and pass when they should fail. Verify Inter is actually loading before trusting any measurement.

## Accessibility

Focus-visible outlines on everything interactive. `aria-expanded` on every disclosure. Decorative SVG gets `aria-hidden`. Every image has alt text — enforced as a Sanity validation rule, not left to editors.

## Git

Branch per phase. Conventional commits. Never commit `.env.local`. Vercel preview deploys are the review surface — do not merge to main without looking at one.
