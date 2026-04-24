import { Database } from "bun:sqlite"
import { mkdirSync } from "node:fs"
import { dirname } from "node:path"
import { runMigrations } from "./schema"

const DEFAULT_DB_PATH = "data/app.sqlite"

let sharedDb: Database | null = null

export function getDb(): Database {
	if (sharedDb) return sharedDb

	const path = process.env.DATABASE_PATH || DEFAULT_DB_PATH
	mkdirSync(dirname(path), { recursive: true })

	const db = new Database(path)
	runMigrations(db)

	sharedDb = db
	return db
}
