# ADR-009: Product rename to "The Green Wizard"

**Date:** 2026-03-20
**Status:** Decided
**Deciders:** Rod (LeanSpirited)
**Tags:** product, ux

## Context

The product has been called "Your Green Gardening Wizard" since inception. As the tool
matures into a professional landscaper product, the long name is unwieldy in nav bars,
logos, and pitch contexts. The product is also expanding beyond gardening advice to
include a full spatial design canvas — "Gardening Wizard" undersells it. The primary
target user (Ollie-type professional landscaper) expects a tool name that sounds
professional, not hobbyist.

## Decision

Rename all visible UI to "The Green Wizard". "The Green" upright, "Wizard" in italic
Playfair Display. Internal code, file paths, repo names (your-green-gardening-wizard),
the YGW- backlog prefix, and Worker URLs remain unchanged. This is a cosmetic rename
only — no URLs, routes, or APIs change.

## Alternatives considered

| Option | Why rejected |
|--------|-------------|
| Keep "Your Green Gardening Wizard" | Too long for nav/logo; "gardening" limits professional appeal |
| "Green Wizard" (no The) | Less distinctive; "The" adds gravity and specificity |
| New brand entirely | Too disruptive at this stage; no external brand equity to protect |

## Consequences

**Positive:** Shorter, punchier name works in nav, logo lockup, and pitch decks. More
professional for landscaper audience. "Wizard" in italic creates a distinctive logo moment.

**Negative / trade-offs:** Any external links using the old name will show mismatch until
updated. Existing screenshots in docs will be stale.

**Neutral:** Worker URLs and repo names stay as-is — no infrastructure change required.

## Linked items

- Backlog: YGW-BL-015, YGW-UX-004
- Related: ADR-006 (archetype vocabulary), ADR-001 (seasonal theming scope)
