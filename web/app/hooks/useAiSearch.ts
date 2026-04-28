import { useQuery } from "@tanstack/react-query"
import { searchCandidatesAi } from "@/lib/api-client"
import type { AiSearchResponse } from "@/types/search"

export function useAiSearch(query: string | null) {
	return useQuery<AiSearchResponse>({
		queryKey: ["ai-search", query],
		queryFn: ({ signal }) => {
			if (!query) throw new Error("query required")
			return searchCandidatesAi(query, signal)
		},
		enabled: Boolean(query && query.trim().length > 0),
		staleTime: 5 * 60_000,
		retry: false,
	})
}

export default useAiSearch
