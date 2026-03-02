"use client"

import Link from "next/link"
import type { Candidate } from "@/types/candidate";

type Props = {
  candidate: Candidate
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : ""
  return (first + last).toUpperCase()
}

export default function CandidateCard({ candidate }: Props) {
  const username = candidate.username ?? candidate.login ?? ""
  const name = candidate.name ?? username ?? "Unknown"
  const location = candidate.location ?? ""
  const topLangs = candidate.top_languages ?? candidate.topLanguages ?? [] // supports either naming
  const repoCount = candidate.repo_count ?? candidate.public_repos
  const followers = candidate.followers

  return (
    <Link
      href={`/candidates/${encodeURIComponent(username)}`}
      className="block rounded-xl border border-border bg-card p-4 hover:bg-muted/40 transition-colors"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="h-10 w-10 shrink-0 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {/* If your type has avatar_url, use it */}
          {"avatar_url" in candidate && candidate.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={(candidate as any).avatar_url} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-semibold text-muted-foreground">{initials(name)}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-semibold">{name}</p>
              <p className="truncate text-sm text-muted-foreground">@{username}</p>
            </div>

            {/* Optional score badge if you have it */}
            {"score" in candidate && typeof (candidate as any).score === "number" ? (
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Score: {(candidate as any).score}
              </span>
            ) : null}
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {location ? <span className="rounded-md bg-muted px-2 py-1">{location}</span> : null}
            {typeof repoCount === "number" ? <span className="rounded-md bg-muted px-2 py-1">{repoCount} repos</span> : null}
            {typeof followers === "number" ? <span className="rounded-md bg-muted px-2 py-1">{followers} followers</span> : null}
          </div>

          {Array.isArray(topLangs) && topLangs.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {topLangs.slice(0, 3).map((lang: string) => (
                <span
                  key={lang}
                  className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {lang}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  )
}