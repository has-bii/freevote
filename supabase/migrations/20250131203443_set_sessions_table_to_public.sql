DROP POLICY IF EXISTS "Select access for participants" on public.sessions;

create policy "Select access for participants"
on sessions
for select
to authenticated
using (
    true
);