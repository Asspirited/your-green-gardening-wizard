# YGW Shared Session State
# Written by Claude Code at session close. Read by Claude.ai at next session start.
# Date: 2026-03-19

---

## What was done this session

Brought in Claude.ai's v2 backlog (CD3+SWOT scored, 38 items) and shipped four items:

- **YGW-016** (seasonal-calendar.md) — file already existed and was complete. Marked Done.
- **YGW-020** (Seasonal context in AI prompt) — Done. New exports in domain.js:
  - `getCurrentUKSeason(date)` — pure function, all 12 months, returns season/label/cta/loading
  - `buildSeasonalContext(location, date)` — injects month+season directive into every AI prompt
  - Injected into both `buildSystemPrompt()` and `buildAugmentedSystemPrompt()` as first clause after BASE_PROMPT
  - 23 new tests added. Suite: 109 → 132 tests, all green.
- **YGW-019** (Seasonal UI awareness) — Done. `applySeasonalUI()` in index.html applies on page load:
  - Updates hero headline (with `<em>` seasonal phrase), subheadline, CTA button text
  - Updates result card tag ("Your Autumn Garden Plan" etc.)
  - Updates first loading message
  - Four seasonal copy sets: spring/summer/autumn/winter
- **YGW-027** (Landscaper client plan PDF export) — Done.
  - `WORKER_URL` set to `https://ygw-api-proxy.leanspirited.workers.dev` in landscaper.html
  - Professional print CSS: `@page` margins, page-break controls, font sizes for document print
  - Print footer: "Prepared by Your Green Gardening Wizard · [date] · leanspirited.com"
- **Worker model update** — `worker/index.js` updated from `claude-sonnet-4-20250514` to `claude-sonnet-4-6`. Awaiting deploy (Rod handles auth/deploy independently).

Backlog replaced with v2 (CD3+SWOT scored). Imported from Claude.ai zip in Downloads.

---

## Decisions made

DECISION 2026-03-19: Email capture (YGW-021) and seasonal email cron (YGW-022) parked — going with concierge/VIP model targeting specific clients first. Email infrastructure not needed until that channel is validated.

---

## Current HDD hypothesis

Unchanged: *"A conversational garden advisor that remembers your garden profile will provide enough value to retain users and validate the knowledge engine before building spatial tools."*

The seasonal work (YGW-019, YGW-020) directly supports this — the app now feels alive in any month, not just spring. Landscaper PDF (YGW-027) opens the B2B concierge channel.

---

## Live URLs

- Site: https://your-green-gardening-wizard.leanspirited.workers.dev
- Worker: https://ygw-api-proxy.leanspirited.workers.dev
- Landscaper: https://your-green-gardening-wizard.leanspirited.workers.dev/landscaper.html

---

## Open / next session

Still Building (not yet closed):
- YGW-013 — Tests for `buildAugmentedSystemPrompt()`
- YGW-014 — Pre-commit hook + pipeline enforcement
- YGW-015 — hardiness-zones.md (Tier 1 knowledge)
- YGW-017 — 5 remaining Tier 2 style files

Top 3 for next session (priority queue order):
1. **YGW-018** — Shareable visual plan card (canvas, 1080×1080px PNG) — highest acquisition leverage
2. **YGW-013** — Tests for `buildAugmentedSystemPrompt()` — closes the test coverage gap
3. **YGW-015 / YGW-017** — remaining knowledge files

Blockers: none. Worker model update (claude-sonnet-4-6) is staged in worker/index.js.

---

## What Claude.ai should know

- Backlog is now v2 — 38 items, CD3+SWOT scored, at `docs/ygw-backlog.md`
- Email items (YGW-021, YGW-022) are ⏸ Parked — concierge model first
- `getCurrentUKSeason()` and `buildSeasonalContext()` are live in domain.js — seasonal context is now injected into every AI prompt automatically
- landscaper.html is ready to demo to concierge clients — professional PDF print, real worker URL
- Worker model update is staged but not yet deployed
