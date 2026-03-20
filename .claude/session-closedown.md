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

### Step 4: HDD hypothesis update
Has this session's work confirmed, challenged, or refined the current hypothesis?  
State the updated hypothesis explicitly, even if unchanged.

Current Phase 1 hypothesis (update as learned):  
*"A conversational garden advisor that remembers your garden profile will provide enough value to retain users and validate the knowledge engine before building spatial tools."*

### Step 5: SWOT update (if applicable)
If the session produced strategic learning (user feedback, commercial input, technical discovery):
- Note which SWOT quadrant(s) are affected
- Update `/docs/swot/swot-ygw-inception-2026-03-19.md` or create a new delta SWOT
- Re-run CD3+SWOT prioritisation if priorities have shifted

### Step 6: Next session setup
State the top 3 items for next session, in priority order.  
State the session goal in one sentence.  
Note any blockers that need resolving before next session.

### Step 7: Commit reminder
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
