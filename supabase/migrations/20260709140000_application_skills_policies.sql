-- Allow users to manage skills on their own application drafts.
-- Mirrors the existing applications_* policies: the row must be the
-- caller's own application, and the application must be in draft
-- (so updates can happen step-by-step) or submitted (final write).
-- Staff (admin/moderator) bypass via private.is_staff() for review.

create policy application_skills_select_own_or_staff
on public.application_skills for select to authenticated
using (
  exists (
    select 1 from public.applications a
    where a.id = application_skills.application_id
      and (a.applicant_id = (select auth.uid()) or (select private.is_staff()))
  )
);

create policy application_skills_insert_own_draft
on public.application_skills for insert to authenticated
with check (
  exists (
    select 1 from public.applications a
    where a.id = application_skills.application_id
      and a.applicant_id = (select auth.uid())
      and a.status = 'draft'
  )
);

create policy application_skills_delete_own_draft
on public.application_skills for delete to authenticated
using (
  exists (
    select 1 from public.applications a
    where a.id = application_skills.application_id
      and a.applicant_id = (select auth.uid())
      and a.status = 'draft'
  )
);

grant select, insert, delete on public.application_skills to authenticated;