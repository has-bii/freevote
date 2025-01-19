create table voters (
    id bigint generated always as identity primary key,
    user_id UUID not null references public.profiles(id) on delete cascade,
    voting_id UUID not null references votings(id) on delete cascade,
    created_at timestamp with time zone default now() not null
);

alter table voters enable row level security;

create policy "Others join open voting"
on voters for insert
to authenticated
with check (
    (EXISTS (
        SELECT 1
        FROM votings
        WHERE votings.id = voters.voting_id
          AND votings.is_open = true
    ) AND ((select auth.uid()) = user_id))
    OR EXISTS (
        SELECT 1
        FROM votings
        WHERE votings.id = voters.voting_id
          AND votings.user_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Others leave voting"
ON voters
FOR DELETE
TO authenticated
USING (
    -- Condition 1: User can delete their own vote
    (SELECT auth.uid()) = voters.user_id
    -- Condition 2: The owner of the voting can delete anyone's vote
    OR EXISTS (
        SELECT 1
        FROM votings
        WHERE votings.id = voters.voting_id
          AND votings.user_id = (SELECT auth.uid())
    )
);
