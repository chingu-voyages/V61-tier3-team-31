-- Support syncing reusable profile data from voyage applications.
--
-- Profiles store the user's current reusable information, while applications
-- keep an immutable snapshot per voyage. This migration adds a reusable
-- preferred role to profiles and enables users to manage their own current
-- profile skills through RLS.

alter table public.profiles
  add column if not exists preferred_role public.participant_role;

create policy profile_skills_select_own_or_staff
on public.profile_skills for select to authenticated
using (profile_id = (select auth.uid()) or (select private.is_staff()));

create policy profile_skills_insert_own
on public.profile_skills for insert to authenticated
with check (profile_id = (select auth.uid()));

create policy profile_skills_delete_own
on public.profile_skills for delete to authenticated
using (profile_id = (select auth.uid()));

grant select, insert, delete on public.profile_skills to authenticated;
