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
		CREATE TABLE IF NOT EXISTS shortlists (
			id         TEXT PRIMARY KEY,
			name       TEXT NOT NULL,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
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
