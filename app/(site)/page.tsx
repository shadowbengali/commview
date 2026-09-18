import { fetchSanityHealth } from "@/lib/sanity/queries";

// TODO (Phase 1): replace this entire page with the ported, locked homepage
// from reference/index.html. This is a Phase 0 proof-of-pipe page only — it is
// not shipped copy and must not survive Phase 1.
export default async function Phase0ProofPage() {
  const health = await fetchSanityHealth();

  const status = !health.projectConfigured
    ? { label: "Awaiting Sanity project id", tone: "pending" as const }
    : health.connected
      ? { label: `Connected — ${health.documentCount} documents`, tone: "ok" as const }
      : { label: "Project id set, but the query failed", tone: "error" as const };

  const toneColour =
    status.tone === "ok"
      ? "var(--accent-green)"
      : status.tone === "error"
        ? "var(--accent-pink)"
        : "var(--accent-yellow)";

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-8)",
      }}
    >
      <div style={{ maxWidth: 640, width: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/commview-logo-reversed-nobg.svg"
          alt="COMMVIEW"
          width={176}
          height={40}
          style={{ height: 40, width: "auto", marginBottom: "var(--space-8)" }}
        />
        <p className="eyebrow" style={{ color: "var(--brand-cyan)" }}>
          PHASE 0 — FOUNDATIONS
        </p>
        <h1 className="display-l" style={{ marginTop: "var(--space-3)" }}>
          The pipe is wired.
        </h1>
        <p
          className="body-l"
          style={{ color: "var(--text-secondary)", marginTop: "var(--space-4)" }}
        >
          Next.js 15, the design system, the embedded Studio and the two
          seams are in place. This placeholder is replaced by the locked
          homepage in Phase 1.
        </p>

        <div
          style={{
            marginTop: "var(--space-8)",
            padding: "var(--space-6)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            background: "var(--surface-raised)",
          }}
        >
          <p className="label-s" style={{ color: "var(--text-secondary)" }}>
            SANITY
          </p>
          <p
            className="heading-s"
            style={{ marginTop: "var(--space-2)", color: toneColour }}
          >
            {status.label}
          </p>
        </div>

        <p
          className="body-s"
          style={{ color: "var(--text-secondary)", marginTop: "var(--space-6)" }}
        >
          Studio: <a style={{ color: "var(--brand-cyan)" }} href="/studio">/studio</a>
        </p>
      </div>
    </main>
  );
}
