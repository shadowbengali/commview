// COMMVIEW Business Diagnostic — authored content, verbatim from the approved
// v1 config. This is the single source of question copy, options, evidence
// lines, routing and the results readings. No copy is invented here or in code.
//
// Routing note: `next` may be a question id, an option-level id, or a
// dominant-branch resolver. Deterministic reading selection lives in engine.ts.

import type { DiagnosticConfig, Reading } from "./types";

/** Fixed order shown in "Building the picture". Section values on questions
 *  match these labels. */
export const SECTION_LABELS = [
  "Business context",
  "Market & customers",
  "Growth & revenue",
  "Product & value",
  "Operations & efficiency",
] as const;

export const DIAGNOSTIC: DiagnosticConfig = {
  start: "problem_open",
  estimatedTotal: 10,
  hardCap: 15,
  questions: {
    problem_open: {
      id: "problem_open",
      section: "Business context",
      type: "free_text",
      eyebrow: "GETTING STARTED",
      question: "What brings you here today?",
      help: "Tell us what's happening in your own words.",
      placeholder:
        "For example, growth has stalled, leads aren't converting, customers aren't adopting the product, or something inside the business is taking too long.",
      starterOptions: [
        { id: "growth_slowed", label: "Growth has slowed", evidence: "Growth has slowed" },
        { id: "pipeline_not_converting", label: "Pipeline isn't converting", evidence: "Pipeline conversion is a concern" },
        { id: "marketing_not_working", label: "Marketing isn't working", evidence: "Marketing performance is a concern" },
        { id: "product_adoption", label: "Product adoption is poor", evidence: "Product adoption is a concern" },
        { id: "operations", label: "Operations are inefficient", evidence: "Operational efficiency is a concern" },
        { id: "other", label: "Something else", evidence: null },
      ],
      next: "business_context",
    },

    business_context: {
      id: "business_context",
      section: "Business context",
      type: "compound",
      eyebrow: "BUSINESS CONTEXT",
      question: "Tell us a little about the business.",
      fields: [
        {
          id: "business_type",
          question: "Which best describes your business today?",
          type: "single_select",
          options: [
            { value: "b2b_services", label: "B2B services", evidence: "B2B services business" },
            { value: "saas", label: "B2B software / SaaS", evidence: "B2B software / SaaS business" },
            { value: "technology", label: "Technology", evidence: "Technology business" },
            { value: "manufacturing", label: "Manufacturing / distribution", evidence: "Manufacturing / distribution business" },
            { value: "professional_services", label: "Professional services", evidence: "Professional services business" },
            { value: "other", label: "Other", evidence: null },
          ],
        },
        {
          id: "business_size",
          question: "Roughly how large is the business?",
          type: "single_select",
          options: [
            { value: "under_1m", label: "Under £1m revenue", evidence: "Under £1m revenue" },
            { value: "1m_5m", label: "£1m–£5m", evidence: "£1m–£5m revenue" },
            { value: "5m_15m", label: "£5m–£15m", evidence: "£5m–£15m revenue" },
            { value: "15m_50m", label: "£15m–£50m", evidence: "£15m–£50m revenue" },
            { value: "50m_plus", label: "£50m+", evidence: "£50m+ revenue" },
            { value: "prefer_not", label: "Prefer not to say", evidence: null },
          ],
        },
      ],
      next: "problem_area",
    },

    problem_area: {
      id: "problem_area",
      section: "Market & customers",
      type: "multi_select",
      maxSelections: 3,
      eyebrow: "THE BIGGER PICTURE",
      question: "Where are you seeing the biggest problem?",
      help: "Select up to three.",
      options: [
        { value: "finding_customers", label: "Finding enough customers", evidence: "Finding enough customers is a concern", branch: "gtm" },
        { value: "qualified_opportunities", label: "Generating qualified opportunities", evidence: "Qualified opportunity generation is a concern", branch: "gtm" },
        { value: "lead_pipeline", label: "Converting leads into pipeline", evidence: "Lead-to-pipeline conversion is a concern", branch: "gtm" },
        { value: "closing_deals", label: "Closing deals", evidence: "Closing deals is a concern", branch: "gtm" },
        { value: "retention_growth", label: "Retaining / growing customers", evidence: "Customer retention or expansion is a concern", branch: "gtm" },
        { value: "product_adoption", label: "Product adoption", evidence: "Product adoption is a concern", branch: "product" },
        { value: "launching", label: "Launching products or campaigns", evidence: "Launching effectively is a concern", branch: "cross_functional" },
        { value: "operational_efficiency", label: "Operational cost / efficiency", evidence: "Operational cost or efficiency is a concern", branch: "operations" },
        { value: "alignment", label: "Alignment between teams", evidence: "Cross-team alignment is a concern", branch: "cross_functional" },
        { value: "unknown", label: "We're not sure", evidence: "The location of the problem isn't yet clear", branch: "unknown" },
      ],
      next: "change_signals",
    },

    change_signals: {
      id: "change_signals",
      section: "Growth & revenue",
      type: "multi_select",
      eyebrow: "WHAT'S CHANGED",
      question: "What has changed compared with 6–12 months ago?",
      help: "Select anything that applies.",
      options: [
        { value: "lead_volume_down", label: "Lead volume is down", evidence: "Lead volume has fallen", signal: "gtm" },
        { value: "lead_quality_down", label: "Lead quality is down", evidence: "Lead quality appears to have fallen", signal: "gtm" },
        { value: "conversion_down", label: "Conversion is down", evidence: "Conversion has fallen", signal: "gtm" },
        { value: "sales_cycle_longer", label: "Sales cycles are longer", evidence: "Sales cycles have lengthened", signal: "gtm" },
        { value: "win_rate_down", label: "Win rate is down", evidence: "Win rate has fallen", signal: "gtm" },
        { value: "cac_up", label: "Customer acquisition costs are up", evidence: "Customer acquisition costs have increased", signal: "gtm" },
        { value: "retention_down", label: "Retention / expansion is down", evidence: "Retention or customer expansion has fallen", signal: "cross_functional" },
        { value: "usage_down", label: "Product usage is down", evidence: "Product usage has fallen", signal: "product" },
        { value: "delivery_slower", label: "Delivery is slower", evidence: "Delivery has become slower", signal: "operations" },
        { value: "costs_up", label: "Costs are increasing", evidence: "Operating costs are increasing", signal: "operations" },
        { value: "nothing_obvious", label: "Nothing obvious", evidence: "No obvious change has been identified" },
        { value: "dont_know", label: "We don't know", evidence: "The change isn't currently measured clearly" },
      ],
      next: "timing",
    },

    timing: {
      id: "timing",
      section: "Market & customers",
      type: "compound",
      eyebrow: "TIMING",
      question: "When did this start, and what changed around it?",
      fields: [
        {
          id: "problem_timing",
          question: "When did you first notice the problem?",
          type: "single_select",
          options: [
            { value: "under_3m", label: "Last 3 months", evidence: "Problem noticed within the last 3 months" },
            { value: "3_6m", label: "3–6 months ago", evidence: "Problem noticed 3–6 months ago" },
            { value: "6_12m", label: "6–12 months ago", evidence: "Problem noticed 6–12 months ago" },
            { value: "over_12m", label: "More than a year ago", evidence: "Problem has persisted for more than a year" },
            { value: "always", label: "It's always been a problem", evidence: "Problem appears longstanding" },
            { value: "unknown", label: "Hard to say", evidence: "Timing isn't clear" },
          ],
        },
        {
          id: "coincident_changes",
          question: "Did anything change around the same time?",
          type: "multi_select",
          options: [
            { value: "target_customer", label: "Target customers", evidence: "Target customers changed around the same time", signal: "gtm" },
            { value: "market", label: "Market / demand", evidence: "Market or demand conditions changed around the same time", signal: "gtm" },
            { value: "competition", label: "Competitors", evidence: "Competitive conditions changed around the same time", signal: "gtm" },
            { value: "pricing", label: "Pricing", evidence: "Pricing changed around the same time", signal: "gtm" },
            { value: "product", label: "Product", evidence: "The product changed around the same time", signal: "product" },
            { value: "sales_team", label: "Sales team", evidence: "The Sales team changed around the same time", signal: "gtm" },
            { value: "marketing", label: "Marketing activity", evidence: "Marketing activity changed around the same time", signal: "gtm" },
            { value: "channels", label: "Channels", evidence: "Channel mix changed around the same time", signal: "gtm" },
            { value: "organisation", label: "Leadership / organisation", evidence: "Leadership or organisational changes happened around the same time", signal: "cross_functional" },
            { value: "technology", label: "Technology / systems", evidence: "Technology or systems changed around the same time", signal: "operations" },
            { value: "nothing", label: "Nothing obvious", evidence: "No obvious coinciding change identified" },
            { value: "unknown", label: "Don't know", evidence: "Potential coinciding changes are unclear" },
          ],
        },
      ],
      next: {
        resolver: "dominant_branch",
        branches: {
          gtm: "gtm_constraint",
          product: "product_constraint",
          operations: "operations_constraint",
          cross_functional: "alignment",
          unknown: "evidence_visibility",
        },
      },
    },

    // ---- GTM / GROWTH BRANCH ----
    gtm_constraint: {
      id: "gtm_constraint",
      section: "Growth & revenue",
      type: "single_select",
      eyebrow: "GO-TO-MARKET",
      question: "Where does the biggest drop appear to happen?",
      options: [
        { value: "awareness", label: "Not enough people finding us", evidence: "The constraint appears to be before initial interest" },
        { value: "interest", label: "Interest isn't becoming enquiries", evidence: "Interest isn't converting into enquiries" },
        { value: "qualification", label: "Leads aren't becoming opportunities", evidence: "Lead-to-opportunity conversion appears weak" },
        { value: "sales", label: "Opportunities aren't becoming customers", evidence: "Opportunity-to-customer conversion appears weak" },
        { value: "expansion", label: "Customers aren't expanding", evidence: "Customer expansion appears weak" },
        { value: "unknown", label: "We don't know", evidence: "The point of conversion loss isn't currently clear" },
      ],
      next: "sales_view",
    },

    sales_view: {
      id: "sales_view",
      section: "Growth & revenue",
      type: "multi_select",
      maxSelections: 3,
      eyebrow: "SALES PERSPECTIVE",
      question: "What does Sales say is getting in the way?",
      options: [
        { value: "not_enough_leads", label: "Not enough leads", evidence: "Sales believes lead volume is a constraint" },
        { value: "lead_quality", label: "Poor lead quality", evidence: "Sales believes lead quality is a constraint" },
        { value: "wrong_customers", label: "Wrong customers", evidence: "Sales believes the business is reaching the wrong customers" },
        { value: "pricing", label: "Pricing", evidence: "Sales sees pricing as a barrier" },
        { value: "competition", label: "Competition", evidence: "Sales sees competition as a barrier" },
        { value: "product_gaps", label: "Product gaps", evidence: "Sales sees product gaps as a barrier" },
        { value: "momentum", label: "Deals lose momentum", evidence: "Sales sees deal momentum as a problem" },
        { value: "capacity", label: "Sales capability / capacity", evidence: "Sales capability or capacity may be constrained" },
        { value: "disagreement", label: "Sales and Marketing disagree", evidence: "Sales and Marketing have different views of the problem" },
        { value: "unknown", label: "We don't really know", evidence: "The Sales perspective isn't clear" },
      ],
      next: "gtm_evidence",
    },

    gtm_evidence: {
      id: "gtm_evidence",
      section: "Growth & revenue",
      type: "single_select",
      eyebrow: "EVIDENCE",
      question: "What does the data actually show?",
      options: [
        { value: "supports", label: "It supports what the team is saying", evidence: "Available data supports the team's view" },
        { value: "contradicts", label: "It suggests something different", evidence: "Available data appears to conflict with the team's view" },
        { value: "partial", label: "We have some evidence, but not enough", evidence: "Evidence is incomplete" },
        { value: "not_measured", label: "We don't measure this properly", evidence: "There is a measurement gap around the problem" },
        { value: "unknown", label: "I'm not sure", evidence: "Evidence quality isn't currently clear" },
      ],
      next: "attempted_interventions",
    },

    // ---- PRODUCT BRANCH ----
    product_constraint: {
      id: "product_constraint",
      section: "Product & value",
      type: "single_select",
      eyebrow: "PRODUCT & VALUE",
      question: "What's the main product problem?",
      options: [
        { value: "adoption", label: "Customers aren't adopting it", evidence: "Product adoption is below expectations", next: "product_adoption" },
        { value: "feature_usage", label: "Customers aren't using key features", evidence: "Key feature usage is below expectations", next: "product_adoption" },
        { value: "prioritisation", label: "We're unsure what to build next", evidence: "Product prioritisation is unclear", next: "product_decisions" },
        { value: "requests", label: "Roadmap is dominated by requests", evidence: "Customer or stakeholder requests heavily influence the roadmap", next: "product_decisions" },
        { value: "delivery", label: "Product takes too long to ship", evidence: "Product delivery speed is a concern", next: "product_decisions" },
        { value: "differentiation", label: "Product isn't differentiated enough", evidence: "Product differentiation is a concern", next: "product_decisions" },
        { value: "alignment", label: "Product and commercial teams disagree", evidence: "Product and commercial teams have different views", next: "product_decisions" },
        { value: "unknown", label: "We're not sure", evidence: "The product constraint isn't yet clear", next: "product_decisions" },
      ],
    },

    product_adoption: {
      id: "product_adoption",
      section: "Product & value",
      type: "single_select",
      question: "Do you know where adoption breaks down?",
      options: [
        { value: "discovery", label: "Customers don't discover it", evidence: "Feature discovery may be a constraint" },
        { value: "trial", label: "They discover it but don't try it", evidence: "Discovery occurs, but initial use is weak" },
        { value: "repeat", label: "They try it but don't continue", evidence: "Initial use occurs, but repeat usage is weak" },
        { value: "value", label: "They use it but don't get enough value", evidence: "Usage occurs, but perceived value may be weak" },
        { value: "segments", label: "Different customer groups behave differently", evidence: "Adoption differs across customer groups" },
        { value: "unknown", label: "We don't know", evidence: "There is a measurement gap around product adoption" },
      ],
      next: "product_outcomes",
    },

    product_decisions: {
      id: "product_decisions",
      section: "Product & value",
      type: "multi_select",
      question: "What evidence drives product decisions today?",
      options: [
        { value: "research", label: "Customer research", evidence: "Customer research informs product decisions" },
        { value: "usage", label: "Product usage data", evidence: "Usage data informs product decisions" },
        { value: "commercial", label: "Commercial data", evidence: "Commercial data informs product decisions" },
        { value: "sales", label: "Sales feedback", evidence: "Sales feedback informs product decisions" },
        { value: "requests", label: "Customer requests", evidence: "Customer requests influence product decisions" },
        { value: "leadership", label: "Leadership judgement", evidence: "Leadership judgement influences product decisions" },
        { value: "mixed", label: "A mixture of these", evidence: "Product decisions draw on several evidence sources" },
        { value: "little", label: "Very little consistent evidence", evidence: "Product decisions lack consistent supporting evidence" },
      ],
      next: "product_outcomes",
    },

    product_outcomes: {
      id: "product_outcomes",
      section: "Product & value",
      type: "single_select",
      question:
        "When something launches, can you tell whether it created the expected outcome?",
      options: [
        { value: "yes", label: "Yes, consistently", evidence: "Product outcomes are consistently measured" },
        { value: "usually", label: "Usually", evidence: "Product outcomes are usually measured" },
        { value: "sometimes", label: "Sometimes", evidence: "Product outcome measurement is inconsistent" },
        { value: "usage_only", label: "We measure usage, not business impact", evidence: "Product usage is measured more clearly than business impact" },
        { value: "rarely", label: "Rarely", evidence: "Product outcomes are rarely measured" },
        { value: "no", label: "No", evidence: "There is a measurement gap around product outcomes" },
      ],
      next: "attempted_interventions",
    },

    // ---- OPERATIONS BRANCH ----
    operations_constraint: {
      id: "operations_constraint",
      section: "Operations & efficiency",
      type: "multi_select",
      maxSelections: 3,
      eyebrow: "OPERATIONS & EFFICIENCY",
      question: "Where does work get stuck most often?",
      options: [
        { value: "manual", label: "Repetitive manual work", evidence: "Repetitive manual work is consuming capacity" },
        { value: "systems", label: "Moving information between systems", evidence: "System handoffs create operational friction" },
        { value: "finding_info", label: "Finding information", evidence: "Finding information slows work down" },
        { value: "approvals", label: "Approvals / handoffs", evidence: "Approvals or handoffs slow delivery" },
        { value: "reporting", label: "Reporting", evidence: "Reporting consumes significant operational effort" },
        { value: "content", label: "Producing content or documents", evidence: "Content or document production consumes capacity" },
        { value: "customer_service", label: "Customer service", evidence: "Customer service workflows are a constraint" },
        { value: "communication", label: "Internal communication", evidence: "Internal communication creates operational friction" },
        { value: "tools", label: "Too many disconnected tools", evidence: "Disconnected systems are creating friction" },
        { value: "unknown", label: "We're not sure", evidence: "The operational bottleneck isn't yet clear" },
      ],
      next: "operations_repeatability",
    },

    operations_repeatability: {
      id: "operations_repeatability",
      section: "Operations & efficiency",
      type: "single_select",
      question: "How much of that work is predictable and repeatable?",
      options: [
        { value: "most", label: "Most of it", evidence: "Most of the constrained work is predictable and repeatable" },
        { value: "significant", label: "A significant amount", evidence: "A significant amount of the work is repeatable" },
        { value: "some", label: "Some of it", evidence: "Some of the work is repeatable" },
        { value: "little", label: "Very little", evidence: "Little of the work appears predictable and repeatable" },
        { value: "unmapped", label: "We haven't mapped it", evidence: "The workflow hasn't been mapped clearly" },
      ],
      next: "automation_status",
    },

    automation_status: {
      id: "automation_status",
      section: "Operations & efficiency",
      type: "single_select",
      question: "Have you already tried automation or AI here?",
      options: [
        { value: "working", label: "Yes, and it's working", evidence: "Automation is already producing useful results", next: "automation_removal" },
        { value: "limited", label: "Yes, but impact is limited", evidence: "Automation has been introduced but impact is limited", next: "automation_removal" },
        { value: "experimented", label: "We've experimented", evidence: "The business has experimented with automation", next: "automation_removal" },
        { value: "implementing", label: "We're implementing something", evidence: "Automation is currently being implemented", next: "attempted_interventions" },
        { value: "planning", label: "We're planning something", evidence: "Automation is being considered", next: "attempted_interventions" },
        { value: "no", label: "No", evidence: "Automation has not yet been attempted", next: "attempted_interventions" },
      ],
    },

    automation_removal: {
      id: "automation_removal",
      section: "Operations & efficiency",
      type: "single_select",
      question: "Has the automation actually removed work from the process?",
      options: [
        { value: "significant", label: "Yes, significantly", evidence: "Automation has removed significant manual work" },
        { value: "some", label: "Some", evidence: "Automation has removed some manual work" },
        { value: "little", label: "Not much", evidence: "Automation has removed little manual work" },
        { value: "alongside", label: "No, it mostly sits alongside the old process", evidence: "Automation largely sits alongside the existing workflow" },
        { value: "unknown", label: "We don't know", evidence: "The operational impact of automation isn't measured clearly" },
      ],
      next: "attempted_interventions",
    },

    // ---- CROSS-FUNCTIONAL / UNKNOWN ----
    alignment: {
      id: "alignment",
      section: "Business context",
      type: "single_select",
      question: "Do the teams involved agree on what the problem is?",
      options: [
        { value: "yes", label: "Yes", evidence: "Teams broadly agree on the problem" },
        { value: "mostly", label: "Mostly", evidence: "Teams mostly agree on the problem" },
        { value: "different", label: "There are different views", evidence: "Different teams have different views of the problem" },
        { value: "no", label: "No", evidence: "Teams disagree about the problem" },
        { value: "unknown", label: "We haven't actually compared views", evidence: "Cross-team understanding of the problem hasn't been established" },
      ],
      next: "evidence_visibility",
    },

    evidence_visibility: {
      id: "evidence_visibility",
      section: "Business context",
      type: "single_select",
      eyebrow: "EVIDENCE",
      question: "How much evidence do you have showing where the problem sits?",
      options: [
        { value: "clear", label: "We can see it clearly in the data", evidence: "The problem is visible in available data" },
        { value: "some", label: "We have some evidence", evidence: "There is some evidence, but the picture is incomplete" },
        { value: "opinions", label: "Mostly team feedback and opinions", evidence: "Current understanding relies heavily on team perception" },
        { value: "little", label: "Very little", evidence: "There is limited evidence showing where the problem sits" },
        { value: "unknown", label: "I'm not sure", evidence: "Evidence quality is unclear" },
      ],
      next: "attempted_interventions",
    },

    // ---- COMMON CLOSE ----
    attempted_interventions: {
      id: "attempted_interventions",
      section: "Business context",
      type: "free_text",
      eyebrow: "WHAT YOU'VE TRIED",
      question: "What have you already tried?",
      help: "Tell us what's been changed, tested or invested in so far.",
      allowNone: true,
      noneLabel: "We haven't tried anything yet",
      evidence:
        "Generate a factual one-line summary of the intervention from the user's answer. Do not infer whether it worked unless the user explicitly says so.",
      next: "root_cause_confidence",
    },

    root_cause_confidence: {
      id: "root_cause_confidence",
      section: "Business context",
      type: "single_select",
      question: "How confident are you that you know the root cause?",
      options: [
        { value: "very", label: "Very confident", evidence: "The team believes it understands the root cause" },
        { value: "strong_hypothesis", label: "We have a strong hypothesis", evidence: "There is a working hypothesis about the root cause" },
        { value: "several", label: "We have several theories", evidence: "Several possible causes are being considered" },
        { value: "low", label: "Not very confident", evidence: "Confidence in the root cause is low" },
        { value: "why_here", label: "That's why I'm here", evidence: "The root cause remains unclear" },
      ],
      next: "commercial_impact",
    },

    commercial_impact: {
      id: "commercial_impact",
      section: "Growth & revenue",
      type: "multi_select",
      question: "If nothing changes over the next 12 months, what does it affect?",
      options: [
        { value: "revenue", label: "Revenue growth", evidence: "The problem threatens revenue growth" },
        { value: "margin", label: "Profit / margin", evidence: "The problem threatens profit or margin" },
        { value: "retention", label: "Customer retention", evidence: "The problem may affect customer retention" },
        { value: "product", label: "Product investment", evidence: "The problem may constrain product investment" },
        { value: "hiring", label: "Hiring", evidence: "The problem may affect hiring plans" },
        { value: "capacity", label: "Team capacity", evidence: "The problem is affecting team capacity" },
        { value: "funding", label: "Funding / investment", evidence: "The problem may affect funding or investment" },
        { value: "strategy", label: "Strategic plans", evidence: "The problem may affect strategic plans" },
        { value: "unknown", label: "Not sure", evidence: "The commercial consequence hasn't been quantified" },
      ],
      next: "reflection",
    },
  },
};

// ---- results readings (verbatim) ----
export const READINGS: Record<string, Reading> = {
  demand: {
    id: "demand",
    headline: "Your growth problem may start before the pipeline.",
    weakLink: "Demand generation",
    summary:
      "The first constraint appears to sit at the top of the commercial journey. Before changing the wider sales process, we'd want to establish whether the right buyers are seeing and responding to the proposition.",
  },
  conversion: {
    id: "conversion",
    headline: "You may not need more leads.",
    weakLink: "Conversion",
    summary:
      "The evidence points further down the journey than lead generation. We'd investigate where existing demand stops progressing before putting more money into generating additional volume.",
  },
  icp_fit: {
    id: "icp_fit",
    headline: "The issue may be who you're trying to reach.",
    weakLink: "Customer fit",
    summary:
      "There are signs that customer fit needs closer investigation. The next step would be separating a genuine demand problem from a targeting, positioning or customer-selection problem.",
  },
  evidence_gap: {
    id: "evidence_gap",
    headline: "The biggest problem may be what you can't currently see.",
    weakLink: "Measurement",
    summary:
      "There isn't enough reliable evidence yet to say where the constraint sits. Rather than jumping to another tactic, we'd first make the customer and commercial journey measurable enough to identify where performance is actually breaking down.",
  },
  product_adoption: {
    id: "product_adoption",
    headline: "The product may be shipping faster than value is landing.",
    weakLink: "Adoption & value",
    summary:
      "The issue appears to sit between what has been built and the value customers actually experience. We'd identify where adoption breaks down before adding more features or changing the roadmap.",
  },
  product_decision: {
    id: "product_decision",
    headline: "The roadmap may not be the first thing to fix.",
    weakLink: "Product decisions",
    summary:
      "The evidence suggests the bigger question is how product decisions are made and validated. We'd strengthen the link between customer problems, commercial value and measurable outcomes before changing the roadmap itself.",
  },
  workflow: {
    id: "workflow",
    headline: "The technology may not be the bottleneck.",
    weakLink: "Workflow",
    summary:
      "The constraint appears to sit in how work moves through the business. We'd map the workflow and remove unnecessary steps before deciding where automation or AI will create meaningful value.",
  },
  automation_no_removal: {
    id: "automation_no_removal",
    headline: "Automation has been added. The work hasn't disappeared.",
    weakLink: "Operational design",
    summary:
      "Technology has been introduced, but it may be sitting alongside the existing process rather than replacing work. We'd focus on redesigning the workflow around the outcome before adding more automation.",
  },
  cross_functional: {
    id: "cross_functional",
    headline: "The problem doesn't sit neatly inside one team.",
    weakLink: "Commercial alignment",
    summary:
      "The symptoms cut across more than one function, which makes a single-team fix unlikely to solve the whole problem. We'd establish a shared view of the constraint, evidence and ownership before changing individual tactics.",
  },
  insufficient: {
    id: "insufficient",
    headline: "There's a signal here, but not enough evidence yet.",
    weakLink: "Needs validation",
    summary:
      "Your answers point towards a small number of areas worth investigating, but there isn't enough evidence to responsibly call one the root cause. The next step is validating those hypotheses against the data, customers and people inside the business.",
  },
};
