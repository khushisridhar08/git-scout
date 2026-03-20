import { useQuery } from "@tanstack/react-query";
import { getCandidateProfile } from "@/services/api";
import type { Candidate } from "@/types/candidate";

export function useCandidate(username?: string) {
  return useQuery({
    queryKey: ["candidate", username],
    queryFn: ({ signal }): Promise<Candidate> => {
      return getCandidateProfile(username!, signal);
    },
    enabled: Boolean(username),   
    staleTime: 30_000,
  });
}