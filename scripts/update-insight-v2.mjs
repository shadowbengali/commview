// V2 in-place update of the 8 Insight posts. Matches by slug, PATCHES only the
// V2 fields (body, standfirst, takeaways, faqs, seo, relatedPosts) and leaves
// cover/author/category/tags/publishedAt/featured/_id untouched. Reuses the
// existing inline figure asset (no re-upload). Patches published AND draft docs.
//   DRY_RUN=1 node scripts/update-insight-v2.mjs   (offline-ish: reads dataset, no writes)
//   node scripts/update-insight-v2.mjs
import fs from "node:fs";
import { createClient } from "@sanity/client";

const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const DRY = process.env.DRY_RUN === "1";
const c = createClient({ projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production", apiVersion: "2024-10-01", token: env.SANITY_API_WRITE_TOKEN, useCdn: false });

const key = () => Math.random().toString(36).slice(2, 12);
function parseInline(text) {
  const children = [], markDefs = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((\/[^)\s]+|https?:\/\/[^)\s]+|mailto:[^)\s]+)\)/g;
  let last = 0, m;
  const push = (t, marks = []) => { if (t) children.push({ _type: "span", _key: key(), text: t, marks }); };
  while ((m = re.exec(text))) {
    if (m.index > last) push(text.slice(last, m.index));
    if (m[1] !== undefined) push(m[1], ["strong"]);
    else { const k = key(); markDefs.push({ _type: "link", _key: k, href: m[3] }); push(m[2], [k]); }
    last = m.index + m[0].length;
  }
  if (last < text.length) push(text.slice(last));
  if (children.length === 0) push(text);
  return { children, markDefs };
}
const blk = (style, text) => { const { children, markDefs } = parseInline(text); return { _type: "block", _key: key(), style, markDefs, children }; };
function mdToPT(md, figureBlock) {
  const out = [];
  for (const raw of md.split(/\n\s*\n/)) {
    const chunk = raw.trim();
    if (!chunk) continue;
    if (chunk === "[[FIGURE:inline]]") { if (figureBlock) out.push(figureBlock); continue; }
    if (chunk.startsWith("### ")) { out.push(blk("h3", chunk.slice(4))); continue; }
    if (chunk.startsWith("## ")) { out.push(blk("h2", chunk.slice(3))); continue; }
    if (chunk.startsWith("> ")) { out.push(blk("blockquote", chunk.slice(2))); continue; }
    const lines = chunk.split("\n").map((l) => l.trim());
    if (lines.every((l) => l.startsWith("- "))) { for (const l of lines) { const { children, markDefs } = parseInline(l.slice(2)); out.push({ _type: "block", _key: key(), style: "normal", listItem: "bullet", level: 1, markDefs, children }); } continue; }
    if (lines.every((l) => /^\d+\.\s/.test(l))) { for (const l of lines) { const { children, markDefs } = parseInline(l.replace(/^\d+\.\s/, "")); out.push({ _type: "block", _key: key(), style: "normal", listItem: "number", level: 1, markDefs, children }); } continue; }
    out.push(blk("normal", chunk));
  }
  return out;
}

const A = [
  { slug: "b2b-gtm-stack-buyer-no-longer-exists", sibling: "are-we-targeting-wrong-customers", body: "scripts/insights/v2/blog-01.body.md",
    standfirst: "B2B buying has changed faster than the systems used to measure it. The problem is not that MQLs or CRM stopped working, but that one person's activity rarely represents the whole buying process.",
    seoTitle: "The B2B GTM Stack Was Built for a Buyer Who's Gone", seoDesc: "B2B buying has changed, but much of the GTM stack has not. See where lead-based models break down and what a more useful approach looks like.",
    takeaways: ["B2B buying is increasingly distributed across people, channels and sources of information.","An individual lead remains useful, but should not be treated as the entire buying journey.","Modern GTM measurement needs to connect person, account, buying-group, opportunity and revenue signals.","Sales and Marketing should work from a shared commercial picture rather than a rigid handoff."],
    faqs: [{ q: "Are MQLs dead?", a: "No. An MQL can still be a useful signal. The problem is treating one person's score or behaviour as if it represents an entire B2B buying process." },{ q: "What is a buying group?", a: "A buying group is the collection of people involved in researching, evaluating, influencing or approving a purchase within an organisation." },{ q: "Does modern B2B GTM require replacing the CRM?", a: "Not necessarily. The first step is understanding the buying journey and the signals that matter. Existing systems can often support a better model once the process and data have been redesigned." }] },
  { slug: "are-we-targeting-wrong-customers", sibling: "b2b-gtm-stack-buyer-no-longer-exists", body: "scripts/insights/v2/blog-02.body.md",
    standfirst: "An ICP can drift without anyone deliberately changing it. The result is longer sales cycles, weaker economics and teams quietly working to different definitions of a good customer.",
    seoTitle: "Are You Targeting the Wrong Customers? ICP Diagnostic", seoDesc: "Your ICP can drift as the business grows. Learn how to spot the signals, analyse your strongest customers and build a definition Sales and Marketing can actually use.",
    takeaways: ["An ICP should identify where customer value and commercial value overlap.","Firmographics alone rarely explain which customers make the best customers.","Sales, Marketing and Product should use the same commercial definition of fit.","Changing an ICP starts with evidence from real customers, not rewriting a persona document."],
    faqs: [{ q: "What is an ideal customer profile?", a: "An ideal customer profile describes the type of organisation where there is a strong combination of customer need, commercial fit and your ability to create value." },{ q: "How do you know if your ICP is wrong?", a: "Signals can include longer sales cycles, falling deal values, increased discounting, poor-fit leads and product requests pulling in unrelated directions. No single signal proves the ICP is wrong, but a pattern warrants investigation." },{ q: "How often should an ICP be reviewed?", a: "Review it when the business, market or customer economics materially change, and periodically compare the documented ICP with the customers actually producing the strongest outcomes." }] },
  { slug: "why-has-b2b-growth-flattened", sibling: "why-isnt-b2b-website-converting", body: "scripts/insights/v2/blog-03.body.md",
    standfirst: "When B2B growth slows, doing more is not automatically the answer. Diagnose whether the constraint sits in your channels, market, execution or product before spending harder.",
    seoTitle: "Why Has Your B2B Growth Flattened? A Diagnostic", seoDesc: "B2B growth can plateau for very different reasons. Diagnose channel, market, execution and product constraints before deciding what to scale next.",
    takeaways: ["Growth plateaus can come from channel, market, execution or product constraints.","Similar revenue symptoms can have completely different underlying causes.","A second growth engine is a repeatable commercial system, not simply another marketing channel.","Scaling activity before identifying the constraint can make the problem more expensive."],
    faqs: [{ q: "Why does B2B growth plateau?", a: "A plateau can result from several constraints, including declining channel efficiency, limited market headroom, execution bottlenecks or a product and proposition that no longer supports the next stage of growth." },{ q: "Should you hire more salespeople when growth slows?", a: "Only if sales capacity is genuinely the constraint. Adding headcount before diagnosing the problem can increase cost without improving growth." },{ q: "What is a second growth engine?", a: "A second growth engine is another repeatable source of commercially attractive growth, such as a new segment, geography, proposition, product, partner motion or route to market." }] },
  { slug: "why-isnt-b2b-website-converting", sibling: "why-has-b2b-growth-flattened", body: "scripts/insights/v2/blog-04.body.md",
    standfirst: "A B2B website conversion problem may start before the website itself. Diagnose traffic quality, positioning, messaging, proof, offer and friction before optimising buttons.",
    seoTitle: "Why Isn't Your B2B Website Converting? Diagnostic", seoDesc: "Traffic is arriving but pipeline isn't. Diagnose traffic quality, positioning, messaging, proof, offer and friction before redesigning your B2B website.",
    takeaways: ["Traffic quality should be checked before website conversion mechanics.","Positioning, messaging and friction are different problems requiring different fixes.","Proof and the relevance of the offer often matter more than cosmetic CRO changes.","Conversion should be judged by the quality of progression, not clicks alone."],
    faqs: [{ q: "What is a good B2B website conversion rate?", a: "A conversion rate only becomes useful when the conversion itself is commercially meaningful. A lower rate of high-fit opportunities can be more valuable than a higher rate of poor-fit enquiries." },{ q: "Why does a B2B website get traffic but no leads?", a: "Possible causes include irrelevant traffic, weak positioning, unclear messaging, insufficient proof, an unattractive next step or excessive friction." },{ q: "What should you test first on a B2B website?", a: "Start with the biggest uncertainty in the buying journey, usually traffic quality, proposition, proof or the offer, before testing cosmetic interface changes." }] },
  { slug: "should-we-build-this-feature", sibling: "why-arent-customers-using-new-features", body: "scripts/insights/v2/blog-05.body.md",
    standfirst: "Roadmaps fill up because plausible requests are mistaken for evidence. Before estimating effort, establish who a feature is for, what changes for them and what changes for the business.",
    seoTitle: "Should You Build This Feature? A Prioritisation Framework", seoDesc: "Before adding another feature to the roadmap, test the customer problem, evidence, commercial impact and strategic fit. A practical B2B product prioritisation approach.",
    takeaways: ["Product prioritisation should start with the problem and evidence, not development effort.","Customer requests, lost deals and competitor launches are signals to investigate, not automatic roadmap commitments.","Large customers can distort product direction when commercial importance is confused with problem prevalence.","Frameworks such as RICE support judgement but cannot replace evidence."],
    faqs: [{ q: "What is feature prioritisation?", a: "Feature prioritisation is the process of deciding which product opportunities deserve investment based on evidence, customer impact, business impact, strategic fit, confidence and effort." },{ q: "Is RICE a good prioritisation framework?", a: "RICE can be useful for structuring a decision, but the score is only as reliable as the assumptions behind Reach, Impact, Confidence and Effort." },{ q: "Should you build a feature because a major customer requests it?", a: "Not automatically. Investigate whether the request represents a broader customer problem and compare the commercial value of the exception with its development and ongoing complexity." }] },
  { slug: "why-arent-customers-using-new-features", sibling: "should-we-build-this-feature", body: "scripts/insights/v2/blog-06.body.md",
    standfirst: "Low feature adoption is not one problem. Find where users disappear between eligibility, discovery, activation, value and repeat usage before deciding what to change.",
    seoTitle: "Why Aren't Customers Using Your New Features? Root Causes", seoDesc: "You shipped the feature but customers aren't using it. Diagnose discovery, activation, value and retention gaps before deciding what to change.",
    takeaways: ["Feature adoption should be diagnosed as a journey rather than a single usage metric.","Discovery, activation, value and retention gaps require different interventions.","What customers request is not always the same as the underlying problem they need solved.","Product analytics should measure the job a feature exists to perform."],
    faqs: [{ q: "Why do customers not use new product features?", a: "Low adoption can come from users not discovering the feature, failing to activate it, not receiving enough value or not having a reason to use it repeatedly." },{ q: "How should feature adoption be measured?", a: "Measure the journey from eligible users through exposure, starting, reaching meaningful value and repeating the behaviour where repeat usage is appropriate." },{ q: "Does low adoption mean the feature was a bad idea?", a: "Not necessarily. Low adoption can result from discovery, onboarding or activation problems even when the underlying feature solves a valuable customer problem." }] },
  { slug: "can-ai-actually-reduce-costs", sibling: "if-ai-becomes-the-interface", body: "scripts/insights/v2/blog-07.body.md",
    standfirst: "AI can reduce cost, but starting with the technology usually creates pilots rather than savings. Start with the workflow, baseline the economics, redesign the work and measure what actually changed.",
    seoTitle: "Can AI Actually Reduce Your Costs? A B2B Reality Check", seoDesc: "AI can reduce business costs, but only when applied to the right workflow. Learn how to baseline, redesign, automate and measure genuine AI ROI.",
    takeaways: ["\"Where can we use AI?\" is usually the wrong starting question.","Cost reduction begins by understanding and redesigning the workflow before automating it.","AI creates value when it removes or improves real work, not simply when it is added to an existing process.","AI ROI should be measured against an operational baseline covering cost, time, quality and risk."],
    faqs: [{ q: "Can AI genuinely reduce business costs?", a: "Yes, when it removes or improves real work within a workflow. Savings should be measured against the cost, time, quality and risk of the process before the change." },{ q: "How should a business choose its first AI use case?", a: "Start with a bounded workflow that has measurable cost or inefficiency. Understand and redesign the process before deciding which parts need AI, conventional automation or human judgement." },{ q: "How do you calculate AI ROI?", a: "Establish a baseline before implementation, then compare the redesigned workflow across cost, time, quality and risk while including technology, implementation, review and ongoing operating costs." }] },
  { slug: "if-ai-becomes-the-interface", sibling: "can-ai-actually-reduce-costs", body: "scripts/insights/v2/blog-08.body.md",
    standfirst: "If users can increasingly express the outcome they want instead of navigating software to produce it, the interface changes. That has bigger implications for product design than simply adding a chatbot.",
    seoTitle: "If AI Is the Interface, Would You Still Build That App?", seoDesc: "If users can state an outcome instead of navigating software, what happens to the traditional app? Exploring intent-based software and AI-first product design.",
    takeaways: ["AI-first software does not simply mean adding conversational chat to an existing product.","Some workflows can shift from navigating software to expressing intent and reviewing outcomes.","Data models, permissions, workflow logic and auditability become more important, not less.","Traditional interfaces still win where users need precision, exploration, comparison or direct control."],
    faqs: [{ q: "What is intent-based software?", a: "Intent-based software allows users to express more of the outcome they want while the system determines or recommends the steps required to achieve it within defined permissions and controls." },{ q: "Does AI-first software mean replacing interfaces with chatbots?", a: "No. AI-first does not mean chat-first. Text and voice can be useful interfaces, but generated views, traditional controls, recommendations and direct manipulation can all remain part of the experience." },{ q: "Will traditional software interfaces disappear?", a: "No. Traditional interfaces remain valuable where users need precision, visual comparison, exploration, creative control or a persistent view of complex information." }] },
];

const emdash = (s) => typeof s === "string" && s.includes("—");

for (const a of A) {
  const docs = await c.fetch('*[_type=="post" && slug.current==$s]{_id,"pub":!(_id in path("drafts.**")),seo,"figs":body[_type=="figure"]{"ref":asset._ref,alt,caption}}', { s: a.slug });
  if (docs.length !== 1 && !docs.some((d) => d.pub)) { console.log(`SKIP ${a.slug}: ${docs.length} docs`); continue; }
  const siblingId = await c.fetch('*[_type=="post" && slug.current==$s && !(_id in path("drafts.**"))][0]._id', { s: a.sibling });
  const fig0 = docs.map((d) => d.figs).find((f) => f && f.length)?.[0];
  const figureBlock = fig0 ? { _type: "figure", _key: key(), asset: { _type: "reference", _ref: fig0.ref }, alt: fig0.alt, ...(fig0.caption ? { caption: fig0.caption } : {}) } : null;
  const md = fs.readFileSync(a.body, "utf8");
  const body = mdToPT(md, figureBlock);

  const links = body.flatMap((b) => (b.markDefs || []).filter((d) => d._type === "link").map((d) => d.href));
  const figs = body.filter((b) => b._type === "figure").length;
  const dashHits = [a.standfirst, a.seoTitle, a.seoDesc, ...a.takeaways, ...a.faqs.flatMap((f) => [f.q, f.a]), ...body.flatMap((b) => (b.children || []).map((s) => s.text))].filter(emdash).length;

  console.log(`\n${a.slug}  docs:${docs.map((d) => d.pub ? "published" : "draft").join("+")}  blocks:${body.length} figs:${figs} links:[${links.join(", ") || "none"}] emdash:${dashHits} sibling:${siblingId ? "ok" : "MISSING"}`);
  if (DRY) continue;

  const existingSeo = docs.find((d) => d.seo)?.seo || {};
  const fields = {
    body,
    standfirst: a.standfirst,
    takeaways: a.takeaways,
    faqs: a.faqs.map((f) => ({ _type: "faq", _key: key(), question: f.q, answer: f.a })),
    seo: { ...existingSeo, _type: "seo", title: a.seoTitle, description: a.seoDesc },
    ...(siblingId ? { relatedPosts: [{ _type: "reference", _key: key(), _ref: siblingId }] } : {}),
  };
  for (const d of docs) { await c.patch(d._id).set(fields).commit(); console.log(`  patched ${d._id}`); }
}
