"use client"

export function LanguageChart({ languages }: { languages: string[] }) {
	return (
		<div className="rounded-xl border bg-card p-5 shadow-sm">
			<h2 className="font-semibold text-base">Languages</h2>

			{languages.length === 0 ? (
				<p className="mt-4 text-muted-foreground text-sm">
					No language data available.
				</p>
			) : (
				<div className="mt-4 flex flex-wrap gap-2">
					{languages.slice(0, 12).map((language) => (
						<span
							key={language}
							className="rounded-full bg-muted px-2 py-1 text-foreground text-xs"
						>
							{language}
						</span>
					))}
				</div>
			)}
		</div>
	)
}
