create table choices (
    id UUID default gen_random_uuid() not null primary key,
    voting_id UUID not null references public.votings(id) on delete cascade,
    name text not null,
    image text,
    link text,
    description text not null,
    color text not null,
    created_at timestamp with time zone default now() not null
);

alter table choices enable row level security;

create policy "public"
on choices
for select
to authenticated
using (true);

create policy "Owner only"
on choices
for all
to authenticated
using (
    exists (
        select 1
        from votings
        where votings.user_id = (select auth.uid())
            and votings.id = choices.voting_id
    )
);

insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  ('choices', 'choices', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO NOTHING;

create policy "owners upload image"
on storage.objects for all to authenticated using (
    bucket_id = 'choices'
);