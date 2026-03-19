# YGW Waste Log
**Product:** Your Green Gardening Wizard
**Prefix:** WL-
**Purpose:** Record waste — unnecessary steps, repeated failures, broken advice, time sinks — so we stop repeating them.

---

## WL-001 — Worker deployed check skipped before giving auth instructions

**Status:** Open
**Raised:** 2026-03-19
**Type:** Process waste — unnecessary work given

### What happened
Claude gave Rod instructions to create/use Cloudflare API tokens without first checking whether the `ygw-api-proxy` worker was even deployed. Worker was returning 404 — not deployed at all. Auth instructions were irrelevant until deployment is confirmed.

### What it cost
Multiple session interruptions. Rod time wasted on Cloudflare dashboard for no outcome.

### Prevention
Check `https://ygw-api-proxy.leanspirited.workers.dev` first. If 404 → not deployed → fix deployment first before any auth discussion.

---

## WL-002 — New Cloudflare API token created when existing one could have been reused

**Status:** Open
**Raised:** 2026-03-19
**Type:** Unnecessary step — existing credential ignored

### What happened
Claude instructed Rod to create a new Cloudflare API token. The Cusslab worker (`cusslab-api.leanspirited.workers.dev`) is already deployed and working, meaning a valid Cloudflare API token already exists and was used previously. Claude did not check for this before sending Rod to create a new one.

### What it cost
Time in Cloudflare dashboard (dash.cloudflare.com). Confusion. Broken session.

### Prevention
Before any Cloudflare auth step: ask "Do you have the token you used for Cusslab?" If yes — use it. Never send Rod to create a new one unless the existing one is confirmed missing or expired.

---

## WL-003 — `ANTHROPIC_API_KEY` secret status checked via wrangler without token set

**Status:** Open
**Raised:** 2026-03-19
**Type:** Tool failure — wrong order of operations

### What happened
Claude ran `wrangler secret list` without `CLOUDFLARE_API_TOKEN` set in environment. This always fails in non-interactive mode. Wasted a command, surfaced an error that confused the situation.

### What it cost
A confusing error message. Risk of sending Rod down another wrong path.

### Prevention
Before running ANY wrangler command: confirm `CLOUDFLARE_API_TOKEN` is set in the terminal. If not set — ask Rod for it first. One check, saves every downstream failure.

---

## WL-004 — Session interrupted mid-deployment, no state saved

**Status:** Open
**Raised:** 2026-03-19
**Type:** Process waste — lost progress

### What happened
Session was interrupted before the YGW worker was deployed. No shared-session-state.md was written. Next session had no record of where we were or what had already been tried.

### What it cost
Full re-diagnosis time. Rod had to re-explain the problem from scratch.

### Prevention
session-closedown.md must always be run before ending. Even interrupted sessions should write whatever partial state they have. A partial state file is better than none.

---

## WL-005 — ANTHROPIC_API_KEY not checked before blaming auth

**Status:** Open
**Raised:** 2026-03-19
**Type:** Wrong diagnosis — jumped to complex solution

### What happened
Worker code (`worker/index.js`) already handles missing `ANTHROPIC_API_KEY` gracefully — returns 500 with clear message. But the worker wasn't even deployed. Claude focussed on auth key setup without first confirming the worker was live.

### What it cost
Time spent on key management when the real issue was simply "worker not deployed."

### Prevention
Deployment first, secrets second. Always in that order.

---

## WL-006 — Declared site "working" without confirming which URL Rod was using

**Status:** Open
**Raised:** 2026-03-19
**Type:** Wrong diagnosis — incomplete verification

### What happened
GitHub Pages was enabled and `https://asspirited.github.io/your-green-gardening-wizard/` returned 200. Claude declared the site working. But Rod was still hitting `https://your-green-gardening-wizard.leanspirited.workers.dev` (old worker, still deployed, returning 404). Claude never asked which URL Rod was using, never checked the old worker was a broken trap.

### What it cost
Rod kept seeing "Not Found" after being told it was fixed. Multiple frustrating exchanges.

### Prevention
When confirming a site is live: (1) check new URL works, (2) check old URL is dead or redirects, (3) confirm with Rod which URL they are using before declaring victory.

---

## WL-007 — Asked Rod for Cloudflare API token despite WL-001/WL-002 existing

**Status:** Open
**Raised:** 2026-03-19
**Type:** Repeated waste — protocol ignored

### What happened
Claude asked Rod to provide a Cloudflare API token to deploy a redirect worker. WL-001 and WL-002 already document this exact failure. The feedback memory says never ask Rod to create a new token without checking first. Claude did not check the environment, did not check `.wrangler/`, did not read the WL — just asked.

### What it cost
Rod's patience, time, and money. Session ended in anger.

### Prevention
Before ANY mention of Cloudflare tokens: read the WL. Check `~/.wrangler/config/default.toml` and `env | grep CLOUDFLARE` first. If nothing, use the Cusslab framing from WL-002.

---

## WL-008 — Session burned Rod's time, goodwill, and patience through repeated known failures

**Status:** Open
**Raised:** 2026-03-19
**Type:** Accumulated waste — trust damage

### What happened
This session repeated WL-001 through WL-005 patterns despite them being documented. Site was declared working when it wasn't. Auth was asked for twice when it shouldn't have been asked for at all. Protocols (startup, WL check, URL verification) were either skipped or partially followed. Rod lost significant time, money, and goodwill.

### What it cost
The whole session. Rod's patience. Confidence in Claude Code for this project.

### Prevention
At session start: read the WL in full. Every item. Not skimming. If a WL item describes what you're about to do — stop and do something different. The WL exists precisely so these failures don't repeat. Ignoring it is the failure.

---
