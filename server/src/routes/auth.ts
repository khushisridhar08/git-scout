import { type Cookie, Elysia, t } from "elysia"
import { AuthError, SESSION_COOKIE_NAME, authService } from "../services/auth"

const credentialsBody = t.Object({
	email: t.String({ minLength: 3, maxLength: 254 }),
	password: t.String({ minLength: 1, maxLength: 256 }),
})

function publicUser(user: { id: string; email: string; created_at: string }) {
	return { id: user.id, email: user.email, created_at: user.created_at }
}

function setSessionCookie(
	cookie: Record<string, Cookie<unknown>>,
	sessionId: string,
	expiresAt: number,
) {
	const c = cookie[SESSION_COOKIE_NAME]
	c.value = sessionId
	c.httpOnly = true
	c.sameSite = "lax"
	c.secure = process.env.NODE_ENV === "production"
	c.path = "/"
	c.expires = new Date(expiresAt)
}

export const authRoutes = new Elysia({ prefix: "/auth" })
	.post(
		"/register",
		async ({ body, cookie, set }) => {
			try {
				const { user, session } = await authService.register(body)
				setSessionCookie(cookie, session.id, session.expires_at)
				return { user: publicUser(user) }
			} catch (err) {
				if (err instanceof AuthError) {
					set.status = err.status
					return { message: err.message }
				}
				throw err
			}
		},
		{ body: credentialsBody, detail: { tags: ["Auth"] } },
	)
	.post(
		"/login",
		async ({ body, cookie, set }) => {
			try {
				const { user, session } = await authService.login(body)
				setSessionCookie(cookie, session.id, session.expires_at)
				return { user: publicUser(user) }
			} catch (err) {
				if (err instanceof AuthError) {
					set.status = err.status
					return { message: err.message }
				}
				throw err
			}
		},
		{ body: credentialsBody, detail: { tags: ["Auth"] } },
	)
	.post(
		"/logout",
		({ cookie }) => {
			const sessionCookie = cookie[SESSION_COOKIE_NAME]
			const sessionId =
				typeof sessionCookie?.value === "string" ? sessionCookie.value : null
			if (sessionId) {
				authService.logout(sessionId)
				sessionCookie.remove()
			}
			return { ok: true }
		},
		{ detail: { tags: ["Auth"] } },
	)
	.get(
		"/me",
		({ cookie, set }) => {
			const raw = cookie[SESSION_COOKIE_NAME]?.value
			const sessionId = typeof raw === "string" ? raw : null
			const resolved = authService.resolveSession(sessionId)
			if (!resolved) {
				set.status = 401
				return { message: "Not authenticated." }
			}
			return { user: publicUser(resolved.user) }
		},
		{ detail: { tags: ["Auth"] } },
	)
