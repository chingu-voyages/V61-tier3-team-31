-- Atomic application submission from the apply form.
--
-- This function keeps the write path on the server while letting the caller
-- stay authenticated through Supabase cookies. It inserts the application,
-- links the selected skills, and records the initial status transition in one
-- database-side transaction.

create or replace function public.submit_application(
  p_user_id uuid,
  p_voyage_id uuid,
  p_full_name text,
  p_preferred_role public.participant_role,
  p_experience public.experience_level,
  p_skills text[],
  p_weekly_hours smallint,
  p_timezone text,
  p_motivation text,
  p_bio_snapshot text,
  p_portfolio_url_snapshot text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_application_id uuid;
  v_voyage_id uuid;
  v_current_user_id uuid := auth.uid();
  v_missing_skills text[] := '{}'::text[];
begin
  if v_current_user_id is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  if v_current_user_id <> p_user_id then
    raise exception 'You can only submit your own application.' using errcode = '42501';
  end if;

  if p_voyage_id is null then
    select id
    into v_voyage_id
    from public.voyages
    where status = 'applications_open'
    order by application_deadline nulls last, number asc
    limit 1;
  else
    select id
    into v_voyage_id
    from public.voyages
    where id = p_voyage_id and status = 'applications_open'
    limit 1;
  end if;

  if v_voyage_id is null then
    raise exception 'No open voyage is available right now.' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = p_user_id
  ) then
    raise exception 'Profile not found for the signed-in account.' using errcode = '23503';
  end if;

  update public.profiles
  set full_name = p_full_name,
      updated_at = now()
  where id = p_user_id
    and full_name is distinct from p_full_name;

  with normalized_skills as (
    select distinct trim(skill_name) as skill_name
    from unnest(p_skills) as skill_name
    where nullif(trim(skill_name), '') is not null
  ),
  resolved_skills as (
    select ns.skill_name, s.id as skill_id
    from normalized_skills ns
    join public.skills s
      on lower(s.name) = lower(ns.skill_name)
     and s.active = true
  ),
  missing_skills as (
    select coalesce(array_agg(ns.skill_name order by ns.skill_name), '{}'::text[]) as skill_names
    from normalized_skills ns
    left join resolved_skills rs
      on rs.skill_name = ns.skill_name
    where rs.skill_name is null
  )
  select skill_names
  into v_missing_skills
  from missing_skills;

  if coalesce(array_length(v_missing_skills, 1), 0) > 0 then
    raise exception 'Unknown skills: %', array_to_string(v_missing_skills, ', ')
      using errcode = '22023';
  end if;

  insert into public.applications (
    voyage_id,
    applicant_id,
    status,
    preferred_role,
    experience,
    weekly_hours,
    timezone,
    bio_snapshot,
    motivation,
    portfolio_url_snapshot,
    submitted_at
  ) values (
    v_voyage_id,
    p_user_id,
    'submitted',
    p_preferred_role,
    p_experience,
    p_weekly_hours,
    p_timezone,
    p_bio_snapshot,
    p_motivation,
    nullif(trim(p_portfolio_url_snapshot), ''),
    now()
  )
  returning id into v_application_id;

  insert into public.application_skills (application_id, skill_id)
  select v_application_id, s.id
  from public.skills s
  join (
    select distinct trim(skill_name) as skill_name
    from unnest(p_skills) as skill_name
    where nullif(trim(skill_name), '') is not null
  ) input_skills
    on lower(s.name) = lower(input_skills.skill_name)
  where s.active = true;

  insert into public.application_status_history (
    application_id,
    from_status,
    to_status,
    changed_by,
    note
  ) values (
    v_application_id,
    null,
    'submitted',
    p_user_id,
    'Submitted from the apply form'
  );

  return v_application_id;
end;
$$;

grant execute on function public.submit_application(
  uuid,
  uuid,
  text,
  public.participant_role,
  public.experience_level,
  text[],
  smallint,
  text,
  text,
  text,
  text
) to authenticated;
