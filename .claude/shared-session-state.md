# YGW Shared Session State
# Written by: Claude Code session 2026-03-20 (strategy + protocol session, continuation)
# Read by: Claude.ai at next session start

## KEY DECISIONS THIS SESSION (read first)

### ADR-010: Engine of Growth — Sticky primary (2026-03-20)
**Primary engine: Sticky via B2B2C referral loop.**
Landscaper uses The Green Wizard → better client proposal → client finds TGW or refers landscaper on.
Viral is secondary and works *through* Sticky (YGW-074 footer = passive viral).
Pure Viral features (YGW-072, YGW-073) held until Ollie test (YGW-066-AC-007) passes.

### Product name: "The Green Wizard" (ADR-009)
All UI surfaces use "The Green Wizard". Repo and backlog prefix (YGW-) unchanged.
plant-palette.html still has "Your Green Wizard" in header/footer — fix before any user sees it.

### Discussion priority queue (next session):
1. YGW-071 — Quick Quote Helper (spec ready, Gherkin next)
2. YGW-074 — Powered by footer in landscaper PDF
3. YGW-072 — Before/after photo framing (after Ollie test)
4. YGW-073 — Seasonal reveal card (after Ollie test)

## Last session summary
Date: 2026-03-20 (full day — three sessions, final close after second compaction)
Outcome: 10+ items shipped including email save, custom plants, mobile drawers, growth horizon.

## What was completed this final session block

### Core features
- **YGW-021**: Email capture + profile save via Cloudflare KV. `?profile=uuid` restores result.
- **BL-026**: Custom plant search + "Add as custom element" form. localStorage persistence. "⭐ My plants" category.
- **BL-029**: Right panel quantity guide accordion synced with left palette. `syncCategory()` drives both.
- **BL-031**: Landscaper email capture on landscaper.html. `?plan=uuid` route.
- **YGW-060**: Growth horizon selector — ⚡/🌿/🌳 pills on wizard step 4. `buildGrowthHorizonContext()` in domain.js. 13 new tests. 161 total passing.

### Bugs fixed
- **WL-020**: Module export missing → save/load/delete plot buttons were silently broken. Fixed with `window.*` exports.
- **WL-021**: Info panel `overflow: hidden` → quantity list not scrollable. Fixed to `overflow-y: auto`.
- **WL-022**: Mobile canvas — both panels squashing canvas. Converted to `position: fixed` slide-out drawers.
- **WL-023**: Mobile drawer open buttons were in toolbar (off-screen on mobile). Replaced with fixed FABs at bottom corners. Added `overscroll-behavior-x: contain` to stop swipe-back navigation.

### UX
- Growth timeline moved to TOP of right info panel (above quantities).

## Pipeline state
161 tests passing, 0 failures. All pushed to main (commit e77823c).

## What's open (priority order)

| # | Item | Effective score | Blocker |
|---|---|---|---|
| 1 | Deploy to production (Pages + Worker) | — | Rod action |
| 2 | YGW-022 Seasonal re-engagement email | 12.5 | Rod: set RESEND_API_KEY secret |
| 3 | YGW-064 Stripe billing trial gate | 10.0 | Rod: Stripe account |
| 4 | YGW-BL-020 Homepage section reorder | 7.5 | None |
| 5 | YGW-061 Fix my garden mode | 11.0 | None |

## HDD-001 status
OPEN. Not yet validated with Ollie.
Landscaper.html now has: email capture, plan save/restore via KV, growth horizon in prompt, mobile-accessible drawers.
Next action: Rod deploys to Pages, shares landscaper.html URL with Ollie for real-world test.

## Backlog version
v3 (2026-03-20) — Kano column added, EPIC K added (YGW-060–065), YGW-060 now ✅ Done.
All WL items up to WL-023 logged.

## Known blockers
- Auth tokens valid as of this session (pipeline layer 0 green). Run check-auth.sh at next session start.
- YGW-022: blocked on RESEND_API_KEY — Rod must obtain from Resend dashboard
- YGW-064: blocked on Stripe account setup

## Protocol notes
Startup protocol was skipped at beginning of this final block (context compaction resumed directly into work).
No BL/WL routing misses this block. Checkpointing observed (checkpoint triggered at 8 items, user confirmed continue).
