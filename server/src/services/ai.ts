import Anthropic from "@anthropic-ai/sdk"

const MODEL = "claude-haiku-4-5-20251001"
const PARSE_CACHE_TTL_MS = 5 * 60 * 1000
const SCORE_CACHE_TTL_MS = 5 * 60 * 1000

export type ParsedQuery = {
	language?: string
	location?: string
	refinedQuery: string
	intent: string
}

export type CandidateScore = {
	score: number
	reasoning: string
}

export class AiUnavailableError extends Error {
	constructor() {
		super(
			"AI search is not configured. Set ANTHROPIC_API_KEY on the server.",
		)
		this.name = "AiUnavailableError"
	}
}

let client: Anthropic | null = null
function getClient(): Anthropic {
	if (!process.env.ANTHROPIC_API_KEY) throw new AiUnavailableError()
	if (!client) {
		client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
	}
	return client
}

type CacheEntry<T> = { value: T; expiresAt: number }
const parseCache = new Map<string, CacheEntry<ParsedQuery>>()
const scoreCache = new Map<string, CacheEntry<CandidateScore>>()

function readCache<T>(map: Map<string, CacheEntry<T>>, key: string): T | null {
	const entry = map.get(key)
	if (!entry) return null
	if (entry.expiresAt < Date.now()) {
		map.delete(key)
		return null
	}
	return entry.value
}

function writeCache<T>(
	map: Map<string, CacheEntry<T>>,
	key: string,
	value: T,
	ttl: number,
) {
	map.set(key, { value, expiresAt: Date.now() + ttl })
}

function extractJson<T>(text: string): T {
	const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
	const raw = (fenced ? fenced[1] : text).trim()
	const start = raw.indexOf("{")
	const end = raw.lastIndexOf("}")
	if (start === -1 || end === -1) {
		throw new Error("Model returned no JSON object")
	}
	return JSON.parse(raw.slice(start, end + 1)) as T
}

const PARSE_SYSTEM = `You translate recruiter search queries into a structured GitHub user search.

Return ONLY a JSON object with these keys:
- "language": primary programming language if mentioned, lowercase, no quotes (e.g. "rust", "typescript"). Omit if unclear.
- "location": ONLY a specific city or country (e.g. "Berlin", "Germany", "San Francisco"). DO NOT include continents, regions, or vague areas like "Europe", "Asia", "EU", "North America", "remote" — GitHub's location filter only works on specific places and would return zero results. If the query mentions a continent or region, omit "location" entirely.
- "refinedQuery": 1-3 keywords to use as the GitHub user search term. Strip filler words like "best", "top", "find me a", "senior", "junior". Keep technical keywords. If the query is purely about a language with no other keyword, use the language name.
- "intent": one short sentence summarizing what the recruiter is looking for. This will be shown to the user.

Examples:
"best rust developer in Berlin" -> {"language":"rust","location":"Berlin","refinedQuery":"rust","intent":"Senior Rust developers based in Berlin"}
"Senior Go engineers in Europe with distributed systems experience" -> {"language":"go","refinedQuery":"go distributed systems","intent":"Senior Go engineers in Europe with distributed systems experience"}
"react native engineers with open source experience" -> {"language":"javascript","refinedQuery":"react native","intent":"React Native engineers with notable open source contributions"}
"top ML researchers" -> {"language":"python","refinedQuery":"machine learning","intent":"Machine learning researchers"}
"frontend devs in Germany" -> {"language":"javascript","location":"Germany","refinedQuery":"frontend","intent":"Frontend developers based in Germany"}`

export async function parseQuery(rawQuery: string): Promise<ParsedQuery> {
	const key = rawQuery.trim().toLowerCase()
	const cached = readCache(parseCache, key)
	if (cached) return cached

	const response = await getClient().messages.create({
		model: MODEL,
		max_tokens: 300,
		system: PARSE_SYSTEM,
		messages: [{ role: "user", content: rawQuery }],
	})

	const text = response.content
		.filter((block): block is Anthropic.TextBlock => block.type === "text")
		.map((block) => block.text)
		.join("")

	const parsed = extractJson<ParsedQuery>(text)
	if (!parsed.refinedQuery) {
		parsed.refinedQuery = rawQuery
	}
	if (!parsed.intent) {
		parsed.intent = rawQuery
	}

	writeCache(parseCache, key, parsed, PARSE_CACHE_TTL_MS)
	return parsed
}

const SCORE_SYSTEM = `You evaluate how well a GitHub user matches a recruiter's intent based on their public GitHub profile signal.

Return ONLY a JSON object:
- "score": integer 0-100. Calibrate: 90+ exceptional fit, 70-89 strong fit, 50-69 plausible, below 50 weak signal.
- "reasoning": one sentence (max 18 words), specific. Reference the strongest signal you see (popularity, account type, login relevance). Do not start with "This candidate" or "The user".

Be honest. Most candidates from a keyword search are mid-tier — score them that way.`

type ScoreCandidateInput = {
	username: string
	type: string
	githubRelevance: number
	intent: string
	language?: string
	location?: string
}

export async function scoreCandidate(
	input: ScoreCandidateInput,
): Promise<CandidateScore> {
	const cacheKey = `${input.username.toLowerCase()}|${input.intent.toLowerCase()}`
	const cached = readCache(scoreCache, cacheKey)
	if (cached) return cached

	const userMessage = [
		`Recruiter intent: ${input.intent}`,
		input.language ? `Target language: ${input.language}` : null,
		input.location ? `Target location: ${input.location}` : null,
		"",
		`Candidate:`,
		`- GitHub login: ${input.username}`,
		`- Account type: ${input.type}`,
		`- GitHub relevance score: ${input.githubRelevance.toFixed(2)} (0-1, higher = better text match on profile)`,
	]
		.filter(Boolean)
		.join("\n")

	const response = await getClient().messages.create({
		model: MODEL,
		max_tokens: 200,
		system: SCORE_SYSTEM,
		messages: [{ role: "user", content: userMessage }],
	})

	const text = response.content
		.filter((block): block is Anthropic.TextBlock => block.type === "text")
		.map((block) => block.text)
		.join("")

	const result = extractJson<CandidateScore>(text)
	result.score = Math.max(0, Math.min(100, Math.round(result.score)))
	if (!result.reasoning) result.reasoning = "No reasoning provided."

	writeCache(scoreCache, cacheKey, result, SCORE_CACHE_TTL_MS)
	return result
}

export const aiService = { parseQuery, scoreCandidate }
