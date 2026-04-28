# Architecture Decision Records

This directory captures non-trivial architectural decisions for GitScout.
ADRs follow the format defined by Michael Nygard with light tweaks.

## Index

| #    | Title                                                               | Status   |
|------|---------------------------------------------------------------------|----------|
| 0001 | [Bun + Elysia for the API server](0001-bun-elysia-stack.md)         | Accepted |
| 0002 | [SQLite (bun:sqlite) for MVP persistence](0002-sqlite-for-mvp-storage.md) | Accepted |
| 0003 | [Transparent weighted-sum scoring (no ML)](0003-transparent-weighted-scoring.md) | Accepted |

## Adding a new ADR

1. Copy [`0000-template.md`](0000-template.md) to `NNNN-kebab-title.md`
   using the next available number.
2. Fill it in. Keep it short — half a page is plenty.
3. Add a row to the index above.
4. Open a PR with the ADR.

## Lifecycle

- **Proposed:** under discussion in a PR
- **Accepted:** merged and in effect
- **Deprecated:** no longer applies, but kept for historical context
- **Superseded by ADR-XXXX:** replaced by a newer decision

ADRs are immutable once accepted — write a new one rather than editing
an old one in place.
