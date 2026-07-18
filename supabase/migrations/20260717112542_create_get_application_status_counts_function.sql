create or replace function public.get_application_status_counts()
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
    raise exception 'Only staff can view application statistics.'
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


  return (
    with stats as (
      select
        count(*) as total,
        count(*) filter (where status = 'draft') as draft,
        count(*) filter (where status = 'submitted') as submitted,
        count(*) filter (where status = 'under_review') as under_review,
        count(*) filter (where status = 'accepted') as accepted,
        count(*) filter (where status = 'rejected') as rejected,
        count(*) filter (where status = 'withdrawn') as withdrawn,
        count(*) filter (where status = 'accepted' and decided_at >= now() - interval '24 hours'
        ) as accepted_last_24h
      from public.applications
      where voyage_id = v_voyage_id
    )

    select jsonb_build_object(
      'voyage_id', v_voyage_id,

      'total', total,

      'draft', draft,
      'submitted', submitted,
      'under_review', under_review,
      'accepted', accepted,
      'rejected', rejected,
      'withdrawn', withdrawn,


      'accepted_rate',
        case 
          when total = 0 then 0
          else round((accepted::numeric / total) * 100)
        end,

      'under_review_rate',
        case 
          when total = 0 then 0
          else round((under_review::numeric / total) * 100)
        end,

      'rejected_rate',
        case 
          when total = 0 then 0
          else round((rejected::numeric / total) * 100)
        end,

        'accepted_last_24h',
        accepted_last_24h

    )
    from stats
  );


end;
$function$;