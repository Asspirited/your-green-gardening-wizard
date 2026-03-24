# ADR-014: Integrate zone drawing into app.html as third view mode

**Date:** 2026-03-24
**Status:** Decided — Supersedes ADR-011
**Deciders:** Rod (LeanSpirited)
**Tags:** architecture | ux

## Context
ADR-011 shipped the Sub-Plot Designer as a standalone `/features/subplot-designer/` route. Rod identified that this breaks the designer flow: the correct sequence is draw outer boundary → draw zones within it → place plants — all in one canvas. Splitting boundary drawing and zone drawing across two pages loses the spatial context.

## Decision
Integrate zone drawing into `app.html` as a third view mode ("🗺 Zones"), sitting between Plan and Proposal. When in Zones view: the left panel shows the garden object library (lawn, patio, gravel, etc.) instead of the plant palette; the right panel shows the zone list and fill controls instead of the info panel; the canvas switches to polygon-drawing mode for zones. Zone vertices are stored in world coordinates (metres) and rendered using the existing `toCanvas()` transform so they pan/zoom correctly with the rest of the canvas.

The `/features/subplot-designer/` standalone remains as-is — it is accessible and works. It is not actively deleted.

## Alternatives considered
| Option | Why rejected |
|--------|-------------|
| Keep standalone, add deep-link from app.html | Still loses context. User can't see their boundary while drawing zones. |
| New separate app for the full "design tool" | Premature. app.html is the right host for Phase 1 landscaper workflow. |

## Consequences
**Positive:** One canvas, full flow. Designer draws boundary, switches to Zones, draws zones inside it, switches back to Plan, places plants. Natural professional tool flow.
**Negative / trade-offs:** More complexity in app.html. Zone state is added to plot save/load.
**Neutral:** `/features/subplot-designer/` standalone stays live but is no longer the primary entry point.

## Linked items
- Supersedes: ADR-011 (standalone route decision)
- Backlog: YGW-076 (updated)
- Related: ADR-012 (BRG palette — not applied here; app.html keeps cream/green system)
