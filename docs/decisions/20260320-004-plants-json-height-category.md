# ADR-004: heightCategory and heightMetres.tenYear added to plants.json now

**Date:** 2026-03-20
**Status:** Decided
**Deciders:** Rod (LeanSpirited)
**Tags:** data, architecture

## Context
plants.json is the canonical element library. The immediate need was 2D canvas
rendering (spreadMetres sufficient). A future 3D / isometric view will require
height data. The question was whether to add height fields now or defer.

## Decision
heightCategory (ground/low/medium/tall/canopy) and heightMetres object
(mature + tenYear) added to all 30 elements immediately. Cost of delay applied:
cheap to add now, expensive to retrofit when 30+ elements need auditing.
The tenYear figure specifically is important for proposals — clients need to
know what a garden looks like at handover, not at full maturity.

## Alternatives considered
| Option | Why rejected |
|--------|-------------|
| Add height later when 3D is built | Retrofitting 30+ elements is error-prone; data quality better when added with context |
| Height category only, no metres | Insufficient for accurate 3D rendering and proposal copy |

## Consequences
**Positive:** 3D/isometric view can be built without a data migration sprint.
**Negative:** Slight over-engineering for current 2D-only use.
**Neutral:** Pond height is negative value (-0.5m) — below grade. Documents a useful convention.

## Linked items
- Backlog: YGW-0xx (isometric/3D view — future)
