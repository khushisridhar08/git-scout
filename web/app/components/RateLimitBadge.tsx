"use client"

import { useEffect, useState } from "react"
import { getLatestRateLimit, subscribeToRateLimit } from "@/lib/api-client"
import type { RateLimit } from "@/types/search"
import { cn } from "@/utils/cn"

type RateLimitBadgeProps = {
	className?: string
}

export function RateLimitBadge({ className }: RateLimitBadgeProps) {
	const [rateLimit, setRateLimit] = useState<RateLimit>(getLatestRateLimit())

	useEffect(() => {
		setRateLimit(getLatestRateLimit())
		return subscribeToRateLimit(setRateLimit)
	}, [])

	const { remaining, limit } = rateLimit
	const isExhausted = remaining !== null && remaining <= 0
	const isLow = remaining !== null && remaining > 0 && remaining < 100

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
			title={
				limit !== null && remaining !== null
					? `${remaining} / ${limit} requests remaining`
					: undefined
			}
		>
			<span
				className={cn(
					"h-2 w-2 rounded-full",
					isExhausted ? "bg-red-500" : isLow ? "bg-yellow-500" : "bg-green-500",
				)}
			/>
			<span className="text-muted-foreground">{label}</span>
		</div>
	)
}
