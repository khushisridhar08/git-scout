"use client"

import type { Candidate } from "@/types/candidate"

function formatEventType(type: string): string {
	return type.replace(/Event$/, "").replace(/([a-z])([A-Z])/g, "$1 $2")
}

function formatRelative(iso: string): string {
	const diffMs = Date.now() - new Date(iso).getTime()
	const diffMinutes = Math.round(diffMs / 60_000)
	if (diffMinutes < 60) return `${diffMinutes}m ago`
	const diffHours = Math.round(diffMinutes / 60)
	if (diffHours < 24) return `${diffHours}h ago`
	const diffDays = Math.round(diffHours / 24)
	return `${diffDays}d ago`
}

export function ActivityTimeline({ candidate }: { candidate: Candidate }) {
	const { recentEventCount, latestEventType, latestEventAt } = candidate

	return (
		<div className="rounded-xl border bg-white p-5 shadow-sm">
			<div className="flex items-baseline justify-between">
				<h2 className="font-semibold text-base">Recent Activity</h2>
				<span className="text-gray-500 text-xs">{recentEventCount} events</span>
			</div>

			{recentEventCount === 0 ? (
				<p className="mt-4 text-gray-600 text-sm">No recent public activity.</p>
			) : (
				<p className="mt-4 text-gray-700 text-sm">
					Last seen{" "}
					{latestEventType ? formatEventType(latestEventType) : "active"}{" "}
					{latestEventAt ? formatRelative(latestEventAt) : "recently"}.
				</p>
			)}
		</div>
	)
}
