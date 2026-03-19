# Companion Planting
# Tier: 1
# Domain: Recommendation context → CompanionPair
# Version: 1.0
# Last reviewed: 2026-03-19
# Reviewed by: LeanSpirited (sources: RHS, Joy Larkcom, Bob Flowerdew, HDRA)

## Purpose
Good and bad plant neighbours in UK gardens — ornamental and edible.
Mechanisms explained (not just "plant these together") so the AI can
give meaningful reasons rather than folk-wisdom assertions.
Used when companion-planting or avoid-combinations extras are selected.

## Prompt injection note
Injected by `buildExtrasClause(['companion-planting'])` and
`buildExtrasClause(['avoid-combinations'])`. Inject the relevant
sections based on active selection.

---

## Why companion planting works — the mechanisms

Understanding the mechanism lets the AI give specific, useful reasons:

1. **Pest deterrence** — strong-scented plants confuse or repel pests
   (e.g. Alliums confuse carrot fly by masking the smell of carrots)
2. **Pest habitat disruption** — dense ground cover prevents pest access
3. **Predator attraction** — flat-headed flowers attract hoverflies and
   parasitic wasps that predate aphids and caterpillars
4. **Pollinator attraction** — boosts fruit set on vegetables and fruit
5. **Nitrogen fixation** — legume root nodules fix atmospheric nitrogen
   (benefit to neighbours via root breakdown or mulching)
6. **Allelopathy** — some plants release chemicals that inhibit neighbours
   (negative — but also used to suppress weeds)
7. **Physical structure** — tall plants provide shade or support for others
8. **Trap cropping** — sacrifice plants that attract pests away from crops

---

## Reliable companion plant pairs — ornamental

### Rosa (roses) + Lavandula (lavender)
**Why it works:** Lavender's strong scent confuses aphid-seeking pests.
The grey-silver foliage provides year-round structure after lavender flowers.
Classic cottage garden pairing — visually and practically complementary.
**Mechanism:** Pest deterrence (scent masking)

### Rosa + Allium
**Why it works:** Allium bulbs planted beneath roses deter aphids and
blackfly. Structural vertical interest contrasts with rose's spreading habit.
Alliums flower just as roses begin their first flush.
**Mechanism:** Pest deterrence

### Rosa + Geranium (cranesbill)
**Why it works:** Hardy geraniums suppress weeds around rose bases, retain
moisture, and attract predatory insects. The purple-pink flowers of Geranium
'Rozanne' complement rose foliage beautifully.
**Mechanism:** Weed suppression, predator habitat

### Achillea + Echinacea
**Why it works:** Both are long-season perennials with flat-headed flowers
that attract predatory insects. Different bloom times extend the predator
habitat season. Both drought-tolerant; neither outcompetes the other.
**Mechanism:** Predator/pollinator attraction

### Nepeta (catmint) + most perennials
**Why it works:** Long-flowering, low maintenance, attracts bees and
beneficial insects throughout the season. Natural weed suppressor as
ground cover. Pairs well with roses, alliums, salvias.
**Mechanism:** Pollinator attraction, weed suppression

### Salvia + Penstemon
**Why it works:** Both are Mediterranean-origin, preferring similar
free-draining conditions. Together they extend the late-summer season.
Both attract bumblebees and long-tongued pollinators.
**Mechanism:** Ecological niche sharing, pollinator attraction

### Verbena bonariensis + ornamental grasses
**Why it works:** V. bonariensis grows through grass clumps without
competing, creating a "transparent" layer of purple above the grass.
The grasses provide winter structure after verbena dies back.
**Mechanism:** Structural complementarity, non-competitive

---

## Reliable companion plant pairs — edible/kitchen garden

### Tomato + Basil
**Why it works:** Classic pairing. Basil deters aphids and spider mites;
some evidence that volatile oils improve tomato flavour. Both prefer warm,
sheltered conditions. Basil bolts if shaded by tomatoes — plant beside, not under.
**Mechanism:** Pest deterrence, volatile oil interaction

### Tomato + Tagetes (French marigold)
**Why it works:** Strongest evidence-based companion planting result.
Tagetes patula exudes thiophenes from roots that suppress nematodes in soil.
Also deters whitefly. Grow around the base of tomato plants.
**Mechanism:** Root exudate — nematode suppression, pest deterrence

### Carrot + Allium (onion, leek, chives)
**Why it works:** The strong onion scent masks carrot smell from carrot fly.
Classic intercropping — alternate rows. Works best when planted so both
crops grow through the same period (chives and carrots work well).
**Mechanism:** Pest deterrence (scent masking)

### Brassica + Nasturtium (Tropaeolum)
**Why it works:** Nasturtiums are excellent trap crops — aphids prefer them
to brassicas. Grow at the end of beds to attract and concentrate aphids
away from cabbages. Also attract predatory insects.
**Mechanism:** Trap cropping, predator attraction

### Brassica + Alliums
**Why it works:** Alliums deter cabbage white butterfly — the smell confuses
the butterfly when laying eggs. Also helps against aphids.
**Mechanism:** Pest deterrence (scent masking)

### Legumes + almost everything
**Why it works:** Beans and peas fix nitrogen through root nodules.
When plants die back, incorporate into soil or use as mulch — this
releases fixed nitrogen for subsequent crops. Classic example:
Three Sisters (corn, beans, squash) — beans fix nitrogen, squash suppresses
weeds, corn provides beanpole structure.
**Mechanism:** Nitrogen fixation

### Borage + Strawberry
**Why it works:** Borage attracts pollinators, improving strawberry fruit set.
Also deters tomato hornworm. Traditional combination — grow borage through
the strawberry bed.
**Mechanism:** Pollinator attraction

---

## Bad companions — pairs to AVOID

### Fennel (Foeniculum) + almost everything
**This is the most important bad companion in UK kitchen gardens.**
Fennel is broadly allelopathic — it inhibits the growth of most other
vegetables and herbs. Notable exceptions: dill and fennel are also bad
companions (they cross-pollinate and produce poor flavour offspring).
Keep fennel in its own isolated bed or pot.
**Avoid near:** Tomatoes, peppers, beans, brassicas, most herbs
**Exception:** Fennel is fine in ornamental borders away from vegetables

### Mint + everything (unless contained)
Mint is viciously invasive via underground runners — it will outcompete
most neighbours given time. Should always be grown in a submerged pot
or dedicated bed. The companion "benefit" (deters pests) is outweighed by
the competition damage unless contained.
**Mechanism of harm:** Resource competition via invasive runners

### Allium (onion family) + Legumes (beans, peas)
Onions and garlic inhibit bean and pea growth. Don't intercrop directly
— grow separately or in adjacent beds with a gap.
**Mechanism:** Allelopathy (specific root exudate interaction)

### Brassica + Strawberry (direct competition)
Both are heavy feeders with shallow root systems. Direct competition for
nutrients and moisture reduces yields of both. Keep separate.

### Potatoes + Tomatoes
Both are Solanaceae — same family, same diseases. Growing together
concentrates potato blight (Phytophthora infestans) and blight-susceptible
pests in one location. The diseases transfer between them.
**Mechanism:** Shared disease susceptibility, pathogen concentration

### Sunflower + Potato
Sunflowers produce allelopathic root exudates that inhibit potato growth.
Keep sunflowers away from the potato patch.
**Mechanism:** Allelopathy

### Fennel + Dill (seed contamination)
They cross-pollinate freely, producing inferior seed of both. Keep at
least 1m apart or grow in different areas.
**Mechanism:** Cross-pollination

---

## Planting combinations for ornamental beds

### "Bee-friendly border" combination
Nepeta 'Six Hills Giant' + Salvia nemorosa 'Caradonna' + Verbena bonariensis +
Echinacea purpurea + Allium 'Purple Sensation' (spring) + Agastache 'Black Adder'
Plant in drifts of 3-5. Flowers from May–October.

### "Low maintenance naturalistic" combination
Pennisetum alopecuroides + Echinacea purpurea 'Magnus' + Rudbeckia fulgida
'Goldsturm' + Persicaria amplexicaulis 'Firetail' + Sanguisorba officinalis
Drought-tolerant once established. Leave seed heads for winter interest.

### "Shade combination" for north-facing beds
Astrantia major + Geranium phaeum + Pulmonaria saccharata + Polystichum
setiferum + Brunnera macrophylla 'Jack Frost'
All tolerate shade; none compete aggressively; different seasons of interest.

---

## Sources
- RHS Companion Planting: https://www.rhs.org.uk/advice/profile?PID=522
- Larkcom, J. (2002) *Grow Your Own Vegetables*. Frances Lincoln.
- Flowerdew, B. (2004) *Organic Gardening Bible*. Kyle Cathie.
- HDRA Encyclopedia of Organic Gardening (Henry Doubleday Research Association)
- Thompson, K. et al. (2010) "Do wild bees benefit from companion planting?" *Functional Ecology*

## Changelog
- v1.0 2026-03-19: Initial version
