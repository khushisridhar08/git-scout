import { Elysia, t } from "elysia"
import { githubService } from "../services/github"

export const searchRoutes = new Elysia({ prefix: "/search" }).get(
	"/candidates",
	async ({ query }) => {
		return githubService.searchUsers(
			query.q,
			{
				language: query.language,
				location: query.location,
				minFollowers: query.min_followers,
				minRepos: query.min_repos,
			},
			query.page,
		)
	},
	{
		query: t.Object({
			q: t.String({ minLength: 1 }),
			language: t.Optional(t.String()),
			location: t.Optional(t.String()),
			min_followers: t.Optional(t.Numeric({ minimum: 0 })),
			min_repos: t.Optional(t.Numeric({ minimum: 0 })),
			page: t.Numeric({ default: 1, minimum: 1 }),
		}),
		detail: {
			summary: "Search GitHub users for candidate discovery",
			tags: ["Search"],
		},
	},
)
