// COMMVIEW Business Diagnostic — the AI interpretation layer.
//
// This does NOT diagnose. The deterministic spine (spine.ts) owns the reading,
// the evidence, the strength and the journey. This layer only writes the prose
// around those facts: the headline wording, the initial read, the "what doesn't
// quite add up" insights, where we'd investigate first, the single first move,
// and the optional "what we wouldn't do yet". It is grounded strictly on the
// spine — it cannot invent a metric, a cause or a score.
//
// Output is validated against a fixed shape. If OpenAI is unavailable, returns
// thin output twice, or fails validation, a deterministic fallback built from
// the spine is returned instead, so the page is never blocked or malformed.

import type { Spine } from "./spine";

export const ANALYSIS_VERSION = 1;

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export interface InsightCard {
  headline: string;
  explanation: string;
}
export interface InvestigationPriority {
  title: string;
  question: string;
  explanation: string;
  whyItMatters: string;
  evidenceType: "signal" | "hypothesis" | "gap";
}
export interface FirstMove {
  title: string;
  explanation: string;
  questionsToAnswer: string[];
}
export interface WhatNotToDo {
  title: string;
  explanation: string;
}
export interface Analysis {
  headline: string;
  initialRead: string;
  summary: string[];
  insights: InsightCard[];
  investigationPriorities: InvestigationPriority[];
  recommendedFirstMove: FirstMove;
  whatNotToDoYet: WhatNotToDo | null;
}

export function aiConfigured(): boolean {
  return !!OPENAI_KEY;
}

// ---- helpers ----
function clamp(v: unknown, max: number): string {
  return String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}
function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
function stripTrailingDot(s: string): string {
  return s.replace(/\.+$/, "");
}

// ---- validation / normalisation ----
const EVIDENCE_TYPES = new Set(["signal", "hypothesis", "gap"]);

function normalise(raw: unknown, spine: Spine): Analysis {
  const o = (raw ?? {}) as Record<string, unknown>;

  const summary = Array.isArray(o.summary)
    ? o.summary.map((p) => clamp(p, 340)).filter(Boolean).slice(0, 3)
    : [];

  const insights: InsightCard[] = Array.isArray(o.insights)
    ? o.insights
        .filter((c): c is Record<string, unknown> => !!c && typeof c === "object")
        .map((c) => ({ headline: clamp(c.headline, 90), explanation: clamp(c.explanation, 280) }))
        .filter((c) => c.headline && c.explanation)
        .slice(0, 3)
    : [];

  const investigationPriorities: InvestigationPriority[] = Array.isArray(o.investigation_priorities)
    ? o.investigation_priorities
        .filter((p): p is Record<string, unknown> => !!p && typeof p === "object")
        .map((p) => ({
          title: clamp(p.title, 60),
          question: clamp(p.question, 140),
          explanation: clamp(p.explanation, 280),
          whyItMatters: clamp(p.why_it_matters, 220),
          evidenceType: (EVIDENCE_TYPES.has(String(p.evidence_type))
            ? String(p.evidence_type)
            : "hypothesis") as InvestigationPriority["evidenceType"],
        }))
        .filter((p) => p.title && p.question)
        .slice(0, 3)
    : [];

  const fmRaw = (o.recommended_first_move ?? {}) as Record<string, unknown>;
  const recommendedFirstMove: FirstMove = {
    title: clamp(fmRaw.title, 80),
    explanation: clamp(fmRaw.explanation, 340),
    questionsToAnswer: Array.isArray(fmRaw.questions_to_answer)
      ? fmRaw.questions_to_answer.map((q) => clamp(q, 130)).filter(Boolean).slice(0, 5)
      : [],
  };

  let whatNotToDoYet: WhatNotToDo | null = null;
  const wnRaw = o.what_not_to_do_yet as Record<string, unknown> | null | undefined;
  if (wnRaw && typeof wnRaw === "object") {
    const title = clamp(wnRaw.title, 80);
    const explanation = clamp(wnRaw.explanation, 320);
    if (title && explanation) whatNotToDoYet = { title, explanation };
  }

  const analysis: Analysis = {
    headline: clamp(o.headline, 90) || spine.headline,
    initialRead: clamp(o.initial_read, 170) || defaultInitialRead(spine),
    summary: summary.length ? summary : [spine.summary],
    insights,
    investigationPriorities,
    recommendedFirstMove,
    whatNotToDoYet,
  };

  // A usable analysis must have a first move and at least one priority.
  if (!analysis.recommendedFirstMove.title || !analysis.investigationPriorities.length) {
    throw new Error("analysis missing first move or priorities");
  }
  return analysis;
}

// ---- deterministic fallback (built entirely from the spine) ----
function defaultInitialRead(spine: Spine): string {
  return `The strongest signal appears to sit around ${lowerFirst(spine.weakLink)}.`;
}

function fallbackFirstMove(spine: Spine): FirstMove {
  return {
    title: `Make ${lowerFirst(spine.weakLink)} measurable`,
    explanation: `Before committing budget, establish exactly where ${lowerFirst(
      spine.weakLink
    )} is breaking down and whether the pattern is consistent across the business.`,
    questionsToAnswer: spine.unknowns
      .slice(0, 4)
      .map((u) => stripTrailingDot(u.statement))
      .filter(Boolean),
  };
}

function fallbackPriorities(spine: Spine): InvestigationPriority[] {
  const out: InvestigationPriority[] = [];
  if (spine.strongestSignals[0]) {
    out.push({
      title: spine.weakLink,
      question: `Where does ${lowerFirst(spine.weakLink)} actually break down?`,
      explanation: `Establish whether the issue begins upstream or only appears later in the journey.`,
      whyItMatters: `Acting before this is answered risks putting effort into the wrong stage.`,
      evidenceType: "signal",
    });
  }
  if (spine.unknowns[0]) {
    out.push({
      title: "Close the biggest gap",
      question: stripTrailingDot(spine.unknowns[0].statement) + "?",
      explanation: `The evidence here is currently thin, so it carries the highest information value.`,
      whyItMatters: `A confident conclusion isn't possible until this is measured.`,
      evidenceType: "gap",
    });
  }
  if (spine.complicating[0]) {
    out.push({
      title: "Rule out the second cause",
      question: stripTrailingDot(spine.complicating[0].statement) + "?",
      explanation: `Test whether this is contributing before treating the primary signal in isolation.`,
      whyItMatters: `More than one factor may be in play.`,
      evidenceType: "hypothesis",
    });
  }
  return out.slice(0, 3);
}

const DEMAND_CAUTION = new Set(["conversion", "evidence_gap", "insufficient", "icp_fit"]);

function fallbackWhatNotToDo(spine: Spine): WhatNotToDo | null {
  if (DEMAND_CAUTION.has(spine.readingId)) {
    return {
      title: "Increase acquisition spend",
      explanation: `There isn't yet enough evidence that insufficient demand is the primary constraint. Spending more on acquisition before understanding what happens downstream could simply push more volume into the same problem.`,
    };
  }
  return null;
}

function fallbackInsights(spine: Spine): InsightCard[] {
  const cards: InsightCard[] = [];
  for (const c of spine.contradictionSeeds.slice(0, 3)) {
    cards.push({
      headline: c.statement,
      explanation: `This is worth investigating rather than assuming, because it changes where the real constraint is likely to sit.`,
    });
  }
  if (!cards.length && spine.complicating[0]) {
    cards.push({
      headline: spine.complicating[0].statement,
      explanation: `It doesn't prove causation, but it makes the relationship worth testing before acting on the primary signal.`,
    });
  }
  return cards.slice(0, 3);
}

export function buildFallbackAnalysis(spine: Spine): Analysis {
  return {
    headline: spine.headline,
    initialRead: defaultInitialRead(spine),
    summary: [spine.summary],
    insights: fallbackInsights(spine),
    investigationPriorities: fallbackPriorities(spine),
    recommendedFirstMove: fallbackFirstMove(spine),
    whatNotToDoYet: fallbackWhatNotToDo(spine),
  };
}

// ---- OpenAI ----
const SYSTEM = `You are a senior B2B commercial operator writing the first page of a piece of consulting work for a business leader. They have completed a structured diagnostic; you are handed the deterministic findings and must write the interpretation around them.

Hard rules:
- British English. No em dashes.
- Ground everything in the findings provided. Never invent metrics, time periods, causes, customer behaviour, sales feedback, product changes or commercial impact that are not in the findings.
- Keep the reading, weak link, evidence strength and journey exactly as given. Do not restate a numeric score; there is none.
- Distinguish fact from hypothesis. Use "appears to", "suggests", "points towards", "worth investigating", "based on what you've told us", "we'd want to test", "we don't yet know" whenever certainty is limited.
- Give three investigation_priorities when the evidence genuinely supports three distinct areas worth separating (it usually does), fewer only when it does not. Prefer three.
- For insights, return two or three when there are real tensions across the answers; never manufacture a contradiction to fill space, and never exceed three.
- The recommended first move is a single, specific move. Do NOT produce a "this week / this month / this quarter" plan or a 90-day plan.
- Only include what_not_to_do_yet when there is a genuine premature action worth warning against; otherwise return null.
- Write like a senior operator, concise and direct. Never use: leverage, optimise, synergies, unlock, transform, holistic, robust, comprehensive strategy, "it is important to note".

Return ONLY JSON of this shape:
{
  "headline": string,            // may sharpen the given headline; keep its meaning
  "initial_read": string,        // one line: the hypothesis, e.g. "The strongest signal appears to sit between demand and revenue."
  "summary": [string, ...],      // 2-3 short paragraphs reading their situation back to them
  "insights": [ { "headline": string, "explanation": string } ],           // 0-3: what doesn't quite add up, reasoning ACROSS answers
  "investigation_priorities": [ { "title": string, "question": string, "explanation": string, "why_it_matters": string, "evidence_type": "signal" | "hypothesis" | "gap" } ], // 1-3
  "recommended_first_move": { "title": string, "explanation": string, "questions_to_answer": [string, ...] },
  "what_not_to_do_yet": { "title": string, "explanation": string } | null
}`;

function userPayload(spine: Spine, freeText?: string): string {
  return JSON.stringify({
    reading_headline: spine.headline,
    weak_link: spine.weakLink,
    primary_area: spine.primaryArea,
    reading_summary: spine.summary,
    evidence_strength: spine.evidenceStrength,
    journey: {
      type: spine.journey.type,
      stages: spine.journey.stages.map((s) => s.label),
      investigate: spine.journey.investigateStages,
    },
    strongest_signals: spine.strongestSignals.map((s) => s.statement),
    complicating_evidence: spine.complicating.map((s) => s.statement),
    unknowns: spine.unknowns.map((s) => s.statement),
    contradictions: spine.contradictionSeeds.map((s) => s.statement),
    stated_problem: freeText ?? null,
  });
}

export async function generateAnalysis(spine: Spine, freeText?: string): Promise<Analysis> {
  if (!aiConfigured()) return buildFallbackAnalysis(spine);

  const body = {
    model: MODEL,
    temperature: 0.5,
    response_format: { type: "json_object" as const },
    messages: [
      { role: "system" as const, content: SYSTEM },
      {
        role: "user" as const,
        content: `Here are the diagnostic findings as JSON. Write the interpretation.\n\n${userPayload(
          spine,
          freeText
        )}`,
      },
    ],
  };

  // Up to two attempts, then the deterministic fallback.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`OpenAI ${res.status} (model=${MODEL}): ${(await res.text()).slice(0, 200)}`);
      }
      const data = await res.json();
      const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
      return normalise(parsed, spine);
    } catch (err) {
      console.error(`Diagnostic AI attempt ${attempt + 1} failed:`, err);
    }
  }
  return buildFallbackAnalysis(spine);
}
