import { cn } from "@/utils/cn"

type EmptyStateProps = {
	onClearFilters: () => void
	className?: string
}

export function EmptyState({ onClearFilters, className }: EmptyStateProps) {
	return (
		<div className={cn("flex flex-col items-center justify-center py-20", className)}>
			<svg
				className="h-16 w-16 text-muted-foreground/50"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
			>
				<circle cx="11" cy="11" r="8" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
				<line x1="8" y1="8" x2="14" y2="14" />
				<line x1="14" y1="8" x2="8" y2="14" />
			</svg>

			<h3 className="mt-4 text-lg font-semibold text-foreground">
				No developers found
			</h3>
			<p className="mt-1 text-center text-sm text-muted-foreground">
				Try adjusting your search query or filters to find more candidates
			</p>

			<button
				type="button"
				onClick={onClearFilters}
				className="mt-4 rounded-md border border-border/50 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
			>
				Clear all filters
			</button>
		</div>
	)
}
