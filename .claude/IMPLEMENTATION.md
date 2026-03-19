# YGW Implementation Brief
# Read this at the start of every Claude Code session.
# It is the single source of truth for what exists, what is in progress, and what to build next.

---

## 1. Project Identity

**Product:** Your Green Gardening Wizard (YGW)
**Owner:** LeanSpirited (Tom Roden / Rod)
**Co-founders:** Oz, Jerry Maynard
**Repo:** github.com/Asspirited/your-green-gardening-wizard
**Backlog prefix:** YGW-
**Live site:** https://your-green-gardening-wizard.leanspirited.workers.dev (or Cloudflare Pages once connected)
**Worker:** https://ygw-api-proxy.leanspirited.workers.dev

---

## 2. Hard Constraints

- Single `index.html` entry point — no bundler, no framework
- Vanilla JS only — ES modules via `<script type="module">` for domain.js import
- All prompt logic lives in `domain.js` — never duplicated in HTML or Worker
- Anthropic API key never client-side — always via Worker proxy
- 100% statement and branch coverage target on domain functions
- `npm test` must be green before any commit
- `npm run check` (syntax check) must pass before any commit
- UK-first: all plant names, hardiness zones, and climate references use UK standards (RHS H1–H7, not USDA)

---

## 3. Repo Structure

```
your-green-gardening-wizard/
├── index.html              Phase 1.5 consumer advisor
│                           ES module imports from domain.js
├── domain.js               Pure domain layer — all prompt construction
├── landscaper.html         Phase 3 B2B entry point (print-to-PDF)
├── package.json            npm test / npm run check / npm run dev
├── wrangler.toml           Cloudflare config (KV bindings commented out — Phase 2)
├── worker/
│   └── index.js            Multi-route Worker: /messages /save-profile /load-profile /analytics
├── tests/
│   └── domain.test.js      95 tests, 13 suites — run: npm test
├── knowledge/
│   ├── KNOWLEDGE-PROTOCOL.md   3-tier architecture
│   ├── tier1/                  Core horticultural facts (soil, hazards, aspect, etc.)
│   │   ├── soil-types.md       (existing)
│   │   ├── uk-climate.md       (existing)
│   │   ├── hazardous-plants.md
│   │   ├── companion-planting.md
│   │   ├── aspect-effects.md
│   │   ├── invasive-species.md
│   │   ├── hardiness-zones.md  ← YGW-015 (not yet written)
│   │   └── seasonal-calendar.md ← YGW-016 (not yet written)
│   └── tier2/                  Style and design intelligence
│       ├── style-natural-wild.md
│       ├── planting-matrices.md
│       ├── style-cottage.md        ← YGW-017 (not yet written)
│       ├── style-mediterranean.md  ← YGW-017
│       ├── style-modern-minimal.md ← YGW-017
│       ├── style-meticulous.md     ← YGW-017
│       └── style-japanese-zen.md   ← YGW-017
├── docs/
│   ├── ygw-backlog.md
│   └── ygw-wastelog.md
└── .claude/
    ├── IMPLEMENTATION.md       ← this file
    ├── claude.md
    ├── session-startup.md
    ├── session-insession.md
    ├── session-closedown.md
    └── shared-session-state.md
```

---

## 4. Domain Model

### GardenProfile
```
{
  location: string          // UK town/city/region, trimmed, min 2 chars
  soil:     string          // clay | sandy | loam | chalky | peaty | unknown
  aspect:   string          // south | north | east | west | mixed
  goals:    string[]        // subset of: colour, wildlife, veg, low-maintenance,
                            //            privacy, entertaining, scent, year-round
}
```

### Refinements (Phase 1.5 — optional, passed to buildSystemPrompt)
```
{
  style:      string | null   // natural-wild | meticulous | cottage |
                               //   mediterranean | modern-minimal | japanese-zen
  colours:    string[]        // white-silver | pastel | hot-bold | cool-blues | natural-green
  plantTypes: string[]        // perennials | shrubs | climbers | bulbs | annuals |
                               //   evergreen | fast-growing | trees
  safety:     string[]        // dogs | cats | children | hayfever | skin-irritants | bees-important
  extras:     string[]        // companion-planting | avoid-combinations |
                               //   invasive-warning | seasonal-succession
}
```

### domain.js Exports (all pure, no DOM, no API)
| Export | Purpose |
|--------|---------|
| `buildGardenProfile(wizardState)` | Validates and constructs GardenProfile |
| `buildUserMessage(profile)` | Constructs the user-turn message for Anthropic |
| `buildSystemPrompt(profile, refinements)` | Assembles full system prompt from clauses |
| `buildAugmentedSystemPrompt(profile, refinements, loadKnowledge)` | Async — injects knowledge files |
| `buildSafetyClause(safety[])` | Safety exclusion fragment |
| `buildStyleClause(style)` | Style archetype fragment |
| `buildColourClause(colours[])` | Colour palette fragment |
| `buildPlantTypeClause(plantTypes[])` | Plant type preference fragment |
| `buildExtrasClause(extras[])` | Companion planting / extras fragment |
| `buildLandscaperSystemPrompt(clientBrief)` | Phase 3: professional tone prompt |
| `buildSeasonalPrompt(profile, season)` | Phase 2: seasonal follow-up prompt |
| `estimatePlantQuantity(plantType, bedAreaM2)` | Phase 3: quantity calculator |
| `renderMarkdown(text)` | Converts AI markdown response to safe HTML |
| `formatShareText(profile, result, url)` | Formats clipboard/share text |
| `SOIL_LABELS` | Label map for soil types |
| `ASPECT_LABELS` | Label map for aspects |
| `GOAL_LABELS` | Label map for goals |
| `GOAL_ICONS` | Emoji map for goals |
| `STYLE_LABELS` | Label map for style archetypes |

---

## 5. Current File State

| File | Status | Notes |
|------|--------|-------|
| `index.html` | Phase 1.5 | Wizard + refine panel + modal. Imports from domain.js |
| `domain.js` | Done | 11 exports + 5 clause builders. 95 tests passing |
| `domain.test.js` | Done | 95 tests, 13 suites. Run: npm test |
| `landscaper.html` | Phase 3 scaffold | Functional but Phase 3. Do not deploy yet |
| `worker/index.js` | Done | 4 routes. KV stubs ready but bindings not enabled |
| `wrangler.toml` | Phase 1 active | KV bindings commented out until Phase 2 |
| `package.json` | Done | npm test / check / dev / deploy scripts |
| `knowledge/tier1/hazardous-plants.md` | Done | Dogs/cats/children/hayfever/skin/bees |
| `knowledge/tier1/companion-planting.md` | Done | Good/bad pairs + ornamental |
| `knowledge/tier1/aspect-effects.md` | Done | N/S/E/W + shade types |
| `knowledge/tier1/invasive-species.md` | Done | Legal + garden-invasive + alternatives |
| `knowledge/tier1/hardiness-zones.md` | **Not written** | YGW-015 |
| `knowledge/tier1/seasonal-calendar.md` | **Not written** | YGW-016 |
| `knowledge/tier2/style-natural-wild.md` | Done | Oudolf philosophy + 17 plants |
| `knowledge/tier2/planting-matrices.md` | Done | 6 bed designs |
| `knowledge/tier2/style-cottage.md` | **Not written** | YGW-017 |
| `knowledge/tier2/style-mediterranean.md` | **Not written** | YGW-017 |
| `knowledge/tier2/style-modern-minimal.md` | **Not written** | YGW-017 |
| `knowledge/tier2/style-meticulous.md` | **Not written** | YGW-017 |
| `knowledge/tier2/style-japanese-zen.md` | **Not written** | YGW-017 |

---

## 6. Open Backlog (Priority Order)

| Item | Title | Priority | Blocker? |
|------|-------|----------|---------|
| YGW-013 | Tests for buildAugmentedSystemPrompt | High | No |
| YGW-014 | Email capture UI | High | KV binding (YGW-022) |
| YGW-022 | Worker KV bindings | High | Cloudflare dashboard action |
| YGW-023 | Full pipeline + pre-commit hook | High | No |
| YGW-015 | Knowledge: hardiness-zones.md | Medium | No |
| YGW-016 | Knowledge: seasonal-calendar.md | Medium | No |
| YGW-017 | Knowledge: 5 remaining Tier 2 style files | Medium | No |
| YGW-018 | Real analytics events | Medium | YGW-022 |
| YGW-019 | Seasonal advice follow-up UI | Low | YGW-016 |
| YGW-020 | Saved garden profiles | Low | YGW-022 |
| YGW-021 | Landscaper B2B entry point | Low | Phase 3 |

---

## 7. AARRR Event Taxonomy

All events are currently console.log stubs. Replace with POST to `/analytics` on Worker.

```js
// Acquisition — wizard started
console.log('[AARRR Acquisition] Wizard started');

// Activation — plan generated
console.log('[AARRR Activation] Plan generated', { location, soil, aspect, goals });

// Retention — refine panel used
console.log('[AARRR Retention] Refine panel submitted', { style, colours, plantTypes, safety, extras });

// Revenue — upgrade modal clicked
console.log('[AARRR Revenue] Fake door clicked — upgrade intent registered');

// Revenue — waitlist joined
console.log('[AARRR Revenue] Waitlist joined — strong purchase intent');

// Referral — share used
console.log('[AARRR Referral] Share used');
```

Replace pattern:
```js
async function track(event, data = {}) {
  try {
    await fetch(WORKER_URL + '/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data, ts: Date.now() })
    });
  } catch (_) { /* never block UI for analytics */ }
}
```

---

## 8. System Prompt Architecture

Three tiers of system prompt, built by domain.js:

**Tier 1 — Base** (`buildSystemPrompt()`):
Identity + expertise declaration + output format instructions + clauses assembled from refinements.

**Tier 2 — Augmented** (`buildAugmentedSystemPrompt()`):
Tier 1 + relevant sections extracted from knowledge files (soil type guidance, aspect plant lists, hazard exclusions, style philosophy). Graceful fallback to Tier 1 if files unavailable.

**Tier 3 — Landscaper** (`buildLandscaperSystemPrompt()`):
Professional tone. Latin names. Spacing specs. Client-ready language. Used by landscaper.html only.

---

## 9. Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `ANTHROPIC_API_KEY` | Worker secret | Anthropic API access |
| `YGW_PROFILES` | Worker KV binding | Saved profiles (Phase 2) |
| `YGW_ANALYTICS` | Worker KV binding | Analytics events (Phase 2) |

Set secret: In your terminal — `wrangler secret put ANTHROPIC_API_KEY`
KV bindings: In Cloudflare (dash.cloudflare.com) → Workers & Pages → KV → Create namespace

---

## 10. Deployment Checklist

### Phase 1.5 (current — deploy now)
- [ ] `npm test` passes (95/95)
- [ ] `npm run check` passes
- [ ] Push to github.com/Asspirited/your-green-gardening-wizard
- [ ] Cloudflare Pages auto-deploys (connected to repo)
- [ ] Worker: In your terminal — `cd worker && npm run deploy:worker` (or `wrangler deploy`)
- [ ] Verify WORKER_URL in index.html matches deployed Worker URL

### Phase 2 (email capture + saved profiles)
- [ ] YGW-013 tests written and green
- [ ] YGW-022 KV namespaces created in Cloudflare dashboard
- [ ] wrangler.toml KV bindings uncommented
- [ ] Worker redeployed
- [ ] YGW-014 email capture UI built and tested

---

## 11. Known Issues

1. **buildAspectClause() and buildSoilClause() not standalone** — `buildAugmentedSystemPrompt()` calls these internally but they are not exported. If needed externally, export them.
2. **WORKER_URL hardcoded** — `index.html` has `https://ygw-api-proxy.leanspirited.workers.dev`. If the Worker URL changes, update both `index.html` and `landscaper.html`.
3. **No pre-commit hook** — YGW-023 is open. Until it is done, run `npm test && npm run check` manually before every commit.
4. **Tests for buildAugmentedSystemPrompt() missing** — YGW-013 is open. The function is tested only indirectly via integration.
5. **Knowledge files reference soil-types.md and uk-climate.md** — these are listed in KNOWLEDGE-PROTOCOL.md as existing Tier 1 files but their contents have not been verified in this session.

---

## 12. What to Build Next (Recommended Order)

1. **YGW-023** — Add pre-commit hook (10 minutes): `echo 'npm test && npm run check' > .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit`
2. **YGW-013** — Write tests for buildAugmentedSystemPrompt() with mock loader
3. **YGW-015 + YGW-016** — Write hardiness-zones.md and seasonal-calendar.md (knowledge, no code)
4. **YGW-017** — Write the 5 remaining Tier 2 style files (knowledge, no code)
5. **YGW-022 + YGW-014** — Enable KV bindings, build email capture UI
6. **Deploy Phase 1.5** — Push, verify live
