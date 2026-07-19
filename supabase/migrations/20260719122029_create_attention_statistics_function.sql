create or replace function public.get_attention_statistics()
returns jsonb
language plpgsql
stable
security definer
set search_path to 'public', 'pg_temp'
as $$
declare
  v_staff_id uuid := auth.uid();
  v_voyage_id uuid;
begin

  if v_staff_id is null then
    raise exception 'Authentication required.'
    using errcode = '28000';
  end if;

  if not private.is_staff() then
    raise exception 'Only staff can view attention statistics.'
    using errcode = '42501';
  end if;


  select id
  into v_voyage_id
  from public.voyages
  order by number desc
  limit 1;


  return (
    select jsonb_build_object(

      'old_applications',
      (
        select count(*)
        from public.applications a
        where a.voyage_id = v_voyage_id
          and a.status not in ('accepted','rejected')
          and a.created_at < now() - interval '7 days'
      ),


      'accepted_without_team',
      (
        select count(*)
        from public.applications a
        where a.voyage_id = v_voyage_id
          and a.status = 'accepted'
          and not exists (
            select 1
            from public.enrollments e
            join public.team_memberships tm
              on tm.enrollment_id = e.id
            where e.application_id = a.id
          )
      ),


      'teams_missing_role',
      (
        select count(*)
        from public.teams t
        where t.voyage_id = v_voyage_id
          and (
            not exists (
              select 1
              from public.team_memberships tm
              where tm.team_id = t.id
              and tm.team_role = 'frontend'
            )
            or not exists (
              select 1
              from public.team_memberships tm
              where tm.team_id = t.id
              and tm.team_role = 'backend'
            )
          )
      ),


      'onboarding_incomplete',
      (
        select count(*)
        from public.enrollments e
        where e.voyage_id = v_voyage_id
          and e.status != 'completed'
      )

    )
  );

end;
$function$;