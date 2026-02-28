import { cn } from "@/utils/cn"

type ErrorStateProps = {
	message?: string
	onRetry: () => void
	className?: string
}

export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
	return (
		<div className={cn("flex flex-col items-center justify-center py-20", className)}>
			<svg
				className="h-16 w-16 text-red-500/70"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
			>
				<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
				<line x1="12" y1="9" x2="12" y2="13" />
				<line x1="12" y1="17" x2="12.01" y2="17" />
			</svg>

			<h3 className="mt-4 text-lg font-semibold text-foreground">
				Something went wrong
			</h3>
			<p className="mt-1 max-w-md text-center text-sm text-muted-foreground">
				{message ||
					"We couldn't load the search results. This may be due to a network issue or the GitHub API rate limit being exceeded."}
			</p>

			<div className="mt-4 flex gap-3">
				<button
					type="button"
					onClick={onRetry}
					className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
				>
					Try again
				</button>
				<a
					href="https://www.githubstatus.com/"
					target="_blank"
					rel="noopener noreferrer"
					className="rounded-md border border-border/50 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
				>
					Check API status
				</a>
			</div>
		</div>
	)
}
