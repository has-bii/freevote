CREATE OR REPLACE FUNCTION check_participant(id UUID)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the user is either a participant or the owner
  IF NOT EXISTS (
    SELECT 1
    FROM voters v
    WHERE v.user_id = (SELECT auth.uid()) AND v.voting_id = check_participant.id
  ) AND NOT EXISTS (
    SELECT 1
    FROM votings vt
    WHERE vt.user_id = (SELECT auth.uid()) AND vt.id = check_participant.id
  ) THEN
    RAISE EXCEPTION 'You are neither a participant nor the owner of this voting.';
  END IF;

  RETURN TRUE;
END;
$$;

DROP POLICY IF EXISTS "Select access for participants" on public.sessions;

create policy "Select access for participants"
on sessions
for select
to authenticated
using (
    check_participant(voting_id)
);