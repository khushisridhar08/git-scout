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
import type { ApiError } from "@/lib/api-client"

export default function CandidateProfilePage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const params = useParams<{ username: string }>()

	const username = params?.username
	const backTo = searchParams.get("backTo") || "/"

	const { data: candidate, status, error } = useCandidate(username)

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

	const apiError = error as ApiError | Error | null
	const status404 =
		apiError && "status" in apiError && (apiError as ApiError).status === 404

	return (
		<div className="min-h-screen bg-background">
			<Navigation />

			<div className="mx-auto max-w-6xl space-y-6 p-4 pt-24 md:p-6 md:pt-24">
				<div className="flex items-center justify-between gap-3">
					<Link
						href={backTo}
						className="rounded border bg-card px-3 py-2 text-sm hover:bg-muted"
					>
						← Back
					</Link>
					{candidate && (
						<AddToShortlistDropdown username={candidate.username} />
					)}
				</div>

				{status === "pending" && (
					<div className="space-y-3">
						<div className="h-6 w-48 animate-pulse rounded bg-muted" />
						<div className="h-32 animate-pulse rounded bg-muted" />
						<div className="h-64 animate-pulse rounded bg-muted" />
					</div>
				)}

				{status === "error" && status404 && (
					<div className="rounded-lg border border-border/50 bg-card p-6 text-center">
						<h2 className="text-lg font-semibold text-foreground">
							No GitHub user named "{username}"
						</h2>
						<p className="mt-2 text-sm text-muted-foreground">
							We couldn&apos;t find a GitHub account with that handle.
							Double-check the spelling or try a different username.
						</p>
						<button
							type="button"
							onClick={() => router.push(backTo)}
							className="mt-4 rounded-md border border-border/50 bg-background px-4 py-2 text-sm text-foreground hover:bg-muted"
						>
							Back to search
						</button>
					</div>
				)}

				{status === "error" && !status404 && (
					<div className="space-y-2 rounded-lg border border-border/50 bg-card p-6">
						<p className="text-red-500 text-sm font-medium">
							Failed to load candidate.
						</p>
						<pre className="overflow-auto rounded border bg-muted p-3 text-xs text-foreground">
							{apiError?.message ?? "Unknown error"}
						</pre>
						<button
							type="button"
							onClick={() => router.push(backTo)}
							className="rounded-md border border-border/50 bg-background px-4 py-2 text-sm text-foreground hover:bg-muted"
						>
							Back to search
						</button>
					</div>
				)}

				{status === "success" && candidate && (
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
