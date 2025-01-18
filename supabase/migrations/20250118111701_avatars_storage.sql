insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO NOTHING;  

drop policy if exists "user uploads avatars" on storage.objects;

create policy "user uploads avatars"
on storage.objects for all to authenticated using (
    bucket_id = 'avatars'
);
