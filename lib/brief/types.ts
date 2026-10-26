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

// A personalised "we looked at your site" element in the hero: a framed
// screenshot of the prospect's homepage with a commercial callout. Optional —
// the hero degrades to a single column when absent. The screenshot image itself
// is stored separately (prospect_pages.screenshot) so the content row stays lean.
export interface SiteShot {
  displayUrl: string; // "trumeter.com" — shown in the browser chrome + date pill
  homepageUrl: string; // full URL the shot was taken from
  capturedOn: string; // "October 2026"
  callout: {
    flag: string; // "What it's costing you"
    headline: string; // "The page buyers can't find."
    body: string; // "A competitor gets ~3.6× the search traffic for what you make."
    emphasis?: string; // a substring of body to highlight, e.g. "~3.6× the search traffic"
  };
}

export interface BriefContent {
  company: string;
  preparedFor: string | null; // contact name, or null when no name is shown
  website: string;
  disciplines: Discipline[]; // "where we would start"
  site?: SiteShot;

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
