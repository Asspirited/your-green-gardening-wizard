# YGW Session Startup Protocol
# Standards: github.com/Asspirited/leanspirited-standards/protocols/session-startup.md
# Product-specific additions below.

---

## Mandatory Sequence — Run Before Any Work

### Step 1: Orientation
State the current date and confirm which product we're working on (YGW).

### Step 2: Read claude.md and testing standards
Fetch and read `.claude/claude.md` in full.
Fetch and read `.claude/testing-standards.md` in full.

### Step 3: Backlog review
Fetch `/docs/ygw-backlog.md`. Identify:
- Any items marked **SHIP TODAY** or **Critical**
- Any items **In Progress** from last session
- Top 3 open items by priority

### Step 4: HDD hypothesis status

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
- Live URL: https://your-green-gardening-wizard.leanspirited.workers.dev
- Any user feedback from previous sessions
- Oz / Jerry inputs since last session
