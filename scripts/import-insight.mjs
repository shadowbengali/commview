// Import an Insights post into Sanity as a DRAFT (reviewed before publishing).
//   node scripts/import-insight.mjs blog-01            (real run — needs SANITY_API_WRITE_TOKEN)
//   DRY_RUN=1 node scripts/import-insight.mjs blog-02  (offline: prints the plan + Portable Text)
// cover/inline images are optional: a draft can be created without a cover, but
// it CANNOT be published until a cover image (with alt) is added in Studio.
import fs from "node:fs";
import { createClient } from "@sanity/client";

const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const DRY = process.env.DRY_RUN === "1" || !env.SANITY_API_WRITE_TOKEN;
const IMG = "C:/Users/asada/AppData/Local/Temp/claude/C--Users-asada-commview/b34a8073-109f-47de-a3a9-7495f988452b/images";
const DESK = "C:/Users/asada/Desktop/settld-arabia/commview-images";

const POSTS = {
  "blog-01": {
    id: "post-b2b-gtm-stack-buyer-no-longer-exists",
    title: "The B2B GTM Stack Was Built for a Buyer Who No Longer Exists",
    slug: "b2b-gtm-stack-buyer-no-longer-exists",
    standfirst: "B2B buyers have changed how they research, shortlist and engage suppliers. The GTM stack has not kept up. Here is what needs to change.",
    metaTitle: "The B2B GTM Stack Was Built for a Buyer Who's Gone",
    categorySlug: "gtm-leadership",
    authorSlug: "asad",
    publishedAt: "2026-09-25T09:00:00.000Z",
    bodyFile: "scripts/insights/blog-01.body.md",
    cover: { file: `${IMG}/45.webp`, filename: "b2b-gtm-stack-old-vs-modern-buyer-journey.webp", alt: "Split diagram contrasting the old linear B2B GTM funnel (Lead, MQL, SQL, Opportunity, Revenue) with today's non-linear buying journey of multiple signals and stakeholders across research, evaluate, validate and decide stages." },
    inline: { file: `${IMG}/46.webp`, filename: "b2b-gtm-person-account-buying-group-revenue.webp", alt: "The modern B2B GTM model progressing from individual person-level engagement to account-level signals to buying-group behaviour to validated opportunity and revenue, with increasing signal strength and commercial intent.", caption: "" },
    takeaways: [
      "The MQL is not dead. Treating one person, one score and one handoff as the buying journey is the problem.",
      "Buyers can now do far more research, comparison and requirement-setting before they speak to Sales.",
      "Person-level engagement still matters, but it needs to sit alongside account intent, buying-group behaviour and commercial outcomes.",
      "Before replacing your GTM stack, work out whether the problem is the technology, the operating model or what you are measuring.",
    ],
    faqs: [
      { question: "Is the MQL dead?", answer: "No. An MQL can still be a useful person-level signal. The problem starts when it is treated as a complete representation of account intent or the buying journey. Combine individual engagement with account behaviour, buying-group signals and commercial outcomes." },
      { question: "What is a modern B2B GTM strategy?", answer: "A modern B2B GTM strategy connects how customers actually research and buy with positioning, demand generation, Sales, Product and measurement. It should account for self-directed research, multiple stakeholders and signals that happen outside a neat linear funnel." },
      { question: "Should we replace our CRM or marketing automation platform?", answer: "Usually not as the first move. Start by identifying what information and decisions the current operating model cannot support. Technology replacement should follow a clear requirement, not become a substitute for fixing the process." },
      { question: "How do you improve Sales and Marketing alignment?", answer: "Start with shared commercial definitions. Agree what a good account looks like, what constitutes meaningful intent, what Sales needs before engagement and which outcomes both teams are accountable for. Alignment becomes easier when the measurement system stops rewarding conflicting behaviours." },
      { question: "How can we tell whether our GTM model is the problem?", answer: "Look for disconnects between activity and commercial outcomes: healthy lead numbers but weak pipeline, increasing engagement without conversion, Sales rejecting Marketing-generated demand, or reporting that cannot explain why good opportunities progress." },
    ],
  },
  "blog-02": {
    id: "post-are-we-targeting-wrong-customers",
    title: "Are You Targeting the Wrong Customers? An ICP Diagnostic",
    slug: "are-we-targeting-wrong-customers",
    standfirst: "Your ICP can drift as the business changes. Here is how to spot it, rebuild it around evidence and give Sales and Marketing something they can actually use.",
    metaTitle: "Are You Targeting the Wrong Customers? ICP Diagnostic",
    categorySlug: "gtm-leadership",
    authorSlug: "asad",
    publishedAt: "2026-09-28T09:00:00.000Z",
    bodyFile: "scripts/insights/blog-02.body.md",
    cover: { file: `${DESK}/ideal-customer-profile-targeting-wrong-customers-banner.png`, filename: "ideal-customer-profile-targeting-wrong-customers-banner.png", contentType: "image/png", alt: "B2B customer targeting visual showing a defined ideal customer profile within a wider market" },
    inline: { file: `${IMG}/48.webp`, filename: "icp-narrowing-market-to-best-fit.webp", alt: "Ideal customer profile process narrowing the B2B market by business criteria, customer problems and commercial fit", caption: "" },
    takeaways: [
      "An ICP is not a branding exercise. It is a commercial decision about where you are most likely to create and capture value.",
      "The best place to start is usually your existing customer base, not a blank template.",
      "Falling win rates, longer sales cycles and increasing one-off requests can all indicate targeting drift.",
      "A useful ICP combines firmographic, behavioural and situational evidence.",
    ],
    faqs: [
      { question: "What is an ideal customer profile?", answer: "An ideal customer profile describes the type of organisation most likely to receive strong value from your offer and create strong commercial value for your business. A useful B2B ICP includes company characteristics, buying behaviour and the situations that create urgency." },
      { question: "How often should an ICP be updated?", answer: "Review it whenever there is meaningful evidence that the market or business has changed. For many growing B2B companies, a quarterly evidence review is sensible. The important thing is not the calendar. It is whether wins, losses, churn and customer behaviour are changing." },
      { question: "What is the difference between an ICP and a buyer persona?", answer: "The ICP defines the type of company you should prioritise. Buyer personas describe the people involved in buying or using the product inside those companies. In B2B, you normally need both because several stakeholders can influence the same purchase." },
      { question: "Who should own the ICP?", answer: "Treat it as a shared commercial asset. GTM leadership can coordinate it, but Sales, Marketing, Product and customer-facing teams should contribute evidence. An ICP owned by one function tends to reflect that function's view of the customer." },
      { question: "How do I know if my ICP is wrong?", answer: "Look for segment-level changes in win rate, sales-cycle length, deal value, retention, support burden and product requests. The issue may be the ICP itself, or it may be that targeting and qualification no longer match it." },
    ],
  },
  "blog-03": {
    id: "post-why-has-b2b-growth-flattened",
    title: "Why Has B2B Growth Flattened? Breaking the Scale-Up Plateau",
    slug: "why-has-b2b-growth-flattened",
    standfirst: "B2B growth rarely stalls for one simple reason. Diagnose whether the constraint is your channel, market, execution or product before spending more.",
    metaTitle: "Why Has Your B2B Growth Flattened? A Diagnostic",
    categorySlug: "growth",
    authorSlug: "asad",
    publishedAt: "2026-09-24T09:00:00.000Z",
    bodyFile: "scripts/insights/blog-03.body.md",
    cover: { file: `${DESK}/why-has-b2b-growth-flattened-banner.png`, filename: "why-has-b2b-growth-flattened-banner.png", contentType: "image/png", alt: "Diagnostic visual for why B2B growth flattens, showing the shift from rising growth to a plateau." },
    inline: { file: `${DESK}/b2b-growth-plateau-four-constraints-diagnostic.png`, filename: "b2b-growth-plateau-four-constraints-diagnostic.png", contentType: "image/png", alt: "The four growth constraints: channel saturation, market saturation, execution saturation and product ceiling.", caption: "" },
    takeaways: [
      "Flat growth is a symptom, not a diagnosis.",
      "More marketing spend can make a growth problem worse if the constraint sits elsewhere.",
      "Separate channel saturation, market saturation, execution saturation and product ceiling before choosing a response.",
      "A second growth engine should be built deliberately, not because the first engine had one bad quarter.",
    ],
    faqs: [
      { question: "Why does B2B growth plateau?", answer: "Common causes include diminishing returns from an acquisition channel, saturation of the current market, execution bottlenecks or a product that cannot support the next customer segment. The right diagnosis depends on where the commercial metrics changed." },
      { question: "What is a B2B growth strategy?", answer: "A B2B growth strategy defines where additional revenue will come from and what capabilities are required to capture it. It should connect target customers, proposition, acquisition, sales conversion, product capability, retention and economics rather than focusing on marketing activity alone." },
      { question: "When should a company build a second growth engine?", answer: "When the core engine is understood and repeatable, but evidence suggests it cannot support the next stage of growth alone. Build one new engine at a time and define what evidence would prove or disprove the hypothesis." },
      { question: "Should we hire more salespeople when growth slows?", answer: "Only if sales capacity is genuinely the constraint. If pipeline quality, market size, proposition or conversion is the problem, additional headcount can increase cost without fixing growth." },
      { question: "How long does it take to diagnose a growth problem?", answer: "Initial patterns can often be identified quickly if reliable funnel, customer and revenue data exists. The harder part is validating causality. Avoid making a major investment from one month's numbers or one team's explanation." },
    ],
  },
  "blog-04": {
    id: "post-why-isnt-b2b-website-converting",
    title: "Why Isn't Your B2B Website Converting? A Practical Diagnostic",
    slug: "why-isnt-b2b-website-converting",
    standfirst: "Traffic is coming in but enquiries are not. Diagnose traffic quality, proposition, trust and friction before redesigning your B2B website.",
    metaTitle: "Why Isn't Your B2B Website Converting? Diagnostic",
    categorySlug: "growth",
    authorSlug: "asad",
    publishedAt: "2026-09-22T09:00:00.000Z",
    bodyFile: "scripts/insights/blog-04.body.md",
    cover: { file: `${DESK}/why-b2b-website-isnt-converting-banner.png`, filename: "why-b2b-website-isnt-converting-banner.png", contentType: "image/png", alt: "Diagnostic visual for why a B2B website is not converting, from traffic quality through to friction." },
    inline: { file: `${DESK}/b2b-website-conversion-diagnostic.png`, filename: "b2b-website-conversion-diagnostic.png", contentType: "image/png", alt: "Diagnostic flow for why a B2B website is not converting: traffic quality, proposition, CTA, proof and friction.", caption: "" },
    takeaways: [
      "A conversion problem can start before the visitor reaches the website.",
      "Proposition, messaging and friction are different problems and need different fixes.",
      "Test meaningful commercial changes before cosmetic ones.",
      "The best CTA depends on the buyer's stage, risk and commitment, not on a generic CRO rule.",
    ],
    faqs: [
      { question: "What is a good B2B website conversion rate?", answer: "There is no useful universal number without defining the conversion, traffic source, audience and buying motion. A demo request from high-intent enterprise traffic is different from a newsletter signup from informational search. Benchmark against your own qualified commercial outcomes first." },
      { question: "Why does my website get traffic but no leads?", answer: "Common causes include poor traffic quality, unclear positioning, weak proof, an inappropriate CTA or unnecessary friction. Segment traffic and conversion by source and intent before assuming the website design itself is the problem." },
      { question: "What should a B2B homepage include?", answer: "At minimum, make the audience, problem, proposition and next step clear. Add enough evidence to reduce buyer risk. The exact structure should follow what the customer needs to understand, not a generic homepage template." },
      { question: "Should we redesign our website to improve conversion?", answer: "Not automatically. Diagnose whether the constraint is positioning, messaging, traffic quality, proof or friction first. A redesign can be expensive camouflage for a commercial problem that sits somewhere else." },
      { question: "What should we test first in B2B CRO?", answer: "Start with meaningful changes to proposition, proof and CTA hierarchy. Prioritise tests that could change buyer understanding or intent rather than cosmetic changes that are easy to implement but commercially insignificant." },
    ],
  },
  "blog-05": {
    id: "post-should-we-build-this-feature",
    title: "Should You Build This Feature? A B2B Product Prioritisation Framework",
    slug: "should-we-build-this-feature",
    standfirst: "Every roadmap contains features that should not be there. Ask who it is for, what changes for the user and what changes for the business before you build.",
    metaTitle: "Should You Build This Feature? A Prioritisation Framework",
    categorySlug: "product",
    authorSlug: "asad",
    publishedAt: "2026-09-18T09:00:00.000Z",
    bodyFile: "scripts/insights/blog-05.body.md",
    cover: { file: `${DESK}/should-we-build-this-feature-product-roadmap-banner.png`, filename: "should-we-build-this-feature-product-roadmap-banner.png", contentType: "image/png", alt: "Product roadmap prioritisation visual for deciding whether to build a feature." },
    inline: { file: `${DESK}/b2b-feature-prioritisation-decision-model.png`, filename: "b2b-feature-prioritisation-decision-model.png", contentType: "image/png", alt: "A B2B feature prioritisation decision model weighing problem, evidence, audience, customer impact, business impact, confidence and effort.", caption: "" },
    takeaways: [
      "A feature request is evidence of a problem, not automatically evidence of the right solution.",
      "Start with customer and business impact before discussing scope.",
      "Frameworks such as RICE help structure decisions but cannot replace product judgement.",
      "The loudest or largest customer can distort the roadmap if one request is mistaken for a repeatable need.",
    ],
    faqs: [
      { question: "What is feature prioritisation?", answer: "Feature prioritisation is the process of deciding which product problems or capabilities deserve limited delivery capacity first. Good prioritisation considers customer value, commercial impact, evidence, strategic fit, confidence, effort and opportunity cost." },
      { question: "What is the RICE framework?", answer: "RICE scores initiatives using Reach, Impact, Confidence and Effort. It can help compare competing opportunities, but the result is only as reliable as the assumptions behind the inputs. Use it to structure a decision rather than outsource judgement." },
      { question: "How should product teams prioritise customer requests?", answer: "Group requests around underlying problems, then assess how often the problem occurs, who experiences it, its impact and its fit with product strategy. Do not automatically convert individual feature requests into roadmap commitments." },
      { question: "Should Sales decide the product roadmap?", answer: "Sales should provide strong evidence from prospects and customers, particularly around objections, lost deals and commercial urgency. Product prioritisation still needs to balance that evidence against customer value, strategy, technical constraints and the needs of the wider market." },
      { question: "What is a value vs effort matrix?", answer: "It maps potential initiatives according to expected value and the effort required to deliver them. It is useful for exposing obvious trade-offs, but teams should define what value means before using the matrix." },
    ],
  },
  "blog-06": {
    id: "post-why-arent-customers-using-new-features",
    title: "Why Aren't Customers Using Your New Features? Adoption Root Causes",
    slug: "why-arent-customers-using-new-features",
    standfirst: "You shipped it and customers did not use it. Diagnose discovery, activation, value and retention before deciding the feature itself has failed.",
    metaTitle: "Why Aren't Customers Using Your New Features? Root Causes",
    categorySlug: "product",
    authorSlug: "asad",
    publishedAt: "2026-09-15T09:00:00.000Z",
    bodyFile: "scripts/insights/blog-06.body.md",
    cover: { file: `${DESK}/why-customers-arent-using-new-features-banner.png`, filename: "why-customers-arent-using-new-features-banner.png", contentType: "image/png", alt: "Visual for why customers are not using new product features and how to diagnose adoption." },
    inline: { file: `${DESK}/feature-adoption-funnel-diagnostic.png`, filename: "feature-adoption-funnel-diagnostic.png", contentType: "image/png", alt: "The feature adoption funnel: eligible, exposed, started, activated and repeated, used to diagnose where adoption breaks.", caption: "" },
    takeaways: [
      "Low feature adoption can mean customers never found it, could not activate it, saw no value or did not return.",
      "Usage alone does not tell you which failure mode you have.",
      "Customer requests should be translated into underlying needs before they become product requirements.",
      "Define the value event and instrumentation before launch, not after adoption disappoints.",
    ],
    faqs: [
      { question: "What is product adoption?", answer: "Product adoption describes the process by which users discover, begin using and continue receiving value from a product or capability. For individual features, adoption should be measured against the users and situations the feature was actually designed for." },
      { question: "Why is feature adoption low?", answer: "Common causes are poor discovery, activation friction, weak perceived value or failure to create repeat behaviour. Low usage alone cannot tell you which cause applies, so instrument the journey from eligibility through value." },
      { question: "What is user activation?", answer: "Activation is the point at which a user first experiences meaningful product value. It should be defined around an outcome or useful behaviour, not simply account creation, login or a button click." },
      { question: "Does low adoption mean a feature was a bad idea?", answer: "Not necessarily. The feature may be valuable but poorly surfaced, difficult to start using or relevant only to a specific group. Compare intended audience, exposure, activation and value before deciding whether the underlying idea was wrong." },
      { question: "How do you improve product engagement?", answer: "Start with the user problem and the expected value event. Reduce unnecessary effort, surface the capability in the right context and measure whether users reach value. Avoid adding notifications or prompts before understanding why engagement is low." },
    ],
  },
  "blog-07": {
    id: "post-can-ai-actually-reduce-costs",
    title: "Can AI Actually Reduce Your Costs? A B2B Reality Check",
    slug: "can-ai-actually-reduce-costs",
    standfirst: "We removed £690k of annual marketing spend using AI. The lesson was not to buy more AI. It was to redesign the work around the right problem.",
    metaTitle: "Can AI Actually Reduce Your Costs? A B2B Reality Check",
    categorySlug: "operational-ai",
    authorSlug: "asad",
    publishedAt: "2026-09-11T09:00:00.000Z",
    bodyFile: "scripts/insights/blog-07.body.md",
    cover: { file: `${DESK}/ai-cost-reduction-690k-annual-saving-banner.png`, filename: "ai-cost-reduction-690k-annual-saving-banner.png", contentType: "image/png", alt: "AI cost reduction visual referencing a large annual saving from redesigning a business workflow." },
    inline: { file: `${DESK}/ai-workflow-cost-reduction-model.png`, filename: "ai-workflow-cost-reduction-model.png", contentType: "image/png", alt: "A model for reducing cost by redesigning a business workflow around AI, rather than adding AI to an unchanged process.", caption: "" },
    takeaways: [
      "AI creates value when it removes or improves real work, not when it is added because a process looks automatable.",
      "Baseline cost, time, quality and risk before implementation or the ROI claim will be impossible to defend.",
      "Start with high-volume, repeatable workflows where humans currently spend time moving, rewriting or interpreting information.",
      "Redesign the process before cutting capacity. Automating a bad workflow simply makes the bad workflow faster.",
    ],
    faqs: [
      { question: "Can AI actually reduce business costs?", answer: "Yes, when it reduces real external spend, processing effort, cycle time or avoidable manual work. The saving should be measured against a pre-implementation baseline rather than a theoretical productivity estimate." },
      { question: "How do you calculate AI ROI?", answer: "Compare the total cost of implementation and operation with measurable changes in cost, time, quality and risk. Include integration, model usage, licences, human review and maintenance rather than counting only the headline software price." },
      { question: "What business processes are suitable for AI automation?", answer: "Good candidates are often high-volume, repeatable and information-heavy processes such as document handling, reporting, content operations, triage and knowledge retrieval. Suitability also depends on risk, data quality and the cost of errors." },
      { question: "Should AI replace employees?", answer: "Start with the work, not a headcount target. Identify which activities can be automated safely and what human judgement remains necessary. Redesign and measure the process before making structural workforce assumptions." },
      { question: "What is Operational AI?", answer: "Operational AI is the practical use of AI inside business workflows to improve how work gets done. The focus is on measurable operational outcomes such as cost, speed, quality and capacity rather than deploying AI as a standalone novelty." },
    ],
  },
  "blog-08": {
    id: "post-if-ai-becomes-the-interface",
    title: "If AI Becomes the Interface, Would You Still Build a Traditional App?",
    slug: "if-ai-becomes-the-interface",
    standfirst: "If users can state the outcome they want and AI can operate the system, what happens to the traditional app? A product question worth asking now.",
    metaTitle: "If AI Is the Interface, Would You Still Build That App?",
    categorySlug: "operational-ai",
    authorSlug: "asad",
    publishedAt: "2026-09-08T09:00:00.000Z",
    bodyFile: "scripts/insights/blog-08.body.md",
    cover: { file: `${DESK}/ai-becomes-interface-intent-based-software-banner.png`, filename: "ai-becomes-interface-intent-based-software-banner.png", contentType: "image/png", alt: "Traditional software interface compared with an AI system that acts on a user's stated intent." },
    inline: { file: `${DESK}/traditional-ui-vs-intent-based-software.png`, filename: "traditional-ui-vs-intent-based-software.png", contentType: "image/png", alt: "Comparison of traditional software navigation with an AI-native intent-based interaction model.", caption: "" },
    takeaways: [
      "If AI becomes the interface, some software may shift from navigation-first to intent-first interaction.",
      "The durable asset may increasingly be the data, permissions, logic and actions underneath the interface.",
      "This does not mean every product becomes a chatbot.",
      "Traditional interfaces still win where users need precision, comparison, exploration or direct control.",
    ],
    faqs: [
      { question: "What is AI-native software?", answer: "AI-native software is designed around capabilities that AI makes possible rather than adding AI to an existing workflow as an extra feature. In practice, that can affect interaction design, data architecture, automation, permissions and how users express intent." },
      { question: "What is an intent-based software interface?", answer: "An intent-based interface lets the user describe the outcome or task they want to achieve. The system determines which data, actions and presentation are needed to fulfil that intent within defined permissions and controls." },
      { question: "Will AI replace traditional software interfaces?", answer: "Not entirely. Traditional interfaces remain strong for precision, visual comparison, creative manipulation, high-risk actions and repeated expert workflows. Many products are more likely to combine conversational and graphical interfaces." },
      { question: "Does AI mean product design becomes less important?", answer: "No. Product design still has to make system state, actions, permissions, uncertainty and consequences understandable. As interfaces become more dynamic, designing for trust and control becomes more important." },
      { question: "Should every SaaS company add a chatbot?", answer: "No. A chat interface is useful only when conversation improves the task. Start with the user's job and the capabilities required to complete it, then choose the interface that makes that job easiest and safest." },
    ],
  },
};

const which = process.argv[2] || "blog-01";
const CONFIG = POSTS[which];
if (!CONFIG) throw new Error("unknown post key: " + which + " (have: " + Object.keys(POSTS).join(", ") + ")");

// ---- markdown -> Portable Text (h2/h3/blockquote/normal, bullet/number lists, **bold**, [links]) ----
const key = () => Math.random().toString(36).slice(2, 12);
function parseInline(text) {
  const children = [], markDefs = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\)/g;
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
    if (lines.every((l) => l.startsWith("- "))) {
      for (const l of lines) { const { children, markDefs } = parseInline(l.slice(2)); out.push({ _type: "block", _key: key(), style: "normal", listItem: "bullet", level: 1, markDefs, children }); }
      continue;
    }
    if (lines.every((l) => /^\d+\.\s/.test(l))) {
      for (const l of lines) { const { children, markDefs } = parseInline(l.replace(/^\d+\.\s/, "")); out.push({ _type: "block", _key: key(), style: "normal", listItem: "number", level: 1, markDefs, children }); }
      continue;
    }
    out.push(blk("normal", chunk));
  }
  return out;
}

const bodyMd = fs.readFileSync(CONFIG.bodyFile, "utf8");
const sf = CONFIG.standfirst.length;
console.log(`[${which}] standfirst ${sf} ${sf >= 120 && sf <= 200 ? "OK" : "OUT OF RANGE"} | title ${CONFIG.title.length}/70 | meta ${CONFIG.metaTitle.length}/60 | cover ${CONFIG.cover ? "yes" : "NONE (add before publish)"}`);

if (DRY) {
  const fig = CONFIG.inline ? { _type: "figure", _key: key(), asset: { _type: "reference", _ref: "image-DRYRUN" }, alt: CONFIG.inline.alt } : null;
  const pt = mdToPT(bodyMd, fig);
  console.log(`[DRY RUN] blocks: ${pt.length} | figures: ${pt.filter((b) => b._type === "figure").length}`);
  console.log("styles:", pt.map((b) => b.listItem ? `li:${b.listItem}` : (b._type === "figure" ? "figure" : b.style)).join(", "));
  process.exit(0);
}

const client = createClient({ projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production", apiVersion: "2024-10-01", token: env.SANITY_API_WRITE_TOKEN, useCdn: false });
const category = await client.fetch('*[_type=="category" && slug.current==$s][0]._id', { s: CONFIG.categorySlug });
const author = await client.fetch('*[_type=="author" && slug.current==$s][0]._id', { s: CONFIG.authorSlug });
if (!category) throw new Error("category not found: " + CONFIG.categorySlug);
if (!author) throw new Error("author not found: " + CONFIG.authorSlug);

let figureBlock = null;
if (CONFIG.inline) {
  const a = await client.assets.upload("image", fs.readFileSync(CONFIG.inline.file), { filename: CONFIG.inline.filename, contentType: CONFIG.inline.contentType || "image/webp" });
  figureBlock = { _type: "figure", _key: key(), asset: { _type: "reference", _ref: a._id }, alt: CONFIG.inline.alt, ...(CONFIG.inline.caption ? { caption: CONFIG.inline.caption } : {}) };
}
const body = mdToPT(bodyMd, figureBlock);

const doc = {
  _id: "drafts." + CONFIG.id,
  _type: "post",
  title: CONFIG.title,
  slug: { _type: "slug", current: CONFIG.slug },
  standfirst: CONFIG.standfirst,
  category: { _type: "reference", _ref: category },
  author: { _type: "reference", _ref: author },
  publishedAt: CONFIG.publishedAt,
  body,
  takeaways: CONFIG.takeaways,
  faqs: CONFIG.faqs.map((f) => ({ _type: "faq", _key: key(), ...f })),
  featured: false,
  seo: { _type: "seo", title: CONFIG.metaTitle },
};
if (CONFIG.cover) {
  const c = await client.assets.upload("image", fs.readFileSync(CONFIG.cover.file), { filename: CONFIG.cover.filename, contentType: CONFIG.cover.contentType || "image/webp" });
  doc.coverImage = { _type: "image", asset: { _type: "reference", _ref: c._id }, alt: CONFIG.cover.alt };
}

const res = await client.createOrReplace(doc);
console.log(`DRAFT created: ${res._id}${CONFIG.cover ? "" : "  (NO cover image — add one in Studio before publishing)"}`);
