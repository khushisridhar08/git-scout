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
- Circular shimmer placeholder for avatar, rectangular bars for name/bio/metadata
- See: `loading-skeleton-state.png`

### Empty State
- Centered message in the results area indicating no matching developers
- Magnifying glass icon with X overlay to visually communicate "no results"
- Heading: `No developers found`
- Subtext: `Try adjusting your search query or filters to find more candidates`
- Action: `Clear all filters` button (outline style)
- See: `empty-state.png`

### Error State
- Inline error message displayed in the results area
- Warning triangle icon in red/orange
- Heading: `Something went wrong`
- Subtext explaining possible causes (network issue, rate limit exceeded)
- Actions: `Try again` (solid button) and `Check API status` (outline button)
- Rate limit indicator shows "API limit reached" with red dot when rate-limited
- See: `error-state.png`

---

## 8. Developer Profile Detail View

When a user clicks on a candidate card, they navigate to a full-width profile detail page.

- No left sidebar filter panel — full-width layout
- Top section:
  - Large avatar (80px), name, username
  - GitScout Score badge (circular, prominent)
  - Action buttons: `Add to Shortlist`, `View on GitHub`
- Stats bar: 4 metric cards (Repositories, Followers, Following, Joined date)
- Bio section with location and personal website link
- Top Languages: Horizontal bar chart showing language distribution with percentages
- Popular Repositories: 2x2 grid of repo cards (name, description, stars, forks, language)
- Contribution Activity: GitHub-style contribution heatmap grid with yearly summary
- See: `developer-profile-detail.png`

---

## 9. Shortlists Page

Accessible via the `Shortlists` navigation link. Full-width layout (no sidebar).

- Page heading: `Your Shortlists` with `+ Create New Shortlist` button
- Shortlist cards displayed in a vertical stack:
  - Shortlist name with color-coded dot indicator
  - Candidate count and creation date
  - Overlapping avatar previews of saved candidates
  - Technology/skill tags associated with the shortlist
  - More options menu (`...` button)
- See: `shortlists-page.png`

---

## 10. Mobile Responsive Layout

For viewports below ~768px:

- Navigation bar collapses: logo on left, hamburger menu icon on right
- Nav links and API indicator hidden behind hamburger menu
- Search bar is full-width below the nav
- Filter panel replaced by horizontal scrolling filter chips/pills (e.g. `Language: Any`, `Location`, `Followers`, `Sort: Best Match`)
- Results switch to single-column stacked cards (full width)
- Card layout compresses: avatar + name + score on one row, bio below, metadata + tags below
- `Load more` button spans full width
- See: `mobile-responsive-view.png`

---

## 11. Design Notes

- Visual polish is secondary to structural clarity.
- Layout consistency and predictable spacing are prioritized to support straightforward frontend implementation.
- The included UI screenshots represent implementation-ready screen layouts and should be treated as the primary visual reference.

---

## 12. Screenshot Reference Index

| File | Description |
|------|-------------|
| `nav-wireframe.png` | Global navigation bar wireframe |
| `rate-limit-states.png` | API rate limit indicator states (320, 80, limit reached) |
| `search-page-layout.png` | Full search page with filter panel and list results |
| `search-results-layout.png` | Grid-based search results with score badges and pagination |
| `loading-skeleton-state.png` | Loading/skeleton placeholder state |
| `empty-state.png` | No results found empty state |
| `error-state.png` | Error state with retry actions |
| `developer-profile-detail.png` | Developer profile detail view |
| `shortlists-page.png` | Shortlists management page |
| `mobile-responsive-view.png` | Mobile responsive search layout |