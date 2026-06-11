import type { Candidate } from "@/types/candidate";

export interface ApiCandidate {
  id?: number;
  login: string;
  avatar_url?: string;
  html_url?: string;
  url?: string;
  followers?: number;
  following?: number;
  public_repos?: number;
  public_gists?: number;
  score?: number;
  name?: string | null;
  bio?: string | null;
  location?: string | null;
  company?: string | null;
  total_stars?: number;
  recent_commit_count?: number;
  languages?: string[];
}

export interface ApiSearchResponse {
  items: ApiCandidate[];
  total_count?: number;
  incomplete_results?: boolean;
}

export interface SearchResponse {
  candidates: Candidate[];
  totalCount: number;
  incompleteResults: boolean;
}

export interface RateLimitInfo {
  remaining: number | null;
  limit: number | null;
  resetAt: number | null;
}