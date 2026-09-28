// COMMVIEW Business Diagnostic — content model for the branching (adaptive)
// text version. This is the SHAPE the authored question bank fills; no question
// copy is invented in code (house rule). The runtime engine (engine.ts) walks
// this graph from `start`, following each answer's `next`, accumulating the
// evidence shown in the "What we've heard" panel and the section progress shown
// in "Building the picture".
//
// Scoring/teaser copy is deliberately left out here until the authored bank
// arrives, so the results model can match how the bank expresses its readings.

export type DiagnosticSectionId =
  | "business-context"
  | "market-customers"
  | "growth-revenue"
  | "product-value"
  | "operations-efficiency";

export interface DiagnosticSection {
  id: DiagnosticSectionId;
  /** Sidebar + eyebrow label, e.g. "Growth & revenue". */
  label: string;
}

/** One entry that an answer contributes to the "What we've heard" panel. */
export interface EvidenceItem {
  title: string; // e.g. "Growth has flattened"
  sub?: string; // e.g. "Noticed over the last six months."
}

export interface DiagnosticOption {
  id: string;
  label: string; // "Fewer opportunities entering the pipeline"
  description?: string; // "We're generating fewer leads than before."
  /** What picking this option adds to the evidence panel (optional). */
  evidence?: EvidenceItem;
  /**
   * Where to go after this option: another question id, a section id (jump to
   * its first question) or "end" to finish. Falls back to the question's own
   * `next` when omitted.
   */
  next?: string;
  /** When true, selecting this reveals a free-text box (e.g. "Something else"). */
  freeText?: boolean;
}

export type QuestionType = "single" | "multi" | "text";

export interface DiagnosticQuestion {
  id: string;
  section: DiagnosticSectionId;
  /** Optional context line above the prompt: "You mentioned growth has stalled." */
  lead?: string;
  /** The question itself: "Which best describes what you're seeing?" */
  prompt: string;
  type: QuestionType;
  /** Options for single/multi questions. */
  options?: DiagnosticOption[];
  /** Placeholder for a `text` question. */
  placeholder?: string;
  /** Evidence added regardless of the specific option chosen (optional). */
  evidence?: EvidenceItem;
  /** Default next step when the chosen option does not specify its own. */
  next?: string;
  /** A `text` (or "not sure") answer may be skippable. */
  optional?: boolean;
}

export interface DiagnosticContent {
  /** Five sections, in the order shown in "Building the picture". */
  sections: DiagnosticSection[];
  /** Id of the first question. */
  start: string;
  /** Approximate total, powering "3 of ~10". */
  estimatedQuestions: number;
  /** Every question, keyed by id. */
  questions: Record<string, DiagnosticQuestion>;
}

/** A single recorded answer in the run. */
export interface DiagnosticAnswer {
  questionId: string;
  optionIds?: string[];
  text?: string;
}
