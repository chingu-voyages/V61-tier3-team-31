-- Allow authenticated users to add custom skills from their own profile editor.
--
-- Users can only create active custom catalog entries. They still cannot update
-- or delete global skill rows.

create policy skills_insert_custom_authenticated
on public.skills for insert to authenticated
with check (active = true and custom = true);

grant insert on public.skills to authenticated;
