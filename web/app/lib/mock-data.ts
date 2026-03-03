import type { Candidate, SearchResponse, SearchFilters } from "@/types/search"

type Language = { name: string; percentage: number; color: string }
type Repo = {
	name: string
	description: string
	stars: number
	forks: number
	language: string
	languageColor: string
}

export type MockProfile = {
	id: number
	login: string
	name: string
	avatar_url: string
	html_url: string
	bio: string
	location: string
	blog: string
	public_repos: number
	followers: number
	following: number
	created_at: string
	gitscout_score: number
	languages: Language[]
	repos: Repo[]
	contributionsLastYear: number
}

const LANG_COLORS: Record<string, string> = {
	JavaScript: "bg-yellow-500",
	TypeScript: "bg-blue-500",
	Python: "bg-green-500",
	Rust: "bg-orange-600",
	Go: "bg-cyan-500",
	Java: "bg-red-500",
	"C++": "bg-pink-600",
	Swift: "bg-orange-500",
	Kotlin: "bg-purple-500",
	Ruby: "bg-red-600",
	CSS: "bg-pink-500",
	HTML: "bg-red-400",
	Shell: "bg-emerald-500",
	Dart: "bg-sky-400",
	Elixir: "bg-violet-500",
	Scala: "bg-red-400",
}

export const MOCK_PROFILES: MockProfile[] = [
	{
		id: 1001,
		login: "elenarodr",
		name: "Elena Rodriguez",
		avatar_url: "https://avatars.githubusercontent.com/u/6764957",
		html_url: "https://github.com/elenarodr",
		bio: "Senior Frontend Engineer specializing in React, Next.js, and complex interactive UIs. Open source contributor to UI libraries and design systems.",
		location: "San Francisco, CA",
		blog: "elenarodriguez.dev",
		public_repos: 128,
		followers: 4200,
		following: 892,
		created_at: "2018-03-15T00:00:00Z",
		gitscout_score: 94,
		languages: [
			{ name: "TypeScript", percentage: 45, color: LANG_COLORS.TypeScript },
			{ name: "JavaScript", percentage: 30, color: LANG_COLORS.JavaScript },
			{ name: "CSS", percentage: 15, color: LANG_COLORS.CSS },
			{ name: "HTML", percentage: 10, color: LANG_COLORS.HTML },
		],
		repos: [
			{ name: "react-design-system", description: "A comprehensive React component library with 60+ accessible components, theming, and Storybook docs.", stars: 4500, forks: 320, language: "TypeScript", languageColor: LANG_COLORS.TypeScript },
			{ name: "nextjs-dashboard", description: "Production-ready admin dashboard template with auth, charts, and dark mode.", stars: 3200, forks: 280, language: "TypeScript", languageColor: LANG_COLORS.TypeScript },
			{ name: "css-motion", description: "Lightweight animation library for React with spring physics.", stars: 1800, forks: 95, language: "JavaScript", languageColor: LANG_COLORS.JavaScript },
			{ name: "form-wizard", description: "Multi-step form library with validation and state persistence.", stars: 920, forks: 64, language: "TypeScript", languageColor: LANG_COLORS.TypeScript },
		],
		contributionsLastYear: 1247,
	},
	{
		id: 1002,
		login: "marcuswei",
		name: "Marcus Wei",
		avatar_url: "https://avatars.githubusercontent.com/u/810438",
		html_url: "https://github.com/marcuswei",
		bio: "Staff Engineer at a Series B startup. Building distributed systems in Go and Rust. Previously at Cloudflare.",
		location: "Seattle, WA",
		blog: "marcuswei.io",
		public_repos: 67,
		followers: 3100,
		following: 245,
		created_at: "2016-08-20T00:00:00Z",
		gitscout_score: 91,
		languages: [
			{ name: "Go", percentage: 40, color: LANG_COLORS.Go },
			{ name: "Rust", percentage: 35, color: LANG_COLORS.Rust },
			{ name: "TypeScript", percentage: 15, color: LANG_COLORS.TypeScript },
			{ name: "Shell", percentage: 10, color: LANG_COLORS.Shell },
		],
		repos: [
			{ name: "kv-engine", description: "Embeddable key-value store with MVCC and WAL, written in Rust.", stars: 5200, forks: 180, language: "Rust", languageColor: LANG_COLORS.Rust },
			{ name: "micro-gateway", description: "API gateway with rate limiting, circuit breaking, and hot-reload config.", stars: 2800, forks: 210, language: "Go", languageColor: LANG_COLORS.Go },
			{ name: "raft-consensus", description: "Production-grade Raft implementation with leader leases.", stars: 1600, forks: 92, language: "Go", languageColor: LANG_COLORS.Go },
			{ name: "bench-suite", description: "Standardized benchmark suite for comparing KV stores.", stars: 740, forks: 45, language: "Rust", languageColor: LANG_COLORS.Rust },
		],
		contributionsLastYear: 982,
	},
	{
		id: 1003,
		login: "priyapatel",
		name: "Priya Patel",
		avatar_url: "https://avatars.githubusercontent.com/u/17103345",
		html_url: "https://github.com/priyapatel",
		bio: "ML Engineer focused on NLP and LLM applications. Building tools to make AI more accessible. PyTorch contributor.",
		location: "New York, NY",
		blog: "priya.ml",
		public_repos: 94,
		followers: 5800,
		following: 312,
		created_at: "2019-01-10T00:00:00Z",
		gitscout_score: 96,
		languages: [
			{ name: "Python", percentage: 65, color: LANG_COLORS.Python },
			{ name: "TypeScript", percentage: 15, color: LANG_COLORS.TypeScript },
			{ name: "Rust", percentage: 12, color: LANG_COLORS.Rust },
			{ name: "Shell", percentage: 8, color: LANG_COLORS.Shell },
		],
		repos: [
			{ name: "llm-toolkit", description: "High-level toolkit for fine-tuning and deploying LLMs with minimal boilerplate.", stars: 8900, forks: 1200, language: "Python", languageColor: LANG_COLORS.Python },
			{ name: "embed-search", description: "Semantic search engine using sentence embeddings and HNSW index.", stars: 3400, forks: 420, language: "Python", languageColor: LANG_COLORS.Python },
			{ name: "prompt-lab", description: "Interactive prompt engineering workspace with version control.", stars: 2100, forks: 180, language: "TypeScript", languageColor: LANG_COLORS.TypeScript },
			{ name: "tokenizer-rs", description: "Fast BPE tokenizer in Rust with Python bindings.", stars: 1500, forks: 85, language: "Rust", languageColor: LANG_COLORS.Rust },
		],
		contributionsLastYear: 1563,
	},
	{
		id: 1004,
		login: "jamesbk",
		name: "James Baker",
		avatar_url: "https://avatars.githubusercontent.com/u/5041459",
		html_url: "https://github.com/jamesbk",
		bio: "Full-stack TypeScript dev. Building SaaS products. Passionate about DX, testing, and clean architecture.",
		location: "Austin, TX",
		blog: "jamesbaker.dev",
		public_repos: 156,
		followers: 2400,
		following: 580,
		created_at: "2017-06-01T00:00:00Z",
		gitscout_score: 87,
		languages: [
			{ name: "TypeScript", percentage: 55, color: LANG_COLORS.TypeScript },
			{ name: "JavaScript", percentage: 25, color: LANG_COLORS.JavaScript },
			{ name: "Python", percentage: 12, color: LANG_COLORS.Python },
			{ name: "Shell", percentage: 8, color: LANG_COLORS.Shell },
		],
		repos: [
			{ name: "saas-starter", description: "Production SaaS boilerplate with auth, billing, teams, and admin panel.", stars: 6200, forks: 890, language: "TypeScript", languageColor: LANG_COLORS.TypeScript },
			{ name: "test-factory", description: "Elegant test data factories for TypeScript with type-safe builders.", stars: 1800, forks: 120, language: "TypeScript", languageColor: LANG_COLORS.TypeScript },
			{ name: "env-guard", description: "Runtime environment variable validation with zero dependencies.", stars: 940, forks: 55, language: "TypeScript", languageColor: LANG_COLORS.TypeScript },
			{ name: "api-docs-gen", description: "Auto-generate OpenAPI docs from your Express/Elysia routes.", stars: 620, forks: 38, language: "TypeScript", languageColor: LANG_COLORS.TypeScript },
		],
		contributionsLastYear: 1089,
	},
	{
		id: 1005,
		login: "sarahchen",
		name: "Sarah Chen",
		avatar_url: "https://avatars.githubusercontent.com/u/30010878",
		html_url: "https://github.com/sarahchen",
		bio: "iOS & Swift developer. Building beautiful, performant mobile experiences. SwiftUI enthusiast and conference speaker.",
		location: "Toronto, Canada",
		blog: "sarahchen.ca",
		public_repos: 72,
		followers: 1900,
		following: 340,
		created_at: "2019-09-22T00:00:00Z",
		gitscout_score: 83,
		languages: [
			{ name: "Swift", percentage: 60, color: LANG_COLORS.Swift },
			{ name: "Kotlin", percentage: 20, color: LANG_COLORS.Kotlin },
			{ name: "TypeScript", percentage: 12, color: LANG_COLORS.TypeScript },
			{ name: "Python", percentage: 8, color: LANG_COLORS.Python },
		],
		repos: [
			{ name: "swiftui-components", description: "50+ production-ready SwiftUI components with accessibility built in.", stars: 3800, forks: 290, language: "Swift", languageColor: LANG_COLORS.Swift },
			{ name: "network-kit", description: "Type-safe networking layer for Swift with async/await and retry logic.", stars: 1400, forks: 95, language: "Swift", languageColor: LANG_COLORS.Swift },
			{ name: "app-architecture", description: "Reference iOS app showing MVVM-C with Combine and SwiftUI.", stars: 980, forks: 120, language: "Swift", languageColor: LANG_COLORS.Swift },
			{ name: "motion-ui", description: "Gesture-driven animations for iOS with spring physics.", stars: 650, forks: 42, language: "Swift", languageColor: LANG_COLORS.Swift },
		],
		contributionsLastYear: 876,
	},
	{
		id: 1006,
		login: "alexkuznetsov",
		name: "Alex Kuznetsov",
		avatar_url: "https://avatars.githubusercontent.com/u/22350032",
		html_url: "https://github.com/alexkuznetsov",
		bio: "DevOps & Platform Engineer. Kubernetes, Terraform, and observability. Making infrastructure boring (in a good way).",
		location: "Berlin, Germany",
		blog: "alexk.dev",
		public_repos: 89,
		followers: 2700,
		following: 195,
		created_at: "2017-11-05T00:00:00Z",
		gitscout_score: 88,
		languages: [
			{ name: "Go", percentage: 35, color: LANG_COLORS.Go },
			{ name: "Python", percentage: 25, color: LANG_COLORS.Python },
			{ name: "TypeScript", percentage: 20, color: LANG_COLORS.TypeScript },
			{ name: "Shell", percentage: 20, color: LANG_COLORS.Shell },
		],
		repos: [
			{ name: "k8s-operator-kit", description: "Framework for building Kubernetes operators in Go with minimal boilerplate.", stars: 4100, forks: 380, language: "Go", languageColor: LANG_COLORS.Go },
			{ name: "terraform-modules", description: "Battle-tested Terraform modules for AWS, GCP, and Azure.", stars: 2900, forks: 520, language: "Go", languageColor: LANG_COLORS.Go },
			{ name: "log-pipeline", description: "High-throughput log aggregation pipeline with filtering and alerting.", stars: 1700, forks: 140, language: "Go", languageColor: LANG_COLORS.Go },
			{ name: "deploy-cli", description: "Zero-config deployment CLI for containerized apps.", stars: 880, forks: 62, language: "TypeScript", languageColor: LANG_COLORS.TypeScript },
		],
		contributionsLastYear: 1340,
	},
	{
		id: 1007,
		login: "aishajohnson",
		name: "Aisha Johnson",
		avatar_url: "https://avatars.githubusercontent.com/u/36186278",
		html_url: "https://github.com/aishajohnson",
		bio: "Backend engineer specializing in event-driven architectures and real-time systems. Elixir and Rust enthusiast.",
		location: "London, UK",
		blog: "aishaj.com",
		public_repos: 53,
		followers: 1600,
		following: 280,
		created_at: "2020-02-14T00:00:00Z",
		gitscout_score: 85,
		languages: [
			{ name: "Elixir", percentage: 40, color: LANG_COLORS.Elixir },
			{ name: "Rust", percentage: 30, color: LANG_COLORS.Rust },
			{ name: "TypeScript", percentage: 20, color: LANG_COLORS.TypeScript },
			{ name: "Python", percentage: 10, color: LANG_COLORS.Python },
		],
		repos: [
			{ name: "event-bus", description: "Distributed event bus with guaranteed delivery and exactly-once semantics.", stars: 2600, forks: 190, language: "Elixir", languageColor: LANG_COLORS.Elixir },
			{ name: "phoenix-starter", description: "Full-featured Phoenix LiveView starter with auth, admin, and real-time features.", stars: 1900, forks: 240, language: "Elixir", languageColor: LANG_COLORS.Elixir },
			{ name: "ws-multiplexer", description: "WebSocket connection multiplexer with automatic reconnection.", stars: 1100, forks: 78, language: "Rust", languageColor: LANG_COLORS.Rust },
			{ name: "cqrs-example", description: "Reference implementation of CQRS + Event Sourcing in Elixir.", stars: 780, forks: 95, language: "Elixir", languageColor: LANG_COLORS.Elixir },
		],
		contributionsLastYear: 743,
	},
	{
		id: 1008,
		login: "danielpark",
		name: "Daniel Park",
		avatar_url: "https://avatars.githubusercontent.com/u/43127088",
		html_url: "https://github.com/danielpark",
		bio: "React Native & cross-platform mobile developer. Building apps used by millions. Performance optimization nerd.",
		location: "Seoul, South Korea",
		blog: "dpark.dev",
		public_repos: 81,
		followers: 3500,
		following: 420,
		created_at: "2018-07-30T00:00:00Z",
		gitscout_score: 90,
		languages: [
			{ name: "TypeScript", percentage: 45, color: LANG_COLORS.TypeScript },
			{ name: "JavaScript", percentage: 25, color: LANG_COLORS.JavaScript },
			{ name: "Dart", percentage: 15, color: LANG_COLORS.Dart },
			{ name: "Swift", percentage: 15, color: LANG_COLORS.Swift },
		],
		repos: [
			{ name: "rn-performance", description: "React Native performance monitoring and optimization toolkit.", stars: 5600, forks: 340, language: "TypeScript", languageColor: LANG_COLORS.TypeScript },
			{ name: "expo-template", description: "Production Expo template with navigation, state management, and CI/CD.", stars: 3100, forks: 450, language: "TypeScript", languageColor: LANG_COLORS.TypeScript },
			{ name: "native-animations", description: "60fps animations for React Native using Reanimated 3.", stars: 2200, forks: 160, language: "TypeScript", languageColor: LANG_COLORS.TypeScript },
			{ name: "cross-storage", description: "Unified storage API for React Native, web, and desktop.", stars: 890, forks: 72, language: "TypeScript", languageColor: LANG_COLORS.TypeScript },
		],
		contributionsLastYear: 1156,
	},
	{
		id: 1009,
		login: "oliviamartins",
		name: "Olivia Martins",
		avatar_url: "https://avatars.githubusercontent.com/u/52342893",
		html_url: "https://github.com/oliviamartins",
		bio: "Data engineer & analytics. Building data platforms with dbt, Spark, and modern lakehouse architectures.",
		location: "Sao Paulo, Brazil",
		blog: "oliviamartins.dev",
		public_repos: 45,
		followers: 1200,
		following: 180,
		created_at: "2020-06-18T00:00:00Z",
		gitscout_score: 79,
		languages: [
			{ name: "Python", percentage: 50, color: LANG_COLORS.Python },
			{ name: "Scala", percentage: 20, color: LANG_COLORS.Scala },
			{ name: "TypeScript", percentage: 18, color: LANG_COLORS.TypeScript },
			{ name: "Shell", percentage: 12, color: LANG_COLORS.Shell },
		],
		repos: [
			{ name: "lakehouse-starter", description: "Reference architecture for a modern data lakehouse with Delta Lake and Spark.", stars: 2100, forks: 310, language: "Python", languageColor: LANG_COLORS.Python },
			{ name: "dbt-utils-extra", description: "Extended dbt macros for complex transformations and data quality.", stars: 1400, forks: 180, language: "Python", languageColor: LANG_COLORS.Python },
			{ name: "data-catalog", description: "Self-hosted data catalog with lineage tracking and search.", stars: 890, forks: 95, language: "TypeScript", languageColor: LANG_COLORS.TypeScript },
			{ name: "etl-monitor", description: "Real-time monitoring dashboard for ETL pipelines.", stars: 560, forks: 48, language: "Python", languageColor: LANG_COLORS.Python },
		],
		contributionsLastYear: 634,
	},
	{
		id: 1010,
		login: "tomashiro",
		name: "Tomas Hiro",
		avatar_url: "https://avatars.githubusercontent.com/u/61543921",
		html_url: "https://github.com/tomashiro",
		bio: "Security engineer and open source maintainer. Fuzzing, vulnerability research, and secure-by-default tooling.",
		location: "Tokyo, Japan",
		blog: "tomashiro.sec",
		public_repos: 38,
		followers: 4800,
		following: 110,
		created_at: "2015-04-22T00:00:00Z",
		gitscout_score: 92,
		languages: [
			{ name: "Rust", percentage: 45, color: LANG_COLORS.Rust },
			{ name: "C++", percentage: 25, color: LANG_COLORS["C++"] },
			{ name: "Python", percentage: 18, color: LANG_COLORS.Python },
			{ name: "Go", percentage: 12, color: LANG_COLORS.Go },
		],
		repos: [
			{ name: "fuzz-forge", description: "Coverage-guided fuzzing framework for Rust and C/C++ with crash dedup.", stars: 6800, forks: 420, language: "Rust", languageColor: LANG_COLORS.Rust },
			{ name: "secure-headers", description: "HTTP security headers middleware for popular web frameworks.", stars: 3200, forks: 180, language: "Rust", languageColor: LANG_COLORS.Rust },
			{ name: "vuln-scanner", description: "Dependency vulnerability scanner with SBOM generation.", stars: 2400, forks: 210, language: "Go", languageColor: LANG_COLORS.Go },
			{ name: "crypto-audit", description: "Static analysis tool for common cryptographic misuse patterns.", stars: 1600, forks: 95, language: "Rust", languageColor: LANG_COLORS.Rust },
		],
		contributionsLastYear: 1420,
	},
]

export function getProfileByLogin(login: string): MockProfile | undefined {
	return MOCK_PROFILES.find(
		(p) => p.login.toLowerCase() === login.toLowerCase(),
	)
}

export function toSearchCandidate(profile: MockProfile): Candidate {
	return {
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
	}
}

export function mockSearch(filters: SearchFilters): SearchResponse {
	let results = [...MOCK_PROFILES]

	const q = (filters.q || "").toLowerCase()
	if (q) {
		results = results.filter((p) => {
			const haystack = [
				p.login,
				p.name,
				p.bio,
				p.location,
				...p.languages.map((l) => l.name),
				...p.repos.map((r) => r.name),
				...p.repos.map((r) => r.description),
			]
				.join(" ")
				.toLowerCase()
			return haystack.includes(q)
		})
	}

	if (filters.language) {
		const lang = filters.language.toLowerCase()
		results = results.filter((p) =>
			p.languages.some((l) => l.name.toLowerCase() === lang),
		)
	}

	if (filters.location) {
		const loc = filters.location.toLowerCase()
		results = results.filter((p) =>
			p.location.toLowerCase().includes(loc),
		)
	}

	if (filters.min_followers) {
		results = results.filter((p) => p.followers >= filters.min_followers!)
	}

	if (filters.min_repos) {
		results = results.filter(
			(p) => p.public_repos >= filters.min_repos!,
		)
	}

	switch (filters.sort) {
		case "followers":
			results.sort((a, b) =>
				filters.order === "asc"
					? a.followers - b.followers
					: b.followers - a.followers,
			)
			break
		case "repositories":
			results.sort((a, b) =>
				filters.order === "asc"
					? a.public_repos - b.public_repos
					: b.public_repos - a.public_repos,
			)
			break
		case "joined":
			results.sort((a, b) => {
				const diff =
					new Date(a.created_at).getTime() -
					new Date(b.created_at).getTime()
				return filters.order === "asc" ? diff : -diff
			})
			break
		default:
			results.sort((a, b) => b.gitscout_score - a.gitscout_score)
	}

	const page = filters.page ?? 1
	const perPage = filters.per_page ?? 10
	const start = (page - 1) * perPage
	const paged = results.slice(start, start + perPage)

	return {
		total_count: results.length,
		rate_limit: { limit: "60", remaining: "55" },
		candidates: paged.map(toSearchCandidate),
	}
}
