import { Database } from "bun:sqlite"
import { mkdirSync } from "node:fs"
import { dirname } from "node:path"
import { runMigrations } from "./schema"

const DEFAULT_DB_PATH = "data/app.sqlite"
const IN_MEMORY_PATH = ":memory:"

let sharedDb: Database | null = null

export function getDb(): Database {
	if (sharedDb) return sharedDb

	const path = process.env.DATABASE_PATH || DEFAULT_DB_PATH
	if (path !== IN_MEMORY_PATH) {
		mkdirSync(dirname(path), { recursive: true })
	}

	const db = new Database(path)
	runMigrations(db)

	sharedDb = db
	return db
}

/** Resets the shared database handle. Used by tests. */
export function resetDb(): void {
	sharedDb?.close()
	sharedDb = null
}
