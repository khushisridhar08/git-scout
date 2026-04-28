# Runbook: GitHub rate limits

**When this runbook applies:** the API is returning HTTP 403 for
`/search/candidates` or `/candidates/:username`, or the
`RateLimitBadge` shows `0` remaining.

## Background

GitScout calls the GitHub REST API on every search and on every
profile load (cached for 5 minutes). GitHub's rate limits are:

| Mode                | Limit         | When applies              |
|---------------------|---------------|---------------------------|
| Unauthenticated     | 60 req/hr     | No `GITHUB_TOKEN` set     |
| Token-authenticated | 5 000 req/hr  | `GITHUB_TOKEN` is set     |
| Search API          | 30 req/min    | Always (separate bucket)  |

Search has its own per-minute bucket on top of the hourly limit, which
is why we sometimes see rate-limit errors even with a token.

## Diagnose

```bash
# Check current limits
curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/rate_limit

# Inspect server logs for 403 responses
bun --filter server dev | grep -E '403|rate'
```

The Elysia API surfaces the rate-limit headers on every response —
look for `rate_limit.remaining` in the JSON body.

## Mitigate (in priority order)

1. **Set `GITHUB_TOKEN`.** A classic PAT with `public_repo` scope is
   enough. Restart the server after setting the env var.

2. **Check the cache.** Profile responses are cached for 5 minutes in
   `server/src/services/github.ts#PROFILE_CACHE_TTL_MS`. If many distinct
   profiles are being requested, the cache won't help — that's expected.

3. **Throttle the frontend.** If a user is hammering the search box,
   debounce more aggressively (currently 300 ms in
   `web/app/hooks/useSearch.ts`).

4. **Wait for reset.** The `X-RateLimit-Reset` header (returned in our
   `rate_limit.resetAt` field) is the Unix timestamp at which the bucket
   refills.

## Escalate

If rate limits are exhausted in production for more than 30 minutes:

- File an issue with `risk:api` and `priority:p1`.
- Consider rotating to a different `GITHUB_TOKEN` to halve recovery time.
- Long-term: migrate to GitHub's GraphQL API for batch-friendly queries
  (tracked as a post-MVP enhancement).
