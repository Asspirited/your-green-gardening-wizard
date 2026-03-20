# ADR-003: Multi-file structure from day one, not single index.html

**Date:** 2026-03-20
**Status:** Decided
**Deciders:** Rod (LeanSpirited)
**Tags:** architecture, process

## Context
Early YGW work was a single HTML file. The question was whether to continue
that pattern (faster to start) or establish proper file structure immediately.
The cost of delay framing was applied: what is the weekly cost of waiting?

## Decision
Proper multi-file structure from the start:
index.html (landing), app.html (canvas tool), css/seasons.css (shared themes),
js/seasons.js (shared detection + theme data), js/canvas.js (app only),
data/plants.json (element library). Shared files used by both pages — no
duplication of seasonal logic.

## Alternatives considered
| Option | Why rejected |
|--------|-------------|
| Single index.html | Fast to start, but Ollie/Oz reactions drive rapid iteration — duplication compounds quickly |
| Wait until post-validation | Validation IS the build — Ollie's reaction to the tool is the customer interview |

## Consequences
**Positive:** Shared seasonal theme system; clean separation of concerns; easier to iterate.
**Negative:** Slightly more setup time on day one.
**Neutral:** Refactor cost avoided later; small upfront cost accepted.

## Linked items
- Related: ADR-004 (plants.json data model)
