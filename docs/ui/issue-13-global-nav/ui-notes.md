# UI Design – Global Navigation & API Rate Limit Indicator

This document describes the UI design contribution for Issue #13: Global navigation and API rate limit indicator.

## Global Navigation
- A persistent top navigation bar is used across all pages.
- The navigation includes:
  - GitScout logo on the left
  - Primary links: Search, Shortlists
  - Utility section on the right with API status and theme toggle
- The navigation is designed for clarity and minimal distraction, optimized for dark mode.

## API Rate Limit Indicator
The API rate limit indicator is displayed in the top-right corner of the navigation bar to provide continuous feedback to the user.

Three states are considered:
1. **Healthy** – API: 320 remaining  
   Indicates normal operation with sufficient remaining requests.
2. **Warning** – API: 80 remaining  
   Warns the user that the rate limit is approaching.
3. **Critical** – API limit reached  
   Clearly informs the user that no further API requests can be made.

These states help users understand system availability at a glance and prevent unexpected failures.