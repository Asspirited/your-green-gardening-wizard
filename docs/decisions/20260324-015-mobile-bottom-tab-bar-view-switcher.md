# ADR-015: Mobile view switcher — fixed bottom tab bar

**Date:** 2026-03-24
**Status:** Decided
**Deciders:** Rod (LeanSpirited)
**Tags:** ux | architecture

## Context

app.html has three view modes: Plan (boundary drawing), Proposal (output view), and Zones (sub-plot designer). The view-switch buttons (`btn-plan`, `btn-proposal`, `btn-zones`) sit in the main toolbar after `#boundary-tools`, which alone is ~800px wide on mobile. On a 375px viewport with no horizontal scroll, all three view buttons are off-screen and unreachable. The app opens in Proposal view; users are stuck there on mobile — the Zones view (YGW-076) is entirely inaccessible.

This repeats the pattern of WL-023 (toolbar overflow hiding mob-open-btn, fixed 2026-03-20 with FABs). WL-023 prevention rule: never put mobile-critical controls in the toolbar.

## Decision

Add a fixed bottom tab bar (`mob-view-tabs`) visible only on mobile (≤700px). Three tabs: Plan / Proposal / Zones. Tabs use the same `setView()` function as the toolbar buttons. FABs (🌿 / ℹ️) lift from `bottom: 20px` to `bottom: 76px` to clear the tab bar. Toolbar view buttons remain on desktop; tab bar replaces them on mobile.

## Alternatives considered

| Option | Why rejected |
|--------|-------------|
| Make toolbar horizontally scrollable | No affordance that it scrolls; hidden controls are a heuristic violation; doesn't solve FAB crowding |
| Add a hamburger/overflow menu for views | Extra tap for a primary navigation action; violates Nielsen #7 (flexibility) |
| FABs for each view | 5+ FABs on one screen is too many; tab bar is the conventional pattern for ≤4 peer views |

## Consequences

**Positive:** Plan/Proposal/Zones all reachable on mobile. Zones view (YGW-076) becomes genuinely usable on mobile. Follows WL-023 prevention rule. Zero additional taps vs desktop.

**Negative / trade-offs:** Tab bar overlays the bottom ~56px of canvas on mobile. Acceptable for a drawing tool — main working area unaffected. Canvas resize event not triggered on tab bar insertion (static layout — canvas fills its container via existing sizing logic).

**Neutral:** Toolbar view buttons remain visible on desktop. setView() is the single source of truth for active-view state on both.

## Linked items

- Backlog: YGW-080
- Prevents: WL-023 recurrence pattern
