// web/app/hooks/useSearch.ts
import { useQuery } from "@tanstack/react-query";
import { searchCandidates } from "@/app/services/api";

export function useSearchCandidates(params: Record<string, any>) {
  // Make queryKey deterministic
  const key = ["searchCandidates", params];

  return useQuery({
    queryKey: key,
    queryFn: ({ signal }) => searchCandidates({ ...params, signal } as any),
    enabled: Object.keys(params ?? {}).length > 0,
    staleTime: 30_000,
  });
}

