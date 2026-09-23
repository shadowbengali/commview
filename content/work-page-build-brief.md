# Work page build brief

## Source of truth

Build the Commview `/work` page from this brief.

The visual reference is the **earlier approved mock-up**, not the later denser redesign. The approved reference is the version with:
- dark hero headed **Real problems. Real progress.**
- Current Engagements immediately below the hero
- six live workstreams in a spacious two-column editorial list
- Proven Work below that
- capability filter
- six compact case-study cards with company logos
- dark closing CTA

Reference image supplied separately by ChatGPT/user: **gen_id ac896b56-a83b-49f9-be66-c8d8cff68fce**. If the image is available as an attachment in the implementation handoff, use it as the visual reference. Do not use the later mock-up `7227170b-ca9a-4679-8afe-2d291b3878f6`.

Match the existing Commview site system rather than recreating the mock-up literally. Reuse the real header, footer, logo, typography, spacing tokens and responsive patterns already in the repo.

## Page purpose

This is evidence of delivery, not a client directory.

The unit of evidence is the **problem/workstream**. One organisation can create several separate workstreams where the problem, skills and outcomes are different.

The page should communicate:
1. what Commview is working on now
2. the breadth of problems and capabilities involved
3. evidence of previous delivery and measurable outcomes
4. an easy route to talk about a similar problem

Do not explain whether work was delivered in-house, consulting, fractional or through an agency. Experience and delivery are the point.

## Design principles

- Keep the page calm, editorial and spacious.
- No selected-outcomes strip between hero and current work.
- No large stock/abstract images on case-study cards.
- Historical work uses company logos.
- Current work does **not** use company logos because the organisations remain anonymous.
- Current engagements are a typographic/editorial list, not six SaaS cards.
- Thin rules, whitespace and hierarchy should do most of the visual work.
- Avoid heavy shadows, glassmorphism, rounded card soup and generic SaaS styling.
- Use the established Commview dark/light rhythm.
- Inter typography.
- No em dashes anywhere in visible copy.
- Capability colours:
  - GTM Leadership: #00E5FF
  - Growth: #10B981
  - Product: #3B82F6
  - Operational AI: #EC4899
- Wider hero gradient may use #00E5FF -> #5B4DF5 -> #EC4899 sparingly.

## Page order

1. Existing site header
2. Dark hero
3. Current engagements / What we're working on now
4. Proven work / Selected case studies + filter
5. Dark closing CTA
6. Existing site footer

Do not add a separate Selected Outcomes section.

---

# 1. Hero

Eyebrow:
**WORK**

H1:
**Real problems.**
**Real progress.**

Treat `Real progress.` with the restrained Commview cyan/purple/pink gradient.

Intro:
**From live engagements to proven outcomes, this is the work we do across GTM, growth, product and operational AI.**

Right side:
Use the established Commview diagonal slash/signal visual. Keep it simple. Optional small labels:
- INSIGHT
- MOMENTUM
- IMPACT

Small supporting line:
**Different problems. Same approach.**

Do not create another diagram.

---

# 2. Current engagements

Eyebrow:
**CURRENT ENGAGEMENTS**

H2:
**What we're working on now.**

Supporting copy:
**Live work. Different problems. Different capabilities.**

**A snapshot of the problems we're working on right now. Some sit inside the same organisation. We show them separately because the work, expertise and outcomes are different. We'll publish the results when there's something useful to share.**

Layout:
- six numbered workstreams
- two columns on desktop
- one column on mobile
- generous vertical spacing
- thin horizontal/vertical rules
- capability label in its authoritative accent colour
- small `IN PROGRESS` status
- no logos
- no card imagery
- no click-through required yet

### 01 / Operational AI
Title:
**Making agency reporting faster with AI**

Copy:
**Helping a digital agency redesign its reporting process around AI, identifying where repetitive analysis and reporting work can be accelerated while keeping human review and judgement in the loop. The work includes data analysis, insight generation, workflow design and creating a repeatable approach the wider team can use.**

Status:
**IN PROGRESS**

### 02 / Product
Title:
**Building a property management platform**

Copy:
**Supporting an estate agency to design and build its own property management platform, from discovery and workflow mapping through to requirements and delivery. The product brings core property operations together with Open Banking and third-party services for background checks, AML and related processes.**

Status:
**IN PROGRESS**

### 03 / Operational AI
Title:
**Putting AI into a legal environment**

Copy:
**Working with a solicitors' firm on practical AI adoption, including governance, guardrails, model selection and defining the outputs different users actually need. Translating those requirements into workflows, specifications and user stories so AI can be introduced in a controlled, useful way.**

Status:
**IN PROGRESS**

### 04 / Growth
Title:
**Building an EMEA growth engine**

Copy:
**Developing an integrated growth strategy for a furniture business across EMEA, connecting SEO, social, email and paid media rather than treating them as separate channels. The work also covers measurement and understanding where digital activity influences demand across a more complex B2B buying journey.**

Status:
**IN PROGRESS**

### 05 / Growth
Title:
**SEO, AEO and GEO across multiple markets**

Copy:
**Supporting a digital agency on SEO, AEO and GEO strategy across B2B, hospitality and leisure, spanning the UK, UAE, Asia and America. The work covers technical foundations, search demand, content, entity visibility, AI discovery and measurement.**

Status:
**IN PROGRESS**

### 06 / GTM Leadership
Title:
**Helping startups find their route to market**

Copy:
**Supporting several startups with the commercial questions that come before scaling demand, including ICP, positioning, proposition, product-market fit, messaging, buying journeys and the GTM model needed to turn a product into a repeatable commercial proposition.**

Status:
**IN PROGRESS**

---

# 3. Proven work

Eyebrow:
**PROVEN WORK**

H2:
**Selected case studies.**

Supporting copy:
**Different challenges. Same principle. Understand what's actually going on, get the right thing moving, and prove what changed.**

## Filter

Build a simple client-side capability filter:
- All
- GTM Leadership
- Growth
- Product
- Operational AI

Requirements:
- no page reload
- each case study can have multiple capability tags
- filter by tag
- accessible buttons with selected state
- default All
- keep the filter visually understated
- do not add filters for company, industry, year or engagement type

Case-study data should be structured rather than hard-coded into repeated bespoke markup so more entries can be added later.

Until full detail pages are built, do not create broken links. If a real `/work/[slug]` route is not being implemented in this build, render the case study as non-linked evidence or use a clearly non-interactive `Case study coming` treatment. Never use `#`.

## Case studies

Use company logos, preferably existing brand assets where available. If a logo asset is not in the repo, use a clean text wordmark placeholder and leave a TODO for the real approved asset. Do not invent distorted logos.

### 01 / Vodafone Business V-Hub
Capabilities:
- GTM Leadership
- Growth
- Product
- Operational AI

Headline:
**Scaling a B2B platform from 2 to 10 markets**

Summary:
**Built and scaled a multi-market B2B platform and operating model, connecting product, GTM, demand, customer journeys, data and AI across ten operating companies.**

Outcomes:
- **45,000 users**
- **£3m marketing-influenced pipeline**
- **£7m -> £3.5m run costs**
- **Onboarding 1% -> 2.7%**

Additional evidence available for later detail page:
- 6,000+ MQLs annually
- 1,000+ SQLs
- £690k annual AI savings
- AI content optimisation lifted return visits 26% in four months

### 02 / Vodafone Business Cybersecurity
Capabilities:
- GTM Leadership
- Growth

Headline:
**Rebuilding a stalled cybersecurity growth engine**

Summary:
**Repositioned the proposition around customer outcomes, rebuilt demand generation and tightened sales alignment and pipeline governance across EMEA.**

Outcomes:
- **€9m qualified pipeline from €2m budget**
- **£75k -> £5m UK qualified pipeline**
- **£1.2m closed in nine months**

### 03 / ADI Global Distribution
Capabilities:
- Growth
- Product

Headline:
**Growing an £80m B2B ecommerce operation**

Summary:
**Led digital growth across a multi-market B2B ecommerce operation, combining technical SEO, lifecycle marketing, conversion optimisation, product data and customer journey improvements.**

Outcomes:
- **+60% organic traffic**
- **+48% email engagement**
- **+17% conversion**
- **£80m digital P&L**

Important: **60% is the approved ADI organic-growth figure. Do not use the old 800% figure anywhere.**

### 04 / Distrelec
Capabilities:
- Growth
- Operational AI

Headline:
**Fixing European marketing operations**

Summary:
**Stabilised marketing operations across 15 European markets and 17 languages, improving delivery speed, supplier-funded marketing and translation efficiency.**

Outcomes:
- **3 weeks -> 1 week campaign cycle**
- **£400k annual translation saving**
- **£1.1m -> £1.4m supplier-funded MDF revenue**

### 05 / Money Advisor
Capabilities:
- Growth
- Product

Headline:
**Turning digital acquisition into a system**

Summary:
**Rebuilt the website and customer journeys for an FCA-regulated financial services business, connecting acquisition, CRO, CRM triggers and automated follow-up.**

Outcomes:
- **+15% conversion**
- **+23% qualified lead volume**
- **Cost per lead £85 -> £48**

### 06 / Travis Perkins / Scruffs Workwear
Capabilities:
- Growth
- Product

Headline:
**Building digital commerce from the ground up**

Summary:
**Delivered the first B2B ordering portal and launched Scruffs Workwear direct to consumer, combining ecommerce, acquisition and marketing automation.**

Outcomes:
- **22% of online revenue from B2B ordering portal**
- **22% incremental D2C revenue**
- **Email open rate 12% -> 32%**
- **Social following 2,500 -> 50,000 in 12 months**

---

# 4. Closing CTA

Dark section.

Eyebrow:
**LET'S TALK**

H2:
**Got a similar problem?**

Copy:
**Bring us the question. We'll find the answer.**

CTA:
**Talk to us**
Destination:
`/contact`

Keep this compact. Use one restrained cyan/gradient line or slash as the visual accent.

---

# Metadata

URL:
`/work`

Primary search topic:
`b2b consulting case studies`

Suggested title:
**B2B Consulting Case Studies | GTM, Growth, Product & AI | Commview**

Suggested description:
**See how Commview has solved B2B GTM, growth, product and operational AI problems, plus the live work we're tackling now.**

Canonical:
`https://www.commview.co.uk/work`

The visible H1 should remain the stronger editorial headline `Real problems. Real progress.`. Do not awkwardly keyword-stuff it. If the site's SEO/content validation requires the target term, handle that in metadata/structured content without damaging the approved design.

Schema:
- BreadcrumbList
- ItemList or CollectionPage for the work index if consistent with existing schema patterns
- do not invent Review or AggregateRating schema

---

# Responsive behaviour

Desktop:
- hero editorial split
- current work two columns
- case studies three columns
- filter in a single understated row where space allows

Mobile:
- hero one column
- slash reduced or repositioned
- current work one column
- filter horizontally scrollable or cleanly wrapping
- case studies one column
- preserve generous spacing without huge empty areas

---

# Acceptance criteria

- Uses the earlier approved visual direction, not the later denser mock-up
- No Selected Outcomes strip
- Current engagements directly below hero
- Six current workstreams, anonymous and separated by problem/workstream
- Current engagements have no company logos
- Proven work has company logos/text wordmarks
- Capability filter works without reload
- Multi-tag filtering works correctly
- No invented case-study URLs
- No broken `#` links
- No em dashes
- ADI organic growth is 60%, never 800%
- Existing Commview header/footer and brand system reused
- Correct capability accent colours
- Accessible controls and focus states
- Mobile layout works
- Typecheck/build passes
