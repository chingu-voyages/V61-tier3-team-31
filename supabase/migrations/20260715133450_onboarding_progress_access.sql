-- Give enrolled participants access to their voyage onboarding checklist and
-- support creating progress records on the first completion toggle.

create or replace function private.add_standard_onboarding_steps(target_voyage_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.onboarding_steps (
    voyage_id,
    title,
    description,
    position,
    required,
    active
  )
  values
    (
      target_voyage_id,
      'Complete your profile',
      'Review your profile details and keep them up to date for your voyage.',
      1,
      true,
      true
    ),
    (
      target_voyage_id,
      'Read the Voyage Guide and Code of Conduct',
      'Understand how the voyage works and the standards that keep the community welcoming.',
      2,
      true,
      true
    ),
    (
      target_voyage_id,
      'Confirm your weekly availability',
      'Confirm that your availability still matches the commitment you made in your application.',
      3,
      true,
      true
    ),
    (
      target_voyage_id,
      'Join the team communication channel',
      'Join the voyage communication channel so you can receive updates and collaborate.',
      4,
      true,
      true
    )
  on conflict (voyage_id, position) do nothing;
end;
$$;

revoke all on function private.add_standard_onboarding_steps(uuid) from public;

create or replace function private.provision_standard_onboarding_steps()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.add_standard_onboarding_steps(new.id);
  return new;
end;
$$;

revoke all on function private.provision_standard_onboarding_steps() from public;

drop trigger if exists voyages_provision_standard_onboarding_steps on public.voyages;

create trigger voyages_provision_standard_onboarding_steps
after insert on public.voyages
for each row execute function private.provision_standard_onboarding_steps();

create policy onboarding_steps_select_enrolled_or_staff
on public.onboarding_steps for select to authenticated
using (
  (select private.is_staff())
  or (
    active
    and exists (
      select 1
      from public.enrollments enrollment
      where enrollment.voyage_id = onboarding_steps.voyage_id
        and enrollment.account_id = (select auth.uid())
        and enrollment.status in ('invited', 'active')
    )
  )
);

create policy onboarding_progress_insert_own_or_staff
on public.onboarding_progress for insert to authenticated
with check (
  (select private.is_staff())
  or (
    (select private.owns_enrollment(enrollment_id))
    and exists (
      select 1
      from public.enrollments enrollment
      join public.onboarding_steps step on step.id = onboarding_progress.step_id
      where enrollment.id = onboarding_progress.enrollment_id
        and enrollment.voyage_id = step.voyage_id
        and enrollment.status in ('invited', 'active')
        and step.active
    )
  )
);

drop policy if exists onboarding_progress_update_own_or_staff on public.onboarding_progress;

create policy onboarding_progress_update_own_or_staff
on public.onboarding_progress for update to authenticated
using (
  (select private.is_staff())
  or (
    (select private.owns_enrollment(enrollment_id))
    and exists (
      select 1
      from public.enrollments enrollment
      join public.onboarding_steps step on step.id = onboarding_progress.step_id
      where enrollment.id = onboarding_progress.enrollment_id
        and enrollment.voyage_id = step.voyage_id
        and enrollment.status in ('invited', 'active')
        and step.active
    )
  )
)
with check (
  (select private.is_staff())
  or (
    (select private.owns_enrollment(enrollment_id))
    and exists (
      select 1
      from public.enrollments enrollment
      join public.onboarding_steps step on step.id = onboarding_progress.step_id
      where enrollment.id = onboarding_progress.enrollment_id
        and enrollment.voyage_id = step.voyage_id
        and enrollment.status in ('invited', 'active')
        and step.active
    )
  )
);

grant select on public.onboarding_steps to authenticated;
grant select, insert, update on public.onboarding_progress to authenticated;
