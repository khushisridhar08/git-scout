// web/app/types/candidate.ts

// Keep this minimal + extensible. You can expand once backend schema stabilizes.
export type Candidate = {
  username: string;
  name?: string;
  avatarUrl?: string;
  location?: string;

  // Common talent signals mentioned in proposal (commits, stars, PRs, etc.)
  followers?: number;
  publicRepos?: number;
  totalStars?: number;
  recentCommitCount?: number;
  languages?: string[];

  // Optional scoring (v1)
  score?: number;

  // Allow backend to return extra fields without breaking the UI
  [key: string]: unknown;
};