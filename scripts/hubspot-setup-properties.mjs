// Creates the custom HubSpot contact properties the site writes to, with the
// exact internal names the code sends. Idempotent: it skips any that already
// exist, so it is safe to run more than once.
//
//   node scripts/hubspot-setup-properties.mjs
//
// Needs HUBSPOT_PRIVATE_APP_TOKEN, read from the environment or from .env.local.
// The token never leaves your machine.

import { readFileSync } from "node:fs";

function loadToken() {
  if (process.env.HUBSPOT_PRIVATE_APP_TOKEN) return process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  try {
    const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    const m = env.match(/^\s*HUBSPOT_PRIVATE_APP_TOKEN\s*=\s*(.+?)\s*$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  } catch {
    /* no .env.local — fall through */
  }
  return null;
}

const TOKEN = loadToken();
if (!TOKEN) {
  console.error(
    "HUBSPOT_PRIVATE_APP_TOKEN not found. Set it in the environment or in .env.local."
  );
  process.exit(1);
}

const BASE = "https://api.hubapi.com/crm/v3/properties/contacts";
const GROUP = "contactinformation"; // HubSpot's default contact property group

// All single-line text so they accept any value the code sends. Convert any of
// them to a dropdown later in the HubSpot UI if you want controlled options.
const PROPS = [
  {
    name: "lead_source",
    label: "Lead source",
    description:
      "Most recent channel the contact came through (last-touch): contact, diagnostic or newsletter.",
  },
  {
    name: "original_lead_source",
    label: "Original lead source",
    description:
      "First channel the contact ever came through (first-touch); set once, never overwritten.",
  },
  {
    name: "pillar_interest",
    label: "Pillar interest",
    description:
      "Which capability the contact enquired about (GTM Leadership, Growth, Product, Operational AI), if they picked one.",
  },
  {
    name: "diagnostic_reading",
    label: "Diagnostic reading",
    description: "Headline of the diagnostic result the contact received.",
  },
  {
    name: "diagnostic_weak_link",
    label: "Diagnostic weak link",
    description: "The weak link the diagnostic identified for the contact.",
  },
];

const auth = { Authorization: `Bearer ${TOKEN}` };

async function exists(name) {
  const res = await fetch(`${BASE}/${name}`, { headers: auth });
  return res.ok;
}

async function create(p) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: p.name,
      label: p.label,
      description: p.description,
      groupName: GROUP,
      type: "string",
      fieldType: "text",
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
}

let created = 0;
let skipped = 0;
let failed = 0;
for (const p of PROPS) {
  if (await exists(p.name)) {
    console.log(`= ${p.name} already exists`);
    skipped += 1;
    continue;
  }
  try {
    await create(p);
    console.log(`+ created ${p.name}`);
    created += 1;
  } catch (e) {
    console.error(`x failed ${p.name}: ${e.message}`);
    failed += 1;
  }
}
console.log(`\nDone. created ${created}, skipped ${skipped}, failed ${failed}.`);
process.exit(failed ? 1 : 0);
