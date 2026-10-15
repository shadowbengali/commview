import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

import { renderMarkdown } from "@/lib/markdown";
import { CopyButton } from "@/components/resources/CopyButton";
import { FileRow } from "@/components/resources/FileRow";

import "../../../../styles/resources.css";

// /resources/claude-for-marketers — "Beyond the chat box" course resources.
// Content is authored in commview-course-resources-page-content.md; this ports
// it 1:1. Deliberately short (five sections). Indexed, in the sitemap, kept out
// of the main nav. The Brightfield practice files live in /public and are read
// here at build time so the inline previews always match the downloads.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.commview.co.uk";
const PATH = "/resources/claude-for-marketers";
const FILES = `${PATH}`; // public asset base (files sit beside the route name)

// Set to a real YouTube id to turn on the walkthrough section. Empty or the
// REPLACE_ME sentinel keeps section 2 (and the hero "Watch" link) off entirely.
const YOUTUBE_ID: string = "PxuBUdbdBjc";
const HAS_VIDEO = !!YOUTUBE_ID && YOUTUBE_ID !== "REPLACE_ME";

const DESC =
  "Free Claude course for marketers. Get the slides, copy-ready prompts and practice files to build a monthly report and a live dashboard.";

export const metadata: Metadata = {
  title: { absolute: "Claude for Marketers: Free Course, Prompts & Templates | CommView" },
  description: DESC,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: "Claude for Marketers: Free Course and Templates",
    description:
      "The slides, prompts and practice files from our free Claude session. Build a monthly report and a dashboard in minutes.",
    images: [{ url: `${FILES}/og-beyond-the-chat-box.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude for Marketers: Free Course and Templates",
    description:
      "The slides, prompts and practice files from our free Claude session. Build a monthly report and a dashboard in minutes.",
    images: [`${FILES}/og-beyond-the-chat-box.png`],
  },
};

// The exact prompts from the session (verbatim, feed the copy buttons).
const PROMPT_PROJECT =
  "You're a marketing analyst for Brightfield Software, a UK payroll software company. Every report you write follows the monthly report template and uses the KPI definitions and targets in the project files. Write in the Brightfield brand voice: British English, specific, no emoji, no hype words. Always compare results with the targets. Flag any channel more than 20% off target. If the data doesn't support a conclusion, say so rather than guessing.";
const PROMPT_REPORT = "Write the monthly marketing report for September 2026.";
const PROMPT_DASHBOARD =
  "Turn this into an interactive dashboard for our marketing team: monthly spend, leads and cost per lead by channel.";

function previewOf(file: string): string {
  const full = path.join(process.cwd(), "public", "resources", "claude-for-marketers", file);
  // Demote headings by 3 so a file's "# Title" renders as <h4> under the <h3>
  // step — one <h1> on the page, no heading-level jumps.
  return renderMarkdown(fs.readFileSync(full, "utf8"), { headingOffset: 3 });
}

export default function CourseResourcesPage() {
  const brandVoice = previewOf("brightfield-brand-voice.md");
  const kpi = previewOf("brightfield-kpi-definitions.md");
  const template = previewOf("brightfield-monthly-report-template.md");

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Course",
      name: "Beyond the chat box: Claude for Marketers",
      description: DESC,
      url: `${SITE}${PATH}`,
      inLanguage: "en-GB",
      isAccessibleForFree: true,
      provider: { "@type": "Organization", name: "CommView", url: `${SITE}/` },
      offers: { "@type": "Offer", category: "Free", price: "0", priceCurrency: "GBP" },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT15M",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Claude for Marketers", item: `${SITE}${PATH}` },
      ],
    },
  ];
  if (HAS_VIDEO) {
    graph.push({
      "@type": "VideoObject",
      name: "Beyond the chat box: the walkthrough",
      description: DESC,
      thumbnailUrl: `https://i.ytimg.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${YOUTUBE_ID}`,
      uploadDate: "2026-10-15",
    });
  }
  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  return (
    <main id="main" className="rc">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ===== 1. HERO (dark) ===== */}
      <section className="rc-hero dark" aria-labelledby="rc-h1">
        <div className="wrap">
          <p className="eyebrow-x">Free Claude course for marketers</p>
          <h1 className="rc-hero__h1" id="rc-h1">
            Beyond the <span className="rc-grad">chat box</span>
          </h1>
          <p className="rc-hero__sub">
            You already use AI every day. This is how to get it doing the work, not just answering
            questions. Here are the slides, the files and the exact prompts from the session, so you
            can run it yourself.
          </p>
          <nav className="rc-hero__links" aria-label="On this page">
            {HAS_VIDEO && <a href="#watch">Watch</a>}
            <a href="#slides">Slides</a>
            <a href="#try-it">Try it yourself</a>
          </nav>
        </div>
      </section>

      {/* ===== 2. WATCH (light, optional) ===== */}
      {HAS_VIDEO && (
        <section className="rc-watch" id="watch" aria-labelledby="rc-watch-h">
          <div className="wrap">
            <h2 className="rc-h2" id="rc-watch-h">Watch the walkthrough</h2>
            <div className="rc-video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}`}
                title="Beyond the chat box walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </section>
      )}

      {/* ===== 3. SLIDES (light) ===== */}
      <section className="rc-slides" id="slides" aria-labelledby="rc-slides-h">
        <div className="wrap">
          <h2 className="rc-h2" id="rc-slides-h">The slides</h2>

          <div className="slides__viewer">
            <object
              className="slides__object"
              data={`${FILES}/beyond-the-chat-box.pdf#view=FitH`}
              type="application/pdf"
              aria-label="Beyond the chat box slides (PDF)"
            >
              <div className="slides__oops">
                Your browser can&rsquo;t show the slides inline.
              </div>
            </object>
          </div>

          {/* Mobile fallback: inline PDF rendering is unreliable on phones. */}
          <div className="slides__card" aria-hidden="true">
            <span className="slides__card-chip">PDF</span>
            <span className="slides__card-name">Beyond the chat box</span>
            <span className="slides__card-sub">The full slide deck from the session.</span>
          </div>

          <div className="rc-actions">
            <a className="btn btn--cyan btn--lg" href={`${FILES}/beyond-the-chat-box.pdf`} download>
              Download the slides (PDF)
            </a>
          </div>
        </div>
      </section>

      {/* ===== 4. TRY IT YOURSELF (light) ===== */}
      <section className="rc-try" id="try-it" aria-labelledby="rc-try-h">
        <div className="wrap">
          <h2 className="rc-h2" id="rc-try-h">Try it yourself</h2>
          <p className="rc-try__intro">
            Rebuild the two demos from the session in about 15 minutes. Brightfield is a fictional
            payroll software company we made up, so the files are safe to upload to any AI tool.
          </p>

          {/* Step 1 — files */}
          <div className="rc-step">
            <h3 className="rc-step__h"><span className="rc-step__n">Step 1.</span> Download the files</h3>
            <ul className="file-list">
              <FileRow
                chip="MD"
                name="Brand voice guide"
                desc="How Brightfield writes."
                href={`${FILES}/brightfield-brand-voice.md`}
                previewHtml={brandVoice}
              />
              <FileRow
                chip="MD"
                name="KPI definitions and targets"
                desc="What each number means and what good looks like."
                href={`${FILES}/brightfield-kpi-definitions.md`}
                previewHtml={kpi}
              />
              <FileRow
                chip="MD"
                name="Monthly report template"
                desc="The structure every report follows."
                href={`${FILES}/brightfield-monthly-report-template.md`}
                previewHtml={template}
              />
              <FileRow
                chip="XLSX"
                name="Marketing campaign data"
                desc="A year of made-up campaign data."
                href={`${FILES}/brightfield-marketing-data.xlsx`}
              />
            </ul>
            <p className="rc-zip">
              <a href={`${FILES}/brightfield-practice-files.zip`} download>Download all files (.zip)</a>
            </p>
          </div>

          {/* Step 2 — reporting Project */}
          <div className="rc-step">
            <h3 className="rc-step__h"><span className="rc-step__n">Step 2.</span> Build a reporting Project</h3>
            <p className="rc-body">
              Create a Project in Claude, add the three guides as files, and paste this into the
              Project instructions.
            </p>
            <figure className="prompt">
              <blockquote className="prompt__text">{PROMPT_PROJECT}</blockquote>
              <CopyButton text={PROMPT_PROJECT} />
            </figure>
            <p className="rc-body">
              Then start a chat in the Project, upload the campaign data and ask:
            </p>
            <figure className="prompt">
              <blockquote className="prompt__text">{PROMPT_REPORT}</blockquote>
              <CopyButton text={PROMPT_REPORT} />
            </figure>
            <p className="rc-note">
              Next month, upload new data and ask again. Same structure, every time. That&rsquo;s the
              point of a Project.
            </p>
          </div>

          {/* Step 3 — dashboard */}
          <div className="rc-step">
            <h3 className="rc-step__h"><span className="rc-step__n">Step 3.</span> Turn the data into a dashboard</h3>
            <p className="rc-body">In a new chat, upload the same spreadsheet and ask:</p>
            <figure className="prompt">
              <blockquote className="prompt__text">{PROMPT_DASHBOARD}</blockquote>
              <CopyButton text={PROMPT_DASHBOARD} />
            </figure>
            <p className="rc-note">
              Then keep asking. Add date and channel filters. Ask what you spent on LinkedIn. Works on
              the free plan.
            </p>
          </div>

          {/* Safety callout */}
          <div className="rc-callout">
            <h3 className="rc-callout__h">Before you use your own data</h3>
            <ul className="rc-callout__list">
              <li><strong>Strip it.</strong> Remove names, emails and anything under NDA before you upload.</li>
              <li><strong>Turn off training.</strong> In your settings, choose not to let your chats train the model.</li>
              <li><strong>Check the answer.</strong> Spot-check one number yourself. If it&rsquo;s right, trust the rest more. If it&rsquo;s wrong, start again.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== 5. CLOSING CTA (dark) ===== */}
      <section className="rc-cta dark" aria-labelledby="rc-cta-h">
        <div className="wrap">
          <h2 className="rc-cta__h" id="rc-cta-h">Want this working inside your team?</h2>
          <p className="rc-cta__p">
            We run hands-on Claude workshops for marketing teams, built around your own data and the
            reports you already produce.
          </p>
          <div className="rc-actions">
            <a className="btn btn--cyan btn--lg" href="/contact">Talk to us</a>
          </div>
        </div>
      </section>
    </main>
  );
}
