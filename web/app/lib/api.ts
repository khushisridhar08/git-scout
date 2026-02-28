import { API_BASE_URL } from "@/config/app"
import type { SearchFilters, SearchResponse } from "@/types/search"

export async function searchCandidates(
	filters: SearchFilters,
): Promise<SearchResponse> {
	const params = new URLSearchParams()
	params.set("q", filters.q || "type:user")
	if (filters.language) params.set("language", filters.language)
	if (filters.location) params.set("location", filters.location)
	if (filters.min_followers)
		params.set("min_followers", String(filters.min_followers))
	if (filters.min_repos) params.set("min_repos", String(filters.min_repos))
	if (filters.sort) params.set("sort", filters.sort)
	if (filters.order) params.set("order", filters.order)
	params.set("page", String(filters.page ?? 1))
	params.set("per_page", String(filters.per_page ?? 20))

	const res = await fetch(
		`${API_BASE_URL}/search/candidates?${params.toString()}`,
	)
	if (!res.ok) throw new Error(`Search failed: ${res.status}`)
	return res.json()
}
