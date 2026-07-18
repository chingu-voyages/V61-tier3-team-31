create policy "Allow viewing avatars"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'avatars'
);