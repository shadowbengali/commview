// COMMVIEW Business Diagnostic — pure engine. Deterministic routing, evidence
// capture and reading selection. No LLM, no random choice, no numeric score.
// Every function here is pure so it can be unit-tested (engine.test.mjs).
//
// The one thing the v1 config marks as AI-generated — the reflection summary,
// the free-text intervention summary and the dynamic final gap question — is
// handled here with a deterministic fallback, exactly as the spec requires the
// result never to be blocked on AI. The dynamic gap question is skipped in v1.

import { DIAGNOSTIC, READINGS, SECTION_LABELS } from "./content";
import type { BranchKey, Question, Reading, RunState } from "./types";

export const REFLECTION = "reflection";
export const RESULT = "result";

export function getQuestion(id: string): Question | undefined {
  return DIAGNOSTIC.questions[id];
}

// ---- reading answers ----
function values(state: RunState, qid: string): string[] {
  return state.answers[qid]?.values ?? [];
}
function first(state: RunState, qid: string): string | undefined {
  return values(state, qid)[0];
}
function fieldValues(state: RunState, qid: string, fid: string): string[] {
  return state.answers[qid]?.fields?.[fid] ?? [];
}
function has(state: RunState, qid: string, value: string): boolean {
  return values(state, qid).includes(value);
}
function fieldHas(state: RunState, qid: string, fid: string, value: string): boolean {
  return fieldValues(state, qid, fid).includes(value);
}

// ---- evidence ----
/** Every evidence line contributed so far, in the order questions were answered.
 *  Compound fields and starter chips contribute too; free text uses the raw
 *  answer (the AI one-line summary is a later phase). */
export function collectEvidence(state: RunState): string[] {
  const out: string[] = [];
  const push = (e?: string | null) => {
    if (e && !out.includes(e)) out.push(e);
  };
  for (const qid of state.path) {
    const q = DIAGNOSTIC.questions[qid];
    const ans = state.answers[qid];
    if (!q || !ans) continue;

    if (q.type === "free_text") {
      if (qid === "attempted_interventions") {
        if (ans.text && ans.text.trim()) push(`Already tried: ${ans.text.trim()}`);
        else push("Nothing has been tried yet");
      } else {
        // starter chip evidence, if a chip was chosen
        for (const v of ans.values ?? []) {
          const chip = q.starterOptions?.find((s) => s.id === v);
          push(chip?.evidence);
        }
      }
      continue;
    }
    if (q.type === "compound") {
      for (const field of q.fields ?? []) {
        for (const v of fieldValues(state, qid, field.id)) {
          push(field.options.find((o) => o.value === v)?.evidence);
        }
      }
      continue;
    }
    // single/multi
    for (const v of ans.values ?? []) {
      push(q.options?.find((o) => o.value === v)?.evidence);
    }
  }
  return out;
}

// ---- dominant branch resolver (deterministic) ----
const OPENING_BRANCH: Record<string, BranchKey> = {
  growth_slowed: "gtm",
  pipeline_not_converting: "gtm",
  marketing_not_working: "gtm",
  product_adoption: "product",
  operations: "operations",
};

export function resolveDominantBranch(state: RunState): BranchKey {
  const w: Record<Exclude<BranchKey, "unknown">, number> = {
    gtm: 0,
    product: 0,
    operations: 0,
    cross_functional: 0,
  };
  let unknownVotes = 0;
  const add = (b?: BranchKey, n = 1) => {
    if (!b || b === "unknown") {
      if (b === "unknown") unknownVotes += n;
      return;
    }
    w[b] += n;
  };

  // opening problem (explicit chip, weak weight)
  const opening = first(state, "problem_open");
  if (opening) add(OPENING_BRANCH[opening], 1);

  // problem_area — explicit selection, strongest weight
  for (const v of values(state, "problem_area")) {
    const opt = DIAGNOSTIC.questions.problem_area.options?.find((o) => o.value === v);
    add(opt?.branch, 2);
  }
  // change_signals — signals, weight 1
  for (const v of values(state, "change_signals")) {
    const opt = DIAGNOSTIC.questions.change_signals.options?.find((o) => o.value === v);
    add(opt?.signal, 1);
  }
  // coincident changes (inside the timing compound) — signals, weight 1
  const timingField = DIAGNOSTIC.questions.timing.fields?.find((f) => f.id === "coincident_changes");
  for (const v of fieldValues(state, "timing", "coincident_changes")) {
    add(timingField?.options.find((o) => o.value === v)?.signal, 1);
  }

  const entries = (Object.entries(w) as [Exclude<BranchKey, "unknown">, number][])
    .sort((a, b) => b[1] - a[1]);
  const [topKey, topVal] = entries[0];
  const secondVal = entries[1]?.[1] ?? 0;
  const total = entries.reduce((s, [, n]) => s + n, 0);

  // 4. too weak → unknown (and explicit "not sure" with nothing else)
  if (total === 0 || topVal < 2) return "unknown";
  if (unknownVotes >= 2 && total <= 2) return "unknown";

  // top is already cross_functional → keep it
  if (topKey === "cross_functional") return "cross_functional";

  // 3. two areas similarly strong → cross_functional
  if (secondVal >= 2 && topVal - secondVal <= 1) return "cross_functional";

  return topKey;
}

// ---- routing ----
/** The id of the next step after `currentId`, resolving option-level next,
 *  the dominant-branch resolver, or a fixed next. Returns REFLECTION when the
 *  bank routes to the reflection phase. */
export function nextStepId(currentId: string, state: RunState): string {
  const q = DIAGNOSTIC.questions[currentId];
  if (!q) return REFLECTION;
  const ans = state.answers[currentId];

  if (q.type === "single_select" && ans?.values?.length) {
    const opt = q.options?.find((o) => o.value === ans.values![0]);
    if (opt?.next) return opt.next;
  }

  const nx = q.next;
  if (!nx) return REFLECTION;
  if (typeof nx === "string") return nx;
  const branch = resolveDominantBranch(state);
  return nx.branches[branch] ?? nx.branches.unknown;
}

/** Enforces the hard cap: once enough substantive questions are answered, route
 *  to reflection regardless of the bank. */
export function nextStepWithCap(currentId: string, state: RunState): string {
  if (state.path.length >= DIAGNOSTIC.hardCap) return REFLECTION;
  return nextStepId(currentId, state);
}

// ---- section progress ("Building the picture") ----
export type SectionStatus = "done" | "active" | "todo";

export function sectionStatuses(
  state: RunState,
  currentId: string | null
): { label: string; status: SectionStatus }[] {
  const done = currentId === REFLECTION || currentId === RESULT;
  const currentSection = currentId ? getQuestion(currentId)?.section : undefined;
  const currentIdx = currentSection ? SECTION_LABELS.indexOf(currentSection as (typeof SECTION_LABELS)[number]) : SECTION_LABELS.length;
  return SECTION_LABELS.map((label, i) => {
    let status: SectionStatus;
    if (done) status = "done";
    else if (i < currentIdx) status = "done";
    else if (i === currentIdx) status = "active";
    else status = "todo";
    return { label, status };
  });
}

export function progressPercent(state: RunState, currentId: string | null): number {
  if (currentId === RESULT) return 100;
  if (currentId === REFLECTION) return 95;
  const answered = state.path.filter((id) => state.answers[id]).length;
  const pct = Math.round((answered / DIAGNOSTIC.estimatedTotal) * 90);
  return Math.min(90, Math.max(8, pct));
}

// ---- reading selection (deterministic) ----
function evidenceWeakness(state: RunState): number {
  let n = 0;
  if (has(state, "problem_area", "unknown")) n++;
  if (has(state, "change_signals", "dont_know")) n++;
  if (has(state, "change_signals", "nothing_obvious")) n++;
  if (first(state, "gtm_constraint") === "unknown") n++;
  if (has(state, "sales_view", "unknown")) n++;
  if (["partial", "not_measured", "unknown"].includes(first(state, "gtm_evidence") ?? "")) n++;
  if (first(state, "product_adoption") === "unknown") n++;
  if (["usage_only", "rarely", "no"].includes(first(state, "product_outcomes") ?? "")) n++;
  if (first(state, "operations_repeatability") === "unmapped") n++;
  if (["alongside", "unknown"].includes(first(state, "automation_removal") ?? "")) n++;
  if (["different", "no", "unknown"].includes(first(state, "alignment") ?? "")) n++;
  if (["opinions", "little", "unknown"].includes(first(state, "evidence_visibility") ?? "")) n++;
  if (["low", "why_here"].includes(first(state, "root_cause_confidence") ?? "")) n++;
  if (fieldHas(state, "timing", "problem_timing", "unknown")) n++;
  return n;
}

function disagreementSignals(state: RunState): number {
  let n = 0;
  if (has(state, "sales_view", "disagreement")) n++;
  if (["different", "no"].includes(first(state, "alignment") ?? "")) n++;
  if (has(state, "problem_area", "alignment")) n++;
  if (has(state, "problem_area", "launching")) n++;
  return n;
}

function selectGtm(state: RunState): Reading {
  const fitSignals =
    (has(state, "sales_view", "lead_quality") ? 1 : 0) +
    (has(state, "sales_view", "wrong_customers") ? 1 : 0) +
    (has(state, "change_signals", "lead_quality_down") ? 1 : 0) +
    (has(state, "change_signals", "cac_up") ? 1 : 0) +
    (fieldHas(state, "timing", "coincident_changes", "target_customer") ? 1 : 0) +
    (fieldHas(state, "timing", "coincident_changes", "pricing") ? 1 : 0);

  const gc = first(state, "gtm_constraint");
  const conversionSignals =
    (gc === "qualification" || gc === "sales" ? 1 : 0) +
    (has(state, "change_signals", "conversion_down") ? 1 : 0) +
    (has(state, "change_signals", "win_rate_down") ? 1 : 0) +
    (has(state, "change_signals", "sales_cycle_longer") ? 1 : 0) +
    (has(state, "sales_view", "momentum") ? 1 : 0);
  const demandSignals =
    (gc === "awareness" || gc === "interest" ? 1 : 0) +
    (has(state, "change_signals", "lead_volume_down") ? 1 : 0) +
    (has(state, "problem_area", "finding_customers") ? 1 : 0) +
    (has(state, "sales_view", "not_enough_leads") ? 1 : 0);

  if (fitSignals >= 2) return READINGS.icp_fit;
  // downstream (conversion) preferred over upstream (demand) when both present
  if (conversionSignals >= 1 && conversionSignals >= demandSignals) return READINGS.conversion;
  if (demandSignals >= 1) return READINGS.demand;
  return READINGS.evidence_gap;
}

function selectProduct(state: RunState): Reading {
  const pc = first(state, "product_constraint");
  const adoption =
    pc === "adoption" ||
    pc === "feature_usage" ||
    !!first(state, "product_adoption") ||
    has(state, "change_signals", "usage_down");
  if (adoption) return READINGS.product_adoption;
  return READINGS.product_decision;
}

function selectOperations(state: RunState): Reading {
  const automationTried = ["working", "limited", "experimented"].includes(
    first(state, "automation_status") ?? ""
  );
  const notRemoved = ["little", "alongside", "unknown"].includes(
    first(state, "automation_removal") ?? ""
  );
  if (automationTried && notRemoved) return READINGS.automation_no_removal;
  return READINGS.workflow;
}

/** The reading, chosen deterministically. Never invents a reading; never claims
 *  causality. Falls back to insufficient/evidence-gap when signals are thin. */
export function selectReading(state: RunState): Reading {
  const branch = resolveDominantBranch(state);
  const weakness = evidenceWeakness(state);

  // Cross-functional: dominant branch or clear multi-team disagreement.
  if (branch === "cross_functional" || disagreementSignals(state) >= 2) {
    return READINGS.cross_functional;
  }

  let reading: Reading;
  switch (branch) {
    case "gtm":
      reading = selectGtm(state);
      break;
    case "product":
      reading = selectProduct(state);
      break;
    case "operations":
      reading = selectOperations(state);
      break;
    default:
      reading = weakness >= 2 ? READINGS.evidence_gap : READINGS.insufficient;
  }

  // Measurement gap wins when the picked reading fell back for want of evidence.
  if (reading.id === "evidence_gap" && weakness < 2) return READINGS.insufficient;
  // A strong overall evidence gap overrides a thinly-supported reading.
  if (weakness >= 4 && reading.id !== "cross_functional") return READINGS.evidence_gap;

  return reading;
}

// ---- result assembly ----
const CONTEXT_EVIDENCE = new Set(["business_type", "business_size"]);

function isUnresolved(e: string): boolean {
  return /isn't|not currently|not clear|unclear|measurement gap|hasn't been|isn't yet|remains unclear|don't|limited evidence|incomplete/i.test(
    e
  );
}

export interface DiagnosticResult {
  reading: Reading;
  evidence: string[];
  investigateFirst: string;
}

export function buildResult(state: RunState): DiagnosticResult {
  const reading = selectReading(state);
  const all = collectEvidence(state).filter(
    (e) =>
      e !== "B2B services business" &&
      !/revenue$/i.test(e) // drop size/context lines from the highlighted set
  );
  // prefer resolved, concrete symptoms first, then unresolved
  const resolved = all.filter((e) => !isUnresolved(e));
  const unresolved = all.filter(isUnresolved);
  const evidence = [...resolved, ...unresolved].slice(0, 5);

  const topUnresolved = unresolved[0];
  const wl = reading.weakLink.toLowerCase();
  const investigateFirst = topUnresolved
    ? `Based on what you've told us, we'd start with ${wl} — establishing ${lowerFirst(
        topUnresolved
      )}.`
    : `Based on what you've told us, we'd start by establishing whether ${wl} is genuinely the constraint or a symptom of something upstream.`;

  return { reading, evidence, investigateFirst };
}

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

// ---- reflection (deterministic fallback for "Here's what I'm hearing") ----
export function composeReflection(state: RunState): string {
  const parts: string[] = [];

  // 1. stated problem
  const opening = state.answers.problem_open;
  const chip = opening?.values?.[0]
    ? DIAGNOSTIC.questions.problem_open.starterOptions?.find((s) => s.id === opening.values![0])
    : undefined;
  const stated = opening?.text?.trim() || chip?.label;
  if (stated) parts.push(`You came to us because ${lowerFirst(stated)}${/[.!?]$/.test(stated) ? "" : "."}`);
  else parts.push("You're trying to work out where a business problem actually sits.");

  // 2. strongest observed symptom
  const changeEv = values(state, "change_signals")
    .map((v) => DIAGNOSTIC.questions.change_signals.options?.find((o) => o.value === v)?.evidence)
    .filter((e): e is string => !!e && !/don't|nothing obvious/i.test(e));
  const areaEv = values(state, "problem_area")
    .map((v) => DIAGNOSTIC.questions.problem_area.options?.find((o) => o.value === v)?.evidence)
    .filter((e): e is string => !!e);
  const symptom = changeEv[0] || areaEv[0];
  if (symptom) parts.push(`The strongest signal so far is that ${lowerFirst(symptom)}.`);

  // 3. relevant change / timing
  const timing = fieldValues(state, "timing", "problem_timing")[0];
  const timingEv = DIAGNOSTIC.questions.timing.fields
    ?.find((f) => f.id === "problem_timing")
    ?.options.find((o) => o.value === timing)?.evidence;
  const coincident = fieldValues(state, "timing", "coincident_changes")
    .map((v) =>
      DIAGNOSTIC.questions.timing.fields
        ?.find((f) => f.id === "coincident_changes")
        ?.options.find((o) => o.value === v)?.evidence
    )
    .filter((e): e is string => !!e && !/no obvious|unclear/i.test(e));
  if (timingEv) {
    parts.push(
      coincident[0]
        ? `${timingEv}, around the time ${lowerFirst(coincident[0])}.`
        : `${timingEv}.`
    );
  }

  // 4. quality of evidence
  const conf = first(state, "root_cause_confidence");
  const vis = first(state, "evidence_visibility");
  if (conf === "why_here" || conf === "low" || vis === "little" || vis === "opinions") {
    parts.push("You're candid that the underlying evidence is still thin, which matters as much as the symptom itself.");
  } else if (first(state, "gtm_evidence") === "contradicts") {
    parts.push("Notably, the data seems to point somewhere different from where the team believes the problem is.");
  } else if (vis === "clear") {
    parts.push("Encouragingly, you can already see much of this in the data.");
  }

  // 5. most important unresolved issue
  const unresolved = collectEvidence(state).filter(isUnresolved);
  if (unresolved[0]) {
    parts.push(`The most important thing still open is that ${lowerFirst(unresolved[0])}.`);
  }

  return parts.join(" ");
}
