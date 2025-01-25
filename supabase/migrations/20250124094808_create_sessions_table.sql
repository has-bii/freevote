create table sessions (
    id UUID default gen_random_uuid() not null primary key,
    voting_id UUID not null references public.votings(id) on delete cascade,
    name text not null,
    description text,
    choices UUID array default ARRAY[]::UUID[] not null,
    session_start_at timestamp with time zone not null,
    session_end_at timestamp with time zone not null,
    created_at timestamp with time zone default now() not null
);

alter table sessions enable row level security;

create policy "Select access for participants"
on sessions
for select
to authenticated
using (
    voting_id in (
        select voting_id
        from voters
        where user_id = (select auth.uid())
    )
);

create policy "All access for owner"
on sessions
for all
to authenticated
using (
    voting_id in (
        select id
        from votings
        where user_id = (select auth.uid())
    )
);