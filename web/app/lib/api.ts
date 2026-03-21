import type { SearchFilters, SearchResponse } from "@/types/search"
import { mockSearch } from "./mock-data"

export async function searchCandidates(
	filters: SearchFilters,
): Promise<SearchResponse> {
	await new Promise((r) => setTimeout(r, 400 + Math.random() * 300))
	return mockSearch(filters)
}
