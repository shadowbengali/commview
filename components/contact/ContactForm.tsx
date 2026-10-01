"use client";

import { useEffect, useRef, useState } from "react";

import { ContactEmail } from "./ContactEmail";

// Right-hand form for /contact. Validates client-side with specific, per-field
// messages (e.g. a real "enter a valid email"), then posts JSON to /api/contact.
// "success" only appears when the server confirms the enquiry was accepted.

type Status = "idle" | "sending" | "success" | "error";
type Errors = Partial<Record<"situation" | "outcome" | "name" | "email" | "phone", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(d: Record<string, string>): Errors {
  const e: Errors = {};
  if (!d.situation?.trim()) e.situation = "Tell us what’s happening.";
  if (!d.outcome?.trim()) e.outcome = "Tell us what you’d like to be different.";
  if (!d.name?.trim()) e.name = "Enter your name.";
  if (!d.email?.trim()) e.email = "Enter your work email.";
  else if (!EMAIL_RE.test(d.email.trim())) e.email = "Enter a valid email address.";
  if (!d.phone?.trim()) e.phone = "Enter a phone number.";
  return e;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const firstField = useRef<HTMLTextAreaElement>(null);

  // The hero CTA links to #contact-form; move focus to the first field on arrival.
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#contact-form") {
      firstField.current?.focus();
    }
  }, []);

  const clearError = (name: keyof Errors) =>
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const found = validate(payload);
    if (Object.keys(found).length) {
      setErrors(found);
      setStatus("idle");
      const first = Object.keys(found)[0];
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
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

  const err = (name: keyof Errors) =>
    errors[name] ? (
      <span className="cf__fielderr" id={`err-${name}`} role="alert">
        {errors[name]}
      </span>
    ) : null;
  const aria = (name: keyof Errors) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `err-${name}` : undefined,
  });

  return (
    <form className="cf" onSubmit={onSubmit} noValidate>
      {/* honeypot — hidden from people, tempting to bots */}
      <div className="cf__hp" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="cf__field">
        <label htmlFor="situation">What&rsquo;s happening?</label>
        <textarea id="situation" name="situation" rows={4} ref={firstField} {...aria("situation")} onInput={() => clearError("situation")} />
        {err("situation")}
      </div>

      <div className="cf__field">
        <label htmlFor="outcome">What would you like to be different?</label>
        <textarea id="outcome" name="outcome" rows={3} {...aria("outcome")} onInput={() => clearError("outcome")} />
        {err("outcome")}
      </div>

      <div className="cf__row">
        <div className="cf__field">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" type="text" autoComplete="name" {...aria("name")} onInput={() => clearError("name")} />
          {err("name")}
        </div>
        <div className="cf__field">
          <label htmlFor="email">Work email</label>
          <input id="email" name="email" type="email" autoComplete="email" {...aria("email")} onInput={() => clearError("email")} />
          {err("email")}
        </div>
      </div>

      <div className="cf__row">
        <div className="cf__field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" {...aria("phone")} onInput={() => clearError("phone")} />
          {err("phone")}
        </div>
        <div className="cf__field">
          <label htmlFor="company">Company <span className="cf__opt">(optional)</span></label>
          <input id="company" name="company" type="text" autoComplete="organization" />
        </div>
      </div>

      <div className="cf__field">
        <label htmlFor="area">Which area is this about? <span className="cf__opt">(optional)</span></label>
        <select id="area" name="area" defaultValue="">
          <option value="">Select an area…</option>
          <option>GTM Leadership</option>
          <option>Growth</option>
          <option>Product</option>
          <option>Operational AI</option>
          <option>Not sure</option>
        </select>
      </div>

      <div className="cf__actions">
        <button className="btn btn--cyan btn--lg" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send to CommView"}
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
