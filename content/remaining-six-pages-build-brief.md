# Build brief: remaining six Commview search landing pages

Build the six pages supplied in `content/pages/` on this branch.

## Pages

1. `/fractional-cmo/for-startups`
2. `/fractional-cmo/for-scale-ups`
3. `/fractional-cmo/uk`
4. `/growth/seo/b2b`
5. `/growth/seo/saas`
6. `/growth/aeo/services`

## Source of truth

The corresponding markdown files are the source of truth for visible copy, metadata, URL, internal links and FAQ wording.

They were written against the existing Commview page briefs and mapped search intent. Do not collapse them into their parent pages.

## Keyword ownership

Protect the existing intent split:

- `/fractional-cmo/for-startups`: **fractional cmo for startups**
- `/fractional-cmo/for-scale-ups`: **fractional cmo for scale-ups**
- `/fractional-cmo/uk`: **fractional cmo uk**
- `/growth/seo/b2b`: **b2b seo consultant**
- `/growth/seo/saas`: **saas seo consultant**
- `/growth/aeo/services`: **answer engine optimization services**

Do not rewrite these pages so they compete with:
- `/fractional-cmo` for the broader fractional CMO intent
- `/growth/seo` for the broader SEO consultant/service intent
- `/growth/aeo` for the broader informational Answer Engine Optimization intent

The AEO services page is deliberately transactional. The AEO parent is the broader sub-pillar.

## Design

Do not invent six new design systems.

Use the established Commview service-page system and existing shared components.

Capability accents:
- GTM Leadership: `#00E5FF`
- Growth: `#10B981`

The pages should feel related to their parent pillar while retaining enough editorial variation to avoid looking generated from a rigid card template.

Use:
- strong typography
- whitespace
- fine rules
- restrained grids
- existing header/footer
- existing CTA treatment
- existing FAQ treatment
- existing service-page breadcrumb treatment where available

Avoid:
- card soup
- generic SaaS gradients
- excessive diagrams
- stock imagery
- decorative graphics with no explanatory job
- handwritten slogans
- adding arrows to CTA buttons

## Implementation

Prefer the existing content-driven/catch-all page architecture where appropriate. Do not create six bespoke route implementations unless the current architecture genuinely requires it.

Ensure:
- correct metadata
- canonical for each URL
- BreadcrumbList
- Service schema where consistent with existing implementation
- FAQPage schema for the visible FAQs
- `areaServed: United Kingdom` for the UK fractional CMO page if supported by the existing schema utilities
- internal links from each markdown file are retained
- parent pages link to these child pages where the existing architecture has a relevant child/service listing
- sitemap generation includes all six pages once the site sitemap is enabled
- mobile layout has no horizontal overflow
- typecheck/build passes

## Important content rules

- British English.
- No em dashes in visible copy.
- Do not invent claims, prices, client relationships or guarantees.
- Preserve the supplied H1s. Each owns its mapped primary keyword.
- Do not reintroduce the old ADI +800% organic traffic claim. The locked figure is +60%.
- The scale-up page's Vodafone/ADI proof is approved Commview experience, not a claim that those companies are Commview clients.
- Do not guarantee AI citations or SEO timelines.
- Do not claim FAQ schema guarantees rich results.

## Acceptance criteria

All six URLs render, metadata is correct, primary keyword ownership is clear, FAQs are visible and represented in schema where supported, internal links work, capability styling is correct, and the pages visually belong to the current Commview site.
