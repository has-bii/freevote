CREATE OR REPLACE FUNCTION prevent_duplicate_voters()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM voters
    WHERE voting_id = NEW.voting_id
      AND user_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'You have already joined this voting session.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_duplicate_voters_trigger
BEFORE INSERT ON voters
FOR EACH ROW
EXECUTE FUNCTION prevent_duplicate_voters();
