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
| Hosting | GitHub Pages for now (free, zero extra credentials); Vercel (Hobby/free tier) once server-side features are needed |
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

Live at [fetchsense.github.io/happy-hounds-web](https://fetchsense.github.io/happy-hounds-web/).

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

**Live now:** [fetchsense.github.io/happy-hounds-web](https://fetchsense.github.io/happy-hounds-web/)
— deployed via GitHub Pages on every push to `main`
(`.github/workflows/deploy-pages.yml`), using only the repo's built-in
`GITHUB_TOKEN` (no extra secrets). This proves the pipeline end to end for
the current static skeleton.

GitHub Pages only serves static files, so the Pages build runs with
`output: 'export'` and a `/happy-hounds-web` base path
(`GITHUB_PAGES_BUILD=true`, see `next.config.ts`). The default build
(used by CI and any future Vercel deploy) stays a normal server build.

**Planned (once the booking system needs a server):** move to Vercel, per
the original ADR — Vercel is still the better target for API
routes/server actions, and gets PR preview URLs for free. That move needs
a Vercel account/API token, which is a billing decision, not the agent's
to make unilaterally:

1. In Vercel, "Add New Project" → import the GitHub repo (`fetchsense/happy-hounds-web`)
   → defaults are correct for Next.js (no build settings to change).
2. Drop the `GITHUB_PAGES_BUILD` override — Vercel doesn't need it.
3. Every push to `main` deploys to production; every PR gets a preview URL.

## Roadmap (not in this skeleton)

- Real services/pricing/location content (marketing copy is not engineering
  scope — needs CEO/marketing input).
- Online booking/scheduling system (customers book sessions, staff see a
  schedule).
- Payments on top of bookings, sandboxed until explicitly approved to go
  live.
