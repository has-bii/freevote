select cron.unschedule('end expired voting sessions');

alter table votings drop column is_start;
alter table votings drop column expired_session;