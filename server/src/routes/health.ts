import { Elysia } from "elysia"

/**
 * Liveness/readiness endpoints.
 *
 * The SCMP §7.2 calls for `/healthz` as the liveness probe; we expose
 * it alongside the more common `/health` so existing dashboards keep
 * working and orchestrators that follow Kubernetes conventions can
 * point at `/healthz` directly.
 */
const okPayload = () => ({ status: "ok", timestamp: new Date().toISOString() })
const readyPayload = () => ({
	status: "ready",
	timestamp: new Date().toISOString(),
})

export const healthRoutes = new Elysia()
	.get("/health", okPayload, {
		detail: { summary: "Liveness probe", tags: ["Health"] },
	})
	.get("/health/ready", readyPayload, {
		detail: { summary: "Readiness probe", tags: ["Health"] },
	})
	.get("/healthz", okPayload, {
		detail: {
			summary: "Liveness probe (Kubernetes-style alias for /health)",
			tags: ["Health"],
		},
	})
