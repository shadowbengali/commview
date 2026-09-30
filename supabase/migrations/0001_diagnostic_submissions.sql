-- Commview Business Diagnostic — submissions store.
-- Run this once in the Supabase SQL editor (or via the CLI) for the project
-- whose URL + service-role key are set in the app env.
--
-- Writes/reads happen server-side only, through the service-role key, so RLS
-- stays ON with no public policies (the anon key can't touch this table).

create extension if not exists "pgcrypto";

create table if not exists public.diagnostic_submissions (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  -- the run
  answers           jsonb not null,
  evidence          jsonb not null default '[]'::jsonb,
  reading           text not null,
  weak_link         text not null,
  free_text         text,
  -- the lead
  first_name        text,
  email             text,
  company           text,
  marketing_consent boolean not null default false,
  -- cached generated output (narrative + moves + insight slugs)
  ai                jsonb
);

create index if not exists diagnostic_submissions_created_at_idx
  on public.diagnostic_submissions (created_at desc);

-- RLS on, deliberately no policies: only the service-role key (used server-side)
-- bypasses RLS, so nothing is readable/writable with the public anon key.
alter table public.diagnostic_submissions enable row level security;
