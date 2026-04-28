# ADR 0001: Bun + Elysia for the API server

- **Status:** Accepted
- **Date:** 2026-02-10
- **Decision-makers:** Backend team

## Context

The project proposal calls for a TypeScript-first backend that:

- Exposes a small REST surface (search, candidates, shortlists, export)
- Talks to GitHub's REST/GraphQL API with rate-limit awareness
- Reads/writes a relational store for shortlists and a profile cache
- Auto-generates OpenAPI docs for the team and graders to inspect

Default options were Node.js + Express/Fastify, Deno + Oak, and Bun + Elysia.

## Decision

We use **Bun** as the runtime + package manager and **Elysia** as the HTTP
framework. Both sit at the top of the proposal's stack. Bun's native
`bun:sqlite` removes the need for a separate database driver in the
MVP, and Elysia's plugin system maps cleanly to our route-per-feature
layout (`server/src/routes/{search,candidates,shortlists,health}.ts`).

## Consequences

- **Positive:** Single-runtime tooling (test runner, package manager,
  bundler, sqlite client). Excellent DX — sub-second cold starts and
  hot reload. First-class TypeScript with no transpile step.
- **Negative:** Smaller ecosystem and more rough edges than Node.
  Some npm packages don't yet work in Bun.
- **Mitigations:** We pin a known-good Bun version in `package.json`
  `engines` and run CI on Bun to catch breakage early.

## Alternatives considered

- **Node + Fastify:** Mature, widely understood. Rejected because Bun
  removes a large amount of glue (sqlite driver, ts-node, dotenv) that
  Fastify users need to wire up themselves.
- **Deno + Oak:** Strong default security and TS, but the ecosystem
  for Octokit and GitHub-related libs is thinner than in Bun.
