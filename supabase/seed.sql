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
values
  (
    1,
    'Course 1',
    'First cohort of the platform. Building cross-functional product teams to ship MVP web apps.',
    'active',
    '2026-06-15 00:00:00+00',
    '2026-08-10 23:59:59+00',
    '2026-08-15 00:00:00+00',
    '2026-10-15 23:59:59+00',
    4,
    6
  ),
  (
    2,
    'Course 2',
    'Second cohort of the platform. Apply while Course 1 is in progress.',
    'applications_open',
    '2026-08-15 00:00:00+00',
    '2026-11-01 23:59:59+00',
    '2026-11-15 00:00:00+00',
    '2027-01-15 23:59:59+00',
    4,
    6
  )
on conflict (number) do nothing;

-- Seed Users (Triggers will create public.profiles)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alice@example.com', 'password123', now(), '{"full_name":"Alice Smith"}'),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'bob@example.com', 'password123', now(), '{"full_name":"Bob Jones"}'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'charlie@example.com', 'password123', now(), '{"full_name":"Charlie Brown"}'),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dave@example.com', 'password123', now(), '{"full_name":"Dave Williams"}'),
  ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'eve@example.com', 'password123', now(), '{"full_name":"Eve Davis"}')
ON CONFLICT (id) DO NOTHING;

-- Seed Applications
INSERT INTO public.applications (id, applicant_id, voyage_id, status, experience, preferred_role, weekly_hours, timezone, motivation, submitted_at, decided_at, decided_by)
VALUES
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', (SELECT id FROM public.voyages WHERE number = 1), 'accepted', 'beginner', 'frontend', 20, 'UTC', 'I want to learn frontend.', now(), now(), '11111111-1111-1111-1111-111111111111'),
  ('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', (SELECT id FROM public.voyages WHERE number = 1), 'accepted', 'intermediate', 'backend', 20, 'UTC', 'I want to build APIs.', now(), now(), '11111111-1111-1111-1111-111111111111'),
  ('a3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', (SELECT id FROM public.voyages WHERE number = 1), 'accepted', 'advanced', 'fullstack', 40, 'UTC', 'I want to build full stack apps.', now(), now(), '11111111-1111-1111-1111-111111111111'),
  ('a4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', (SELECT id FROM public.voyages WHERE number = 1), 'accepted', 'beginner', 'design', 20, 'UTC', 'I want to design UIs.', now(), now(), '11111111-1111-1111-1111-111111111111'),
  ('a5555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', (SELECT id FROM public.voyages WHERE number = 1), 'accepted', 'intermediate', 'frontend', 20, 'UTC', 'I want to learn React.', now(), now(), '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- Seed Enrollments
INSERT INTO public.enrollments (id, account_id, application_id, voyage_id, participant_role, experience, status, timezone, weekly_hours)
VALUES
  ('e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', (SELECT id FROM public.voyages WHERE number = 1), 'frontend', 'beginner', 'active', 'UTC', 20),
  ('e2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', (SELECT id FROM public.voyages WHERE number = 1), 'backend', 'intermediate', 'active', 'UTC', 20),
  ('e3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', (SELECT id FROM public.voyages WHERE number = 1), 'fullstack', 'advanced', 'active', 'UTC', 40),
  ('e4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', (SELECT id FROM public.voyages WHERE number = 1), 'design', 'beginner', 'active', 'UTC', 20),
  ('e5555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555555', (SELECT id FROM public.voyages WHERE number = 1), 'frontend', 'intermediate', 'active', 'UTC', 20)
ON CONFLICT (id) DO NOTHING;

