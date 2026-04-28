# ADR 0003: Transparent weighted-sum scoring (no ML)

- **Status:** Accepted
- **Date:** 2026-02-18
- **Decision-makers:** PM + Backend team
- **Related risk:** SCMP R2 — "Scoring produces misleading outcomes or is hard to explain"

## Context

A core competitive question in this market is *how* candidates are
scored. Juicebox uses a closed-source AI ranker. Recruiters routinely
ask "why is this candidate at the top?" and expect a defensible answer.

The proposal calls for a **transparent scoring algorithm** that users
can understand and customize. The SCMP risk register flags scoring
explainability as one of the project's top risks.

## Decision

GitScout v1.0 uses a **deterministic weighted sum of four GitHub signals**:

| Component  | Weight | Signal                          |
|------------|--------|---------------------------------|
| Popularity | 35     | Total repository stars          |
| Activity   | 30     | Recent public events (≤ 90d)    |
| Breadth    | 20     | Distinct languages + repo count |
| Reach      | 15     | Followers                       |

Each sub-score is clamped to its weight maximum so no single signal can
dominate. The breakdown is returned in every API response so the UI can
render the exact bar for every component
(see [`web/app/components/candidate/ScoreBreakdown.tsx`](../../web/app/components/candidate/ScoreBreakdown.tsx)).

The algorithm is implemented in
[`server/src/services/scoring.ts`](../../server/src/services/scoring.ts)
with a `v1` algorithm version so we can ship `v2` without breaking
historical comparisons.

## Consequences

- **Positive:** Explainable. Auditable. Cheap to compute (no model
  inference). Easy to add new signals as additional weighted terms.
  Tests live in [`server/test/scoring.test.ts`](../../server/test/scoring.test.ts).
- **Negative:** Less expressive than an ML ranker — won't capture
  non-linear patterns like "high stars + low recent activity = burnout
  signal." Weights are hand-tuned, not learned.
- **Mitigations:** Document the weights in the README + SRS. Surface
  the breakdown in the UI. Version the algorithm so a learned-weights
  v2 is a clean upgrade.

## Alternatives considered

- **Lightweight ML model (e.g., logistic regression on hand-labeled
  candidates):** Better calibration, but no training data, no labelers,
  and no explanation surface for free. Rejected for v1.0.
- **Black-box LLM scorer:** Marketing-friendly but precisely what users
  complain about with Juicebox. Explicitly rejected as a market
  differentiator.
