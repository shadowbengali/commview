# Commview keyword-depth implementation brief

## Objective

Apply the keyword-led content additions in this folder to the existing production pages without rewriting good content or creating duplicate routes.

Files:
- `growth.md` → `/growth`
- `aeo.md` → `/growth/aeo`
- `ai-consulting.md` → `/ai-consulting`

These changes come from the original Commview page architecture: primary keyword → secondary/search-intent cluster → H2/H3 structure → supporting copy. Do not add sections merely to increase word count.

## Priority

### 1. /growth
This is the substantive expansion. Restore explicit coverage for:
- `b2b marketing problems`
- `b2b marketing agency engagement`
- sufficient standalone explanation of the seven Growth services

### 2. /growth/aeo
This is a refinement, not a rewrite. Strengthen:
- `aeo vs seo`
- `aeo services`
- `b2b aeo`

Protect the distinct transactional intent of `/growth/aeo/services`.

### 3. /ai-consulting
This is a refinement. Strengthen:
- `ai for business`
- `ai for business operations`
- `ai consulting services`

Do not duplicate the child pages.

## Content rules

- British English.
- No em dashes in visible copy.
- Do not invent claims, client relationships, testimonials, prices, ROI, timelines or guarantees.
- Preserve approved proof already on the production pages.
- ADI organic traffic is +60% wherever that proof is used.
- Vodafone, ADI, Distrelec and other experience logos/results represent operator/network experience unless explicitly documented as Commview client work.
- Do not guarantee AI citations or SEO rankings.
- Do not claim FAQ schema guarantees rich results.
- Keep page-level keyword ownership intact and avoid cannibalisation.
- Do not create `/growth/seo/b2b`.

## Global design system

Commview should feel strategic, modern, confident, commercial, clear and premium without becoming sterile.

### Layout
- Editorial rhythm + precision grid.
- Rough page rhythm: 55% light/neutral, 35% dark, 10% colour.
- 1200–1300px content grid where consistent with the existing site.
- Use asymmetry, whitespace, typography and fine rules before reaching for containers.
- Alternate chapters rather than presenting every section as a card.

### Typography
- Inter.
- Headlines 700–800.
- Section headings 600.
- Labels/nav 500.
- Body 400.
- Strong scale and hierarchy.

### Colour
- Charcoal `#0B0F14`
- Cyan `#00E5FF` as signature
- Polar `#F8FAFC`
- White `#FFFFFF`
- Slate Dark `#1F2937`
- Slate `#94A3B8`
- Slate Light `#E2E8F0`
- Growth `#10B981`
- Product `#3B82F6`
- Operational AI `#EC4899`
- `#5B4DF5` is a secondary brand colour, not the Growth or AI capability colour.

### Avoid
- card soup
- generic SaaS gradients
- excessive neon
- heavy shadows or gloss
- glassmorphism
- stock imagery
- robot/brain AI clichés
- decorative diagrams with no explanatory job
- handwritten slogans
- arrows in CTA buttons
- changing the production logo

### Visual rule
Use no more than two major visual devices per page. Every visual must explain something in the copy.

## Implementation workflow for Claude

1. Pull latest branch and inspect the actual production component/content for each target route.
2. Treat the files in `content/keyword-depth/` as insertion/refinement copy, not replacement page files.
3. Compare supplied copy with current copy and avoid duplicate paragraphs/sections.
4. Preserve working metadata, canonical, schema, FAQs, internal links and proof.
5. Implement the specified section hierarchy and natural keyword coverage.
6. Keep existing shared components when they already match the design system.
7. Check all internal links.
8. Run lint/typecheck/build available in the repo.
9. QA desktop and mobile.
10. Report exactly what was changed on each route and flag any conflict rather than silently changing keyword ownership.

## Acceptance criteria

- `/growth` clearly covers the two missing intent clusters and has useful service depth.
- `/growth/aeo` naturally covers AEO vs SEO, AEO services and B2B AEO without duplicating the services child.
- `/ai-consulting` naturally covers AI for business, AI for business operations and AI consulting services without duplicating its children.
- No invented proof or unsupported claims.
- No new cannibalising routes.
- Design remains recognisably Commview rather than generic SaaS.
