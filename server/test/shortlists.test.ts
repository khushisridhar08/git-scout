import { afterAll, beforeAll, describe, expect, it } from "bun:test"

process.env.DATABASE_PATH = ":memory:"

const { createApp } = await import("../src/app")
const { resetDb } = await import("../src/db/client")

const app = createApp()

beforeAll(() => {
	resetDb()
})

afterAll(() => {
	resetDb()
})

async function req(
	path: string,
	init?: RequestInit,
): Promise<{ status: number; body: unknown }> {
	const res = await app.handle(
		new Request(`http://test${path}`, {
			...init,
			headers: {
				"content-type": "application/json",
				...(init?.headers ?? {}),
			},
		}),
	)
	let body: unknown = null
	try {
		body = await res.json()
	} catch {
		body = null
	}
	return { status: res.status, body }
}

describe("Shortlists API", () => {
	it("starts with an empty list", async () => {
		const res = await req("/shortlists")
		expect(res.status).toBe(200)
		expect(res.body).toEqual([])
	})

	it("creates, fetches, and deletes a shortlist", async () => {
		const created = await req("/shortlists", {
			method: "POST",
			body: JSON.stringify({ name: "Go engineers" }),
		})
		expect(created.status).toBe(200)
		const shortlist = created.body as { id: string; name: string }
		expect(shortlist.name).toBe("Go engineers")

		const fetched = await req(`/shortlists/${shortlist.id}`)
		expect(fetched.status).toBe(200)
		expect((fetched.body as { id: string }).id).toBe(shortlist.id)

		const deleted = await req(`/shortlists/${shortlist.id}`, {
			method: "DELETE",
		})
		expect(deleted.status).toBe(200)
		expect(deleted.body).toEqual({ deleted: true })

		const missing = await req(`/shortlists/${shortlist.id}`)
		expect(missing.status).toBe(404)
	})

	it("adds and removes candidates on a shortlist", async () => {
		const created = await req("/shortlists", {
			method: "POST",
			body: JSON.stringify({ name: "TypeScript mentors" }),
		})
		const shortlist = created.body as { id: string }

		const added = await req(`/shortlists/${shortlist.id}/candidates`, {
			method: "POST",
			body: JSON.stringify({ github_username: "octocat" }),
		})
		expect(added.status).toBe(200)
		expect((added.body as { added: boolean }).added).toBe(true)

		const fetched = await req(`/shortlists/${shortlist.id}`)
		const candidates = (fetched.body as { candidates: unknown[] }).candidates
		expect(candidates.length).toBe(1)

		const removed = await req(
			`/shortlists/${shortlist.id}/candidates/octocat`,
			{ method: "DELETE" },
		)
		expect(removed.status).toBe(200)
		expect(removed.body).toEqual({ removed: true })
	})

	it("returns 404 when adding to an unknown shortlist", async () => {
		const res = await req("/shortlists/does-not-exist/candidates", {
			method: "POST",
			body: JSON.stringify({ github_username: "ghost" }),
		})
		expect(res.status).toBe(404)
	})

	it("deduplicates the same candidate added twice", async () => {
		const created = await req("/shortlists", {
			method: "POST",
			body: JSON.stringify({ name: "Dedup" }),
		})
		const shortlist = created.body as { id: string }

		const first = await req(`/shortlists/${shortlist.id}/candidates`, {
			method: "POST",
			body: JSON.stringify({ github_username: "yyx990803" }),
		})
		expect(first.status).toBe(200)
		const firstBody = first.body as { id: string; already_present?: boolean }
		expect(firstBody.already_present).toBeUndefined()

		const second = await req(`/shortlists/${shortlist.id}/candidates`, {
			method: "POST",
			body: JSON.stringify({ github_username: "yyx990803" }),
		})
		expect(second.status).toBe(200)
		const secondBody = second.body as {
			id: string
			already_present?: boolean
		}
		expect(secondBody.already_present).toBe(true)
		expect(secondBody.id).toBe(firstBody.id)

		const fetched = await req(`/shortlists/${shortlist.id}`)
		const candidates = (fetched.body as { candidates: unknown[] }).candidates
		expect(candidates.length).toBe(1)
	})
})
