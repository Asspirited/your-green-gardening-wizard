# YGW Session In-Session Protocol — Trigger Map
# Standards: github.com/Asspirited/leanspirited-standards/protocols/session-insession.md
# Product-specific triggers below.

---

## RAISE NEW WORK — routing rule (non-negotiable)

Any time a bug, gap, idea, or observation emerges mid-session:

| Type | Where it goes | Example |
|------|--------------|---------|
| Live bug / broken feature | **WL-NNN** in `docs/ygw-wastelog.md` | mobile dropdown broken |
| Waste / bad process / repeated failure | **WL-NNN** in `docs/ygw-wastelog.md` | wrong token created again |
| New feature / improvement / idea | **BL-NNN** in `docs/ygw-backlog.md` (EPIC J or appropriate) | add font audit |
| Architecture / UX decision | **ADR** in `docs/decisions/YYYYMMDD-NNN-title.md` | rename product |

**Sequence:**
1. Identify type above — bug/waste → WL, feature/idea → BL, decision → ADR
2. Assign next number (count existing WL-NNN or BL-NNN entries)
3. Write entry immediately — do not defer
4. Never file a bug as a BL item

---

## Standard Triggers (all LeanSpirited products)

### Trigger: Strategic decision pending
Phrases: "is this worth building", "which should we do first", "what's the risk", "should we pivot"
→ Run SWOT. Output recommendation. Raise backlog item if actionable.

### Trigger: New bounded context proposed
Phrases: "separate from this", "new module", "different product"
→ Confirm bounded context separation. Create backlog file. Register prefix.

### Trigger: Phase transition
Phrases: "MVP done", "ready to move on", "expanding to"
→ Delta SWOT. Update CD3. Confirm next phase backlog sequence.

### Trigger: Backlog item ready to build
Phrases: "let's build", "start on", "implement"
→ Confirm Gherkin acceptance criteria exist. Confirm pipeline is green from last session. Then build.

### Trigger: Session running long
Phrases: "we're nearly out of time", "quick before we finish"
→ Flag: run session-closedown.md sequence before stopping. Don't lose decisions.

---

## YGW-Specific Triggers

### Trigger: Garden domain question
Phrases: "what plants", "soil type", "aspect", "hardiness", "planting matrix", "UK climate"
→ This is domain knowledge work. Flag if we're hardcoding knowledge vs making it AI-generated.
→ If hardcoding: is this a planting matrix item for the knowledge base?
→ If AI-generated: is the system prompt covering this adequately?

### Trigger: New commercial input from Oz or Jerry
Phrases: "Oz says", "Jerry thinks", "co-founder", "investor", "pilot"
→ Assess against current HDD hypothesis.
→ Does this change the phase sequence?
→ Raise a SWOT delta if significant.

### Trigger: User testing feedback
Phrases: "tested it", "user said", "someone tried", "feedback"
→ This is HDD Build-Measure-Learn data. 
→ Does it confirm or challenge the current hypothesis?
→ Update hypothesis statement if needed.
→ Re-run CD3+SWOT if it changes priorities.

### Trigger: Oz / Jerry ask about progress
→ The live URL and a 30-second demo description should always be ready.
→ Current hypothesis and what we're learning should be articulable in one sentence.

### Trigger: "borrow from RIA"
Phrases: "like RIA", "persona", "scoring agent", "like the assessor"
→ Note the pattern being borrowed.
→ Raise a backlog item for the integration.
→ Do NOT create coupling in Phase 1 code.

### Trigger: Decision made
**Pattern signals:**
- "we'll go with...", "let's do...", "agreed", "that's the right call"
- A design option is chosen over alternatives
- A technology, architecture, or UX approach is selected
- A constraint is established ("always", "never", "from now on")
- A rollout sequence or phasing decision is confirmed
- A backlog item is explicitly deferred or deprioritised

**Sequence on trigger:**
1. Identify decision type (product / architecture / UX / data / process)
2. Write L-ADR immediately — do not defer to session end
3. Append to `/docs/decisions/YYYYMMDD-NNN-short-title.md`
4. Confirm to Rod: "ADR written — [title]"
5. Continue session without interruption

### Trigger: Persona drift
**Pattern signals:**
- Work in session is primarily consumer-facing (end customer UX, marketing copy,
  lifestyle features) and HDD-001 is still open
- A feature is being designed that doesn't directly serve the landscaper
  proposal workflow
- Session has gone 30+ minutes without anything that advances HDD-001

**Sequence on trigger:**
1. Check HDD-001 status from session-startup context
2. If open: flag once — *"Note: current work serves the consumer persona /
   general product. HDD-001 (landscaper proposal workflow) is still open —
   confirm this is intentional before continuing."*
3. Rod confirms or redirects — either is fine, flag is advisory not blocking
4. Do NOT repeat the flag in the same session unless direction changes again
5. Log in closedown: whether today's session advanced HDD-001 and how

---

## STANDING LENS: UI/UX quality standard

Before building any YGW UI, state:
1. Who is using this (landscaper in client meeting vs. consumer browsing)?
2. What is the ONE thing this screen must make effortless?
3. What could go wrong visually or interactively?

After building, run before presenting output:

### Layout and composition
- [ ] No element overlaps at 375px, 768px, 1280px
- [ ] Absolute-positioned elements checked against all other positioned elements
- [ ] Content does not overflow at narrow widths
- [ ] Whitespace intentional — neither cramped nor wasteful
- [ ] Visual hierarchy clear: primary action dominant, secondary recessive

### Typography
- [ ] Playfair Display loaded correctly (not system serif fallback)
- [ ] Latin plant names in italic Playfair throughout
- [ ] Sufficient contrast on all backgrounds including seasonal gradients
- [ ] No accidental font substitutions

### Colour and visual language
- [ ] Green as accent not flood (cream/parchment backgrounds throughout)
- [ ] Interactive elements visually distinct from static
- [ ] Hover and active states on all clickable elements

### Interaction
- [ ] Season switching redraws all canvas icons within 100ms
- [ ] Primary CTA visible without scrolling on first load
- [ ] State changes communicated visually
- [ ] Nothing silently fails

### The professional user test (YGW)
- [ ] Would a professional landscape designer trust this to present to their client?
- [ ] Is every alignment intentional?
- [ ] Does it feel like a professional tool or an assembled prototype?

### Responsive check
- [ ] Tested mentally at 375px, 768px, 1280px
- [ ] No horizontal scroll at any standard width
- [ ] Touch targets 44px minimum on mobile

### UI/UX session note
Note any UI/UX issues spotted but not fixed:
"UI debt: [description] — [screen] — [priority: fix next / backlog]"
Log as YGW-UX-NNN backlog items.

---

## Pipeline Rule
100% statement and branch coverage required. Full green before merge. No exceptions.

Pipeline sequence (in order):
1. `bash scripts/check-auth.sh` — auth canary, exit RED = stop everything
2. Unit tests — 100% statement + branch coverage
3. Contract verification — Pact provider verify against `.pact` files (once contract layer is built)
4. `bash .claude/scripts/pipeline-report.sh` — full report

### Trigger: New seam between browser and Worker
Any new or changed API call from browser → Worker → run Gherkin gate AND define/update Pact contract first.
Gherkin covers behaviour. Contract covers the API surface shape. Both required. Neither replaces the other.

### Trigger: Worker API changed
If Worker handler response shape changes: update `.pact` file AND run provider verification before deploying.
A passing unit test suite does NOT mean the consumer is safe — only a passing contract verify does.

Full testing standards: `.claude/testing-standards.md`

---

## Claude Behaviour Rules

### Rule: Asking Rod to find something
EVERY SINGLE INSTRUCTION must name the system explicitly: "In Cloudflare (dash.cloudflare.com)", "In GitHub (github.com/Asspirited)", "In your terminal", "In your browser".
Not "on that page". Not "in the dashboard". Not "click into the project". THE SYSTEM. EVERY TIME. NO EXCEPTIONS.
BETTER: derive it yourself first. Check known patterns (e.g. worker URL = `https://<worker-name>.leanspirited.workers.dev`), check config files, check existing working examples before asking Rod.
If you genuinely can't get it: one specific instruction naming the system, the section, and exactly what to look for.

### Rule: Clarify when Rod is ambiguous
Rod talks fast and thinks out loud — instructions can be unclear, contradictory, or mid-thought.
If an instruction is genuinely ambiguous: ask one specific clarifying question before doing any work.
Don't guess and build the wrong thing. Don't ask multiple questions at once. One question, then build.
This is not "questioning Rod" — it's how good work gets done.

### Rule: Update features log on every push
After every `git push` that ships a user-facing feature, update the features log:
`/mnt/c/Users/roden/Downloads/ygw-features-delivered-YYYY-MM-DD.md`
- Keep the file dated to TODAY (create new file if date has changed)
- Add the feature to the relevant features section
- Add any newly-done items to the **Closed backlog items** table (all ✅ Done, ever)
- Mark any newly-done backlog items as Done in the open/priority tables
This file is the Ollie/Jerry progress report. Keep it current.

### Rule: Is it worth doing? (xkcd.com/1205)
Before fixing, automating, or spending time on anything non-trivial, apply the time-value test:
- How often does this problem occur?
- How much time does it cost each occurrence?
- How long will the fix take?
If fix_time > (frequency × time_saved × ~260 sessions/year over 5 years) → note it, park it, move on.
Applies to: tooling tweaks, minor bugs, process improvements, "wouldn't it be nice if".
Does NOT apply to: correctness bugs, security issues, anything blocking delivery.

---

## L-ADR Format (canonical)

File naming: `YYYYMMDD-NNN-short-hyphenated-title.md`

```markdown
# ADR-NNN: [Title]

**Date:** YYYY-MM-DD
**Status:** Decided | Superseded by ADR-NNN | Under review
**Deciders:** Rod (LeanSpirited) [+ Oz / Jerry / Ollie if relevant]
**Tags:** product | architecture | ux | data | process

## Context
3–5 sentences max.

## Decision
One paragraph. No hedging.

## Alternatives considered
| Option | Why rejected |
|--------|-------------|
| ... | ... |

## Consequences
**Positive:** What this enables.
**Negative / trade-offs:** What this costs.
**Neutral:** What changes but is neither good nor bad.

## Linked items
- Backlog: YGW-NNN (if applicable)
- Supersedes: ADR-NNN (if applicable)
- Related: ADR-NNN (if applicable)
```

ADRs are immutable once written. To change a decision, write a new ADR with status "Supersedes ADR-NNN".
ADR log lives in `/docs/decisions/`. Maintain a running count of ADRs written each session.

## Session Obligations (continuous)

**ADR log** — maintain running count of ADRs written this session.
At any point Rod asks "what decisions have we made?", list ADR titles and statuses from this session.

**End-of-session prep** (feeds session-closedown.md):
- ADR session summary: titles, IDs, one-line status for each ADR written
- Flag any decisions made verbally but not yet written as ADRs
- Confirm `/docs/decisions/` index is current
---

## Design Thinking & UX Triggers
*Full knowledge base: `.claude/design-ux-knowledge-base.md`*

### Trigger: DESIGN_REVIEW
**When to fire:** Before any feature is built. After any prototype or mockup is produced.

**Sequence:**
1. **JTBD check** — what job does this hire YGW to do? Is that job currently underserved?
2. **Double Diamond check** — are we in the right diamond? (Defining the problem vs delivering a solution?)
3. **Nielsen heuristic pass** — scan all 10 against the proposed interface. Flag any violations.
4. **Krug check** — can a user figure this out without reading instructions?
5. Log findings as named notes against the backlog item before build begins.

### Trigger: INTERVIEW_PREP
**When to fire:** Before Oz runs any customer interview session.

**Sequence:**
1. **Mom Test principle** — reframe all questions to ask about past behaviour, not hypothetical future.
2. **JTBD frame** — ask what job the user currently hires an alternative product to do (not what features they want).
3. Define what validated learning looks like — what would change our HDD hypothesis?
4. Log interview questions as a BDD scenario: `Given [context], When [question asked], Then [what answer validates / invalidates hypothesis]`.

### Trigger: FEATURE_IDEATION
**When to fire:** When generating new feature ideas (backlog expansion, pivot discussions).

**Sequence:**
1. **JTBD** — frame each idea as a job story: `When [situation], I want to [motivation], so I can [expected outcome]`.
2. **Engine check** — does this serve the Viral engine, Sticky engine, or Paid engine? Features serving none are backlog noise.
3. **Double Diamond** — is this a Discover/Define idea (need to learn more) or Develop/Deliver (know enough to build)?
4. Score with CD3 before committing to Gherkin.

---

## Validated Learning & Engines of Growth (append to HDD, DDD, BDD loop guidance)

---

### HDD loop — outer frame

Every HDD cycle must answer:

1. **What did we learn?** Not what did we build — what do we now know that we didn't before?
2. **Is this validated learning?** Evidence from real user behaviour beats assumptions every time. An interview is weak signal. Someone paying, sharing, or returning is strong signal.
3. **Which Engine of Growth are we building for?**
   - **Sticky** — retention is the metric; users come back repeatedly (landscaper repeat proposals)
   - **Viral** — each user generates new users (end user shares a plan; landscaper sees it)
   - **Paid** — CAC < LTV; you can buy growth profitably
   - *Pick one as primary. All three can coexist but only one drives decisions.*

If HDD says wrong problem, all inner loops stop. No exceptions.

---

### DDD loop — design decisions

Every significant design decision should be traceable to a validated learning:

> "We are building X because we observed Y from users Z."

Not:
> "We are building X because it seems like a good idea."

Favour **reversible decisions** (feature flags, thin slices, separate modes) until the engine of growth is identified and validated. Irreversible architectural decisions (data model, pricing model, brand) require stronger evidence.

Backlog items should carry a `learning:` tag where applicable — what question does building this answer?

---

### BDD loop — session acceptance criteria

Session ACs should include a **learning criterion** alongside the delivery criterion:

```gherkin
Given [context]
When [action]
Then [observable outcome]
And we will have learned [what this tells us about our hypothesis]
```

If a session produces only built things and no validated learning, treat it as a red loop — something to fix in the next session retrospective.

---

*Appended March 2026. Applies across YGW and Cusslab projects.*
