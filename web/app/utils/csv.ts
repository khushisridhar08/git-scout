function escapeCell(value: unknown): string {
	const text = value === null || value === undefined ? "" : String(value)
	if (/[",\n\r]/.test(text)) {
		return `"${text.replaceAll('"', '""')}"`
	}
	return text
}

export function toCsv(
	headers: string[],
	rows: ReadonlyArray<ReadonlyArray<unknown>>,
): string {
	const lines = [headers.map(escapeCell).join(",")]
	for (const row of rows) {
		lines.push(row.map(escapeCell).join(","))
	}
	return lines.join("\n")
}

export function downloadCsv(filename: string, csv: string): void {
	const blob = new Blob([`\uFEFF${csv}`], {
		type: "text/csv;charset=utf-8;",
	})
	const url = URL.createObjectURL(blob)
	try {
		const link = document.createElement("a")
		link.href = url
		link.download = filename
		document.body.appendChild(link)
		link.click()
		link.remove()
	} finally {
		URL.revokeObjectURL(url)
	}
}
