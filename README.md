# GitScout

**GitHub Talent Intelligence Platform** — turns public GitHub activity into ranked, shortlist-ready candidate profiles for technical recruiters.

> `fetch("verified developer signals").score()`

GitScout lets a recruiter search 150M+ GitHub users with structured filters (language / location / followers / repos), drill into a transparent 0–100 talent score broken down by four weighted signals, save candidates to persistent shortlists, and export a timestamped CSV for ATS handoff. The full loop ships end-to-end against the live GitHub REST API.

---

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Scoring Algorithm](#scoring-algorithm)
5. [Project Structure](#project-structure)
6. [API Reference](#api-reference)
7. [Testing](#testing)
8. [Scripts](#scripts)
9. [Documentation](#documentation)
10. [License](#license)

---

## Features

| # | Surface            | Description                                                                                                     |
|---|--------------------|-----------------------------------------------------------------------------------------------------------------|
| 1 | Advanced Search    | Filter GitHub users by language, location, min followers, and min repos. Results re-ranked live by relevance.   |
| 2 | Profile Analytics  | Aggregated repos, stars, languages, and 90-day activity — pulled from GitHub REST behind a 5-minute TTL cache.  |
| 3 | Talent Scoring     | Transparent 0–100 score: popularity (35), activity (30), breadth (20), reach (15). Every input visible in UI.   |
| 4 | Shortlists         | Named candidate lists persisted in SQLite with full CRUD and live add/remove via dropdown.                      |
| 5 | CSV Export         | One-click export with proper quoting and timestamped filenames (`<slug>-<YYYY-MM-DD>.csv`).                     |
| 6 | Swagger + Health   | Auto-generated OpenAPI docs at `/swagger`, plus `/health` and `/health/ready` endpoints for orchestrators.      |
| 7 | Rate-limit Badge   | Every response carries GitHub rate-limit headers; the frontend exposes remaining quota to the user.             |

---

## Architecture

```
┌─────────────┐        ┌──────────────┐        ┌──────────────┐
│  Browser    │  HTTP  │  Elysia API  │  REST  │   GitHub     │
│  Next.js 16 │ ─────▶ │   on Bun     │ ─────▶ │   Octokit    │
│  React Query│        │   Swagger    │        │   (+ cache)  │
└─────────────┘        └──────┬───────┘        └──────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │  SQLite      │
                       │  bun:sqlite  │
                       │  migrations  │
                       └──────────────┘
```

**Tech stack** — Bun · TypeScript · Elysia · Octokit · bun:sqlite · Biome · Next.js · React Query · Tailwind · shadcn/ui · Vitest · Swagger

- **Typed all the way down** — strict TypeScript on both sides of the wire; shared `types/github.ts` avoids drift.
- **Unauthenticated OR token-authenticated** — works out of the box at GitHub's anonymous rate limit; set `GITHUB_TOKEN` for 5000 req/hr.
- **In-memory SQLite in tests** — the app factory (`createApp`) accepts a DB handle so the full API can be smoke-tested without file I/O.

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/docs/installation) (required — we use `bun:sqlite` and `bun test`)
- A GitHub personal access token (optional, but recommended — see below)

### Setup

```bash
# Clone + install
git clone https://github.com/xors-software/git-scout
cd git-scout
bun install

# Optional: add a GitHub token to raise rate limits from 60/hr to 5000/hr
cp .env.example server/.env
# edit server/.env and set GITHUB_TOKEN=ghp_...

# Run both packages in parallel
bun dev
```

Once running:

- **Frontend** — http://localhost:3000
- **API** — http://localhost:3001
- **Swagger UI** — http://localhost:3001/swagger

### Environment variables

See [.env.example](./.env.example). Both variables are optional — GitScout runs without them.

| Variable       | Scope  | Purpose                                                          |
|----------------|--------|------------------------------------------------------------------|
| `GITHUB_TOKEN` | server | Octokit auth. Raises GitHub rate limit from 60 to 5000 req/hr.   |
| `CORS_ORIGIN`  | server | Allowed frontend origin. Defaults to `http://localhost:3000`.    |
| `DATABASE_URL` | server | SQLite path. Defaults to `./gitscout.db`.                        |

---

## Scoring Algorithm

The GitScout Score is a transparent weighted sum — no black box, no ML magic. It is defined in [`server/src/services/scoring.ts`](server/src/services/scoring.ts).

| Component  | Max | Signal                          | Formula                                     |
|------------|-----|---------------------------------|---------------------------------------------|
| Popularity | 35  | Total repository stars          | `clamp((total_stars / 100) * 35, 0, 35)`    |
| Activity   | 30  | Recent public events (last 90d) | `clamp((event_count / 30) * 30, 0, 30)`     |
| Breadth    | 20  | Distinct languages + repo count | `lang/6*15 + repos/40*5`, clamped to 20     |
| Reach      | 15  | Community followers             | `clamp((followers / 150) * 15, 0, 15)`      |
| **Total**  | 100 | —                               | sum of the four, rounded to the nearest int |

Every component is returned in the API response as a `score_breakdown` so the frontend can render the exact bar for every signal. See `scoreProfile()` for the implementation and [`server/test/scoring.test.ts`](server/test/scoring.test.ts) for the contract.

---

## Project Structure

```
git-scout/
├── docs/                         # SRS, SCMP, pitch deck, UI mocks
│   ├── GitScout SRS.pdf
│   ├── SPMP Document (1).pdf
│   ├── Software Configuration Management Plan (1).pdf
│   └── deck/GitScout.pdf
├── server/                       # Elysia API on Bun
│   ├── src/
│   │   ├── app.ts                # Testable app factory
│   │   ├── index.ts              # Entry point (createApp().listen(3001))
│   │   ├── db/                   # bun:sqlite client + migrations + shortlist DAO
│   │   ├── routes/               # Elysia plugins: health / search / candidates / shortlists
│   │   ├── services/             # github (Octokit + cache), scoring (weighted sum)
│   │   └── types/github.ts       # Shared API contract types
│   └── test/                     # bun:test — scoring, search, shortlists, health smoke
├── web/                          # Next.js 16 frontend
│   ├── app/
│   │   ├── page.tsx              # Search
│   │   ├── candidates/[username] # Profile + score breakdown
│   │   ├── shortlists/           # Index + detail with CSV export
│   │   └── components/           # shadcn/ui-based building blocks
│   └── test/                     # Vitest unit tests
├── biome.json                    # Lint + format (shared across workspaces)
├── package.json                  # Bun workspaces root
└── README.md
```

---

## API Reference

All endpoints are documented in Swagger UI at `/swagger` when the server is running.

| Method | Path                                     | Description                                       |
|--------|------------------------------------------|---------------------------------------------------|
| GET    | `/health`                                | Liveness probe                                    |
| GET    | `/health/ready`                          | Readiness probe                                   |
| GET    | `/search/candidates?q=...&language=...`  | Search users with filters, re-ranked by score     |
| GET    | `/candidates/:username`                  | Scored profile with repos, languages, activity    |
| GET    | `/shortlists`                            | List all shortlists                               |
| POST   | `/shortlists`                            | Create a new shortlist                            |
| GET    | `/shortlists/:id`                        | Get a shortlist with its candidates               |
| PUT    | `/shortlists/:id`                        | Rename a shortlist                                |
| DELETE | `/shortlists/:id`                        | Delete a shortlist                                |
| POST   | `/shortlists/:id/candidates`             | Add a candidate to a shortlist                    |
| DELETE | `/shortlists/:id/candidates/:username`   | Remove a candidate from a shortlist               |

---

## Testing

```bash
bun test                  # all packages
bun --filter server test  # server only (bun:test)
bun --filter web test     # web only (vitest)
```

The server tests cover the scoring algorithm (including edge cases — zero metrics, saturation, clamping), the search and shortlists routes via the app factory, and a health smoke test. All tests run against an in-memory SQLite database so they are hermetic and fast.

---

## Scripts

```bash
# Workspace-wide
bun dev            # start web + server in parallel
bun build          # build both packages
bun test           # run all tests
bun lint           # Biome lint
bun lint:fix       # Biome lint --write
bun format         # Biome format --check
bun format:fix     # Biome format --write
bun type-check     # tsc --noEmit across packages
bun clean          # remove node_modules

# Server only
bun --filter server dev      # Elysia with hot reload
bun --filter server build    # production bundle
bun --filter server test     # bun:test

# Web only
bun --filter web dev         # Next.js dev
bun --filter web build       # production build
bun --filter web start       # production server
bun --filter web test        # Vitest
```

---

## Documentation

### Project documents

- **Project Proposal v2** — [docs/Project Proposal v2.docx](docs/Project%20Proposal%20v2.docx)
- **Software Requirements Specification** — [docs/GitScout SRS.pdf](docs/GitScout%20SRS.pdf)
- **SCMP + SPMP (combined)** — [docs/SCMP and SPMP.docx](docs/SCMP%20and%20SPMP.docx)
- **Software Configuration Management Plan** — [docs/Software Configuration Management Plan.pdf](docs/Software%20Configuration%20Management%20Plan.pdf)
- **Pitch deck** — [docs/deck/GitScout.pdf](docs/deck/GitScout.pdf)
- **UI mocks** — [docs/ui/](docs/ui/)

### Engineering documents

- **Contributing guide** — [CONTRIBUTING.md](CONTRIBUTING.md)
- **Architecture Decision Records** — [docs/adr/](docs/adr/) (Bun+Elysia stack, SQLite for MVP, transparent scoring)
- **API reference** — [docs/api/README.md](docs/api/README.md) (runtime Swagger at http://localhost:3001/swagger)
- **Runbooks** — [docs/runbooks/](docs/runbooks/) (local dev setup, GitHub rate limits)

---

## License

See [LICENSE.md](LICENSE.md).
