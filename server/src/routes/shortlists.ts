import { Elysia, t } from "elysia"
import {
	addCandidateToShortlist,
	createShortlist,
	deleteShortlist,
	getShortlistById,
	listShortlists,
	removeCandidateFromShortlist,
	updateShortlistName,
} from "../db"
import { SESSION_COOKIE_NAME, authService } from "../services/auth"

const idParams = t.Object({ id: t.String() })

type AuthedUser = { id: string; email: string }

// `onBeforeHandle` already short-circuits unauthenticated requests with 401,
// so handlers reach this only when `user` is set. The runtime check exists
// purely to narrow the type for the type-checker.
function requireUserId(user: AuthedUser | null): string {
	if (!user) throw new Error("Authenticated handler reached without a user")
	return user.id
}

export const shortlistsRoutes = new Elysia({ prefix: "/shortlists" })
	.derive(({ cookie, set }) => {
		const raw = cookie[SESSION_COOKIE_NAME]?.value
		const sessionId = typeof raw === "string" ? raw : null
		const resolved = authService.resolveSession(sessionId)
		if (!resolved) {
			set.status = 401
			return { user: null as AuthedUser | null }
		}
		return { user: { id: resolved.user.id, email: resolved.user.email } }
	})
	.onBeforeHandle(({ user }) => {
		if (!user) return { message: "Authentication required." }
	})

	.get("/", ({ user }) => listShortlists(requireUserId(user)))

	.post(
		"/",
		({ user, body }) => createShortlist(requireUserId(user), body.name),
		{ body: t.Object({ name: t.String({ minLength: 1 }) }) },
	)

	.get(
		"/:id",
		({ user, params }) => {
			const shortlist = getShortlistById(requireUserId(user), params.id)
			if (!shortlist) return new Response("Not found", { status: 404 })
			return shortlist
		},
		{ params: idParams },
	)

	.put(
		"/:id",
		({ user, params, body }) => {
			const result = updateShortlistName(
				requireUserId(user),
				params.id,
				body.name,
			)
			if (!result.updated) return new Response("Not found", { status: 404 })
			return result
		},
		{
			params: idParams,
			body: t.Object({ name: t.String({ minLength: 1 }) }),
		},
	)

	.delete(
		"/:id",
		({ user, params }) => {
			const result = deleteShortlist(requireUserId(user), params.id)
			if (!result.deleted) return new Response("Not found", { status: 404 })
			return result
		},
		{ params: idParams },
	)

	.post(
		"/:id/candidates",
		({ user, params, body }) => {
			const result = addCandidateToShortlist(
				requireUserId(user),
				params.id,
				body.github_username,
			)
			if (!result.added) {
				return new Response("Shortlist not found", { status: 404 })
			}
			return result
		},
		{
			params: idParams,
			body: t.Object({ github_username: t.String({ minLength: 1 }) }),
		},
	)

	.delete(
		"/:id/candidates/:username",
		({ user, params }) => {
			const result = removeCandidateFromShortlist(
				requireUserId(user),
				params.id,
				params.username,
			)
			if (!result.removed) return new Response("Not found", { status: 404 })
			return result
		},
		{
			params: t.Object({ id: t.String(), username: t.String() }),
		},
	)
