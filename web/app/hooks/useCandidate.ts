import { useQuery } from "@tanstack/react-query"
import type { Candidate } from "@/types/candidate"
import { getProfileByLogin } from "@/lib/mock-data"

export function useCandidate(username?: string) {
	return useQuery({
		queryKey: ["candidate", username],
		queryFn: async (): Promise<Candidate> => {
			const p = getProfileByLogin(username ?? "")
			if (!p) {
				return {
					username: username ?? "unknown",
					name: username ?? "Unknown",
					avatarUrl: "https://github.com/octocat.png",
					followers: 0,
					publicRepos: 0,
					languages: [],
					score: 0,
				}
			}
			return {
				username: p.login,
				name: p.name,
				avatarUrl: p.avatar_url,
				location: p.location,
				followers: p.followers,
				publicRepos: p.public_repos,
				totalStars: p.repos.reduce((s, r) => s + r.stars, 0),
				recentCommitCount: Math.floor(p.contributionsLastYear / 4),
				languages: p.languages.map((l) => l.name),
				score: p.gitscout_score,
			}
		},
		enabled: !!username,
	})
}
