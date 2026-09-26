-- Three places, three currencies.
--
-- The book is now taken in advance for Pakistan in rupees, for Türkiye in
-- lira with postage on top, and everywhere else through Amazon — plus the
-- readers Amazon does not reach, who ask to be sent one and are quoted by
-- hand afterwards. An order therefore has to say which of those it is, and
-- in what money, because "15" meant one thing when there was one price and
-- means nothing now.
--
-- Still no card, bank or billing detail anywhere in this database. Where a
-- card is taken it is taken on the provider's own page.

alter table public.book_orders
  add column if not exists region text not null default 'pk',
  add column if not exists currency text not null default 'USD',
  add column if not exists shipping_amount numeric(10, 2) default 0;

-- The country check predates Pakistan-and-Türkiye-only ordering: a reader
-- Amazon cannot reach writes in from anywhere, so the constraint goes and
-- `region` carries the meaning it used to.
alter table public.book_orders drop constraint if exists book_orders_country_check;

create index if not exists book_orders_region_idx on public.book_orders (region);

comment on column public.book_orders.region is
  'pk | tr | world. "world" is a print-to-order request with no price agreed yet.';
comment on column public.book_orders.currency is
  'The money the totals on this row are in. PKR, TRY or USD.';
