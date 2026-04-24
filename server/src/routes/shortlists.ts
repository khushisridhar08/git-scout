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

const idParams = t.Object({ id: t.String() })

export const shortlistsRoutes = new Elysia({ prefix: "/shortlists" })
	.get("/", () => listShortlists())

	.post("/", ({ body }) => createShortlist(body.name), {
		body: t.Object({ name: t.String({ minLength: 1 }) }),
	})

	.get(
		"/:id",
		({ params }) => {
			const shortlist = getShortlistById(params.id)
			if (!shortlist) return new Response("Not found", { status: 404 })
			return shortlist
		},
		{ params: idParams },
	)

	.put(
		"/:id",
		({ params, body }) => {
			const result = updateShortlistName(params.id, body.name)
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
		({ params }) => {
			const result = deleteShortlist(params.id)
			if (!result.deleted) return new Response("Not found", { status: 404 })
			return result
		},
		{ params: idParams },
	)

	.post(
		"/:id/candidates",
		({ params, body }) => {
			const result = addCandidateToShortlist(params.id, body.github_username)
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
		({ params }) => {
			const result = removeCandidateFromShortlist(params.id, params.username)
			if (!result.removed) return new Response("Not found", { status: 404 })
			return result
		},
		{
			params: t.Object({ id: t.String(), username: t.String() }),
		},
	)
