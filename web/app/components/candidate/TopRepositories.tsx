"use client"

import type { CandidateRepo } from "@/types/candidate"

export function TopRepositories({ repos }: { repos: CandidateRepo[] }) {
	return (
		<div className="rounded-xl border bg-card p-5 shadow-sm">
			<div className="flex items-baseline justify-between">
				<h2 className="font-semibold text-base">Top Repositories</h2>
				<span className="text-muted-foreground text-xs">Showing up to 5</span>
			</div>

			{repos.length === 0 ? (
				<p className="mt-4 text-muted-foreground text-sm">
					No repositories available.
				</p>
			) : (
				<div className="mt-4 divide-y">
					{repos.map((repo) => (
						<div key={repo.name} className="py-4">
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0">
									<div className="flex items-center gap-2">
										<a
											href={repo.url}
											target="_blank"
											rel="noreferrer"
											className="truncate font-medium text-foreground underline"
										>
											{repo.name}
										</a>
										{repo.language && (
											<span className="rounded-full bg-muted px-2 py-0.5 text-foreground text-xs">
												{repo.language}
											</span>
										)}
									</div>
									{repo.description && (
										<p className="mt-1 line-clamp-2 text-foreground text-sm">
											{repo.description}
										</p>
									)}
								</div>
								<div className="shrink-0 text-muted-foreground text-xs tabular-nums">
									★ {repo.stars}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
