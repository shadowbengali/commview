import type { Metadata } from "next";

import { LegalPage, LegalContact } from "@/components/legal/LegalPage";

import "../../../styles/legal.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview.co.uk";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy | Commview" },
  description:
    "How Commview Limited collects, uses, stores and protects personal information when you use our website or contact us.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${SITE}/privacy` },
    ],
  };

  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="28 September 2026">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p>
        Commview Limited respects your privacy. This policy explains what personal
        information we collect, why we use it, who we may share it with and the
        rights you have over your information.
      </p>

      <h2>Who we are</h2>
      <p>
        Commview Limited is a company registered in England and Wales under company
        number 17456529.
      </p>
      <p>
        For questions about this privacy policy or how we use your personal
        information, contact us at{" "}
        <a href="mailto:info@commview.co.uk">info@commview.co.uk</a>.
      </p>

      <h2>Information we collect</h2>
      <p>The information we collect depends on how you interact with Commview.</p>
      <p>
        If you contact us or submit an enquiry, we may collect information including
        your name, email address, telephone number where provided, company and job
        information where provided, and the contents of your enquiry and subsequent
        correspondence.
      </p>
      <p>
        When you use our website, we may also collect technical and usage
        information such as your device and browser type, pages visited, approximate
        location derived from your IP address, referring website and interactions
        with the site.
      </p>
      <p>
        We use cookies and similar technologies for some of this activity. You can
        find more information in our <a href="/cookies">Cookie Policy</a>.
      </p>

      <h2>How we use your information</h2>
      <p>We may use your personal information to:</p>
      <ul>
        <li>respond to enquiries and communicate with you</li>
        <li>understand your requirements and discuss our services</li>
        <li>provide services where you become a client</li>
        <li>manage our relationship with prospects and clients</li>
        <li>operate, secure and improve our website</li>
        <li>understand how people find and use our website</li>
        <li>measure the effectiveness of our content and marketing</li>
        <li>maintain appropriate business records</li>
        <li>meet our legal and regulatory obligations</li>
      </ul>
      <p>We will not sell your personal information.</p>

      <h2>Our lawful bases</h2>
      <p>
        UK data protection law requires us to have a lawful basis for processing
        personal information.
      </p>
      <p>
        Depending on the circumstances, we may rely on legitimate interests,
        contract, consent or legal obligation.
      </p>
      <p>
        Legitimate interests may apply where processing is reasonably necessary to
        operate and improve our business, respond to business enquiries, maintain
        relationships and protect our systems, provided those interests are not
        overridden by your rights and interests.
      </p>
      <p>
        Contract may apply where processing is necessary to take steps at your
        request before entering into a contract or to fulfil an agreement with you.
      </p>
      <p>
        Consent may apply where we have specifically asked for your permission,
        including where consent is required for optional cookies or particular forms
        of electronic marketing. You can withdraw consent at any time.
      </p>
      <p>
        Legal obligation may apply where we need to process or retain information to
        comply with the law.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        We use Google Analytics 4 to understand how visitors use the Commview
        website and Google Tag Manager to manage website tags.
      </p>
      <p>
        Optional analytics and marketing technologies are controlled by your cookie
        preferences where consent is required.
      </p>
      <p>
        Google Search Console provides information about how the website performs in
        Google Search.
      </p>
      <p>
        See our <a href="/cookies">Cookie Policy</a> for more information and to
        manage your preferences.
      </p>

      <h2>Who we work with</h2>
      <p>
        We use trusted technology providers to operate our website and business.
      </p>
      <p>Depending on how you interact with us, these may include:</p>
      <ul>
        <li>Vercel for website hosting and infrastructure</li>
        <li>Sanity for website content management</li>
        <li>
          Google for website analytics, tag management, search performance and
          business email services
        </li>
        <li>
          HubSpot for managing enquiries, communications and customer relationship
          management
        </li>
        <li>Supabase for application and data infrastructure where applicable</li>
        <li>
          OpenAI for AI functionality used within the Commview Business Diagnostic
          where applicable
        </li>
      </ul>
      <p>
        These providers may process personal information on our behalf when
        necessary to provide their services.
      </p>
      <p>
        We may also disclose information where required by law, to establish or
        defend legal rights, or in connection with a restructuring, sale or transfer
        of the business.
      </p>

      <h2>International processing</h2>
      <p>
        Some of the technology providers we use operate internationally. This means
        personal information may sometimes be processed outside the UK.
      </p>
      <p>
        Where UK data protection law requires safeguards for an international
        transfer, appropriate safeguards will be used.
      </p>

      <h2>The Commview Business Diagnostic</h2>
      {/* DEVELOPER NOTE — do not render publicly. Before /diagnostic is released,
          review this section against the final implementation: audio retention,
          transcript retention, structured answers, report storage, HubSpot
          transfer, OpenAI processing and retention periods. */}
      <p>
        The Commview Business Diagnostic uses conversational AI to help understand
        business challenges and generate relevant findings.
      </p>
      <p>
        Depending on how you use the Diagnostic, information you provide may include
        details about your business, its customers, commercial performance,
        products, operations and the problems you are trying to solve.
      </p>
      <p>
        The Diagnostic may use OpenAI technology to process conversational input and
        generate responses. Relevant information and Diagnostic results may also be
        stored using Commview&apos;s application infrastructure, including Supabase.
      </p>
      <p>We design the Diagnostic to minimise unnecessary personal information.</p>
      <p>
        You should not provide sensitive personal information, passwords, financial
        account details or confidential personal information about other people
        through the Diagnostic.
      </p>

      <h2>How long we keep your information</h2>
      <p>
        We keep personal information only for as long as reasonably necessary for
        the purpose for which it was collected, including where we need it to
        maintain appropriate business records or meet legal, accounting or
        regulatory requirements.
      </p>
      <p>Different types of information may therefore be kept for different periods.</p>
      <p>
        Where information is no longer required, we will delete it or take
        appropriate steps to remove identifying information.
      </p>

      <h2>Security</h2>
      <p>
        We use reasonable technical and organisational measures designed to protect
        personal information against unauthorised access, alteration, disclosure or
        loss.
      </p>
      <p>No online system can be guaranteed to be completely secure.</p>

      <h2>Your rights</h2>
      <p>
        Depending on the circumstances, UK data protection law may give you rights
        to:
      </p>
      <ul>
        <li>request access to personal information we hold about you</li>
        <li>ask us to correct inaccurate or incomplete information</li>
        <li>ask us to delete your information</li>
        <li>ask us to restrict how your information is used</li>
        <li>object to certain processing</li>
        <li>request the transfer of certain information</li>
        <li>withdraw consent where processing is based on consent</li>
      </ul>
      <p>These rights do not apply in every circumstance.</p>
      <p>
        To exercise a right or ask a question about your information, email{" "}
        <a href="mailto:info@commview.co.uk">info@commview.co.uk</a>.
      </p>
      <p>
        You also have the right to raise a concern with the{" "}
        <a href="https://ico.org.uk/" target="_blank" rel="noopener noreferrer">
          Information Commissioner&apos;s Office
        </a>
        , the UK&apos;s data protection regulator.
      </p>

      <h2>Third-party websites</h2>
      <p>
        Our website may contain links to websites operated by other organisations.
      </p>
      <p>
        We are not responsible for their privacy practices, and you should review
        their privacy information separately.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this privacy policy as our website, services or legal
        obligations change.
      </p>
      <p>The latest version will always be published on this page.</p>

      <h2>Contact</h2>
      <LegalContact />
    </LegalPage>
  );
}
