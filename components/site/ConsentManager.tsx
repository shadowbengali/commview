"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_DAYS,
  CONSENT_VERSION,
  type ConsentCategories,
  type ConsentChoice,
} from "@/lib/consent";

// The Commview cookie consent manager: a compact first-visit banner plus an
// accessible preferences dialog. It reads/writes a single first-party cookie
// and drives Google Consent Mode via gtag('consent','update', ...). The pre-GTM
// init script (lib/consent.ts) has already set the denied-by-default state, so
// this component only ever *updates* consent in response to a real choice.
//
// The footer "Cookie settings" control reopens the dialog by dispatching the
// `commview:open-consent` event, so consent can be changed as easily as given.

const OPEN_EVENT = "commview:open-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function readChoice(): ConsentChoice | null {
  try {
    const m = document.cookie.match(
      new RegExp("(?:^|; )" + CONSENT_COOKIE + "=([^;]+)")
    );
    if (!m) return null;
    const c = JSON.parse(decodeURIComponent(m[1])) as ConsentChoice;
    if (!c || c.v !== CONSENT_VERSION) return null;
    return c;
  } catch {
    return null;
  }
}

function writeChoice(cats: ConsentCategories): ConsentChoice {
  const choice: ConsentChoice = {
    v: CONSENT_VERSION,
    analytics: cats.analytics,
    marketing: cats.marketing,
    ts: Date.now(),
  };
  const value = encodeURIComponent(JSON.stringify(choice));
  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
  return choice;
}

// Best-effort removal of Google Analytics first-party cookies when Analytics is
// withdrawn. We can only touch cookies on our own domain; third-party cookies
// we do not control are out of scope (and the Cookie Policy says so).
function clearAnalyticsCookies(): void {
  try {
    const host = location.hostname;
    const parts = host.split(".");
    const root = parts.length > 2 ? "." + parts.slice(-2).join(".") : host;
    const names = document.cookie
      .split(";")
      .map((c) => c.split("=")[0].trim())
      .filter((n) => n.indexOf("_ga") === 0);
    for (const n of names) {
      document.cookie = `${n}=; path=/; max-age=0`;
      document.cookie = `${n}=; path=/; domain=${host}; max-age=0`;
      document.cookie = `${n}=; path=/; domain=${root}; max-age=0`;
    }
  } catch {
    /* nothing we can safely do */
  }
}

function applyConsent(cats: ConsentCategories): void {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: cats.analytics ? "granted" : "denied",
      ad_storage: cats.marketing ? "granted" : "denied",
      ad_user_data: cats.marketing ? "granted" : "denied",
      ad_personalization: cats.marketing ? "granted" : "denied",
    });
  }
  window.dataLayer?.push({
    event: "consent_update",
    analytics_consent: cats.analytics,
    marketing_consent: cats.marketing,
  });
}

export function ConsentManager() {
  const [mounted, setMounted] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Decide initial visibility from the stored choice, and wire the footer
  // "Cookie settings" opener.
  useEffect(() => {
    setMounted(true);
    const existing = readChoice();
    if (existing) {
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
    } else {
      setBannerOpen(true);
    }

    const open = () => {
      const current = readChoice();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      setBannerOpen(false);
      setPanelOpen(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const commit = useCallback((cats: ConsentCategories, prior?: ConsentChoice | null) => {
    const before = prior === undefined ? readChoice() : prior;
    writeChoice(cats);
    applyConsent(cats);
    if (before?.analytics && !cats.analytics) clearAnalyticsCookies();
    setAnalytics(cats.analytics);
    setMarketing(cats.marketing);
    setBannerOpen(false);
    setPanelOpen(false);
    returnFocusRef.current?.focus?.();
  }, []);

  const acceptAll = useCallback(
    () => commit({ analytics: true, marketing: true }),
    [commit]
  );
  const rejectOptional = useCallback(
    () => commit({ analytics: false, marketing: false }),
    [commit]
  );
  const savePrefs = useCallback(
    () => commit({ analytics, marketing }),
    [commit, analytics, marketing]
  );

  const openPanel = useCallback(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    // If they opened prefs from the first-visit banner without choosing, keep
    // the banner available so a choice is still made.
    if (!readChoice()) setBannerOpen(true);
    returnFocusRef.current?.focus?.();
  }, []);

  // Dialog: focus management, Escape to close, and a simple focus trap.
  useEffect(() => {
    if (!panelOpen) return;
    const node = dialogRef.current;
    if (!node) return;

    const focusables = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closePanel();
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusables();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panelOpen, closePanel]);

  if (!mounted) return null;

  return (
    <>
      {bannerOpen && !panelOpen ? (
        <section className="cc-banner" role="region" aria-label="Cookie settings">
          <div className="cc-banner__in">
            <div className="cc-banner__text">
              <p className="cc-banner__h">Cookie settings</p>
              <p className="cc-banner__p">
                We use necessary cookies to run the site and optional analytics to
                understand what&rsquo;s useful. You can accept optional cookies,
                reject them or choose what you&rsquo;re comfortable with.{" "}
                <a className="cc-link" href="/cookies">
                  Cookie Policy
                </a>
              </p>
            </div>
            <div className="cc-banner__actions">
              <button className="btn btn--cyan" type="button" onClick={acceptAll}>
                Accept all
              </button>
              <button className="btn btn--ghost" type="button" onClick={rejectOptional}>
                Reject optional
              </button>
              <button className="cc-textbtn" type="button" onClick={openPanel}>
                Manage preferences
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {panelOpen ? (
        <div className="cc-overlay" onMouseDown={(e) => {
          if (e.target === e.currentTarget) closePanel();
        }}>
          <div
            className="cc-panel"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cc-panel-h"
            aria-describedby="cc-panel-intro"
          >
            <div className="cc-panel__head">
              <h2 className="cc-panel__h" id="cc-panel-h">
                Cookie preferences
              </h2>
              <button
                className="cc-close"
                type="button"
                aria-label="Close cookie preferences"
                onClick={closePanel}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <p className="cc-panel__intro" id="cc-panel-intro">
              Choose which optional cookies you&rsquo;re happy for us to use.
              Necessary cookies are always enabled because the site needs them to
              work.
            </p>

            <ul className="cc-cats">
              <li className="cc-cat">
                <div className="cc-cat__row">
                  <span className="cc-cat__name">Necessary</span>
                  <span className="cc-cat__state cc-cat__state--on" aria-hidden="true">
                    Always on
                  </span>
                  <label className="cc-switch cc-switch--locked">
                    <span className="sr">Necessary cookies (always enabled)</span>
                    <input type="checkbox" checked disabled readOnly />
                    <span className="cc-switch__track" aria-hidden="true">
                      <span className="cc-switch__thumb" />
                    </span>
                  </label>
                </div>
                <p className="cc-cat__desc">
                  Required for core website functions and remembering your privacy
                  choices.
                </p>
              </li>

              <li className="cc-cat">
                <div className="cc-cat__row">
                  <span className="cc-cat__name" id="cc-analytics-label">
                    Analytics
                  </span>
                  <label className="cc-switch">
                    <span className="sr">Allow analytics cookies</span>
                    <input
                      type="checkbox"
                      checked={analytics}
                      aria-labelledby="cc-analytics-label"
                      onChange={(e) => setAnalytics(e.target.checked)}
                    />
                    <span className="cc-switch__track" aria-hidden="true">
                      <span className="cc-switch__thumb" />
                    </span>
                  </label>
                </div>
                <p className="cc-cat__desc">
                  Helps us understand how people find and use the site so we can
                  improve it.
                </p>
              </li>

              <li className="cc-cat">
                <div className="cc-cat__row">
                  <span className="cc-cat__name" id="cc-marketing-label">
                    Marketing
                  </span>
                  <label className="cc-switch">
                    <span className="sr">Allow marketing cookies</span>
                    <input
                      type="checkbox"
                      checked={marketing}
                      aria-labelledby="cc-marketing-label"
                      onChange={(e) => setMarketing(e.target.checked)}
                    />
                    <span className="cc-switch__track" aria-hidden="true">
                      <span className="cc-switch__thumb" />
                    </span>
                  </label>
                </div>
                <p className="cc-cat__desc">
                  Allows us to understand interactions with our marketing and
                  manage relevant communications where this technology is used.
                </p>
              </li>
            </ul>

            <div className="cc-panel__actions">
              <button className="btn btn--cyan" type="button" onClick={savePrefs}>
                Save preferences
              </button>
              <button className="btn btn--ghost" type="button" onClick={acceptAll}>
                Accept all
              </button>
              <button className="btn btn--ghost" type="button" onClick={rejectOptional}>
                Reject optional
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
