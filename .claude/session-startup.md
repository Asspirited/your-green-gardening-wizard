# YGW Session Startup Protocol
# Standards: github.com/Asspirited/leanspirited-standards/protocols/session-startup.md
# Product-specific additions below.

---

## Mandatory Sequence — Run Before Any Work

### Step 1: Orientation
State the current date and confirm which product we're working on (YGW).

### Step 2: Read claude.md
Fetch and read `.claude/claude.md` in full.

### Step 3: Backlog review
Fetch `/docs/ygw-backlog.md`. Identify:
- Any items marked **SHIP TODAY** or **Critical**
- Any items **In Progress** from last session
- Top 3 open items by priority

### Step 4: HDD check
What is the current hypothesis we're testing?  
Default Phase 1 hypothesis: *"A conversational garden advisor that remembers your garden profile will provide enough value to retain users and validate the knowledge engine before building spatial tools."*

Has anything happened since last session that updates this hypothesis? (User feedback, commercial discussions, new co-founder input?)

### Step 5: SWOT check (at phase transitions or if hypothesis has changed)
If hypothesis has changed or we're at a phase boundary:
- Pull `/docs/swot/swot-ygw-inception-2026-03-19.md`
- Run delta SWOT
- Update CD3 prioritisation if needed

### Step 6: Confirm session goal
State the one thing that would make this session a success.  
Confirm with Rod before starting work.

---

## YGW-Specific Context to Confirm Each Session

- Current phase: Phase 1 MVP (Consumer Advisor)
- Live URL: https://your-green-gardening-wizard.pages.dev
- Any user feedback from previous sessions
- Oz / Jerry inputs since last session
