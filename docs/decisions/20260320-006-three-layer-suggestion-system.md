# ADR-006: Three-layer suggestion system — Archetype, Rules, AI Narrative

**Date:** 2026-03-20
**Status:** Decided
**Deciders:** Rod (LeanSpirited)
**Tags:** product, architecture

## Context
YGW needs to suggest things to designers and customers. Initial ideas explored
suggestion types independently. The question was how to structure them into
a coherent system that serves both users and can be built incrementally.

## Decision
Three layers, firing at different moments in the workflow:

Layer 1 — Archetype Palette: fires on style selection. User picks from 8
archetypes (Contemporary, Cottage, Woodland, Mediterranean, Family, Formal,
Productive, Wildlife). Returns ranked suggestions in professional design
sequence (surfaces → structures → trees → shrubs → perennials). Includes
an 'avoid' list per archetype as well as suggestions.

Layer 2 — Canvas Rules Engine: fires on placement, continuously. Seven
rule types: spread conflict, height layering, seasonal coverage, bare ground,
safety clearances, archetype clash, completion patterns. No AI — pure logic
against plants.json data model.

Layer 3 — AI Narrative: on demand only (Ollie controls when). Three modes:
Improve (design critique), Combination (plant trio suggestion), Proposal
(client-facing seasonal narrative). Receives full canvas state + Layer 2
warnings. Never re-flags what Layer 2 already caught.

Feedback loop: Layer 3 acceptances feed Layer 1 rankings over time.
Accumulated design taste is the product moat.

## Alternatives considered
| Option | Why rejected |
|--------|-------------|
| AI suggestions only | Slow, costly per placement, unreliable for simple rules |
| Rules engine only | Can't generate proposal narrative or combination suggestions |
| Single flat suggestion list | No sequencing; doesn't match Ollie's workflow |
| Image generation (competitor approach) | Not what Ollie does; photo-to-render is not a design tool |

## Consequences
**Positive:** Incremental build — Layer 1 ships first, highest value earliest.
  Rules engine (Layer 2) requires no AI cost. Layer 3 is the premium feature.
**Negative:** Three systems to maintain; feedback loop requires usage data to be useful.
**Neutral:** Rollout sequence: plants first, then all features, then combinations, then lifestyle.

## Linked items
- Backlog: YGW-0xx (Layer 1 — archetype palette)
- Backlog: YGW-0xx (Layer 2 — canvas rules engine)
- Backlog: YGW-0xx (Layer 3 — AI narrative, three modes)
- Backlog: YGW-0xx (suggestion feedback loop)
- Related: ADR-005 (designer persona)
