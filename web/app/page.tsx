"use client"

import { useCallback, useState } from "react"
import Navigation from "@/components/Navigation"
import {
	DeveloperCard,
	DeveloperCardSkeleton,
	EmptyState,
	ErrorState,
	SearchBar,
} from "@/components/search"
import { useAiSearch } from "@/hooks/useAiSearch"

const PROMPT_SUGGESTIONS = [
	{
		label: "Senior Go engineers in Europe",
		prompt: "Senior Go engineers based in Europe with distributed systems experience",
	},
	{
		label: "Maintainers of popular TypeScript libraries",
		prompt: "Active maintainers of widely used open source TypeScript libraries",
	},
	{
		label: "ML researchers with PyTorch experience",
		prompt: "Machine learning researchers with significant PyTorch contributions",
	},
	{
		label: "React Native devs with open source impact",
		prompt: "React Native engineers with notable open source contributions",
	},
]

export default function Home() {
	const [query, setQuery] = useState<string | null>(null)
	const [searchInput, setSearchInput] = useState("")

	const { data, isLoading, isError, error, refetch } = useAiSearch(query)

	const handleSearch = useCallback(() => {
		const trimmed = searchInput.trim()
		setQuery(trimmed.length > 0 ? trimmed : null)
	}, [searchInput])

	const handlePromptClick = useCallback((prompt: string) => {
		setSearchInput(prompt)
		setQuery(prompt)
	}, [])

	const handleReset = useCallback(() => {
		setQuery(null)
		setSearchInput("")
	}, [])

	const candidates = data?.candidates ?? []

	return (
		<div className="min-h-screen bg-background">
			<Navigation />

			<div className="mx-auto max-w-3xl px-6 pt-24 pb-12">
				<SearchBar
					value={searchInput}
					onChange={setSearchInput}
					onSubmit={handleSearch}
				/>

				{query && !isError && (
					<div className="mt-6 flex items-baseline justify-between gap-4">
						<div className="min-w-0">
							<h1 className="text-lg font-semibold text-foreground">
								{isLoading
									? "Ranking candidates..."
									: `Top ${candidates.length} matches`}
							</h1>
							{data?.intent && (
								<p className="mt-1 truncate text-xs text-muted-foreground">
									{data.intent}
								</p>
							)}
						</div>
					</div>
				)}

				<div className="mt-4 space-y-4">
					{isLoading &&
						Array.from({ length: 5 }).map((_, i) => (
							<DeveloperCardSkeleton key={`skeleton-${i}`} />
						))}

					{isError && (
						<ErrorState
							message={(error as Error)?.message}
							onRetry={() => refetch()}
						/>
					)}

					{!isLoading && !isError && query && candidates.length === 0 && (
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

				{!query && !isLoading && (
					<div className="mt-12">
						<p className="text-center text-sm text-muted-foreground">
							Describe the developer you&apos;re looking for in plain English.
						</p>
						<p className="mt-1 text-center text-xs text-muted-foreground/70">
							We&apos;ll rank the top 10 GitHub matches with reasoning.
						</p>
						<div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
							{PROMPT_SUGGESTIONS.map((s) => (
								<button
									key={s.label}
									type="button"
									onClick={() => handlePromptClick(s.prompt)}
									className="group rounded-lg border border-border/50 bg-card p-4 text-left transition-colors hover:border-border hover:bg-muted/40"
								>
									<p className="text-sm text-foreground">{s.label}</p>
									<p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
										{s.prompt}
									</p>
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
