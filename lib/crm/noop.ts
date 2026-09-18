import type { Crm } from "./index";

// Used whenever no CRM token is configured. Logs in development so wiring can
// be seen; silent in production. Never throws — a missing CRM must not break
// a form submission.
export const noopCrm: Crm = {
  async identify(contact) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[crm:noop] identify", contact.email);
    }
  },
  async track(event) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[crm:noop] track", event.event, event.email);
    }
  },
  async subscribe(email, source) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[crm:noop] subscribe", email, "from", source);
    }
  },
};
