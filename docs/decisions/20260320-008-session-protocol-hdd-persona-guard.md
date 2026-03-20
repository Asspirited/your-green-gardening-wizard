# ADR-008: Session protocol enforces HDD-001 persona discipline until hypothesis closes

**Date:** 2026-03-20
**Status:** Decided
**Deciders:** Rod (LeanSpirited)
**Tags:** process

## Context
YGW sessions can drift toward consumer UX, marketing, or general product
polish without directly testing the open HDD hypothesis. The session protocol
(session-startup.md, session-insession.md, session-closedown.md) needs to
actively enforce prioritisation of the landscaper persona until HDD-001 is
closed or a pivot is explicitly decided.

## Decision
The following guards are added to the YGW session protocol:

**session-startup.md** — on every session start, state the current open
HDD hypotheses and their status. If HDD-001 is still open, flag it explicitly:
*"HDD-001 is open. Today's work should primarily serve the landscaper proposal
workflow unless a pivot has been agreed."*

**session-insession.md** — new trigger: "Persona drift check."
If work in a session is not directly serving the landscaper persona and
HDD-001 is open, Claude flags it: *"Note: this work serves the consumer
persona / general product. HDD-001 (landscaper) is still open — confirm
this is intentional."* Rod can override and continue; the flag is advisory,
not blocking.

**session-closedown.md** — on every session end, answer explicitly:
*"Did today's session advance HDD-001? If yes, how? If no, why not?"*
This forces an honest accounting of where session effort went.

HDD hypothesis closure conditions for HDD-001:
- **Confirmed:** At least one landscaper (not Ollie) has seen the proposal
  output and expressed willingness to pay, or has paid.
- **Refuted:** Multiple landscapers have seen it and rejected the value prop.
- **Pivoted:** An explicit session decision (with ADR) changes the primary
  target persona.

Until one of those three conditions is met, the landscaper persona governs.

## Alternatives considered
| Option | Why rejected |
|--------|-------------|
| No protocol enforcement, rely on discipline | Demonstrated not to work — today's session drifted to consumer features |
| Hard block on non-landscaper work | Too rigid; some consumer work (landing page, seasonal UI) is valid scaffolding |
| Quarterly persona review only | Too infrequent; drift compounds across sessions |

## Consequences
**Positive:** Every session has an honest answer to "did we advance the hypothesis?"
  Oz and Jerry can track hypothesis status from ADR log and closedown notes.
**Negative:** Occasional friction when valid non-landscaper work needs a justification.
**Neutral:** Persona drift flag is advisory — Rod always has override. This is a
  prompt to think, not a gate.

## Linked items
- Supersedes: original ADR-005 framing
- Related: ADR-005 (landscaper persona)
- Related: ADR-006 (three-layer suggestion system)
- Backlog: HDD-001 (open)
