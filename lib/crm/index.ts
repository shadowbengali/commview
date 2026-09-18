// The one CRM seam. Every form, the subscribe box and the diagnostic call only
// these three methods. Swapping vendor means writing one new implementation
// file and changing the single line below — never touching a component.

export interface CrmContact {
  email: string;
  firstName?: string;
  company?: string;
  properties?: Record<string, string | number>;
}

export interface CrmEvent {
  email: string;
  event: string;
  properties?: Record<string, unknown>;
}

export interface Crm {
  identify(contact: CrmContact): Promise<void>;
  track(event: CrmEvent): Promise<void>;
  subscribe(email: string, source: string): Promise<void>;
}

import { hubspotCrm } from "./hubspot";
import { noopCrm } from "./noop";

// HubSpot when a token is present; a safe no-op otherwise so local dev and
// preview builds never fail on a missing secret.
export const crm: Crm = process.env.HUBSPOT_PRIVATE_APP_TOKEN
  ? hubspotCrm
  : noopCrm;
