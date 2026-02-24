"use client"

import { cn } from "@/utils/cn"

type SearchBarProps = {
	value: string
	onChange: (value: string) => void
	onSubmit: () => void
	className?: string
}

export function SearchBar({
	value,
	onChange,
	onSubmit,
	className,
}: SearchBarProps) {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				onSubmit()
			}}
			className={cn("relative", className)}
		>
			<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
				<svg
					className="h-4 w-4 text-muted-foreground"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
			</div>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="Search developers by name, username, or bio keywords..."
				className={cn(
					"w-full rounded-lg border border-border/50 bg-card py-3 pl-10 pr-16 text-sm",
					"text-foreground placeholder:text-muted-foreground",
					"focus:outline-none focus:ring-1 focus:ring-ring",
				)}
			/>
			<div className="absolute inset-y-0 right-0 flex items-center pr-4">
				<kbd className="rounded border border-border/50 bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
					⌘K
				</kbd>
			</div>
		</form>
	)
}
