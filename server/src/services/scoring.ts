import type {
	CandidateProfileResponse,
	CandidateScoreBreakdown,
	CandidateSearchResult,
} from "../types/github"

export type SearchScoreInput = {
	query: string
	language?: string
	location?: string
}

export type ScoredProfile = {
	score: number
	breakdown: CandidateScoreBreakdown
}

const MAX_SCORE = 100

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value))
}

/**
 * Scores a search result based on query relevance and filter matches.
 * Search results do not carry deep profile data, so this is deliberately
 * lightweight — the richer talent score is produced for full profiles.
 */
export function scoreSearchResult(
	candidate: CandidateSearchResult,
	input: SearchScoreInput,
): number {
	const query = input.query.trim().toLowerCase()
	const login = candidate.login.toLowerCase()

	let score = 0

	// GitHub's own relevance score (roughly 0..1), weighted heavily.
	score += clamp(candidate.score * 40, 0, 50)

	if (query.length > 0) {
		if (login === query) score += 25
		else if (login.startsWith(query)) score += 18
		else if (login.includes(query)) score += 12
		else {
			const words = query.split(/\s+/).filter(Boolean)
			const matched = words.filter((w) => login.includes(w)).length
			score += clamp(matched * 4, 0, 10)
		}
	}

	if (candidate.type === "User") score += 10
	else if (candidate.type === "Organization") score += 3

	if (input.language) score += 5
	if (input.location) score += 3

	return Math.round(clamp(score, 0, MAX_SCORE))
}

/**
 * Weighted talent score for a full candidate profile.
 *
 * Weights follow the project proposal, which emphasises verifiable
 * technical signals: starred output, recent activity, language breadth,
 * and community reach. Each sub-score is capped so no single signal can
 * dominate.
 */
export function scoreProfile(profile: CandidateProfileResponse): ScoredProfile {
	const { metrics, activity, languages } = profile

	const popularity = clamp((metrics.total_stars / 100) * 35, 0, 35)
	const activityScore = clamp((activity.recent_event_count / 30) * 30, 0, 30)
	const breadth = clamp(
		(Object.keys(languages).length / 6) * 15 + (metrics.public_repos / 40) * 5,
		0,
		20,
	)
	const reach = clamp((metrics.followers / 150) * 15, 0, 15)

	const total = popularity + activityScore + breadth + reach

	return {
		score: Math.round(clamp(total, 0, MAX_SCORE)),
		breakdown: {
			popularity: Math.round(popularity),
			activity: Math.round(activityScore),
			breadth: Math.round(breadth),
			reach: Math.round(reach),
		},
	}
}
