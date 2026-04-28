"use client"

import type { Candidate } from "@/types/candidate"

const METRIC_LABELS: Record<keyof Candidate["scoreBreakdown"], string> = {
	popularity: "Popularity",
	activity: "Activity",
	breadth: "Language Breadth",
	reach: "Community Reach",
}

const METRIC_WEIGHTS: Record<keyof Candidate["scoreBreakdown"], number> = {
	popularity: 35,
	activity: 30,
	breadth: 20,
	reach: 15,
}

export function ScoreBreakdown({ candidate }: { candidate: Candidate }) {
	const entries = Object.entries(candidate.scoreBreakdown) as Array<
		[keyof Candidate["scoreBreakdown"], number]
	>

	return (
		<div className="rounded-xl border bg-card p-5 shadow-sm">
			<div className="flex items-baseline justify-between">
				<h2 className="font-semibold text-base">Score Breakdown</h2>
				<span className="text-muted-foreground text-sm">
					Overall:{" "}
					<span className="font-semibold text-foreground">
						{Math.round(candidate.score)}
					</span>
				</span>
			</div>

			<ul className="mt-4 space-y-3">
				{entries.map(([key, value]) => {
					const weight = METRIC_WEIGHTS[key]
					const percent = weight > 0 ? Math.min(100, (value / weight) * 100) : 0
					return (
						<li key={key} className="space-y-1">
							<div className="flex items-baseline justify-between text-sm">
								<span className="text-foreground">{METRIC_LABELS[key]}</span>
								<span className="font-medium text-foreground tabular-nums">
									{value}
									<span className="text-muted-foreground"> / {weight}</span>
								</span>
							</div>
							<div className="h-2 w-full rounded-full bg-muted">
								<div
									className="h-2 rounded-full bg-foreground"
									style={{ width: `${percent}%` }}
								/>
							</div>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
