# /what-we-do — Commview page definition

## Purpose

This is the service hub for Commview. It is not another long service page and it is not the mega-menu copied into a page.

Its job is to help a buyer who knows something is wrong but does not yet know whether the constraint sits in GTM, Growth, Product or Operational AI.

Core idea:

**The problem determines the work. Not the other way around.**

The page should make the breadth of Commview feel intentional. The four capabilities overlap because business problems overlap.

## SEO

- URL: `/what-we-do`
- Primary keyword: `b2b consulting services`
- Search intent: commercial investigation
- Meta title: `B2B Consulting Services | GTM, Growth, Product & AI | CommView`
- Meta description: `B2B consulting services spanning GTM leadership, growth, product and operational AI. We diagnose what is holding growth back, then help fix it.`
- Canonical: `https://www.commview.co.uk/what-we-do`
- Primary CTA: `Take the Diagnostic`
- Secondary CTA: `Talk to us`
- Schema: Service, FAQPage, BreadcrumbList

The primary keyword must appear naturally in the opening copy. H2s should carry the mapped commercial intent rather than being decorative labels.

## Page story

### Hero

Eyebrow: `WHAT WE DO`

H1:
**Four services. Usually you need more than one.**

Opening:
A growth problem rarely sits neatly inside Marketing.

Sales might say the leads are wrong. Marketing might say the positioning is not landing. Customers might be choosing a competitor for reasons nobody expected. The product might be solving the right problem for the wrong customer. Or the team might be spending hours every week doing work that could be automated.

That is why our **B2B consulting services** span GTM Leadership, Growth, Product and Operational AI.

Not because every business needs all four.

Because you should not have to diagnose the problem before you ask for help.

Primary CTA: `Take the Diagnostic`
Secondary CTA: `Talk to us`

### The problems overlap

This is the key visual and conceptual section.

H2:
**The problems overlap. So does the work.**

Use the existing four-circle overlap/Venn visual:
- GTM Leadership, cyan
- Growth, green
- Product, blue
- Operational AI, pink

The visual should show overlap rather than four isolated service boxes. Do not replace it with a generic card grid.

Supporting idea:
A positioning problem can look like a lead-generation problem. A product problem can look like a conversion problem. An inefficient process can look like a capacity problem. We diagnose the constraint before deciding what kind of work is required.

### GTM Leadership

H2:
**GTM Leadership: turn market decisions into commercial momentum**

Buyer question:
`How do we actually reach and win these customers?`

Explain that GTM Leadership covers the commercial system from market and ICP through positioning, routes to market, demand and pipeline. It can be a focused problem or embedded fractional leadership.

Show a concise selection of areas:
- Fractional CMO Services → `/fractional-cmo/services`
- B2B Positioning → `/positioning`
- Ideal Customer Profile → `/ideal-customer-profile-workshop`

Pillar CTA:
`Explore GTM Leadership` → `/fractional-cmo`

Do not repeat Demand Generation here in the visible service list. It is surfaced globally under Growth to avoid buyer-facing duplication. The GTM demand-generation page can still be linked contextually in body copy where useful.

### Growth

H2:
**B2B Growth: find where the journey from discovery to revenue is breaking**

Buyer question:
`Why is the marketing not producing more growth?`

Do not start with channels. Explain the diagnostic approach from discovery through demand, conversion, pipeline and revenue.

Service links:
- B2B SEO → `/growth/seo`
- AEO & AI Search → `/growth/aeo`
- B2B Lead Generation → `/growth/b2b-lead-generation`
- Demand Generation → `/growth/demand-generation`
- Paid Media → `/growth/paid-media`
- Content Marketing → `/growth/content-marketing`
- Conversion Optimisation → `/growth/conversion-optimisation`

Pillar CTA:
`Explore Growth` → `/growth`

### Product

H2:
**B2B Product Strategy: build the right thing, not just the next thing**

Buyer question:
`Are we building what customers actually need?`

Product decisions start with the customer, the problem and the evidence. Commview can work from discovery and validation through prioritisation, MVP definition and delivery.

Service links:
- Product Strategy Consulting → `/product-strategy/consulting`
- Fractional CPO → `/product-strategy/fractional-cpo`
- Product Discovery → `/product-strategy/discovery`
- MVP Development → `/product-strategy/mvp`
- Product Roadmaps → `/product-strategy/roadmap`

Pillar CTA:
`Explore Product` → `/product-strategy`

### Operational AI

H2:
**AI Consulting: start with the operation, not the technology**

Buyer question:
`Where can AI actually take cost out, increase capacity or make us faster?`

Explain the operational approach. Find repetitive work, manual information movement, slow decisions and underused data. Use AI where it earns its place.

Service links:
- AI for Business Operations → `/ai-consulting/business-operations`
- AI Workflow Automation → `/ai-consulting/workflow-automation`
- AI Automation Consulting → `/ai-consulting/automation`
- AI Implementation → `/ai-consulting/implementation`
- Generative AI Consulting → `/ai-consulting/genai`
- AI Transformation → `/ai-consulting/transformation`

Pillar CTA:
`Explore Operational AI` → `/ai-consulting`

Do not surface `/ai-consulting/uk` as a primary service choice. It is a geographic search landing page and should be reached contextually, through internal links and the sitemap.

### Diagnostic bridge

This is the conversion point and should be visually stronger than another service block.

H2:
**Not sure where the problem sits?**

Copy:
You do not need to choose a service before talking to us. Start with the business problem. The diagnostic helps identify where the constraint is and what is worth looking at first.

CTA:
`Take the Business Diagnostic`

Secondary:
`Talk to us`

### FAQ

Use 4–6 concise questions, 40–60 words per answer, direct answer in the first sentence.

Required questions:
1. What does a B2B consultant actually do?
2. What B2B consulting services does Commview provide?
3. Do I need to know which service I need before contacting you?
4. Does Commview only provide strategy?
5. Can Commview work alongside our existing team?

FAQ answers must reinforce:
- diagnose before prescribing
- strategy and execution stay connected
- operator-led, senior, hands-on
- specialists can be brought in where the problem requires them
- no invented proof, prices, outcomes or team-size claims

## Design direction

Keep the established Commview editorial system.

- Dark hero, strategic light sections, dark/light rhythm
- 1200–1300px centred grid
- Inter
- strong hierarchy and whitespace
- no generic SaaS gradients
- no card soup
- no decorative imagery for its own sake
- no excessive icons
- no duplicated giant headings
- CTA buttons do not use arrows
- capability colours remain fixed: GTM cyan, Growth green, Product blue, Operational AI pink
- one main visual motif: the four-capability overlap
- service sections should feel like editorial chapters, not four landing-page cards

The page should feel like one argument:
**We diagnose the business problem first, then bring the right combination of GTM, Growth, Product and Operational AI to solve it.**

## Relationship to the mega-menu

The mega-menu is navigation. This page is explanation.

Do not simply reproduce the mega-menu layout here.

The column headings in the mega-menu point to the pillar pages:
- GTM Leadership → `/fractional-cmo`
- Growth → `/growth`
- Product → `/product-strategy`
- Operational AI → `/ai-consulting`

`/what-we-do` should remain the service hub linked by the top-level What We Do navigation, and should help a buyer understand why Commview spans all four capabilities.

## Existing implementation

There is already a bespoke `app/(site)/what-we-do/page.tsx` and `styles/what-we-do.css`.

Claude owns implementation files. Treat the current page as the base and refine it against this definition rather than rebuilding the site architecture.

Preserve good existing copy where it matches this brief. Remove unnecessary duplication, make the overlap/diagnostic logic clearer, and ensure all visible service links resolve to the current built routes.

No em dashes. British English throughout.
