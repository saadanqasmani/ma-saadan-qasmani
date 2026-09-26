-- Every word on the site, editable.
--
-- The site's words live in src/content: the English dictionary, five
-- translations of it, and the records for the person and the book. That is
-- the right home for them — they are versioned, reviewed and deployed — but
-- it means changing a line means a deploy, and the person whose words they
-- are cannot change his own.
--
-- So this holds overrides and nothing else. A row is one string, named by
-- its path through the dictionary, for one language. At render the files are
-- read as they always were and these are merged on top, which means an empty
-- table changes nothing and deleting a row restores what was written in the
-- repository. There is no state here that the site depends on.

create table if not exists site_text (
  -- Dotted path through the dictionary, e.g. novel.purchase.total
  path text not null,
  locale text not null,
  -- A language the site has, or '*' for a value that has no language: a
  -- photograph is the same photograph in Urdu, so it is filed once and read
  -- beneath every language.
  value text not null,
  updated_at timestamptz not null default now(),
  primary key (path, locale)
);

alter table site_text enable row level security;

-- Read by the server with the service role, written only from the dashboard
-- behind the admin's own session. No public policy, on purpose.

comment on table site_text is
  'Overrides for src/content. Empty means the files win; deleting a row restores the file.';
