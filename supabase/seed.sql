-- Seed reference data for local development.
--
-- This file is auto-applied by `supabase db reset` and `supabase start`
-- and is the source of truth for non-secret reference rows used in dev.
-- Production data is created through the application, not through this file.
--
-- Keep inserts idempotent with `on conflict (...) do nothing` so the seed
-- can be re-applied without errors.

insert into public.skills (name, slug, active)
values
  ('React', 'react', true),
  ('TypeScript', 'typescript', true),
  ('Node.js', 'nodejs', true),
  ('Python', 'python', true),
  ('PostgreSQL', 'postgresql', true),
  ('Docker', 'docker', true),
  ('AWS', 'aws', true),
  ('Figma', 'figma', true),
  ('Next.js', 'nextjs', true),
  ('Go', 'go', true),
  ('GraphQL', 'graphql', true),
  ('Tailwind CSS', 'tailwind-css', true),
  ('Redis', 'redis', true),
  ('Kubernetes', 'kubernetes', true),
  ('Swift', 'swift', true)
on conflict (slug) do nothing;

insert into public.voyages (
  number,
  name,
  description,
  status,
  applications_open_at,
  application_deadline,
  starts_at,
  ends_at,
  min_team_size,
  max_team_size
)
values (
  1,
  'Voyage 1',
  'First cohort of the Chingu platform. Building cross-functional product teams to ship MVP web apps.',
  'applications_open',
  now(),
  '2026-12-31 23:59:59+00',
  '2027-01-15 00:00:00+00',
  '2027-03-15 00:00:00+00',
  4,
  6
)
on conflict (number) do nothing;