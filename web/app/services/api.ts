import type { Candidate } from "@/types/candidate";
import type {
  ApiCandidate,
  ApiSearchResponse,
  SearchResponse,
  RateLimitInfo,
} from "@/types/api";

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

// Lightweight in-memory rate limit store
let latestRateLimit: RateLimitInfo = {
  remaining: null,
  limit: null,
  resetAt: null,
};

export function getLatestRateLimit(): RateLimitInfo {
  return latestRateLimit;
}

function updateRateLimitFromHeaders(headers: Headers): void {
  const remaining = headers.get("x-ratelimit-remaining");
  const limit = headers.get("x-ratelimit-limit");
  const reset = headers.get("x-ratelimit-reset");

  latestRateLimit = {
    remaining:
      remaining !== null && remaining !== "" && !Number.isNaN(Number(remaining))
        ? Number(remaining)
        : null,
    limit:
      limit !== null && limit !== "" && !Number.isNaN(Number(limit))
        ? Number(limit)
        : null,
    resetAt:
      reset !== null && reset !== "" && !Number.isNaN(Number(reset))
        ? Number(reset)
        : null,
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

  // Capture latest rate limit values from response headers
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

/**
 * Maps backend candidate/profile response into frontend Candidate shape
 */
function mapApiCandidateToCandidate(apiCandidate: ApiCandidate): Candidate {
  return {
    username: apiCandidate.login ?? "",
    name: apiCandidate.name ?? apiCandidate.login ?? undefined,
    avatarUrl: apiCandidate.avatar_url ?? undefined,
    location: apiCandidate.location ?? undefined,
    followers: apiCandidate.followers ?? 0,
    publicRepos: apiCandidate.public_repos ?? 0,
    totalStars: apiCandidate.total_stars ?? 0,
    recentCommitCount: apiCandidate.recent_commit_count ?? 0,
    languages: apiCandidate.languages ?? [],
    score: apiCandidate.score ?? 0,
  };
}

/**
 * Search candidates using backend API and map raw response to frontend shape
 */
export async function searchCandidates(
  params: Record<string, unknown>
): Promise<SearchResponse> {
  const { signal, ...rest } = params ?? {};
  const searchParams = new URLSearchParams();

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const data = await request<ApiSearchResponse>(
    `/search/candidates?${searchParams.toString()}`,
    {
      method: "GET",
      signal: signal as AbortSignal | undefined,
    }
  );

  return {
    candidates: (data.items ?? []).map(mapApiCandidateToCandidate),
    totalCount: data.total_count ?? 0,
    incompleteResults: data.incomplete_results ?? false,
  };
}

/**
 * Fetch single candidate profile from backend API
 */
export async function getCandidateProfile(
  username: string,
  signal?: AbortSignal
): Promise<Candidate> {
  const data = await request<ApiCandidate>(
    `/candidates/${encodeURIComponent(username)}`,
    {
      method: "GET",
      signal,
    }
  );

  return mapApiCandidateToCandidate(data);
}