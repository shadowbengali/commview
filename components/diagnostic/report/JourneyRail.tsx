import type { Journey } from "@/lib/diagnostic/spine";

// The business-journey visual for "Where the signal appears". Horizontal rail on
// desktop, vertical on mobile (CSS). Highlights the stage(s) the deterministic
// spine chose to investigate; if none is isolated, it says so plainly rather than
// pointing nowhere.

export function JourneyRail({ journey }: { journey: Journey }) {
  const investigate = new Set(journey.investigateStages);
  const hasFocus = investigate.size > 0;

  return (
    <div className="dr-rail" role="group" aria-label={journey.label}>
      <ol className="dr-rail__track">
        {journey.stages.map((s) => {
          const active = investigate.has(s.id);
          return (
            <li key={s.id} className={`dr-stage${active ? " is-active" : ""}`}>
              <span className="dr-stage__node" aria-hidden="true">
                <span className="dr-stage__dot" />
              </span>
              <span className="dr-stage__label">{s.label}</span>
              <span className="dr-stage__sub">{s.sub}</span>
              {active ? <span className="dr-stage__pill">Investigate here</span> : null}
            </li>
          );
        })}
      </ol>
      {!hasFocus ? (
        <p className="dr-rail__note">
          The evidence doesn&rsquo;t yet isolate a single stage &mdash; that&rsquo;s part of what
          we&rsquo;d establish first.
        </p>
      ) : null}
    </div>
  );
}
