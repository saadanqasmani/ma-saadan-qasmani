-- The workroom's store.
--
-- One generic table rather than four typed ones, because the thing it holds
-- is a handful of small documents edited by two people, and what matters is
-- that each document saves on its own. Two people editing different tasks
-- must never overwrite each other, and a single JSON blob for everything
-- would do exactly that.
--
-- Read and written only through /api/ops with the service role, behind the
-- same cookie that guards the pages. No public policy on purpose.

create table if not exists ops_docs (
  collection text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (collection, id)
);

alter table ops_docs enable row level security;

-- Private bucket for what the two of them hand each other: finished work
-- going one way, reading material the other. Never public; every read is a
-- short-lived signed URL minted behind the same cookie.
insert into storage.buckets (id, name, public)
values ('ops', 'ops', false)
on conflict (id) do nothing;
