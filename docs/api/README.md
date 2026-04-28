# API reference

The runtime source of truth is the Swagger UI at
[http://localhost:3001/swagger](http://localhost:3001/swagger) when the
server is running.

## Endpoints

| Method | Path                                       | Description                                       |
|--------|--------------------------------------------|---------------------------------------------------|
| GET    | `/health`                                  | Liveness probe                                    |
| GET    | `/health/ready`                            | Readiness probe                                   |
| GET    | `/healthz`                                 | Liveness alias (Kubernetes-style, per SCMP §7.2)  |
| GET    | `/search/candidates?q=...&language=...`    | Search GitHub users with filters; re-ranked by score |
| GET    | `/candidates/:username`                    | Scored candidate profile with repos + activity    |
| GET    | `/shortlists`                              | List all shortlists                               |
| POST   | `/shortlists`                              | Create a new shortlist                            |
| GET    | `/shortlists/:id`                          | Get a shortlist with its candidates               |
| PUT    | `/shortlists/:id`                          | Rename a shortlist                                |
| DELETE | `/shortlists/:id`                          | Delete a shortlist                                |
| POST   | `/shortlists/:id/candidates`               | Add a candidate to a shortlist                    |
| DELETE | `/shortlists/:id/candidates/:username`     | Remove a candidate from a shortlist               |

## Conventions

- All responses are JSON unless explicitly noted.
- `4xx` responses include a `{ message: string }` body.
- Endpoints that hit GitHub include a `rate_limit` block with
  `{ limit, remaining, resetAt }` so the frontend can warn users.
- Search responses are paginated; `page` is 1-indexed.

## Score breakdown

The `/candidates/:username` endpoint returns a `score_breakdown` object:

```json
{
  "gitscout_score": 87,
  "score_breakdown": {
    "popularity": 35,
    "activity":   28,
    "breadth":    16,
    "reach":      8
  }
}
```

See [ADR 0003](../adr/0003-transparent-weighted-scoring.md) for the
algorithm and weights.

## Filters

`GET /search/candidates` accepts:

| Param           | Type    | Notes                                  |
|-----------------|---------|----------------------------------------|
| `q`             | string  | Required. Free-text search query.      |
| `language`      | string  | Filter by primary language.            |
| `location`      | string  | Free-text location filter.             |
| `min_followers` | number  | Lower bound for follower count.        |
| `min_repos`     | number  | Lower bound for public repo count.     |
| `page`          | number  | 1-indexed page number (default `1`).   |

Filters are forwarded to GitHub's search qualifiers. Results are
re-ranked client-side by GitScout score before pagination.
