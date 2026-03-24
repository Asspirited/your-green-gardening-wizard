# ADR-012: Sub-Plot Designer — British Racing Green dark palette

**Date:** 2026-03-24
**Status:** Decided
**Deciders:** Rod (LeanSpirited)
**Tags:** ux | product

## Context
The Claude.ai prototype used a dark soil/brown aesthetic (panel-bg `#1e160f`, soil background `#3d2b1f`). This gave the canvas tool a professional "pro tool" character but did not align with The Green Wizard brand. Two options: reskin to TGW's cream/parchment system, or adapt the dark aesthetic to TGW's green family.

## Decision
Retain the dark professional-tool aesthetic but shift the palette from brown/soil tones to British Racing Green — the dark, saturated green associated with professional craft. Background: `#0a1e12`. Panel: `#0d2818`. Borders and accents use TGW green family (`#1a4a2a`, `#2d7a4e`, `#4a9e68`). Chalk text (`#e8f0e4`) replaces warm cream.

This preserves the "serious tool" character of the dark UI while making it recognisably part of The Green Wizard family.

## Alternatives considered
| Option | Why rejected |
|--------|-------------|
| Full TGW cream/parchment reskin | Loses the "pro tool" character. The canvas-based zone designer benefits from the dark background — it makes the coloured zones pop. The Plant Palette and Quick Quote features use cream — a dark third tool creates intentional hierarchy. |
| Keep original soil/brown | Off-brand. No green family connection. |

## Consequences
**Positive:** Professional feel. Green family coherence. Coloured zones read clearly against dark canvas.
**Negative / trade-offs:** DM Mono font retained (not standard TGW DM Sans) — acceptable for a pro canvas tool where monospace aids technical readability.
**Neutral:** Canvas tool rule (no animations, no particle effects) still applies.

## Linked items
- Backlog: YGW-076
- Related: ADR-011
- Supersedes: nothing
