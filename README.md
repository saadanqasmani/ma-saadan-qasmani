# Saadan Qasmani — The Official Digital Estate

The personal site of Saadan Qasmani: writer, researcher, and strategist. Home of the research
archive, journal, publications, and the flagship novel *The Highest Branch*.

## Stack

- **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**
- **Motion** (Framer Motion successor) for scroll-triggered reveals, respecting
  `prefers-reduced-motion`
- **Supabase** (Postgres + Auth + Storage) as the single backend — see
  `supabase/migrations/0001_init.sql` for the schema
- **React Hook Form + Zod** for all forms

## Content architecture

`src/content/site.ts` is the current, hand-authored content layer (bio, work, research,
publications, blog, book). It mirrors the Supabase schema field-for-field, so migrating each
content type to the admin-editable database is a data move, not a rebuild. Every placeholder
value is explicitly labeled `PLACEHOLDER` — nothing about Saadan's background, research, or the
novel has been invented.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase credentials once a project exists
npm run dev
```

The site is fully browsable without a Supabase project attached. Forms (newsletter, contact,
research access requests, direct book orders) will return a clear "not connected yet" message
until `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set.

## Backend setup (when ready)

1. Create a Supabase project.
2. Run `supabase/migrations/0001_init.sql` against it (via the Supabase SQL editor or CLI).
3. Set `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` (server-side) and
   `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for the future admin login).
4. Add your email to the `admins` table once you've signed up via Supabase Auth, to unlock
   `/admin`.

## Roadmap

Still to build: admin dashboard (content management, order/request review, subscriber
management), live Supabase wiring for all forms, appointment booking integration, and the
Amazon purchase link for *The Highest Branch* once available.
