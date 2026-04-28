"use client"

import Image from "next/image"
import type { Candidate } from "@/types/candidate"

export function ProfileHeader({ candidate }: { candidate: Candidate }) {
	return (
		<div className="rounded-xl border bg-white p-5 shadow-sm">
			<div className="flex items-start gap-4">
				<Image
					src={candidate.avatarUrl}
					alt={candidate.name ?? candidate.username}
					width={64}
					height={64}
					unoptimized
					className="h-16 w-16 rounded-full border object-cover"
				/>

				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-baseline gap-2">
						<h1 className="truncate font-semibold text-xl">
							{candidate.name ?? candidate.username}
						</h1>
						<a
							href={candidate.htmlUrl}
							target="_blank"
							rel="noreferrer"
							className="text-gray-600 text-sm hover:underline"
						>
							@{candidate.username}
						</a>
						<span className="ml-auto text-gray-600 text-sm">
							Score:{" "}
							<span className="font-semibold text-gray-900">
								{Math.round(candidate.score)}
							</span>
						</span>
					</div>

					{candidate.bio && (
						<p className="mt-2 text-gray-700 text-sm">{candidate.bio}</p>
					)}

					<div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-gray-600 text-sm">
						{candidate.location && (
							<span>
								<span className="text-gray-500">Location:</span>{" "}
								{candidate.location}
							</span>
						)}
						{candidate.company && (
							<span>
								<span className="text-gray-500">Company:</span>{" "}
								{candidate.company}
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
