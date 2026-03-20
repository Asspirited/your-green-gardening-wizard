# Your Green Gardening Wizard — Claude Orchestration
# Standards reference: github.com/Asspirited/leanspirited-standards
# Product-specific context and overrides below.

---

## Identity & Context

**Product:** Your Green Gardening Wizard (YGGW)  
**Owner:** LeanSpirited (Tom Roden / Rod)  
**Co-founders:** Oz, Jerry Maynard  
**Repo:** github.com/Asspirited/your-green-gardening-wizard  
**Backlog prefix:** YGW-  
**Standards repo:** github.com/Asspirited/leanspirited-standards

This is a **standalone product** — separate bounded context from Cusslab, RIA, and TBT.  
RIA patterns (persona engine, scoring agents) may be borrowed in later phases but no coupling on day one.

---

## Session Protocol (Mandatory)

1. Fetch `.claude/session-startup.md` in full before any work
2. Fetch `.claude/session-insession.md` for trigger map mid-session
3. Fetch `.claude/session-closedown.md` in full at session end
No exceptions.

---

## Delivery Framework

TDD-BDD-DDD-HDD four nested loops.  
HDD is the outer loop — if it says wrong problem, all inner loops are waste.  
Full framework: github.com/Asspirited/leanspirited-standards/framework/four-loops.md

---

## Tech Stack Constraints

- Single HTML file entry point (`index.html`)
- Vanilla JS — no framework
- Anthropic API via Cloudflare Worker proxy (never expose API key client-side)
- Cloudflare Pages for hosting
- Cloudflare account: Leanspirited@gmail.com
- 100% statement and branch coverage enforced
- Full green pipeline before merge

---

## Domain Context

### Current Phase
Phase 1 MVP — Consumer garden advisor. Conversational. Single page.

### Core Domain Concepts (ubiquitous language)
- **Garden profile** — location, soil type, aspect, goals captured at session start
- **Aspect** — compass orientation of the main garden face (N/S/E/W/mixed)
- **Hardiness zone** — UK climate zone derived from postcode/region
- **Planting matrix** — repeatable, modular expert-curated plant combinations
- **Soil diagnostic** — guided questions to determine soil type when user doesn't know

### Phase 1 Scope
- Capture garden profile
- Return personalised plant recommendations
- Handle "I don't know my soil type" gracefully
- UK-first (hardiness zones, climate, plant names)
- Mobile and desktop

### Out of Scope (Phase 1)
- Spatial modelling / 2D layout
- Photo upload
- Saved profiles
- B2B features

---

## YGW Standing Design Principles

**Typography pairing (ADR-009, fixed — do not change without ADR)**
- Display/headings: Playfair Display — italic 500 for section labels, upright 500/600 for headlines
- UI/body: DM Sans — 400 regular, 500 medium
- Latin plant names: Playfair Display italic, always

**CSS variable system (canonical)**
```
--green-deep: #1a5c2a  (primary brand, used sparingly)
--green-mid:  #2d8a42  (active states, borders)
--green-light:#85d4a0  (light accent)
--cream:      #faf7f0  (primary background)
--parchment:  #f0ead8  (secondary background, about strips)
--ink:        #1c2218  (primary text)
--mist:       #eef4ec  (tertiary background, tags, step numbers)
```

**Colour usage rule**
Green as accent not flood. Cream/parchment backgrounds throughout.
Green used for: active states, primary CTAs, the deep green callout strip.
Never as a page or section background colour.

**Seasonal coherence rule**
All surfaces (canvas grid, landing page, proposal output) respond to the same season
in the same palette system. A user switching season should feel the whole product
breathe with it, not just one component.

**Canvas tool rule**
No animations or particle effects on the canvas tool (app.html).
Seasonal colouring only — grid palette, plant colours, surface tones.
The canvas is a professional working tool, not a marketing surface.

**Professional user test (YGW)**
"Would a professional landscape designer trust this to present to their client?"

---

## Peer Collaboration Model

Challenge freely. Rod has limited coding skills but tests well. Suggest experiments and quantification of ideas. Flag risks early.

---

## SWOT Reference

Inception SWOT: `/docs/swot/swot-ygw-inception-2026-03-19.md`  
Source: Jerry Maynard's five-model analysis (WhatsApp thread, 19/03/2026)  
Five models analysed: D2C, B2B Landscapers, B2B Designers, Hybrid/White-Label, Garden-in-a-Box  
Recommended first build: B2B SaaS for Landscapers (Jerry) / Consumer Advisor (agreed Day One build)
