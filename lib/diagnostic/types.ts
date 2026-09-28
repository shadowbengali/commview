// COMMVIEW Business Diagnostic — types for the v1 deterministic, adaptive text
// diagnostic. Routing and evidence capture are deterministic; there is NO
// numeric "health/maturity" score. A reading is selected from explicit evidence
// conditions, and where evidence is insufficient the tool says so.
//
// Content lives in content.ts (authored, verbatim). Pure logic lives in
// engine.ts. Nothing here invents copy.

export type BranchKey =
  | "gtm"
  | "product"
  | "operations"
  | "cross_functional"
  | "unknown";

export type QuestionType =
  | "free_text"
  | "single_select"
  | "multi_select"
  | "compound";

/** A selectable option. `evidence` is the one line it adds to "What we've heard"
 *  (null = adds nothing). `next` overrides the question's routing; `branch`/
 *  `signal` feed the dominant-branch resolver. */
export interface Option {
  value: string;
  label: string;
  evidence: string | null;
  next?: string;
  branch?: BranchKey;
  signal?: BranchKey;
}

/** Chips offered under a free-text question. */
export interface StarterOption {
  id: string;
  label: string;
  evidence: string | null;
}

/** A field inside a compound question (several sub-questions on one screen). */
export interface CompoundField {
  id: string;
  question: string;
  type: "single_select" | "multi_select";
  options: Option[];
  maxSelections?: number;
}

/** Routing: a fixed next id, or a resolver that picks by dominant branch. */
export type NextStep =
  | string
  | { resolver: "dominant_branch"; branches: Record<BranchKey, string> };

export interface Question {
  id: string;
  section: string; // one of SECTION_LABELS
  type: QuestionType;
  eyebrow?: string;
  question: string;
  help?: string;
  placeholder?: string;
  // free_text
  starterOptions?: StarterOption[];
  allowNone?: boolean;
  noneLabel?: string;
  /** Evidence note for free_text; in v1 (no AI) the raw answer is used. */
  evidence?: string;
  // select
  options?: Option[];
  maxSelections?: number;
  // compound
  fields?: CompoundField[];
  next?: NextStep;
}

export interface DiagnosticConfig {
  start: string;
  estimatedTotal: number;
  hardCap: number;
  questions: Record<string, Question>;
}

/** A results reading — an evidence-pattern classification, never a score. */
export interface Reading {
  id: string;
  headline: string;
  weakLink: string;
  summary: string;
}

// ---- runtime state ----

/** One recorded answer. `values` holds selected option values (single = one).
 *  `fields` holds a compound question's per-field selections. `text` holds
 *  free-text. */
export interface Answer {
  questionId: string;
  values?: string[];
  fields?: Record<string, string[]>;
  text?: string;
}

export interface RunState {
  /** Ordered list of question ids visited (for Back + progress). */
  path: string[];
  answers: Record<string, Answer>;
}
