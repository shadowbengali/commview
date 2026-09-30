-- Diagnostic report rebuild. The submission row is now created at completion
-- (anonymous) with the deterministic "spine"; the AI interpretation and the
-- lead's details are attached on unlock. Denormalised columns support analytics
-- filtering without exposing free text.
alter table public.diagnostic_submissions
  add column if not exists spine jsonb,
  add column if not exists analysis jsonb,
  add column if not exists analysis_version integer not null default 1,
  add column if not exists primary_area text,
  add column if not exists evidence_strength text,
  add column if not exists journey_type text,
  add column if not exists unlocked_at timestamptz;
