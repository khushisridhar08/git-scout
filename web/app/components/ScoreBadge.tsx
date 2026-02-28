import { cn } from "@/utils/cn"

type ScoreBadgeProps = {
	score: number
	size?: "sm" | "md" | "lg"
	className?: string
}

export function ScoreBadge({ score, size = "sm", className }: ScoreBadgeProps) {
	const sizeClasses = {
		sm: "h-7 w-7 text-xs",
		md: "h-9 w-9 text-sm",
		lg: "h-14 w-14 text-lg",
	}

	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-full font-semibold",
				"bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30",
				sizeClasses[size],
				className,
			)}
		>
			{score}
		</div>
	)
}
