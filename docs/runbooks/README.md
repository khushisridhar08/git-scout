# Runbooks

Operational playbooks for GitScout. Each runbook answers one question:

> **When _X_ happens, what do I do?**

Keep them short, action-oriented, and runnable. If a step takes more than
two paragraphs to explain, link to a doc; don't expand the runbook.

## Available runbooks

| Runbook                                            | When to use                                                |
|----------------------------------------------------|------------------------------------------------------------|
| [Local development setup](local-development.md)    | New contributor or returning to the repo after a break     |
| [GitHub rate limits](github-rate-limits.md)        | API returns 403 / rate-limit badge shows 0 remaining       |

## Adding a runbook

Pick a problem your team has actually hit (or expects to hit) and write
the response steps in a checklist. Templates aren't necessary — just
follow the shape of the existing files: **When applies → Background →
Diagnose → Mitigate → Escalate**.
