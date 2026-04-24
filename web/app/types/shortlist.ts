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

/** Legacy alias kept for components that imported the older name. */
export type Shortlist = ShortlistSummary

/** Legacy alias for components that imported the older detail name. */
export type ShortlistItem = ShortlistDetail
