"use client"

import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ActivityTimeline } from "@/components/candidate/ActivityTimeline"
import { LanguageChart } from "@/components/candidate/LanguageChart"
import { MetricsSummary } from "@/components/candidate/MetricSummary"
import { ProfileHeader } from "@/components/candidate/ProfileHeader"
import { ScoreBreakdown } from "@/components/candidate/ScoreBreakdown"
import { TopRepositories } from "@/components/candidate/TopRepositories"
import Navigation from "@/components/Navigation"
import { AddToShortlistDropdown } from "@/components/shortlists/AddToShortlistDropdown"
import { useCandidate } from "@/hooks/useCandidate"

export default function CandidateProfilePage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const params = useParams<{ username: string }>()

	const username = params?.username
	const backTo = searchParams.get("backTo") || "/"

	const { data: candidate, isLoading, error } = useCandidate(username)

	if (!username) {
		return (
			<div className="min-h-screen bg-background">
				<Navigation />
				<div className="p-6 pt-24">
					<p className="text-red-600 text-sm">Missing username param.</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			<Navigation />

			<div className="mx-auto max-w-6xl space-y-6 p-4 pt-24 md:p-6 md:pt-24">
				<div className="flex items-center justify-between gap-3">
					<Link
						href={backTo}
						className="rounded border bg-white px-3 py-2 text-sm hover:bg-gray-50"
					>
						← Back
					</Link>
					{candidate && (
						<AddToShortlistDropdown username={candidate.username} />
					)}
				</div>

				{isLoading && (
					<div className="space-y-3">
						<div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
						<div className="h-32 animate-pulse rounded bg-gray-200" />
						<div className="h-64 animate-pulse rounded bg-gray-200" />
					</div>
				)}

				{error && (
					<div className="space-y-2">
						<p className="text-red-600 text-sm">Failed to load candidate.</p>
						<pre className="overflow-auto rounded border bg-gray-50 p-3 text-xs">
							{(error as Error).message}
						</pre>
						<button
							type="button"
							onClick={() => router.push(backTo)}
							className="rounded bg-black px-3 py-2 text-sm text-white"
						>
							Back to Search
						</button>
					</div>
				)}

				{candidate && (
					<>
						<ProfileHeader candidate={candidate} />

						<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
							<div className="space-y-6 lg:col-span-2">
								<MetricsSummary candidate={candidate} />
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<ScoreBreakdown candidate={candidate} />
									<LanguageChart languages={candidate.languages} />
								</div>
								<TopRepositories repos={candidate.topRepositories} />
							</div>
							<div className="space-y-6">
								<ActivityTimeline candidate={candidate} />
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	)
}
