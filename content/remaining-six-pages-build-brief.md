# Build brief: remaining five Commview search landing pages

Build the five pages supplied in `content/pages/` on this branch.

## Pages

1. `/fractional-cmo/for-startups`
2. `/fractional-cmo/for-scale-ups`
3. `/fractional-cmo/uk`
4. `/growth/seo/saas`
5. `/growth/aeo/services`

The proposed `/growth/seo/b2b` page has been removed. The existing `/growth/seo` page remains the definitive B2B SEO commercial page. Do not recreate the child route.

## Required parent-page change before implementation

The existing `/fractional-cmo` parent currently overlaps too strongly with the scale-up child. Reposition the parent to own the broad **fractional CMO / fractional CMO services** intent before shipping the children.

The parent should:
- use a broad Fractional CMO Services proposition rather than positioning itself specifically as "for B2B scale-ups"
- explain the overall fractional CMO offer
- introduce and link to Startups, Scale-ups and UK as distinct routes
- avoid optimising its title/H1 around "fractional cmo for scale-ups"
- remain the hub for the child pages

Do not remove useful existing proof or the core Commview proposition simply to broaden the keyword target.

## Source of truth

The corresponding markdown files are the source of truth for visible copy, metadata, URL, internal links and FAQ wording.

## Keyword ownership

- `/fractional-cmo`: **fractional cmo / fractional cmo services**
- `/fractional-cmo/for-startups`: **fractional cmo for startups**
- `/fractional-cmo/for-scale-ups`: **fractional cmo for scale-ups**
- `/fractional-cmo/uk`: **fractional cmo uk**
- `/growth/seo`: **b2b seo consultant / b2b seo / seo consultant**
- `/growth/seo/saas`: **saas seo consultant**
- `/growth/aeo`: broader Answer Engine Optimisation topic
- `/growth/aeo/services`: **answer engine optimization services**

The AEO services page is deliberately transactional. If implementation review shows it substantially duplicates the AEO parent rather than serving a distinct buying intent, stop and flag it rather than shipping two near-identical pages.

## Internal linking

- Fractional CMO parent links to Startups, Scale-ups and UK.
- Each Fractional CMO child links back to the parent.
- SaaS SEO links to the main B2B SEO page.
- Remove any link to `/growth/seo/b2b`; it must not exist.
- AEO parent and services child link to each other where contextually useful.

All canonicals should be self-referencing. Do not use canonical tags to hide duplicate intent.

## Design

Use the established Commview design system and existing shared components, while giving each page one useful page-specific visual idea rather than pouring all five into an identical template.

Capability accents:
- GTM Leadership: `#00E5FF`
- Growth: `#10B981`

Use strong typography, whitespace, fine rules, restrained grids, existing header/footer, CTA and FAQ treatments.

Avoid card soup, generic SaaS gradients, excessive diagrams, stock imagery, decorative graphics with no explanatory job, handwritten slogans and arrows in CTA buttons.

## Implementation

Prefer the existing content-driven/catch-all architecture.

Ensure correct metadata, self-referencing canonical, BreadcrumbList, Service schema where consistent, visible FAQ + FAQPage where supported, `areaServed: United Kingdom` for the UK page if supported, working internal links, sitemap inclusion when enabled, responsive layout and passing typecheck/build.

## Content rules

- British English.
- No em dashes in visible copy.
- No invented claims, prices, client relationships or guarantees.
- Preserve the supplied child-page H1s.
- ADI organic traffic is +60%.
- Vodafone/ADI proof is Commview network/operator experience, not a claim those organisations are Commview clients.
- Do not guarantee AI citations or SEO timelines.
- Do not claim FAQ schema guarantees rich results.

## Acceptance criteria

Five new child URLs render. The Fractional CMO parent owns the broad intent and clearly routes to its three children. The existing SEO parent owns B2B SEO and there is no `/growth/seo/b2b` route. AEO parent/service intent remains distinct. Metadata, schema, links and capability styling are correct.
