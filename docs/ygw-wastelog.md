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
