"use client"

import { useCallback, useState } from "react"
import Navigation from "@/components/Navigation"
import {
	DeveloperCard,
	DeveloperCardSkeleton,
	EmptyState,
	ErrorState,
	FilterPanel,
	SearchBar,
} from "@/components/search"
import { useSearchCandidates } from "@/hooks/useSearch"
import type { SearchFilters } from "@/types/search"

const RESULTS_PER_PAGE = 20

const DEFAULT_FILTERS: SearchFilters = {
	q: "",
	page: 1,
}

export default function Home() {
	const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
	const [searchInput, setSearchInput] = useState("")

	const activeFilters = filters.q.length > 0 ? filters : null
	const { data, isLoading, isError, error, refetch } =
		useSearchCandidates(activeFilters)

	const handleSearch = useCallback(() => {
		setFilters((prev) => ({ ...prev, q: searchInput.trim(), page: 1 }))
	}, [searchInput])

	const handleFilterChange = useCallback((patch: Partial<SearchFilters>) => {
		setFilters((prev) => ({ ...prev, ...patch, page: 1 }))
	}, [])

	const handleReset = useCallback(() => {
		setFilters(DEFAULT_FILTERS)
		setSearchInput("")
	}, [])

	const totalCount = data?.totalCount ?? 0
	const candidates = data?.candidates ?? []
	const page = filters.page ?? 1
	const showingStart = totalCount > 0 ? (page - 1) * RESULTS_PER_PAGE + 1 : 0
	const showingEnd = Math.min(page * RESULTS_PER_PAGE, totalCount)

	return (
		<div className="min-h-screen bg-background">
			<Navigation />

			<div className="mx-auto flex max-w-7xl gap-8 px-6 pt-24 pb-12">
				<FilterPanel
					filters={filters}
					onChange={handleFilterChange}
					onReset={handleReset}
					className="hidden lg:block"
				/>

				<main className="min-w-0 flex-1">
					<SearchBar
						value={searchInput}
						onChange={setSearchInput}
						onSubmit={handleSearch}
					/>

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

					<div className="mt-4 space-y-4">
						{isLoading &&
							Array.from({ length: 3 }).map((_, i) => (
								<DeveloperCardSkeleton key={`skeleton-${i}`} />
							))}

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
									key={candidate.username}
									candidate={candidate}
									variant="list"
								/>
							))}
					</div>

					{!isLoading &&
						candidates.length > 0 &&
						candidates.length < totalCount && (
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

					{!filters.q && !isLoading && (
						<div className="flex flex-col items-center justify-center py-20">
							<svg
								className="h-16 w-16 text-muted-foreground/30"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								aria-hidden="true"
							>
								<title>Search</title>
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
