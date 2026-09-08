-- Admin dashboard support: editable site copy, media, and housekeeping.

-- ============================================================
-- updated_at housekeeping
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'work_items','research_items','research_access_requests','publications',
    'book_settings','book_orders','blog_posts'
  ] loop
    execute format(
      'drop trigger if exists set_updated_at on %I; '
      'create trigger set_updated_at before update on %I '
      'for each row execute function set_updated_at();', t, t);
  end loop;
end $$;

-- ============================================================
-- Site copy — a single editable row behind the public pages
-- ============================================================
create table if not exists site_settings (
  id boolean primary key default true check (id),
  name text not null default 'Saadan Qasmani',
  positioning text not null default 'Writer, Researcher, and Strategist',
  location text not null default 'Istanbul, Türkiye',
  bio text not null default '',
  practitioner_note text not null default '',
  portrait_path text,
  -- [{ "title": "...", "org": "..." }]
  roles jsonb not null default '[]'::jsonb,
  -- [{ "name": "...", "org": "..." }]
  founded jsonb not null default '[]'::jsonb,
  -- [{ "title": "...", "year": "..." }]
  honors jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

insert into site_settings (id) values (true) on conflict (id) do nothing;

drop trigger if exists set_updated_at on site_settings;
create trigger set_updated_at before update on site_settings
  for each row execute function set_updated_at();

-- Columns the dashboard needs that 0001 did not carry
alter table book_settings add column if not exists genre text;
alter table book_settings add column if not exists subject text;
alter table book_settings add column if not exists status text;
alter table book_settings add column if not exists word_count integer;
alter table book_settings add column if not exists chapter_count integer;

alter table research_items add column if not exists sort_order integer not null default 0;
alter table work_items add column if not exists sort_order integer not null default 0;
alter table publications add column if not exists sort_order integer not null default 0;

-- ============================================================
-- Row level security
-- ============================================================
alter table site_settings enable row level security;

drop policy if exists "public read site settings" on site_settings;
create policy "public read site settings" on site_settings
  for select using (true);

-- Writes continue to go through the service role in server actions, which
-- bypasses RLS. No public write policy is defined anywhere on purpose.

-- ============================================================
-- Storage buckets
-- ============================================================
-- `media` is world-readable: portraits, covers, journal images.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- `papers` is private: restricted PDFs are only ever sent by hand after a
-- request is approved, so they must never be publicly addressable.
insert into storage.buckets (id, name, public)
values ('papers', 'papers', false)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
