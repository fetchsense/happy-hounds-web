# Happy Hounds Activity Centre

Public website and online booking system for Happy Hounds Activity Centre,
an indoor dog activity centre in Wrexham, LL12.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) 16 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite via `better-sqlite3` (file at `./data/bookings.db`) |
| Lint | ESLint (`eslint-config-next`) |
| CI | GitHub Actions — lint + build on every push/PR (`.github/workflows/ci.yml`) |
| Hosting | Vercel (Hobby/free tier) — see "Deploying" below |
| Future: database | Neon Postgres (or Turso) once Vercel serverless requires a remote DB |
| Future: payments | Stripe, sandbox/test keys until the CEO confirms going live |

### Why this stack (ADR-style)

**Decision:** Next.js + TypeScript + Tailwind, deployed to Vercel.

**Why:**
- A small local business site needs a marketing site today and a booking
  system with server-side logic. Next.js covers both with one framework
  (static pages now, API routes / server actions for the booking system).
- It's boring in the best sense: huge install base, long-term support,
  extensive docs, and most engineers can pick it up without ramp-up time.
- Vercel is the zero-config deploy target for Next.js: push to `main`,
  get a production deploy; push a PR, get a preview URL. No servers to
  patch or scale for a single small-business site.

**Database (SQLite):**
- `better-sqlite3` is synchronous, zero-config, and runs in the same
  process as Next.js. Perfect for a small local business with tens of
  bookings per day.
- Works on any Node.js server with a persistent filesystem.
- For Vercel serverless (where the filesystem is ephemeral): migrate to
  Neon Postgres or Turso. The DB layer in `lib/db.ts` can be swapped
  without touching any other code.

**Alternatives considered:**
- Plain static HTML/CSS — simple for a marketing site but has no path
  to the booking system. Rejected.
- Managed database (Supabase/Neon) from day one — requires an external
  account setup just to run the booking system locally. SQLite is
  simpler for v1 and easy to migrate.

## Project status

The booking system is built. The site needs to be deployed to Vercel
(see below) before customers can actually book online.

**Marketing pages:** `/`, `/services`, `/pricing`, `/location`
**Booking flow:** `/booking` → `/booking/confirmation/[code]`
**Admin schedule:** `/admin/schedule` (HTTP Basic Auth — set `ADMIN_SECRET`)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The SQLite database is created automatically at `./data/bookings.db` on
first API request. Sessions for the next 6 weeks are seeded on first use.

For admin access in development, set `ADMIN_SECRET` in `.env.local`
(copy `.env.local.example`). Without it, `/admin/*` is open in dev.

```bash
cp .env.local.example .env.local
# Edit .env.local and set ADMIN_SECRET=a-strong-password
```

```bash
npm run lint   # ESLint
npm run build  # production build (also run in CI)
```

## Deploying

**Requires Vercel and ADMIN_SECRET.** GitHub Pages was used for the
initial static skeleton but cannot run the booking system's API routes.
The `.github/workflows/deploy-pages.yml` workflow is now disabled.

### Steps (one-time setup, done by the CEO)

1. **Create a Vercel account** at [vercel.com](https://vercel.com) if
   you don't have one.
2. **Import the repo:** In Vercel, "Add New Project" → import
   `fetchsense/happy-hounds-web`. Accept the defaults (Next.js is
   auto-detected, no extra build settings needed).
3. **Set env vars** in the Vercel project settings:
   - `ADMIN_SECRET` — a strong, random password for `/admin/*` access
     (e.g. `openssl rand -hex 20`). Without this, admin routes are
     blocked in production.
4. **Deploy:** Vercel auto-deploys every push to `main`.

### Database in production

The default deployment uses SQLite (`./data/bookings.db`). This works on
a long-running Vercel serverful deployment but **not on Vercel's default
serverless functions**, which have an ephemeral filesystem.

For Vercel serverless (the default), replace `lib/db.ts` with a Neon
Postgres or Turso client before going live. This is a straightforward
swap — the `getDb()` function is the only place to change.

### Post-deploy checklist

- [ ] Visit `/booking` and complete a test booking end-to-end
- [ ] Visit `/admin/schedule` — authenticate with `ADMIN_SECRET`, verify
  the test booking appears
- [ ] Cancel the test booking (email staff)
- [ ] Update this README with the live URL

## Roadmap

- **HAPA-5:** Payments via Stripe (sandbox/test until CEO confirms go-live)
- **DB migration:** Swap SQLite for Neon/Turso when deploying serverless
- **Email confirmations:** Send booking confirmation to customer email
- **Session management:** Admin UI to add/remove sessions, set capacity
- **Cancellations:** Customer-facing cancellation via confirmation code
