"use client"

import { cn } from "@/utils/cn"

export function ThemeToggle({ className }: { className?: string }) {
	return (
		<button
			type="button"
			className={cn(
				"rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground",
				className,
			)}
			aria-label="Toggle theme"
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
			</svg>
		</button>
	)
}
