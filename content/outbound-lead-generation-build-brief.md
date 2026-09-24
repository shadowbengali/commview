# Build brief: B2B Outbound Lead Generation

## Route
`/growth/outbound-lead-generation`

## Source of truth
Use `content/pages/outbound-lead-generation.md` as the source of truth for copy, metadata, FAQs and internal links.

## Position in the architecture
Growth sub-pillar.

Do not cannibalise:
- `/growth/b2b-lead-generation` which owns broad **b2b lead generation**
- `/growth/demand-generation` which owns **b2b demand generation**
- `/demand-generation` which owns **demand generation consultant**

This page owns **outbound lead generation** and supports **b2b outbound lead generation**, **outsourced SDR services**, **SDR as a service** and **outbound sales services**.

Add it to the Growth service listing/navigation where the existing architecture presents child services.

## Visual idea: the outbound operating system

Do not create another generic service page full of cards.

The page gets ONE primary explanatory visual: a horizontal/scrolling outbound system that shows:

`ICP → ACCOUNTS → SIGNALS → CONTACTS → CONTEXT → OUTREACH → CONVERSATION → QUALIFICATION → AE`

### Desktop
Place the visual immediately after the "Outbound is not a volume problem" section.

It should feel like a live operating system rather than a funnel:
- dark charcoal band/panel
- Growth green `#10B981` is the primary page accent
- thin connectors and precise grid
- white/off-white type
- nodes should be simple labels, not rounded SaaS cards
- "OUTREACH" can branch subtly into EMAIL / LINKEDIN / PHONE, then reconverge at CONVERSATION
- "AI + DATA" can appear as a thin supporting layer underneath RESEARCH/SIGNALS/CONTEXT, not as a magic centrepiece
- human/conversation stage should visually become more prominent towards CONVERSATION / QUALIFICATION / AE
- no decorative illustration or stock photography

### Mobile
Do not squeeze nine nodes horizontally.
Convert the operating system into a clean vertical sequence with the three outreach channels nested under OUTREACH.

## Secondary visual treatment: activity vs commercial signal

Use one restrained data-style section for "What we measure".

Two columns, not a chart:
LEFT: **ACTIVITY**
Calls / Emails / Connections
Small and deliberately muted.

RIGHT: **COMMERCIAL PROGRESSION**
Meaningful engagement → Qualified conversation → Opportunity → Pipeline → Revenue
Larger and Growth green.

This reinforces the page's core argument without adding another complicated diagram.

## Hero

Use established Commview dark hero and header.

Eyebrow:
`GROWTH / OUTBOUND LEAD GENERATION`

H1 exactly as supplied:
`B2B Outbound Lead Generation Built Around the Right Accounts`

Intro copy from source.

Use a restrained right-side visual derived from the operating-system language, for example a field of account nodes where only a small number are highlighted as prioritised. Do NOT add a stock SDR/headset photograph.

Primary CTA:
`Talk to us` → `/contact`

Optional secondary contextual link:
`See B2B lead generation` → `/growth/b2b-lead-generation`

## Section rhythm

1. Dark hero
2. Light: Outbound is not a volume problem
3. Dark: operating-system visual
4. Light: B2B outbound starts before first message
5. Polar/light: multi-channel section, editorial three-channel layout
6. Dark: AI changes the SDR role
7. Light: outsourced SDR / what we build
8. Polar: handoff section
9. Dark or charcoal: measurement contrast
10. Light: when outbound is wrong
11. Light FAQ with rules/dividers, not cards
12. Dark CTA

Keep the overall site ratio and editorial rhythm. Do not make every section same height.

## AI section visual

Keep this typographic rather than diagram-heavy.

Use a split:
**AI / AUTOMATION**
Research
Enrichment
Account context
Prioritisation support
Admin
Workflow

**HUMAN JUDGEMENT**
Conversation
Discovery
Nuance
Qualification
Stakeholders
Commercial judgement

The visual point is redistribution of work, not "AI replaces SDRs".

## Multi-channel section

Do not use three glossy cards.

Use three editorial columns separated by fine rules:
EMAIL
LINKEDIN
PHONE

Underneath all three, one shared line:
`ONE ACCOUNT VIEW / SHARED CONTEXT / ONE CONVERSATION HISTORY`

## FAQ
Use existing FAQ component/pattern. FAQ content must remain visible on page.
Add FAQPage schema if consistent with current implementation.

## Schema
- Service
- FAQPage
- BreadcrumbList
Use existing utilities and conventions.

## Internal links
Retain supplied links and add parent/child linking where natural:
- /growth
- /growth/b2b-lead-generation
- /growth/demand-generation
- /positioning
- /ideal-customer-profile-workshop
- /contact

## Design rules
- Existing Commview header/footer
- Inter
- Growth green `#10B981`
- Charcoal `#0B0F14`
- Polar `#F8FAFC`
- Fine Slate Light rules `#E2E8F0`
- no em dashes in visible copy
- no generic SaaS gradients
- no card soup
- no stock SDR imagery
- no decorative handwritten type
- CTA buttons have no arrows
- use at most the two visual devices specified above
- reuse existing components where possible
- responsive with no horizontal overflow

## Metadata
Use metadata from the page source.
Canonical:
`https://www.commview.co.uk/growth/outbound-lead-generation`

## Acceptance
- route renders
- source copy is preserved
- primary keyword appears naturally in H1/opening
- page clearly distinguishes outbound from broad lead gen and demand gen
- operating-system visual works on desktop and mobile
- Growth accent is correct
- FAQs visible and schema emitted where supported
- internal links work
- page appears in relevant Growth child-service listing
- sitemap includes route when sitemap is enabled
- build/typecheck passes
