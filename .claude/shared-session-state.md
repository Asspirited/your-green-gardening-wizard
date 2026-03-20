# YGW Shared Session State
# Written by Claude Code at session close. Read by Claude.ai at next session start.
# Date: 2026-03-20

---

## What was done this session

### Features shipped (all committed + pushed to main)

- **YGW-050/051** — Plant palette accordion: categories collapsed by default (Trees open),
  expanding one closes others
- **YGW-052** — Layer 1 Archetype Palette (ADR-006 Layer 1):
  8 archetypes (Contemporary, Cottage, Woodland, Mediterranean, Family, Formal,
  Productive, Wildlife). Each has a ranked suggest list in professional design
  sequence (surfaces → structures → trees → shrubs → perennials), an avoid list,
  and a tagline. Suggestions appear at top of palette; avoided items faded with ⚠;
  style guide + sequence shown in info panel.
- **YGW-053** — Canvas element sizing fix: added `lengthMetres` to wall (4m), fence (3.6m),
  path (3m), rill (4m). Rect and ellipse renderer now uses separate short/long axes.
- **ADR log** — `docs/decisions/` created, ADR-001 through ADR-008 committed.
  First architectural decision record for YGW.
- **Session protocol patched** — `session-insession.md` in YGW repo and
  `leanspirited-standards` updated with ADR trigger, L-ADR format, HDD persona
  drift guard, and session ADR obligation.

### Backlog items raised this session

- YGW-054: Canvas season toggle — show placed garden in Spring/Summer/Autumn/Winter
- YGW-055: Seasonal shade cover — deciduous trees bare in winter, full in summer

---

## Decisions made

DECISION 2026-03-20: Archetype vocabulary uses the same 8 labels for Ollie (professional)
  and end consumers. "Contemporary", "Cottage" etc. are garden styles, not jargon.
  No separate professional/consumer vocabulary needed — captured in ADR-006 notes.

DECISION 2026-03-20: ADR-001 through ADR-008 now live in docs/decisions/.
  L-ADR format is canonical (Thoughtworks lightweight). Immutable once decided.
  Supersede with new ADR, never edit.

DECISION 2026-03-20: YGW-021 (email capture) deferred — all internal testing for now.
  No email capture infrastructure until HDD-001 validated.

---

## HDD hypothesis status

**HDD-001:** "Landscapers will pay for AI-generated client proposals if output quality
passes the Ollie test."

**Status: OPEN — not yet validated**

**Today's advancement: PARTIAL**
- Layer 1 archetype palette is now built — Ollie can pick a garden style and get
  a ranked suggestion list in professional design sequence
- Canvas has full 37-element library, growth timeline, PDF export
- The tool is now good enough for Ollie to run a real client garden through it

**Next validation action:** Get the canvas (app.html) in front of Ollie.
The Ollie test: does the archetype suggestion list match what he'd actually spec?
Does the PDF look client-presentable? Would he pay £30–100/month for this?

**HDD-001 closure conditions:**
- Confirmed: at least one landscaper (not Ollie) expresses willingness to pay, or pays
- Refuted: multiple landscapers have seen it and rejected the value prop
- Pivoted: explicit session decision (with ADR) changes primary target persona

---

## Live URLs

- **Site (primary):** https://asspirited.github.io/your-green-gardening-wizard/
- **Canvas tool:** https://asspirited.github.io/your-green-gardening-wizard/app.html
- **Landscaper:** https://asspirited.github.io/your-green-gardening-wizard/landscaper.html
- **API Worker:** https://ygw-api-proxy.leanspirited.workers.dev (alive, ANTHROPIC_API_KEY set)

---

## Next session top 3

1. **YGW-054** — Season toggle in canvas (show garden across Spring/Summer/Autumn/Winter)
   — completes the seasonal story Ollie needs to demo to clients
2. **YGW-055** — Seasonal shade cover (deciduous trees bare in winter, full canopy in summer)
   — extends YGW-054
3. **Get canvas in front of Ollie** — this is the HDD-001 validation action.
   If session has Oz/Jerry input about Ollie's reaction, that changes the backlog order.

---

## What Claude.ai should know

- The canvas tool (app.html) is now Ollie-ready for a first test. This is the most
  important thing. Don't let the session drift to consumer features until Ollie
  has tested it and given a verdict.
- ADR log is now live in docs/decisions/. When any design decision is made, write an
  ADR immediately — do not defer. See session-insession.md for L-ADR format.
- The palette accordion and archetype chips are the main new UI in the canvas.
  The archetype picker is at the top of the left palette sidebar.
- YGW-021 (email capture) is parked. Do not raise it unless Rod explicitly asks.
- Cloudflare auth: tokens are expired as of 2026-03-19 (per memory/feedback_auth_fix.md).
  Run check-auth.sh canary at session start. If RED on Cloudflare token, follow
  auth-ops.md — do not guess or retry bare wrangler commands.
