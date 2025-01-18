create type voting_type as enum (
  'voting',
  'nomination'
);


create table votings (
    id uuid DEFAULT gen_random_uuid() not null primary key,
    user_id UUID not null references auth.users(id) on delete cascade,
    name text not null,
    description text,
    voting_id text not null unique,
    type voting_type,
    created_at timestamp with time zone default now() NOT NULL
);

alter table votings enable row level security;

create policy "all accesses based on user_id."
on votings for all
using ( (select auth.uid()) = user_id );
