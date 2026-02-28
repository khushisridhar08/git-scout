"use client"

import { use } from "react"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import { ScoreBadge } from "@/components/ScoreBadge"

const MOCK_PROFILE = {
	login: "elenarodr",
	name: "Elena Rodriguez",
	avatar_url: "",
	bio: "Senior Frontend Engineer specializing in React, Next.js, and complex interactive UIs. Open source contributor to UI libraries and design systems.",
	location: "San Francisco, CA",
	blog: "elenarodriguez.dev",
	public_repos: 128,
	followers: 4200,
	following: 892,
	created_at: "2018-03-15T00:00:00Z",
	gitscout_score: 94,
	languages: [
		{ name: "JavaScript", percentage: 45, color: "bg-yellow-500" },
		{ name: "TypeScript", percentage: 35, color: "bg-blue-500" },
		{ name: "CSS", percentage: 12, color: "bg-pink-500" },
		{ name: "HTML", percentage: 8, color: "bg-red-500" },
	],
	repos: [
		{
			name: "react-design-system",
			description: "A comprehensive React component library.",
			stars: 45000,
			forks: 20,
			language: "JavaScript",
			languageColor: "bg-yellow-500",
		},
		{
			name: "nextjs-dashboard",
			description: "Admin dashboard template.",
			stars: 43000,
			forks: 22,
			language: "TypeScript",
			languageColor: "bg-blue-500",
		},
		{
			name: "css-utilities",
			description: "Lightweight CSS utility framework.",
			stars: 130,
			forks: 13,
			language: "TypeScript",
			languageColor: "bg-blue-500",
		},
		{
			name: "nextjs-repo",
			description: "Admin dashboard template.",
			stars: 138,
			forks: 30,
			language: "TypeScript",
			languageColor: "bg-blue-500",
		},
	],
	contributionsLastYear: 1247,
}

export default function DeveloperProfilePage({
	params,
}: { params: Promise<{ username: string }> }) {
	const { username } = use(params)
	const profile = MOCK_PROFILE

	return (
		<div className="min-h-screen bg-background">
			<Navigation />

			<div className="mx-auto max-w-4xl px-6 pt-24 pb-12">
				{/* Header */}
				<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex items-start gap-5">
						<div className="h-20 w-20 shrink-0 rounded-full bg-muted" />
						<div>
							<h1 className="text-2xl font-bold text-foreground">
								{profile.name}
							</h1>
							<p className="text-muted-foreground">@{username}</p>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<ScoreBadge score={profile.gitscout_score} size="lg" />
						<div className="space-y-2">
							<button
								type="button"
								className="flex w-full items-center justify-center gap-2 rounded-md border border-border/50 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
							>
								<BookmarkIcon className="h-4 w-4" />
								Add to Shortlist
							</button>
							<a
								href={`https://github.com/${username}`}
								target="_blank"
								rel="noopener noreferrer"
								className="flex w-full items-center justify-center gap-2 rounded-md border border-border/50 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
							>
								<GithubIcon className="h-4 w-4" />
								View on GitHub
							</a>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
					{[
						{ label: "Repositories", value: profile.public_repos },
						{
							label: "Followers",
							value: formatCount(profile.followers),
						},
						{ label: "Following", value: profile.following },
						{
							label: "Joined",
							value: new Date(profile.created_at).getFullYear(),
						},
					].map((stat) => (
						<div
							key={stat.label}
							className="rounded-lg border border-border/50 bg-card p-4"
						>
							<p className="text-2xl font-semibold text-foreground">
								{stat.value}
							</p>
							<p className="text-xs text-muted-foreground">{stat.label}</p>
						</div>
					))}
				</div>

				{/* Bio */}
				<section className="mt-8">
					<h2 className="text-sm font-semibold text-foreground">Bio</h2>
					<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
						{profile.bio}
					</p>
					<div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
						{profile.location && (
							<span className="flex items-center gap-1.5">
								<LocationIcon className="h-3.5 w-3.5" />
								{profile.location}
							</span>
						)}
						{profile.blog && (
							<a
								href={`https://${profile.blog}`}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1.5 hover:text-foreground"
							>
								<LinkIcon className="h-3.5 w-3.5" />
								{profile.blog}
							</a>
						)}
					</div>
				</section>

				{/* Top Languages */}
				<section className="mt-8">
					<h2 className="text-sm font-semibold text-foreground">
						Top Languages
					</h2>
					<div className="mt-3 flex h-2.5 overflow-hidden rounded-full">
						{profile.languages.map((lang) => (
							<div
								key={lang.name}
								className={lang.color}
								style={{ width: `${lang.percentage}%` }}
							/>
						))}
					</div>
					<div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
						{profile.languages.map((lang) => (
							<span key={lang.name} className="flex items-center gap-1.5">
								<span className={`h-2 w-2 rounded-full ${lang.color}`} />
								{lang.name}{" "}
								<span className="text-muted-foreground/60">
									{lang.percentage}%
								</span>
							</span>
						))}
					</div>
				</section>

				{/* Popular Repositories */}
				<section className="mt-8">
					<h2 className="text-sm font-semibold text-foreground">
						Popular Repositories
					</h2>
					<div className="mt-3 grid gap-4 sm:grid-cols-2">
						{profile.repos.map((repo) => (
							<div
								key={repo.name}
								className="rounded-lg border border-border/50 bg-card p-4"
							>
								<p className="font-medium text-foreground">{repo.name}</p>
								<p className="mt-1 text-xs text-muted-foreground line-clamp-2">
									{repo.description}
								</p>
								<div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
									<span className="flex items-center gap-1">
										<StarIcon className="h-3 w-3" />
										{formatCount(repo.stars)}
									</span>
									<span className="flex items-center gap-1">
										<ForkIcon className="h-3 w-3" />
										{repo.forks}
									</span>
									<span className="flex items-center gap-1.5">
										<span
											className={`h-2 w-2 rounded-full ${repo.languageColor}`}
										/>
										{repo.language}
									</span>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Contribution Activity */}
				<section className="mt-8">
					<div className="flex items-baseline justify-between">
						<h2 className="text-sm font-semibold text-foreground">
							Contribution Activity
						</h2>
						<span className="text-xs text-muted-foreground">
							{profile.contributionsLastYear.toLocaleString()} contributions in
							the last year
						</span>
					</div>
					<div className="mt-3 rounded-lg border border-border/50 bg-card p-4">
						<ContributionGrid />
					</div>
				</section>

				{/* Back link */}
				<div className="mt-10">
					<Link
						href="/search"
						className="text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						&larr; Back to search
					</Link>
				</div>
			</div>
		</div>
	)
}

function ContributionGrid() {
	const weeks = 52
	const days = 7
	return (
		<div className="flex gap-[3px] overflow-x-auto no-scrollbar">
			{Array.from({ length: weeks }).map((_, weekIndex) => (
				<div key={`week-${weekIndex}`} className="flex flex-col gap-[3px]">
					{Array.from({ length: days }).map((_, dayIndex) => {
						const intensity = Math.random()
						let color = "bg-muted/50"
						if (intensity > 0.8) color = "bg-green-500"
						else if (intensity > 0.6) color = "bg-green-600/70"
						else if (intensity > 0.4) color = "bg-green-700/50"
						else if (intensity > 0.2) color = "bg-green-900/30"
						return (
							<div
								key={`day-${weekIndex}-${dayIndex}`}
								className={`h-2.5 w-2.5 rounded-sm ${color}`}
							/>
						)
					})}
				</div>
			))}
		</div>
	)
}

function formatCount(n: number): string {
	if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
	return String(n)
}

function BookmarkIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
		>
			<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
		</svg>
	)
}

function GithubIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
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

function LinkIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
		>
			<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
			<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
		</svg>
	)
}

function StarIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
		>
			<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
		</svg>
	)
}

function ForkIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
		>
			<circle cx="12" cy="18" r="3" />
			<circle cx="6" cy="6" r="3" />
			<circle cx="18" cy="6" r="3" />
			<path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
			<path d="M12 12v3" />
		</svg>
	)
}
