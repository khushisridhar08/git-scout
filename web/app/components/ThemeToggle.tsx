"use client"

import { useEffect, useState } from "react"
import { cn } from "@/utils/cn"

type Theme = "light" | "dark"

const STORAGE_KEY = "gitscout:theme"

function getInitialTheme(): Theme {
	if (typeof window === "undefined") return "dark"
	const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null
	if (stored === "light" || stored === "dark") return stored
	// `<html class="dark">` is rendered server-side, so default to dark
	// to match what the user already sees on first paint.
	return "dark"
}

export function ThemeToggle({ className }: { className?: string }) {
	// Render with the SSR default until mounted to avoid a hydration mismatch.
	const [mounted, setMounted] = useState(false)
	const [theme, setTheme] = useState<Theme>("dark")

	useEffect(() => {
		setMounted(true)
		const initial = getInitialTheme()
		setTheme(initial)
		document.documentElement.classList.toggle("dark", initial === "dark")
	}, [])

	const toggle = () => {
		const next: Theme = theme === "dark" ? "light" : "dark"
		setTheme(next)
		document.documentElement.classList.toggle("dark", next === "dark")
		window.localStorage.setItem(STORAGE_KEY, next)
	}

	const isDark = mounted ? theme === "dark" : true

	return (
		<button
			type="button"
			onClick={toggle}
			className={cn(
				"rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground",
				className,
			)}
			aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
		>
			{isDark ? (
				<svg
					role="img"
					aria-label="Moon"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
				</svg>
			) : (
				<svg
					role="img"
					aria-label="Sun"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="12" cy="12" r="4" />
					<path d="M12 2v2" />
					<path d="M12 20v2" />
					<path d="m4.93 4.93 1.41 1.41" />
					<path d="m17.66 17.66 1.41 1.41" />
					<path d="M2 12h2" />
					<path d="M20 12h2" />
					<path d="m6.34 17.66-1.41 1.41" />
					<path d="m19.07 4.93-1.41 1.41" />
				</svg>
			)}
		</button>
	)
}
