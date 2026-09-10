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
2. In the SQL editor, run every file in `supabase/migrations` in order. They are written
   to be safely re-runnable, so running one twice is harmless.
3. Set these environment variables in your hosting provider, then redeploy:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (bypasses every security rule; never expose it)
   - `ADMIN_EMAILS` (comma-separated list of addresses allowed in)

   None of these takes a `NEXT_PUBLIC_` prefix. Every reader of them runs on the
   server, so nothing here needs to reach a browser, and Vercel will warn you if
   you add the prefix anyway. The prefixed spellings are still accepted for a
   project already configured that way.
4. Visit `/admin/login`, enter an address from `ADMIN_EMAILS` and a password of at least eight
   characters. On first use this creates the account and signs you in; afterwards it is simply
   your login.

Authentication alone is never authorisation. An account gets in only if its email is in
`ADMIN_EMAILS` or its id is in the `admins` table, so a stranger signing up through Supabase
gets nothing. The first-run account creation is gated by the same list and only fires when no
account exists, so it can neither overwrite nor guess an existing password.

If you would rather manage admins in the database, the `admins` table still works:

```sql
insert into admins (user_id, email)
select id, email from auth.users where email = 'you@example.com';
```

### How content resolves

Public pages read from the database and fall back to `src/content/site.ts` whenever a value is
missing, blank, or the database is unreachable. The site therefore renders exactly as it does
today with no backend attached, and each field starts coming from the dashboard the moment you
fill it in. Saving anything refreshes the affected public pages within seconds.

## Search visibility

- `src/app/sitemap.ts` and `src/app/robots.ts` generate `/sitemap.xml` and `/robots.txt`. Both
  build their URLs from `NEXT_PUBLIC_SITE_URL`, so that variable must name the real domain or
  Search Console will reject the sitemap as off-property.
- `src/lib/seo/jsonLd.ts` emits schema.org `Person`, `WebSite` and `Book` structured data. Every
  field is derived from existing content; anything unknown is omitted rather than guessed, since
  structured data that contradicts the page is worse than none.
- `profiles` in `src/content/site.ts` is the `sameAs` list: the verified URLs of the same person
  elsewhere (LinkedIn, ORCID, Google Scholar, ResearchGate). This is what connects a new domain to
  an established identity, and is the highest-value field here. It is empty until real URLs are
  confirmed.
- `src/app/opengraph-image.tsx` renders the 1200x630 share card. It fetches the display face and
  falls back to the built-in font on any failure, so a font outage cannot fail a deployment.
- `src/app/icon.svg` is the tab icon. `public/google*.html` is Google's ownership proof and must
  stay reachable for as long as the Search Console property exists.

## Roadmap

Still open: connecting an email provider so the newsletter can actually send, appointment
booking, and the Amazon link for *The Highest Branch* once the book is listed.
