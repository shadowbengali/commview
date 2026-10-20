// Typed content model for a prospect "brief" page (a personalised CommView
// analysis). One shape, filled per prospect. Authored copy is parsed from the
// source spreadsheet into this structure (scripts/brief/parse-brief.mjs) and
// stored in Supabase, keyed by an unguessable token. Never committed to git.

export type Discipline = "GTM Leadership" | "Growth" | "Product" | "Operational AI";

export interface Stat {
  number: string;
  label: string;
  source?: string;
}

export interface Finding {
  discipline: Discipline;
  title: string;
  body: string;
  source?: string;
}

export interface ChartBar {
  label: string;
  value: number;
  highlight?: boolean;
}

export interface ServiceTile {
  discipline: Discipline;
  body: string;
  status: "start" | "later"; // "where we would start" vs "not a priority yet"
}

export interface Phase {
  label: string; // "Days 1–30"
  name: string; // "Insight"
  body: string;
}

export interface Track {
  discipline: Discipline;
  aim: string;
  actions: string[];
}

export interface Outcome {
  title: string;
  body: string;
}

export interface Result {
  result: string;
  attribution: string;
}

export interface Source {
  label: string;
  url?: string;
}

export interface BriefContent {
  company: string;
  preparedFor: string | null; // contact name, or null when no name is shown
  website: string;
  disciplines: Discipline[]; // "where we would start"

  hero: {
    privateLabel: string; // "Private. Prepared for Gil Copitch, Trumeter"
    date: string; // "October 2026"
    eyebrow: string; // "A CommView analysis of Trumeter"
    smallLabel: string; // "The question we started with"
    question: string; // main heading
    answerLine: string;
    intro: string;
  };

  stats: Stat[];

  insight: {
    heading: string;
    intro: string;
    findings: Finding[];
  };

  chart?: {
    title: string;
    subtitle?: string;
    bars: ChartBar[];
    caption?: string;
  };

  constraint: {
    heading: string;
    intro: string;
    steps: { title: string; body: string }[];
    closing: string;
  };

  momentum: {
    heading: string;
    intro: string;
    serviceTiles: ServiceTile[];
    phases: Phase[];
    tracks: Track[];
  };

  impact: {
    heading: string;
    outcomes: Outcome[];
  };

  experience: {
    heading: string;
    intro: string;
    results: Result[];
    note: string;
  };

  cta: {
    heading: string;
    body: string;
    button: string;
    closing: string;
    footer: string;
  };

  sources: Source[];
  method: string;
}
