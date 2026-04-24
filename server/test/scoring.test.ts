import { describe, expect, it } from "bun:test"
import { scoreProfile, scoreSearchResult } from "../src/services/scoring"
import type {
	CandidateProfileResponse,
	CandidateSearchResult,
} from "../src/types/github"

function makeSearchResult(
	overrides: Partial<CandidateSearchResult> = {},
): CandidateSearchResult {
	return {
		login: "octocat",
		id: 1,
		avatar_url: "",
		html_url: "",
		score: 0.5,
		type: "User",
		...overrides,
	}
}

function makeProfile(
	overrides: Partial<CandidateProfileResponse> = {},
): CandidateProfileResponse {
	return {
		profile: {
			username: "octocat",
			name: null,
			bio: null,
			avatar_url: "",
			location: null,
			company: null,
			blog: null,
			joined_at: "2020-01-01T00:00:00Z",
		},
		metrics: {
			public_repos: 20,
			followers: 100,
			following: 10,
			total_stars: 50,
		},
		languages: { TypeScript: 5, Go: 2 },
		top_repositories: [],
		activity: {
			recent_event_count: 20,
			latest_event_type: "PushEvent",
			latest_event_at: "2026-04-20T00:00:00Z",
		},
		rate_limit: { limit: 5000, remaining: 4999, resetAt: null },
		...overrides,
	}
}

describe("scoreSearchResult", () => {
	it("rewards exact login matches over partial matches", () => {
		const exact = scoreSearchResult(makeSearchResult({ login: "react" }), {
			query: "react",
		})
		const partial = scoreSearchResult(
			makeSearchResult({ login: "react-core" }),
			{ query: "react" },
		)
		expect(exact).toBeGreaterThan(partial)
	})

	it("stays within the 0-100 range", () => {
		const high = scoreSearchResult(
			makeSearchResult({ login: "react", score: 1 }),
			{ query: "react", language: "TypeScript", location: "NYC" },
		)
		expect(high).toBeLessThanOrEqual(100)
		expect(high).toBeGreaterThanOrEqual(0)
	})
})

describe("scoreProfile", () => {
	it("produces a breakdown that sums close to the total score", () => {
		const { score, breakdown } = scoreProfile(makeProfile())
		const sum =
			breakdown.popularity +
			breakdown.activity +
			breadthOrZero(breakdown.breadth) +
			breakdown.reach
		expect(Math.abs(score - sum)).toBeLessThanOrEqual(2)
	})

	it("returns a higher score for a more active candidate", () => {
		const casual = scoreProfile(
			makeProfile({
				metrics: {
					public_repos: 2,
					followers: 5,
					following: 1,
					total_stars: 1,
				},
				activity: {
					recent_event_count: 1,
					latest_event_type: null,
					latest_event_at: null,
				},
			}),
		)
		const active = scoreProfile(makeProfile())
		expect(active.score).toBeGreaterThan(casual.score)
	})
})

function breadthOrZero(value: number | undefined): number {
	return value ?? 0
}
