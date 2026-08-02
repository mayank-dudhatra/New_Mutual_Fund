# Mutual Fund Explorer

A full-stack web application for discovering Indian mutual funds, analyzing their performance against real historical NAV data, running investment calculators (SIP / SWP / Lump Sum / Step-up), and tracking a **Virtual Portfolio** with automated, backdated SIP processing.

Built with **Next.js 15 (App Router)**, **MongoDB**, **MUI v7**, and server/client caching (TanStack Query + Zustand).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Architecture & Data Flow](#architecture--data-flow)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Background Jobs](#background-jobs)
- [Available Scripts](#available-scripts)
- [Performance & Caching Strategy](#performance--caching-strategy)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Fund Discovery** — Browse ~9,000 active mutual funds from MongoDB (synced from AMFI via `api.mfapi.in`), with server-side pagination and live search.
- **Fund Detail Pages** — Interactive NAV charts, point-to-point / historical / rolling returns, and per-fund calculators:
  - SIP Calculator (with XIRR)
  - Lump Sum Calculator (with CAGR)
  - Step-up SIP Calculator
  - SWP Calculator
  - Step-up SWP Calculator
  - Rolling Return Calculator
- **Watchlist** — Add/remove funds to a per-user watchlist with 1D/1M/3M/6M/1Y return columns.
- **Virtual Portfolio** — Start virtual SIPs with a custom start date and duration. Backdated SIPs are **automatically backfilled** with installments using historical NAV, so the portfolio behaves exactly as if the SIP had been running since its start date.
- **SIP Lifecycle** — Pause, resume, cancel, and redeem virtual SIPs; track installments, total units, invested value, current value, XIRR, and a growth chart.
- **Authentication** — Register / login / logout with password hashing (bcrypt) and JWT stored in an httpOnly cookie. Protected routes redirect to `/login`.
- **Scheduled Jobs** — Daily cron jobs sync the fund catalogue and process due SIP installments (Vercel Cron).

---

## Tech Stack

| Layer      | Technology                                                              |
|------------|-------------------------------------------------------------------------|
| Framework  | Next.js 15.5 (App Router, Turbopack) + React 19                          |
| UI         | MUI v7 (`@mui/material`, `@mui/icons-material`, `@mui/x-charts`, `@mui/x-date-pickers`) |
| Charts     | Recharts (NAV / portfolio charts)                                        |
| Data       | MongoDB (native `mongodb` v6 driver), Atlas connection string            |
| State      | TanStack React Query v5 (server-state cache) + Zustand v5 (shared client state) |
| Auth       | `bcryptjs` + `jsonwebtoken` in httpOnly cookie (`authToken`, 30 days)    |
| Dates      | `dayjs` + `date-fns`                                                     |
| Linting    | ESLint 9 (`eslint .`) + `typescript-eslint`                              |

---

## Getting Started

### Prerequisites

- Node.js 18.18+ (project built/tested with Node 20+)
- A MongoDB database (local or Atlas)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (see below)
cp .env.example .env

# 3. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The fund catalogue must be synced at least once before the Funds page shows data. Either run `GET /api/sync-funds` (or click **"Sync Active Funds"** on the Funds page) or wait for the daily cron job.

---

## Environment Variables

| Variable      | Required | Description                                                    | Default                     |
|---------------|----------|----------------------------------------------------------------|-----------------------------|
| `MONGODB_URI` | ✅       | MongoDB connection string (db: `mutualfund`)                   | `mongodb://localhost:27017/new_mutual_fund` |
| `JWT_SECRET`  | ✅       | Secret used to sign/verify JWT tokens (use a long random string) | —                          |
| `NODE_ENV`    | —        | `development` / `production` / `test`                          | `development`               |

`.env` is gitignored — never commit it. See `.env.example` for a template.

---

## Project Structure

```
src/
├── app/                          # App Router pages + API routes
│   ├── api/
│   │   ├── auth/session/         # GET current session (JWT verification)
│   │   ├── login|register|logout
│   │   ├── mf/                   # Paginated funds catalogue (MongoDB)
│   │   ├── sync-funds/           # Pull fund list from mfapi.in → MongoDB
│   │   ├── cron/process-sips/    # Daily SIP installment processing
│   │   ├── portfolio/            # Virtual SIP CRUD + actions
│   │   ├── scheme/[code]/        # Scheme details, returns + calculators
│   │   └── watchlist/            # User watchlist CRUD
│   ├── funds/                    # Fund catalogue page
│   ├── scheme/[code]/            # Fund detail + calculators page
│   ├── virtual-portfolio/        # Portfolio list + [id] SIP detail
│   ├── watchlist/                # User watchlist page
│   ├── home/ profile/ login/ register/
│   ├── layout.tsx                # Root layout (providers + navbar)
│   └── providers.tsx             # React Query client provider
├── components/                   # UI components (charts, calculators, rows)
├── context/AuthContext.tsx       # Auth provider (session restore, login/logout)
├── hooks/                        # useFunds, useSchemeDetails, useWatchlist, useSipDetail, useDebounce
├── lib/
│   ├── mongodb.ts                # Cached Mongo client (thenable, retry-aware)
│   ├── api.ts                    # mfapi.in fetch helpers (NodeCache 12h)
│   ├── sipBackfill.ts            # Backdated SIP installment engine
│   ├── sipCalculator.ts / swpCalculator.ts / stepUpSipCalculator.ts
│   └── utils.ts                  # Formatting (₹/%), CAGR, date helpers
├── middleware.ts                 # Route protection + auth redirects
├── models/                       # User, VirtualPortfolio, Watchlist types
├── store/portfolioStore.ts       # Zustand shared portfolio state
└── types/scheme.ts               # Scheme / NAV / returns types
```

---

## Architecture & Data Flow

### Data source
Mutual fund master data and NAV history come from the free **AMFI** API (`https://api.mfapi.in`). The full catalogue is cached into MongoDB by `/api/sync-funds`, and NAV history is fetched on demand (server-side, cached in memory for 12h via `node-cache`).

### Virtual SIP processing
- Creating a SIP writes to `virtual_portfolio` and immediately runs `processSipInstallments` (`src/lib/sipBackfill.ts`) so **backdated SIPs** are filled with installments using the NAV on/before each due date.
- A daily cron (`/api/cron/process-sips`) keeps active SIPs current by processing due installments, updating units, invested amount, `nextSipDate`, and auto-completing SIPs once their duration is reached.

### Client-side caching
- **TanStack Query** (see `src/app/providers.tsx`): `staleTime: 5 min`, `gcTime: 30 min`, no refetch on window focus/reconnect, `retry: 1`. Used by `useFunds`, `useSchemeDetails`, `useWatchlist`, `useSipDetail`.
- **Zustand** (`src/store/portfolioStore.ts`): the virtual portfolio (SIPs + NAV performance) is fetched once and shared across pages; subsequent navigations reuse cached data and only refresh in the background when stale (`5 min`). A full loading spinner shows only when there is no cached data.
- `useMemo` is used throughout pages/components to avoid recomputing derived values (holdings, history, returns) on every render.

---

## API Endpoints

### Auth
| Method | Endpoint                | Description                                    |
|--------|-------------------------|------------------------------------------------|
| POST   | `/api/register`         | Register a user (bcrypt-hashed password)       |
| POST   | `/api/login`            | Login, returns user + sets `authToken` cookie  |
| POST   | `/api/logout`           | Clears the auth cookie                         |
| GET    | `/api/auth/session`     | Returns `{ user }` for a valid token, else 401 |

### Funds & Schemes
| Method | Endpoint                        | Description                                       |
|--------|---------------------------------|---------------------------------------------------|
| GET    | `/api/mf?page=&limit=`          | Paginated fund list from MongoDB (default 50)     |
| GET    | `/api/sync-funds`               | Re-sync catalogue from mfapi.in                   |
| GET    | `/api/scheme/[code]`            | Scheme meta + full NAV history                    |
| GET    | `/api/scheme/[code]/returns?period=1m\|3m\|6m\|1y` or `?from=&to=` | Simple + annualized returns |
| POST   | `/api/scheme/[code]/sip`        | SIP simulation (`amount, from, to`) → XIRR + chart |
| POST   | `/api/scheme/[code]/lumpsum`    | Lump sum simulation (`amount, from, to`)          |
| POST   | `/api/scheme/[code]/swp`        | SWP simulation (`initialInvestment, monthlyWithdrawal, from, to`) |
| POST   | `/api/scheme/[code]/step-up-sip`| Step-up SIP (`initialAmount, stepUpPercentage, from, to`) |
| POST   | `/api/scheme/[code]/step-up-swp`| Step-up SWP                                      |
| POST   | `/api/scheme/[code]/rolling-return` | Rolling returns (`periodInYears`) → avg/min/max/stdev |

### Virtual Portfolio (authenticated)
| Method | Endpoint                              | Description                                   |
|--------|---------------------------------------|-----------------------------------------------|
| GET    | `/api/portfolio`                      | List the current user's SIPs                  |
| POST   | `/api/portfolio`                      | Create a virtual SIP (`schemeCode, schemeName, sipAmount, startDate, durationMonths`) + backfill |
| GET    | `/api/portfolio/[id]`                 | SIP detail + installment transactions         |
| DELETE | `/api/portfolio/[id]`                 | Delete a SIP (owner-only)                     |
| POST   | `/api/portfolio/[id]/pause`           | Pause an active SIP                           |
| POST   | `/api/portfolio/[id]/resume`          | Resume a paused SIP                           |
| POST   | `/api/portfolio/[id]/cancel`          | Cancel an active/paused SIP                   |
| POST   | `/api/portfolio/[id]/redeem`          | Redeem SIP at latest NAV (marks completed)    |
| POST   | `/api/portfolio/performance`          | Batch latest + previous NAV for scheme codes  |

### Watchlist (authenticated)
| Method | Endpoint                    | Description                       |
|--------|-----------------------------|-----------------------------------|
| GET    | `/api/watchlist`            | List the current user's watchlist |
| POST   | `/api/watchlist`            | Add item (`schemeCode, schemeName`) |
| DELETE | `/api/watchlist/[schemeCode]` | Remove item                      |

---

## Data Models

MongoDB database: `mutualfund`

| Collection           | Fields (summary)                                                                       |
|----------------------|----------------------------------------------------------------------------------------|
| `users`              | `email`, `password` (bcrypt), `name`                                                   |
| `funds`              | `schemeCode`, `schemeName`, `schemeType?`, `isinGrowth?`, `isinDivReinvestment?`, `isinDivPayout?` |
| `virtual_portfolio`  | `userId`, `schemeCode`, `schemeName`, `sipAmount`, `startDate`, `durationMonths`, `status` (`active\|paused\|completed\|cancelled`), `completedInstallments`, `nextSipDate`, `totalUnits`, `totalInvested`, `redeemed`, `redeemedOn?`, `redeemedValue?`, `createdAt` |
| `sip_transactions`   | `sipId`, `userId`, `schemeCode`, `amount`, `nav`, `units`, `transactionDate`            |
| `watchlist`          | `userId`, `schemeCode`, `schemeName`, `createdAt`                                      |

All resource routes scope queries by `userId` extracted from the JWT, so users can only ever read/modify their own data.

---

## Background Jobs

Defined in `vercel.json` (Vercel Cron):

| Schedule (UTC) | Endpoint               | Purpose                                    |
|----------------|------------------------|--------------------------------------------|
| `0 7 * * *`    | `/api/sync-funds`      | Refresh the fund catalogue from mfapi.in   |
| `0 1 * * *`    | `/api/cron/process-sips` | Process due installments for all active SIPs |

Both endpoints also run manually (GET) for on-demand execution — e.g. `/api/sync-funds` after deployment.

---

## Available Scripts

| Command              | Description                                  |
|----------------------|----------------------------------------------|
| `npm run dev`        | Start the dev server (Turbopack)             |
| `npm run build`      | Production build                             |
| `npm run start`      | Run the production build                     |
| `npm run lint`       | ESLint over the whole repo (`eslint .`)      |
| `npm run type-check` | TypeScript type checking (`tsc --noEmit`)    |

All four of the last commands (build / lint / type-check / start) pass cleanly.

---

## Performance & Caching Strategy

1. **Server-side catalogue**: fund master data lives in MongoDB; the Funds page uses paginated queries (`useFunds`) with `keepPreviousData` so paging doesn't flash a spinner.
2. **12h in-memory cache** (`src/lib/api.ts`) for mfapi.in NAV history, shared across all calculation endpoints.
3. **React Query** caches scheme details, returns, watchlist, and SIP detail across client navigation with a 5-minute staleness window.
4. **Zustand portfolio store** prevents repeated `/api/portfolio` + `/api/portfolio/performance` calls when navigating between the portfolio list, SIP detail, and scheme pages.
5. **`useMemo`** on derived data (summaries, filtered lists, chart series) avoids recalculation on unrelated re-renders.

---

## Deployment

The app is set up for deployment on **Vercel** (see `vercel.json` for crons).

1. Push the repo and import it into Vercel.
2. Add `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production` to the project's environment variables.
3. If MongoDB is behind an IP allowlist, add Vercel's egress IPs (or run the proxy). Atlas free clusters require the public IP to be whitelisted.
4. After the first deploy, trigger `/api/sync-funds` to populate the fund catalogue.
5. `npm run build` is used by Vercel; ESLint is ignored during builds by `next.config.ts` (`ignoreDuringBuilds`), but run `npm run lint` and `npm run type-check` in CI.

---

## Troubleshooting

- **`GET /api/auth/session 401` in the browser console** — Expected when logged out. `AuthContext` treats it as "no user" and shows the login UI. It disappears once authenticated.
- **`POST /api/login` returns 500 after ~30s** — MongoDB connection timeout (network outage / Atlas hiccup / IP not whitelisted). Verify with `ping` on your network and that your current public IP is allowed in Atlas. The client helper in `src/lib/mongodb.ts` automatically retries on the next request after a transient failure.
- **Funds page is empty** — Run `/api/sync-funds` (or the "Sync Active Funds" button) to populate the `funds` collection.
- **After `npm run build`** the dev server may need restarting, because the build overwrites the `.next` directory.
- **`schemeCode` typing** — `schemeCode` is a `number` in MongoDB docs (from `api.mfapi.in`). Route params arrive as strings and are coerced with `Number(...)` when needed.

---

## License

Private project — all rights reserved.
