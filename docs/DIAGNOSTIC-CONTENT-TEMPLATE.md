# Business Diagnostic — content bank to author

The engine is data-driven and adaptive: it starts at `start`, and after each
answer it follows that answer's `next` to the following question (or to `end`).
Every answer can also drop an **evidence** item into the "What we've heard"
panel, and every question belongs to one **section** so "Building the picture"
can light up.

Author the bank below. Don't worry about writing valid code — paste it in this
shape (or as prose that follows it) and it will be wired in verbatim. **Nothing
is invented in code; only what you provide is used.**

---

## 1. Sections (fixed — order shown in the sidebar)

| id | label |
| --- | --- |
| business-context | Business context |
| market-customers | Market & customers |
| growth-revenue | Growth & revenue |
| product-value | Product & value |
| operations-efficiency | Operations & efficiency |

- `start`: id of the first question — e.g. `bc-1`
- `estimatedQuestions`: the number behind "3 of ~10" — e.g. `10`

---

## 2. Each question

```
id:        short unique key, e.g. gr-1
section:   one of the five section ids above
lead:      (optional) context line above the prompt, e.g.
           "You mentioned growth has stalled."
prompt:    the question, e.g. "Which best describes what you're seeing?"
type:      single | multi | text
options:   (single/multi only) a list — for each option:
   - label:        "Fewer opportunities entering the pipeline"
   - description:  "We're generating fewer leads than before."   (optional)
   - evidence:     what this answer adds to "What we've heard":
        title: "Growth has flattened"
        sub:   "Noticed over the last six months."   (optional)
   - next:         id of the next question, OR a section id, OR "end"
                   (optional — falls back to the question's `next`)
   - freeText:     true if choosing it opens a "tell us more" box (e.g. "Something else")
placeholder: (text questions only) grey hint text in the box
next:      default next step if an option doesn't set its own
optional:  true if the question can be skipped
```

### Worked example (the one question from the mock — already in the right shape)

```
id: gr-1
section: growth-revenue
lead: "You mentioned growth has stalled."
prompt: "Which best describes what you're seeing?"
type: single
next: gr-2            # default; override per option if the path should branch
options:
  - label: "Fewer opportunities entering the pipeline"
    description: "We're generating fewer leads than before."
    evidence: { title: "Fewer opportunities entering pipeline", sub: "Top-of-funnel down." }
    next: gr-2
  - label: "Plenty of leads, but fewer become opportunities"
    description: "Lead volume is similar, but conversion to opportunities has dropped."
    evidence: { title: "Lead-to-opportunity conversion down" }
    next: gr-2
  - label: "Opportunities are there, but fewer become customers"
    description: "We're progressing opportunities, but win rates have declined."
    evidence: { title: "Win rate declined" }
  - label: "Deals are taking longer to close"
    description: "The pipeline is there, but sales cycles are longer."
    evidence: { title: "Sales cycles lengthening" }
  - label: "Existing customers aren't growing"
    description: "New business is flat and expansion from existing customers has slowed."
    evidence: { title: "Expansion revenue slowed" }
  - label: "We're not sure yet"
    description: "We can see the outcome, but we're not sure where the change is happening."
  - label: "Something else"
    description: "Tell us more about what you're seeing."
    freeText: true
```

Do this for every question (~10). If a question has no branching, just give it a
single `next` and leave the options without their own `next`.

---

## 3. The free teaser (shown instantly at the end, no email)

This is all the visitor gets for free in v1: their scores + the headline reading
+ their weak link. Please provide:

1. **How answers become a reading.** Either:
   - simple: "if evidence X and Y are present, show reading A", or
   - a small score per section (which option adds points to which section), and
     the reading is chosen from the pattern (e.g. lowest section = weak link).
   Whichever you prefer — tell me the rule.
2. **The readings themselves** — for each possible outcome:
   - `headline`: one line, e.g. "The issue is conversion, not demand."
   - `weakLink`: which capability/section it points at
   - `summary`: 1–2 sentences shown free
   - (the deeper prescription / ranked moves stay for the later gated phase)
3. **The closing CTA copy** under the teaser (e.g. "Talk to us" / "See how we
   work") — or I reuse the site's standard pairing.

---

## What I need from you to finish the build

- [ ] `start` id + `estimatedQuestions`
- [ ] All ~10 questions in the shape above (sections, prompts, options, evidence, branching `next`)
- [ ] The teaser rule + readings (section 3)

Paste it however is easiest — this file's shape, or raw from ChatGPT — and I'll
wire it in, then build the runner (two-column layout: question + options on the
left, "Building the picture" progress and "What we've heard" evidence on the
right), the adaptive engine, and the free teaser, all against real copy.
