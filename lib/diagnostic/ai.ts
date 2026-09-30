// AI layer for the diagnostic. Generates the gated, personalised output with
// OpenAI (ChatGPT) over fetch — grounded on the deterministic reading + the
// visitor's own evidence, never inventing scores, claims, prices or outcomes.
// If OpenAI is unavailable or fails, a deterministic fallback still produces a
// usable result, so the gated page is never blocked on AI.

import { getPostTitlesBySlugs } from "@/lib/sanity/queries";
import type { Reading } from "./types";
import type { AiOutput } from "./store";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export function aiConfigured(): boolean {
  return !!OPENAI_KEY;
}

// Which published Insights to surface per reading (2 each). Real slugs only.
const READING_INSIGHTS: Record<string, string[]> = {
  demand: ["why-has-b2b-growth-flattened", "b2b-gtm-stack-buyer-no-longer-exists"],
  conversion: ["why-isnt-b2b-website-converting", "why-has-b2b-growth-flattened"],
  icp_fit: ["are-we-targeting-wrong-customers", "b2b-gtm-stack-buyer-no-longer-exists"],
  evidence_gap: ["why-has-b2b-growth-flattened", "are-we-targeting-wrong-customers"],
  product_adoption: ["why-arent-customers-using-new-features", "should-we-build-this-feature"],
  product_decision: ["should-we-build-this-feature", "why-arent-customers-using-new-features"],
  workflow: ["can-ai-actually-reduce-costs", "if-ai-becomes-the-interface"],
  automation_no_removal: ["can-ai-actually-reduce-costs", "if-ai-becomes-the-interface"],
  cross_functional: ["b2b-gtm-stack-buyer-no-longer-exists", "why-has-b2b-growth-flattened"],
  insufficient: ["why-has-b2b-growth-flattened", "are-we-targeting-wrong-customers"],
};

function titleCase(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

async function matchedInsights(reading: Reading): Promise<{ slug: string; title: string }[]> {
  const slugs = READING_INSIGHTS[reading.id] ?? [];
  const titles = await getPostTitlesBySlugs(slugs);
  return slugs.map((slug) => ({
    slug,
    title: titles.find((t) => t.slug === slug)?.title ?? titleCase(slug),
  }));
}

const SYSTEM = `You are a senior B2B commercial operator writing a short, personalised diagnostic read for a business leader who has just answered a set of questions.

Hard rules:
- British English. No em dashes.
- Ground everything in the evidence provided. Do not invent facts, metrics, prices, timelines, client names or outcomes.
- Do not claim a definitive root cause. Use language such as "appears", "points towards", "may", "worth investigating", "based on what you've told us".
- Keep the deterministic reading and weak link exactly as given; write the language around them, do not change them.
- Warm, direct, senior tone. No hype, no filler, no marketing cliches.

Return ONLY JSON matching:
{
  "narrative": [string, ...],   // 2-3 short paragraphs reading their situation back to them
  "moves": [                    // exactly 3, ordered by horizon
    { "horizon": "This week", "title": string, "detail": string },
    { "horizon": "This month", "title": string, "detail": string },
    { "horizon": "This quarter", "title": string, "detail": string }
  ]
}
Each move title is a short imperative; each detail is one or two sentences, specific to their evidence, never generic advice.`;

function fallback(reading: Reading, evidence: string[]): Pick<AiOutput, "narrative" | "moves"> {
  const ev = evidence.slice(0, 3).map((e) => e.toLowerCase());
  return {
    narrative: [
      reading.summary,
      ev.length
        ? `Based on what you've told us, the signals that stand out are: ${ev.join("; ")}.`
        : "The picture is still forming, so the first step is making the constraint measurable.",
    ],
    moves: [
      { horizon: "This week", title: `Get clear on ${reading.weakLink.toLowerCase()}`, detail: `Pull together what you already know about ${reading.weakLink.toLowerCase()} so the team is working from the same evidence.` },
      { horizon: "This month", title: "Test the hypothesis", detail: "Run a focused check on the most likely constraint before committing budget to a broader fix." },
      { horizon: "This quarter", title: "Fix the biggest constraint", detail: "Once the evidence points somewhere clearly, put the effort behind the one change most likely to move the outcome." },
    ],
  };
}

export interface AiInput {
  reading: Reading;
  evidence: string[];
  freeText?: string;
  businessType?: string;
  businessSize?: string;
}

export async function generateDiagnostic(input: AiInput): Promise<AiOutput> {
  const insights = await matchedInsights(input.reading);

  if (!aiConfigured()) {
    return { ...fallback(input.reading, input.evidence), insights, debug: "no OPENAI_API_KEY" };
  }

  const user = JSON.stringify({
    reading_headline: input.reading.headline,
    weak_link: input.reading.weakLink,
    reading_summary: input.reading.summary,
    evidence: input.evidence,
    stated_problem: input.freeText ?? null,
    business_type: input.businessType ?? null,
    business_size: input.businessSize ?? null,
  });

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.5,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Here is the diagnostic state as JSON. Write the read.\n\n${user}` },
        ],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`OpenAI ${res.status} (model=${MODEL}): ${body.slice(0, 220)}`);
    }
    const data = await res.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
    const narrative: string[] = Array.isArray(parsed.narrative) ? parsed.narrative.filter((s: unknown) => typeof s === "string") : [];
    const moves = Array.isArray(parsed.moves)
      ? parsed.moves
          .filter((m: unknown) => m && typeof m === "object")
          .slice(0, 3)
          .map((m: { horizon?: string; title?: string; detail?: string }) => ({
            horizon: String(m.horizon ?? ""),
            title: String(m.title ?? ""),
            detail: String(m.detail ?? ""),
          }))
      : [];
    if (!narrative.length || moves.length < 3) throw new Error(`thin output (model=${MODEL}): ${JSON.stringify(parsed).slice(0, 200)}`);
    return { narrative, moves, insights };
  } catch (err) {
    return { ...fallback(input.reading, input.evidence), insights, debug: String(err).slice(0, 300) };
  }
}
