"use client"

import { useState, useEffect, useCallback } from "react"
import Navigation from "@/components/Navigation"
import { cn } from "@/utils/cn"

type Screen = {
	id: string
	src: string
	title: string
	description: string
	category: Category
}

type Category = "navigation" | "search" | "states" | "pages" | "responsive"

const CATEGORIES: { id: Category; label: string }[] = [
	{ id: "navigation", label: "Navigation" },
	{ id: "search", label: "Search" },
	{ id: "states", label: "UI States" },
	{ id: "pages", label: "Pages" },
	{ id: "responsive", label: "Responsive" },
]

const SCREENS: Screen[] = [
	{
		id: "nav-wireframe",
		src: "/demo/nav-wireframe.png",
		title: "Navigation Bar",
		description:
			"Global top navigation with GitScout logo, Search and Shortlists links, API rate limit indicator, and theme toggle.",
		category: "navigation",
	},
	{
		id: "rate-limit-states",
		src: "/demo/rate-limit-states.png",
		title: "Rate Limit States",
		description:
			"Three visual states for the API rate limit badge: healthy (320 remaining), warning (80 remaining), and exhausted (limit reached).",
		category: "navigation",
	},
	{
		id: "search-page-layout",
		src: "/demo/search-page-layout.png",
		title: "Search Page",
		description:
			"Primary search view with left filter panel (language, location, followers, repos, sort), search bar, results summary, and developer cards in a list layout.",
		category: "search",
	},
	{
		id: "search-results-layout",
		src: "/demo/search-results-layout.png",
		title: "Search Results Grid",
		description:
			"Alternative grid layout with 4-column cards showing avatar, name, GitScout score badge, repo/follower counts, and skill tags. Includes pagination.",
		category: "search",
	},
	{
		id: "loading-skeleton-state",
		src: "/demo/loading-skeleton-state.png",
		title: "Loading State",
		description:
			"Skeleton placeholders displayed while search results are fetching. Maintains the same layout structure to prevent layout shift.",
		category: "states",
	},
	{
		id: "empty-state",
		src: "/demo/empty-state.png",
		title: "Empty State",
		description:
			'Shown when a search returns zero results. Magnifying glass icon with "No developers found" message and a clear filters action.',
		category: "states",
	},
	{
		id: "error-state",
		src: "/demo/error-state.png",
		title: "Error State",
		description:
			'Displayed on API or network failure. Warning icon with "Something went wrong" message, retry button, and link to check API status.',
		category: "states",
	},
	{
		id: "developer-profile-detail",
		src: "/demo/developer-profile-detail.png",
		title: "Developer Profile",
		description:
			"Full-width profile detail page with avatar, GitScout score, stats bar, bio, top languages chart, popular repositories grid, and contribution heatmap.",
		category: "pages",
	},
	{
		id: "shortlists-page",
		src: "/demo/shortlists-page.png",
		title: "Shortlists",
		description:
			"Shortlist management page showing saved developer lists with candidate counts, creation dates, avatar previews, and technology tags.",
		category: "pages",
	},
	{
		id: "mobile-responsive-view",
		src: "/demo/mobile-responsive-view.png",
		title: "Mobile Layout",
		description:
			"Responsive mobile view with hamburger navigation, full-width search, horizontal filter chips, and single-column stacked cards.",
		category: "responsive",
	},
]

export default function Home() {
	const [activeCategory, setActiveCategory] = useState<Category | "all">("all")
	const [lightbox, setLightbox] = useState<Screen | null>(null)

	const filtered =
		activeCategory === "all"
			? SCREENS
			: SCREENS.filter((s) => s.category === activeCategory)

	const lightboxIndex = lightbox
		? filtered.findIndex((s) => s.id === lightbox.id)
		: -1

	const navigateLightbox = useCallback(
		(direction: -1 | 1) => {
			if (lightboxIndex < 0) return
			const next = lightboxIndex + direction
			if (next >= 0 && next < filtered.length) {
				setLightbox(filtered[next])
			}
		},
		[lightboxIndex, filtered],
	)

	useEffect(() => {
		if (!lightbox) return
		function handleKey(e: KeyboardEvent) {
			if (e.key === "Escape") setLightbox(null)
			if (e.key === "ArrowRight") navigateLightbox(1)
			if (e.key === "ArrowLeft") navigateLightbox(-1)
		}
		document.addEventListener("keydown", handleKey)
		return () => document.removeEventListener("keydown", handleKey)
	}, [lightbox, navigateLightbox])

	return (
		<div className="min-h-screen bg-background">
			<Navigation />

			<div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
				<div className="max-w-2xl">
					<h1 className="text-3xl font-bold tracking-tight text-foreground">
						Design Prototypes
					</h1>
					<p className="mt-2 text-muted-foreground">
						Interactive walkthrough of the GitScout UI design mockups. Click any
						screen to view fullscreen. Navigate with arrow keys.
					</p>
				</div>

				{/* Category filter tabs */}
				<div className="mt-8 flex gap-1 overflow-x-auto no-scrollbar border-b border-border/50 pb-px">
					<TabButton
						active={activeCategory === "all"}
						onClick={() => setActiveCategory("all")}
					>
						All
					</TabButton>
					{CATEGORIES.map((cat) => (
						<TabButton
							key={cat.id}
							active={activeCategory === cat.id}
							onClick={() => setActiveCategory(cat.id)}
						>
							{cat.label}
						</TabButton>
					))}
				</div>

				{/* Gallery grid */}
				<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((screen) => (
						<button
							key={screen.id}
							type="button"
							onClick={() => setLightbox(screen)}
							className="group text-left"
						>
							<div className="overflow-hidden rounded-lg border border-border/50 bg-card transition-all group-hover:border-border group-hover:ring-1 group-hover:ring-ring/20">
								<div className="relative aspect-video bg-muted/30">
									<img
										src={screen.src}
										alt={screen.title}
										className="h-full w-full object-cover object-top"
									/>
									<div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
										<ExpandIcon className="h-8 w-8 text-white drop-shadow-lg" />
									</div>
								</div>
							</div>
							<h3 className="mt-3 text-sm font-medium text-foreground">
								{screen.title}
							</h3>
							<p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
								{screen.description}
							</p>
						</button>
					))}
				</div>

				<p className="mt-8 text-center text-xs text-muted-foreground">
					{filtered.length} of {SCREENS.length} screens
				</p>
			</div>

			{/* Lightbox overlay */}
			{lightbox && (
				<Lightbox
					screen={lightbox}
					index={lightboxIndex}
					total={filtered.length}
					onClose={() => setLightbox(null)}
					onPrev={() => navigateLightbox(-1)}
					onNext={() => navigateLightbox(1)}
				/>
			)}
		</div>
	)
}

function TabButton({
	active,
	onClick,
	children,
}: {
	active: boolean
	onClick: () => void
	children: React.ReactNode
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"shrink-0 border-b-2 px-4 py-2 text-sm transition-colors",
				active
					? "border-foreground text-foreground"
					: "border-transparent text-muted-foreground hover:text-foreground",
			)}
		>
			{children}
		</button>
	)
}

function Lightbox({
	screen,
	index,
	total,
	onClose,
	onPrev,
	onNext,
}: {
	screen: Screen
	index: number
	total: number
	onClose: () => void
	onPrev: () => void
	onNext: () => void
}) {
	const hasPrev = index > 0
	const hasNext = index < total - 1

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
			<button
				type="button"
				onClick={onClose}
				className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
				aria-label="Close"
			>
				<svg
					className="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>

			{hasPrev && (
				<button
					type="button"
					onClick={onPrev}
					className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
					aria-label="Previous"
				>
					<svg
						className="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<polyline points="15 18 9 12 15 6" />
					</svg>
				</button>
			)}

			{hasNext && (
				<button
					type="button"
					onClick={onNext}
					className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
					aria-label="Next"
				>
					<svg
						className="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<polyline points="9 18 15 12 9 6" />
					</svg>
				</button>
			)}

			<div className="flex max-h-[90vh] max-w-[90vw] flex-col items-center">
				<img
					src={screen.src}
					alt={screen.title}
					className="max-h-[75vh] rounded-lg object-contain shadow-2xl"
				/>
				<div className="mt-4 text-center">
					<h2 className="text-lg font-semibold text-white">{screen.title}</h2>
					<p className="mt-1 max-w-xl text-sm text-white/60">
						{screen.description}
					</p>
					<p className="mt-2 text-xs text-white/40">
						{index + 1} / {total} &middot; Arrow keys to navigate, Esc to close
					</p>
				</div>
			</div>
		</div>
	)
}

function ExpandIcon({ className }: { className?: string }) {
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
			<polyline points="15 3 21 3 21 9" />
			<polyline points="9 21 3 21 3 15" />
			<line x1="21" y1="3" x2="14" y2="10" />
			<line x1="3" y1="21" x2="10" y2="14" />
		</svg>
	)
}
