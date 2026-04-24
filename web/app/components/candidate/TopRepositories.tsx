"use client"

import type { CandidateRepo } from "@/types/candidate"

export function TopRepositories({ repos }: { repos: CandidateRepo[] }) {
	return (
		<div className="rounded-xl border bg-white p-5 shadow-sm">
			<div className="flex items-baseline justify-between">
				<h2 className="font-semibold text-base">Top Repositories</h2>
				<span className="text-gray-500 text-xs">Showing up to 5</span>
			</div>

			{repos.length === 0 ? (
				<p className="mt-4 text-gray-600 text-sm">No repositories available.</p>
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
											className="truncate font-medium text-gray-900 underline"
										>
											{repo.name}
										</a>
										{repo.language && (
											<span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700 text-xs">
												{repo.language}
											</span>
										)}
									</div>
									{repo.description && (
										<p className="mt-1 line-clamp-2 text-gray-700 text-sm">
											{repo.description}
										</p>
									)}
								</div>
								<div className="shrink-0 text-gray-600 text-xs tabular-nums">
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
