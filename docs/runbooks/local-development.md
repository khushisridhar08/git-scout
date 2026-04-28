# Runbook: Local development setup

**When this runbook applies:** new contributor setting up the repo, or
existing contributor returning after a long break.

## Prerequisites

- macOS, Linux, or WSL2 on Windows
- [Bun](https://bun.sh/docs/installation) (`curl -fsSL https://bun.sh/install | bash`)
- Git

> Node is **not** required. The whole monorepo runs on Bun.

## First-time setup

```bash
git clone https://github.com/xors-software/git-scout
cd git-scout
bun install
```

Optional but recommended — set up a GitHub token:

```bash
cp .env.example server/.env
# Edit server/.env and set GITHUB_TOKEN=ghp_... (classic PAT, public_repo scope)
```

Without a token, you'll hit GitHub's anonymous rate limit (60 req/hr).
With a token, you have 5 000 req/hr.

## Run

```bash
bun dev
```

Opens:
- **Frontend** → http://localhost:3000
- **API** → http://localhost:3001
- **Swagger** → http://localhost:3001/swagger

## Common tasks

```bash
bun test         # all tests (server + web)
bun lint         # Biome lint
bun lint:fix     # Biome auto-fix
bun type-check   # tsc --noEmit
```

Run a single workspace:

```bash
bun --filter server dev
bun --filter web   dev
bun --filter server test
```

## Reset the database

The SQLite file lives at `./gitscout.db` by default. Delete it to start
fresh — migrations re-run on the next server boot.

```bash
rm -f server/gitscout.db
```

For tests, the database is in-memory and reset between runs — nothing
to clean up.

## Troubleshooting

- **`Cannot find module '@octokit/rest'`** — run `bun install`.
- **Port 3000 / 3001 in use** — kill the offender (`lsof -i :3001`)
  or set `PORT` before `bun dev`.
- **Search returns nothing** — check `GITHUB_TOKEN` is set; verify with
  `curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/rate_limit`.
