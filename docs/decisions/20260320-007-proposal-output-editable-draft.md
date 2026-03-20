# ADR-007: Proposal output is editable draft, not direct-to-PDF

**Date:** 2026-03-20
**Status:** Decided
**Deciders:** Rod (LeanSpirited)
**Tags:** ux, product

## Context
Layer 3 AI generates a client proposal narrative. The question was whether
this output goes straight to PDF export or passes through an editable text
area first. This has significant implications for Layer 3 prompt design —
"finished copy" vs "editable draft" are different registers.

## Decision
Proposal output is an editable draft. Ollie reads, edits, then exports.
The AI writes in a confident, professional register but Ollie always has
final say on what the client sees. This preserves his professional voice
and relationship ownership with the client.

## Alternatives considered
| Option | Why rejected |
|--------|-------------|
| Direct to PDF | Removes Ollie's professional judgment; AI output not always client-ready |
| No AI copy, just plant list | Misses the proposal narrative value — the seasonal story is a key differentiator |

## Consequences
**Positive:** Ollie's professional relationship with client preserved; AI assists don't replace.
**Negative:** Extra step before export; requires text editor UI in the app.
**Neutral:** Prompt design targets "confident editable draft" not "finished document."

## Linked items
- Backlog: YGW-0xx (PDF proposal export)
- Related: ADR-006 (Layer 3 AI narrative)
