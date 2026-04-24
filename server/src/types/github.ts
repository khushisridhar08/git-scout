export type RateLimit = {
	limit: number | null
	remaining: number | null
	resetAt: number | null
}

export type CandidateSearchFilters = {
	language?: string
	location?: string
	minFollowers?: number
	minRepos?: number
}

export type CandidateSearchResult = {
	login: string
	id: number
	avatar_url: string
	html_url: string
	score: number
	type: string
}

export type CandidateSearchResponse = {
	total_count: number
	incomplete_results: boolean
	candidates: CandidateSearchResult[]
	rate_limit: RateLimit
}

export type CandidateProfile = {
	username: string
	name: string | null
	bio: string | null
	avatar_url: string
	location: string | null
	company: string | null
	blog: string | null
	joined_at: string
}

export type CandidateMetrics = {
	public_repos: number
	followers: number
	following: number
	total_stars: number
}

export type CandidateRepo = {
	name: string
	description: string | null
	stars: number
	language: string | null
	url: string
	pushed_at: string | null
}

export type CandidateActivity = {
	recent_event_count: number
	latest_event_type: string | null
	latest_event_at: string | null
}

export type CandidateProfileResponse = {
	profile: CandidateProfile
	metrics: CandidateMetrics
	languages: Record<string, number>
	top_repositories: CandidateRepo[]
	activity: CandidateActivity
	rate_limit: RateLimit
}
