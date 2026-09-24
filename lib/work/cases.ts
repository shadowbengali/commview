// Proven-work case studies. Shared between the client filter (CaseStudies.tsx)
// and the server page's JSON-LD so there is one source of truth. Outcome figures
// are client-supplied and rendered verbatim (ADI organic growth is 60%, never
// the old 800%). Company logos are text wordmarks until approved brand assets land.

export type Cap = "GTM Leadership" | "Growth" | "Product" | "Operational AI";

export const CAP_COLOUR: Record<Cap, string> = {
  "GTM Leadership": "var(--brand-cyan)",
  Growth: "var(--accent-green)",
  Product: "var(--accent-blue)",
  "Operational AI": "var(--accent-pink)",
};

// Each capability maps to its pillar page, so a case's capability tag can act as
// a contextual link into the relevant service.
export const CAP_HREF: Record<Cap, string> = {
  "GTM Leadership": "/fractional-cmo",
  Growth: "/growth",
  Product: "/product-strategy",
  "Operational AI": "/ai-consulting",
};

export const FILTERS: ("All" | Cap)[] = ["All", "GTM Leadership", "Growth", "Product", "Operational AI"];

export type Study = {
  id: string;
  company: string;
  unit?: string;
  caps: Cap[];
  headline: string;
  outcomes: { v: string; l: string }[];
};

export const CASES: Study[] = [
  {
    id: "vhub", company: "Vodafone", unit: "V-Hub",
    caps: ["GTM Leadership", "Growth", "Product", "Operational AI"],
    headline: "Scaling a B2B platform from 2 to 10 markets",
    outcomes: [{ v: "45k", l: "users" }, { v: "£3m", l: "pipeline" }, { v: "50%", l: "cost reduction" }],
  },
  {
    id: "cyber", company: "Vodafone", unit: "Cyber Security",
    caps: ["GTM Leadership", "Growth"],
    headline: "Rebuilding a stalled cybersecurity growth engine",
    outcomes: [{ v: "€9m", l: "qualified pipeline" }, { v: "£1.2m", l: "closed in 9 months" }],
  },
  {
    id: "adi", company: "ADI", unit: "Global Distribution",
    caps: ["Growth", "Product"],
    headline: "Growing an £80m eCommerce operation",
    outcomes: [{ v: "+60%", l: "organic traffic" }, { v: "+48%", l: "email engagement" }, { v: "+17%", l: "conversion" }],
  },
  {
    id: "distrelec", company: "Distrelec",
    caps: ["Growth", "Operational AI"],
    headline: "Fixing European marketing operations",
    outcomes: [{ v: "3 weeks → 1 week", l: "campaign cycle" }, { v: "£400k", l: "annual saving" }],
  },
  {
    id: "money", company: "Money Advisor",
    caps: ["Growth", "Product"],
    headline: "Turning digital acquisition into a system",
    outcomes: [{ v: "+15%", l: "conversion" }, { v: "+23%", l: "qualified leads" }],
  },
  {
    id: "travis", company: "Travis Perkins", unit: "Scruffs Workwear",
    caps: ["Growth", "Product"],
    headline: "Building digital commerce from the ground up",
    outcomes: [{ v: "22%", l: "of online revenue" }, { v: "32%", l: "email open rate (up from 12%)" }],
  },
];
