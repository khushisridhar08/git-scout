import { Elysia, t } from "elysia"
import { AiUnavailableError, aiService } from "../services/ai"
import { githubService } from "../services/github"

const AI_TOP_N = 10

export const searchRoutes = new Elysia({ prefix: "/search" })
	.get(
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
	.get(
		"/ai",
		async ({ query, set }) => {
			try {
				const parsed = await aiService.parseQuery(query.q)

				const githubResults = await githubService.searchUsers(
					parsed.refinedQuery,
					{ language: parsed.language, location: parsed.location },
					1,
				)

				const top = githubResults.candidates.slice(0, AI_TOP_N)

				const scored = await Promise.all(
					top.map(async (candidate) => {
						const ai = await aiService
							.scoreCandidate({
								username: candidate.login,
								type: candidate.type,
								githubRelevance: candidate.score,
								intent: parsed.intent,
								language: parsed.language,
								location: parsed.location,
							})
							.catch(() => ({
								score: candidate.gitscout_score,
								reasoning: "Scoring failed; showing fallback rank.",
							}))
						return { ...candidate, ai_score: ai.score, reasoning: ai.reasoning }
					}),
				)

				scored.sort((a, b) => b.ai_score - a.ai_score)

				return {
					query: query.q,
					intent: parsed.intent,
					parsed: {
						language: parsed.language ?? null,
						location: parsed.location ?? null,
						refined_query: parsed.refinedQuery,
					},
					candidates: scored,
					rate_limit: githubResults.rate_limit,
				}
			} catch (err) {
				if (err instanceof AiUnavailableError) {
					set.status = 503
					return { message: err.message }
				}
				throw err
			}
		},
		{
			query: t.Object({
				q: t.String({ minLength: 1 }),
			}),
			detail: {
				summary:
					"AI-ranked candidate search — parses natural language, then scores top 10 with reasoning",
				tags: ["Search"],
			},
		},
	)
