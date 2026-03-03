import type { Candidate } from "@/types/candidate"
import type { Shortlist, ShortlistCreateInput, ShortlistItem } from "@/types"
import type { ShortlistCandidate } from "@/types/shortlist"
import { MOCK_PROFILES, getProfileByLogin, mockSearch } from "@/lib/mock-data"
import type { SearchFilters } from "@/types/search"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3001"

const STORAGE_KEY = "gitscout_shortlists"

function profileToShortlistCandidate(login: string): ShortlistCandidate {
	const p = getProfileByLogin(login)
	if (!p) return { username: login }
	return {
		username: p.login,
		name: p.name,
		score: p.gitscout_score,
		repos: p.public_repos,
		followers: p.followers,
		topLanguage: p.languages[0]?.name,
	}
}

function loadShortlists(): Shortlist[] {
	if (typeof window === "undefined") return getDefaultShortlists()
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (raw) return JSON.parse(raw)
	} catch { /* ignore */ }
	const defaults = getDefaultShortlists()
	localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
	return defaults
}

function saveShortlists(lists: Shortlist[]) {
	if (typeof window === "undefined") return
	localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
}

function getDefaultShortlists(): Shortlist[] {
	return [
		{
			id: "sl-1",
			name: "Frontend Leads",
			color: "#6366f1",
			candidateCount: 3,
			createdAt: "2026-02-20T10:00:00Z",
			tags: ["TypeScript", "React", "UI"],
			candidates: [
				MOCK_PROFILES[0], // Elena
				MOCK_PROFILES[3], // James
				MOCK_PROFILES[7], // Daniel
			].map((p) => ({
				id: p.id,
				login: p.login,
				avatar_url: p.avatar_url,
				html_url: p.html_url,
				type: "User",
				score: p.gitscout_score / 100,
				gitscout_score: p.gitscout_score,
				name: p.name,
				bio: p.bio,
				location: p.location,
				public_repos: p.public_repos,
				followers: p.followers,
				following: p.following,
				created_at: p.created_at,
				languages: p.languages.map((l) => l.name),
			})),
		},
		{
			id: "sl-2",
			name: "Infrastructure Engineers",
			color: "#10b981",
			candidateCount: 2,
			createdAt: "2026-02-25T14:30:00Z",
			tags: ["Go", "Rust", "DevOps"],
			candidates: [
				MOCK_PROFILES[1], // Marcus
				MOCK_PROFILES[5], // Alex
			].map((p) => ({
				id: p.id,
				login: p.login,
				avatar_url: p.avatar_url,
				html_url: p.html_url,
				type: "User",
				score: p.gitscout_score / 100,
				gitscout_score: p.gitscout_score,
				name: p.name,
				bio: p.bio,
				location: p.location,
				public_repos: p.public_repos,
				followers: p.followers,
				following: p.following,
				created_at: p.created_at,
				languages: p.languages.map((l) => l.name),
			})),
		},
	]
}

function toShortlistItem(s: Shortlist): ShortlistItem {
	return {
		id: s.id,
		name: s.name,
		createdAt: s.createdAt,
		candidates: (s.candidates ?? []).map((c) => {
			const profile = getProfileByLogin(c.login)
			return {
				username: c.login,
				name: c.name ?? profile?.name,
				score: c.gitscout_score ?? profile?.gitscout_score,
				repos: c.public_repos ?? profile?.public_repos,
				followers: c.followers ?? profile?.followers,
				topLanguage: (c.languages?.[0]) ?? profile?.languages[0]?.name,
			}
		}),
	}
}

async function delay(ms = 200) {
	return new Promise((r) => setTimeout(r, ms + Math.random() * 150))
}

export function searchCandidates(params: Record<string, string | number | boolean | undefined | null>) {
	const filters: SearchFilters = {
		q: String(params.q ?? ""),
		language: params.language ? String(params.language) : undefined,
		location: params.location ? String(params.location) : undefined,
		sort: params.sort as SearchFilters["sort"],
		page: params.page ? Number(params.page) : 1,
		per_page: params.per_page ? Number(params.per_page) : 10,
	}
	return Promise.resolve(mockSearch(filters).candidates as unknown as Candidate[])
}

export async function getCandidateProfile(username: string): Promise<Candidate> {
	await delay()
	const p = getProfileByLogin(username)
	if (!p) {
		return {
			username,
			name: username,
			avatarUrl: `https://avatars.githubusercontent.com/u/0`,
			followers: 0,
			publicRepos: 0,
			languages: [],
			score: 0,
		}
	}
	return {
		username: p.login,
		name: p.name,
		avatarUrl: p.avatar_url,
		location: p.location,
		followers: p.followers,
		publicRepos: p.public_repos,
		totalStars: p.repos.reduce((s, r) => s + r.stars, 0),
		recentCommitCount: Math.floor(p.contributionsLastYear / 4),
		languages: p.languages.map((l) => l.name),
		score: p.gitscout_score,
	}
}

export async function getShortlists(): Promise<Shortlist[]> {
	await delay()
	return loadShortlists()
}

export async function createShortlist(name: string): Promise<Shortlist> {
	await delay()
	const lists = loadShortlists()
	const newList: Shortlist = {
		id: `sl-${Date.now()}`,
		name,
		color: "#6366f1",
		candidateCount: 0,
		createdAt: new Date().toISOString(),
		tags: [],
		candidates: [],
	}
	lists.push(newList)
	saveShortlists(lists)
	return newList
}

export async function getShortlist(id: string): Promise<ShortlistItem> {
	await delay()
	const lists = loadShortlists()
	const found = lists.find((s) => s.id === id)
	if (!found) throw new Error("Shortlist not found")
	return toShortlistItem(found)
}

export async function addCandidateToShortlist(id: string, username: string): Promise<{ ok: true }> {
	await delay()
	const lists = loadShortlists()
	const list = lists.find((s) => s.id === id)
	if (!list) throw new Error("Shortlist not found")

	const already = list.candidates.some((c) => c.login === username)
	if (!already) {
		const profile = getProfileByLogin(username)
		if (profile) {
			list.candidates.push({
				id: profile.id,
				login: profile.login,
				avatar_url: profile.avatar_url,
				html_url: profile.html_url,
				type: "User",
				score: profile.gitscout_score / 100,
				gitscout_score: profile.gitscout_score,
				name: profile.name,
				bio: profile.bio,
				location: profile.location,
				public_repos: profile.public_repos,
				followers: profile.followers,
				following: profile.following,
				created_at: profile.created_at,
				languages: profile.languages.map((l) => l.name),
			})
			list.candidateCount = list.candidates.length
		}
	}
	saveShortlists(lists)
	return { ok: true }
}

export async function removeCandidateFromShortlist(id: string, username: string): Promise<{ ok: true }> {
	await delay()
	const lists = loadShortlists()
	const list = lists.find((s) => s.id === id)
	if (!list) throw new Error("Shortlist not found")

	list.candidates = list.candidates.filter((c) => c.login !== username)
	list.candidateCount = list.candidates.length
	saveShortlists(lists)
	return { ok: true }
}

export async function deleteShortlist(id: string): Promise<{ ok: true }> {
	await delay()
	const lists = loadShortlists().filter((s) => s.id !== id)
	saveShortlists(lists)
	return { ok: true }
}
