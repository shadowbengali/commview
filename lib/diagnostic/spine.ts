// COMMVIEW Business Diagnostic — the deterministic "spine" of a result.
//
// This is the fact layer. It owns everything the brief says the AI must NOT
// invent: the reading, the evidence (with provenance back to the questions that
// produced it), the evidence strength, and the business-journey model plus which
// stage(s) to investigate. The AI interpretation layer (ai.ts) only writes prose
// around this; it can never manufacture a signal, a strength or a score.
//
// Pure and testable. No LLM, no randomness, no numeric score.

import { DIAGNOSTIC } from "./content";
import {
  buildResult,
  disagreementSignals,
  evidenceWeakness,
  resolveDominantBranch,
} from "./engine";
import type { RunState } from "./types";

export type EvidenceKind =
  | "fact"
  | "claim"
  | "inference"
  | "unknown"
  | "contradiction";

export interface EvidenceItem {
  statement: string;
  sourceQuestionIds: string[];
  kind: EvidenceKind;
}

export type JourneyType =
  | "commercial"
  | "product"
  | "operations"
  | "cross_functional";

export interface JourneyStage {
  id: string;
  label: string;
  sub: string;
}

export interface Journey {
  type: JourneyType;
  label: string; // human name of the model, e.g. "The commercial journey"
  stages: JourneyStage[];
  investigateStages: string[]; // stage ids to highlight (0, 1 or 2)
}

export type EvidenceStrength = "strong" | "moderate" | "limited";

export interface Spine {
  readingId: string;
  headline: string;
  weakLink: string;
  primaryArea: string;
  summary: string;
  evidenceStrength: EvidenceStrength;
  journey: Journey;
  strongestSignals: EvidenceItem[];
  complicating: EvidenceItem[];
  unknowns: EvidenceItem[];
  contradictionSeeds: EvidenceItem[];
  evidence: string[]; // flat top signals, for compatibility
  answersAnalysed: number;
  gapsRemaining: number;
}

// ---- evidence collection, with provenance ----
interface RawEv {
  statement: string;
  qid: string;
}

/** Every evidence line contributed, paired with the question that produced it.
 *  Business-context lines are excluded from the highlighted set. */
function collectWithSource(state: RunState): RawEv[] {
  const out: RawEv[] = [];
  const seen = new Set<string>();
  const push = (statement: string | null | undefined, qid: string) => {
    if (!statement || seen.has(statement)) return;
    seen.add(statement);
    out.push({ statement, qid });
  };
  for (const qid of state.path) {
    if (qid === "business_context") continue; // size/type context, not a signal
    const q = DIAGNOSTIC.questions[qid];
    const ans = state.answers[qid];
    if (!q || !ans) continue;

    if (q.type === "free_text") {
      if (qid === "attempted_interventions") {
        if (ans.text?.trim()) push(`Already tried: ${ans.text.trim()}`, qid);
      } else {
        for (const v of ans.values ?? []) {
          push(q.starterOptions?.find((s) => s.id === v)?.evidence, qid);
        }
      }
      continue;
    }
    if (q.type === "compound") {
      for (const f of q.fields ?? []) {
        for (const v of ans.fields?.[f.id] ?? []) {
          push(f.options.find((o) => o.value === v)?.evidence, qid);
        }
      }
      continue;
    }
    for (const v of ans.values ?? []) {
      push(q.options?.find((o) => o.value === v)?.evidence, qid);
    }
  }
  return out;
}

/** Language that marks an evidence line as unresolved (a gap, not a symptom). */
function isUnresolved(e: string): boolean {
  return /isn't|not currently|not clear|unclear|measurement gap|hasn't been|isn't yet|remains unclear|don't|limited evidence|incomplete|not measured|not been established/i.test(
    e
  );
}

// ---- reading helpers ----
function values(state: RunState, qid: string): string[] {
  return state.answers[qid]?.values ?? [];
}
function has(state: RunState, qid: string, value: string): boolean {
  return values(state, qid).includes(value);
}
function first(state: RunState, qid: string): string | undefined {
  return values(state, qid)[0];
}
function fieldHas(state: RunState, qid: string, fid: string, value: string): boolean {
  return (state.answers[qid]?.fields?.[fid] ?? []).includes(value);
}

// ---- complicating evidence (another possible cause, in the user's own words) ----
function detectComplicating(state: RunState, branch: string): EvidenceItem[] {
  const out: EvidenceItem[] = [];
  const add = (statement: string, ids: string[]) =>
    out.push({ statement, sourceQuestionIds: ids, kind: "inference" });

  const productSignal =
    has(state, "change_signals", "usage_down") ||
    fieldHas(state, "timing", "coincident_changes", "product") ||
    has(state, "problem_area", "product_adoption");
  if (branch !== "product" && productSignal) {
    add("Product changes may also be affecting the picture", ["change_signals", "timing"]);
  }

  const expansionWeak =
    has(state, "change_signals", "retention_down") ||
    first(state, "gtm_constraint") === "expansion" ||
    has(state, "problem_area", "retention_growth");
  if (expansionWeak) {
    add("Customer retention or expansion is also weak", ["change_signals", "problem_area"]);
  }

  const opsSignal =
    has(state, "change_signals", "delivery_slower") ||
    has(state, "change_signals", "costs_up") ||
    fieldHas(state, "timing", "coincident_changes", "technology");
  if (branch !== "operations" && opsSignal) {
    add("Delivery or cost changes may also be affecting the picture", ["change_signals", "timing"]);
  }

  return out.slice(0, 3);
}

// ---- contradictions (two things that don't comfortably fit) ----
function detectContradictions(state: RunState, reading: string): EvidenceItem[] {
  const out: EvidenceItem[] = [];
  const add = (statement: string, ids: string[]) =>
    out.push({ statement, sourceQuestionIds: ids, kind: "contradiction" });

  if (has(state, "sales_view", "disagreement")) {
    add("Sales and Marketing describe the problem differently", ["sales_view"]);
  }
  if (first(state, "gtm_evidence") === "contradicts") {
    add("The available data appears to conflict with the team's view", ["gtm_evidence"]);
  }
  if (["different", "no"].includes(first(state, "alignment") ?? "")) {
    add("The teams involved don't agree on what the problem is", ["alignment"]);
  }
  if (reading === "cross_functional") {
    add("The symptoms appear across more than one function", ["problem_area", "change_signals"]);
  }
  return out.slice(0, 3);
}

// ---- evidence strength (derived, never guessed) ----
function computeStrength(
  state: RunState,
  readingId: string,
  signalCount: number,
  contradictionCount: number
): EvidenceStrength {
  if (readingId === "evidence_gap" || readingId === "insufficient") return "limited";
  const weakness = evidenceWeakness(state);
  if (signalCount >= 3 && contradictionCount <= 1 && weakness <= 2) return "strong";
  if (signalCount >= 2 && weakness <= 4) return "moderate";
  return "limited";
}

// ---- journey model + investigate stage(s) ----
const COMMERCIAL: JourneyStage[] = [
  { id: "discovery", label: "Discovery", sub: "Awareness and interest" },
  { id: "demand", label: "Demand", sub: "Leads and inquiries" },
  { id: "qualification", label: "Qualification", sub: "Qualified opportunities" },
  { id: "pipeline", label: "Pipeline", sub: "Active deals and proposals" },
  { id: "revenue", label: "Revenue", sub: "Closed won and expansion" },
];
const PRODUCT: JourneyStage[] = [
  { id: "discovery", label: "Discovery", sub: "Customers find it" },
  { id: "adoption", label: "Adoption", sub: "They start using it" },
  { id: "usage", label: "Usage", sub: "They keep using it" },
  { id: "value", label: "Value", sub: "They get real value" },
  { id: "expansion", label: "Expansion", sub: "They expand use" },
];
const OPERATIONS: JourneyStage[] = [
  { id: "input", label: "Input", sub: "Work arrives" },
  { id: "process", label: "Process", sub: "Work is done" },
  { id: "handoff", label: "Handoff", sub: "Work moves on" },
  { id: "output", label: "Output", sub: "Work completes" },
  { id: "outcome", label: "Outcome", sub: "The result lands" },
];

const GTM_CONSTRAINT_STAGE: Record<string, string> = {
  awareness: "discovery",
  interest: "demand",
  qualification: "qualification",
  sales: "pipeline",
  expansion: "revenue",
};
const READING_COMMERCIAL_STAGE: Record<string, string[]> = {
  demand: ["demand"],
  conversion: ["qualification"],
  icp_fit: ["discovery"],
  cross_functional: ["qualification", "revenue"],
};
const PRODUCT_ADOPTION_STAGE: Record<string, string> = {
  discovery: "discovery",
  trial: "adoption",
  repeat: "usage",
  value: "value",
};

function resolveJourney(state: RunState, branch: string, readingId: string): Journey {
  if (branch === "product") {
    const adoptionAnswer = first(state, "product_adoption");
    const investigate =
      (adoptionAnswer && PRODUCT_ADOPTION_STAGE[adoptionAnswer]) ||
      (readingId === "product_adoption" ? "adoption" : "value");
    return {
      type: "product",
      label: "The product value journey",
      stages: PRODUCT,
      investigateStages: investigate ? [investigate] : [],
    };
  }
  if (branch === "operations") {
    return {
      type: "operations",
      label: "The operational flow",
      stages: OPERATIONS,
      investigateStages:
        readingId === "automation_no_removal" ? ["process", "handoff"] : ["process"],
    };
  }
  // gtm, cross_functional, unknown → the commercial journey
  const gc = first(state, "gtm_constraint");
  const investigate =
    (gc && GTM_CONSTRAINT_STAGE[gc] ? [GTM_CONSTRAINT_STAGE[gc]] : null) ??
    READING_COMMERCIAL_STAGE[readingId] ??
    [];
  return {
    type: branch === "cross_functional" ? "cross_functional" : "commercial",
    label: "The commercial journey",
    stages: COMMERCIAL,
    investigateStages: investigate,
  };
}

// ---- assemble ----
function countAnswers(state: RunState): number {
  let n = 0;
  for (const [qid, ans] of Object.entries(state.answers)) {
    if (qid === "reflection") continue;
    const hasValues = (ans.values?.length ?? 0) > 0;
    const hasFields = ans.fields && Object.values(ans.fields).some((v) => v.length > 0);
    const hasText = !!ans.text?.trim();
    if (hasValues || hasFields || hasText) n += 1;
  }
  return n;
}

/** Build the full deterministic spine for a completed run. */
export function buildSpine(state: RunState): Spine {
  const { reading, evidence } = buildResult(state);
  const branch = resolveDominantBranch(state);

  const raw = collectWithSource(state);
  const strongestSignals: EvidenceItem[] = raw
    .filter((r) => !isUnresolved(r.statement))
    .slice(0, 4)
    .map((r) => ({ statement: r.statement, sourceQuestionIds: [r.qid], kind: "claim" }));
  const unknowns: EvidenceItem[] = raw
    .filter((r) => isUnresolved(r.statement))
    .slice(0, 4)
    .map((r) => ({ statement: r.statement, sourceQuestionIds: [r.qid], kind: "unknown" }));

  const complicating = detectComplicating(state, branch);
  const contradictionSeeds = detectContradictions(state, reading.id);
  // disagreementSignals feeds the strength read as a consistency check.
  const contradictionCount = contradictionSeeds.length + (disagreementSignals(state) >= 2 ? 1 : 0);

  const evidenceStrength = computeStrength(
    state,
    reading.id,
    strongestSignals.length,
    contradictionCount
  );
  const journey = resolveJourney(state, branch, reading.id);

  return {
    readingId: reading.id,
    headline: reading.headline,
    weakLink: reading.weakLink,
    primaryArea: reading.weakLink,
    summary: reading.summary,
    evidenceStrength,
    journey,
    strongestSignals,
    complicating,
    unknowns,
    contradictionSeeds,
    evidence,
    answersAnalysed: countAnswers(state),
    gapsRemaining: evidenceWeakness(state),
  };
}
