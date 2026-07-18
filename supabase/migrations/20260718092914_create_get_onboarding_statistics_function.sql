create or replace function public.get_onboarding_statistics()
returns jsonb
language plpgsql
stable
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_staff_id uuid := auth.uid();
  v_voyage_id uuid;
  v_total_steps int;
begin

  if v_staff_id is null then
    raise exception 'Authentication required.'
    using errcode = '28000';
  end if;

  if not private.is_staff() then
    raise exception 'Only staff can view onboarding statistics.'
    using errcode = '42501';
  end if;


  select id
  into v_voyage_id
  from public.voyages
  where status = 'active'
  order by number desc
  limit 1;


  if v_voyage_id is null then
    raise exception 'No active voyage found.'
    using errcode = 'P0002';
  end if;


  select count(*)
  into v_total_steps
  from public.onboarding_steps
  where voyage_id = v_voyage_id
    and required = true
    and active = true;


  return (
    with participant_progress as (

      select
        a.applicant_id,
        count(op.step_id) filter (
          where op.status = 'completed'
        ) as completed_steps

      from public.applications a

      left join public.onboarding_progress op
        on op.completed_by = a.applicant_id

      where a.voyage_id = v_voyage_id
        and a.status = 'accepted'

      group by a.applicant_id
    )

    select jsonb_build_object(

      'total_participants',
      count(*),

      'completed',
      count(*) filter (
        where completed_steps = v_total_steps
      ),

      'in_progress',
      count(*) filter (
        where completed_steps > 0
        and completed_steps < v_total_steps
      ),

      'not_started',
      count(*) filter (
        where completed_steps = 0
      ),

      'completion_rate',
      case
        when count(*) = 0 then 0
        else round(
          (
            count(*) filter (
              where completed_steps = v_total_steps
            )::numeric
            /
            count(*)::numeric
          ) * 100
        )
      end

    )

    from participant_progress
  );


end;
$function$;