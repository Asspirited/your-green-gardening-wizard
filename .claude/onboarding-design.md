# TGW Landscaper Onboarding Design
# Created: 2026-03-20 (Claude.ai session)
# Fetch when: working on landing page, onboarding flow, soft gate, saved projects, or first-use UX

## JTBD framing

A landscaper arrives at The Green Wizard. The job they're hiring it for:
**"Win the client's confidence and close the job."**

The job is NOT "find some plants." Onboarding must orient around that job.
Implication: every screen before Stage 3 is friction. Minimise it.

## Core design principle

**Gate value, not access.**
No signup before the wow moment. The landscaper must see something impressive before we ask for anything.

## The five-stage flow

### Stage 1 — Landing
- Headline frames the job: "Turn your next client brief into a plant palette in 2 minutes"
- No signup prompt on landing
- Single CTA: Try it now

### Stage 2 — First brief
Two paths, both valid:
- **Enter a real brief** (aspect · soil · region · style) — for landscapers who arrive with a job in mind
- **Demo brief pre-filled** — "See it work on a real example" — reduces friction to zero for curious/sceptical arrivals

**Demo brief to build (not done yet):**
Suggested: south-facing · clay soil · Surrey · naturalistic
This is a one-afternoon spike. No AC written — add to branch backlog when prioritised.

### Stage 3 — The wow moment
Plant palette + proposal copy lands.
**This is where HDD-001 / Ollie test lives.**
If a real landscaper isn't impressed here, nothing downstream matters.
Design goal: result must feel professional enough to drop into a client proposal unchanged.

### Stage 4 — Soft gate
Two simultaneous paths:
- **Copy to clipboard** — free, no gate, immediate value (already built)
- **Save / export** — soft gate: "Sign up free to save this"

Open question (put to Oz): what would make a landscaper hand over their email?
Options: save project, export PDF, share link. Oz interview should answer this.
Reference: YGW-071 open questions.

### Stage 5 — Sticky hooks (post-signup)
These are the Sticky engine in practice — features that create return visits:
- **Saved projects** — return value, picks up where they left off
- **Quick Quote (YGW-071)** — upsell on return visit
- **Powered by The Green Wizard footer (YGW-074 ✅)** — client sees proposal → viral tail

## What's built vs what's not

| Stage | Status |
|---|---|
| Stage 3 — Plant Palette result | ✅ Built (YGW-066, feature branch) |
| Stage 4 — Copy to clipboard | ✅ Built |
| Stage 4 — Powered by footer | ✅ Built (YGW-074) |
| Stage 2 — Demo brief pre-filled | ❌ Not built. Low effort spike. |
| Stage 1 — Landing page copy | ❌ Not reviewed against this framing |
| Stage 4 — Save / export gate | ❌ Not built. Needs Oz input on gate mechanic. |
| Stage 5 — Saved projects | ❌ Not built. Right branch spike for now. |
| Stage 5 — Quick Quote | ❌ YGW-071, open questions outstanding |

## HDD connection

HDD-001 tests Stage 3 only: does the palette impress a real landscaper (Ollie)?
HDD-002 (not yet written) should test Stage 4: does the result motivate signup?
These are sequential — do not design the gate until Stage 3 passes.

## Session-insession trigger

Add to session-insession.md:
ONBOARDING_DESIGN — fetch .claude/onboarding-design.md when working on:
landing page, first-use flow, soft gate, saved projects, demo brief, or return-visit features.
