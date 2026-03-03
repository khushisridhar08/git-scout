"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/utils/cn"
import { RateLimitBadge } from "./RateLimitBadge"
import { ThemeToggle } from "./ThemeToggle"

type NavigationProps = {
	variant?: "fixed" | "static"
	rateLimit?: { remaining: number | null; limit: number | null }
}

type NavLink = {
	href: string
	label: string
	icon: ({ className }: { className?: string }) => React.ReactNode
	exact?: boolean
}

const NAV_LINKS: NavLink[] = [
	{ href: "/", label: "Search", icon: SearchIcon, exact: true },
	{ href: "/shortlists", label: "Shortlists", icon: BookmarkIcon },
	{ href: "/demo", label: "Demo", icon: DemoIcon },
]

export default function Navigation({
	variant = "fixed",
	rateLimit,
}: NavigationProps) {
	const pathname = usePathname()

	return (
		<nav
			className={cn(
				"z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm",
				variant === "fixed" ? "fixed top-0 left-0 right-0" : "relative",
			)}
		>
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
				<div className="flex items-center gap-6">
					<Link
						href="/"
						className="text-lg font-bold tracking-tight text-foreground"
					>
						GitScout
					</Link>
					<div className="hidden items-center gap-1 md:flex">
					{NAV_LINKS.map((link) => {
						const isActive = link.exact
							? pathname === link.href
							: pathname?.startsWith(link.href)
							return (
								<Link
									key={link.href}
									href={link.href}
									className={cn(
										"flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
										isActive
											? "text-foreground"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									<link.icon className="h-4 w-4" />
									{link.label}
								</Link>
							)
						})}
					</div>
				</div>

				<div className="flex items-center gap-3">
					<RateLimitBadge
						remaining={rateLimit?.remaining ?? null}
						limit={rateLimit?.limit ?? null}
					/>
					<div className="h-5 w-px bg-border/50" />
					<ThemeToggle />

					{/* Mobile hamburger */}
					<button
						type="button"
						className="rounded-md p-2 text-muted-foreground md:hidden"
						aria-label="Menu"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<line x1="3" y1="6" x2="21" y2="6" />
							<line x1="3" y1="12" x2="21" y2="12" />
							<line x1="3" y1="18" x2="21" y2="18" />
						</svg>
					</button>
				</div>
			</div>
		</nav>
	)
}

function SearchIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
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
	)
}

function BookmarkIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M17 21l-5-4-5 4V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2z" />
		</svg>
	)
}

function DemoIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
			<line x1="8" y1="21" x2="16" y2="21" />
			<line x1="12" y1="17" x2="12" y2="21" />
		</svg>
	)
}
