-- Initial schema for the Saadan Qasmani site.
-- Public content tables are readable by anon; all writes go through the
-- service role (server-side API routes / admin dashboard only).

create extension if not exists "pgcrypto";

-- ============================================================
-- Admins — allowlist of auth.users emails permitted into /admin
-- ============================================================
create table if not exists admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Work archive
-- ============================================================
create table if not exists work_items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  summary text not null,
  body text,
  date date,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Research archive
-- ============================================================
create table if not exists research_items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  abstract text not null,
  date text,
  area text,
  keywords text[] default '{}',
  type text,
  co_authors text[] default '{}',
  institution text,
  citation text,
  doi_or_link text,
  pdf_path text,
  access text not null default 'restricted' check (access in ('open', 'restricted')),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists research_access_requests (
  id uuid primary key default gen_random_uuid(),
  research_item_id uuid references research_items (id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  institution text not null,
  position text,
  country text not null,
  reason text not null,
  message text,
  status text not null default 'new'
    check (status in ('new', 'under_review', 'approved', 'declined', 'sent', 'archived')),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Publications archive
-- ============================================================
create table if not exists publications (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  kind text not null, -- book | article | essay | research_paper | other
  summary text,
  date date,
  external_link text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- The Highest Branch — singleton book record + settings
-- ============================================================
create table if not exists book_settings (
  id boolean primary key default true check (id),
  title text not null default 'The Highest Branch',
  synopsis text,
  cover_image_path text,
  amazon_url text,
  direct_order_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into book_settings (id) values (true) on conflict (id) do nothing;

create table if not exists book_orders (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  country text not null check (country in ('Türkiye', 'Pakistan')),
  city text not null,
  shipping_address text not null,
  quantity integer not null default 1 check (quantity > 0),
  message text,
  status text not null default 'new'
    check (status in (
      'new', 'reviewing', 'payment_instructions_sent', 'payment_received',
      'preparing_shipment', 'shipped', 'completed', 'cancelled'
    )),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Journal / Blog
-- ============================================================
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  cover_image_path text,
  category text,
  tags text[] default '{}',
  reading_time text,
  excerpt text,
  body text not null,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Newsletter
-- ============================================================
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- Contact
-- ============================================================
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  internal_notes text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table work_items enable row level security;
alter table research_items enable row level security;
alter table research_access_requests enable row level security;
alter table publications enable row level security;
alter table book_settings enable row level security;
alter table book_orders enable row level security;
alter table blog_posts enable row level security;
alter table subscribers enable row level security;
alter table contact_messages enable row level security;
alter table admins enable row level security;

-- Public read access to published content only.
-- Each policy is dropped first so this file can be re-run safely: CREATE
-- POLICY has no IF NOT EXISTS form, unlike CREATE TABLE.
drop policy if exists "public read published work" on work_items;
create policy "public read published work" on work_items
  for select using (published = true);
drop policy if exists "public read published research" on research_items;
create policy "public read published research" on research_items
  for select using (published = true);
drop policy if exists "public read published publications" on publications;
create policy "public read published publications" on publications
  for select using (published = true);
drop policy if exists "public read book settings" on book_settings;
create policy "public read book settings" on book_settings
  for select using (true);
drop policy if exists "public read published posts" on blog_posts;
create policy "public read published posts" on blog_posts
  for select using (published = true);

-- All writes (including form submissions) go through the service role key
-- in server-side API routes, which bypasses RLS — no public write policies
-- are defined here on purpose.
