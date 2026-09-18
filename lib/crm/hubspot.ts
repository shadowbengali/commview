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
    await fetch(`${BASE}/crm/v3/objects/contacts`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ properties }),
    });
    return;
  }

  if (!res.ok) {
    throw new Error(`HubSpot upsert failed: ${res.status}`);
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

  async subscribe(email, source) {
    await upsert({ email, properties: { subscribed: "true", source } });
  },
};
