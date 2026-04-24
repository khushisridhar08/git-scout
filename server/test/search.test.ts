import { describe, expect, it } from "bun:test"
import { createApp } from "../src/app"

const app = createApp()

describe("GET /search/candidates", () => {
	it("rejects requests without a query string", async () => {
		const res = await app.handle(new Request("http://test/search/candidates"))
		expect(res.status).toBe(422)
	})

	it("rejects an empty q parameter", async () => {
		const res = await app.handle(
			new Request("http://test/search/candidates?q="),
		)
		expect(res.status).toBe(422)
	})
})
