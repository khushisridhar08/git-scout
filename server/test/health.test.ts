import { describe, expect, it } from "bun:test"
import { createApp } from "../src/app"

const app = createApp()

describe("GET /health", () => {
	it("returns ok with a timestamp", async () => {
		const res = await app.handle(new Request("http://test/health"))
		expect(res.status).toBe(200)

		const body = (await res.json()) as {
			status: string
			timestamp: string
		}
		expect(body.status).toBe("ok")
		expect(typeof body.timestamp).toBe("string")
	})

	it("exposes a readiness endpoint", async () => {
		const res = await app.handle(new Request("http://test/health/ready"))
		expect(res.status).toBe(200)

		const body = (await res.json()) as { status: string }
		expect(body.status).toBe("ready")
	})

	it("exposes a /healthz alias per the SCMP", async () => {
		const res = await app.handle(new Request("http://test/healthz"))
		expect(res.status).toBe(200)

		const body = (await res.json()) as { status: string }
		expect(body.status).toBe("ok")
	})
})
