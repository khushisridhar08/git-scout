"use client"

import type { CandidateListItem } from "@/types/candidate"
import { DeveloperCard } from "./DeveloperCard"
import { DeveloperCardSkeleton } from "./DeveloperCardSkeleton"

type Props = {
	candidates: CandidateListItem[]
	isLoading?: boolean
}

export default function CandidateGrid({ candidates, isLoading }: Props) {
	if (isLoading) {
		return (
			<div className="grid gap-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<DeveloperCardSkeleton key={`skeleton-${i}`} />
				))}
			</div>
		)
	}

	if (candidates.length === 0) {
		return <p className="text-sm text-muted-foreground">No results</p>
	}

	return (
		<div className="grid gap-4">
			{candidates.map((candidate) => (
				<DeveloperCard
					key={candidate.username}
					candidate={candidate}
					variant="list"
				/>
			))}
		</div>
	)
}
