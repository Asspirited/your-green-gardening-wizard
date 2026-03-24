# TGW Combo Explorer Design
# Created: 2026-03-20 (Claude.ai session)
# Fetch when: working on combo explorer, plant selection UX, collector mode, advanced user features, or new Worker endpoints

## Origin

Designed in a live session using Rod as a skilled-amateur test user (back garden, rich loam,
pond, mixed aspect, cool/moody palette, carnivorous interest, night scent). The interaction
model emerged from the question: "what if you click a plant and it shows you RAG combo
options, then click one for the rationale?"

This is distinct from the Plant Palette feature. Plant Palette answers "what's suitable."
Combo Explorer answers "what's exciting, what works together, and why."

## The interaction model

1. User sees a plant grid (their current palette, or a curated set)
2. Click a plant → combo cards appear, RAG-rated, star pairing floats to top
3. Click any combo card → rationale panel opens with explanation and tags
4. Reset → pick a different plant

### RAG meanings
- Green — great combo, same conditions, plant together directly
- Amber — works with care; different conditions, adjacent planting, or sequential not simultaneous
- Red — avoid; habitat or drainage conflict

### Star pairing
- Exactly one per plant — the most exciting combination, not just the safest
- Floats to top of the grid, purple badge, distinct card treatment
- Rationale must be opinionated: "this is the one" not "this could work"
- Key distinction: star pairing is chosen for excitement AND compatibility, not compatibility alone

### Card sort order
Star → Green → Amber → Red
The order itself carries meaning before the user clicks anything.

## What this is NOT

Not a modification of the Plant Palette feature.
Not a "more plants" button.
Not a compatibility checker (that would be symmetric and dull).

It is an **opinionated plant relationship map** — asymmetric, curated, with a point of view.

## User persona this serves

Rod's session revealed a distinct persona: the skilled amateur / collector.
- Drives: rarity, drama, combos, talking-point plants
- Frustrations: finding things that work together, finding interesting things, visualising it
- NOT primarily conditions-driven (they know their garden)
- Wants to be surprised and educated simultaneously

This is different from the landscaper persona (time-poor, credibility-driven, client-facing).
Combo Explorer is the collector mode. Plant Palette is the landscaper mode.
Both are valid. They need different prompts and potentially different entry points.

## Prompt architecture

### Current Plant Palette prompt (existing Worker endpoint)
Input: aspect · soil · region · style
Output: 8-12 plants with 9 fields each (name, latin, description, care tags etc.)
Character: professional, client-safe, no jargon

### Combo Explorer prompt (NEW Worker endpoint needed)
Input: list of plants (names + latin) + garden context (conditions, style intent)
Output: for each plant, a rated combo list with rationale + one designated star pairing

Prompt structure (sketch):

```
You are an expert plantsperson with strong opinions.

Given this plant list: [plants]
And this garden context: [conditions, style]

For each plant, return a JSON array of combo ratings.
Each entry must have:
  - id (target plant)
  - rag: "green" | "amber" | "red"
  - star: true | false (exactly ONE star per source plant)
  - reason: 2-3 sentences, opinionated, specific — not hedged
  - tags: 2-4 short strings (habitat, season, effect)

Rules:
- Exactly one star pairing per plant — the most exciting combination
- Star must be green (compatible), not just dramatic
- Green = same habitat, plant together directly
- Amber = different conditions but works as adjacent/sequential planting
- Red = avoid — explain why briefly
- Reason must be specific to this garden context, not generic advice
- Never hedge — make a recommendation
```

Output: structured JSON, parsed client-side to render cards.

### Why a separate endpoint
The Plant Palette endpoint is tuned for professional, client-safe output with 9 specific
fields. Combo Explorer needs a completely different output schema (relational pairs, not
individual plants) and a different register (opinionated, collector-voice, not client-safe).
Sharing the endpoint would require prompt gymnastics. Keep them separate.

Suggested endpoint: /features/combo-explorer/ (new Worker route)

## What's built vs what's not

| Item | Status |
|---|---|
| Interaction model (prototype) | ✅ Prototyped in Claude.ai session — hardcoded data |
| RAG card display + star badge | ✅ Prototyped |
| Rationale panel | ✅ Prototyped |
| Worker endpoint /combo-explorer | ❌ Not built |
| AI-generated combo ratings | ❌ Not built — hardcoded in prototype |
| Integration with Plant Palette output | ❌ Not designed yet |
| Entry point / mode switching | ❌ Not designed yet |

## Open design questions

1. **Where does the user get their plant list from?**
   Option A: Run Plant Palette first, then "Explore combos" on the result
   Option B: Combo Explorer has its own search/add flow
   Option C: Curated starter sets by garden type (pond garden, dark border, etc.)
   Recommendation: Option A first — lowest friction, builds on existing feature

2. **How many plants in the grid at once?**
   Prototype used 8. More than 12 gets unwieldy. 6-10 is the sweet spot.

3. **Should red cards be shown at all?**
   Argument for: educational — knowing what NOT to do is valuable
   Argument against: negative information clutters the UI
   Current prototype shows them. Worth testing with users.

4. **Collector mode vs landscaper mode — same product or separate entry?**
   Landscaper: needs client-safe output, proposal copy, professional register
   Collector: wants excitement, rarity, opinionated voice
   These may want different landing pages and different onboarding flows.
   Don't conflate them in the prompt or the UI.

## HDD connection

This feature is not yet on the backlog. Before building it:
- Validate Plant Palette with Ollie (HDD-001)
- Identify whether collector/advanced user is a growth segment worth pursuing
- Consider HDD-002: do skilled amateurs pay for combo intelligence?

Don't build the Worker endpoint until HDD-001 returns a result.
Do keep the prototype — it's the cheapest possible test artefact.

## Session-insession trigger

Add to session-insession.md:
COMBO_EXPLORER — fetch .claude/combo-explorer-design.md when working on:
combo explorer feature, plant relationship UX, collector mode, advanced user features,
or the /features/combo-explorer Worker endpoint.
