import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
	addCandidateToShortlist,
	createShortlist,
	deleteShortlist,
	getShortlist,
	listShortlists,
	removeCandidateFromShortlist,
} from "@/lib/api-client"

export function useShortlists() {
	return useQuery({
		queryKey: ["shortlists"],
		queryFn: ({ signal }) => listShortlists(signal),
		staleTime: 30_000,
	})
}

export function useShortlist(id?: string) {
	return useQuery({
		queryKey: ["shortlist", id],
		queryFn: ({ signal }) => getShortlist(id as string, signal),
		enabled: Boolean(id),
		staleTime: 15_000,
	})
}

export function useCreateShortlist() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (name: string) => createShortlist(name),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["shortlists"] }),
	})
}

export function useDeleteShortlist() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deleteShortlist(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["shortlists"] }),
	})
}

export function useAddCandidateToShortlist() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, username }: { id: string; username: string }) =>
			addCandidateToShortlist(id, username),
		onSuccess: (_data, vars) => {
			qc.invalidateQueries({ queryKey: ["shortlists"] })
			qc.invalidateQueries({ queryKey: ["shortlist", vars.id] })
		},
	})
}

export function useRemoveCandidateFromShortlist() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, username }: { id: string; username: string }) =>
			removeCandidateFromShortlist(id, username),
		onSuccess: (_data, vars) => {
			qc.invalidateQueries({ queryKey: ["shortlists"] })
			qc.invalidateQueries({ queryKey: ["shortlist", vars.id] })
		},
	})
}
