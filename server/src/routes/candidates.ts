import { Elysia, t } from "elysia"
import { githubService } from "../services/github"

export const candidatesRoutes = new Elysia({ prefix: "/candidates" }).get(
	"/:username",
	async ({ params, set }) => {
		try {
			return await githubService.getUserProfile(params.username)
		} catch (error: unknown) {
			const status = (error as { status?: number })?.status
			if (status === 404) {
				set.status = 404
				return { message: `GitHub user '${params.username}' not found` }
			}
			throw error
		}
	},
	{
		params: t.Object({
			username: t.String({ minLength: 1 }),
		}),
		detail: {
			summary: "Get a full candidate profile with repos and activity",
			tags: ["Candidates"],
		},
	},
)
