-- Work and publication dates are editorial, not calendar values.
--
-- These columns were `date`, but the dashboard offers free text and the site
-- prints it verbatim: entries read "2024", "2022–2024", or "In progress".
-- Postgres rejects those, so saving a work entry failed with
-- "invalid input syntax for type date". Text is the honest type here.
--
-- blog_posts.published_at stays a timestamp: it is a real publication moment
-- and the journal is ordered by it.

alter table work_items
  alter column date type text using date::text;

alter table publications
  alter column date type text using date::text;
