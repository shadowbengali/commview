"use client";

import { FormEvent, useMemo, useState } from "react";

const PROBLEMS = [
  ["Growth has slowed", "We’re doing more, but it isn’t turning into revenue.", "growth"],
  ["Something isn’t converting", "Traffic, leads, pipeline or customers aren’t moving.", "conversion"],
  ["We’re not sure what to build next", "There are plenty of ideas. The difficult bit is knowing which ones matter.", "product"],
  ["We’re wasting too much time", "There’s repetitive work, broken processes or things that should probably be automated.", "ai"],
  ["It’s something else", "Start with the question. We’ll work from there.", "other"],
] as const;

function MaskedEmail() {
  const address = useMemo(() => [105,110,102,111,64,99,111,109,109,118,105,101,119,46,99,111,46,117,107].map(String.fromCharCode).join(""), []);
  return <a href={"mailto:" + address} onClick={(e) => { e.currentTarget.href = "mailto:" + address; }}>{address}</a>;
}

export function ContactExperience() {
  const [problem, setProblem] = useState("growth");
  const [state, setState] = useState<"idle"|"sending"|"sent"|"error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setState(res.ok ? "sent" : "error");
    if (res.ok) form.reset();
  }

  return (
    <>
      <section className="contact-problems">
        <div className="wrap">
          <p className="contact-kicker">Start here</p>
          <h2>What&rsquo;s brought you here?</h2>
          <div className="contact-problems__grid">
            {PROBLEMS.map(([title, body, value]) => (
              <button type="button" key={value} className={problem === value ? "is-active" : ""} data-problem={value} onClick={() => setProblem(value)}>
                <span>{title}</span><small>{body}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-form dark">
        <div className="wrap contact-form__grid">
          <div className="contact-form__intro">
            <p className="contact-kicker">Bring us the problem</p>
            <h2>Tell us what&rsquo;s going on.</h2>
            <p>Don&rsquo;t write a consultancy brief. Write it like you&rsquo;d explain it to someone sitting next to you.</p>
            <div className="contact-direct">
              <span>Prefer email?</span>
              <MaskedEmail />
              <small>The address is assembled in your browser rather than printed into the page HTML to reduce basic harvesting.</small>
            </div>
          </div>
          <form onSubmit={submit} className="contact-form__fields">
            <input type="hidden" name="problem" value={problem} />
            <label>What&rsquo;s happening?<textarea name="situation" required rows={5} placeholder="Growth has flattened over the last six months and we’re spending more on marketing than we were before…" /></label>
            <label>What would you like to be different?<textarea name="outcome" required rows={4} placeholder="We need to understand what’s actually causing it and what we should fix first…" /></label>
            <div className="contact-form__row">
              <label>Your name<input name="name" autoComplete="name" required /></label>
              <label>Work email<input name="email" type="email" autoComplete="email" required /></label>
            </div>
            <label>Company<input name="company" autoComplete="organization" /></label>
            <div className="contact-hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <button className="contact-submit" disabled={state === "sending" || state === "sent"}>{state === "sending" ? "Sending…" : state === "sent" ? "Sent. We’ve got it." : "Send it to Commview"}</button>
            {state === "error" && <p role="alert" className="contact-error">Something went wrong. Please try again or use the email address opposite.</p>}
          </form>
        </div>
      </section>
    </>
  );
}
