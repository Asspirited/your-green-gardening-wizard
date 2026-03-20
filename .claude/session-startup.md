# YGW Session Startup Protocol
# Standards: github.com/Asspirited/leanspirited-standards/protocols/session-startup.md
# Product-specific additions below.

---

## Mandatory Sequence — Run Before Any Work

### Step 1: Orientation
State the current date and confirm which product we're working on (YGW).

### Step 2: Read claude.md, testing standards, and design-UX knowledge base
Fetch and read `.claude/claude.md` in full.
Fetch and read `.claude/testing-standards.md` in full.
Fetch and read `.claude/design-ux-knowledge-base.md` — scan Part 3 (nesting diagram) and Part 4 (session triggers) so the DESIGN_REVIEW, INTERVIEW_PREP, and FEATURE_IDEATION triggers are active from the start.

### Step 3: Shared session state (CROSS-CLAUDE SYNC)

Read `/home/rodent/your-green-gardening-wizard/.claude/shared-session-state.md` in full.

Then confirm the Downloads sync file exists for Claude.ai:

```bash
ls /mnt/c/Users/roden/Downloads/ygw-sync-for-claude-ai-*.md | sort | tail -1
```

If the file is missing or dated more than 1 session ago — write it now:

```bash
cp /home/rodent/your-green-gardening-wizard/.claude/shared-session-state.md \
   /mnt/c/Users/roden/Downloads/ygw-sync-for-claude-ai-$(date +%Y-%m-%d).md
```

Claude.ai cannot read WSL paths and cannot access GitHub from its container.
The Downloads copy is its only reliable sync source. If it's missing, Claude.ai starts blind.

### Step 4: Backlog review
Fetch `/docs/ygw-backlog.md`. Identify:
- Any items marked **SHIP TODAY** or **Critical**
- Any items **In Progress** from last session
- Top 3 open items by priority

### Step 5: HDD hypothesis status

State all open HDD hypotheses and their current status.

```
HDD-001: "Landscapers will pay for AI-generated client proposals if output quality
          passes the Ollie test."
Status:   [OPEN / CONFIRMED / REFUTED / PIVOTED]
Evidence: [What we have so far, or "None yet"]
Next validation action: [Specific next step]
```

If HDD-001 is OPEN, state explicitly:
"Today's work should primarily serve the landscaper proposal workflow unless
a pivot is agreed and recorded as an ADR."

Has anything happened since last session that updates this hypothesis?
(User feedback, Oz/Jerry input, Ollie reaction, commercial discussions?)

### Step 6: SWOT check (at phase transitions or if hypothesis has changed)
If hypothesis has changed or we're at a phase boundary:
- Pull `/docs/swot/swot-ygw-inception-2026-03-19.md`
- Run delta SWOT
- Update CD3 prioritisation if needed

### Step 7: Confirm session goal
State the one thing that would make this session a success.  
Confirm with Rod before starting work.

---

## YGW-Specific Context to Confirm Each Session

- Current phase: Phase 1 MVP (Consumer Advisor)
- Live URL: https://your-green-gardening-wizard.leanspirited.workers.dev
- Any user feedback from previous sessions
- Oz / Jerry inputs since last session
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
