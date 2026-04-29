export type ShortlistSummary = {
	id: string
	name: string
	createdAt: string
	updatedAt: string
	candidateCount: number
}

export type ShortlistCandidate = {
	id: string
	username: string
	addedAt: string
}

export type ShortlistDetail = ShortlistSummary & {
	candidates: ShortlistCandidate[]
}

export type ShortlistCreateInput = {
	name: string
}
