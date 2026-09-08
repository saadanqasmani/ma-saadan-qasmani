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

## The admin dashboard

`/admin` is a private dashboard for running the site without touching code:

- **Site text** — name, positioning line, biography, practice note, portrait, roles, things
  founded, recognition.
- **The novel** — title, synopsis, subject, chapter and word counts, publication status, cover,
  and the Amazon link.
- **Research, Work, Publications, Journal** — full add, edit, reorder, publish and delete, with
  drafts that stay invisible until you tick "Show on the site".
- **Inbox** — book orders, research access requests, contact messages and subscribers. Each one
  expands in place, carries a status workflow and private notes, and offers a reply-by-email
  link. Subscribers export to CSV.
- **Files** — upload images and PDFs. Images go to a public bucket so they can appear on the
  site; PDFs go to a private bucket with no public URL, so a restricted paper can only ever be
  sent by hand.

Nothing is sent to anyone automatically. Orders and access requests wait for you to act.

### Switching it on

1. Create a Supabase project at supabase.com.
2. In the SQL editor, run `supabase/migrations/0001_init.sql`, then `0002_admin.sql`.
3. Set these environment variables in your hosting provider:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-side only, never expose it to the browser)
4. In Supabase, go to Authentication and create a user with your email and a password.
5. In the SQL editor, add that user to the allowlist:
   ```sql
   insert into admins (user_id, email)
   select id, email from auth.users where email = 'you@example.com';
   ```
6. Visit `/admin/login` and sign in.

Being signed in is not sufficient on its own: the account must also appear in `admins`. Anyone
who signs up through Supabase without being on that list is treated as a stranger.

### How content resolves

Public pages read from the database and fall back to `src/content/site.ts` whenever a value is
missing, blank, or the database is unreachable. The site therefore renders exactly as it does
today with no backend attached, and each field starts coming from the dashboard the moment you
fill it in. Saving anything refreshes the affected public pages within seconds.

## Roadmap

Still open: connecting an email provider so the newsletter can actually send, appointment
booking, and the Amazon link for *The Highest Branch* once the book is listed.
