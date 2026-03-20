# YGW Shared Session State
# Written by: Claude Code session 2026-03-20 (closedown)
# Read by: Claude.ai at next session start

## KEY DECISIONS THIS SESSION (read first)

### ADR-010: Engine of Growth — Sticky primary (2026-03-20)
Primary engine: Sticky via B2B2C referral loop.
Landscaper uses The Green Wizard → better client proposal → client finds TGW or refers on.
Viral is secondary and works *through* Sticky (YGW-074 footer = passive viral).
Pure Viral features (YGW-072, YGW-073) held until Ollie test (YGW-066-AC-007) passes.

### ADR-009: Product name — "The Green Wizard"
All UI: "The Green Wizard". Repo and backlog prefix (YGW-) unchanged.

### Feature branch live for A/B review
Branch: feature/tgw-landscaper-tools
Status: Deployed, green, shared with Oz and Jerry tonight.
URLs:
  https://feature-tgw-landscaper-tools.your-green-gardening-wizard.leanspirited.workers.dev/features/plant-palette/
  https://feature-tgw-landscaper-tools.your-green-gardening-wizard.leanspirited.workers.dev/features/quick-quote/
DO NOT merge to main until Rod explicitly says so. Oz/Jerry review is in progress.

## Pipeline state
161 tests passing, 0 failures. Feature branch green. Committed: 8419bf5 (main), 634b04f (feature branch).

## What was completed this session

### Protocols + infrastructure
- Session protocols: HDD/DDD/BDD learning criteria appended to all three projects (9 files)
- Cross-Claude sync bug fixed: closedown Step 7 now writes Downloads sync file; startup Step 3 verifies it
- Design-UX knowledge base added: .claude/design-ux-knowledge-base.md (d.school, Double Diamond, IDEO, JTBD, Nielsen, Krug, Norman)
- Three new session triggers added to session-insession.md: DESIGN_REVIEW, INTERVIEW_PREP, FEATURE_IDEATION
- Cloudflare Pages → Workers Static Assets: redirect-worker converted to static file server for branch previews

### Backlog
- Backlog v5: EPIC L (YGW-066–070), EPIC M (YGW-071–074)
- Priority queue reordered: YGW-066 → YGW-071 → YGW-074 → YGW-064 → YGW-022
- YGW-066 full ACs written (AC-007 = Ollie test, blocks merge)
- YGW-071 Quick Quote Helper full ACs written (AC-008 = Ollie test, blocks merge)
- YGW-074 Powered by footer identified as highest leverage/lowest effort
- WL-014 marked Fixed
- ADR-010 written: Engine of Growth confirmed

### Architecture review
- Full DDD/SOLID/Clean Code/Lean review produced and in Downloads
- Key findings: domain.js will need splitting at 1,000 lines; no observability before first real user; /health endpoint needed; localStorage plots need KV migration before billing

## What's open (priority order)

| # | Item | Blocker |
|---|---|---|
| 1 | Collect Oz/Jerry A/B feedback on feature branch | Rod action — share URLs tonight |
| 2 | YGW-074 Powered by footer in landscaper PDF | None — one line, ready to build |
| 3 | YGW-071 open questions (quote→palette link, save quotes, design fee) | Oz interview |
| 4 | YGW-064 Stripe billing | Rod: Stripe account |
| 5 | YGW-022 Seasonal re-engagement email | Rod: RESEND_API_KEY |

## HDD-001 status
OPEN. Not yet validated with Ollie.
Two landscaper tools now live at preview URLs for Oz/Jerry review.
Next action: Rod shares URLs with Oz/Jerry → collect feedback → schedule Ollie test.

## Backlog version
v5 (2026-03-20) — EPIC L + EPIC M added. Priority queue reordered for Sticky engine.

## Protocol notes
Cross-Claude sync was broken (closedown didn't write Downloads file). Fixed this session.
Startup protocol now has 7 steps (added Steps 3 and 7 for sync).
Closedown now has 8 steps (Step 7 = write Downloads sync file).
All three project protocol files updated with HDD/DDD/BDD learning criteria and design-UX triggers.
