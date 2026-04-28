# ADR 0002: SQLite (bun:sqlite) for MVP persistence

- **Status:** Accepted
- **Date:** 2026-02-12
- **Decision-makers:** Backend team
- **Supersedes:** Postgres recommendation in the original Project Proposal §8.3

## Context

The project proposal lists PostgreSQL as the MVP datastore. After
prototyping the schema we re-evaluated: GitScout's MVP only needs two
small tables (`shortlists`, `shortlist_candidates`) plus an optional
`profile_cache`. There is no multi-tenant requirement, no full-text
search beyond what GitHub already provides, and no ops budget for a
managed Postgres in v1.0.

## Decision

Use **`bun:sqlite`** for MVP storage. The schema, migrations, and
shortlist DAO live in [`server/src/db/`](../../server/src/db/). Tests
run against an in-memory SQLite database created by `createApp()` so
they are hermetic.

The wire format and types stay portable: every table can be migrated
to Postgres later by replaying the same DDL with minor type
substitutions (`INTEGER` PKs → `BIGSERIAL`, etc.).

## Consequences

- **Positive:** Zero deployment friction — no separate database
  process, no connection pool, no env-var DSN. Tests are fast (in-memory).
  `bun:sqlite` is built into the runtime.
- **Negative:** Single-node only. Not appropriate at recruiter-scale
  load. We acknowledge this on the deck's Retrospective slide as an
  "Open risk."
- **Mitigations / Follow-ups:** When the time comes, migrate via a
  Postgres connector behind the existing DAO layer (`server/src/db/shortlists.ts`).

## Alternatives considered

- **PostgreSQL via Railway:** Aligned with the proposal but added
  ops complexity (managed connection, env wiring, migrations, separate
  dev DB). Deferred to post-MVP.
- **In-memory only:** Considered for purely demonstrating the algorithm,
  but shortlists need to survive page refreshes.
