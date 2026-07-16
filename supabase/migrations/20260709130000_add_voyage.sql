-- Seed the first voyage for the Chingu platform.
-- Idempotent via unique constraint on `number`.
-- Application window is intentionally wide to let new accounts land
-- on a live voyage without time pressure during early development.

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
  'Course 1',
  'First cohort of the platform. Building cross-functional product teams to ship MVP web apps.',
  'applications_open',
  now(),
  '2026-12-31 23:59:59+00',
  '2027-01-15 00:00:00+00',
  '2027-03-15 00:00:00+00',
  4,
  6
)
on conflict (number) do nothing;