import type { Metadata } from "next";

import { LegalPage, LegalContact } from "@/components/legal/LegalPage";

import "../../../styles/legal.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.commview.co.uk";

export const metadata: Metadata = {
  title: { absolute: "Cookie Policy | Commview" },
  description:
    "How Commview uses cookies and similar technologies, including website analytics, and how you can control your preferences.",
  alternates: { canonical: "/cookies" },
};

// Generated from the live implementation (see the cookie audit). Only cookies /
// storage the site actually sets are listed. The Google Analytics cookies are
// set solely by GA4 *after* Analytics consent is granted; their names and
// durations are Google's documented defaults, not invented values.
const COOKIES = [
  {
    name: "commview_consent",
    provider: "Commview (first party)",
    category: "Necessary",
    purpose: "Remembers your cookie preferences so we do not ask again on every visit.",
    duration: "6 months",
  },
  {
    name: "_ga",
    provider: "Google Analytics",
    category: "Analytics",
    purpose: "Distinguishes unique visitors. Set only if you allow Analytics cookies.",
    duration: "2 years",
  },
  {
    name: "_ga_*",
    provider: "Google Analytics",
    category: "Analytics",
    purpose:
      "Retains session state for Google Analytics 4. Set only if you allow Analytics cookies.",
    duration: "2 years",
  },
];

export default function CookiesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Cookie Policy", item: `${SITE}/cookies` },
    ],
  };

  return (
    <LegalPage eyebrow="Legal" title="Cookie Policy" updated="28 September 2026">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p>
        This policy explains how Commview Limited uses cookies and similar
        technologies on commview.co.uk and how you can control your preferences.
      </p>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small pieces of information stored on your device when you visit a
        website.
      </p>
      <p>
        They can be used for things such as keeping a website secure, remembering
        preferences and understanding how visitors use a website.
      </p>
      <p>
        Similar technologies, including local storage and tracking identifiers, can
        perform related functions.
      </p>

      <h2>How we use cookies</h2>
      <p>Commview may use cookies and similar technologies to:</p>
      <ul>
        <li>operate and secure the website</li>
        <li>remember your cookie preferences</li>
        <li>understand how visitors find and use the website</li>
        <li>measure website and content performance</li>
        <li>support enquiry and customer relationship functionality</li>
      </ul>
      <p>
        We divide these technologies into necessary, analytics and marketing
        categories.
      </p>

      <h2>Necessary cookies</h2>
      <p>
        Necessary cookies and similar technologies are required for core website
        functions, security and remembering your privacy preferences.
      </p>
      <p>
        These cannot be disabled through our cookie preference manager where they are
        genuinely necessary for the requested website functionality.
      </p>

      <h2>Analytics cookies</h2>
      <p>
        We use Google Analytics 4 to understand how visitors use the Commview website.
      </p>
      <p>
        This helps us understand things such as which pages are visited, how visitors
        reached the website and how people interact with its content.
      </p>
      <p>
        Google Tag Manager is used to manage tags and measurement technologies on the
        website.
      </p>
      <p>
        Analytics cookies are optional and are disabled unless you choose to allow
        them.
      </p>

      <h2>HubSpot and marketing cookies</h2>
      <p>
        We use HubSpot to help manage website enquiries, communications and customer
        relationships.
      </p>
      <p>
        Submitting an enquiry does not require you to consent to optional marketing
        cookies.
      </p>
      <p>
        Where HubSpot or another technology is used to track website behaviour for
        marketing purposes, that tracking is treated as optional and is disabled
        unless you choose to allow Marketing cookies.
      </p>

      <h2>Google Search Console</h2>
      <p>
        We use Google Search Console to understand how Commview appears and performs
        in Google Search.
      </p>
      <p>
        Search Console does not operate as a visitor analytics cookie in the same way
        as Google Analytics.
      </p>

      <h2>Cookie list</h2>
      <p>
        The table below lists the cookies and similar storage the website uses. The
        Google Analytics cookies are only set once you allow Analytics cookies.
      </p>
      <div className="lgl-table-scroll">
        <table className="lgl-table">
          <thead>
            <tr>
              <th>Cookie / storage</th>
              <th>Provider</th>
              <th>Category</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {COOKIES.map((c) => (
              <tr key={c.name}>
                <td>
                  <code>{c.name}</code>
                </td>
                <td>{c.provider}</td>
                <td>{c.category}</td>
                <td>{c.purpose}</td>
                <td>{c.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Your cookie choices</h2>
      <p>When you first visit Commview, you can:</p>
      <ul>
        <li>accept all optional cookies</li>
        <li>reject optional cookies</li>
        <li>choose individual categories</li>
      </ul>
      <p>
        Necessary cookies remain enabled where required for the site to function.
      </p>
      <p>
        You can change your choices at any time using &ldquo;Cookie settings&rdquo; in
        the website footer.
      </p>
      <p>You can also delete or block cookies using your browser settings.</p>

      <h2>Third-party services</h2>
      <p>Some website functionality is provided using third-party technology.</p>
      <p>
        Relevant providers may include Google, Vercel and HubSpot, as described in our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>
      <p>
        Where third-party technology uses optional cookies or accesses information on
        your device through the Commview website, it is controlled by the appropriate
        cookie preference where required.
      </p>

      <h2>Changes to this policy</h2>
      <p>The technologies used by the website may change over time.</p>
      <p>
        We will update this policy when necessary to reflect material changes to the
        cookies and similar technologies we use.
      </p>

      <h2>More information</h2>
      <p>
        For more information about how Commview handles personal information, read our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>
      <p>For questions about cookies:</p>
      <LegalContact />
    </LegalPage>
  );
}
