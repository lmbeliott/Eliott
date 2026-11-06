# SwimHub Connect — v2

> Ce dépôt contient aussi **Kodo**, un site d'entraînement à l'algorithmique (dans le dossier [`kodo/`](kodo/README.md)), publié sur https://lmbeliott.github.io/Eliott/kodo/.

A full rebuild of [swimhub-connect.onrender.com](https://swimhub-connect.onrender.com/): schedules, absences and substitutions for swimming clubs. The interface is in French, like the original.

> « Chaque ligne d'eau a son éducateur. »

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build in dist/
npm run preview    # serve dist/
```

Click **Explorer la démo** on the home page (or the demo buttons on `/connexion`) to open a seeded club. It has two pools, ten groups, eight educators, live absences, pending candidatures and expiring diplomas. The demo bar lets you switch between the manager view (Camille) and the educator view (Léa), or reset the data.

Demo accounts: `camille.martin@demo.swimhub.fr` / `lea.bernard@demo.swimhub.fr`, password `demo1234`.

## What's better than the original

| Area | Original | v2 |
| --- | --- | --- |
| Deep links | `/login`, `/club-choice`… return **Not Found** on reload | SPA rewrite (`render.yaml`, `public/_redirects`), French routes, old URLs redirected |
| Landing | Generic template, emoji icons, static price card | Pool-lane hero animating the substitution flow, 4-step explainer, live feature previews, **interactive price calculator**, FAQ |
| Substitutions | Volunteers see a list | Offered only to educators with the **required diploma, valid on that date**, and **free at that time** (conflict check). Managers see candidates side by side and get a "nobody qualified" warning |
| Planning | Table | Week time-grid (overlap layout, now-line, pool filter, "my sessions") and a phone-friendly day view. Click any session for its detail drawer and actions |
| Dashboard | Menu of tiles | Next sessions, today at the pool, open substitutions for you, KPIs, expiring diplomas, and a setup checklist for new clubs |
| Notifications | — | In-app bell: absences, candidatures, decisions, membership requests |
| Import | `.xlsx` upload | Paste cells straight from Excel/Sheets (or CSV), live preview, per-line error report |
| Exports | CSV | Excel-ready CSV (`;`, decimal comma, UTF-8 BOM) with totals |
| Roles | Basic | Custom roles with 5 granular permissions, guarded in the UI and in the business layer |
| Motion | — | Orchestrated hero (headline rises, pool fills, sessions arrive, then the substitution plays), swimmer travelling the 4 steps, scroll reveals, price and KPI count-ups, sliding tab/segmented/sidebar indicators, page transitions (View Transitions API), drawers and dialogs that animate out. All of it is disabled under `prefers-reduced-motion` |
| Quality | — | Dark mode, keyboard focus and focus traps, 375 px → desktop without horizontal scroll, installable PWA with offline shell |

## Logo

A single-stroke **S**: the path of a swimmer doing lengths (out, turn, back), with the dot as the swimmer. On first load the dot swims the S while the line draws behind it. The mark is in `src/components/Logo.tsx` (theme-aware). The app icon and favicon (`public/favicon.svg`, `public/icon*.png`) use the same S, in white on navy.

## Architecture

```
src/
  data/
    types.ts         data model (mirrors the original swimhub-api resources)
    store.ts         persisted store (localStorage) + React hooks
    api.ts           all business rules: permissions, eligibility, conflicts, hours report, import
    occurrences.ts   expands weekly slots into dated sessions with their absence state
    seed.ts          demo club, dated relative to today
  components/        UI kit, app shell, pool hero, session drawer
  pages/public/      landing, auth, legal pages, 404
  pages/app/         dashboard, planning, configuration, absences, substitutions, team, reports, billing, support, account
```

The screens never touch storage directly. They call `src/data/api.ts`, so a real backend (for example the existing `swimhub-api`) can replace the local store by turning those functions into HTTP calls without changing the UI.

**Current limitation:** this version runs entirely in the browser (demo mode). Accounts and data live in `localStorage`; nothing is sent to a server, no e-mails go out and Stripe is not wired. Hook `api.ts` up to a backend before using it with real clubs.

## Deploy

**GitHub Pages (live):** https://lmbeliott.github.io/Eliott/ — `npm run build:pages` builds under `/Eliott/`, adds a `404.html` fallback for deep links, and `.github/workflows/pages.yml` republishes `dist/` to the `gh-pages` branch on every push.

`render.yaml` defines a Render static site (`npm ci && npm run build`, publish `dist/`, SPA rewrite). Netlify works as-is thanks to `public/_redirects`. To serve the build from a sub-path or a static host without rewrites, build with `VITE_HASH_ROUTER=1` (and `VITE_BASE=/sub/path/` if needed).

## Stack

React 19, React Router 7 (data router), TypeScript, Vite, Tailwind CSS 4, lucide icons, Archivo variable font (self-hosted). Motion helpers live in `src/lib/motion.tsx`; keyframes and tokens in `src/styles.css`.
