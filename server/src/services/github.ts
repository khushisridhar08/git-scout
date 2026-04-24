import { Octokit } from "@octokit/rest"
import type {
	CandidateProfileResponse,
	CandidateSearchFilters,
	CandidateSearchResponse,
	RateLimit,
} from "../types/github"
import { scoreSearchResult } from "./scoring"

const PROFILE_CACHE_TTL_MS = 5 * 60 * 1000
const REPOS_PER_PAGE = 100
const EVENTS_PER_PAGE = 30
const TOP_REPOS_COUNT = 5
const SEARCH_PER_PAGE = 20

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
	userAgent: "gitscout",
})

type CacheEntry<T> = { value: T; expiresAt: number }
const profileCache = new Map<string, CacheEntry<CandidateProfileResponse>>()

function readRateLimit(
	headers: Record<string, unknown> | undefined,
): RateLimit {
	const limit = Number(headers?.["x-ratelimit-limit"])
	const remaining = Number(headers?.["x-ratelimit-remaining"])
	const reset = Number(headers?.["x-ratelimit-reset"])

	return {
		limit: Number.isFinite(limit) ? limit : null,
		remaining: Number.isFinite(remaining) ? remaining : null,
		resetAt: Number.isFinite(reset) ? reset : null,
	}
}

function buildSearchQuery(q: string, filters: CandidateSearchFilters): string {
	const parts = [q.trim()]
	if (filters.language) parts.push(`language:${filters.language}`)
	if (filters.location) parts.push(`location:"${filters.location}"`)
	if (filters.minFollowers !== undefined) {
		parts.push(`followers:>=${filters.minFollowers}`)
	}
	if (filters.minRepos !== undefined) {
		parts.push(`repos:>=${filters.minRepos}`)
	}
	return parts.filter(Boolean).join(" ")
}

export const githubService = {
	async searchUsers(
		q: string,
		filters: CandidateSearchFilters,
		page = 1,
	): Promise<CandidateSearchResponse> {
		const response = await octokit.rest.search.users({
			q: buildSearchQuery(q, filters),
			per_page: SEARCH_PER_PAGE,
			page,
		})

		const scoreInput = {
			query: q,
			language: filters.language,
			location: filters.location,
		}

		const candidates = response.data.items
			.map((item) => {
				const base = {
					login: item.login,
					id: item.id,
					avatar_url: item.avatar_url,
					html_url: item.html_url,
					score: item.score,
					type: item.type,
				}
				return {
					...base,
					gitscout_score: scoreSearchResult(base, scoreInput),
				}
			})
			.sort((a, b) => b.gitscout_score - a.gitscout_score)

		return {
			total_count: response.data.total_count,
			incomplete_results: response.data.incomplete_results,
			candidates,
			rate_limit: readRateLimit(response.headers),
		}
	},

	async getUserProfile(username: string): Promise<CandidateProfileResponse> {
		const cacheKey = username.toLowerCase()
		const cached = profileCache.get(cacheKey)
		if (cached && cached.expiresAt > Date.now()) {
			return cached.value
		}

		const [userRes, reposRes, eventsRes] = await Promise.all([
			octokit.rest.users.getByUsername({ username }),
			octokit.rest.repos.listForUser({
				username,
				per_page: REPOS_PER_PAGE,
				sort: "updated",
			}),
			octokit.rest.activity.listPublicEventsForUser({
				username,
				per_page: EVENTS_PER_PAGE,
			}),
		])

		const user = userRes.data
		const repos = reposRes.data
		const events = eventsRes.data

		let totalStars = 0
		const languages: Record<string, number> = {}

		const processedRepos = repos
			.map((repo) => {
				const stars = repo.stargazers_count ?? 0
				totalStars += stars

				if (repo.language) {
					languages[repo.language] = (languages[repo.language] ?? 0) + 1
				}

				return {
					name: repo.name,
					description: repo.description ?? null,
					stars,
					language: repo.language ?? null,
					url: repo.html_url,
					pushed_at: repo.pushed_at ?? null,
				}
			})
			.sort((a, b) => b.stars - a.stars)

		const latestEvent = events[0]

		const result: CandidateProfileResponse = {
			profile: {
				username: user.login,
				name: user.name,
				bio: user.bio,
				avatar_url: user.avatar_url,
				location: user.location,
				company: user.company,
				blog: user.blog,
				joined_at: user.created_at,
			},
			metrics: {
				public_repos: user.public_repos,
				followers: user.followers,
				following: user.following,
				total_stars: totalStars,
			},
			languages,
			top_repositories: processedRepos.slice(0, TOP_REPOS_COUNT),
			activity: {
				recent_event_count: events.length,
				latest_event_type: latestEvent?.type ?? null,
				latest_event_at: latestEvent?.created_at ?? null,
			},
			rate_limit: readRateLimit(userRes.headers),
		}

		profileCache.set(cacheKey, {
			value: result,
			expiresAt: Date.now() + PROFILE_CACHE_TTL_MS,
		})

		return result
	},
}
