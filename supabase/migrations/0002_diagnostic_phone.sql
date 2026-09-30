-- Add phone to diagnostic submissions. The diagnostic gate now collects a
-- required phone number alongside first name, email and company.
alter table public.diagnostic_submissions
  add column if not exists phone text;
