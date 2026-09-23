# Contact page redesign brief

## Status

This brief supersedes the visually overcomplicated contact-page direction in PR #10.

Claude should use the existing form delivery/API work from PR #10 where useful, but rebuild the visible page to the simpler direction below.

## Goal

Build a contact page that feels unmistakably Commview without turning a simple contact action into a diagnostic product.

The page has one job: make it easy for somebody with a business problem to start a conversation.

It should feel premium, direct and calm. The visual interest comes from typography, composition, whitespace and one strong brand graphic, not from multiple interactions, cards or diagrams.

## Non-negotiables

- URL: `/contact`
- Use the established Commview header and footer.
- Use the correct production Commview logo. Do not recreate or approximate it.
- Brand language must match the existing site.
- No em dashes.
- Do not add a service picker.
- Do not add the five problem-selection cards from the earlier contact concept.
- Do not add a diagnostic flow.
- Do not add testimonials, service grids or generic trust blocks.
- Do not use stock photography.
- Do not turn the page into a SaaS form UI.
- Keep the page visually restrained.
- One main decorative visual only.
- Form submissions must be sent server-side to `info@commview.co.uk`.
- The visible email address is also `info@commview.co.uk`.
- Do not expose the plain email address in server-rendered HTML. Assemble/reveal it client-side for the visible mail link to reduce basic scraper harvesting. This is obfuscation, not a security guarantee.
- Keep the honeypot field from PR #10 or equivalent lightweight spam protection.
- Never report a successful form submission unless the server-side mail provider confirms it.

## Overall composition

The page should have four content chapters plus the normal footer:

1. Dark hero
2. Light contact/form section
3. Light "what happens next" strip
4. Dark closing contact band
5. Existing site footer

Do not introduce additional sections unless technically required.

---

## 1. Hero

### Visual

Full-width charcoal/dark hero.

Left side carries the message.

Right side contains one large, abstract Commview slash/signal visual using the brand gradient:

`#00E5FF -> #5B4DF5 -> #EC4899`

It should feel architectural and deliberate, not like a glowing SaaS orb. A simple angled slash, beam or line is enough.

Small supporting words may sit near the visual:

INSIGHT  
MOMENTUM  
IMPACT

Do not turn these into cards or a process diagram.

### Copy

Eyebrow:

**TALK TO US**

H1:

**What's not working?**

Use gradient/accent treatment on "not working?" if it looks strong in production.

Body:

**You don't need a brief. You don't need to know which service you need. You just need to tell us what's happening and what you'd like to be different.**

Primary CTA:

**Send us a message**

CTA scrolls to/focuses the form rather than navigating elsewhere.

Optional small reassurance beneath CTA:

**A conversation, not a sales sequence.**

Do not promise a response time unless the business has explicitly approved one.

---

## 2. Contact form

Light Polar/white section. This is the functional centre of the page.

Use a two-column editorial split on desktop.

### Left column

Eyebrow:

**GET IN TOUCH**

H2:

**Tell us what's going on.**

Supporting copy:

**The more context you can share, the better we can help. A few sentences is enough.**

Then show:

**Or email us directly at**  
`info@commview.co.uk`

Email must be client-side assembled/obfuscated as described above.

Location:

**Manchester, UK**

Keep this column spacious. Do not fill the whitespace with icons or decorative cards. A tiny line icon for email/location is acceptable if it matches the site's existing stroke language.

### Right column form

Fields in this order:

1. **What's happening?**
   - textarea
   - required

2. **What would you like to be different?**
   - textarea
   - required

3. **Your name**
   - text
   - required

4. **Work email**
   - email
   - required

5. **Company**
   - text
   - optional

No phone number.
No budget field.
No service dropdown.
No "how did you hear about us?"
No forced marketing consent checkbox.

Submit:

**Send to Commview**

Submission UX:
- clear sending state
- clear success state
- clear failure state with the direct email option
- keyboard accessible
- visible focus styles
- labels must remain labels, not placeholders only

### Delivery

Use the server-side delivery implementation from PR #10 as the starting point.

Recipient:

`info@commview.co.uk`

Use environment variables for provider credentials.

If using Resend:
- `RESEND_API_KEY`
- verified `commview.co.uk` sending domain
- sensible sender such as `Commview website <website@commview.co.uk>`
- reply-to should be the visitor's submitted work email

Do not put provider secrets in client code.

---

## 3. What happens next

Light section, visually connected to the form section rather than feeling like another landing-page chapter.

Eyebrow:

**WHAT HAPPENS NEXT**

H2:

**A straightforward conversation.**

Use three horizontally connected steps on desktop. This is a thin line and typography treatment, not three boxed cards.

### 01

**We read it.**

A real human reads your message. Not a bot. Not an automated qualification engine.

### 02

**We'll tell you what we think.**

If we think we can help, we'll arrange a conversation. If we don't, we'll tell you that too.

### 03

**Then we decide what happens next.**

That might be a diagnostic, a defined piece of work, or simply pointing you in the right direction.

Use the Commview capability spectrum subtly across the connector:
cyan -> blue/purple -> pink.

---

## 4. Closing contact band

Dark charcoal.

Eyebrow:

**PREFER TO JUST TALK?**

H2:

**Let's have a conversation.**

Copy:

**Email us at info@commview.co.uk or connect on LinkedIn.**

Email must use the same client-side obfuscation approach.

Provide a restrained LinkedIn action if the real Commview LinkedIn URL is already configured in the repo. Do not invent a URL. If no verified URL exists, leave a TODO for the client rather than linking to `#`.

Do not add a booking/calendar CTA unless a real booking destination has been supplied.

---

## Visual rules

This page should feel like the same website as How We Work, What We Do and the service pages.

- Inter
- strong editorial typography
- large H1
- dark/light chapter rhythm
- Polar `#F8FAFC`
- Charcoal `#0B0F14`
- Cyan `#00E5FF`
- wider brand gradient `#00E5FF -> #5B4DF5 -> #EC4899` only where useful
- fine rules rather than card borders
- no rounded SaaS cards
- no glassmorphism
- no excessive shadows
- no generic gradient blobs
- no decorative illustration beyond the single hero signal/slash
- generous whitespace
- compact overall page length

The intended feeling is:

**easy to contact, senior, calm, confident**

Not:

**interactive lead-generation funnel**

## Responsive behaviour

Mobile should simplify naturally:
- hero becomes single column
- slash visual can reduce in scale or move behind/to the side without hurting legibility
- form becomes single column
- name/email fields stack
- three next steps stack vertically with the connecting line becoming vertical or disappearing
- maintain generous but not excessive mobile spacing

## Metadata

Suggested title:

**Contact Commview | Talk to a B2B GTM, Growth, Product & AI Consultant**

Suggested description:

**Tell Commview what's not working. Start with the business problem and we'll work out what should happen next. Based in Manchester, working with B2B businesses across the UK.**

Canonical:

`https://www.commview.co.uk/contact`

Do not force keyword stuffing into visible page copy. This is primarily a conversion/contact page.

## Acceptance criteria

The build is complete when:

- `/contact` renders with the established shared header/footer.
- The visual hierarchy matches this simplified brief.
- There are no problem-selection cards.
- There are no unnecessary additional page sections.
- The form successfully delivers a real test submission to `info@commview.co.uk` after deployment credentials are configured.
- Direct email links resolve to `info@commview.co.uk` without printing that plain address into the initial server-rendered HTML.
- Form has a honeypot or equivalent lightweight spam defence.
- Success/failure states are truthful.
- Desktop and mobile are visually coherent.
- No invented LinkedIn/calendar URLs.
- No em dashes.
- Typecheck/build passes.
