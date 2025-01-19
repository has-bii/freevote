create policy "Select joined votes"
on voters for select
to authenticated
using (
    (select auth.uid()) = user_id
);