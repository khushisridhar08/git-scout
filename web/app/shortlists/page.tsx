"use client"

import Navigation from "@/components/Navigation"
import type { Shortlist } from "@/types/search"

const MOCK_SHORTLISTS: Shortlist[] = [
	{
		id: "1",
		name: "Frontend Engineers",
		color: "bg-blue-500",
		candidateCount: 12,
		createdAt: "Feb 10, 2026",
		tags: ["React", "TypeScript", "Next.js"],
		candidates: [],
	},
	{
		id: "2",
		name: "ML & Data Science",
		color: "bg-green-500",
		candidateCount: 8,
		createdAt: "Feb 5, 2026",
		tags: ["Python", "TensorFlow", "PyTorch"],
		candidates: [],
	},
	{
		id: "3",
		name: "Backend Specialists",
		color: "bg-purple-500",
		candidateCount: 15,
		createdAt: "Jan 28, 2026",
		tags: ["Go", "Rust", "Kubernetes"],
		candidates: [],
	},
]

export default function ShortlistsPage() {
	return (
		<div className="min-h-screen bg-background">
			<Navigation />

			<div className="mx-auto max-w-4xl px-6 pt-24 pb-12">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-foreground">
						Your Shortlists
					</h1>
					<button
						type="button"
						className="flex items-center gap-2 rounded-md border border-border/50 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
					>
						<svg
							className="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<line x1="12" y1="5" x2="12" y2="19" />
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
						Create New Shortlist
					</button>
				</div>

				<div className="mt-8 space-y-4">
					{MOCK_SHORTLISTS.map((shortlist) => (
						<ShortlistCard key={shortlist.id} shortlist={shortlist} />
					))}
				</div>
			</div>
		</div>
	)
}

function ShortlistCard({ shortlist }: { shortlist: Shortlist }) {
	return (
		<div className="rounded-lg border border-border/50 bg-card p-6 transition-colors hover:border-border">
			<div className="flex items-start justify-between">
				<div>
					<div className="flex items-center gap-2">
						<span className={`h-2.5 w-2.5 rounded-full ${shortlist.color}`} />
						<h3 className="font-semibold text-foreground">{shortlist.name}</h3>
					</div>
					<p className="mt-1 text-sm text-muted-foreground">
						{shortlist.candidateCount} candidates · Created{" "}
						{shortlist.createdAt}
					</p>
				</div>

				<div className="flex items-center gap-3">
					{/* Avatar stack preview */}
					<div className="flex -space-x-2">
						{[0, 1, 2].map((i) => (
							<div
								key={i}
								className="h-8 w-8 rounded-full border-2 border-card bg-muted"
							/>
						))}
					</div>
					<button
						type="button"
						className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						aria-label="More options"
					>
						<svg
							className="h-4 w-4"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<circle cx="12" cy="5" r="2" />
							<circle cx="12" cy="12" r="2" />
							<circle cx="12" cy="19" r="2" />
						</svg>
					</button>
				</div>
			</div>

			<div className="mt-3 flex flex-wrap gap-1.5">
				{shortlist.tags.map((tag) => (
					<span
						key={tag}
						className="rounded border border-border/50 px-2 py-0.5 text-xs text-muted-foreground"
					>
						{tag}
					</span>
				))}
			</div>
		</div>
	)
}
