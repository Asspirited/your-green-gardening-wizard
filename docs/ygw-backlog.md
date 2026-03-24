# YGW Product Backlog
# Prefix: YGW- | Version: 3.0 | Date: 2026-03-20
# CD3+SWOT scored. Score = (Cust + Dep - Comp) + (SWOT × 1.5)
# Kano classification added 2026-03-20. B=Basic P=Performance D=Delighter

---

## Status legend
- ✅ Done     — shipped, tests green
- 🔨 Building — Claude Code active
- 📋 Open     — ready to implement
- ⏸ Parked   — blocked or deliberately deferred
- 💡 Idea     — future, not yet spec'd

## Kano legend
- **B** Basic — must work; absence causes failure; presence not noticed
- **P** Performance — more = proportionally better; standard prioritisation
- **D** Delighter — unexpected; disproportionate delight; time-sensitive window

---

## EPIC A — Core advisor engine (Phase 1)

| ID | Title | Score | Kano | Status |
|---|---|---|---|---|
| YGW-001 | 4-step garden profile wizard | 11.0 | B | ✅ Done |
| YGW-002 | Cultivar-level AI recommendations | 11.0 | B | ✅ Done |
| YGW-003 | Share button + clipboard text | 7.5 | P | ✅ Done |
| YGW-004 | Fake-door revenue test (£9.99 modal) | 5.5 | P | ✅ Done |
| YGW-005 | Cloudflare Worker API proxy | 11.0 | B | ✅ Done |

---

## EPIC B — Knowledge enrichment (Phase 1.5)

| ID | Title | Score | Kano | Status |
|---|---|---|---|---|
| YGW-006 | Companion planting + bad combinations | 7.5 | P | ✅ Done |
| YGW-007 | Garden style archetypes (6 styles) | 7.5 | P | ✅ Done |
| YGW-008 | Colour palette preferences | 4.5 | P | ✅ Done |
| YGW-009 | Pet/child/allergy safety filters | 10.0 | B | ✅ Done |
| YGW-010 | Plant type filter | 3.0 | P | ✅ Done |
| YGW-011 | Invasive species warnings | 5.5 | B | ✅ Done |
| YGW-012 | Domain layer extraction (domain.js) | 8.5 | B | ✅ Done |
| YGW-013 | Tests for buildAugmentedSystemPrompt() | 6.0 | B | ✅ Done |
| YGW-014 | Pre-commit hook + pipeline enforcement | 6.0 | B | ✅ Done |
| YGW-025 | Year-round interest planner | 5.5 | P | 📋 Open |
| YGW-048 | Enter key submits wizard step — Return fires enabled Next/Submit button | 6.0 | B | ✅ Done |

---

## EPIC C — Knowledge base files (Phase 1.5)

| ID | Title | Score | Kano | Status |
|---|---|---|---|---|
| YGW-015 | hardiness-zones.md (Tier 1) | 8.0 | P | ✅ Done |
| YGW-016 | seasonal-calendar.md (Tier 1) | 11.5 | P | ✅ Done |
| YGW-017 | 5 remaining Tier 2 style files | 8.0 | P | ✅ Done |

---

## EPIC D — Viral growth engine (Phase 2)

| ID | Title | Score | Kano | Status | Notes |
|---|---|---|---|---|---|
| YGW-018 | **Shareable visual plan card (SVG/canvas)** | **8.5** | D | ✅ Done | Unlocks Instagram/Pinterest. Decay window ~1yr. Full spec below. |
| YGW-046 | Cycling hero images with seasonal taglines in seasonal fonts | 5.5 | P | ✅ Done | |

### YGW-018 — Shareable visual plan card: full spec

**Epic:** D — Viral growth engine
**HDD hypothesis:** H1 — shareable output drives referral. Instagram/Pinterest acquisition currently zero.

**User story:**
As a gardener who has received recommendations, I want to share a beautiful visual card showing my garden plan so that friends discover the wizard through my social media.

**Acceptance criteria:**
```gherkin
Feature: Shareable visual plan card

  Scenario: User shares as image on mobile
    Given a user has received recommendations
    When they click "Share as image"
    Then a 1080x1080 PNG card is generated
    And the card shows their location, soil, aspect as pills
    And the card shows 5 plant names extracted from recommendations
    And the native share sheet opens with the image file
    And the card includes the YGW URL

  Scenario: User downloads card on desktop
    Given a user on desktop clicks "Share as image"
    Then the PNG downloads automatically
    And the filename is "my-garden-plan.png"

  Scenario: Card extracted plants match recommendations
    Given recommendations contain bold plant names (**Rosa 'Gertrude Jekyll'**)
    When generateShareCard() extracts plant names
    Then the top 5 bolded names are identified correctly
    And names longer than 30 chars are truncated with ellipsis

  Scenario: Fallback when Canvas not supported
    Given the browser does not support Canvas
    When user clicks "Share as image"
    Then the text share fallback is used silently
```

**Card design spec:**
- Dimensions: 1080×1080px square (Instagram) or 1200×630px landscape (Twitter/OG)
- Background: Deep forest green (#1a3a2a), subtle diagonal leaf pattern
- Top: YGW logo mark + brand name in Playfair Display italic, cream
- Pills: Location, soil, aspect in sage green (#52b788) on dark green
- Style badge (if selected): archetype badge top-right, warm parchment
- Plant list: Top 5 — plant name DM Sans 500 cream, Latin name italic mint green, leaf bullet
- Bottom bar: "Get your free garden plan" + ygw.pages.dev in sage

**Implementation notes:**
- New function: `generateShareCard(profile, result, refinements)` → `Promise<Blob>`
- Offscreen `<canvas>` 1080×1080, Canvas 2D API
- Extract top 5 plant names via regex on `**bold**` markdown
- Export: `canvas.toBlob('image/png')` → `navigator.share({files})` mobile / `<a download>` desktop
- Add to domain.js exports + tests
- Two share buttons: `📋 Copy text` (existing) + `🖼️ Share as image` (new)

**AARRR:** Referral — share-as-image click rate vs share-as-text. Target: 2× baseline.

---

## EPIC E — Seasonal retention engine (Phase 2)

| ID | Title | Score | Kano | Status |
|---|---|---|---|---|
| YGW-019 | Seasonal UI awareness (client-side) | 9.5 | D | ✅ Done |
| YGW-020 | Seasonal context in AI prompt | 10.5 | P | ✅ Done |
| YGW-022 | Seasonal re-engagement email (cron) | 10.5 | D→P | ⏸ Parked — YGW-021 now done; un-park when Resend + EMAIL_API_KEY wired |
| YGW-024 | Chelsea/garden event hooks | 6.0 | D | 📋 Open |

### YGW-019 — Seasonal UI awareness

**User story:** As a gardener returning in autumn, I want the app to feel relevant to right now.

```gherkin
Feature: Seasonal UI awareness

  Scenario: App reflects current season on load
    Given a user opens the app in October
    When the hero section loads
    Then the headline reflects autumn
    And the CTA reads "Get your autumn garden plan"
    And loading messages reference the season

  Scenario: getCurrentUKSeason() returns correct values for all months
    Given today is any UK date
    When getCurrentUKSeason() is called
    Then it returns { season, label, cta, loading }
    And season is one of: spring | summer | autumn | winter
```

**Implementation:** Pure client-side. `getCurrentUKSeason(date = new Date())` exported from domain.js. Fully testable with mocked dates. Zero infrastructure.

```javascript
export function getCurrentUKSeason(date = new Date()) {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5)  return { season:'spring', label:'Spring', cta:'Get your spring garden plan', loading:"Checking what's emerging..." };
  if (month >= 6 && month <= 8)  return { season:'summer', label:'Summer', cta:'Get your summer garden plan', loading:"Finding what loves the heat..." };
  if (month >= 9 && month <= 11) return { season:'autumn', label:'Autumn', cta:'Get your autumn garden plan', loading:"Checking what needs doing before frost..." };
  return { season:'winter', label:'Winter', cta:'Plan your spring garden now', loading:"Thinking ahead to spring..." };
}
```

---

### YGW-020 — Seasonal context in AI prompt

**User story:** As a gardener getting recommendations in November, I want advice for what to do NOW — not May.

```gherkin
Feature: Seasonal context in AI prompt

  Scenario: November recommendations prioritise autumn actions
    Given a user submits their profile in November
    When recommendations are generated
    Then the output prioritises: planting bulbs/garlic/bare-root, cutting back, frost protection

  Scenario: buildSeasonalContext() adds correct season
    Given any UK date and location
    When buildSeasonalContext(location, date) is called
    Then it returns a prompt fragment referencing the current season
    And names month-appropriate tasks for UK gardens
```

**Implementation:**
```javascript
export function buildSeasonalContext(location, date = new Date()) {
  const { season } = getCurrentUKSeason(date);
  const month = date.toLocaleString('en-GB', { month: 'long' });
  return `\n\nSEASONAL CONTEXT: It is currently ${month} in the UK (${season}). Weight all recommendations toward what the gardener should DO NOW and PLANT NOW for their conditions. Include specific timing (e.g. "plant tulip bulbs before ground freezes", "cut back now before new growth"). Do not give advice that was relevant in a different season.`;
}
```
Injected into `buildSystemPrompt()`. Pass `new Date()` from client — don't use server time.

---

### YGW-022 — Seasonal re-engagement email (cron)

**Depends on:** YGW-021 (email capture) ✅ Done — blocker resolved. Next step: set EMAIL_API_KEY secret + verify Resend domain.

**User story:** As a gardener who saved their plan, I want a personalised seasonal update when my garden needs attention.

```gherkin
Feature: Seasonal re-engagement email

  Scenario: Seasonal email sent at season change
    Given a user has a saved garden profile
    When the UK season changes (March, June, September, December)
    Then they receive an email personalised to their garden:
      - Location, soil, aspect referenced
      - 3 specific actions for this season
      - 1 plant recommendation for right now
      - Link back to their saved plan
    And the email is plain text
    And it includes a one-click unsubscribe

  Scenario: Unsubscribed user receives no further emails
    Given a user has unsubscribed
    Then no further emails are sent
    And preference is stored
```

**Implementation:** Cloudflare Cron `0 8 1 3,6,9,12 *`. `buildSeasonalPrompt()` already in domain.js. Resend API for send. Plain text only — 3 bullet points max.

---

## EPIC F — Retention infrastructure (Phase 2)

| ID | Title | Score | Kano | Status |
|---|---|---|---|---|
| YGW-021 | Email capture + profile save (KV) | 9.0 | B | ✅ Done |
| YGW-023 | Affiliate plant links (nursery CTAs) | 6.5 | P | 📋 Open |
| YGW-026 | Basic bed planner (list-based) | 5.0 | P | 📋 Open |

### YGW-021 — Email capture + profile save

**User story:** As a gardener, I want to save my plan with my email so I can return without re-entering everything.

```gherkin
Feature: Email capture and profile save

  Scenario: User saves profile after receiving plan
    Given a user has received recommendations
    When they enter their email and click "Save my garden"
    Then their profile and result are stored in Cloudflare KV
    And they receive a confirmation email with a retrieval link
    And the link restores their full profile and recommendations

  Scenario: Returning user loads saved profile
    Given a user visits with ?profile={uuid}
    Then their saved plan loads immediately
    And profile pills are shown
    And they can refine or update

  Scenario: Invalid email is rejected client-side
    Given the save form is visible
    When the user enters "notanemail" and clicks save
    Then an inline error is shown without submitting
```

**Implementation notes:**
- KV namespace YGW_PROFILES created and bound 2026-03-20
- Email via Resend (free tier: 100/day) — EMAIL_API_KEY secret not yet set
- UUID: `crypto.randomUUID()` client-side
- UI: form appears below result card, above refine panel

---

### YGW-023 — Affiliate plant links

**User story:** As a gardener with recommendations, I want links to buy the specific cultivars.

```gherkin
Feature: Affiliate plant links

  Scenario: Named cultivar is linked
    Given recommendations include Rosa 'Gertrude Jekyll'
    When the result card renders
    Then the plant name is linked to a UK nursery stocking that cultivar
    And the link opens in a new tab
    And the click is tracked as an affiliate event

  Scenario: Unknown plant renders as plain text
    Given a plant is not in the affiliate lookup
    Then no link is shown
    And the plant name renders as plain text
```

**Implementation:**
- Programmes: Crocus (8%), Sarah Raven (8-10%), Thompson & Morgan (10%), Beth Chatto's Plants
- Curated lookup in domain.js: `AFFILIATE_LINKS` — 50 most-recommended cultivars → affiliate URL
- Feature-flagged off until first partner signed

---

## EPIC G — B2B revenue (Phase 3)

| ID | Title | Score | Kano | Status |
|---|---|---|---|---|
| YGW-027 | Landscaper client plan PDF export | 9.0 | B | ✅ Done |
| YGW-028 | Plant quantity estimator | 8.5 | P | 📋 Open |
| YGW-029 | Designer documentation automation | 6.5 | P | 📋 Open |
| YGW-030 | New-build developer bulk API | 7.5 | D | 📋 Open |
| YGW-031 | Garden centre white-label | 6.0 | P | 📋 Open |

> **YGW-030 re-scored 4.5 → 7.5** (2026-03-20). Jerry's warm network changes the channel economics entirely. 200 plots × £5–15/plot = £1,000–3,000 per development. Not cold outreach. Kano: Delighter for the developer persona (no one offers this today). Decay window ~3 years before competitors notice the segment.

### YGW-027 notes
`landscaper.html` already built. Needs billing (Stripe) + trial gate + PDF print CSS.
`buildLandscaperSystemPrompt()` already in domain.js.

### YGW-030 — New-build developer bulk API

**HDD hypothesis:** H-new — 200 plots × £5-15/plot = £1,000-3,000 per development. Jerry's network is the channel. One pilot partnership validates the segment.

**User story:** As a new-build developer, I want a garden pack per plot (soil, aspect, planting list, maintenance guide) as a buyer value-add.

```gherkin
Feature: Bulk developer API

  Scenario: Bulk plot upload generates packs
    Given a developer provides a spreadsheet of plots with aspect/soil per plot
    When they upload to the bulk API
    Then a garden pack is generated for each plot
    And packs can be downloaded as a ZIP of PDFs

  Scenario: Output is brandable
    Given developer branding is configured
    Then all PDFs include developer logo and contact
```

---

## EPIC I — Garden canvas tool (Phase 2 B2B)

| ID | Title | Score | Kano | Status |
|---|---|---|---|---|
| YGW-039 | Garden canvas MVP (app.html) — boundary + plant placement + seasonal grid | 9.0 | B | ✅ Done |
| YGW-040 | Seasonal date override in canvas — preview garden at any calendar date | 5.5 | P | 📋 Open |
| YGW-041 | Export canvas to PDF — proposal flow for landscapers | 8.5 | B | ✅ Done |
| YGW-042 | Plant library phase 2 — landscaper builds own plant list | 6.0 | P | 📋 Open |
| YGW-043 | Plant quantity estimator in canvas — auto-count from area + spread | 8.5 | P | ✅ Done |
| YGW-044 | Pact contract test for Worker /messages endpoint | 7.0 | B | ✅ Done |
| YGW-045 | Plant growth timeline — canvas shows spread at Now/1yr/3yr/5yr/10yr | 9.0 | D | ✅ Done |
| YGW-047 | Left-hand nav panel on landing page — tool switcher for Ollie demo | 7.0 | B | ✅ Done |
| YGW-049 | 37-element library from plants.json — 6 categories, 7 shapes, seasonal colours | 9.0 | P | ✅ Done |
| YGW-050 | Canvas plant palette — categories collapsed by default, only Trees open | 5.0 | B | ✅ Done |
| YGW-051 | Canvas plant palette — accordion: expanding one category closes others | 5.0 | B | ✅ Done |
| YGW-052 | Layer 1 Archetype Palette — 8 styles, ranked suggestions, avoid list, design sequence guide | 9.0 | D | ✅ Done |
| YGW-053 | Canvas element sizing — lengthMetres for wall/fence/path/rill; rect+ellipse renderer uses both axes | 7.0 | B | ✅ Done |
| YGW-054 | Canvas season toggle — show placed garden in Spring/Summer/Autumn/Winter | 7.5 | D | ✅ Done |
| YGW-055 | Seasonal shade cover — plant foliage spread adjusts per season (bare deciduous in winter) | 6.5 | D | ✅ Done |
| YGW-056 | Save plot — name it, save to localStorage | 9.0 | B | ✅ Done |
| YGW-057 | Load plot — "My saved plots" panel, tap to restore | 9.0 | B | ✅ Done |
| YGW-058 | Overwrite plot — resave changes to existing named plot | 8.5 | B | ✅ Done |
| YGW-059 | Delete plot — remove from saved list | 7.0 | B | ✅ Done |

### YGW-056 — Save plot

```gherkin
Feature: Save canvas plot

  Scenario: User saves a new plot
    Given the canvas has a boundary or placed plants
    When the user clicks "Save plot"
    Then they are prompted to name the plot
    And the plot is saved to localStorage as a named entry
    And a success toast confirms the save
    And the toolbar shows the current plot name

  Scenario: User overwrites an existing plot
    Given a named plot is currently loaded
    When the user clicks "Update plot"
    Then the existing plot is overwritten with the current state
    And a toast confirms the update
```

### YGW-057 — Load plot

```gherkin
Feature: Load saved plot

  Scenario: User opens the plots panel
    Given at least one plot is saved
    When the user clicks "My plots"
    Then a panel lists all saved plots with name and date
    And each has a "Load" button

  Scenario: User loads a saved plot
    When the user clicks Load on a saved plot
    Then the canvas state is restored to that plot
    And the toolbar shows the loaded plot name
    And the panel closes
```

### YGW-058 — Overwrite saved plot

```gherkin
Feature: Overwrite saved plot

  Scenario: User resaves changes to loaded plot
    Given a plot named "Front garden" is loaded
    And the user has made changes
    When they click "Update plot"
    Then the saved plot is updated with the new state
    And the updatedAt timestamp is refreshed
```

---

## EPIC J — Build session 2026-03-20

| ID | Title | Score | Kano | Status |
|---|---|---|---|---|
| YGW-BL-011 | Wire canvas to plants.json — replace hardcoded CATEGORIES with fetch on load | 9.0 | B | ✅ Done |
| YGW-BL-012 | Seasonal grid colouring in canvas — ground/minor/major/boundary shift per season | 9.0 | D | ✅ Done |
| YGW-BL-013 | Palette icons — landscape architecture symbols (YGW-UX-001) | 8.0 | P | ✅ Done |
| YGW-BL-014 | Latin name italic typography in palette and proposal output (YGW-UX-003) | 6.0 | P | ✅ Done |
| YGW-BL-015 | Product rename to "The Green Wizard" throughout visible UI (YGW-UX-004) | 6.5 | B | ✅ Done |
| YGW-BL-016 | Landing page full rebuild — 6-section marketing page (YGW-UX-002) | 8.5 | P | ✅ Done |
| YGW-BL-017 | UI/UX quality gate — checklist passes before any merge (YGW-UX-005) | 7.0 | B | ✅ Done |
| YGW-BL-018 | Font consistency audit — unified Playfair Display + DM Sans hierarchy | 6.5 | B | ✅ Done |
| YGW-BL-019 | "Free Plant Advisor" heading prominence — larger, bolder, more visual weight | 7.0 | P | ✅ Done |
| YGW-BL-020 | Review index.html section ordering — most compelling content highest; reduce scroll-to-value | 7.5 | P | ✅ Done |
| YGW-BL-021 | Expand plot design element range — 37→53 elements across 8 categories | 8.0 | P | ✅ Done |
| YGW-BL-022 | Banner nav links → gold-and-green pill buttons to match Green Wizard logo | 8.0 | P | ✅ Done |
| YGW-BL-023 | Canvas default mode Select not Draw — users need to pan/zoom before drawing boundary | 6.0 | B | ✅ Done |
| YGW-BL-024 | Mobile pinch-to-zoom — add touch-action:none + pinch handlers | 7.0 | B | ✅ Done |
| YGW-BL-025 | Palette category reorganisation — Hard Landscaping / Buildings / Garden Features; Shrubs & Climbers | 6.5 | P | ✅ Done |
| YGW-BL-026 | Custom plant search — type any name, placed as generic element with spread/colour; persists in localStorage | 7.5 | P | ✅ Done |
| YGW-BL-027 | "Place Plants" → "Place element" toolbar label | 5.0 | B | ✅ Done |
| YGW-BL-028 | Font consistency audit — Playfair Display weights across app.html + landscaper.html; fix faux-bold | 6.5 | B | ✅ Done |
| YGW-BL-029 | Quantity guide grouped by category, accordion mirroring left panel — syncCategory drives both | 6.0 | P | ✅ Done |
| YGW-BL-030 | Mobile canvas: both side panels as slide-out drawers — canvas full width, 🌿/ℹ️ toolbar buttons open each | 7.5 | B | ✅ Done |
| YGW-BL-031 | Email capture for landscaper.html — save client plan to KV; ?plan=uuid loads saved proposal | 7.5 | P | ✅ Done |
| YGW-UX-005 | Logo — The Green Wizard mark on index.html homepage | 6.0 | P | 📋 Open |

---

## EPIC K — Strategic depth (from 2026-03-20 strategy review)

*New items identified in strategy session. All to be scored and spec'd before build.*

| ID | Title | Score | Kano | Status |
|---|---|---|---|---|
| YGW-060 | Growth horizon selector — user sets "I want it to look mature in 2yr / 5yr / 10yr"; AI adjusts species selection, spacing, and initial-planting density accordingly | 9.5 | D | ✅ Done |
| YGW-061 | "Fix my garden" mode — wizard variant for existing gardens; user describes what's there, AI advises what to keep, remove, add, and improve | 9.0 | D | ✅ Done |
| YGW-062 | Photo-based existing plant scan — upload photo of garden; AI identifies existing plants; feeds into Fix My Garden mode or standalone advice | 8.5 | D | ✅ Done |
| YGW-063 | RHS plant database integration — live cultivar data, hardiness ratings, RHS Award of Garden Merit flags in recommendations | 9.5 | P | 💡 Idea |
| YGW-064 | Stripe billing + trial gate for landscaper.html — 7-day free trial, then £30–100/mo; Stripe Checkout | 10.0 | B | 📋 Open |
| YGW-065 | Kano decay review — scheduled phase-gate item: review all D-classified features for category migration; update backlog accordingly | 5.0 | B | 📋 Open |

### YGW-060 — Growth horizon selector

**Kano:** Delighter. Decay window ~2 years. No gardening tool currently does this.

**HDD hypothesis:** H7 — users who engage with growth horizon show higher completion and lower bounce than users who do not.

**User story:** As a gardener planning a new border, I want to specify whether I want it to look full in 2 years (faster-growing, more temporary plants) or 10 years (slower-growing, permanent structure), so that my recommendations match my timeline.

```gherkin
Feature: Growth horizon selector

  Scenario: User selects 2-year horizon
    Given the profile wizard is on the goals step
    When the user selects "I want it to look good quickly (2 years)"
    Then buildSystemPrompt() includes a growth horizon fragment
    And recommendations prioritise fast-establishing species and ground cover
    And longer-lived slow species are noted as future additions

  Scenario: User selects 10-year horizon
    When the user selects "I'm planting for the long term (10+ years)"
    Then recommendations prioritise structural planting, specimen trees, slow-maturing shrubs
    And short-lived fillers are flagged as temporary

  Scenario: buildGrowthHorizonContext() returns correct fragment
    Given a horizon value of '2yr' | '5yr' | '10yr'
    When buildGrowthHorizonContext(horizon) is called
    Then it returns a prompt fragment appropriate to that horizon
```

**Implementation notes:**
- New step 5 in profile wizard (or additional question within goals step)
- `buildGrowthHorizonContext(horizon)` exported from domain.js, injected into buildSystemPrompt()
- Three values: `2yr` | `5yr` | `10yr` (maps to "quick win" / "medium" / "legacy")
- Pairs naturally with canvas growth timeline (YGW-045) — same mental model

---

### YGW-061 — "Fix my garden" mode

**Kano:** Delighter. Larger addressable market than plan-from-scratch — most gardens already exist.

**HDD hypothesis:** H8 — "fix my garden" entry point converts users who would not complete the standard wizard (existing garden owners with specific problems).

**User story:** As a homeowner with an overgrown or failing garden, I want to describe what's there and get advice on what to keep, remove, and add — without having to pretend I'm starting from scratch.

```gherkin
Feature: Fix my garden mode

  Scenario: User enters fix-my-garden flow
    Given a user lands on the home page
    When they click "Fix my existing garden" instead of "Plan a new garden"
    Then the wizard adapts to ask about existing plants and problems
    And the AI response addresses what to do with existing planting, not just new additions

  Scenario: Fix mode produces different AI framing
    Given a user has described their existing garden state
    When recommendations are generated
    Then the output is structured as: Keep / Remove / Add / Timing
    And existing plants are acknowledged by name where provided
```

**Implementation notes:**
- Mode flag: `wizardMode: 'new' | 'fix'` passed to buildSystemPrompt()
- `buildFixModeContext(existingPlants, problems)` in domain.js
- Landing page CTA split: "Plan a new garden" | "Fix my existing garden"
- Potential to combine with YGW-062 (photo scan feeds into fix mode)

---

### YGW-062 — Photo-based existing plant scan

**Kano:** Delighter. Decay window ~18 months (plant ID apps proliferate but none are garden-context-aware).

**Depends on:** YGW-061 (Fix my garden mode) — most natural entry point, but can also work standalone.

**User story:** As a gardener who doesn't know the names of what's in their garden, I want to upload a photo and have the app identify existing plants so I can get relevant advice.

```gherkin
Feature: Photo-based plant identification

  Scenario: User uploads garden photo
    Given the user is in fix-my-garden mode or standalone
    When they upload a photo of their garden
    Then the AI identifies visible plants with confidence levels
    And identified plants are pre-populated into the existing-plants field
    And the user can confirm, edit, or remove identifications

  Scenario: Unidentifiable plant is handled gracefully
    Given a photo with an unclear or unusual plant
    When identification runs
    Then a "couldn't identify this one — can you describe it?" prompt appears
    And the user can type a description instead
```

**Implementation notes:**
- Image passed to Claude vision API via Worker
- Returns structured list: `[{ commonName, latinName, confidence, action }]`
- Confidence threshold: only pre-populate if >70%; show as "possibly X?" below threshold
- Supersedes YGW-032 (Photo-based plant ID) — YGW-032 retired in favour of this fuller spec

---

### YGW-063 — RHS plant database integration

**Kano:** Performance. Direct lift to recommendation quality. AGM (Award of Garden Merit) flag adds instant credibility with UK gardening audience.

**User story:** As a gardener receiving recommendations, I want to see RHS hardiness ratings and Award of Garden Merit status so I know the plants are proven for UK conditions.

**Implementation notes:**
- RHS API or static data extract (RHS licensing terms need checking)
- AGM flag displayed as small gold badge next to plant name in recommendations
- Hardiness rating shown as H1–H7 tooltip
- Falls back gracefully if data unavailable for a cultivar

---

### YGW-064 — Stripe billing + trial gate for landscaper.html

**Kano:** Basic for the B2B revenue hypothesis. Without this, H5 (landscapers pay £30–100/mo) cannot be validated.

**User story:** As a landscaper, I want to try the tool free for 7 days then pay a monthly subscription so I can use it with clients.

```gherkin
Feature: Landscaper billing

  Scenario: New landscaper starts trial
    Given a landscaper visits landscaper.html
    When they click "Start free trial"
    Then they are redirected to Stripe Checkout
    And on completion they receive a 7-day trial access token
    And the token is stored in Cloudflare KV

  Scenario: Trial expires
    Given a landscaper's trial has expired
    When they load landscaper.html
    Then they are shown a paywall with upgrade prompt
    And existing saved plans are preserved pending upgrade

  Scenario: Active subscriber accesses tool
    Given a valid subscription token
    When landscaper.html loads
    Then full tool access is granted with no paywall
```

**Implementation notes:**
- Stripe Checkout for subscription creation
- Worker validates token on each landscaper.html load
- Three tiers to test: £29/mo (solo), £59/mo (small practice), £99/mo (team)
- Trial gate is the HDD instrument for H5

---

### YGW-065 — Kano decay review (phase gate item)

**Kano:** Basic process hygiene. Not a feature — a scheduled governance step.

At each phase gate, review all items currently classified **D (Delighter)** and assess whether user behaviour or competitor activity suggests category migration. Reclassify if migrated. Adjust strategy accordingly.

Current Delighters to monitor at next phase gate (Phase 3 entry):
- YGW-018 Shareable image card — ~1yr window
- YGW-045 Growth timeline — ~2yr window
- YGW-060 Growth horizon selector — ~2yr window
- YGW-061 Fix my garden mode — ~2yr window
- YGW-030 New-build developer bulk API — ~3yr window

---

## EPIC L — Plant Palette Generator + Designer Mode (2026-03-20)

| ID | Title | Score | Kano | Status |
|---|---|---|---|---|
| YGW-066 | Plant Palette Generator — landscaper brief → full palette with designer notes + client copy | 10.0 | B | 📋 Open |
| YGW-067 | Standalone vs integrated — plant palette as separate page or embedded in main flow? | — | — | 💡 Open question |
| YGW-068 | White-label output — landscaper logo/branding on palette output, not YGW | 7.0 | P | 💡 Open question |
| YGW-069 | Cost-per-plant — include approximate cost or remove to avoid client expectation problems? | — | — | 💡 Open question |
| YGW-070 | Designer Mode (Oz) — Oz uses YGW IP for his own design work; separate mode, not a product line | 8.0 | D | 📋 Open |

> **YGW-066** is the core instrument for HDD-001. Branch does not merge to main until YGW-066-AC-007 (Ollie test) passes.
> **YGW-067–069** are open design questions — answer before building YGW-066.
> **YGW-070** Designer Mode: Oz's working tool. Not a separate product line. Oz is a co-founder using the tool — different scope from B2B Designers (YGW-029).

---

### YGW-066 — Plant Palette Generator

**Epic:** L — Plant Palette Generator + Designer Mode
**Branch:** `feature/ygw-plant-palette`
**Merge gate:** YGW-066-AC-007 (Ollie test) — branch does not touch main until he has run a real brief.
**HDD hypothesis:** HDD-001 — landscapers will pay if output quality passes the Ollie test.

**User story:** As a landscaper, I want to enter a client site brief and receive a full plant palette with designer notes and client-ready copy, so I can use it directly in a proposal.

```gherkin
Feature: Plant Palette Generator

  # YGW-066-AC-001 — Brief capture

  Scenario: Landscaper submits a valid site brief
    Given I am on the plant palette generator page
    When I select an aspect, soil type, region, and style
    And I click "Generate Plant Palette"
    Then a palette is generated without error
    And the result contains the number of plants I requested
    And we will have learned whether the brief fields are sufficient
      to produce relevant output without a free-text prompt

  # YGW-066-AC-002 — Incomplete brief validation

  Scenario: Landscaper submits an incomplete brief
    Given I am on the plant palette generator page
    When I click "Generate Plant Palette" without selecting aspect, soil, region, or style
    Then I see a clear error message asking me to complete the required fields
    And no API call is made

  # YGW-066-AC-003 — Plant card output

  Scenario: Each generated plant card contains actionable information
    Given a palette has been successfully generated
    Then each plant card displays:
      | Field           | Required |
      | Common name     | yes      |
      | Latin name      | yes      |
      | Light tag       | yes      |
      | Water tag       | yes      |
      | Height          | yes      |
      | Spread          | yes      |
      | Season interest | yes      |
      | Description     | yes      |
      | Approx cost     | yes      |
    And we will have learned whether cost and size data
      is accurate enough for a landscaper to use in a quote

  # YGW-066-AC-004 — Designer notes

  Scenario: Generated palette includes practical planting guidance
    Given a palette has been successfully generated
    Then a "Designer notes" section is displayed
    And it contains between 3 and 5 practical tips
    And the tips are specific to the brief submitted (not generic)
    And we will have learned whether AI-generated notes
      add value or create noise for a professional landscaper

  # YGW-066-AC-005 — Client-ready description

  Scenario: Output includes copy a landscaper can paste directly into a proposal
    Given a palette has been successfully generated
    Then a "Client-ready description" section is displayed
    And the text contains no Latin plant names
    And the text contains no horticultural jargon
    And the text describes the finished border across seasons
    And we will have learned whether this copy passes
      the Ollie test for client-presentability

  # YGW-066-AC-006 — Copy for proposal

  Scenario: Landscaper copies the full palette for use in a document
    Given a palette has been successfully generated
    When I click "Copy for proposal"
    Then the full palette text is copied to clipboard
    And the button confirms the copy action
    And the copied text includes plant names, details,
      designer notes, and client description in readable format

  # YGW-066-AC-007 — Ollie test (quality gate — BLOCKS MERGE TO MAIN)

  Scenario: Output meets professional landscaper standard
    Given Ollie has received a real or realistic client brief
    When he runs that brief through the plant palette generator
    Then he judges the plant selection as appropriate for the site conditions
    And he judges the client description as suitable to show a client
    And he judges the cost estimates as plausible
    And we will have learned whether AI output quality
      is sufficient to support the landscaper go-to-market hypothesis (HDD-001)

  Scenario: Output fails Ollie test
    Given Ollie has run a brief through the generator
    When he identifies specific failures in plant selection, copy, or costs
    Then those failures are logged as named defects against YGW-066
    And the branch is not merged until defects are resolved
    And we will have learned what the quality gap is
      and whether it is addressable without a model change
```

---

## EPIC M — Viral & growth features (2026-03-20 pivot session)

*Items identified in strategy pivot session with Claude.ai. Scored and ready for Gherkin before build.*
*Discussion priority queue (this session): YGW-072 → YGW-073 → YGW-074 → YGW-004 → YGW-071*

| ID | Title | Score | Kano | Engine | Persona | Status |
|---|---|---|---|---|---|---|
| YGW-071 | Quick quote helper — landscaper enters site dimensions + palette; tool outputs materials list + estimated cost range | 8.5 | P | Sticky | Landscaper | 📋 Open |
| YGW-072 | Shareable before/after photo framing — user uploads before photo; AI overlays annotated plan vision; optimised for social | 7.5 | D | Viral | Amateur | 💡 Idea |
| YGW-073 | Seasonal reveal card — animated/static card showing garden across 4 seasons; timed for seasonal posting | 7.0 | D | Viral | Amateur | 💡 Idea |
| YGW-074 | "Powered by The Green Wizard" footer in landscaper PDF — one line in proposal template closes B2C viral loop | 9.0 | P | Viral+Sticky | Landscaper | ✅ Done |

> **YGW-074 note:** Highest leverage / lowest effort in the viral column. Every PDF Ollie sends to a client is an acquisition touchpoint. One line of text in the proposal template. No code change needed beyond the PDF CSS/template.
> **YGW-071 note:** Serves the sticky engine directly for the Landscaper persona. Pairs with YGW-066 (Plant Palette Generator) — same workflow, next step.
> **YGW-072 / YGW-073 note:** Both are Delighters for the viral engine. Prerequisite: the current MVP output must be visually impressive enough that someone would want to share it. Validate output quality via YGW-066-AC-007 (Ollie test) before building viral mechanics around it.

### Discussion priority queue — logged 2026-03-20
Order confirmed by Rod for next discussion session:
1. **YGW-072** — Shareable before/after photo framing (viral, amateur) ← maps to session YGW-007
2. **YGW-073** — Seasonal reveal card (viral, amateur) ← maps to session YGW-008
3. **YGW-074** — Powered by YGW footer (viral B2C loop) ← maps to session YGW-010
4. **YGW-004** — Fake-door revenue test (existing ✅, check the data) ← maps to session YGW-016
5. **YGW-071** — Quick quote helper (sticky, landscaper) ← maps to session YGW-005

*Note: Session's YGW-006 (shareable plan card) = our YGW-018 ✅ Done. Session's YGW-001 (Ollie gate) = YGW-066-AC-007. Session's YGW-011 (Designer Mode) = YGW-070 ⏸ Parked.*

---

## EPIC H — Phase 4+ ideas

| ID | Title | Score | Kano | Status |
|---|---|---|---|---|
| YGW-033 | 2D spatial bed planner | 8.0 | D | 💡 Idea |
| YGW-034 | Garden-in-a-box fulfilment | 7.0 | D | 💡 Idea |
| YGW-035 | RHS plant database integration | 9.5 | P | 💡 Idea — promoted to YGW-063 for spec |
| YGW-036 | Social/community garden sharing | 6.5 | D | 💡 Idea |
| YGW-037 | Therapeutic horticulture module | 4.0 | P | 💡 Idea |
| YGW-038 | School gardens module | 4.0 | P | 💡 Idea |

> YGW-032 (Photo-based plant ID) retired — superseded by fuller spec at YGW-062.

---

## EPIC N — Collector Mode (2026-03-20)

*Distinct persona from landscaper. Skilled amateur / collector: rarity, drama, combos, talking-point plants. Not conditions-driven. Wants to be surprised and educated simultaneously. Different voice, different prompts, different entry point from EPIC L.*

| ID | Title | Score | Kano | Engine | Persona | Status |
|---|---|---|---|---|---|---|
| YGW-075 | Combo Explorer — click a plant, get AI-rated combo options (RAG + star pairing) with opinionated rationale | 8.0 | D | Sticky | Collector | ✅ Built — hold merge until HDD-001 validated |

> **YGW-075 note:** Interaction model and prompt architecture fully designed (.claude/combo-explorer-design.md). Prototype built in Claude.ai session (hardcoded data). Needs: Worker endpoint `/combo-explorer`, AI-generated ratings, integration with Plant Palette output. Do NOT build Worker endpoint until HDD-001 (Ollie test) returns a result. Collector persona not yet validated as a growth segment.

### YGW-075 — Combo Explorer

**Epic:** N — Collector Mode
**Design doc:** `.claude/combo-explorer-design.md`
**Depends on:** YGW-066 validated (HDD-001)
**HDD connection:** HDD-002 (not yet written) — do skilled amateurs pay for combo intelligence?

**User story:** As a skilled amateur gardener, I want to click a plant in my palette and see which plants combine well with it — ranked by how exciting and compatible the pairing is — so I can make confident, interesting choices rather than just safe ones.

**Key design decisions (from Claude.ai prototype session):**
- Star pairing is opinionated (most exciting + compatible), not just safest. Exactly one per plant.
- Card sort: Star → Green → Amber → Red. Order carries meaning before click.
- Separate Worker endpoint (`/combo-explorer`) — different output schema and register from Plant Palette.
- Collector voice: specific, opinionated, willing to say "this is the one." Not client-safe.
- Entry point: Option A recommended — run Plant Palette first, then "Explore combos" on result.

**Open questions (resolve before building):**
1. Entry point confirmed? (Option A = post-palette, Option B = own flow, Option C = curated sets)
2. Should red cards be shown? (Educational value vs UI clutter)
3. Collector mode vs landscaper mode — same product or separate landing?

**Gherkin:** Not yet written. Write when HDD-001 validated and collector persona confirmed as growth segment.

---

## Priority queue — next to build

**Engine of Growth: Sticky primary, B2B2C referral tail (ADR-010, 2026-03-20)**
Landscaper features come before pure-Viral consumer features until HDD-001 is validated.
YGW-066-AC-007 (Ollie test) blocks merge of all landscaper column items to main.
CD3 v8 re-scored 2026-03-20 after YGW-061, YGW-062, YGW-046, YGW-075, YGW-BL-020 built this session.

| Rank | ID | Title | CD3 Score | Engine | Blocker |
|---|---|---|---|---|---|
| — | YGW-066 | Plant Palette Generator | — | Sticky | ✅ Built — awaiting Ollie test to merge |
| — | YGW-071 | Quick Quote Helper | — | Sticky | ✅ Built — awaiting Ollie test to merge |
| — | YGW-075 | Combo Explorer | — | Sticky | ✅ Built — hold until HDD-001 validated |
| 1 | **YGW-064** | Stripe billing + trial gate (landscaper) | **11.0** | Paid | Rod: Stripe account |
| 2 | YGW-022 | Seasonal re-engagement email | 7.0 | Sticky | Rod: RESEND_API_KEY |
| 3 | YGW-070 | Designer Mode (Oz) | 5.0 | Sticky | Oz availability |
| 4 | YGW-025 | Year-round interest planner | 3.5 | Sticky | None |

> **Unblocked queue is thin.** Only YGW-025 (3.5) is immediately buildable. Top 3 all have external blockers.
> **Option to raise:** Landscaper onboarding flow — design fully spec'd in `.claude/onboarding-design.md`, no blocker, estimated ~6.5 CD3. Raise as new item before next build session.
> **YGW-064** scores highest (11.0) — Rod action: set up Stripe account to unblock.
> **YGW-072 and YGW-073:** Viral features held until YGW-066-AC-007 (Ollie test) passes.
> **CD3 formula:** (Customer value + Dependencies − Complexity) + (SWOT × 1.5)

---

## HDD hypotheses × backlog mapping

| Hypothesis | Items | Validation target |
|---|---|---|
| H1 — profile completion + sharing | YGW-001,002,003,018 | 60% completion, 5% share |
| H2 — willingness to pay £9.99 | YGW-004 | 5% fake-door click |
| H3 — refinement increases engagement | YGW-006-011,015-017 | 25% open refine panel |
| H4 — seasonal retention | YGW-019,020,021,022 | 20% return within 30 days |
| H5 — landscapers pay £30-100/mo | YGW-027,028,064 | 15% trial-to-paid |
| H6 — designers pay £50-150/mo | YGW-029 | 80% 90-day retention |
| H7 — growth horizon increases completion | YGW-060 | Higher completion vs control; lower bounce |
| H8 — fix-my-garden converts different segment | YGW-061,062 | 20% of new users choose fix mode; 60% complete |
| H-new — developer bulk API | YGW-030 | 1 pilot partnership |
| HDD-001 — landscapers pay if quality passes Ollie test | YGW-066 | Ollie runs real brief; judges plant selection, copy, costs as client-ready |

---

## EPIC O — Spatial Planning Tools (2026-03-24)

*Polygon-zone canvas tools for garden layout. Separate from plant placement (app.html). B2B2C referral potential — landscapers demo tool to clients.*

| ID | Title | Score | Kano | Engine | Persona | Status |
|---|---|---|---|---|---|---|
| YGW-076 | Sub-Plot Designer — draw polygon zones, assign garden objects (lawn/patio/gravel/etc.), fill with texture patterns | 8.0 | D | Sticky+Viral | Landscaper | ✅ Done |
| YGW-077 | Drawing UX controls — Escape/Cancel button to abandon in-progress boundary draw; undo last vertex; clear all; keyboard + mobile-visible | 8.5 | B | Sticky | Landscaper | 📋 Open |
| YGW-078 | Straight-line drawing aids — Shift-constrain (0°/90°/45°), rectangle quick-draw, grid snap toggle | 7.5 | P | Sticky | Landscaper | 📋 Open |
| YGW-079 | Zone auto-fill on confirm — when zone is named and saved, auto-apply selected zone object; stay in Draw mode for immediate next-zone flow | 8.0 | B | Sticky | Landscaper | ✅ Done |

> **YGW-076:** Zones view integrated into app.html as third view mode (ADR-014, supersedes ADR-011). British Racing Green standalone still at `/features/subplot-designer/`. Touch support included.

> **YGW-077:** Gaps identified during Rod's personal testing (2026-03-24). Escape key not wired. No "cancel mid-draw" distinct from "clear everything". Undo-last-vertex exists (↩ button) but not keyboard-accessible and invisible on mobile during draw. Needs: Escape key handler; visible Cancel button during draw mode; Undo vertex button contextually labelled; clear-all confirmation. All must work on mobile/tablet without keyboard.

> **YGW-078:** Shift-constrain is highest-payoff lowest-effort — hold Shift during draw, rubber-band snaps to nearest 0°/45°/90° from previous vertex. Rectangle quick-draw (drag to define 4 corners) covers ~70% of UK residential plot shapes. Grid snap toggle. Identified alongside YGW-077 in same testing session.

> **YGW-079:** If a zone object is selected before drawing, confirming the zone name auto-applies the fill immediately and stays in Draw mode — user can draw the next zone without any mode-switching. If no object is selected, zone is added unfilled (status quo). Toast confirms fill applied. Rod identified during sub-plot workflow review 2026-03-24.

---

*Document ref: ygw-backlog-v8-2026-03-24 · YGW-077/078 added · 3yr timeline default · Zones view (YGW-076) integrated into app.html (ADR-014) · EPIC O added: YGW-076 Sub-Plot Designer · ADR-011/ADR-012/ADR-013 written · Mobile FAB fix on main · feature/tgw-landscaper-tools merged to main (ADR-013) · YGW-066 Plant Palette + YGW-071 Quick Quote now on main · CD3 v8: YGW-061, YGW-062, YGW-046, YGW-075 (built/held) · EPIC N: YGW-075 Combo Explorer (hold HDD-001) · EPIC M: YGW-071–074 · EPIC L: YGW-066–070 · LeanSpirited*
