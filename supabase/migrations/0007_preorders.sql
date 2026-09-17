-- Pre-orders for The Highest Branch.
--
-- The book is now taken in advance for Türkiye and Pakistan, at a price,
-- with a code that takes a tenth off it, and optionally paid for online
-- through Stripe's own hosted page. What is added here is the money side of
-- an order: what was quoted, what was taken off, what is owed, and how far
-- the payment got.
--
-- No card, bank or billing detail is stored, here or anywhere else in this
-- database. Stripe holds all of that; this table keeps a session id so an
-- order can be matched to a payment, and nothing more.

alter table public.book_orders
  add column if not exists unit_price_usd numeric(10, 2),
  add column if not exists quantity_priced integer,
  add column if not exists promo_code text,
  add column if not exists discount_usd numeric(10, 2) default 0,
  add column if not exists total_usd numeric(10, 2),
  -- 'reserved'  : asked for, to be settled by hand
  -- 'awaiting'  : sent to Stripe, not yet confirmed back
  -- 'paid'      : Stripe says the money arrived
  -- 'abandoned' : the reader left the payment page
  add column if not exists payment_status text not null default 'reserved',
  add column if not exists stripe_session_id text,
  add column if not exists paid_at timestamptz;

create unique index if not exists book_orders_stripe_session_idx
  on public.book_orders (stripe_session_id)
  where stripe_session_id is not null;

create index if not exists book_orders_payment_status_idx
  on public.book_orders (payment_status);
