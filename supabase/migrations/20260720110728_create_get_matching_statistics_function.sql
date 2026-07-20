CREATE OR REPLACE FUNCTION public.get_matching_statistics()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  v_voyage_id uuid;
BEGIN

  SELECT id
  INTO v_voyage_id
  FROM public.voyages
  ORDER BY number DESC
  LIMIT 1;


  RETURN (
    SELECT jsonb_build_object(

      'total',
      count(*),

      'remaining',
      count(*) FILTER (
        WHERE NOT EXISTS (
          SELECT 1
          FROM public.team_memberships tm
          JOIN public.teams t
            ON t.id = tm.team_id
          WHERE tm.enrollment_id = e.id
          AND tm.left_at IS NULL
          AND t.status = 'completed'
        )
      ),

      'unassigned',
      count(*) FILTER (
        WHERE NOT EXISTS (
          SELECT 1
          FROM public.team_memberships tm
          WHERE tm.enrollment_id = e.id
          AND tm.left_at IS NULL
        )
      ),

      'partial_matches',
      count(*) FILTER (
        WHERE EXISTS (
          SELECT 1
          FROM public.team_memberships tm
          JOIN public.teams t
            ON t.id = tm.team_id
          WHERE tm.enrollment_id = e.id
          AND tm.left_at IS NULL
          AND t.status = 'forming'
        )
      ),

      'matched',
      count(*) FILTER (
        WHERE EXISTS (
          SELECT 1
          FROM public.team_memberships tm
          JOIN public.teams t
            ON t.id = tm.team_id
          WHERE tm.enrollment_id = e.id
          AND tm.left_at IS NULL
          AND t.status = 'completed'
        )
      )
    )

    FROM public.enrollments e
    WHERE e.voyage_id = v_voyage_id
  );


END;
$$;