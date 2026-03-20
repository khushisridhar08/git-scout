// web/app/lib/api-client.ts

import type {
  ApiCandidate,
  ApiSearchResponse,
  Candidate,
  SearchResponse,
  RateLimitInfo,
} from "../types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:3001";

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// Lightweight in-memory rate-limit store
let latestRateLimit: RateLimitInfo = {
  remaining: null,
  limit: null,
  resetAt: null,
};

export function getLatestRateLimit(): RateLimitInfo {
  return latestRateLimit;
}

function updateRateLimitFromHeaders(headers: Headers) {
  const remaining = headers.get("x-ratelimit-remaining");
  const limit = headers.get("x-ratelimit-limit");
  const reset = headers.get("x-ratelimit-reset");

  latestRateLimit = {
    remaining: remaining !== null ? Number(remaining) : null,
    limit: limit !== null ? Number(limit) : null,
    resetAt: reset !== null ? Number(reset) : null,
  };
}

function mapApiCandidateToCandidate(apiCandidate: ApiCandidate): Candidate {
  return {
    id: apiCandidate.id,
    username: apiCandidate.login,
    avatarUrl: apiCandidate.avatar_url ?? "",
    profileUrl: apiCandidate.html_url ?? "",
    apiUrl: apiCandidate.url,
    followers: apiCandidate.followers ?? 0,
    following: apiCandidate.following ?? 0,
    publicRepos: apiCandidate.public_repos ?? 0,
    publicGists: apiCandidate.public_gists ?? 0,
    score: apiCandidate.score,
    name: apiCandidate.name ?? null,
    bio: apiCandidate.bio ?? null,
    location: apiCandidate.location ?? null,
    company: apiCandidate.company ?? null,
  };
}

async function request<T>(
  path: string,
  options?: RequestInit & { signal?: AbortSignal }
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    signal: options?.signal,
  });

  updateRateLimitFromHeaders(response.headers);

  let data: unknown = null;

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message?: string }).message)
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export async function searchCandidates(
  query: string,
  signal?: AbortSignal
): Promise<SearchResponse> {
  const params = new URLSearchParams({ q: query });

  const data = await request<ApiSearchResponse>(
    `/search/candidates?${params.toString()}`,
    { method: "GET", signal }
  );

  return {
    candidates: (data.items ?? []).map(mapApiCandidateToCandidate),
    totalCount: data.total_count ?? 0,
    incompleteResults: data.incomplete_results ?? false,
  };
}

export async function getCandidateProfile(
  username: string,
  signal?: AbortSignal
): Promise<Candidate> {
  const data = await request<ApiCandidate>(
    `/candidates/${encodeURIComponent(username)}`,
    { method: "GET", signal }
  );

  return mapApiCandidateToCandidate(data);
}