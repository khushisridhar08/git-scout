"use client"

import Image from "next/image"
import Link from "next/link"
import type { Candidate } from "@/types/candidate"

type Props = {
	candidate: Candidate
}

function initials(name: string) {
	const parts = name.trim().split(/\s+/)
	const first = parts[0]?.[0] ?? ""
	const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : ""
	return (first + last).toUpperCase()
}

export default function CandidateCard({ candidate }: Props) {
	const name = candidate.name ?? candidate.username
	const topLanguages = candidate.languages.slice(0, 3)

	return (
		<Link
			href={`/candidates/${encodeURIComponent(candidate.username)}`}
			className="block rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/40"
		>
			<div className="flex items-start gap-3">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
					{candidate.avatarUrl ? (
						<Image
							src={candidate.avatarUrl}
							alt={name}
							width={40}
							height={40}
							unoptimized
							className="h-full w-full object-cover"
						/>
					) : (
						<span className="text-xs font-semibold text-muted-foreground">
							{initials(name)}
						</span>
					)}
				</div>

				<div className="min-w-0 flex-1">
					<div className="flex items-center justify-between gap-2">
						<div className="min-w-0">
							<p className="truncate font-semibold">{name}</p>
							<p className="truncate text-sm text-muted-foreground">
								@{candidate.username}
							</p>
						</div>

						<span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
							Score: {candidate.score}
						</span>
					</div>

					<div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
						{candidate.location && (
							<span className="rounded-md bg-muted px-2 py-1">
								{candidate.location}
							</span>
						)}
						<span className="rounded-md bg-muted px-2 py-1">
							{candidate.publicRepos} repos
						</span>
						<span className="rounded-md bg-muted px-2 py-1">
							{candidate.followers} followers
						</span>
					</div>

					{topLanguages.length > 0 && (
						<div className="mt-3 flex flex-wrap gap-2">
							{topLanguages.map((lang) => (
								<span
									key={lang}
									className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
								>
									{lang}
								</span>
							))}
						</div>
					)}
				</div>
			</div>
		</Link>
	)
}
