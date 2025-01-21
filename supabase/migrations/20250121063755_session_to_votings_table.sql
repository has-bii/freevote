alter table votings add column is_start boolean default false not null;
alter table votings add column expired_session timestamp with time zone;

create extension pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

CREATE OR REPLACE FUNCTION end_expired_voting_sessions()
RETURNS VOID
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    UPDATE public.votings
    SET is_start = FALSE, expired_session = NULL
    WHERE expired_session <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Cron Job name cannot be edited
select cron.schedule('end expired voting sessions', '*/1 * * * *', 'select end_expired_voting_sessions()');
