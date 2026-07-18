create or replace function public.get_recent_activity()
returns jsonb
language plpgsql
stable
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_staff_id uuid := auth.uid();
begin

  if v_staff_id is null then
    raise exception 'Authentication required.'
    using errcode = '28000';
  end if;


  if not private.is_staff() then
    raise exception 'Only staff can view activity.'
    using errcode = '42501';
  end if;


  return (
  select jsonb_agg(activity order by created_at desc)
  from (
    select *
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
              when a.status = 'accepted'
                then 'was accepted'
              when a.status = 'rejected'
                then 'was rejected'
              when a.status = 'submitted'
                then 'submitted application'
              else
                'updated application'
            end,
          'created_at', coalesce(a.decided_at, a.created_at)
        ) as activity,

        coalesce(a.decided_at, a.created_at) as created_at

      from public.applications a
      join public.profiles p
        on p.id = a.applicant_id


      union all


      -- Onboarding
      select
        jsonb_build_object(
          'type', 'onboarding_completed',
          'user_id', p.id,
          'user_name', p.full_name,
          'avatar', nullif(p.avatar_path, ''),
          'text', 'completed onboarding',
          'created_at', op.completed_at
        ),

        op.completed_at as created_at

      from public.onboarding_progress op
      join public.profiles p
        on p.id = op.completed_by


--       union all


--      -- Match proposals
-- select
--   jsonb_build_object(
--     'type', 'match_proposal_created',
--     'user_name', mp.proposed_name,
--     'avatar', null,
--     'text', 'received a team proposal',
--     'created_at', mp.created_at
--   ) as activity,

--   mp.created_at as created_at

-- from public.match_proposals mp


    ) all_activity

    order by created_at desc
    limit 10

  ) activity
);

end;
$function$;