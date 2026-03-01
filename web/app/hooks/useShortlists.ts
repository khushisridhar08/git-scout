// web/app/hooks/useShortlists.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCandidateToShortlist,
  createShortlist,
  deleteShortlist,
  getShortlist,
  getShortlists,
  removeCandidateFromShortlist,
} from "@/app/services/api"; // keep your existing path

export function useShortlists() {
  return useQuery({
    queryKey: ["shortlists"],
    queryFn: () => getShortlists(),
    staleTime: 30_000,
  });
}

export function useShortlist(id?: string) {
  return useQuery({
    queryKey: ["shortlist", id],
    queryFn: () => getShortlist(id!),
    enabled: Boolean(id),
    staleTime: 15_000,
  });
}

export function useCreateShortlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createShortlist(name),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["shortlists"] });
    },
  });
}

export function useDeleteShortlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteShortlist(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["shortlists"] });
    },
  });
}

export function useAddCandidateToShortlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, username }: { id: string; username: string }) =>
      addCandidateToShortlist(id, username),
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: ["shortlists"] });
      await qc.invalidateQueries({ queryKey: ["shortlist", vars.id] });
    },
  });
}

export function useRemoveCandidateFromShortlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, username }: { id: string; username: string }) =>
      removeCandidateFromShortlist(id, username),
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: ["shortlists"] });
      await qc.invalidateQueries({ queryKey: ["shortlist", vars.id] });
    },
  });
}