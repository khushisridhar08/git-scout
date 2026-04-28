import { getDb } from "./client"

export type UserRow = {
	id: string
	email: string
	password_hash: string
	created_at: string
}

export type SessionRow = {
	id: string
	user_id: string
	expires_at: number
	created_at: number
}

export function createUser(input: {
	email: string
	passwordHash: string
}): UserRow {
	const id = crypto.randomUUID()
	const now = new Date().toISOString()

	getDb()
		.prepare(
			`INSERT INTO users (id, email, password_hash, created_at)
			 VALUES (?, ?, ?, ?)`,
		)
		.run(id, input.email, input.passwordHash, now)

	return {
		id,
		email: input.email,
		password_hash: input.passwordHash,
		created_at: now,
	}
}

export function getUserByEmail(email: string): UserRow | null {
	return (
		(getDb()
			.prepare("SELECT * FROM users WHERE email = ?")
			.get(email) as UserRow | undefined) ?? null
	)
}

export function getUserById(id: string): UserRow | null {
	return (
		(getDb()
			.prepare("SELECT * FROM users WHERE id = ?")
			.get(id) as UserRow | undefined) ?? null
	)
}

export function createSession(input: {
	userId: string
	ttlMs: number
}): SessionRow {
	const id = crypto.randomUUID()
	const now = Date.now()
	const expiresAt = now + input.ttlMs

	getDb()
		.prepare(
			`INSERT INTO sessions (id, user_id, expires_at, created_at)
			 VALUES (?, ?, ?, ?)`,
		)
		.run(id, input.userId, expiresAt, now)

	return { id, user_id: input.userId, expires_at: expiresAt, created_at: now }
}

export function getSession(id: string): SessionRow | null {
	const row = getDb()
		.prepare("SELECT * FROM sessions WHERE id = ?")
		.get(id) as SessionRow | undefined

	if (!row) return null
	if (row.expires_at < Date.now()) {
		deleteSession(id)
		return null
	}
	return row
}

export function deleteSession(id: string): void {
	getDb().prepare("DELETE FROM sessions WHERE id = ?").run(id)
}
