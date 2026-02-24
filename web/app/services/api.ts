// web/app/services/api.ts
const DEFAULT_BASE_URL = "http://localhost:3001";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || DEFAULT_BASE_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiErrorDetails = {
  status: number;
  message: string;
  url: string;
  body?: unknown;
};

export class ApiError extends Error {
  public readonly details: ApiErrorDetails;

  constructor(details: ApiErrorDetails) {
    super(details.message);
    this.name = "ApiError";
    this.details = details;
  }
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined | null>) {
  const url = new URL(path, API_BASE_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function readJsonSafe(res: Response) {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    // if server returned non-json
    return text;
  }
}

export async function apiFetch<T>(
  path: string,
  opts?: {
    method?: HttpMethod;
    params?: Record<string, string | number | boolean | undefined | null>;
    body?: unknown;
    headers?: Record<string, string>;
    signal?: AbortSignal;
  }
): Promise<T> {
  const url = buildUrl(path, opts?.params);

  const res = await fetch(url, {
    method: opts?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts?.headers ?? {}),
    },
    body: opts?.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts?.signal,
  });

  if (!res.ok) {
    const body = await readJsonSafe(res);
    throw new ApiError({
      status: res.status,
      message: `API request failed: ${res.status} ${res.statusText}`,
      url,
      body,
    });
  }

  // Some endpoints may return 204
  if (res.status === 204) return undefined as T;

  const data = (await readJsonSafe(res)) as T;
  return data;
}

/** ---- Typed API functions (per Issue #8) ---- **/

// Adjust these interfaces if backend response differs.
import type { Candidate } from "@/types/candidate";
import type { Shortlist, ShortlistCreateInput, ShortlistItem } from "@/types";


/**
 * searchCandidates(params)
 * Example params might include: q, language, location, minFollowers, page, etc.
 * Keep flexible because backend may evolve.
 */
export function searchCandidates(params: Record<string, string | number | boolean | undefined | null>) {
  return apiFetch<Candidate[]>("/api/search", { params });
}

/** getCandidateProfile(username) */
export function getCandidateProfile(username: string) {
  return apiFetch<Candidate>(`/api/candidates/${encodeURIComponent(username)}`);
}

/** getShortlists() */
export function getShortlists() {
  return apiFetch<Shortlist[]>("/api/shortlists");
}

/** createShortlist(name) */
export function createShortlist(name: string) {
  const payload: ShortlistCreateInput = { name };
  return apiFetch<Shortlist>("/api/shortlists", { method: "POST", body: payload });
}

/** getShortlist(id) */
export function getShortlist(id: string) {
  return apiFetch<ShortlistItem>(`/api/shortlists/${encodeURIComponent(id)}`);
}

/** addCandidateToShortlist(id, username) */
export function addCandidateToShortlist(id: string, username: string) {
  return apiFetch<{ ok: true }>(`/api/shortlists/${encodeURIComponent(id)}/candidates`, {
    method: "POST",
    body: { username },
  });
}

/** removeCandidateFromShortlist(id, username) */
export function removeCandidateFromShortlist(id: string, username: string) {
  return apiFetch<{ ok: true }>(`/api/shortlists/${encodeURIComponent(id)}/candidates/${encodeURIComponent(username)}`, {
    method: "DELETE",
  });
}

/** deleteShortlist(id) */
export function deleteShortlist(id: string) {
  return apiFetch<{ ok: true }>(`/api/shortlists/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}