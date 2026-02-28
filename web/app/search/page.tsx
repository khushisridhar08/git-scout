"use client"

import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import Navigation from "@/components/Navigation"
import {
	SearchBar,
	FilterPanel,
	DeveloperCard,
	DeveloperCardSkeleton,
	EmptyState,
	ErrorState,
} from "@/components/search"
import { searchCandidates } from "@/lib/api"
import type { SearchFilters } from "@/types/search"

const DEFAULT_FILTERS: SearchFilters = {
	q: "",
	sort: "best-match",
	page: 1,
	per_page: 10,
}

export default function SearchPage() {
	const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
	const [searchInput, setSearchInput] = useState("")

	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ["search", filters],
		queryFn: () => searchCandidates(filters),
		enabled: filters.q.length > 0,
	})

	const handleSearch = useCallback(() => {
		setFilters((prev) => ({ ...prev, q: searchInput, page: 1 }))
	}, [searchInput])

	const handleFilterChange = useCallback((patch: Partial<SearchFilters>) => {
		setFilters((prev) => ({ ...prev, ...patch, page: 1 }))
	}, [])

	const handleReset = useCallback(() => {
		setFilters(DEFAULT_FILTERS)
		setSearchInput("")
	}, [])

	const rateLimit = data?.rate_limit
		? {
				remaining: Number(data.rate_limit.remaining),
				limit: Number(data.rate_limit.limit),
			}
		: undefined

	const totalCount = data?.total_count ?? 0
	const candidates = data?.candidates ?? []
	const page = filters.page ?? 1
	const perPage = filters.per_page ?? 10
	const showingStart = totalCount > 0 ? (page - 1) * perPage + 1 : 0
	const showingEnd = Math.min(page * perPage, totalCount)

	return (
		<div className="min-h-screen bg-background">
			<Navigation rateLimit={rateLimit} />

			<div className="mx-auto flex max-w-7xl gap-8 px-6 pt-24 pb-12">
				{/* Filter panel — desktop only */}
				<FilterPanel
					filters={filters}
					onChange={handleFilterChange}
					onReset={handleReset}
					className="hidden lg:block"
				/>

				{/* Main content */}
				<main className="min-w-0 flex-1">
					<SearchBar
						value={searchInput}
						onChange={setSearchInput}
						onSubmit={handleSearch}
					/>

					{/* Mobile filter chips */}
					<div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar lg:hidden">
						{["Language: Any", "Location", "Followers", `Sort: ${filters.sort || "Best Match"}`].map(
							(chip) => (
								<span
									key={chip}
									className="shrink-0 rounded-full border border-border/50 px-3 py-1 text-xs text-muted-foreground"
								>
									{chip}
								</span>
							),
						)}
					</div>

					{/* Results header */}
					{filters.q && (
						<div className="mt-6 flex items-baseline justify-between">
							<h1 className="text-lg font-semibold text-foreground">
								{totalCount.toLocaleString()} Developers Found
							</h1>
							{totalCount > 0 && (
								<span className="text-xs text-muted-foreground">
									Showing {showingStart}-{showingEnd}
								</span>
							)}
						</div>
					)}

					{/* Results body */}
					<div className="mt-4 space-y-4">
						{isLoading && (
							<>
								{Array.from({ length: 3 }).map((_, i) => (
									<DeveloperCardSkeleton key={`skeleton-${i}`} />
								))}
							</>
						)}

						{isError && (
							<ErrorState
								message={(error as Error)?.message}
								onRetry={() => refetch()}
							/>
						)}

						{!isLoading && !isError && filters.q && totalCount === 0 && (
							<EmptyState onClearFilters={handleReset} />
						)}

						{!isLoading &&
							!isError &&
							candidates.map((candidate) => (
								<DeveloperCard
									key={candidate.id}
									candidate={candidate}
									variant="list"
								/>
							))}
					</div>

					{/* Load more */}
					{!isLoading && candidates.length > 0 && candidates.length < totalCount && (
						<div className="mt-8 flex justify-center">
							<button
								type="button"
								onClick={() =>
									setFilters((prev) => ({
										...prev,
										page: (prev.page ?? 1) + 1,
									}))
								}
								className="rounded-md border border-border/50 px-6 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
							>
								Load more developers
							</button>
						</div>
					)}

					{/* Initial state — no search yet */}
					{!filters.q && !isLoading && (
						<div className="flex flex-col items-center justify-center py-20">
							<svg
								className="h-16 w-16 text-muted-foreground/30"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<circle cx="11" cy="11" r="8" />
								<line x1="21" y1="21" x2="16.65" y2="16.65" />
							</svg>
							<p className="mt-4 text-sm text-muted-foreground">
								Search for developers by name, username, or bio keywords
							</p>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}
