"use client"

import type { Candidate } from "@/types/candidate"

function MetricCard({
	label,
	value,
}: {
	label: string
	value: number | string
}) {
	return (
		<div className="rounded-xl border bg-card p-4 shadow-sm">
			<div className="text-xs text-muted-foreground">{label}</div>
			<div className="mt-1 font-semibold text-xl tabular-nums">{value}</div>
		</div>
	)
}

export function MetricsSummary({ candidate }: { candidate: Candidate }) {
	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
			<MetricCard label="Repositories" value={candidate.publicRepos} />
			<MetricCard label="Followers" value={candidate.followers} />
			<MetricCard label="Total Stars" value={candidate.totalStars} />
			<MetricCard
				label="Recent Activity"
				value={`${candidate.recentEventCount} events`}
			/>
		</div>
	)
}
