import type { Metadata } from "next";

import { LegalPage, LegalContact } from "@/components/legal/LegalPage";

import "../../../styles/legal.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview.co.uk";

export const metadata: Metadata = {
  title: { absolute: "Website Terms of Use | Commview" },
  description:
    "Terms governing your use of the Commview website, its content and information about our consulting services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Website Terms of Use", item: `${SITE}/terms` },
    ],
  };

  return (
    <LegalPage eyebrow="Legal" title="Website Terms of Use" updated="28 September 2026">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p>
        These terms apply when you use the Commview website. By using the website,
        you agree to use it lawfully and in accordance with these terms.
      </p>

      <h2>About Commview</h2>
      <p>
        This website is operated by Commview Limited, a company registered in England
        and Wales under company number 17456529.
      </p>
      <p>
        You can contact us at{" "}
        <a href="mailto:info@commview.co.uk">info@commview.co.uk</a>.
      </p>

      <h2>Using this website</h2>
      <p>
        You may use this website for lawful purposes and to learn about Commview, our
        services, thinking and experience.
      </p>
      <p>You must not knowingly:</p>
      <ul>
        <li>use the website unlawfully or fraudulently</li>
        <li>
          attempt to gain unauthorised access to the website or systems connected to
          it
        </li>
        <li>introduce malicious software or other harmful material</li>
        <li>deliberately interfere with the operation or security of the website</li>
        <li>
          use automated systems to access the website in a way that causes
          unreasonable disruption or load
        </li>
      </ul>

      <h2>Information on this website</h2>
      <p>
        We aim to keep the information on this website useful and accurate, but
        business, technology and markets change.
      </p>
      <p>
        Content on the website, including our Insights, is provided for general
        information and should not be treated as advice specific to your
        circumstances.
      </p>
      <p>
        Nothing on this website constitutes legal, financial, accounting, tax,
        investment or other regulated professional advice.
      </p>
      <p>
        You remain responsible for decisions you make based on your own circumstances
        and should obtain specialist professional advice where appropriate.
      </p>

      <h2>Our consulting services</h2>
      <p>
        Descriptions of Commview&apos;s services on this website are provided for
        general information and do not constitute an offer or create a client
        relationship.
      </p>
      <p>
        If we agree to work together, the scope, deliverables, responsibilities, fees
        and other terms of the engagement will be set out separately in a proposal,
        statement of work, contract or other agreement.
      </p>
      <p>
        If there is a conflict between these website terms and the terms of a
        specific client engagement, the terms governing that engagement will apply to
        the engagement.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Unless otherwise stated, the content created by Commview on this website,
        including its copy, graphics, branding, layouts, original frameworks and
        other materials, belongs to Commview Limited or is used under appropriate
        licence.
      </p>
      <p>
        You may view and use the website for your own legitimate business or personal
        purposes.
      </p>
      <p>
        You must not reproduce, republish, commercially exploit or present
        substantial parts of our original content as your own without permission,
        except where the law permits it.
      </p>
      <p>
        Names, logos, trademarks and other materials belonging to third parties
        remain the property of their respective owners.
      </p>
      <p>
        References to organisations where members of the Commview network have
        previously worked describe professional experience and do not imply
        endorsement, partnership or a current client relationship unless explicitly
        stated.
      </p>

      <h2>Links to other websites</h2>
      <p>We may link to websites, research and resources operated by third parties.</p>
      <p>
        Those links are provided for information or convenience. We do not control
        third-party websites and are not responsible for their content, availability
        or privacy practices.
      </p>
      <p>
        A link does not necessarily mean that Commview endorses the organisation,
        product, service or views expressed on that website.
      </p>

      <h2>Availability of the website</h2>
      <p>
        We aim to keep the website available and functioning properly, but we cannot
        guarantee uninterrupted or error-free access.
      </p>
      <p>
        We may change, update, suspend or withdraw any part of the website where
        reasonably necessary.
      </p>

      <h2>Liability</h2>
      <p>
        Nothing in these terms excludes or limits liability where it would be
        unlawful to do so.
      </p>
      <p>
        To the extent permitted by law, Commview Limited is not responsible for
        losses arising solely from reliance on general information published on this
        website where that information was not provided as part of a separately
        agreed professional engagement.
      </p>
      <p>
        We are not responsible for failures or interruptions caused by circumstances
        or third-party systems outside our reasonable control.
      </p>

      <h2>Privacy and cookies</h2>
      <p>
        Our use of personal information is explained in our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>
      <p>
        Information about cookies and similar technologies is available in our{" "}
        <a href="/cookies">Cookie Policy</a>.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time to reflect changes to the
        website, our business or applicable law.
      </p>
      <p>The current version will be published on this page.</p>

      <h2>Governing law</h2>
      <p>
        These website terms are governed by the laws of England and Wales.
      </p>
      <p>
        Any dispute relating to these terms will be subject to the jurisdiction of
        the courts of England and Wales, except where applicable law gives you the
        right to bring proceedings elsewhere.
      </p>

      <h2>Contact</h2>
      <LegalContact />
    </LegalPage>
  );
}
