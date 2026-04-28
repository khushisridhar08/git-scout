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
 * Lightweight relevance score for a search hit (0..100).
 *
 * The GitHub search API returns bare candidate summaries — no stars, no
 * repos, no activity — so this function cannot use the full talent score.
 * Instead it composes four fast-to-compute signals:
 *
 *   1. GitHub's own relevance score (≈ 0..1), scaled into 0..50
 *   2. Login-vs-query match: exact (25) > prefix (18) > substring (12)
 *      > word-match (up to 10)
 *   3. Account type bonus: User (+10) / Organization (+3)
 *   4. Filter specificity bonus: language (+5), location (+3) — when the
 *      caller supplied these, the hit is known to satisfy them
 *
 * The result is clamped to [0, 100] and rounded. This is only used to
 * re-rank the search page; the richer `scoreProfile` below is the score
 * displayed in the UI for a full candidate.
 */
export function scoreSearchResult(
	candidate: CandidateSearchResult,
	input: SearchScoreInput,
): number {
	const query = input.query.trim().toLowerCase()
	const login = candidate.login.toLowerCase()

	let score = 0

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
 * GitScout talent score for a fully-hydrated candidate profile (0..100).
 *
 * A transparent weighted sum of four verifiable GitHub signals. Every
 * component is returned in the breakdown so the UI can render each bar
 * with the exact value. Weights follow the project proposal (see SRS
 * §4 and the pitch deck):
 *
 *   ┌──────────────┬─────┬─────────────────────────────────────────────┐
 *   │ Component    │ Max │ Formula (before clamp)                      │
 *   ├──────────────┼─────┼─────────────────────────────────────────────┤
 *   │ Popularity   │ 35  │ (total_stars / 100) * 35                    │
 *   │ Activity     │ 30  │ (recent_event_count / 30) * 30              │
 *   │ Breadth      │ 20  │ langs/6*15 + public_repos/40*5              │
 *   │ Reach        │ 15  │ (followers / 150) * 15                      │
 *   └──────────────┴─────┴─────────────────────────────────────────────┘
 *
 * Each sub-score is clamped to its maximum so no single signal can
 * dominate — a developer with 100k stars and nothing else still caps
 * at 35 popularity points. The four sub-scores are rounded
 * independently, so the breakdown may sum to ±1 off the displayed
 * total (`total` is rounded from the unrounded sum).
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
