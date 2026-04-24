"use client"

export function LanguageChart({ languages }: { languages: string[] }) {
	return (
		<div className="rounded-xl border bg-white p-5 shadow-sm">
			<h2 className="font-semibold text-base">Languages</h2>

			{languages.length === 0 ? (
				<p className="mt-4 text-gray-600 text-sm">
					No language data available.
				</p>
			) : (
				<div className="mt-4 flex flex-wrap gap-2">
					{languages.slice(0, 12).map((language) => (
						<span
							key={language}
							className="rounded-full bg-gray-100 px-2 py-1 text-gray-800 text-xs"
						>
							{language}
						</span>
					))}
				</div>
			)}
		</div>
	)
}
