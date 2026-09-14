-- Every letter sent to the list, on record.
--
-- What went out, to how many, and when. The body is kept so a letter can be
-- read again later exactly as the readers saw it. Written only from the
-- dashboard with the service role; no public policy on purpose.

create table if not exists letters (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  body text not null,
  html text not null,
  post_slug text,
  recipients integer not null default 0,
  failed integer not null default 0,
  sent_by text,
  sent_at timestamptz not null default now()
);

alter table letters enable row level security;
