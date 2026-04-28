"use client"

import { useEffect, useMemo, useState } from "react"
import {
	useAddCandidateToShortlist,
	useCreateShortlist,
	useShortlists,
} from "@/hooks/useShortlists"
import { useAuth } from "@/providers/AuthProvider"

export function AddToShortlistDropdown(props: {
	username: string
	buttonLabel?: string
}) {
	const { username, buttonLabel = "Add to shortlist" } = props

	const { data } = useShortlists()
	const addMut = useAddCandidateToShortlist()
	const createMut = useCreateShortlist()
	const { requireAuth } = useAuth()

	const [open, setOpen] = useState(false)
	const [creating, setCreating] = useState(false)
	const [newName, setNewName] = useState("")

	const shortlists = useMemo(() => {
		return (data ?? [])
			.slice()
			.sort((a: any, b: any) => (a.name ?? "").localeCompare(b.name ?? ""))
	}, [data])

	useEffect(() => {
		if (open && shortlists.length === 0) {
			setCreating(true)
		}
	}, [open, shortlists.length])

	const close = () => {
		setOpen(false)
		setCreating(false)
		setNewName("")
	}

	const add = async (id: string) => {
		await addMut.mutateAsync({ id, username })
		close()
	}

	const createAndAdd = async () => {
		const trimmed = newName.trim()
		if (!trimmed) return
		const created = await createMut.mutateAsync(trimmed)
		await addMut.mutateAsync({ id: created.id, username })
		close()
	}

	const isPending = addMut.isPending || createMut.isPending

	return (
		<div className="relative inline-block">
			<button
				type="button"
				className="rounded-md border px-3 py-2 text-sm"
				onClick={() => requireAuth(() => setOpen((v) => !v))}
			>
				{buttonLabel}
			</button>

			{open && (
				<div className="absolute right-0 mt-2 w-72 rounded-md border bg-card shadow-lg z-20">
					<div className="p-2 text-xs opacity-70 border-b">
						{creating ? "Name your shortlist" : "Choose a shortlist"}
					</div>

					{!creating && (
						<div className="max-h-72 overflow-auto">
							{shortlists.map((s: any) => (
								<button
									type="button"
									key={s.id}
									className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center justify-between"
									onClick={() => add(s.id)}
									disabled={isPending}
								>
									<span className="truncate">{s.name}</span>
									{addMut.isPending && (
										<span className="text-xs opacity-70">Adding…</span>
									)}
								</button>
							))}
						</div>
					)}

					{creating && (
						<form
							onSubmit={(e) => {
								e.preventDefault()
								createAndAdd()
							}}
							className="p-2 space-y-2"
						>
							<input
								autoFocus
								type="text"
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
								placeholder="e.g. Rust senior, Q2 hires"
								className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
								disabled={isPending}
							/>
							<button
								type="submit"
								className="w-full rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
								disabled={isPending || newName.trim().length === 0}
							>
								{isPending ? "Creating…" : `Create and add @${username}`}
							</button>
						</form>
					)}

					<div className="p-2 border-t flex gap-2">
						{!creating ? (
							<button
								type="button"
								className="flex-1 rounded-md border px-3 py-2 text-sm hover:bg-muted"
								onClick={() => setCreating(true)}
								disabled={isPending}
							>
								+ New shortlist
							</button>
						) : (
							shortlists.length > 0 && (
								<button
									type="button"
									className="flex-1 rounded-md border px-3 py-2 text-sm hover:bg-muted"
									onClick={() => setCreating(false)}
									disabled={isPending}
								>
									Back
								</button>
							)
						)}
						<button
							type="button"
							className="flex-1 rounded-md border px-3 py-2 text-sm hover:bg-muted"
							onClick={close}
							disabled={isPending}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
