# ADR-002: Auto-detect season from device date, manual override preserved

**Date:** 2026-03-20
**Status:** Decided
**Deciders:** Rod (LeanSpirited)
**Tags:** ux, product

## Context
The product is seasonal by design. The question was whether the season shown
should be determined automatically or always require user selection. Landscapers
plan ahead — Ollie may be designing a winter garden in July.

## Decision
Season is auto-detected from device date on first load (month → season mapping:
Mar–May = spring, Jun–Aug = summer, Sep–Nov = autumn, Dec–Feb = winter).
User can override manually at any time. UI shows AUTO / MANUAL indicator so
users always know whether they're viewing the detected or chosen season.

## Alternatives considered
| Option | Why rejected |
|--------|-------------|
| Always manual | Adds friction; most users expect the current season |
| Auto only, no override | Breaks landscaper workflow — planning ahead is core use case |

## Consequences
**Positive:** Zero-friction first experience; professional planning workflow preserved.
**Negative:** None significant.
**Neutral:** Seasonal calendar (preview any date) logged as future backlog item YGW-0xx.

## Linked items
- Backlog: YGW-0xx (seasonal calendar — future item)
