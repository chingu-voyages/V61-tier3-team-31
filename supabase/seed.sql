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
