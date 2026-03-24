# ADR-013: Drop Ollie merge gate — merge landscaper tools to main now

**Date:** 2026-03-24
**Status:** Decided
**Deciders:** Rod (LeanSpirited)
**Tags:** product | process

## Context
ADR (session 2026-03-20) established that the `feature/tgw-landscaper-tools` branch would not merge to main until YGW-066-AC-007 (Ollie test) passed — Ollie would run a real landscaper brief and judge output quality as client-ready.

The strategic context has shifted: we are now exploring the landscaper / end-user need for cheap design tooling. Ollie needs richer stimulus (all three tools together: Plant Palette, Quick Quote, Sub-Plot Designer) rather than a single isolated feature test. Holding everything on a feature branch reduces the surface area available for that exploration.

## Decision
Merge `feature/tgw-landscaper-tools` to main immediately. The Ollie test remains the quality validation mechanism — it is not cancelled, just decoupled from the merge gate. Ollie tests all three tools together on main rather than the palette in isolation from a preview URL.

## Alternatives considered
| Option | Why rejected |
|--------|-------------|
| Keep Ollie gate, share preview URLs | Preview URLs are harder to share casually. Ollie gets less stimulus. Misses the "cheap design" exploration angle. |
| Cancel Ollie test entirely | No — HDD-001 is still open. Ollie test still validates the hypothesis; it just fires on main, not a branch. |

## Consequences
**Positive:** All three landscaper tools live on main. One clean URL set for Oz and Jerry. Ollie gets a richer test surface. Faster learning.
**Negative / trade-offs:** If output quality is poor, it is live on main rather than behind a preview URL. Acceptable — the consumer wizard is still the primary entry point; landscaper tools are secondary pages.
**Neutral:** HDD-001 remains OPEN. Ollie test is the next action, now on main.

## Linked items
- Backlog: YGW-066 (Plant Palette), YGW-071 (Quick Quote)
- Supersedes: YGW-066-AC-007 merge gate policy (not the test itself)
- Related: ADR-010 (Engine of Growth), ADR-011 (Sub-Plot Designer route)
