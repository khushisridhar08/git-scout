import type {
	Candidate,
	CandidateListItem,
	CandidateRepo,
	CandidateScoreBreakdown,
} from "@/types/candidate"
import type {
	AiSearchResponse,
	RateLimit,
	SearchFilters,
	SearchResponse,
} from "@/types/search"
import type {
	ShortlistCandidate,
	ShortlistDetail,
	ShortlistSummary,
} from "@/types/shortlist"

const API_BASE_URL = (
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
).replace(/\/$/, "")

export class ApiError extends Error {
	readonly status: number
	readonly body: unknown

	constructor(message: string, status: number, body: unknown = null) {
		super(message)
		this.name = "ApiError"
		this.status = status
		this.body = body
	}
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		credentials: "include",
		...options,
		headers: {
			"Content-Type": "application/json",
			...(options.headers ?? {}),
		},
	})

	const contentType = response.headers.get("content-type") ?? ""
	const body = contentType.includes("application/json")
		? await response.json().catch(() => null)
		: await response.text().catch(() => null)

	if (!response.ok) {
		const message =
			body && typeof body === "object" && "message" in body
				? String((body as { message?: unknown }).message)
				: `Request failed with status ${response.status}`
		throw new ApiError(message, response.status, body)
	}

	return body as T
}

type SearchPayload = {
	total_count: number
	incomplete_results: boolean
	candidates: Array<{
		login: string
		avatar_url: string
		html_url: string
		type: string
		gitscout_score: number
		name?: string | null
	}>
	rate_limit: RateLimit
}

function toCandidateListItem(
	raw: SearchPayload["candidates"][number],
): CandidateListItem {
	return {
		username: raw.login,
		name: raw.name ?? null,
		avatarUrl: raw.avatar_url,
		htmlUrl: raw.html_url,
		type: raw.type,
		score: raw.gitscout_score,
	}
}

export async function searchCandidates(
	filters: SearchFilters,
	signal?: AbortSignal,
): Promise<SearchResponse> {
	const params = new URLSearchParams({ q: filters.q })
	if (filters.language) params.set("language", filters.language)
	if (filters.location) params.set("location", filters.location)
	if (filters.min_followers !== undefined) {
		params.set("min_followers", String(filters.min_followers))
	}
	if (filters.min_repos !== undefined) {
		params.set("min_repos", String(filters.min_repos))
	}
	if (filters.page !== undefined) {
		params.set("page", String(filters.page))
	}

	const data = await request<SearchPayload>(
		`/search/candidates?${params.toString()}`,
		{ method: "GET", signal },
	)

	return {
		totalCount: data.total_count,
		incompleteResults: data.incomplete_results,
		candidates: data.candidates.map(toCandidateListItem),
		rateLimit: data.rate_limit,
	}
}

type AiSearchPayload = {
	query: string
	intent: string
	parsed: {
		language: string | null
		location: string | null
		refined_query: string
	}
	candidates: Array<{
		login: string
		avatar_url: string
		html_url: string
		type: string
		gitscout_score: number
		reasoning: string
		name?: string | null
	}>
	rate_limit: RateLimit
}

export async function searchCandidatesAi(
	rawQuery: string,
	signal?: AbortSignal,
): Promise<AiSearchResponse> {
	const params = new URLSearchParams({ q: rawQuery })
	const data = await request<AiSearchPayload>(
		`/search/ai?${params.toString()}`,
		{ method: "GET", signal },
	)

	return {
		query: data.query,
		intent: data.intent,
		parsed: {
			language: data.parsed.language,
			location: data.parsed.location,
			refinedQuery: data.parsed.refined_query,
		},
		candidates: data.candidates.map((raw) => ({
			username: raw.login,
			name: raw.name ?? null,
			avatarUrl: raw.avatar_url,
			htmlUrl: raw.html_url,
			type: raw.type,
			score: raw.gitscout_score,
			reasoning: raw.reasoning,
		})),
		rateLimit: data.rate_limit,
	}
}

type ProfilePayload = {
	profile: {
		username: string
		name: string | null
		bio: string | null
		avatar_url: string
		location: string | null
		company: string | null
		blog: string | null
		joined_at: string
	}
	metrics: {
		public_repos: number
		followers: number
		following: number
		total_stars: number
	}
	languages: Record<string, number>
	top_repositories: Array<{
		name: string
		description: string | null
		stars: number
		language: string | null
		url: string
		pushed_at: string | null
	}>
	activity: {
		recent_event_count: number
		latest_event_type: string | null
		latest_event_at: string | null
	}
	gitscout_score: number
	score_breakdown: CandidateScoreBreakdown
	rate_limit: RateLimit
}

function toCandidateRepo(
	raw: ProfilePayload["top_repositories"][number],
): CandidateRepo {
	return {
		name: raw.name,
		description: raw.description,
		stars: raw.stars,
		language: raw.language,
		url: raw.url,
		pushedAt: raw.pushed_at,
	}
}

export async function getCandidateProfile(
	username: string,
	signal?: AbortSignal,
): Promise<Candidate> {
	const data = await request<ProfilePayload>(
		`/candidates/${encodeURIComponent(username)}`,
		{ method: "GET", signal },
	)

	const languages = Object.entries(data.languages)
		.sort(([, a], [, b]) => b - a)
		.map(([name]) => name)

	return {
		username: data.profile.username,
		name: data.profile.name,
		bio: data.profile.bio,
		avatarUrl: data.profile.avatar_url,
		htmlUrl: `https://github.com/${data.profile.username}`,
		location: data.profile.location,
		company: data.profile.company,
		blog: data.profile.blog,
		joinedAt: data.profile.joined_at,

		followers: data.metrics.followers,
		following: data.metrics.following,
		publicRepos: data.metrics.public_repos,
		totalStars: data.metrics.total_stars,

		languages,
		topRepositories: data.top_repositories.map(toCandidateRepo),

		recentEventCount: data.activity.recent_event_count,
		latestEventType: data.activity.latest_event_type,
		latestEventAt: data.activity.latest_event_at,

		score: data.gitscout_score,
		scoreBreakdown: data.score_breakdown,
	}
}

type ShortlistSummaryPayload = {
	id: string
	name: string
	created_at: string
	updated_at: string
	candidate_count: number
}

type ShortlistDetailPayload = {
	id: string
	name: string
	created_at: string
	updated_at: string
	candidates: Array<{
		id: string
		github_username: string
		added_at: string
	}>
}

function toShortlistSummary(raw: ShortlistSummaryPayload): ShortlistSummary {
	return {
		id: raw.id,
		name: raw.name,
		createdAt: raw.created_at,
		updatedAt: raw.updated_at,
		candidateCount: raw.candidate_count,
	}
}

function toShortlistCandidate(
	raw: ShortlistDetailPayload["candidates"][number],
): ShortlistCandidate {
	return {
		id: raw.id,
		username: raw.github_username,
		addedAt: raw.added_at,
	}
}

export async function listShortlists(
	signal?: AbortSignal,
): Promise<ShortlistSummary[]> {
	const data = await request<ShortlistSummaryPayload[]>("/shortlists", {
		method: "GET",
		signal,
	})
	return data.map(toShortlistSummary)
}

export async function getShortlist(
	id: string,
	signal?: AbortSignal,
): Promise<ShortlistDetail> {
	const data = await request<ShortlistDetailPayload>(
		`/shortlists/${encodeURIComponent(id)}`,
		{ method: "GET", signal },
	)
	return {
		id: data.id,
		name: data.name,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
		candidateCount: data.candidates.length,
		candidates: data.candidates.map(toShortlistCandidate),
	}
}

export async function createShortlist(name: string): Promise<ShortlistSummary> {
	const data = await request<ShortlistSummaryPayload>("/shortlists", {
		method: "POST",
		body: JSON.stringify({ name }),
	})
	return toShortlistSummary({
		...data,
		candidate_count: data.candidate_count ?? 0,
	})
}

export async function deleteShortlist(id: string): Promise<void> {
	await request(`/shortlists/${encodeURIComponent(id)}`, { method: "DELETE" })
}

export async function addCandidateToShortlist(
	id: string,
	username: string,
): Promise<void> {
	await request(`/shortlists/${encodeURIComponent(id)}/candidates`, {
		method: "POST",
		body: JSON.stringify({ github_username: username }),
	})
}

export async function removeCandidateFromShortlist(
	id: string,
	username: string,
): Promise<void> {
	await request(
		`/shortlists/${encodeURIComponent(id)}/candidates/${encodeURIComponent(
			username,
		)}`,
		{ method: "DELETE" },
	)
}

export type AuthUser = {
	id: string
	email: string
	created_at: string
}

type AuthPayload = { user: AuthUser }

export async function registerUser(
	email: string,
	password: string,
): Promise<AuthUser> {
	const data = await request<AuthPayload>("/auth/register", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	})
	return data.user
}

export async function loginUser(
	email: string,
	password: string,
): Promise<AuthUser> {
	const data = await request<AuthPayload>("/auth/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	})
	return data.user
}

export async function logoutUser(): Promise<void> {
	await request("/auth/logout", { method: "POST" })
}

export async function getCurrentUser(
	signal?: AbortSignal,
): Promise<AuthUser | null> {
	try {
		const data = await request<AuthPayload>("/auth/me", {
			method: "GET",
			signal,
		})
		return data.user
	} catch (err) {
		if (err instanceof ApiError && err.status === 401) return null
		throw err
	}
}
