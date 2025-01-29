create table votes (
    id bigint generated always as identity primary key,
    user_id UUID default auth.uid() not null references public.profiles(id) on delete cascade,
    session_id UUID not null references public.sessions(id) on delete cascade,
    choice_id UUID not null references public.choices(id) on delete cascade,
    voting_id UUID not null references public.votings(id) on delete cascade,
    created_at timestamp with time zone default now() not null
);

alter table votes enable row level security;

CREATE OR REPLACE FUNCTION prevent_duplicate_votes()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the session has not started yet
  IF CURRENT_TIMESTAMP < (SELECT session_start_at FROM sessions WHERE id = NEW.session_id) THEN
    RAISE EXCEPTION 'Session has not started yet.';
  END IF;

  -- Check if the session has already ended
  IF CURRENT_TIMESTAMP > (SELECT session_end_at FROM sessions WHERE id = NEW.session_id) THEN
    RAISE EXCEPTION 'Session has already ended.';
  END IF;

  -- Check for duplicate votes
  IF EXISTS (
    SELECT 1
    FROM votes
    WHERE session_id = NEW.session_id
      AND user_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'You have already voted in this session.';
  END IF;

  -- Check if participant
  IF NOT EXISTS (
    SELECT 1
    FROM voters
    WHERE user_id = (select auth.uid()) AND voting_id = NEW.voting_id
  ) THEN
    RAISE EXCEPTION 'You are not a participant in this voting.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_duplicate_voters_trigger
BEFORE INSERT ON votes
FOR EACH ROW
EXECUTE FUNCTION prevent_duplicate_votes();

create policy "Select"
on votes for select
to authenticated
using (
    -- Owner
    (
        voting_id in (
            select id
            from votings
            where user_id = (select auth.uid())
        )
    ) or 
    -- Participants
    (
        voting_id in (
            select voting_id
            from voters
            where user_id = (select auth.uid())
        )
    )
);

create policy "Insert"
on votes for insert
to authenticated
with check (
    true
);