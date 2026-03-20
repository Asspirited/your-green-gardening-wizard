# ADR-001: Seasonal animations on marketing pages only, not canvas

**Date:** 2026-03-20
**Status:** Decided
**Deciders:** Rod (LeanSpirited)
**Tags:** ux, product

## Context
YGW has a seasonal identity as a core product differentiator. The question
was whether seasonal animations (falling leaves, snow, petals, shimmer)
should appear everywhere in the product or be scoped to specific surfaces.
The canvas is a professional working tool used by designers under time pressure.

## Decision
Seasonal particle animations and full background themes are restricted to
landing pages and marketing screens. The canvas tool uses seasonal colouring
only — grid palette, plant colours, and surface tones shift per season, but
no animations or background effects that could distract from design work.

## Alternatives considered
| Option | Why rejected |
|--------|-------------|
| Animations everywhere | Distracts from canvas work; Ollie is doing precision placement |
| No seasonal theming on canvas at all | Loses the core seasonal value prop in the tool itself |
| User toggle per screen | Adds complexity, defers the decision rather than making it |

## Consequences
**Positive:** Canvas stays clean and professional; landing page can be bold and expressive.
**Negative:** Slight inconsistency in seasonal experience across the product.
**Neutral:** Two separate CSS/JS bundles — seasonal-full (landing) and seasonal-grid (app).

## Linked items
- Related: ADR-002 (auto-season detection)
