"use client"

import { cn } from "@/utils/cn"
import type { SearchFilters } from "@/types/search"

const LANGUAGES = [
	"Any Language",
	"JavaScript",
	"TypeScript",
	"Python",
	"Go",
	"Rust",
	"Java",
	"C++",
	"Ruby",
	"Swift",
	"Kotlin",
]

const SORT_OPTIONS = [
	{ value: "best-match", label: "Best Match" },
	{ value: "followers", label: "Most Followers" },
	{ value: "repositories", label: "Most Repos" },
	{ value: "joined", label: "Recently Joined" },
]

type FilterPanelProps = {
	filters: SearchFilters
	onChange: (filters: Partial<SearchFilters>) => void
	onReset: () => void
	className?: string
}

export function FilterPanel({
	filters,
	onChange,
	onReset,
	className,
}: FilterPanelProps) {
	return (
		<aside className={cn("w-[280px] shrink-0 space-y-6", className)}>
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-semibold text-foreground">Filters</h2>
				<button
					type="button"
					onClick={onReset}
					className="text-xs text-muted-foreground transition-colors hover:text-foreground"
				>
					Reset
				</button>
			</div>

			<FilterSection label="Primary Language">
				<select
					value={filters.language || ""}
					onChange={(e) =>
						onChange({
							language: e.target.value || undefined,
						})
					}
					className={cn(selectClasses)}
				>
					{LANGUAGES.map((lang) => (
						<option
							key={lang}
							value={lang === "Any Language" ? "" : lang}
						>
							{lang}
						</option>
					))}
				</select>
			</FilterSection>

			<FilterSection label="Location">
				<input
					type="text"
					value={filters.location || ""}
					onChange={(e) => onChange({ location: e.target.value || undefined })}
					placeholder="e.g. San Francisco"
					className={cn(inputClasses)}
				/>
			</FilterSection>

			<FilterSection label="Followers">
				<div className="flex items-center gap-2">
					<input
						type="number"
						placeholder="Min"
						value={filters.min_followers || ""}
						onChange={(e) =>
							onChange({
								min_followers: e.target.value
									? Number(e.target.value)
									: undefined,
							})
						}
						className={cn(inputClasses, "w-full")}
					/>
					<span className="text-muted-foreground text-xs">-</span>
					<input
						type="number"
						placeholder="Max"
						className={cn(inputClasses, "w-full")}
						disabled
					/>
				</div>
			</FilterSection>

			<FilterSection label="Public Repositories">
				<div className="flex items-center gap-2">
					<input
						type="number"
						placeholder="Min"
						value={filters.min_repos || ""}
						onChange={(e) =>
							onChange({
								min_repos: e.target.value
									? Number(e.target.value)
									: undefined,
							})
						}
						className={cn(inputClasses, "w-full")}
					/>
					<span className="text-muted-foreground text-xs">-</span>
					<input
						type="number"
						placeholder="Max"
						className={cn(inputClasses, "w-full")}
						disabled
					/>
				</div>
			</FilterSection>

			<FilterSection label="Sort Results By">
				<select
					value={filters.sort || "best-match"}
					onChange={(e) =>
						onChange({
							sort: e.target.value as SearchFilters["sort"],
						})
					}
					className={cn(selectClasses)}
				>
					{SORT_OPTIONS.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</FilterSection>
		</aside>
	)
}

function FilterSection({
	label,
	children,
}: { label: string; children: React.ReactNode }) {
	return (
		<div className="space-y-2">
			<label className="text-xs text-muted-foreground">{label}</label>
			{children}
		</div>
	)
}

const inputClasses =
	"rounded-md border border-border/50 bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"

const selectClasses =
	"w-full rounded-md border border-border/50 bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
