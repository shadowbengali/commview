"use client";

import { useEffect, useRef, useState } from "react";

import { ContactEmail } from "./ContactEmail";

// Right-hand form for /contact. Posts JSON to /api/contact and reflects the
// real result: "success" only appears when the server confirms the mail was
// accepted. Labels are real labels; focus styles come from the stylesheet.

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const firstField = useRef<HTMLTextAreaElement>(null);

  // The hero CTA links to #contact-form; move focus to the first field on arrival.
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#contact-form") {
      firstField.current?.focus();
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="cf" role="status" aria-live="polite">
        <div className="cf__done">
          <h3>Message sent.</h3>
          <p>Thanks for the detail. A real person will read it and come back to you. If you need to add anything, just reply to the confirmation or email us at <ContactEmail className="cf__inline" />.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="cf" onSubmit={onSubmit} noValidate>
      {/* honeypot — hidden from people, tempting to bots */}
      <div className="cf__hp" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="cf__field">
        <label htmlFor="situation">What&rsquo;s happening?</label>
        <textarea id="situation" name="situation" rows={4} required ref={firstField} />
      </div>

      <div className="cf__field">
        <label htmlFor="outcome">What would you like to be different?</label>
        <textarea id="outcome" name="outcome" rows={3} required />
      </div>

      <div className="cf__row">
        <div className="cf__field">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="cf__field">
          <label htmlFor="email">Work email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>

      <div className="cf__field">
        <label htmlFor="company">Company <span className="cf__opt">(optional)</span></label>
        <input id="company" name="company" type="text" autoComplete="organization" />
      </div>

      <div className="cf__actions">
        <button className="btn btn--cyan btn--lg" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send to Commview"}
        </button>
        <p className="cf__status" role="status" aria-live="polite">
          {status === "error" ? (
            <span className="cf__err">
              Something went wrong sending that. Please email us directly at <ContactEmail className="cf__inline" />.
            </span>
          ) : (
            <span className="cf__hint">A real person reads every message.</span>
          )}
        </p>
      </div>
    </form>
  );
}
