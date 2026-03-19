# Hazardous Plants — UK Garden Safety
# Tier: 1
# Domain: Garden context → SafetyConstraints / Recommendation context → HazardFlag
# Version: 1.0
# Last reviewed: 2026-03-19
# Reviewed by: LeanSpirited (sources: RHS Toxic Plants, Dogs Trust, Cats Protection, NHS)

## Purpose
Definitive reference for plants that are toxic or hazardous to dogs, cats,
young children, hayfever sufferers, and people with skin sensitivity.
Used to enforce hard exclusions when safety filters are active.
Also used to flag plants that are beautiful but require safety awareness.

## Prompt injection note
Injected by `buildSafetyClause(safety[])` in PromptBuilder.
Only the sections matching active safety constraints are injected.
The function constructs explicit exclusion lists naming specific genera and cultivars.

---

## Dogs — toxic plants to NEVER recommend

### Immediately life-threatening (exclude unconditionally)
- **Taxus spp. (Yew)** — all parts including berries; rapid cardiac failure
- **Laburnum anagyroides** — seeds, bark, leaves; convulsions, death
- **Convallaria majalis (Lily of the Valley)** — all parts; cardiac glycosides
- **Nerium oleander** — all parts; cardiac glycosides; common in mild UK gardens
- **Aconitum spp. (Monkshood/Wolfsbane)** — all parts; one of most toxic UK plants

### Highly toxic (exclude)
- **Narcissus spp. (Daffodils)** — all parts, especially bulbs; vomiting, collapse
- **Tulipa spp. (Tulips)** — bulbs especially; gastrointestinal, CNS effects
- **Rhododendron/Azalea** — all parts; grayanotoxins; vomiting, collapse
- **Digitalis purpurea (Foxglove)** — all parts; cardiac glycosides
- **Solanum spp. (Nightshades)** — unripe berries; solanine toxicity
- **Colchicum autumnale (Autumn crocus)** — all parts; colchicine; highly toxic
- **Cyclamen** — tubers especially; GI irritation, seizures
- **Iris spp.** — rhizomes; GI irritation
- **Euphorbia spp.** — milky sap; GI irritation, eye damage
- **Wisteria** — seeds and pods; lectin toxicity; GI effects
- **Prunus laurocerasus (Cherry laurel)** — leaves; cyanogenic glycosides

### Moderate concern (flag if recommending)
- **Vinca minor/major (Periwinkle)** — alkaloids; GI upset
- **Aquilegia (Columbine)** — all parts; mild toxicity
- **Hedera helix (Ivy)** — berries and leaves; GI irritation
- **Sambucus (Elderberry)** — raw berries and leaves; GI upset (cooked berries fine)
- **Hypericum perforatum** — photosensitisation
- **Alliums (Allium spp.)** — onion family causes haemolytic anaemia in dogs

### Safe for dogs — prominently include these
Rosa spp., Sunflowers (Helianthus), Snapdragons (Antirrhinum), Camellias,
Fuchsia, Magnolia, Pansies/Violas, Michaelmas daisies (Aster), Cornflowers
(Centaurea cyanus), Gaillardia, Impatiens, Petunias, Zinnia

---

## Cats — toxic plants to NEVER recommend

### CRITICAL — Lilies cause fatal kidney failure in cats
This is the single most important safety rule for cat owners.
**All Lilium and Hemerocallis (Day lily) species are FATAL to cats.**
Even small amounts of pollen, water from the vase, or leaf fragments
cause acute kidney failure. There is no safe lily for a cat household.

Exclude unconditionally if cats selected:
- **ALL Lilium spp.** (Easter lily, Tiger lily, Stargazer, etc.)
- **ALL Hemerocallis spp. (Day lilies)**
- **Taxus spp. (Yew)** — as dogs
- **Narcissus spp. (Daffodils)** — as dogs
- **Rhododendron/Azalea** — as dogs
- **Tulipa spp. (Tulips)** — as dogs
- **Digitalis (Foxglove)** — as dogs
- **Colchicum (Autumn crocus)** — as dogs
- **Euphorbia spp.** — sap irritation
- **Cyclamen** — as dogs
- **Convallaria (Lily of the Valley)** — as dogs

### Commonly recommended plants that are SAFE for cats
Rosa spp., Sunflowers, Snapdragons, Petunias, Zinnias, Cornflowers,
Camellias, Magnolia, Fuchsia, Impatiens, most herbs except Mint family
(which causes mild GI upset in large quantities)

---

## Young children — toxic plants to NEVER recommend

Children interact with plants differently from adults — mouthing, crushing berries,
rubbing eyes after handling. Risk assessment is based on accessibility and
appeal as well as toxicity.

### Immediately dangerous — exclude unconditionally
- **Taxus (Yew)** — berries look appealing; very fast-acting; EXCLUDE
- **Laburnum** — seeds in pods resemble peas; highly toxic; EXCLUDE
- **Aconitum (Monkshood)** — handling can cause tingling/absorption; EXCLUDE
- **Digitalis (Foxglove)** — attractive bell flowers; all parts toxic; EXCLUDE
- **Colchicum (Autumn crocus)** — looks like crocus; EXCLUDE
- **Solanum (Nightshades)** — berries appealing to children; EXCLUDE
- **Atropa belladonna (Deadly nightshade)** — rarely in gardens but flag if present

### Toxic berries that look edible — flag clearly
- **Cotoneaster** — small red berries; mildly toxic; flag but don't exclude
- **Pyracantha (Firethorn)** — berries mildly toxic in quantity; flag
- **Ligustrum (Privet)** — black berries; toxic; flag
- **Symphoricarpos (Snowberry)** — white berries; GI upset; flag

### Skin and sap hazards for children
- **Euphorbia spp.** — caustic white sap; severe skin/eye irritation; EXCLUDE
- **Heracleum mantegazzianum (Giant Hogweed)** — severe phototoxic burns; EXCLUDE
- **Dictamnus albus (Burning Bush)** — volatile oils; burns in sun; flag
- **Ruta graveolens (Rue)** — severe phototoxic dermatitis; EXCLUDE in child gardens
- **Primula obconica** — contact dermatitis; flag

### Completely safe and recommended for family gardens
Sunflowers, Nasturtiums, Lavender, Rosemary, Sweet peas (seeds toxic — flag),
Marigolds (Calendula/Tagetes), Cosmos, Nigella, Strawberries,
Cherry tomatoes (fruit safe, leaves/stems less so — flag)

---

## Hayfever and pollen allergies

### High-allergen plants to avoid
- **Betula (Birch)** — major UK hayfever trigger; fine windborne pollen
- **Corylus (Hazel)** — very early season; major trigger
- **Alnus (Alder)** — early spring pollen
- **Acer (Maples)** — some species high pollen
- **Fraxinus (Ash)** — major windborne pollen
- **Plantago (Plantain)** — common lawn weed; major allergen
- **Urtica (Nettles)** — windborne pollen allergen
- **Grasses in flower** — highest UK pollen season June–July; avoid including grass mixes for hayfever sufferers

### Low-allergen alternatives to recommend
Insect-pollinated flowers are generally safe — the pollen is heavy and sticky,
not windborne:
- All roses (Rosa spp.) — low allergen
- Lavender — low allergen, beneficial for bees
- Geraniums/Pelargoniums — low allergen
- Impatiens — insect pollinated
- Fuchsia — insect pollinated
- Most Salvia spp. — insect pollinated
- Snapdragons (Antirrhinum) — insect pollinated
- Penstemon — insect pollinated

---

## Skin irritants

### Exclude unconditionally for skin-sensitive users
- **Euphorbia spp.** — caustic milky sap; eye damage risk
- **Heracleum mantegazzianum (Giant Hogweed)** — phototoxic; hospital treatment
- **Ruta graveolens (Rue)** — phototoxic blistering
- **Dictamnus albus** — volatile oils; burns on hot days
- **Primula obconica** — widespread contact dermatitis

### Flag but do not exclude (use with care)
- **Clematis** — sap mildly irritant; wash hands after pruning
- **Hellebores** — sap irritant; use gloves when dividing
- **Chrysanthemum/Leucanthemum** — can cause contact dermatitis in sensitive individuals

---

## Bee-friendly — prioritise these when selected

### Top-rated RHS Plants for Pollinators
**Shrubs:** Lavandula, Buddleja (flag invasive tendency), Ceanothus,
Salvia officinalis, Rosmarinus, Cotoneaster, Pyracantha

**Perennials:** Echinacea, Allium, Nepeta, Agastache, Penstemon,
Erysimum, Scabiosa, Knautia, Verbena bonariensis, Veronicastrum,
Sanguisorba, Astrantia, Geranium (cranesbill)

**Annuals/Biennials:** Calendula, Phacelia, Borago (borage),
Centaurea cyanus (cornflower), Nigella, Cosmos

**Trees/Climbers:** Malus (apple), Prunus (cherry), Lonicera (honeysuckle)

**Note on double flowers:** Many double-flowered cultivars (e.g. double
Begonias, fully double roses) have inaccessible nectar/pollen. Prefer
single or semi-double forms when bee-friendliness is the goal.

---

## Sources
- RHS Advisory: https://www.rhs.org.uk/prevention-protection/plants-toxic-to-animals
- Dogs Trust: https://www.dogstrust.org.uk/help-advice/factsheets-downloads/plants.pdf
- Cats Protection: https://www.cats.org.uk/cats/article/plants-and-your-cat
- NHS Poisonous Plants: https://www.nhs.uk/conditions/poisoning/household-materials/plants/
- RHS Plants for Pollinators: https://www.rhs.org.uk/science/conservation-biodiversity/wildlife/plants-for-pollinators

## Changelog
- v1.0 2026-03-19: Initial version
