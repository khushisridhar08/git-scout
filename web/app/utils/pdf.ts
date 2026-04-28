import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

/**
 * Render a tabular shortlist export to a PDF and trigger a download.
 *
 * Mirrors the CSV export contract in `./csv.ts` but produces a
 * human-readable report rather than a data file:
 *
 *   - Title block with the shortlist name and generated-on date
 *   - Subtitle showing candidate count and a "via GitScout" attribution
 *   - Table built with `jspdf-autotable` (auto column sizing, page breaks)
 *
 * Used by the shortlist detail page next to the CSV button to satisfy
 * the proposal's "Export to CSV/PDF for ATS integration" requirement.
 */
export function downloadShortlistPdf(options: {
	filename: string
	shortlistName: string
	headers: string[]
	rows: ReadonlyArray<ReadonlyArray<string | number | null | undefined>>
}): void {
	const { filename, shortlistName, headers, rows } = options

	const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" })

	const generatedOn = new Date().toLocaleString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	})

	// Header
	doc.setFont("helvetica", "bold")
	doc.setFontSize(20)
	doc.text(shortlistName, 40, 50)

	doc.setFont("helvetica", "normal")
	doc.setFontSize(10)
	doc.setTextColor(120)
	doc.text(
		`${rows.length} candidate${rows.length === 1 ? "" : "s"} · generated ${generatedOn}`,
		40,
		68,
	)
	doc.text("Exported from GitScout", 40, 82)
	doc.setTextColor(0)

	// Table
	autoTable(doc, {
		startY: 110,
		head: [headers],
		body: rows.map((row) =>
			row.map((cell) => (cell === null || cell === undefined ? "" : String(cell))),
		),
		styles: { fontSize: 9, cellPadding: 6 },
		headStyles: { fillColor: [13, 17, 23], textColor: 255, fontStyle: "bold" },
		alternateRowStyles: { fillColor: [246, 248, 250] },
		theme: "grid",
		margin: { left: 40, right: 40 },
	})

	doc.save(filename)
}
