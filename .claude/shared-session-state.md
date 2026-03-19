# YGW Shared Session State
# Written by Claude Code at session close. Read by Claude.ai at next session start.
# Date: 2026-03-19

---

## What was done this session

- **Auth crisis resolved** — both URLs now work:
  - `https://asspirited.github.io/your-green-gardening-wizard/` ✅ (GitHub Pages, primary)
  - `https://your-green-gardening-wizard.leanspirited.workers.dev` ✅ (now redirects 301 → GitHub Pages)
- **Root cause 1 fixed**: `index.html` was calling `WORKER_URL` bare (root `/`) instead of `WORKER_URL + '/messages'` — worker returned 404 for all requests
- **Root cause 2 fixed**: Deployed 3-line redirect worker to old dead URL
- **Auth infrastructure built**:
  - `scripts/check-auth.sh` — canary script, run at pipeline start, exits RED if token/key missing
  - `.claude/practices/auth-ops.md` — permanent WSL auth rules, source of truth
- **WL-009 to WL-012** raised for this session's repeated failures
- **Token used**: `cfat_NggRndoJHw7kaGrs5CBAqKBTIRqxbV5PcHfVz7uD3e509f81` (Account API Token, verified working with wrangler)
- 147 tests green, pushed to main

---

## Decisions made

DECISION 2026-03-19: `cfat_` prefix tokens (Account API Tokens) do NOT validate via the `/user/tokens/verify` REST endpoint but DO work with wrangler. Always test with `wrangler whoami`, not curl verify.

DECISION 2026-03-19: Auth canary (`scripts/check-auth.sh`) must run as first step of every session before any code work. RED = stop everything.

---

## Current HDD hypothesis

Unchanged: *"A conversational garden advisor that remembers your garden profile will provide enough value to retain users and validate the knowledge engine before building spatial tools."*

---

## Live URLs

- **Site (primary):** https://asspirited.github.io/your-green-gardening-wizard/
- **Site (old URL — now redirects):** https://your-green-gardening-wizard.leanspirited.workers.dev → 301
- **API Worker:** https://ygw-api-proxy.leanspirited.workers.dev (alive, ANTHROPIC_API_KEY set)
- **Landscaper:** https://asspirited.github.io/your-green-gardening-wizard/landscaper.html

---

## Next session top 3

1. **Run auth canary first** (`bash scripts/check-auth.sh`) — confirm GREEN before any work
2. **Create soil-types.md** — `knowledge/tier1/soil-types.md` still missing, silent degradation
3. **YGW-025** — Year-round interest planner (next open backlog item by priority)

---

## What Claude.ai should know

- This session was entirely consumed by auth issues — no product work done
- The auth problems have cost ~18 hours and ~£1,900 across sessions — Rod is at the limit of his patience
- Both URLs now work. Product is functional. Next session should be clean build time.
- Token `cfat_` format = Account API Token. Use `wrangler whoami` to verify, not curl.
- WL-009 to WL-012 document this session's failure patterns in full
