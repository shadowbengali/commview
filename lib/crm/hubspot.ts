import type { Crm, CrmContact } from "./index";

// HubSpot implementation of the CRM seam, over the REST API with fetch —
// no vendor SDK, per the repo rules. This is the Phase 0 shape; Phase 1
// hardens error handling and adds the custom diagnostic properties.

const BASE = "https://api.hubapi.com";

function headers() {
  return {
    Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
    "Content-Type": "application/json",
  };
}

// Upsert a contact by email (HubSpot treats email as a unique id property).
async function upsert(contact: CrmContact): Promise<void> {
  const properties: Record<string, string | number> = {
    email: contact.email,
    ...(contact.firstName ? { firstname: contact.firstName } : {}),
    ...(contact.company ? { company: contact.company } : {}),
    ...contact.properties,
  };

  const res = await fetch(
    `${BASE}/crm/v3/objects/contacts/${encodeURIComponent(
      contact.email
    )}?idProperty=email`,
    { method: "PATCH", headers: headers(), body: JSON.stringify({ properties }) }
  );

  // 404 means the contact does not exist yet — create it.
  if (res.status === 404) {
    const createRes = await fetch(`${BASE}/crm/v3/objects/contacts`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ properties }),
    });
    if (!createRes.ok) {
      throw new Error(`HubSpot create failed: ${createRes.status} ${(await createRes.text()).slice(0, 220)}`);
    }
    return;
  }

  if (!res.ok) {
    throw new Error(`HubSpot update failed: ${res.status} ${(await res.text()).slice(0, 220)}`);
  }
}

// Read a single property off a contact (by email). Returns "" when the contact
// or the property is absent, or on any error — callers treat that as "unknown".
async function readProperty(email: string, property: string): Promise<string> {
  try {
    const res = await fetch(
      `${BASE}/crm/v3/objects/contacts/${encodeURIComponent(
        email
      )}?idProperty=email&properties=${encodeURIComponent(property)}`,
      { headers: headers() }
    );
    if (!res.ok) return "";
    const data = await res.json();
    return String(data?.properties?.[property] ?? "");
  } catch {
    return "";
  }
}

// Stamp lead source with first-touch preservation. The last-touch write and the
// first-touch write are separate PATCHes on purpose: if the custom
// `original_lead_source` property is missing in the portal, that failure must
// not stop `lead_source` (the always-updated field) from landing.
async function stampLeadSource(email: string, source: string): Promise<void> {
  await upsert({ email, properties: { lead_source: source } });
  const existing = await readProperty(email, "original_lead_source");
  if (!existing) {
    await upsert({ email, properties: { original_lead_source: source } });
  }
}

export const hubspotCrm: Crm = {
  async identify(contact) {
    await upsert(contact);
  },

  async track(event) {
    // Events are stored as contact properties for now; a dedicated timeline
    // event API call lands in Phase 2 with the diagnostic.
    await upsert({
      email: event.email,
      properties: {
        last_event: event.event,
        ...(event.properties as Record<string, string | number>),
      },
    });
  },

  async subscribe(email) {
    // The newsletter is one lead channel among the others, so it flows through
    // the same lead_source field rather than a separate `source` property.
    await stampLeadSource(email, "newsletter");
  },

  async setLeadSource(email, source) {
    await stampLeadSource(email, source);
  },
};
