# Happy Hounds Activity Centre

Public website and (eventually) booking system for Happy Hounds Activity
Centre, an indoor dog activity centre in Wrexham, LL12.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Lint | ESLint (`eslint-config-next`) |
| CI | GitHub Actions — lint + build on every push/PR (`.github/workflows/ci.yml`) |
| Hosting | Vercel (Hobby/free tier to start) |
| Future: database | Postgres (Vercel Postgres or Supabase) once the booking system needs persistence |
| Future: payments | Stripe, sandbox/test keys until the CEO confirms going live |

### Why this stack (ADR-style)

**Decision:** Next.js + TypeScript + Tailwind, deployed to Vercel.

**Why:**
- A small local business site needs a marketing site today and a booking
  system with server-side logic soon after. Next.js covers both with one
  framework (static pages now, API routes / server actions later) instead of
  bolting a separate backend onto a static site.
- It's boring in the best sense: huge install base, long-term support,
  extensive docs, and most engineers can pick it up without ramp-up time.
- Vercel is the zero-config deploy target for Next.js: push to `main`,
  get a production deploy; push a PR, get a preview URL. No servers to
  patch or scale for a single small-business site. Free Hobby tier covers
  this scale; cheap to upgrade if traffic grows.
- TypeScript and Tailwind are the default, well-documented pairing for
  Next.js and keep the codebase consistent without inventing conventions.

**Alternatives considered:**
- Plain static HTML/CSS — simpler today, but would mean a second stack once
  booking/payments need a backend. Rejected: YAGNI cuts both ways, and the
  booking system is explicitly on the roadmap, not hypothetical.
- A heavier backend framework (e.g. Django/Rails) with a separate frontend —
  more moving parts and hosting cost than this business needs.

## Project status

This is the initial skeleton: a placeholder homepage with the business name,
a one-line description, and stubs for services/location/hours. No booking
system or payments yet — those are tracked as separate pieces of work.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint   # ESLint
npm run build  # production build (also run in CI)
```

## Deploying

The repo is wired for Vercel's standard GitHub integration:

1. Push this repo to a GitHub repository under the business's account/org.
2. In Vercel, "Add New Project" → import the GitHub repo → defaults are
   correct for Next.js (no build settings to change).
3. Every push to `main` deploys to production; every PR gets a preview URL.

**Status:** the codebase is deploy-ready (builds and lints clean), but no
GitHub repository or Vercel account has been created yet for this project —
that requires account/billing ownership decisions, so it's tracked as a
follow-up rather than done silently by the agent. See the linked issue for
who owns creating those accounts.

## Roadmap (not in this skeleton)

- Real services/pricing/location content (marketing copy is not engineering
  scope — needs CEO/marketing input).
- Online booking/scheduling system (customers book sessions, staff see a
  schedule).
- Payments on top of bookings, sandboxed until explicitly approved to go
  live.
