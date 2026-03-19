# YGW Testing Standards
# Owner: LeanSpirited | Last updated: 2026-03-19
# Principles: TDD-BDD-DDD-HDD four nested loops. Contract testing at every service seam.

---

## Why this document exists

YGW is a distributed system: vanilla JS browser client + Cloudflare Worker + Anthropic API.
Without explicit contract tests at every seam, you have a distributed monolith:
- Tests pass locally
- Worker deploys
- Browser silently breaks
- You find out via a user report

Contract testing makes service boundaries explicit and independently verifiable.
Each context can evolve without coordinating releases, as long as the contract passes.

---

## Bounded contexts and their test responsibilities

| Context | Type | Test type |
|---|---|---|
| `domain.js` | Pure functions | Unit (TDD) — 100% coverage |
| `js/seasons.js` | Pure functions | Unit (TDD) — 100% coverage |
| `js/canvas.js` | (future) geometry utils | Unit (TDD) — 100% coverage |
| Browser → Worker seam | API call | **Contract (Pact)** |
| Worker handler logic | Pure functions | Unit (TDD) — 100% coverage |
| Worker → Anthropic seam | External API | Mocked in unit; live in canary ping |
| Knowledge files | Content | Snapshot / presence check |

---

## The four test layers

### Layer 1 — Unit (TDD inner loop)
- **What:** Individual functions, pure logic, no I/O
- **Scope:** `domain.js`, `seasons.js`, Worker handler functions, geometry utils
- **Tool:** Vitest (replaces/supplements current runner — better Cloudflare Workers support)
- **Coverage:** 100% statement AND branch. No exceptions.
- **Speed:** Must run in < 5s total. If slow — split or mock.
- **Gate:** Blocks merge if RED or coverage drops below 100%.

### Layer 2 — Contract (Pact — Consumer-Driven)
- **What:** The API surface between browser (consumer) and Worker (provider)
- **How it works:**
  1. Consumer test fires a request at a Pact mock, specifies expected response shape
  2. Pact generates a `.pact` JSON file (the contract artifact)
  3. Provider verification runs the `.pact` file against the real Worker via Miniflare
  4. If Worker response doesn't match contract → RED → do not deploy
- **Tool:** `@pact-foundation/pact` (consumer), Miniflare (provider verification)
- **Contracts live in:** `tests/contracts/` — committed to repo, versioned with code
- **Gate:** Blocks Worker deployment if contract verification fails.
- **Key rule:** Consumer defines the contract first. Provider adapts. Never the reverse.

**Current contracts to define (Phase 1):**
- `POST /messages` — browser sends `{model, max_tokens, system, messages}`, expects `{content: [{type:'text', text:string}]}`
- `POST /save-profile` — (once YGW-021 is built)

### Layer 3 — Integration
- **What:** Real dependencies wired together, controlled data
- **Scope:** Worker + real knowledge files loaded + Anthropic API mocked at network level
- **Tool:** Miniflare + MSW (Mock Service Worker) or fetch intercept
- **Gate:** Runs in CI on PR to main. Not required for feature branches.

### Layer 4 — E2E
- **What:** Full user journey through real browser + deployed Worker
- **Scope:** Critical paths only (Phase 1: profile → recommendation → share)
- **Tool:** Playwright (when needed — not yet)
- **Gate:** Not in pipeline yet. Manual testing + HDD validation (Ollie test) covers this for now.

---

## Gherkin gate (updated)

Before implementing any new behaviour, you need BOTH:

1. **Gherkin** — acceptance criteria in `docs/ygw-backlog.md` for the feature
2. **Contract** — if the feature touches the browser→Worker seam, define/update the `.pact` file first

Data-only changes (tournament data, CSS variables, content) — no Gherkin or contract needed.
New code paths — Gherkin gate applies.
New/changed API seam — Gherkin + contract gate applies.

---

## Tooling decisions

| Role | Tool | Reason |
|---|---|---|
| Unit test runner | Vitest | Native Cloudflare Workers support, fast, ESM-first |
| Consumer contract tests | `@pact-foundation/pact` | De facto standard, language-neutral contracts |
| Provider verification | Miniflare + Pact verifier | Full Workers runtime locally, no deployment needed |
| Contract broker | PactFlow (free tier) or `.pact` files in repo | Start with files in repo; move to PactFlow when >2 contracts |
| Integration mocking | MSW or fetch intercept | Intercept Anthropic calls without network |

---

## What "100% coverage" actually means

Coverage is a floor, not a ceiling. It proves:
- Every branch has been exercised
- No dead code is silently broken

It does NOT prove:
- The logic is correct (that's what Gherkin acceptance criteria prove)
- The seam with another service is correct (that's what contract tests prove)
- The user experience is correct (that's what HDD + the Ollie test prove)

All four layers are necessary. Any single layer alone gives a false premise.

---

## The distributed monolith test

Ask this before adding any cross-service call:

1. Can the Worker deploy without the browser redeploying? (If no → coupling)
2. Can the browser deploy without the Worker redeploying? (If no → coupling)
3. Is the contract between them explicitly tested? (If no → hidden coupling)

If any answer is wrong — fix the architecture or add the contract test before shipping.

---

## Pipeline report format (required)

Every pipeline run must produce a summary table in this format:

```
Layer          Result      Stmt%   Branch%   Time   Bugs
──────────────────────────────────────────────────────────
0 Auth         ✅ GREEN      —       —        2s      —
1 Unit         ✅ GREEN    97.41   89.30       1s      0
2 Contract     ✅ GREEN    53.47   21.43       0s      0
3 Acceptance   SKIP          —       —        0s      0
4 UI           SKIP          —       —        0s      —
5 OAT          ✅ GREEN      —       —        1s      —
──────────────────────────────────────────────────────────
Total build + test time: 4s
```

**All layers must show:**
- Result (✅ GREEN / ❌ RED / SKIP)
- Statement coverage % (where measurable)
- Branch coverage % (where measurable)
- Time taken
- Bug/failure count

**Run:** `npm run pipeline` or `bash scripts/pipeline-report.sh`

This table must be produced at the end of every session before closedown.
If it does not exist or is not green — do not merge, do not close session.

---

## Adding contract testing to YGW (implementation order)

Phase 1 (now): Define `.pact` file manually for `/messages` endpoint. Add to repo. Add Pact provider verify to pipeline.
Phase 2: Add Pact consumer test in browser test suite that generates the `.pact` automatically.
Phase 3: Add Miniflare + Pact to CI. Move to PactFlow if contract count grows.

Backlog item: YGW-044 — Add Pact contract test for Worker /messages endpoint.

---

*Standards ref: ygw-testing-standards-v1-2026-03-19 · LeanSpirited*
