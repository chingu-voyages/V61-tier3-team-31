-- Staff can accept or reject submitted applications atomically.
-- Accept also creates an invited enrollment and ensures the voyage
-- has the standard onboarding checklist available.

create or replace function public.accept_application(
  p_application_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_staff_id uuid := auth.uid();
  v_application public.applications%rowtype;
  v_enrollment_id uuid;
begin
  if v_staff_id is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  if not private.is_staff() then
    raise exception 'Only staff can accept applications.' using errcode = '42501';
  end if;

  select *
  into v_application
  from public.applications
  where id = p_application_id
  for update;

  if not found then
    raise exception 'Application not found.' using errcode = 'P0002';
  end if;

  if v_application.status not in ('submitted', 'under_review') then
    raise exception 'Only submitted or under-review applications can be accepted.' using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.enrollments
    where application_id = v_application.id
  ) then
    raise exception 'This application already has an enrollment.' using errcode = '23505';
  end if;

  update public.applications
  set
    status = 'accepted',
    decided_at = now(),
    decided_by = v_staff_id,
    updated_at = now()
  where id = v_application.id;

  insert into public.application_status_history (
    application_id,
    from_status,
    to_status,
    changed_by,
    note
  )
  values (
    v_application.id,
    v_application.status,
    'accepted',
    v_staff_id,
    'Accepted by staff'
  );

  perform private.add_standard_onboarding_steps(v_application.voyage_id);

  insert into public.enrollments (
    voyage_id,
    account_id,
    application_id,
    status,
    participant_role,
    experience,
    weekly_hours,
    timezone,
    joined_at
  )
  values (
    v_application.voyage_id,
    v_application.applicant_id,
    v_application.id,
    'invited',
    v_application.preferred_role,
    v_application.experience,
    v_application.weekly_hours,
    v_application.timezone,
    now()
  )
  returning id into v_enrollment_id;

  return v_enrollment_id;
end;
$$;

create or replace function public.reject_application(
  p_application_id uuid,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_staff_id uuid := auth.uid();
  v_application public.applications%rowtype;
begin
  if v_staff_id is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  if not private.is_staff() then
    raise exception 'Only staff can reject applications.' using errcode = '42501';
  end if;

  select *
  into v_application
  from public.applications
  where id = p_application_id
  for update;

  if not found then
    raise exception 'Application not found.' using errcode = 'P0002';
  end if;

  if v_application.status not in ('submitted', 'under_review') then
    raise exception 'Only submitted or under-review applications can be rejected.' using errcode = '22023';
  end if;

  update public.applications
  set
    status = 'rejected',
    decided_at = now(),
    decided_by = v_staff_id,
    review_notes = nullif(trim(coalesce(p_note, '')), ''),
    updated_at = now()
  where id = v_application.id;

  insert into public.application_status_history (
    application_id,
    from_status,
    to_status,
    changed_by,
    note
  )
  values (
    v_application.id,
    v_application.status,
    'rejected',
    v_staff_id,
    coalesce(nullif(trim(coalesce(p_note, '')), ''), 'Rejected by staff')
  );
end;
$$;

revoke all on function public.accept_application(uuid) from public;
revoke all on function public.reject_application(uuid, text) from public;
grant execute on function public.accept_application(uuid) to authenticated;
grant execute on function public.reject_application(uuid, text) to authenticated;
