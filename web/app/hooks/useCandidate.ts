import { useQuery } from "@tanstack/react-query"
import { getCandidateProfile } from "@/lib/api-client"
import type { Candidate } from "@/types/candidate"

export function useCandidate(username?: string) {
	return useQuery<Candidate>({
		queryKey: ["candidate", username],
		queryFn: ({ signal }) => getCandidateProfile(username ?? "", signal),
		enabled: Boolean(username),
		staleTime: 60_000,
	})
}
