export type Candidate = {
	id: number
	login: string
	avatar_url: string
	html_url: string
	type: string
	score: number
	gitscout_score: number
	name?: string
	bio?: string
	location?: string
	public_repos?: number
	followers?: number
	following?: number
	created_at?: string
	languages?: string[]
}

export type RateLimit = {
	limit: string | null
	remaining: string | null
}

export type SearchResponse = {
	total_count: number
	rate_limit: RateLimit
	candidates: Candidate[]
}

export type SearchFilters = {
	q: string
	language?: string
	location?: string
	min_followers?: number
	min_repos?: number
	sort?: "best-match" | "followers" | "repositories" | "joined"
	order?: "asc" | "desc"
	page?: number
	per_page?: number
}

export type Shortlist = {
	id: string
	name: string
	color: string
	candidateCount: number
	createdAt: string
	tags: string[]
	candidates: Candidate[]
}
