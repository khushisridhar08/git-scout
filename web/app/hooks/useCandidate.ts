// web/app/hooks/useCandidate.ts
import { useQuery } from "@tanstack/react-query";
import { getCandidateProfile } from "@/app/services/api";

export function useCandidate(username?: string) {
  return useQuery({
    queryKey: ["candidateProfile", username],
    queryFn: ({ signal }) => getCandidateProfile(username!),
    enabled: Boolean(username),
    staleTime: 60_000,
  });
}
