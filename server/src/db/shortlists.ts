import { getDb } from "./client"

export type ShortlistRow = {
	id: string
	owner_id: string
	name: string
	created_at: string
	updated_at: string
}

export type ShortlistSummary = ShortlistRow & {
	candidate_count: number
}

export type ShortlistCandidateRow = {
	id: string
	shortlist_id: string
	github_username: string
	cached_profile_json: string | null
	added_at: string
}

export function createShortlist(ownerId: string, name: string): ShortlistRow {
	const id = crypto.randomUUID()
	const now = new Date().toISOString()

	getDb()
		.prepare(
			`INSERT INTO shortlists (id, owner_id, name, created_at, updated_at)
			 VALUES (?, ?, ?, ?, ?)`,
		)
		.run(id, ownerId, name, now, now)

	return { id, owner_id: ownerId, name, created_at: now, updated_at: now }
}

export function listShortlists(ownerId: string): ShortlistSummary[] {
	return getDb()
		.prepare(
			`SELECT s.id, s.owner_id, s.name, s.created_at, s.updated_at,
			        COUNT(c.id) AS candidate_count
			 FROM shortlists s
			 LEFT JOIN shortlist_candidates c ON c.shortlist_id = s.id
			 WHERE s.owner_id = ?
			 GROUP BY s.id
			 ORDER BY s.created_at DESC`,
		)
		.all(ownerId) as ShortlistSummary[]
}

export function getShortlistById(ownerId: string, id: string) {
	const db = getDb()

	const shortlist = db
		.prepare("SELECT * FROM shortlists WHERE id = ? AND owner_id = ?")
		.get(id, ownerId) as ShortlistRow | undefined

	if (!shortlist) return null

	const candidates = db
		.prepare(
			"SELECT * FROM shortlist_candidates WHERE shortlist_id = ? ORDER BY added_at DESC",
		)
		.all(id) as ShortlistCandidateRow[]

	return { ...shortlist, candidates }
}

export function updateShortlistName(
	ownerId: string,
	id: string,
	name: string,
) {
	const now = new Date().toISOString()
	const result = getDb()
		.prepare(
			"UPDATE shortlists SET name = ?, updated_at = ? WHERE id = ? AND owner_id = ?",
		)
		.run(name, now, id, ownerId)

	return { updated: result.changes > 0 }
}

export function deleteShortlist(ownerId: string, id: string) {
	const result = getDb()
		.prepare("DELETE FROM shortlists WHERE id = ? AND owner_id = ?")
		.run(id, ownerId)

	return { deleted: result.changes > 0 }
}

export function addCandidateToShortlist(
	ownerId: string,
	shortlistId: string,
	githubUsername: string,
) {
	const db = getDb()

	const shortlist = db
		.prepare("SELECT id FROM shortlists WHERE id = ? AND owner_id = ?")
		.get(shortlistId, ownerId)

	if (!shortlist) {
		return { added: false as const, reason: "shortlist_not_found" as const }
	}

	// Idempotent: if the candidate is already on this shortlist, return the
	// existing entry instead of inserting a duplicate. Recruiters expect
	// adding the same person twice to be a no-op, not a double-row.
	const existing = db
		.prepare(
			`SELECT id, added_at FROM shortlist_candidates
			 WHERE shortlist_id = ? AND github_username = ?`,
		)
		.get(shortlistId, githubUsername) as
		| { id: string; added_at: string }
		| undefined

	if (existing) {
		return {
			added: true as const,
			id: existing.id,
			added_at: existing.added_at,
			already_present: true as const,
		}
	}

	const id = crypto.randomUUID()
	const now = new Date().toISOString()

	db.prepare(
		`INSERT INTO shortlist_candidates
		   (id, shortlist_id, github_username, cached_profile_json, added_at)
		 VALUES (?, ?, ?, ?, ?)`,
	).run(id, shortlistId, githubUsername, null, now)

	return { added: true as const, id, added_at: now }
}

export function removeCandidateFromShortlist(
	ownerId: string,
	shortlistId: string,
	githubUsername: string,
) {
	const db = getDb()

	const owns = db
		.prepare("SELECT 1 AS x FROM shortlists WHERE id = ? AND owner_id = ?")
		.get(shortlistId, ownerId) as { x: number } | undefined

	if (!owns) return { removed: false }

	const result = db
		.prepare(
			`DELETE FROM shortlist_candidates
			 WHERE shortlist_id = ? AND github_username = ?`,
		)
		.run(shortlistId, githubUsername)

	return { removed: result.changes > 0 }
}
