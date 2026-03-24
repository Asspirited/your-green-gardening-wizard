# YGW Session Closedown Protocol
# Standards: github.com/Asspirited/leanspirited-standards/protocols/session-closedown.md
# Product-specific additions below.

---

## Mandatory Sequence — Run Before Ending Any Session

### Step 1: Pipeline check
Is the pipeline green? If not, do not close. Fix or explicitly park with a blocked backlog item.

### Step 2: Backlog update
For every item touched this session:
- Update status (Open → In Progress → Done / Blocked / Deferred)
- Add any new items surfaced during the session
- Note any acceptance criteria changes

### Step 3: Decisions log
List every decision made this session that isn't captured in code or a backlog item:
- Architecture decisions
- Naming decisions
- Scope changes
- Commercial / strategic decisions from Oz or Jerry
Format: `DECISION [date]: [what was decided] — [why]`

### Step 4: HDD advancement check

Answer every session before closing:

1. Did today's session advance HDD-001? Yes / No / Partial
2. If yes — what specifically moved forward?
3. If no — what was the reason?
   (valid: explicit pivot agreed, scaffolding work, consumer feature agreed as intentional)
4. What is the next concrete action that would advance HDD-001?
5. Who owns that action and by when?

Has this session confirmed, challenged, or refined the current hypothesis?
State the updated hypothesis explicitly, even if unchanged.

### Step 5: SWOT update (if applicable)
If the session produced strategic learning (user feedback, commercial input, technical discovery):
- Note which SWOT quadrant(s) are affected
- Update `/docs/swot/swot-ygw-inception-2026-03-19.md` or create a new delta SWOT
- Re-run CD3+SWOT prioritisation if priorities have shifted

### Step 6: Next session setup
State the top 3 items for next session, in priority order.  
State the session goal in one sentence.  
Note any blockers that need resolving before next session.

### Step 7: Generate stakeholder reports

Run the report generator to produce dated Backlog and Waste Log reports for Ollie and Jerry:

```bash
node scripts/generate-reports.cjs
```

This writes two files to `/mnt/c/Users/roden/Downloads/`:
- `ygw-backlog-report-YYYY-MM-DD.md` — Open (CD3 priority), Completed, Deferred
- `ygw-waste-report-YYYY-MM-DD.md` — Open (severity), Resolved

Confirm both files exist before closing. These are the artefacts to send Ollie/Jerry as a session update.

**If new backlog items were raised this session:** update `docs/ygw-backlog.md` first, then re-run the script.
**If new waste items were raised this session:** add them to `docs/ygw-wastelog.md` with Status, Severity, and all four sections, then re-run.

---

### Step 8: Write shared sync file for Claude.ai

**MANDATORY — do this before step 8.**

```bash
cp /home/rodent/your-green-gardening-wizard/.claude/shared-session-state.md \
   /mnt/c/Users/roden/Downloads/ygw-sync-for-claude-ai-$(date +%Y-%m-%d).md
```

This file is how Claude.ai knows what happened in this session.
Without it, Claude.ai has no shared state and falls back to GitHub (blocked) or memory (stale).
Confirm the file exists in Downloads before closing.

### Step 9: Commit reminder
List files that need committing to `Asspirited/your-green-gardening-wizard`:
- New/changed source files
- Updated backlog
- New SWOT documents
- Updated session protocol files (if changed)

---

## YGW-Specific Closedown Checks

- [ ] Is the live URL still working? (once deployed)
- [ ] Is the Cloudflare Worker deployed and healthy?
- [ ] Any new garden domain knowledge that should go into the system prompt?
- [ ] Any Oz / Jerry actions outstanding from this session?
- [ ] Does `leanspirited-standards` need updating? (Raise STD- item if yes)
- [ ] **Features log updated?** `/mnt/c/Users/roden/Downloads/ygw-features-delivered-YYYY-MM-DD.md`
      Must be dated TODAY. Add all shipped features. This is the Ollie/Jerry progress report.
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
