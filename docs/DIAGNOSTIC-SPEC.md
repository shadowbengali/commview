# COMMVIEW Business Diagnostic — build spec (draft for review)

Status: **draft, for reaction — not approved to build.** Extends the diagnostic
section of `docs/BUILD-PLAN.md`; where they differ, this file records the newer
decision (partial gate + AI personalisation) and flags it.

---

## 1. Purpose

Catch the ~80% of visitors who aren't ready to "book a call": give them a
genuinely useful read on their business across the four capabilities (GTM
Leadership, Growth, Product, Operational AI), and — at the moment their intent
peaks — capture a segmented lead.

### Non-negotiable principles
- **Genuinely useful even to someone who never hires us.** A quiz with a
  foregone conclusion ("you need CommView") is worthless and obvious within three
  questions. Credibility of the free part is what makes the gated part worth an
  email.
- **AI lives in the language layer, never the scoring layer.** Scores are
  deterministic. AI only narrates, personalises and synthesises *around* the
  computed result. It never computes or influences a score.
- **Scores are never gated.** The respondent always sees their four scores and
  weak link for free. Only the prescription is gated.
- British English. No invented advice, no invented scoring thresholds (see §12).

---

## 2. The instrument

- **20 statements**, 5 per capability, answered on a **four-point scale** —
  Not true / Somewhat / Mostly / True. **No neutral midpoint** (that's where
  people hide). ~4 minutes at honest pace.
- Each statement is plain business language, no jargon, no scoring visible during
  the run. Example shape (illustrative, real copy TBD):
  > "We can name the three reasons we lose deals, and they're the same three
  > across the team."
- **One optional free-text question** at the end: *"In a sentence, what's the one
  thing that isn't working right now?"* Drives AI personalisation (§6) and is
  high-value lead data. Optional so it never blocks completion.

`content/diagnostic.*` (or a typed constant) holds the 20 statements + the
answer labels. **Copy to be authored, not invented (§12).**

---

## 3. Scoring

- Four scores **out of 20**, one per capability. Pure functions in
  `lib/diagnostic/scoring.ts`, with unit tests. Not in a component, not in Sanity
  — they will be tuned and tuning needs a test suite.
- The commercially interesting output is the **pattern** (relationship between
  the four scores), not the raw numbers:

  | Pattern | Reading | Result leads with |
  | --- | --- | --- |
  | One capability well below others | Clear weak link | Fix that first, here's the sequence |
  | All four middling | No foundation | Positioning first — everything compounds off it |
  | High GTM, low Product | Selling what the product can't yet carry | The promise/delivery gap |
  | High Growth, low GTM | Efficient spend on the wrong message | The most expensive pattern |
  | All four high | Genuinely in good shape | Say so; name the one marginal gain; don't manufacture a problem |

- Pattern-detection thresholds are **tunable constants with tests** — TBD, not
  guessed here.

---

## 4. Result tiers — the gate

The change from BUILD-PLAN (which argued against gating): a **partial reveal**,
not a full gate. Reconciles lead capture with the abandonment risk.

**Free — shown instantly after the last answer (client-side, no server):**
- The four scores as a small chart
- The pattern *headline* + which capability is the weak link

**Gated — behind email:**
- The full pattern read in prose (AI-personalised — §6)
- Three ranked **first moves**: this week / this month / this quarter
- Two or three Insights articles matched to the weak capability
- A shareable result link (`/diagnostic/result/[id]`)

Rationale: the free scores are the "aha" and prove the tool is real; the
"what do I do about it" is what's worth an email, asked at peak intent.

**Open decision:** exact gate line (see §11).

---

## 5. Flow & architecture

```
/diagnostic                     client component: 20 Qs + free-text, progress bar
   → scores computed client-side (lib/diagnostic/scoring.ts) → instant teaser
   → email gate (email required, company optional, marketing opt-in separate)
   → POST /api/diagnostic
        → store submission (Supabase)
        → generate AI narrative + moves (§6), store against the row
        → CRM upsert via lib/crm adapter, tagged pattern + weakest_capability
        → Resend transactional "your result" email (if consented)
   → redirect to /diagnostic/result/[id]   full, shareable, cached
```

- **`/diagnostic`** — `'use client'`. No CMS read at runtime. Scoring is
  client-side so the teaser is instant.
- **`/diagnostic/result/[id]`** — dynamic, rendered from the stored submission.
  `noindex` (per robots rules). Shareable — a COO forwarding to a CEO is the
  highest-intent event on the site.
- **File map** (aligns with BUILD-PLAN):
  - `app/(site)/diagnostic/page.tsx`, `app/(site)/diagnostic/result/[id]/page.tsx`
  - `app/api/diagnostic/route.ts`
  - `components/diagnostic/*` (question runner, chart, gate, result)
  - `lib/diagnostic/scoring.ts` (+ `scoring.test.ts`), `lib/diagnostic/patterns.ts`
  - `lib/diagnostic/ai.ts` (narrative/moves generation, grounded)
  - `lib/crm/*` (exists), Resend template alongside the contact template

---

## 6. Where AI is used

**Principle again: AI narrates the deterministic result; it never scores.**

### Public-facing
1. **Personalised narrative** (gated). Tailors the pattern prose to their actual
   answers and free-text. The core reason the gated tier feels bespoke.
2. **Tailored first moves** (gated). Re-ranks and rephrases moves from a
   **vetted move library we author** (retrieval, not free invention), adapted to
   their weak sub-areas + free-text.
3. **Semantic article match** (gated). Embeddings match weak capability + context
   to the most relevant Insights, instead of hardcoded links. *(Nice-to-have.)*

### Internal (never shown to the respondent)
4. **Lead summary** to the CRM note: segment, weak link, stated problem, intent,
   suggested talking points. Big sales time-saver, zero public risk.
5. **Draft follow-up email** for a human to review and send. *(Phase 2.)*

### Guardrails
- **Grounded**: constrained to their answers + the vetted move library + our
  content. No free-roaming advice under our name.
- **Deterministic fallback**: if the AI call fails/slows, the templated pattern
  text still renders. The result is never blocked on AI.
- **Generate at the gated step only** — after the email — so we pay for AI only
  on converters, and it doubles as an honest "generating your tailored plan…"
  moment. Cache the output against the result `id`; never regenerate on view.
- **Consistency**: tight system prompt, structured output for the moves, stored
  once so the shareable link is stable.
- **Model**: Claude — Haiku for cost, Sonnet for richer prose (decision in §11).
- **Data terms**: use an API whose terms don't train on the data (Anthropic API).
  Disclose AI processing at the point of capture (§8).

---

## 7. Data model (Supabase, not Sanity)

Submissions are rows, not content — they accumulate and need querying.

`diagnostic_submissions`
| field | type | note |
| --- | --- | --- |
| id | uuid (pk) | powers `/result/[id]` |
| created_at | timestamptz | |
| answers | jsonb | 20 answers |
| scores | jsonb | four scores /20 |
| pattern | text | detected pattern key |
| weakest_capability | text | segmentation key |
| free_text | text | optional stated problem |
| email | text (nullable) | only if given |
| company | text (nullable) | optional |
| marketing_consent | boolean | separate opt-in |
| ai_narrative | jsonb (nullable) | cached generated prose + moves |

CRM (HubSpot free, via `lib/crm` adapter): upsert contact tagged with `pattern`
and `weakest_capability` — the segmentation that lets us email everyone whose
weak link was, say, Operational AI when we publish on it.

---

## 8. Privacy / UK GDPR

- **Two separate consents.** Emailing the result can be justified as fulfilling
  their request; adding them to **marketing** needs its own **unticked** opt-in
  checkbox. Never fold "get your result" into "subscribe."
- Visible privacy notice at the point of capture, including that answers +
  optional free text are processed (and by an AI provider) to generate the result.
- One-click unsubscribe in every marketing email.
- Cookie consent only becomes relevant if cookie-setting analytics go in
  (Plausible avoids it; GA4 doesn't).

---

## 9. Email (transactional)

Resend, React Email template in the repo, styled with the design system —
same path as the contact form. Sends the result + shareable link, only if an
address is given and consented.

---

## 10. Build phases (when approved)

- **Phase A** — `lib/diagnostic/scoring.ts` + `patterns.ts` + unit tests. No UI.
- **Phase B** — the interactive tool + free teaser result, end-to-end, no
  persistence. Fully testable.
- **Phase C** — email gate + Supabase storage + CRM tagging + AI narrative/moves
  + Resend email + shareable `/result/[id]`.

Each phase ships behind the usual gates (typecheck, build, verify) and nothing
goes live half-wired.

---

## 11. Open decisions (need your call)

1. **Gate line** — free = scores + weak link; gated = full prescription. Softer
   (one free move) or harder (chart only)? *Recommend: as stated, tune later.*
2. **Free-text box** — include it? *Recommend: yes — biggest lever for both
   personalisation and lead quality.*
3. **Fields at the gate** — email required, company optional? *Recommend: yes.*
4. **Model** — Claude Haiku (cheap/fast) vs Sonnet (richer)? *Recommend: start
   Haiku, upgrade if prose feels thin.*
5. **Storage** — Supabase (recommended; already wired) vs Vercel Postgres.
6. **AI article matching (#3)** — v1 or defer? *Recommend: defer; hardcode
   matches per weak capability for v1.*

---

## 12. Content to be authored (NOT invented by the build)

Per house rule (`CLAUDE.md`: never invent copy or unsupported claims). These are
the real work and must be written by you / ChatGPT, not fabricated in code:

- The **20 statements** (5 per capability) + answer labels.
- The **scoring thresholds** and pattern-detection cutoffs.
- The **pattern read** base prose per pattern (AI personalises from this).
- The **vetted move library** (the this-week/month/quarter moves AI ranks from).
- The **AI system prompt** tone/guardrails.
- The **result email** copy and the **privacy notice** at capture.

Until these exist, any build uses visible `TODO:` placeholders, not
finished-looking filler.
