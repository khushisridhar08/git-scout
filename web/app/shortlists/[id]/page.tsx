"use client"

import { useQueries } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import Navigation from "@/components/Navigation"
import { CompareView } from "@/components/shortlists/CompareView"
import { ShortlistCandidatesTable } from "@/components/shortlists/ShortlistCandidatesTable"
import {
	useRemoveCandidateFromShortlist,
	useShortlist,
} from "@/hooks/useShortlists"
import { getCandidateProfile } from "@/lib/api-client"
import type { Candidate } from "@/types/candidate"
import { downloadCsv, toCsv } from "@/utils/csv"
import { downloadShortlistPdf } from "@/utils/pdf"

const MAX_COMPARE = 4

type HydratedCandidate = {
	username: string
	addedAt: string
	name: string | null
	score: number | null
	repos: number | null
	followers: number | null
	topLanguage: string | null
}

export default function ShortlistDetailPage() {
	const router = useRouter()
	const params = useParams<{ id: string }>()
	const id = params?.id

	const { data, isLoading, error } = useShortlist(id)
	const removeMut = useRemoveCandidateFromShortlist()

	const rawCandidates = data?.candidates ?? []

	// Fetch every candidate's profile in parallel so we can show real
	// score / repo / follower / language data in the table — the shortlist
	// row itself only stores `username` + `addedAt`.
	const profileQueries = useQueries({
		queries: rawCandidates.map((c) => ({
			queryKey: ["candidate", c.username],
			queryFn: ({ signal }: { signal?: AbortSignal }) =>
				getCandidateProfile(c.username, signal),
			staleTime: 60_000,
		})),
	})

	const candidates: HydratedCandidate[] = useMemo(
		() =>
			rawCandidates.map((c, i) => {
				const profile: Candidate | undefined = profileQueries[i]?.data
				return {
					username: c.username,
					addedAt: c.addedAt,
					name: profile?.name ?? null,
					score: profile?.score ?? null,
					repos: profile?.publicRepos ?? null,
					followers: profile?.followers ?? null,
					topLanguage: profile?.languages?.[0] ?? null,
				}
			}),
		[rawCandidates, profileQueries],
	)

	const [selected, setSelected] = useState<Record<string, boolean>>({})

	const toggle = (username: string) => {
		setSelected((prev) => {
			const next = { ...prev, [username]: !prev[username] }
			const count = Object.values(next).filter(Boolean).length
			if (count > MAX_COMPARE) return prev
			return next
		})
	}

	const selectedCandidates = useMemo(
		() => candidates.filter((c) => selected[c.username]).slice(0, MAX_COMPARE),
		[candidates, selected],
	)

	const onRemove = async (username: string) => {
		if (!id) return
		await removeMut.mutateAsync({ id, username })
		setSelected((prev) => {
			const { [username]: _, ...rest } = prev
			return rest
		})
	}

	const buildExportPayload = () => {
		if (!data) return null
		const headers = [
			"username",
			"name",
			"score",
			"repos",
			"followers",
			"top_language",
			"added_at",
		]
		const rows = candidates.map((c) => [
			c.username,
			c.name ?? "",
			c.score ?? "",
			c.repos ?? "",
			c.followers ?? "",
			c.topLanguage ?? "",
			c.addedAt,
		])
		const today = new Date().toISOString().slice(0, 10)
		const slug =
			data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "shortlist"
		return { headers, rows, slug, today }
	}

	const handleExportCsv = () => {
		const payload = buildExportPayload()
		if (!payload) return
		downloadCsv(
			`${payload.slug}-${payload.today}.csv`,
			toCsv(payload.headers, payload.rows),
		)
	}

	const handleExportPdf = () => {
		const payload = buildExportPayload()
		if (!payload || !data) return
		downloadShortlistPdf({
			filename: `${payload.slug}-${payload.today}.pdf`,
			shortlistName: data.name,
			headers: payload.headers,
			rows: payload.rows,
		})
	}

	if (isLoading) {
		return (
			<Shell>
				<p className="text-sm opacity-80">Loading shortlist…</p>
			</Shell>
		)
	}

	if (error) {
		return (
			<Shell>
				<p className="text-red-600 text-sm">Failed to load shortlist.</p>
			</Shell>
		)
	}

	if (!data) {
		return (
			<Shell>
				<p className="text-red-600 text-sm">Shortlist not found.</p>
			</Shell>
		)
	}

	return (
		<Shell>
			<div className="flex items-start justify-between gap-4">
				<div className="space-y-1">
					<button
						type="button"
						className="text-sm underline opacity-80"
						onClick={() => router.push("/shortlists")}
					>
						← Back to shortlists
					</button>
					<h1 className="font-semibold text-2xl">{data.name}</h1>
					<p className="text-sm opacity-80">
						{candidates.length} candidate{candidates.length === 1 ? "" : "s"}
					</p>
				</div>

				<div className="flex gap-2">
					<button
						type="button"
						onClick={handleExportCsv}
						disabled={candidates.length === 0}
						className="rounded-md border border-border/50 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-50"
					>
						Export CSV
					</button>
					<button
						type="button"
						onClick={handleExportPdf}
						disabled={candidates.length === 0}
						className="rounded-md border border-border/50 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-50"
					>
						Export PDF
					</button>
				</div>
			</div>

			<ShortlistCandidatesTable
				candidates={candidates}
				selected={selected}
				onToggleSelect={toggle}
				onRemove={onRemove}
				removing={removeMut.isPending}
			/>

			<CompareView candidates={selectedCandidates} />
		</Shell>
	)
}

function Shell({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-background">
			<Navigation />
			<div className="mx-auto max-w-7xl space-y-6 px-6 pt-24 pb-12">
				{children}
			</div>
		</div>
	)
}
