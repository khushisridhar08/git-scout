import type { CandidateListItem } from "./candidate"

export type RateLimit = {
	limit: number | null
	remaining: number | null
	resetAt: number | null
}

export type SearchFilters = {
	q: string
	language?: string
	location?: string
	min_followers?: number
	min_repos?: number
	page?: number
}

export type SearchResponse = {
	totalCount: number
	incompleteResults: boolean
	candidates: CandidateListItem[]
	rateLimit: RateLimit
}
