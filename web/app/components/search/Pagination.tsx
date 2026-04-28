"use client"

type Props = {
	page: number
	totalPages?: number // optional if backend doesn't return it
	onPageChange: (nextPage: number) => void
	isLoading?: boolean
}

function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n))
}

export default function Pagination({
	page,
	totalPages,
	onPageChange,
	isLoading,
}: Props) {
	const safeTotal =
		typeof totalPages === "number" && totalPages > 0 ? totalPages : undefined

	const canPrev = page > 1 && !isLoading
	const canNext =
		(safeTotal === undefined ? true : page < safeTotal) && !isLoading

	const go = (p: number) => {
		const next = safeTotal === undefined ? Math.max(1, p) : clamp(p, 1, safeTotal)
		onPageChange(next)
	}

	return (
		<div className="flex items-center justify-center gap-2 py-6">
			<button
				type="button"
				onClick={() => go(page - 1)}
				disabled={!canPrev}
				className="rounded-md border border-border bg-background px-3 py-1.5 text-sm disabled:opacity-50"
			>
				Prev
			</button>

			<div className="px-3 text-sm text-muted-foreground">
				Page <span className="text-foreground font-medium">{page}</span>
				{safeTotal !== undefined ? (
					<>
						{" "}
						of <span className="text-foreground font-medium">{safeTotal}</span>
					</>
				) : null}
			</div>

			<button
				type="button"
				onClick={() => go(page + 1)}
				disabled={!canNext}
				className="rounded-md border border-border bg-background px-3 py-1.5 text-sm disabled:opacity-50"
			>
				Next
			</button>
		</div>
	)
}
