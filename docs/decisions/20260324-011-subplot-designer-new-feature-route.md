# ADR-011: Sub-Plot Designer as new standalone feature route

**Date:** 2026-03-24
**Status:** Decided
**Deciders:** Rod (LeanSpirited)
**Tags:** architecture | ux | product

## Context
Claude.ai produced a prototype (`tgw-subplot-designer.html`) — a polygon-zone canvas tool for drawing and filling garden sub-plots with surface materials (lawn, patio, gravel, decking, etc.). The question was whether this should be integrated into `app.html` as a new mode, or shipped as a standalone route following the `/features/` pattern.

## Decision
Ship as a new standalone route at `/features/subplot-designer/index.html`, consistent with the established `/features/plant-palette/` and `/features/quick-quote/` pattern. This keeps it independently deployable, independently presentable to Oz and Jerry, and avoids coupling to the existing `app.html` canvas system.

## Alternatives considered
| Option | Why rejected |
|--------|-------------|
| Integrate into `app.html` as new mode | app.html already has Plan/Proposal views + plant placement system. Adding polygon zone drawing as a third mode increases complexity significantly. Standalone keeps concerns separated. |
| Gate behind Ollie test (feature branch) | New standalone tool — no existing code is modified. No Ollie gate needed. Ships to main directly. |

## Consequences
**Positive:** Independently deployable and shareable. Oz and Jerry can be shown a URL. Does not risk the main wizard flow. Consistent with existing /features/ architecture.
**Negative / trade-offs:** Subplot data is not yet linked to plant palette or proposal output — currently a standalone design tool, not integrated into the proposal workflow.
**Neutral:** Adds a third entry in the /features/ directory.

## Linked items
- Backlog: YGW-076
- Related: ADR-012 (colour palette decision)
