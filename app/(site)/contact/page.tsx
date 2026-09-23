import type { Metadata } from "next";
import "../../../styles/contact.css";
import { ContactExperience } from "@/components/contact/ContactExperience";

export const metadata: Metadata = {
  title: { absolute: "Contact Commview | Bring Us the Problem" },
  description: "Tell Commview what is not working. Start with the business problem, not a predetermined service.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main id="main" className="contact-page">
      <section className="contact-hero dark">
        <div className="wrap contact-hero__grid">
          <div>
            <p className="contact-kicker">Talk to us</p>
            <h1>What&rsquo;s<br/><span>not working?</span></h1>
          </div>
          <div className="contact-hero__copy">
            <p>You don&rsquo;t need a brief. You don&rsquo;t need to know which service you need. You don&rsquo;t even need to know exactly what the problem is.</p>
            <strong>Tell us what&rsquo;s happening.</strong>
          </div>
        </div>
        <div className="wrap contact-signal" aria-hidden="true">
          <span>YOUR QUESTION</span><i/><span>UNDERSTAND</span><i/><span>DIAGNOSE</span><i/><span>WHAT NEXT</span>
        </div>
      </section>

      <ContactExperience />

      <section className="contact-next">
        <div className="wrap">
          <p className="contact-kicker">What happens next</p>
          <h2>No black box.<br/>No sales theatre.</h2>
          <div className="contact-next__steps">
            <article><b>01</b><h3>We read it.</h3><p>Not an automated qualification engine deciding whether you&rsquo;re worth talking to.</p></article>
            <article><b>02</b><h3>We&rsquo;ll tell you what we think.</h3><p>If we think we can help, we&rsquo;ll arrange a conversation. If we don&rsquo;t, we&rsquo;ll tell you that too.</p></article>
            <article><b>03</b><h3>Then we decide what happens next.</h3><p>Sometimes that&rsquo;s a diagnostic. Sometimes there&rsquo;s an obvious piece of work. Sometimes you just need pointing in the right direction.</p></article>
          </div>
          <p className="contact-promise">No sales sequence. No five-email nurture campaign because you filled in a form.</p>
        </div>
      </section>
    </main>
  );
}
