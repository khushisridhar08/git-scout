import { useQuery } from "@tanstack/react-query"
import { searchCandidates } from "@/lib/api-client"
import type { SearchFilters, SearchResponse } from "@/types/search"

export function useSearchCandidates(filters: SearchFilters | null) {
	return useQuery<SearchResponse>({
		queryKey: ["search-candidates", filters],
		queryFn: ({ signal }) => {
			if (!filters) throw new Error("filters required")
			return searchCandidates(filters, signal)
		},
		enabled: Boolean(filters?.q && filters.q.trim().length > 0),
		staleTime: 30_000,
	})
}

export default useSearchCandidates
