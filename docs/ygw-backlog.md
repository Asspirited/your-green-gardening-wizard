# YGW Backlog
**Product:** Your Green Gardening Wizard
**Prefix:** YGW-
**Format standard:** github.com/Asspirited/leanspirited-standards/standards/backlog-format.md

---

## YGW-001 — Cloudflare Worker API proxy

**Status:** Done
**Priority:** Critical
**Loop:** TDD
**Raised:** 2026-03-19

### User Story
As the frontend,
I want to POST a garden conversation to a secure proxy,
So that the Anthropic API key is never exposed client-side.

### Acceptance Criteria

```gherkin
Feature: API proxy

  Scenario: Valid garden query is proxied
    Given the worker receives a POST with a valid JSON body
    When it forwards the request to the Anthropic API
    Then it returns the Anthropic response to the caller

  Scenario: Missing body is rejected
    Given the worker receives a POST with no body
    When it processes the request
    Then it returns a 400 status
```

### Notes
- Worker: `worker/index.js`
- Deploy as: `ygw-api-proxy` on Cloudflare Workers
- Secret: `ANTHROPIC_API_KEY`

---

## YGW-002 — Garden profile capture

**Status:** Done
**Priority:** Critical
**Loop:** BDD
**Raised:** 2026-03-19

### User Story
As a homeowner,
I want to describe my garden's location, soil, aspect, and goals,
So that the advisor can give me personalised recommendations.

### Acceptance Criteria

```gherkin
Feature: Garden profile capture

  Scenario: User provides full profile
    Given the user opens the advisor
    When they provide location, soil type, aspect, and goals
    Then the advisor acknowledges the profile and offers recommendations

  Scenario: User does not know their soil type
    Given the user opens the advisor
    When they say they don't know their soil type
    Then the advisor asks guided diagnostic questions to determine it
```

### Notes
- UK-first: hardiness zones from postcode/region
- Aspect: N/S/E/W/mixed

---

## YGW-003 — Personalised plant recommendations

**Status:** Done
**Priority:** Critical
**Loop:** BDD
**Raised:** 2026-03-19

### User Story
As a homeowner with a captured garden profile,
I want personalised plant recommendations,
So that I can make informed planting decisions without hiring a designer.

### Acceptance Criteria

```gherkin
Feature: Plant recommendations

  Scenario: Recommendations match profile
    Given a user has provided a complete garden profile
    When they ask for plant recommendations
    Then the advisor returns plants suited to their soil, aspect, and climate zone

  Scenario: Recommendations explain reasoning
    Given a user has provided a complete garden profile
    When they ask for plant recommendations
    Then each recommendation includes a brief reason tied to their profile
```

### Notes
- Phase 1: AI-generated recommendations (system prompt + garden profile)
- Phase 2: Planting matrix (expert-curated combinations)

---

## YGW-004 — Domain layer extraction

**Status:** Done
**Priority:** High
**Loop:** TDD
**Raised:** 2026-03-19
**Epic:** Phase 1.5 — Refine

### User Story
As the codebase,
I want all prompt-construction logic extracted to a pure domain module,
So that it can be tested in isolation and reused across Phase 2 and Phase 3 products.

### Acceptance Criteria

```gherkin
Feature: Domain layer

  Scenario: domain.js exports are pure functions
    Given domain.js is imported
    When any exported function is called
    Then it returns a value without touching the DOM or making API calls

  Scenario: Tests cover all exported functions
    Given domain.test.js is run
    When all 95 tests execute
    Then all pass with 0 failures

  Scenario: index.html imports from domain.js
    Given index.html loads in a browser
    When the ES module resolves
    Then buildSystemPrompt and all clause builders come from domain.js
```

### Notes
- `domain.js` — 636 lines, `export type="module"` in index.html
- 95 tests across 13 suites in `tests/domain.test.js`
- Run: `npm test`

---

## YGW-005 — Refine panel: style archetype

**Status:** Done
**Priority:** High
**Loop:** BDD
**Raised:** 2026-03-19
**Epic:** Phase 1.5 — Refine

### User Story
As a homeowner who has received recommendations,
I want to choose a garden style archetype,
So that the plan reflects my aesthetic preferences.

### Acceptance Criteria

```gherkin
Feature: Style archetype refinement

  Scenario: User selects a style
    Given the user has received their initial plan
    When they open the refine panel and select "Natural & wild"
    Then the follow-up recommendation emphasises Oudolf-style planting

  Scenario: All six styles are available
    Given the refine panel is open
    Then the options include: Natural & wild, Meticulous, Cottage, Mediterranean, Modern & minimal, Japanese & Zen
```

### Notes
- Six styles: natural-wild, meticulous, cottage, mediterranean, modern-minimal, japanese-zen
- `buildStyleClause()` in domain.js handles prompt injection

---

## YGW-006 — Refine panel: colour palette

**Status:** Done
**Priority:** Medium
**Loop:** BDD
**Raised:** 2026-03-19
**Epic:** Phase 1.5 — Refine

### User Story
As a homeowner,
I want to specify preferred colour palettes,
So that recommendations match my taste.

### Acceptance Criteria

```gherkin
Feature: Colour palette refinement

  Scenario: User selects a palette
    Given the refine panel is open
    When the user selects "Hot & bold"
    Then the recommendation emphasises reds, oranges, and yellows

  Scenario: Multiple palettes can be combined
    Given the refine panel is open
    When the user selects "White & silver" and "Pastel"
    Then the recommendation blends both palettes
```

### Notes
- `buildColourClause()` in domain.js
- Palettes: white-silver, pastel, hot-bold, cool-blues, natural-green

---

## YGW-007 — Refine panel: plant type filter

**Status:** Done
**Priority:** Medium
**Loop:** BDD
**Raised:** 2026-03-19
**Epic:** Phase 1.5 — Refine

### User Story
As a homeowner,
I want to specify what types of plants I prefer,
So that recommendations focus on the right categories.

### Acceptance Criteria

```gherkin
Feature: Plant type filter

  Scenario: User selects evergreen preference
    Given the refine panel is open
    When the user selects "Evergreen"
    Then the plan prioritises year-round foliage plants

  Scenario: Fast-growing filter adds timing requirement
    Given the user selects "Fast-growing"
    Then the plan notes establishment timings
```

### Notes
- `buildPlantTypeClause()` in domain.js
- Types: perennials, shrubs, climbers, bulbs, annuals, evergreen, fast-growing, trees

---

## YGW-008 — Refine panel: safety constraints

**Status:** Done
**Priority:** High
**Loop:** BDD
**Raised:** 2026-03-19
**Epic:** Phase 1.5 — Refine

### User Story
As a homeowner with dogs, cats, or children,
I want the plan to exclude plants toxic to them,
So that recommendations are safe for my household.

### Acceptance Criteria

```gherkin
Feature: Safety constraints

  Scenario: Dog owner receives safe-only recommendations
    Given the user has selected "Dogs" in safety constraints
    When the plan is generated
    Then it excludes Foxglove, Yew, Laburnum, and Daffodil bulbs

  Scenario: Cat owner receives lily-free recommendations
    Given the user has selected "Cats" in safety constraints
    When the plan is generated
    Then it excludes all Lilium species

  Scenario: Children constraint excludes Monkshood
    Given the user has selected "Children" in safety constraints
    Then the plan excludes Monkshood (Aconitum) and other acutely toxic genera
```

### Notes
- `buildSafetyClause()` in domain.js
- Constraints: dogs, cats, children, hayfever, skin-irritants, bees-important
- Knowledge base: `knowledge/tier1/hazardous-plants.md`

---

## YGW-009 — Refine panel: companion planting extras

**Status:** Done
**Priority:** Medium
**Loop:** BDD
**Raised:** 2026-03-19
**Epic:** Phase 1.5 — Refine

### User Story
As a homeowner who wants to go deeper,
I want extras like companion planting suggestions and invasive plant warnings,
So that my plan has more depth and avoids mistakes.

### Acceptance Criteria

```gherkin
Feature: Companion planting and extras

  Scenario: Companion planting extra requested
    Given the user has selected "Companion planting" in extras
    When the plan is generated
    Then it includes named plant pairs with reasons

  Scenario: Invasive warning extra requested
    Given the user has selected "Flag invasive plants" in extras
    Then the plan warns about Buddleja and other garden-invasive species
```

### Notes
- `buildExtrasClause()` in domain.js
- Extras: companion-planting, avoid-combinations, invasive-warning, seasonal-succession
- Knowledge base: `knowledge/tier1/companion-planting.md`, `knowledge/tier1/invasive-species.md`

---

## YGW-010 — Knowledge base: Tier 1 core files

**Status:** Done
**Priority:** High
**Loop:** DDD
**Raised:** 2026-03-19
**Epic:** Knowledge Engine

### User Story
As the knowledge engine,
I want authoritative Tier 1 files for hazards, companions, aspect, and invasives,
So that `buildAugmentedSystemPrompt()` can inject grounded horticultural knowledge.

### Acceptance Criteria

```gherkin
Feature: Tier 1 knowledge files

  Scenario: All four initial Tier 1 files exist and are non-empty
    Given the knowledge/tier1/ directory
    Then the following files exist with content > 1000 bytes each:
      hazardous-plants.md, companion-planting.md, aspect-effects.md, invasive-species.md
```

### Notes
- Files written 2026-03-19
- Two remaining: hardiness-zones.md, seasonal-calendar.md (YGW-015, YGW-016)

---

## YGW-011 — Knowledge base: Tier 2 style files

**Status:** Partial
**Priority:** Medium
**Loop:** DDD
**Raised:** 2026-03-19
**Epic:** Knowledge Engine

### User Story
As the knowledge engine,
I want Tier 2 style files for all six archetypes,
So that style-aware prompts are grounded in concrete planting approaches.

### Acceptance Criteria

```gherkin
Feature: Tier 2 style knowledge files

  Scenario: All six style files exist
    Given the knowledge/tier2/ directory
    Then the following files exist:
      style-natural-wild.md, style-cottage.md, style-mediterranean.md,
      style-modern-minimal.md, style-meticulous.md, style-japanese-zen.md
    And planting-matrices.md exists
```

### Notes
- Done: style-natural-wild.md, planting-matrices.md
- Remaining (5): cottage, mediterranean, modern-minimal, meticulous, japanese-zen — see YGW-017

---

## YGW-012 — Augmented system prompt with knowledge injection

**Status:** Done
**Priority:** High
**Loop:** TDD
**Raised:** 2026-03-19
**Epic:** Knowledge Engine

### User Story
As the AI advisor,
I want relevant knowledge sections injected into my system prompt,
So that my recommendations are grounded in curated horticultural data, not just training data.

### Acceptance Criteria

```gherkin
Feature: Augmented system prompt

  Scenario: Knowledge is injected for matching profile
    Given a garden profile with clay soil, north-facing aspect, and dogs safety constraint
    When buildAugmentedSystemPrompt() is called
    Then the system prompt includes clay soil guidance from tier1/soil-types.md
    And includes north-facing plant list from tier1/aspect-effects.md
    And includes the dog-safe exclusion list from tier1/hazardous-plants.md

  Scenario: Graceful fallback when knowledge file missing
    Given a knowledge file does not exist
    When buildAugmentedSystemPrompt() is called
    Then it returns a valid prompt using buildSystemPrompt() base
    And does not throw
```

### Notes
- `buildAugmentedSystemPrompt()` in domain.js (async, takes loadKnowledge callback)
- Tests for this function needed: see YGW-013

---

## YGW-013 — Tests for buildAugmentedSystemPrompt

**Status:** Open
**Priority:** High
**Loop:** TDD
**Raised:** 2026-03-19
**Epic:** Knowledge Engine

### User Story
As the test suite,
I want tests for buildAugmentedSystemPrompt() with a mock knowledge loader,
So that knowledge injection logic is covered without reading real files.

### Acceptance Criteria

```gherkin
Feature: buildAugmentedSystemPrompt tests

  Scenario: Knowledge content appears in output
    Given a mock loadKnowledge that returns controlled content
    When buildAugmentedSystemPrompt() is called with a valid profile
    Then the returned prompt contains the injected knowledge content

  Scenario: Fallback on null loadKnowledge
    Given loadKnowledge is null
    When buildAugmentedSystemPrompt() is called
    Then it returns the base system prompt without throwing

  Scenario: Fallback on rejected promise
    Given loadKnowledge throws for a specific file
    When buildAugmentedSystemPrompt() is called
    Then it gracefully omits that section and returns a valid prompt
```

### Notes
- Add to `tests/domain.test.js` as a new describe block
- Use a mock: `const mockLoad = async (path) => mockFiles[path] ?? null`
- This will push test count above 95

---

## YGW-014 — Email capture UI (waitlist → real capture)

**Status:** Open
**Priority:** High
**Loop:** BDD
**Raised:** 2026-03-19
**Epic:** Phase 2 — Retention

### User Story
As a user who clicks "Join the waitlist",
I want my email address captured and stored,
So that LeanSpirited can contact me when the paid plan launches.

### Acceptance Criteria

```gherkin
Feature: Email capture

  Scenario: User submits email in upgrade modal
    Given the upgrade modal is open
    When the user enters their email and clicks "Join the waitlist"
    Then the email is POSTed to /save-profile on the Worker
    And the user sees a confirmation message
    And the AARRR Revenue event fires

  Scenario: Invalid email is rejected client-side
    Given the upgrade modal is open
    When the user enters "notanemail" and clicks submit
    Then the form shows an inline error without submitting
```

### Notes
- Worker `/save-profile` route already built — needs KV binding enabled in wrangler.toml
- Client: add email input to modal, replace fake-door join button
- KV namespace: `YGW_PROFILES` (create in Cloudflare dashboard)

---

## YGW-015 — Knowledge base: hardiness-zones.md

**Status:** Open
**Priority:** Medium
**Loop:** DDD
**Raised:** 2026-03-19
**Epic:** Knowledge Engine

### User Story
As the knowledge engine,
I want a UK hardiness zone reference file,
So that location-based advice is grounded in accurate frost risk data.

### Acceptance Criteria

```gherkin
Feature: Hardiness zones knowledge

  Scenario: File exists and covers UK zones
    Given knowledge/tier1/hardiness-zones.md
    Then it covers H1-H7 RHS ratings
    And maps regions (Scotland Highlands, SW England, etc.) to zones
    And gives typical minimum temperatures per zone
```

### Notes
- RHS H1–H7 scale, not USDA
- Include key cities/regions as reference points
- ~150–200 lines target

---

## YGW-016 — Knowledge base: seasonal-calendar.md

**Status:** Open
**Priority:** Medium
**Loop:** DDD
**Raised:** 2026-03-19
**Epic:** Knowledge Engine

### User Story
As the knowledge engine,
I want a UK seasonal task calendar,
So that `buildSeasonalPrompt()` (Phase 2) has grounded timing data.

### Acceptance Criteria

```gherkin
Feature: Seasonal calendar knowledge

  Scenario: File covers all four seasons
    Given knowledge/tier1/seasonal-calendar.md
    Then it includes planting windows, pruning timings, and frost risk by season
    And covers spring, summer, autumn, and winter sections
```

### Notes
- UK-specific (not RHS general)
- Feeds `buildSeasonalPrompt()` in domain.js
- ~150–200 lines target

---

## YGW-017 — Knowledge base: remaining Tier 2 style files (5)

**Status:** Open
**Priority:** Medium
**Loop:** DDD
**Raised:** 2026-03-19
**Epic:** Knowledge Engine

### User Story
As the knowledge engine,
I want style files for all six archetypes,
So that style-aware prompts are fully grounded.

### Acceptance Criteria

```gherkin
Feature: Remaining style knowledge files

  Scenario: All five files exist and are non-empty
    Given the knowledge/tier2/ directory
    Then the following files exist with content > 3000 bytes each:
      style-cottage.md
      style-mediterranean.md
      style-modern-minimal.md
      style-meticulous.md
      style-japanese-zen.md
```

### Notes
- natural-wild already done
- Each file: philosophy + characteristic plants + do/don't list
- ~80–120 lines each

---

## YGW-018 — Real analytics events (AARRR)

**Status:** Open
**Priority:** Medium
**Loop:** TDD
**Raised:** 2026-03-19
**Epic:** Phase 2 — Retention

### User Story
As the product team,
I want real analytics events rather than console.log stubs,
So that we can measure AARRR metrics without manual log inspection.

### Acceptance Criteria

```gherkin
Feature: Analytics events

  Scenario: Profile submitted event fires
    Given a user completes the wizard
    When the plan is generated
    Then an Acquisition event is POSTed to /analytics on the Worker

  Scenario: Upgrade modal click event fires
    Given the user clicks "Full plan — £9.99"
    Then a Revenue intent event is POSTed to /analytics

  Scenario: Worker stores analytics event in KV
    Given the /analytics route receives a POST
    Then the event is stored in YGW_ANALYTICS KV namespace with a timestamp key
```

### Notes
- Replace all `console.log('[AARRR ...]')` stubs in index.html
- Worker `/analytics` route already built
- Consider Cloudflare Analytics Engine as alternative to KV for events

---

## YGW-019 — Seasonal advice follow-up (Phase 2)

**Status:** Open
**Priority:** Low
**Loop:** BDD
**Raised:** 2026-03-19
**Epic:** Phase 2 — Retention

### User Story
As a returning user,
I want to ask what I should be doing in my garden right now,
So that I get timely seasonal advice without starting over.

### Acceptance Criteria

```gherkin
Feature: Seasonal advice

  Scenario: User requests seasonal follow-up
    Given the user has a plan displayed
    When they click "What should I do this month?"
    Then the advisor returns month-specific tasks for their profile
    And uses buildSeasonalPrompt() from domain.js
```

### Notes
- `buildSeasonalPrompt()` already in domain.js — needs UI trigger
- Requires seasonal-calendar.md (YGW-016) for augmented version

---

## YGW-020 — Saved garden profiles (Phase 2)

**Status:** Open
**Priority:** Low
**Loop:** BDD
**Raised:** 2026-03-19
**Epic:** Phase 2 — Retention

### User Story
As a returning user,
I want my garden profile saved so I don't re-enter it each time,
So that follow-up questions are personalised without re-running the wizard.

### Acceptance Criteria

```gherkin
Feature: Saved profiles

  Scenario: Profile is saved after plan generation
    Given the user has received their plan
    Then their profile is stored via /save-profile and a token returned
    And the token is saved to localStorage

  Scenario: Returning user loads their profile
    Given the user returns and a localStorage token exists
    When the page loads
    Then the wizard is pre-filled with their saved profile
    And they can jump straight to plan generation
```

### Notes
- Worker `/save-profile` and `/load-profile` routes already built
- KV binding needed: `YGW_PROFILES` namespace

---

## YGW-021 — Landscaper B2B entry point (Phase 3)

**Status:** Open
**Priority:** Low
**Loop:** BDD
**Raised:** 2026-03-19
**Epic:** Phase 3 — B2B

### User Story
As a professional landscaper,
I want to generate a client-ready planting plan document,
So that I can use the wizard to speed up my design workflow.

### Acceptance Criteria

```gherkin
Feature: Landscaper planting plan

  Scenario: Landscaper generates a professional plan
    Given landscaper.html is open
    When they enter a client brief and garden profile
    Then the advisor returns a professional-format planting plan
    And the plan can be printed to PDF

  Scenario: Landscaper prompt uses professional tone
    Given the landscaper entry point
    When a plan is generated
    Then it uses buildLandscaperSystemPrompt() from domain.js
    And the output includes Latin plant names and spacing specifications
```

### Notes
- `landscaper.html` already built
- `buildLandscaperSystemPrompt()` in domain.js
- `estimatePlantQuantity()` in domain.js for quantity calculations

---

## YGW-022 — Worker KV bindings and deployment (Phase 2 enabler)

**Status:** Open
**Priority:** High
**Loop:** TDD
**Raised:** 2026-03-19
**Epic:** Phase 2 — Retention

### User Story
As the Worker,
I want KV namespaces bound so that /save-profile and /analytics can store data,
So that Phase 2 features (email capture, saved profiles, analytics) work in production.

### Acceptance Criteria

```gherkin
Feature: Worker KV bindings

  Scenario: YGW_PROFILES KV namespace is bound
    Given wrangler.toml has the KV binding uncommented
    And the namespace exists in Cloudflare dashboard
    When /save-profile receives a POST
    Then it stores data without a 500 error

  Scenario: YGW_ANALYTICS KV namespace is bound
    Given the analytics binding is active
    When /analytics receives a POST
    Then the event is stored
```

### Notes
- In Cloudflare (dash.cloudflare.com): Workers & Pages → KV → Create namespace `YGW_PROFILES` and `YGW_ANALYTICS`
- Uncomment KV bindings in wrangler.toml
- Redeploy Worker: `npm run deploy:worker`

---

## YGW-023 — Full pipeline setup

**Status:** Open
**Priority:** High
**Loop:** TDD
**Raised:** 2026-03-19
**Epic:** Quality Gate

### User Story
As the codebase,
I want a full pipeline (tests + syntax check + knowledge file presence check),
So that nothing broken can be committed.

### Acceptance Criteria

```gherkin
Feature: Pipeline

  Scenario: Pipeline passes on clean state
    Given all files are in correct state
    When npm test && npm run check is run
    Then exit code is 0

  Scenario: Pipeline fails on broken domain.js
    Given a syntax error is introduced to domain.js
    When npm run check is run
    Then exit code is non-zero

  Scenario: Pre-commit hook blocks broken commits
    Given a git pre-commit hook runs npm test && npm run check
    When a commit is attempted with failing tests
    Then the commit is blocked
```

### Notes
- `npm test` and `npm run check` already in package.json
- Add `.git/hooks/pre-commit` to enforce: `npm test && npm run check`
- Consider adding knowledge file presence check to pipeline

---
