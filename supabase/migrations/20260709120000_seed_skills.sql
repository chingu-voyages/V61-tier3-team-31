-- Seed the skills catalog used by the apply form.
--
-- This migration is idempotent: re-running it will not create duplicate
-- rows because each insert uses `on conflict (slug) do nothing`.
-- Slugs are unique per the skills table schema (see supabase/schema dump).

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
