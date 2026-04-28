export type CandidateRepo = {
	name: string
	description: string | null
	stars: number
	language: string | null
	url: string
	pushedAt: string | null
}

export type CandidateScoreBreakdown = {
	popularity: number
	activity: number
	breadth: number
	reach: number
}

/**
 * A lightweight candidate shape for search result cards.
 * Search results don't carry repository or activity detail.
 */
export type CandidateListItem = {
	username: string
	name: string | null
	avatarUrl: string
	htmlUrl: string
	type: string
	score: number
	reasoning?: string
}

/**
 * A full candidate profile, returned from GET /candidates/:username.
 */
export type Candidate = {
	username: string
	name: string | null
	bio: string | null
	avatarUrl: string
	htmlUrl: string
	location: string | null
	company: string | null
	blog: string | null
	joinedAt: string

	followers: number
	following: number
	publicRepos: number
	totalStars: number

	languages: string[]
	topRepositories: CandidateRepo[]

	recentEventCount: number
	latestEventType: string | null
	latestEventAt: string | null

	score: number
	scoreBreakdown: CandidateScoreBreakdown
}
