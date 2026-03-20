# ADR-005: Primary persona is landscaper; hypothesis HDD-001 governs feature priority

**Date:** 2026-03-20
**Status:** Decided — supersedes original ADR-005 (written in error, inverted)
**Deciders:** Rod (LeanSpirited)
**Tags:** product, process

## Context
Early framing described Ollie as "a landscaper." A clarification during session
established more precisely: Ollie is a garden designer with deep landscaping
knowledge and strong existing relationships with working landscapers. He believes
landscapers are the right first commercial target segment. This shapes what
YGW must do well, in what order, and how the AI speaks to its user.

## Decision
The primary target persona is the professional landscaper — someone who designs
and installs gardens, creates client proposals, and sells a finished garden vision.
Ollie is the founder proxy for this persona. He is not the end consumer.

HDD-001 is the governing hypothesis until closed:
*"Landscapers will pay for AI-generated client proposals if output quality
passes the Ollie test."*

All feature prioritisation defers to this hypothesis until it is confirmed,
refuted, or explicitly pivoted. Consumer-facing features (end customer UX,
consumer landing page copy, lifestyle suggestions) are valid but secondary
until HDD-001 closes.

## Alternatives considered
| Option | Why rejected |
|--------|-------------|
| Designer as primary (original ADR-005) | Inverted — Ollie is a designer who serves landscapers, not a designer replacing them |
| End consumer as primary | Larger market but unvalidated; landscaper B2B is higher value and more testable |
| Both equally | Dilutes focus before first hypothesis is validated |

## Consequences
**Positive:** Clear prioritisation filter for every backlog and session decision.
  Features that don't serve a landscaper's proposal workflow are deprioritised.
**Negative:** Consumer features may feel underdeveloped early.
**Neutral:** Session protocol must enforce persona discipline — see ADR-008.

## Linked items
- Related: ADR-006 (three-layer suggestion system)
- Related: ADR-008 (session protocol HDD persona guard)
