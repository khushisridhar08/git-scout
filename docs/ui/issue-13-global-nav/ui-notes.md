# UI Design – Global Navigation & Search Pages (GitScout)

This document provides implementation-ready UI specifications for the GitScout global navigation and search experience.  
The goal is to eliminate ambiguity so the frontend can implement layouts, spacing, and component structure without guessing.

---

## 1. Overall Page Layout

- Desktop-first layout (minimum viewport width: ~1280px)
- The page is divided into three primary regions:
  1. Global top navigation bar
  2. Left-side filter panel
  3. Main content area (search results)

- The global navigation bar is fixed to the top of the viewport.
- The filter panel and main content scroll vertically with the page.

---

## 2. Global Navigation Bar

- Height: ~64px
- Position: Fixed at top of viewport
- Layout:
  - Left:
    - GitScout logo
    - Primary navigation links: `Search`, `Shortlists`
  - Right:
    - API rate limit indicator
    - Theme toggle (light / dark mode)

- The navigation bar remains visible while scrolling.
- API rate limit indicator text format examples:
  - `API: 320 remaining`
  - `API: 80 remaining`
  - `API limit reached`

---

## 3. Filter Panel

- Position: Left side of the page
- Fixed width: ~280px
- Vertical layout
- Does not scroll independently; scrolls together with the main page

### Filter controls include:
- Primary language (dropdown)
- Location (text input)
- Followers (min / max numeric inputs)
- Public repositories (min / max numeric inputs)
- Sort results by (dropdown, e.g. Best Match, Highest Score)

---

## 4. Search & Results Header

- Search input is displayed at the top of the main content area.
- Search input supports text-based queries (e.g. name, username, bio keywords).
- Below the search input:
  - Results summary text (e.g. `1,204 developers found`)
  - Optional pagination or result range indicator (e.g. `Showing 1–10`)

---

## 5. Results Grid Layout

- Results are displayed in a card-based grid layout.
- Desktop layout uses two columns.
- Card sizing:
  - Maximum width per card: ~420px
- Spacing:
  - Horizontal gap between cards: ~24px
  - Vertical gap between rows: ~24px

- The results grid scrolls vertically within the page.

---

## 6. Candidate Card Structure

Each candidate card contains the following elements:

- Top section:
  - Avatar aligned to the top-left
  - Candidate name and username displayed horizontally
  - GitScout score badge aligned to the top-right

- Metadata row below name:
  - Repository count
  - Follower count
  - Location (if available)

- Skills section:
  - Displayed as tag-style labels
  - Shows top languages or primary technologies

---

## 7. UI States

### Loading State
- Skeleton cards displayed in the same grid layout as results
- Prevents layout shift when data loads

### Empty State
- Centered message in the results area indicating no matching developers
- Example: `No developers found for the current filters`

### Error State
- Inline error message displayed in the results area
- Includes a retry action where applicable

---

## 8. Design Notes

- Visual polish is secondary to structural clarity.
- Layout consistency and predictable spacing are prioritized to support straightforward frontend implementation.
- The included UI screenshots represent implementation-ready screen layouts and should be treated as the primary visual reference.