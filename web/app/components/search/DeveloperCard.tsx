import Image from "next/image"
import Link from "next/link"
import { ScoreBadge } from "@/components/ScoreBadge"
import type { CandidateListItem } from "@/types/candidate"
import { cn } from "@/utils/cn"

type DeveloperCardProps = {
	candidate: CandidateListItem
	variant?: "list" | "grid"
	className?: string
}

export function DeveloperCard({
	candidate,
	variant = "list",
	className,
}: DeveloperCardProps) {
	const displayName = candidate.name ?? candidate.username
	const href = `/candidates/${encodeURIComponent(candidate.username)}`

	if (variant === "grid") {
		return (
			<Link
				href={href}
				className={cn(
					"group rounded-lg border border-border/50 bg-card p-5 transition-colors hover:border-border",
					className,
				)}
			>
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<Image
							src={candidate.avatarUrl}
							alt={displayName}
							width={40}
							height={40}
							unoptimized
							className="h-10 w-10 rounded-full bg-muted"
						/>
						<div>
							<p className="text-sm font-medium text-foreground">
								{displayName}
							</p>
							<p className="text-xs text-muted-foreground">
								@{candidate.username}
							</p>
						</div>
					</div>
					<ScoreBadge score={candidate.score} />
				</div>
			</Link>
		)
	}

	return (
		<Link
			href={href}
			className={cn(
				"group rounded-lg border border-border/50 bg-card p-5 transition-colors hover:border-border",
				className,
			)}
		>
			<div className="flex items-start gap-4">
				<Image
					src={candidate.avatarUrl}
					alt={displayName}
					width={48}
					height={48}
					unoptimized
					className="h-12 w-12 rounded-full bg-muted"
				/>
				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between">
						<div>
							<span className="text-sm font-medium text-foreground">
								{displayName}
							</span>
							<span className="ml-2 text-xs text-muted-foreground">
								@{candidate.username}
							</span>
						</div>
						<ScoreBadge score={candidate.score} />
					</div>
					<p className="mt-1 text-xs text-muted-foreground">
						{candidate.type === "Organization" ? "Organization" : "Developer"}
					</p>
				</div>
			</div>
		</Link>
	)
}
