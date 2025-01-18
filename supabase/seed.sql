-- Create profile bucket
insert into storage.buckets
    (id, name, public, file_size_limit, allowed_mime_types)
values
    ('avatars', 'avatars', true, 1048576, {'image/*'});

create policy "user uploads avatars"
on storage.objects for all to authenticated with check (
    bucket_id = 'avatars'
);
