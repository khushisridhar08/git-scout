import { Elysia, t } from "elysia"
import { githubService } from "../services/github"
import { scoreProfile } from "../services/scoring"
import type { ScoredCandidateProfile } from "../types/github"

function getErrorStatus(error: unknown): number | undefined {
	if (typeof error !== "object" || error === null) return undefined
	const status = (error as { status?: unknown }).status
	return typeof status === "number" ? status : undefined
}

export const candidatesRoutes = new Elysia({ prefix: "/candidates" }).get(
	"/:username",
	async ({
		params,
		set,
	}): Promise<ScoredCandidateProfile | { message: string }> => {
		try {
			const profile = await githubService.getUserProfile(params.username)
			const { score, breakdown } = scoreProfile(profile)
			return {
				...profile,
				gitscout_score: score,
				score_breakdown: breakdown,
			}
		} catch (error: unknown) {
			const status = getErrorStatus(error)
			if (status === 404) {
				set.status = 404
				return { message: `GitHub user '${params.username}' not found` }
			}
			if (status === 403) {
				set.status = 503
				return {
					message:
						"GitHub rate limit exceeded. Set GITHUB_TOKEN or wait for reset.",
				}
			}
			throw error
		}
	},
	{
		params: t.Object({
			username: t.String({ minLength: 1 }),
		}),
		detail: {
			summary:
				"Get a scored candidate profile with repositories and activity signals",
			tags: ["Candidates"],
		},
	},
)
