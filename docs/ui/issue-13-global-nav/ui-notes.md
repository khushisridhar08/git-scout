# UI Design – Global Navigation & API Rate Limit Indicator

This document describes the finalized UI design and implementation-ready specifications for the global navigation bar and API rate limit indicator used across GitScout.

---

## 1. Global Navigation Overview

A persistent top navigation bar is displayed across all main pages of the application.

### Layout Structure

- Header height: approximately **56–64px**
- Content is vertically centered within the header
- Header width aligns with the main content container
- Navigation is visually divided into three regions:
  - **Left:** Branding
  - **Center:** Primary navigation links
  - **Right:** Utility area

---

## 2. Left Section – Branding

- Displays the text logo **“GitScout”**
- Styled as primary branding (white text on dark background)
- Clicking the logo routes the user to the main search page (`/search`)

---

## 3. Center Section – Primary Navigation

- Contains primary navigation links:
  - **Search**
  - **Shortlists**
- Links are displayed as text buttons
- Default state uses muted white to reduce visual noise
- Active page may use brighter white or an underline to indicate selection

---

## 4. Right Section – Utility Area

The right section contains utility-related UI elements aligned horizontally.

### 4.1 API Rate Limit Indicator

The API rate limit indicator is a pill-style component that communicates the current GitHub API usage state.

#### Visual Style

- Rounded pill container
- Consistent padding across all states to prevent layout shift
- Contains:
  - A small colored dot indicating status
  - Text describing remaining API requests

#### States

| State   | Condition              | Color  | Text Display              |
|--------|------------------------|--------|---------------------------|
| Normal | remaining > 100        | Green  | `API: {n} remaining`      |
| Warning| remaining ≤ 100        | Yellow | `API: {n} remaining`      |
| Limit  | remaining = 0          | Red    | `API limit reached`       |

- `{n}` represents the remaining request count returned by the API
- Color and text update dynamically based on the state
- The indicator is informational and does not require user interaction

#### Component Notes

- Treated as a reusable UI component
- Fixed height across states
- Does not trigger layout changes when state updates

---

### 4.2 Theme Toggle

- A theme toggle icon (e.g., moon icon) is placed to the right of the API indicator
- Toggles between light and dark mode
- Icon-only button, no text label required

---

## 5. Visual Reference

- `nav-wireframe.png`: Structural layout reference
- `rate-limit-states.png`: API rate limit indicator state reference
- `nav-final.png`: Final visual mock of the global navigation

---

## 6. Design Intent

The navigation is designed to remain visually minimal while clearly communicating system status. The API rate limit indicator is intentionally prominent but non-intrusive, allowing users to stay aware of usage limits without interrupting normal workflows.

This UI specification is intended to allow frontend implementation without ambiguity or additional clarification.