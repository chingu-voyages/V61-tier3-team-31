-- Seed Course 2 and align Course 1 / Course 2 timelines for 2026.
-- Course 1 starts 15 Aug (active); Course 2 starts 15 Nov (applications open).
-- Idempotent via unique constraint on `number`.

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
on conflict (number) do update
set
  name = excluded.name,
  description = excluded.description,
  status = excluded.status,
  applications_open_at = excluded.applications_open_at,
  application_deadline = excluded.application_deadline,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  min_team_size = excluded.min_team_size,
  max_team_size = excluded.max_team_size;

update public.voyages
set
  name = 'Course 1',
  status = 'active',
  applications_open_at = '2026-06-15 00:00:00+00',
  application_deadline = '2026-08-10 23:59:59+00',
  starts_at = '2026-08-15 00:00:00+00',
  ends_at = '2026-10-15 23:59:59+00'
where number = 1;
