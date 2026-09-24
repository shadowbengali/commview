# Claude build brief: /cmo-support

## Objective
Build the new `/cmo-support` page from `content/cmo-support.json`.

This page is deliberately distinct from `/fractional-cmo`.

- Fractional CMO: the client needs senior marketing leadership.
- CMO Support: the client already has senior marketing leadership and needs experienced execution capacity around it.

Do not blur these propositions.

## SEO ownership
Primary keyword: **outsourced marketing**

Secondary/supporting:
- outsourced marketing management
- outsourced marketing service
- outsourced marketing agency
- outsourced marketing team
- b2b outsourced marketing
- outsourced marketing department
- digital marketing support services

Do NOT optimise this page for:
- outsourced CMO / outsourced CMO services: this risks overlap with `/fractional-cmo`
- growth marketing agency: `/growth` owns the growth agency intent
- channel-specific agency terms such as B2B SEO agency or B2B demand generation agency: their service pages own those intents

The visible proposition remains **CMO Support** even though the search language is outsourced marketing.

## Copy
Use the content JSON as the source of truth. Preserve its meaning and keyword structure.

Key positioning:
**Keep the leadership. Outsource the constraint.**

Closing proposition:
**You lead marketing. We help you move it.**

British English. No em dashes. No invented claims. Do not turn the copy into generic agency language.

## Design
Use the existing Commview design system and reusable page components wherever possible.

GTM Leadership accent: cyan `#00E5FF`.

The page should feel:
- senior
- editorial
- commercially focused
- embedded in the client's organisation
- clearly part of the same site as Fractional CMO, Growth, Product and AI pages

Avoid:
- card soup
- generic SaaS gradients
- heavy shadows/gloss
- black-neon AI styling
- generic stock imagery
- creating a brand-new visual language
- unnecessary component proliferation

Use whitespace, typography, rules, asymmetry and the existing editorial/precision-grid language.

The hero should visually communicate:
CMO leadership -> constraint -> Commview operators -> delivery -> impact.

The scenarios section should make the real briefs feel prominent and human, not like six identical feature cards.

## Internal linking
Keep contextual internal links restrained. Hard maximum 4 on the page, excluding nav/footer/breadcrumbs/CTAs.

Priority destinations:
1. `/fractional-cmo` when explaining the distinction from Fractional CMO
2. `/growth` from the Growth workstream
3. `/product-strategy` from the Product workstream if natural
4. `/ai-consulting` from the Operational AI workstream if natural

Do not keyword-link every service mention.

## Technical
- Build the actual `/cmo-support` route. It is already referenced by the mega-menu and planned routes.
- Use canonical `/cmo-support`.
- Implement Service, FAQPage and BreadcrumbList schema consistently with the existing service-page pattern.
- Preserve the existing header/footer and mega-menu. Do not redesign navigation.
- Do not change other page URLs.
- Do not rewrite other pages.
- Make sure the page is included correctly in the site's page/content wiring and sitemap generation according to the current architecture.
- Run typecheck, build/content validation and relevant verification scripts.

## Acceptance criteria
1. `/cmo-support` renders successfully.
2. H1 and copy clearly establish outsourced marketing support for an existing CMO/marketing leader.
3. The page does not imply Commview is replacing the CMO.
4. `/fractional-cmo` remains the owner of Fractional CMO leadership intent.
5. Search terms are used naturally, not mechanically.
6. Contextual links remain at 4 or fewer.
7. Existing site design system is respected.
8. No unrelated pages are changed.
9. Typecheck and validation pass.

When complete, report:
- files changed
- final title/H1
- contextual links used
- schema added
- validation/typecheck/build results
- any issue encountered

Do not merge.