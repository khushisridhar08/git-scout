# Contributing to GitScout

Thanks for your interest in contributing. This guide collects the working
agreements from our [SCMP/SPMP](docs/SCMP%20and%20SPMP.docx) so new
contributors can ramp up quickly.

## Getting started

```bash
git clone https://github.com/xors-software/git-scout
cd git-scout
bun install
bun dev   # web (3000) + server (3001) in parallel
```

See the [README](README.md) for full setup including environment variables.

## Branching strategy

We follow trunk-based development with short-lived feature branches:

- Branch off `main` with a descriptive prefix:
  - `feature/<area>-<short-name>` — new functionality
  - `fix/<area>-<short-name>` — bug fixes
  - `chore/<short-name>` — refactors, dependency bumps, docs
- Keep branches small and short-lived. Aim for a PR that lands in days, not weeks.
- Avoid long-running divergence. Rebase regularly if `main` moves under you.

## Pull request policy

Per SCMP §3.4, every PR must include:

- [ ] Link to a GitHub issue (use `Closes #N` in the description)
- [ ] Clear description of **what** changed and **why**
- [ ] Screenshots or a short clip for any UI change
- [ ] Updated/new tests, or a written justification if not applicable
- [ ] Passing CI checks
- [ ] At least one approving reviewer

## Definition of Done

A change is done when:

- Acceptance criteria from the linked issue are met and validated
- Tests are added/updated and the suite is green (`bun test`)
- Type-check is clean (`bun type-check`)
- Lint is clean (`bun lint`)
- Documentation is updated (README, ADRs, API docs, runbooks where relevant)
- The PR is reviewed and merged via the GitHub UI (no force-pushes to `main`)

## Code style

We use [Biome](https://biomejs.dev/) for both linting and formatting.
Configuration lives in [`biome.json`](biome.json).

```bash
bun lint        # check
bun lint:fix    # auto-fix safe issues
bun format:fix  # apply formatting
```

TypeScript is strict everywhere. Avoid `any`. If you must escape the type
system, prefer `unknown` plus a narrowing helper over a cast.

## Architecture decisions

Significant technical decisions are recorded as ADRs under
[`docs/adr/`](docs/adr/). Use the template at
[`docs/adr/0000-template.md`](docs/adr/0000-template.md). Keep them short
(half a page) and immutable — new decisions supersede old ones via a new
ADR rather than editing in place.

## Issue labels

| Area       | Type         | Priority   | Size        |
|------------|--------------|------------|-------------|
| `area:web` | `type:feature` | `priority:p0` | `size:xs` |
| `area:server` | `type:bug`  | `priority:p1` | `size:s`  |
| `area:db`  | `type:chore` | `priority:p2` | `size:m`  |
| `area:ux`  | `type:spike` |               | `size:l`  |
| `area:qa`  |              |               |           |
| `area:devops` |           |               |           |

Risk-tracking issues use `risk:api`, `risk:privacy`, `risk:performance`.

## Getting help

- File a discussion or issue with the `question` label.
- Major design questions go to the team standup (twice weekly).
