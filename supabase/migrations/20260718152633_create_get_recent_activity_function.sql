create or replace function public.get_recent_activity()
returns jsonb
language plpgsql
stable
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_staff_id uuid := auth.uid();
  v_voyage_id uuid;
begin

  if v_staff_id is null then
    raise exception 'Authentication required.'
    using errcode = '28000';
  end if;

  if not private.is_staff() then
    raise exception 'Only staff can view activity.'
    using errcode = '42501';
  end if;


  select id
  into v_voyage_id
  from public.voyages
  order by created_at desc
  limit 1;


    return (
    select jsonb_agg(activity)
    from (
      select activity
      from (

        -- Applications
        select
          jsonb_build_object(
            'type', 'application_' || a.status,
            'user_id', p.id,
            'user_name', p.full_name,
            'avatar', nullif(p.avatar_path, ''),
            'text',
              case
                when a.status = 'accepted' then 'was accepted'
                when a.status = 'rejected' then 'was rejected'
                when a.status = 'submitted' then 'submitted application'
                else 'updated application'
              end,
            'created_at', coalesce(a.decided_at, a.created_at)
          ) activity,
          coalesce(a.decided_at, a.created_at) created_at

        from public.applications a
        join public.profiles p on p.id = a.applicant_id
        where a.voyage_id = v_voyage_id


        union all


        -- Enrollment
        select
          jsonb_build_object(
            'type', 'enrollment_' || e.status,
            'user_id', p.id,
            'user_name', p.full_name,
            'avatar', nullif(p.avatar_path, ''),
            'text', e.status::text,
            'created_at', e.updated_at
          ) activity,
          e.updated_at created_at

        from public.enrollments e
        join public.profiles p on p.id = e.account_id
        where e.voyage_id = v_voyage_id


      ) all_activity

      order by created_at desc
      limit 10

    ) latest_activity
  );

end;
$function$;