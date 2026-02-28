"use client"

import { cn } from "@/utils/cn"

type RateLimitBadgeProps = {
	remaining: number | null
	limit?: number | null
	className?: string
}

export function RateLimitBadge({
	remaining,
	limit,
	className,
}: RateLimitBadgeProps) {
	const isLow = remaining !== null && remaining < 100
	const isExhausted = remaining !== null && remaining <= 0

	const label = isExhausted
		? "API limit reached"
		: remaining !== null
			? `API: ${remaining} remaining`
			: "API: --"

	return (
		<div
			className={cn(
				"flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
				"border-border/50 bg-card/50",
				className,
			)}
			title={limit ? `${remaining} / ${limit} requests remaining` : undefined}
		>
			<span
				className={cn(
					"h-2 w-2 rounded-full",
					isExhausted
						? "bg-red-500"
						: isLow
							? "bg-yellow-500"
							: "bg-green-500",
				)}
			/>
			<span className="text-muted-foreground">{label}</span>
		</div>
	)
}
