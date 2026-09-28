"use client";

// Footer "Cookie settings" control. It dispatches the event the ConsentManager
// listens for, so the preferences dialog can be reopened from anywhere without
// coupling the footer to the manager's internals. Rendered as a real <button>
// styled to sit inline with the footer's legal links.
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="ftr__cookie"
      onClick={() =>
        window.dispatchEvent(new CustomEvent("commview:open-consent"))
      }
    >
      Cookie settings
    </button>
  );
}
