# YGW Shared Session State
# Written by Claude Code at session close. Read by Claude.ai at next session start.
# Date: 2026-03-19

---

## What was done this session

- **YGW-013** — Tests for buildAugmentedSystemPrompt(): already done, marked ✅ Done
- **YGW-014** — Pre-commit hook: already done, marked ✅ Done
- **YGW-015** — hardiness-zones.md: already done, marked ✅ Done
- **YGW-017** — 5 Tier 2 style files: already done, marked ✅ Done
- **YGW-018** — Shareable visual plan card: ✅ Done
  - `extractSharePlants(markdown)` — pure function, top 5 bold names, truncate >30 chars
  - `generateShareCard(profile, result, refinements, { createCanvas })` — 1080×1080 PNG, injectable canvas for testability
  - `🖼️ Share as image` button added to result-actions in index.html
  - `shareAsImage()` — native share sheet (mobile) / download fallback (desktop)
  - 147 tests, all green
- **GitHub Pages** enabled and site confirmed live at new URL
- **DEPLOY.md** rewritten to reflect GitHub Pages hosting
- **WL-006, WL-007** raised for session failures

---

## Decisions made

DECISION 2026-03-19: Site is now hosted on GitHub Pages (not Cloudflare Pages/Workers). Auto-deploys on every `git push` to main. No manual deploy steps needed for the front end.

---

## Current HDD hypothesis

Unchanged: *"A conversational garden advisor that remembers your garden profile will provide enough value to retain users and validate the knowledge engine before building spatial tools."*

---

## Live URLs

- **Site:** https://asspirited.github.io/your-green-gardening-wizard/
- **Worker:** https://ygw-api-proxy.leanspirited.workers.dev (alive — 405 on GET = correct)
- **Landscaper:** https://asspirited.github.io/your-green-gardening-wizard/landscaper.html
- **OLD URL (broken — 404):** https://your-green-gardening-wizard.leanspirited.workers.dev ← do not use

---

## Open blocker for next session

**`your-green-gardening-wizard.leanspirited.workers.dev` still returns 404.** An old Cloudflare Worker with this name is deployed and acting as a dead-end trap. Rod likely has this URL saved. Fix options:
1. In **Cloudflare (dash.cloudflare.com)** → Workers & Pages → `your-green-gardening-wizard` → Edit code → paste redirect → Deploy (no token needed)
2. OR `CLOUDFLARE_API_TOKEN=<token> wrangler deploy --name your-green-gardening-wizard` with a 1-line redirect worker

Redirect code (3 lines):
```js
export default {
  fetch() { return Response.redirect('https://asspirited.github.io/your-green-gardening-wizard/', 301); }
}
```

---

## Missing knowledge file

`knowledge/tier1/soil-types.md` does not exist — 404 on GitHub Pages. `buildAugmentedSystemPrompt` degrades gracefully so the app still works, but soil knowledge injection is silently disabled. Should be created. Not blocking.

---

## Next session top 3

1. **Fix old worker redirect** (WL-006/WL-007 blocker — before showing site to Oz/Jerry)
2. **Create soil-types.md** (knowledge gap — silent degradation)
3. **YGW-025** — Year-round interest planner (next highest open item)

---

## What Claude.ai should know

- Site is on GitHub Pages — auto-deploy on push, no Cloudflare needed for front end
- The old `your-green-gardening-wizard.leanspirited.workers.dev` URL is broken and needs a redirect
- 147 tests green, pipeline enforced via pre-commit hook
- YGW-018 (share card) is done — `generateShareCard` and `extractSharePlants` are in domain.js
- Session ended badly due to repeated auth friction — WL-006 and WL-007 capture the failures
