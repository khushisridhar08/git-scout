import { cn } from "@/utils/cn"

export function DeveloperCardSkeleton({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"animate-pulse rounded-lg border border-border/50 bg-card p-5",
				className,
			)}
		>
			<div className="flex items-start gap-4">
				<div className="h-12 w-12 rounded-full bg-muted" />
				<div className="min-w-0 flex-1 space-y-3">
					<div className="flex items-center gap-3">
						<div className="h-4 w-28 rounded bg-muted" />
						<div className="h-4 w-20 rounded bg-muted" />
					</div>
					<div className="space-y-2">
						<div className="h-3 w-full rounded bg-muted" />
						<div className="h-3 w-3/4 rounded bg-muted" />
					</div>
					<div className="flex gap-3">
						<div className="h-3 w-16 rounded bg-muted" />
						<div className="h-3 w-20 rounded bg-muted" />
						<div className="h-3 w-16 rounded bg-muted" />
						<div className="h-3 w-24 rounded bg-muted" />
					</div>
				</div>
			</div>
		</div>
	)
}
