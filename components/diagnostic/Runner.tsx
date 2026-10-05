"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DIAGNOSTIC } from "@/lib/diagnostic/content";
import {
  REFLECTION,
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
  // Completion: create the submission, then hand off to the report page.
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
    if (currentId === REFLECTION) {
      const prev = state.path[state.path.length - 1];
      if (prev) setCurrentId(prev);
      return;
    }
    const idx = state.path.indexOf(currentId);
    const prev = idx > 0 ? state.path[idx - 1] : state.path[state.path.length - 1];
    if (prev && prev !== currentId) setCurrentId(prev);
  }, [currentId, state.path]);

  // Complete the run: persist the answers server-side (the deterministic spine is
  // built there), then hand off to the report page. Details are captured on the
  // report page's unlock gate, not here.
  const completeAndRedirect = useCallback(async (finalState: RunState) => {
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: finalState }),
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
      setSubmitError("Something went wrong preparing your diagnostic. Please try again.");
      setSubmitting(false);
    }
  }, []);

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
              disabled={!reflectionChoice || submitting}
              onClick={() => {
                const finalState: RunState = {
                  ...state,
                  answers: {
                    ...state.answers,
                    reflection: {
                      questionId: "reflection",
                      values: [reflectionChoice],
                      text: correction.trim() || undefined,
                    },
                  },
                };
                setState(finalState);
                void completeAndRedirect(finalState);
              }}
            >
              {submitting ? "Preparing your diagnostic…" : "See my Diagnostic"}
              {!submitting ? <span aria-hidden="true"> &rarr;</span> : null}
            </button>
          </div>
          {submitError ? <p className="dg-gate__err" role="alert">{submitError}</p> : null}
        </div>
      </Shell>
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
        <h2 className="dg-run__q" id="dg-question-heading" tabIndex={-1} ref={headingRef}>
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
          aria-labelledby="dg-question-heading"
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
