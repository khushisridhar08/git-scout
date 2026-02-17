import { Elysia, t } from "elysia";




export const searchRoutes = new Elysia({ prefix: "/search" })
    .get(
        "/candidates",
        async ({ query }) => {
            const { q, language, location, min_followers, min_repos, sort, order, page, per_page } = query;

            
            let searchQ = q;
            if (language) searchQ += ` language:${language}`;
            if (location) searchQ += ` location:${location}`;
            if (min_followers) searchQ += ` followers:>=${min_followers}`;
            if (min_repos) searchQ += ` repos:>=${min_repos}`;


            const response = await fetch(
                `https://api.github.com/search/users?q=${encodeURIComponent(searchQ)}&sort=${sort || 'best-match'}&order=${order || 'desc'}&page=${page}&per_page=${per_page}`,
                {
                    headers: {
                        "Accept": "application/vnd.github+json",
                        "User-Agent": "Elysia-App"
                    }
                }
            );

            const data = await response.json();


            const candidates = data.items.map((user: any) => ({
                ...user,
                gitscout_score: Math.floor(Math.random() * 100)
            }));

          

            return {
                total_count: data.total_count,
                rate_limit: {
                    limit: response.headers.get("x-ratelimit-limit"),
                    remaining: response.headers.get("x-ratelimit-remaining")
                },
                candidates
            };
        },
        {
            query: t.Object({
                q: t.String(),
                language: t.Optional(t.String()),
                location: t.Optional(t.String()),
                min_followers: t.Optional(t.Numeric()),
                min_repos: t.Optional(t.Numeric()),
                sort: t.Optional(t.Union([t.Literal("best-match"), t.Literal("followers"), t.Literal("repositories"), t.Literal("joined")])),
                order: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
                page: t.Numeric({ default: 1 }),
                per_page: t.Numeric({ default: 20, maximum: 50 })
            }),
            detail: {
                summary: "Search candidates with GitHub data",
                tags: ["Search"]
            }
        }
    );