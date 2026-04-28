import {
	createSession,
	createUser,
	deleteSession,
	getSession,
	getUserByEmail,
	getUserById,
} from "../db/users"

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000

export const SESSION_COOKIE_NAME = "gitscout_session"

export class AuthError extends Error {
	readonly status: number
	constructor(message: string, status: number) {
		super(message)
		this.name = "AuthError"
		this.status = status
	}
}

function normalizeEmail(email: string): string {
	return email.trim().toLowerCase()
}

export async function register(input: { email: string; password: string }) {
	const email = normalizeEmail(input.email)
	if (!email.includes("@")) {
		throw new AuthError("Invalid email address.", 400)
	}
	if (input.password.length < 8) {
		throw new AuthError("Password must be at least 8 characters.", 400)
	}

	if (getUserByEmail(email)) {
		throw new AuthError("An account with that email already exists.", 409)
	}

	const passwordHash = await Bun.password.hash(input.password)
	const user = createUser({ email, passwordHash })
	const session = createSession({ userId: user.id, ttlMs: SESSION_TTL_MS })

	return { user, session }
}

export async function login(input: { email: string; password: string }) {
	const email = normalizeEmail(input.email)
	const user = getUserByEmail(email)
	if (!user) {
		throw new AuthError("Invalid email or password.", 401)
	}

	const ok = await Bun.password.verify(input.password, user.password_hash)
	if (!ok) {
		throw new AuthError("Invalid email or password.", 401)
	}

	const session = createSession({ userId: user.id, ttlMs: SESSION_TTL_MS })
	return { user, session }
}

export function logout(sessionId: string) {
	deleteSession(sessionId)
}

export function resolveSession(sessionId: string | null | undefined) {
	if (!sessionId) return null
	const session = getSession(sessionId)
	if (!session) return null
	const user = getUserById(session.user_id)
	if (!user) return null
	return { user, session }
}

export const authService = {
	register,
	login,
	logout,
	resolveSession,
	SESSION_COOKIE_NAME,
	SESSION_TTL_MS,
}
