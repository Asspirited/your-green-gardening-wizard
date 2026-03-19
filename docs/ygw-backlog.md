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

**Status:** Open
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

**Status:** Open
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
