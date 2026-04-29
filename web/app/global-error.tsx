"use client"

export default function GlobalError() {
	return (
		<html lang="en">
			<body>
				<main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background text-foreground">
					<h1 className="text-2xl font-semibold">Something went wrong</h1>
					<p className="text-sm opacity-70">
						Please refresh the page or try again later.
					</p>
				</main>
			</body>
		</html>
	)
}
