CREATE OR REPLACE FUNCTION delete_votes()
RETURNS "trigger"
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  DELETE FROM public.votes
  WHERE voting_id = OLD.voting_id AND user_id = OLD.user_id;
  
  RETURN NULL;  -- `AFTER DELETE` triggers should return NULL
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER delete_votes_trigger
AFTER DELETE ON public.voters 
FOR EACH ROW 
EXECUTE FUNCTION delete_votes();
