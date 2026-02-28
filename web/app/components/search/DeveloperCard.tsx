import Link from "next/link"
import { cn } from "@/utils/cn"
import { ScoreBadge } from "@/components/ScoreBadge"
import type { Candidate } from "@/types/search"

type DeveloperCardProps = {
	candidate: Candidate
	variant?: "list" | "grid"
	className?: string
}

const LANGUAGE_COLORS: Record<string, string> = {
	JavaScript: "bg-yellow-500",
	TypeScript: "bg-blue-500",
	Python: "bg-green-500",
	Go: "bg-cyan-500",
	Rust: "bg-orange-500",
	Java: "bg-red-500",
	Ruby: "bg-red-600",
	"C++": "bg-pink-500",
	Swift: "bg-orange-400",
	Kotlin: "bg-purple-500",
}

export function DeveloperCard({
	candidate,
	variant = "list",
	className,
}: DeveloperCardProps) {
	const displayName = candidate.name || candidate.login
	const primaryLanguage = candidate.languages?.[0]

	if (variant === "grid") {
		return (
			<Link
				href={`/developer/${candidate.login}`}
				className={cn(
					"group rounded-lg border border-border/50 bg-card p-5 transition-colors hover:border-border",
					className,
				)}
			>
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<img
							src={candidate.avatar_url}
							alt={displayName}
							className="h-10 w-10 rounded-full bg-muted"
						/>
						<div>
							<p className="text-sm font-medium text-foreground">
								{displayName}
							</p>
							<p className="text-xs text-muted-foreground">
								@{candidate.login}
							</p>
						</div>
					</div>
					<ScoreBadge score={candidate.gitscout_score} />
				</div>

				<div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
					{candidate.public_repos !== undefined && (
						<span className="flex items-center gap-1">
							<RepoIcon className="h-3 w-3" />
							{candidate.public_repos} Repos
						</span>
					)}
					{candidate.followers !== undefined && (
						<span className="flex items-center gap-1">
							<FollowersIcon className="h-3 w-3" />
							{formatCount(candidate.followers)} Followers
						</span>
					)}
				</div>

				{candidate.languages && candidate.languages.length > 0 && (
					<div className="mt-3 flex flex-wrap gap-1.5">
						{candidate.languages.slice(0, 3).map((lang) => (
							<span
								key={lang}
								className="rounded border border-border/50 px-2 py-0.5 text-xs text-muted-foreground"
							>
								{lang}
							</span>
						))}
					</div>
				)}
			</Link>
		)
	}

	return (
		<Link
			href={`/developer/${candidate.login}`}
			className={cn(
				"group rounded-lg border border-border/50 bg-card p-5 transition-colors hover:border-border",
				className,
			)}
		>
			<div className="flex items-start gap-4">
				<img
					src={candidate.avatar_url}
					alt={displayName}
					className="h-12 w-12 rounded-full bg-muted"
				/>
				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between">
						<div>
							<span className="text-sm font-medium text-foreground">
								{displayName}
							</span>
							<span className="ml-2 text-xs text-muted-foreground">
								@{candidate.login}
							</span>
						</div>
						<ScoreBadge score={candidate.gitscout_score} />
					</div>

					{candidate.bio && (
						<p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
							{candidate.bio}
						</p>
					)}

					<div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
						{primaryLanguage && (
							<span className="flex items-center gap-1.5">
								<span
									className={cn(
										"h-2 w-2 rounded-full",
										LANGUAGE_COLORS[primaryLanguage] || "bg-gray-400",
									)}
								/>
								{primaryLanguage}
							</span>
						)}
						{candidate.followers !== undefined && (
							<span className="flex items-center gap-1">
								<FollowersIcon className="h-3 w-3" />
								{formatCount(candidate.followers)} followers
							</span>
						)}
						{candidate.public_repos !== undefined && (
							<span className="flex items-center gap-1">
								<RepoIcon className="h-3 w-3" />
								{candidate.public_repos} repos
							</span>
						)}
						{candidate.location && (
							<span className="flex items-center gap-1">
								<LocationIcon className="h-3 w-3" />
								{candidate.location}
							</span>
						)}
					</div>
				</div>
			</div>
		</Link>
	)
}

function formatCount(n: number): string {
	if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
	return String(n)
}

function RepoIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
		>
			<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
			<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
		</svg>
	)
}

function FollowersIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
		>
			<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	)
}

function LocationIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
		>
			<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
			<circle cx="12" cy="10" r="3" />
		</svg>
	)
}
