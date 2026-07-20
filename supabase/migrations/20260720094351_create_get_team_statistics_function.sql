create or replace function public.get_team_statistics()
returns jsonb
language plpgsql
stable
security definer
set search_path to 'public', 'pg_temp'
as $$
declare
  v_voyage_id uuid;
begin

  select id
  into v_voyage_id
  from public.voyages
  order by number desc
  limit 1;


  return (
    select jsonb_build_object(

      'total', count(*), 
      'draft_teams', count(*) filter (where t.status = 'forming'),
      'confirmed',  count(*) filter (where t.status = 'completed'),

      'needs_attention', count(*) filter (
        where 
          not exists (
            select 1
            from public.team_memberships tm
            where tm.team_id = t.id
              and tm.team_role = 'product'
              and tm.left_at is null
          )
          or
          not exists (
            select 1
            from public.team_memberships tm
            where tm.team_id = t.id
              and tm.team_role in ('backend', 'fullstack')
              and tm.left_at is null
          )
      )
    )

    from public.teams t
    where t.voyage_id = v_voyage_id
  );

end;
$$;