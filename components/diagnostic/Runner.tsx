"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { DIAGNOSTIC } from "@/lib/diagnostic/content";
import {
  REFLECTION,
  RESULT,
  buildResult,
  collectEvidence,
  composeReflection,
  getQuestion,
  nextStepWithCap,
  progressPercent,
  sectionStatuses,
} from "@/lib/diagnostic/engine";
import type { Question, RunState } from "@/lib/diagnostic/types";

// The Business Diagnostic runner. Deterministic engine (lib/diagnostic/*) drives
// routing, evidence and the reading; this component is presentation + local run
// state only. No numeric score is ever shown. The result is free and instant.

type Draft = { values: string[]; fields: Record<string, string[]>; text: string };

const emptyDraft = (): Draft => ({ values: [], fields: {}, text: "" });

const STORE_KEY = "commview_diagnostic_run";

export function Runner() {
  const [state, setState] = useState<RunState>({ path: [], answers: {} });
  const [currentId, setCurrentId] = useState<string>(DIAGNOSTIC.start);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [reflectionChoice, setReflectionChoice] = useState<string>("");
  const [correction, setCorrection] = useState<string>("");
  // Compound questions are shown one field per screen (one question at a time),
  // committed together only when the last field is answered.
  const [subIndex, setSubIndex] = useState(0);
  // Email gate on the result screen.
  const [gate, setGate] = useState({ firstName: "", email: "", company: "", consent: false, website: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  // restore an in-progress run (best-effort; refresh shouldn't lose answers)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { state: RunState; currentId: string };
        if (saved?.state && saved.currentId) {
          setState(saved.state);
          setCurrentId(saved.currentId);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify({ state, currentId }));
    } catch {
      /* ignore */
    }
  }, [state, currentId]);

  // when the step changes, seed the draft from any stored answer and move focus
  useEffect(() => {
    const existing = state.answers[currentId];
    setDraft(
      existing
        ? {
            values: existing.values ?? [],
            fields: existing.fields ?? {},
            text: existing.text ?? "",
          }
        : emptyDraft()
    );
    setSubIndex(0);
    headingRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  const question = getQuestion(currentId);
  const evidence = useMemo(() => collectEvidence(state), [state]);
  const sections = useMemo(() => sectionStatuses(state, currentId), [state, currentId]);
  const pct = progressPercent(state, currentId);

  const commitAnswer = useCallback(
    (nextState: RunState, from: string) => {
      const next = nextStepWithCap(from, nextState);
      setState(nextState);
      setCurrentId(next);
    },
    []
  );

  const onContinue = useCallback(() => {
    if (!question) return;
    const answer = {
      questionId: currentId,
      values: draft.values.length ? draft.values : undefined,
      fields: Object.keys(draft.fields).length ? draft.fields : undefined,
      text: draft.text.trim() ? draft.text.trim() : undefined,
    };
    const path = state.path.includes(currentId) ? state.path : [...state.path, currentId];
    commitAnswer({ path, answers: { ...state.answers, [currentId]: answer } }, currentId);
  }, [question, currentId, draft, state, commitAnswer]);

  const onBack = useCallback(() => {
    if (currentId === RESULT) {
      setCurrentId(REFLECTION);
      return;
    }
    if (currentId === REFLECTION) {
      const prev = state.path[state.path.length - 1];
      if (prev) setCurrentId(prev);
      return;
    }
    const idx = state.path.indexOf(currentId);
    const prev = idx > 0 ? state.path[idx - 1] : state.path[state.path.length - 1];
    if (prev && prev !== currentId) setCurrentId(prev);
  }, [currentId, state.path]);

  const restart = useCallback(() => {
    try {
      sessionStorage.removeItem(STORE_KEY);
    } catch {
      /* ignore */
    }
    setState({ path: [], answers: {} });
    setCurrentId(DIAGNOSTIC.start);
    setReflectionChoice("");
    setCorrection("");
  }, []);

  const submitGate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSubmitError("");
      setSubmitting(true);
      try {
        const res = await fetch("/api/diagnostic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            state,
            firstName: gate.firstName,
            email: gate.email,
            company: gate.company,
            consent: gate.consent,
            website: gate.website,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.id) throw new Error(data.error || "Failed");
        try {
          sessionStorage.removeItem(STORE_KEY);
        } catch {
          /* ignore */
        }
        window.location.href = `/diagnostic/result/${data.id}`;
      } catch {
        setSubmitError("Something went wrong generating your diagnostic. Please try again.");
        setSubmitting(false);
      }
    },
    [state, gate]
  );

  // ----- REFLECTION -----
  if (currentId === REFLECTION) {
    const summary = composeReflection(state);
    const needsCorrection = reflectionChoice === "mostly" || reflectionChoice === "no";
    return (
      <Shell sections={sections} evidence={evidence} pct={pct} showAside>
        <div className="dg-run__main">
          <p className="dg-run__eyebrow">Reflection</p>
          <h2 className="dg-run__q" tabIndex={-1} ref={headingRef}>
            Here&rsquo;s what I&rsquo;m hearing
          </h2>
          <p className="dg-reflect">{summary}</p>

          <p className="dg-reflect__ask">Does that sound right?</p>
          <div className="dg-choices" role="radiogroup" aria-label="Does that sound right?">
            {[
              { v: "yes", label: "Yes, that's right" },
              { v: "mostly", label: "Mostly, but something is missing" },
              { v: "no", label: "No, that's not quite right" },
            ].map((c) => (
              <button
                key={c.v}
                type="button"
                role="radio"
                aria-checked={reflectionChoice === c.v}
                className={`dg-choice${reflectionChoice === c.v ? " is-on" : ""}`}
                onClick={() => setReflectionChoice(c.v)}
              >
                {c.label}
              </button>
            ))}
          </div>

          {needsCorrection ? (
            <label className="dg-field">
              <span className="dg-field__label">
                {reflectionChoice === "no" ? "What have I misunderstood?" : "What's missing?"}
              </span>
              <textarea
                className="dg-textarea"
                rows={3}
                value={correction}
                onChange={(e) => setCorrection(e.target.value)}
                placeholder="Add anything that would sharpen the picture."
              />
            </label>
          ) : null}

          <div className="dg-run__actions">
            <button type="button" className="btn btn--ghost" onClick={onBack}>
              <span aria-hidden="true">&larr; </span>Back
            </button>
            <button
              type="button"
              className="btn btn--cyan"
              disabled={!reflectionChoice}
              onClick={() => {
                const answers = {
                  ...state.answers,
                  reflection: {
                    questionId: "reflection",
                    values: [reflectionChoice],
                    text: correction.trim() || undefined,
                  },
                };
                setState({ ...state, answers });
                setCurrentId(RESULT);
              }}
            >
              See my Diagnostic<span aria-hidden="true"> &rarr;</span>
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  // ----- RESULT (free teaser) -----
  if (currentId === RESULT) {
    const { reading, evidence: shown, investigateFirst } = buildResult(state);
    // The email gate only shows once capture is enabled (Supabase/OpenAI live).
    const captureEnabled = process.env.NEXT_PUBLIC_DIAGNOSTIC_CAPTURE === "true";
    return (
      <section className="dg-result" aria-labelledby="dg-result-h">
        <div className="wrap dg-result__wrap">
          <p className="dg-run__eyebrow">Your CommView Diagnostic</p>
          <h2 className="dg-result__headline" id="dg-result-h" tabIndex={-1} ref={headingRef}>
            {reading.headline}
          </h2>

          <div className="dg-result__grid">
            <div className="dg-result__block">
              <p className="dg-result__k">Weak link</p>
              <p className="dg-result__weak">{reading.weakLink}</p>
            </div>
            <div className="dg-result__block">
              <p className="dg-result__k">What we&rsquo;re seeing</p>
              <p className="dg-result__body">{reading.summary}</p>
            </div>
          </div>

          {shown.length ? (
            <div className="dg-result__block">
              <p className="dg-result__k">Evidence from your answers</p>
              <ul className="dg-result__ev">
                {shown.map((e, i) => (
                  <li key={i}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                      <path d="M7 4h7l4 4v12H7z" strokeLinejoin="round" />
                      <path d="M13 4v5h5" strokeLinejoin="round" />
                    </svg>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="dg-result__block">
            <p className="dg-result__k">What we&rsquo;d investigate first</p>
            <p className="dg-result__body">{investigateFirst}</p>
          </div>

          {!captureEnabled ? (
            <div className="dg-result__cta dark">
              <h3 className="dg-result__ctah">Want us to go deeper?</h3>
              <p className="dg-result__ctap">
                This is an initial view based on what you&rsquo;ve told us. The next
                step is validating it against the data, customers and people inside
                the business.
              </p>
              <div className="dg-result__row">
                <a className="btn btn--cyan btn--lg" href="/contact?source=diagnostic">
                  Talk to CommView<span aria-hidden="true"> &rarr;</span>
                </a>
              </div>
            </div>
          ) : (
          <div className="dg-gate dark">
            <h3 className="dg-gate__h">Get your full diagnostic</h3>
            <p className="dg-gate__p">
              We&rsquo;ll tailor the full read to your answers, with the moves
              we&rsquo;d prioritise and what to read next.
            </p>
            <form className="dg-gate__form" onSubmit={submitGate}>
              <div className="dg-gate__grid">
                <label className="dg-gate__field">
                  <span className="sr">First name</span>
                  <input type="text" name="firstName" placeholder="First name" autoComplete="given-name" required value={gate.firstName} onChange={(e) => setGate({ ...gate, firstName: e.target.value })} />
                </label>
                <label className="dg-gate__field">
                  <span className="sr">Work email</span>
                  <input type="email" name="email" placeholder="Work email" autoComplete="email" required value={gate.email} onChange={(e) => setGate({ ...gate, email: e.target.value })} />
                </label>
                <label className="dg-gate__field">
                  <span className="sr">Company</span>
                  <input type="text" name="company" placeholder="Company" autoComplete="organization" value={gate.company} onChange={(e) => setGate({ ...gate, company: e.target.value })} />
                </label>
              </div>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={gate.website} onChange={(e) => setGate({ ...gate, website: e.target.value })} className="dg-gate__hp" />
              <label className="dg-gate__consent">
                <input type="checkbox" required checked={gate.consent} onChange={(e) => setGate({ ...gate, consent: e.target.checked })} />
                <span>Send me my diagnostic and occasional CommView insights. Unsubscribe anytime.</span>
              </label>
              {submitError ? <p className="dg-gate__err">{submitError}</p> : null}
              <div className="dg-gate__actions">
                <button type="submit" className="btn btn--cyan btn--lg" disabled={submitting}>
                  {submitting ? "Generating your diagnostic…" : "Get my full diagnostic"}
                </button>
                <a className="btn btn--ghost btn--lg" href="/contact?source=diagnostic">Talk to CommView</a>
              </div>
              <p className="dg-gate__note">
                We use your details to prepare and send your diagnostic. See our{" "}
                <a href="/privacy">Privacy Policy</a>.
              </p>
            </form>
          </div>
          )}

          <button type="button" className="dg-restart" onClick={restart}>
            Start the Diagnostic again
          </button>
        </div>
      </section>
    );
  }

  // ----- QUESTION -----
  if (!question) return null;
  const isCompound = question.type === "compound";
  const fields = question.fields ?? [];
  const field = isCompound ? fields[Math.min(subIndex, fields.length - 1)] : null;
  const heading = isCompound && field ? field.question : question.question;
  const valid = isCompound && field ? fieldValid(field, draft) : isValid(question, draft);
  const canBack = state.path.length > 0 || subIndex > 0;

  const stepContinue = () => {
    if (isCompound && subIndex < fields.length - 1) {
      setSubIndex(subIndex + 1);
      headingRef.current?.focus();
      return;
    }
    onContinue();
  };
  const stepBack = () => {
    if (isCompound && subIndex > 0) {
      setSubIndex(subIndex - 1);
      headingRef.current?.focus();
      return;
    }
    onBack();
  };

  return (
    <Shell sections={sections} evidence={evidence} pct={pct} showAside>
      <div className="dg-run__main">
        {question.eyebrow ? <p className="dg-run__eyebrow">{question.eyebrow}</p> : null}
        {isCompound ? <p className="dg-run__lead">{question.question}</p> : null}
        <h2 className="dg-run__q" tabIndex={-1} ref={headingRef}>
          {heading}
        </h2>
        {!isCompound && question.help ? <p className="dg-run__help">{question.help}</p> : null}

        {isCompound && field ? (
          <OptionList
            name={field.id}
            multi={field.type === "multi_select"}
            max={field.maxSelections}
            options={field.options}
            selected={draft.fields[field.id] ?? []}
            onChange={(vals) =>
              setDraft({ ...draft, fields: { ...draft.fields, [field.id]: vals } })
            }
          />
        ) : (
          <QuestionBody question={question} draft={draft} setDraft={setDraft} />
        )}

        <div className="dg-run__actions">
          {canBack ? (
            <button type="button" className="btn btn--ghost" onClick={stepBack}>
              <span aria-hidden="true">&larr; </span>Back
            </button>
          ) : (
            <span />
          )}
          <button type="button" className="btn btn--cyan" disabled={!valid} onClick={stepContinue}>
            Continue<span aria-hidden="true"> &rarr;</span>
          </button>
        </div>
      </div>
    </Shell>
  );
}

// ---------- validation ----------
function fieldValid(
  field: { id: string; type: "single_select" | "multi_select" },
  d: Draft
): boolean {
  const sel = d.fields[field.id] ?? [];
  return field.type === "single_select" ? sel.length === 1 : sel.length >= 1;
}

function isValid(q: Question, d: Draft): boolean {
  switch (q.type) {
    case "free_text":
      if (q.allowNone && d.values.includes("__none__")) return true;
      return d.text.trim().length > 0 || d.values.length > 0;
    case "single_select":
      return d.values.length === 1;
    case "multi_select":
      return d.values.length >= 1;
    case "compound":
      return (q.fields ?? []).every((f) =>
        f.type === "single_select"
          ? (d.fields[f.id]?.length ?? 0) === 1
          : (d.fields[f.id]?.length ?? 0) >= 1
      );
    default:
      return false;
  }
}

// ---------- question body ----------
function QuestionBody({
  question,
  draft,
  setDraft,
}: {
  question: Question;
  draft: Draft;
  setDraft: (d: Draft) => void;
}) {
  if (question.type === "free_text") {
    const none = question.allowNone && draft.values.includes("__none__");
    return (
      <div className="dg-free">
        <textarea
          className="dg-textarea"
          rows={4}
          placeholder={question.placeholder}
          value={draft.text}
          disabled={!!none}
          onChange={(e) => setDraft({ ...draft, text: e.target.value })}
        />
        {question.starterOptions?.length ? (
          <div className="dg-chips" role="group" aria-label="Quick starters">
            {question.starterOptions.map((s) => {
              const on = draft.values.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={on}
                  className={`dg-chip${on ? " is-on" : ""}`}
                  onClick={() => setDraft({ ...draft, values: on ? [] : [s.id] })}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        ) : null}
        {question.allowNone ? (
          <label className="dg-none">
            <input
              type="checkbox"
              checked={!!none}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  values: e.target.checked ? ["__none__"] : [],
                  text: e.target.checked ? "" : draft.text,
                })
              }
            />
            {question.noneLabel}
          </label>
        ) : null}
      </div>
    );
  }

  if (question.type === "compound") {
    return (
      <div className="dg-compound">
        {(question.fields ?? []).map((f) => (
          <fieldset key={f.id} className="dg-fieldset">
            <legend className="dg-legend">{f.question}</legend>
            <OptionList
              name={f.id}
              multi={f.type === "multi_select"}
              max={f.maxSelections}
              options={f.options}
              selected={draft.fields[f.id] ?? []}
              onChange={(vals) => setDraft({ ...draft, fields: { ...draft.fields, [f.id]: vals } })}
            />
          </fieldset>
        ))}
      </div>
    );
  }

  // single / multi
  return (
    <OptionList
      name={question.id}
      multi={question.type === "multi_select"}
      max={question.maxSelections}
      options={question.options ?? []}
      selected={draft.values}
      onChange={(vals) => setDraft({ ...draft, values: vals })}
    />
  );
}

function OptionList({
  name,
  multi,
  max,
  options,
  selected,
  onChange,
}: {
  name: string;
  multi: boolean;
  max?: number;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (vals: string[]) => void;
}) {
  const atMax = multi && max ? selected.length >= max : false;
  return (
    <div className="dg-opts" role={multi ? "group" : "radiogroup"}>
      {options.map((o) => {
        const on = selected.includes(o.value);
        const disabled = !on && atMax;
        return (
          <label key={o.value} className={`dg-opt${on ? " is-on" : ""}${disabled ? " is-dim" : ""}`}>
            <input
              type={multi ? "checkbox" : "radio"}
              name={name}
              checked={on}
              disabled={disabled}
              onChange={() => {
                if (multi) {
                  onChange(on ? selected.filter((v) => v !== o.value) : [...selected, o.value]);
                } else {
                  onChange([o.value]);
                }
              }}
            />
            <span className="dg-opt__mark" aria-hidden="true" />
            <span className="dg-opt__label">{o.label}</span>
          </label>
        );
      })}
      {multi && max ? <p className="dg-opts__hint">Select up to {max}.</p> : null}
    </div>
  );
}

// ---------- layout shell (main + aside) ----------
function Shell({
  children,
  sections,
  evidence,
  pct,
}: {
  children: React.ReactNode;
  sections: { label: string; status: string }[];
  evidence: string[];
  pct: number;
  showAside?: boolean;
}) {
  return (
    <section className="dg-run">
      <div className="wrap dg-run__grid">
        {children}
        <aside className="dg-aside" aria-label="Diagnostic progress">
          <div className="dg-aside__bar" aria-hidden="true">
            <span style={{ width: `${pct}%` }} />
          </div>
          <p className="dg-aside__k">Building the picture</p>
          <ul className="dg-steps">
            {sections.map((s) => (
              <li key={s.label} className={`dg-step dg-step--${s.status}`}>
                <span className="dg-step__dot" aria-hidden="true">
                  {s.status === "done" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </span>
                {s.label}
              </li>
            ))}
          </ul>

          {evidence.length ? (
            <>
              <p className="dg-aside__k dg-aside__k--sep">What we&rsquo;ve heard</p>
              <ul className="dg-heard">
                {evidence.map((e, i) => (
                  <li key={i}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                      <path d="M7 4h7l4 4v12H7z" strokeLinejoin="round" />
                      <path d="M13 4v5h5" strokeLinejoin="round" />
                    </svg>
                    {e}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <p className="dg-note dg-note--aside" role="note">
            No need to rush. Explain things as you would to someone inside the business.
          </p>
        </aside>
      </div>
    </section>
  );
}
