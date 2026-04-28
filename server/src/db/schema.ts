import type { Database } from "bun:sqlite"

export function runMigrations(db: Database) {
	db.exec("PRAGMA foreign_keys = ON")

	db.exec(`
		CREATE TABLE IF NOT EXISTS profile_cache (
			username   TEXT PRIMARY KEY,
			data_json  TEXT NOT NULL,
			fetched_at INTEGER NOT NULL,
			ttl        INTEGER NOT NULL
		)
	`)

	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id            TEXT PRIMARY KEY,
			email         TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL,
			created_at    TEXT NOT NULL
		)
	`)

	db.exec(`
		CREATE TABLE IF NOT EXISTS sessions (
			id         TEXT PRIMARY KEY,
			user_id    TEXT NOT NULL,
			expires_at INTEGER NOT NULL,
			created_at INTEGER NOT NULL,
			FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
		)
	`)

	// Pre-auth shortlists have no owner. Drop them once when migrating, since
	// the owner_id column is required and there is no sensible backfill.
	const hasOwnerId = db
		.prepare(
			"SELECT 1 AS x FROM pragma_table_info('shortlists') WHERE name = 'owner_id'",
		)
		.get() as { x: number } | undefined

	if (!hasOwnerId) {
		db.exec("DROP TABLE IF EXISTS shortlist_candidates")
		db.exec("DROP TABLE IF EXISTS shortlists")
	}

	db.exec(`
		CREATE TABLE IF NOT EXISTS shortlists (
			id         TEXT PRIMARY KEY,
			owner_id   TEXT NOT NULL,
			name       TEXT NOT NULL,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
		)
	`)

	db.exec(`
		CREATE TABLE IF NOT EXISTS shortlist_candidates (
			id                  TEXT PRIMARY KEY,
			shortlist_id        TEXT NOT NULL,
			github_username     TEXT NOT NULL,
			cached_profile_json TEXT,
			added_at            TEXT NOT NULL,
			FOREIGN KEY(shortlist_id) REFERENCES shortlists(id) ON DELETE CASCADE
		)
	`)
}
