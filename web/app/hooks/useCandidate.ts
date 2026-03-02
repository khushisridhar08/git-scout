import { useQuery } from "@tanstack/react-query";
import type { Candidate } from "@/types/candidate";

export function useCandidate(username?: string) {
  return useQuery({
    queryKey: ["candidate", username],
    queryFn: async (): Promise<Candidate> => {
      return {
        username: username ?? "test",
        name: "Test User",
        avatarUrl: "https://github.com/octocat.png",
        location: "USA",
        followers: 10,
        publicRepos: 5,
        totalStars: 20,
        recentCommitCount: 15,
        languages: ["TypeScript", "Python", "Go"],
        score: 82,
      };
    },
    enabled: !!username,
  });
}