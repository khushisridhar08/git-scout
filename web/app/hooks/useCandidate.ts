import { useQuery } from "@tanstack/react-query"
import { ApiError, getCandidateProfile } from "@/lib/api-client"
import type { Candidate } from "@/types/candidate"

export function useCandidate(username?: string) {
	return useQuery<Candidate>({
		queryKey: ["candidate", username],
		queryFn: ({ signal }) => getCandidateProfile(username ?? "", signal),
		enabled: Boolean(username),
		staleTime: 60_000,
		// Don't retry 4xx (especially 404 for typos / private accounts).
		// Only retry transient failures up to twice.
		retry: (failureCount, error) => {
			if (
				error instanceof ApiError &&
				error.status >= 400 &&
				error.status < 500
			) {
				return false
			}
			return failureCount < 2
		},
	})
}
