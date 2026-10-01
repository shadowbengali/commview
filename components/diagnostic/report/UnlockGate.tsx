"use client";

import { useState, type FormEvent } from "react";

import { track } from "@/lib/analytics";

// The unlock gate. Sits where the interpretation would be, over a blurred,
// gradient "ghost" of the locked report so the value is visible but unreadable.
// On submit it posts the lead's details, the server generates + stores the
// analysis, and the page reloads to server-render the full report. The real
// content never exists in the DOM until then — the ghost is fake placeholder.

const UNLOCKS = [
  "What doesn’t quite add up across your answers",
  "Where we’d investigate first, and why",
  "The one first move we’d make",
];

// Flag read by UnlockedModal after the post-unlock reload, so the "talk to an
// expert" modal shows once, immediately after unlocking.
export const UNLOCK_FLAG = "commview_dg_unlocked";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type GateErrors = Partial<Record<"firstName" | "email" | "phone" | "consent", string>>;

// Fake, unreadable teaser lines behind the blur (never the real analysis).
const GHOST_CARDS = [
  ["If the problem were only one thing", "the other signals wouldn’t move together the way they do here, which is worth a closer look before acting."],
  ["Two changes landed in the same window", "that doesn’t prove cause, but it makes the relationship worth testing rather than assuming."],
  ["The constraint may not sit in one place", "the evidence points across more than one area, so we’d establish the primary one first."],
];

export function UnlockGate({
  id,
  primaryArea,
  evidenceStrength,
}: {
  id: string;
  primaryArea: string;
  evidenceStrength: string;
}) {
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    phone: "",
    company: "",
    consent: false,
    website: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errors, setErrors] = useState<GateErrors>({});
  const set = (k: keyof typeof form, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => (e[k as keyof GateErrors] ? { ...e, [k]: undefined } : e));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const found: GateErrors = {};
    if (!form.firstName.trim()) found.firstName = "Enter your first name.";
    if (!form.email.trim()) found.email = "Enter your work email.";
    else if (!EMAIL_RE.test(form.email.trim())) found.email = "Enter a valid email address.";
    if (!form.phone.trim()) found.phone = "Enter a phone number.";
    if (!form.consent) found.consent = "Please tick the box so we can send your diagnostic.";
    if (Object.keys(found).length) {
      setErrors(found);
      setStatus("idle");
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/diagnostic/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed");
      track("diagnostic_report_unlocked", {
        primary_area: primaryArea,
        evidence_strength: evidenceStrength,
      });
      try {
        sessionStorage.setItem(UNLOCK_FLAG, id);
      } catch {
        /* ignore */
      }
      window.location.reload();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="dr-gate" aria-labelledby="dr-gate-h">
      {/* Blurred placeholder of the locked report — decorative only. */}
      <div className="dr-gate__ghost" aria-hidden="true">
        <span className="dr-ghost__eyebrow">What doesn’t quite add up</span>
        <h3 className="dr-ghost__h">The parts worth a closer look.</h3>
        <div className="dr-ghost__cards">
          {GHOST_CARDS.map(([t, p], i) => (
            <div className="dr-ghost__card" key={i}>
              <span className="dr-ghost__num">{String(i + 1).padStart(2, "0")}</span>
              <p className="dr-ghost__ct">{t}</p>
              <p className="dr-ghost__cp">{p}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap dr-gate__wrap">
        <div className="dr-gate__intro">
          <p className="dr-eyebrow">The full read</p>
          <h2 className="dr-gate__h" id="dr-gate-h">
            Unlock the rest of your diagnostic
          </h2>
          <p className="dr-gate__p">
            You&rsquo;ve seen where the signal appears. The full read is tailored to your answers
            and includes:
          </p>
          <ul className="dr-gate__list">
            {UNLOCKS.map((u) => (
              <li key={u}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {u}
              </li>
            ))}
          </ul>
        </div>

        <form className="dr-gate__form" onSubmit={onSubmit} noValidate>
          <div className="dr-gate__hp" aria-hidden="true">
            <label htmlFor="dr-website">Leave this field empty</label>
            <input
              id="dr-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
            />
          </div>

          <div className="dr-gate__row">
            <label className="dr-gate__field">
              <span>First name</span>
              <input type="text" autoComplete="given-name" aria-invalid={errors.firstName ? true : undefined} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
              {errors.firstName ? <span className="dr-gate__fielderr" role="alert">{errors.firstName}</span> : null}
            </label>
            <label className="dr-gate__field">
              <span>Work email</span>
              <input type="email" autoComplete="email" aria-invalid={errors.email ? true : undefined} value={form.email} onChange={(e) => set("email", e.target.value)} />
              {errors.email ? <span className="dr-gate__fielderr" role="alert">{errors.email}</span> : null}
            </label>
          </div>
          <div className="dr-gate__row">
            <label className="dr-gate__field">
              <span>Phone</span>
              <input type="tel" autoComplete="tel" aria-invalid={errors.phone ? true : undefined} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              {errors.phone ? <span className="dr-gate__fielderr" role="alert">{errors.phone}</span> : null}
            </label>
            <label className="dr-gate__field">
              <span>Company <em>(optional)</em></span>
              <input type="text" autoComplete="organization" value={form.company} onChange={(e) => set("company", e.target.value)} />
            </label>
          </div>

          <label className="dr-gate__consent">
            <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} />
            <span>Send me my diagnostic and occasional Commview insights. Unsubscribe anytime.</span>
          </label>
          {errors.consent ? <span className="dr-gate__fielderr" role="alert">{errors.consent}</span> : null}

          {status === "error" ? (
            <p className="dr-gate__err" role="alert">
              Something went wrong unlocking that. Please try again.
            </p>
          ) : null}

          <button type="submit" className="btn btn--cyan btn--lg" disabled={status === "sending"}>
            {status === "sending" ? "Preparing your diagnostic…" : "Unlock the full diagnostic"}
          </button>
          <p className="dr-gate__note">
            We use your details to prepare your diagnostic and follow up. See our{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </section>
  );
}
