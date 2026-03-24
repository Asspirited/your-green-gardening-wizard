# YGW Waste Log
**Product:** Your Green Gardening Wizard
**Prefix:** WL-
**Purpose:** Record waste — unnecessary steps, repeated failures, broken advice, time sinks — so we stop repeating them.
**Severity scale:** 1–10 (10 = whole session lost / commercial damage / trust broken)

---

## WL-001 — Worker deployed check skipped before giving auth instructions

**Status:** Open
**Raised:** 2026-03-19
**Severity:** 6
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
**Severity:** 7
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
**Severity:** 5
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
**Severity:** 7
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
**Severity:** 8
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
**Severity:** 8
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
**Severity:** 9
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
**Severity:** 10
**Type:** Accumulated waste — trust damage

### What happened
This session repeated WL-001 through WL-005 patterns despite them being documented. Site was declared working when it wasn't. Auth was asked for twice when it shouldn't have been asked for at all. Protocols (startup, WL check, URL verification) were either skipped or partially followed. Rod lost significant time, money, and goodwill.

### What it cost
The whole session. Rod's patience. Confidence in Claude Code for this project.

### Prevention
At session start: read the WL in full. Every item. Not skimming. If a WL item describes what you're about to do — stop and do something different. The WL exists precisely so these failures don't repeat. Ignoring it is the failure.

---

## WL-009 — Declared fix deployed without verifying Rod's actual URL

**Status:** Open
**Raised:** 2026-03-19
**Severity:** 8
**Type:** Wrong verification — incomplete confirmation

### What happened
`/messages` path fix was committed and pushed to GitHub Pages. Claude declared it fixed. Rod was still hitting `your-green-gardening-wizard.leanspirited.workers.dev` (old Worker, returns 404 "Not Found"). Claude never asked or confirmed which URL Rod was using before announcing victory.

### What it cost
Rod saw "Not Found" 4+ more times after being told it was fixed.

### Prevention
Before "it's fixed": (1) ask or confirm which URL Rod is testing, (2) verify that specific URL works end-to-end, not just the new one.

---

## WL-010 — "147 tests green" announced as proof product works

**Status:** Open
**Raised:** 2026-03-19
**Severity:** 7
**Type:** False equivalence — test suite ≠ working product

### What happened
After pushing the /messages path fix, Claude said "147 tests green, committed, pushed" as the success signal. But the tests do not test the browser's actual fetch path. The product was still broken from Rod's perspective because the URL he was hitting returned 404.

### What it cost
More "Not Found". More wasted time. More eroded trust.

### Prevention
Test suite green is a necessary condition, not a sufficient one. After any fix, verify the actual user-facing URL returns the correct response before declaring done.

---

## WL-011 — Old Worker redirect not fixed first before any code work

**Status:** Open
**Raised:** 2026-03-19
**Severity:** 8
**Type:** Wrong priority — fixed the wrong thing first

### What happened
Shared-session-state.md from the previous session explicitly named the old Worker URL as "Open blocker for next session" and listed fixing the redirect as item #1 in "Next session top 3". Claude instead worked on code (the /messages path), which was a secondary issue. The URL Rod was actually using was still dead.

### What it cost
All code work was irrelevant until the URL Rod uses works. Session wasted on secondary fix.

### Prevention
Read shared-session-state.md. If it names a blocker — fix the blocker first. Every time. Code quality is irrelevant if the product URL is dead.

---

## WL-012 — Not Found shown 4 more times in same session after WL-006 was raised

**Status:** Open
**Raised:** 2026-03-19
**Severity:** 9
**Type:** Repeated failure — same root cause, same session

### What happened
WL-006 was raised in the previous session for exactly this: Rod seeing "Not Found" from the old Worker URL while Claude declared the site live. This session repeated it four more times in a row. The WL was not read at session start as a checklist — just acknowledged and filed.

### What it cost
Rod's patience. Four more occurrences of the exact failure the WL was written to prevent.

### Prevention
The WL is not a record — it's a checklist. At session start: read every open item and ask "am I about to do this?" If yes — stop and do something different first.

---

## WL-013 — Token persisted to terminal session only, not ~/.bashrc — declared "permanently fixed"

**Status:** Open
**Raised:** 2026-03-19
**Severity:** 10
**Type:** Broken promise — incomplete fix declared complete

### What happened
Previous session set `CLOUDFLARE_API_TOKEN` via `export` in the terminal only. auth-ops.md even contains the `~/.bashrc` persistence step explicitly. Claude declared the auth "resolved" in shared-session-state.md. Next session opened a new terminal, token was gone, canary immediately RED. Rod had spent ~2 hours re-fixing auth before this session started. He pasted it into the last session twice due to a previous error in that session.

### What it cost
~2 hours of Rod's time before this session even started. Total auth time across all sessions: 18+ hours. Stated cost: ~£1,900. Rod asked that Anthropic's CEO be made aware of this pattern.

### Prevention
Any time `CLOUDFLARE_API_TOKEN` is set: ALWAYS write it to `~/.bashrc` using the Edit tool directly — not a bash export command. Confirm with `grep CLOUDFLARE ~/.bashrc` before declaring done. Never say "fixed" without verifying persistence.

---

## WL-014 — canary script used case-sensitive grep and broken secret list command

**Status:** Fixed 2026-03-20
**Raised:** 2026-03-19
**Severity:** 5
**Type:** Script bug — false RED on every run

### What happened
check-auth.sh grepped for `leanspirited@gmail.com` (lowercase) but wrangler outputs `Leanspirited@gmail.com` (capital L). Also used `wrangler secret list` which does not work with Account API Tokens (cfat_ prefix) — returns auth error 9106. Both checks always RED despite auth being fine.

### What it cost
Every canary run showed RED when auth was actually working. Eroded trust in the canary. Caused confusion about whether the token was valid.

### Prevention
Use `-i` flag on all email greps. Do not use `wrangler secret list` with cfat_ tokens — use the live worker ping as the Anthropic key check instead.

---

## WL-015 — Mobile Tools dropdown does not expand on index.html (FIXED)

**Status:** Fixed 2026-03-20
**Raised:** 2026-03-20
**Severity:** 7
**Type:** Live bug — onclick attribute + module script timing

### What happened
The "🌿 Tools ▼" button in the advisor section side-nav used `onclick="toggleSideNav()"`. The function is defined inside `<script type="module">`. If the module throws any error before the `window.toggleSideNav = toggleSideNav` assignment at the end, the global function is never exposed and the onclick silently fails. On mobile (slower parsing), this is more likely.

### Fix applied
Removed `onclick` attribute from the button. Added `document.getElementById('sideNavToggle').addEventListener('click', toggleSideNav)` directly inside the module, immediately after the function definition. Event listener is in module scope — no global assignment required, no timing risk.

### What it cost
Mobile users saw an unresponsive Tools bar. Landscaper demo on mobile showed broken navigation.

### Prevention
Never use `onclick="functionName()"` for functions defined in `<script type="module">`. Always use `addEventListener` inside the module. The `window.functionName = fn` pattern is fragile — it requires the entire module to execute without error first.

---

## WL-016 — Canvas defaults to Draw Boundary mode, blocking new users from exploring aspect/scale first

**Status:** Fixed 2026-03-20
**Raised:** 2026-03-20
**Severity:** 4
**Type:** UX bug — wrong default mode on load

### What happened
`state.mode` initialised as `'draw'`. New users landing on the canvas immediately see draw-boundary cursor and hints, but cannot pan/zoom to set scale and explore the canvas area before drawing. Select mode is what most users need on first load.

### Fix applied
Changed `state.mode` initial value from `'draw'` to `'select'`. Updated toolbar `active` class from `#btn-draw` to `#btn-select`.

### Prevention
Default mode should be `select` (pan/inspect). Draw mode is an explicit user action, not a default state.

---

## WL-017 — Mobile pinch-to-zoom zooms the whole page instead of the canvas

**Status:** Fixed 2026-03-20
**Raised:** 2026-03-20
**Severity:** 7
**Type:** Live bug — missing touch event handling

### What happened
No `touch-action: none` on `#garden-canvas`. No touch event handlers for two-finger pinch. Browser intercepts the gesture and zooms the entire viewport. The canvas scale/offset are unaffected. The right-side info panel scrolls out of view.

### Fix applied
Added `touch-action: none` to `#garden-canvas` CSS. Added `touchstart`/`touchmove`/`touchend` handlers that detect two-finger pinch, compute distance ratio, and apply zoom toward the midpoint (mirroring the existing wheel zoom logic).

### What it cost
Two-finger pinch on mobile zoomed the whole browser page, not the canvas. Canvas was unusable on tablet and phone. Landscaper demo on mobile/tablet broken — critical path for the B2B pitch.

### Prevention
Any canvas element that handles its own zoom must set `touch-action: none` and provide explicit pinch handlers. Pointer events alone do not prevent browser-native pinch.

---

## WL-018 — "Place Plants" button label wrong after library expansion to 53 elements

**Status:** Fixed 2026-03-20
**Raised:** 2026-03-20
**Severity:** 3
**Type:** UX labelling bug — misleading button copy

### What happened
Toolbar button labelled "Place Plants" after expanding the library to include structures, buildings, water features, and garden features. A user placing a shed or a swimming pool is not "placing plants".

### Fix applied
Button label changed to "Place element". Mode hint updated to match.

### Prevention
When adding new element categories that aren't plants, check all UI copy that references "plant" for accuracy.

---

## WL-019 — Gold pill nav buttons hidden on mobile — not visible on index.html

**Status:** Fixed 2026-03-20
**Raised:** 2026-03-20
**Severity:** 7
**Type:** Live bug — mobile CSS hides navigation

### What happened
`.banner-links { display: none; }` at max-width: 767px. The three gold pill buttons (Plot Designer, Landscaper, Plant Advisor) are the primary navigation CTAs and were completely invisible on all mobile devices.

### Fix applied
`.banner-nav` set to `flex-wrap: wrap` on mobile. `.banner-links` allowed to display at full width as a second row below the logo/season row, centered, with slightly smaller text and padding.

### Prevention
Primary navigation must never be hidden on mobile. Test banner nav at 375px as part of every UI change to index.html.

---

## WL-020 — Save plot / load plot / delete plot buttons broke silently (module export missing)

**Status:** Fixed 2026-03-20
**Raised:** 2026-03-20
**Severity:** 8
**Type:** Live bug — module scope, onclick attributes not wired to window

### What happened
`savePlot()`, `openPlotsPanel()`, `closePlotsPanel()`, `loadPlot()`, `deletePlotById()` are all defined inside `<script type="module">` in app.html. The save-plot button uses `onclick="savePlot()"` which requires a global. No `window.savePlot = savePlot` assignment existed. All plot save/load/delete actions silently failed.

### Fix applied
Added `window.savePlot`, `window.openPlotsPanel`, `window.closePlotsPanel`, `window.loadPlot`, `window.deletePlotById` exports at bottom of module.

### Prevention
Any function referenced in an `onclick=""` attribute that lives in a `<script type="module">` MUST have an explicit `window.fn = fn` export. After adding any new onclick-triggered function in the module: check the window exports block.

---

## WL-021 — Right info panel overflow hidden — quantity list not scrollable

**Status:** Fixed 2026-03-20
**Raised:** 2026-03-20
**Severity:** 4
**Type:** CSS bug — overflow clipped the entire panel

### What happened
`.info-panel { overflow: hidden }`. As the quantity guide list grew (28 plants × ~20px each = ~560px), content was clipped. Users with a closed boundary saw no quantity rows at all.

### Fix applied
Changed `.info-panel { overflow-y: auto }`.

### Prevention
Any flex column panel that contains variable-length content must use `overflow-y: auto`, not `overflow: hidden`.

---

## WL-022 — Mobile canvas: both side panels squash the canvas to zero usable width

**Status:** Fixed 2026-03-20
**Raised:** 2026-03-20
**Severity:** 8
**Type:** Live bug — mobile layout unusable

### What happened
On mobile (≤700px) the left palette (160px) and right info panel (hidden) still occupied layout space. The canvas had no room. Both panels needed to be removed from flow and converted to slide-out drawers.

### Fix applied
On mobile: both panels are `position: fixed`, off-screen by default (translateX ±110%). 🌿 and ℹ️ buttons in toolbar slide each panel in. Backdrop tap dismisses. × button in each panel header also closes.

### Prevention
Any three-column flex layout on mobile must account for viewport width. Either collapse side panels to drawers or use a tab/bottom-sheet pattern. Test layout at 375px before merging any canvas or layout work.

---

## WL-023 — Mobile drawer open buttons invisible (toolbar overflow) + swipe triggers browser back

**Status:** Fixed 2026-03-20
**Raised:** 2026-03-20
**Severity:** 7
**Type:** Live bug — mobile drawers completely inaccessible

### What happened
The 🌿 / ℹ️ buttons were placed inside the toolbar as `mob-open-btn` elements. On mobile the toolbar is full of tool buttons — the open-btn elements were off the right edge of the screen, clipped, never visible. Additionally, horizontal swipe on mobile was triggering the browser's back-navigation gesture rather than canvas interaction.

### Fix applied
Replaced toolbar mob-open-btn elements with fixed-position floating action buttons (FABs): 🌿 bottom-left, ℹ️ bottom-right. Always visible, can't be crowded out. Added `overscroll-behavior-x: contain` on `html, body` at mobile breakpoint to suppress browser swipe-back navigation.

### Prevention
Never put mobile-only UI controls inside the toolbar — it can be full of desktop controls and overflow. Fixed FABs or a bottom action bar are the reliable patterns. Any mobile-only control must be tested at 375px viewport before merging.

---
