/**
 * domain.js — Your Green Gardening Wizard
 * Pure domain functions. No DOM. No API calls. Fully testable.
 * Extracted from index-v2.html per YGW-012.
 *
 * Single responsibility rule:
 *   buildSystemPrompt() is the ONLY assembler.
 *   Each clause function has ONE job: domain value → prompt fragment.
 *   UI code imports what it needs and never constructs prompt strings.
 */

// ─────────────────────────────────────────────
// Label maps — domain knowledge, not UI concern
// ─────────────────────────────────────────────

export const SOIL_LABELS = {
  clay:    'heavy clay (sticky when wet, cracks when dry)',
  sandy:   'sandy/light (free-draining, dries out quickly)',
  loam:    'rich loam (dark, crumbly, fertile)',
  chalky:  'chalky/stony (pale, alkaline, fast-draining)',
  peaty:   'peaty/boggy (dark, acidic, moisture-retentive)',
  unknown: 'unknown soil type (help the user identify it first)'
};

export const ASPECT_LABELS = {
  south: 'south-facing (full sun all day — ideal for sun-lovers)',
  north: 'north-facing (mostly shade — limited direct sun)',
  east:  'east-facing (morning sun only — sheltered afternoon)',
  west:  'west-facing (afternoon sun — often warm and sheltered)',
  mixed: 'mixed aspect or not sure (some sun, some shade)'
};

export const GOAL_LABELS = {
  colour:           'colour and flowers',
  wildlife:         'wildlife and pollinators',
  veg:              'vegetables and herbs',
  'low-maintenance':'low maintenance',
  privacy:          'privacy and screening',
  entertaining:     'outdoor entertaining',
  scent:            'scent',
  'year-round':     'year-round interest'
};

export const GOAL_ICONS = {
  colour: '🌸', wildlife: '🦋', veg: '🥕',
  'low-maintenance': '😌', privacy: '🌳',
  entertaining: '🍷', scent: '🌹', 'year-round': '📅'
};

export const STYLE_LABELS = {
  'natural-wild':   'Natural & wild',
  'meticulous':     'Meticulous',
  'cottage':        'Cottage garden',
  'mediterranean':  'Mediterranean',
  'modern-minimal': 'Modern & minimal',
  'japanese-zen':   'Japanese & Zen'
};

// ─────────────────────────────────────────────
// GardenProfile validation and construction
// ─────────────────────────────────────────────

/**
 * Builds a validated GardenProfile from raw wizard state.
 * @param {object} wizardState - Raw state from UI wizard
 * @returns {object|null} GardenProfile or null if invalid
 */
export function buildGardenProfile(wizardState) {
  if (!wizardState) return null;
  const { location, soil, aspect, goals, horizon, wizardMode, existingPlants, problems } = wizardState;
  if (!location || location.trim().length < 2) return null;
  if (!soil || !SOIL_LABELS[soil]) return null;
  if (!aspect || !ASPECT_LABELS[aspect]) return null;
  if (!goals || !Array.isArray(goals) || goals.length === 0) return null;

  const VALID_HORIZONS = ['2yr', '5yr', '10yr'];
  return {
    location: location.trim(),
    soil,
    aspect,
    goals: goals.filter(g => GOAL_LABELS[g]),
    horizon: VALID_HORIZONS.includes(horizon) ? horizon : null,
    wizardMode: wizardMode === 'fix' ? 'fix' : 'new',
    existingPlants: wizardMode === 'fix' ? (existingPlants || '') : undefined,
    problems: wizardMode === 'fix' ? (problems || '') : undefined,
  };
}

// ─────────────────────────────────────────────
// User message builder
// ─────────────────────────────────────────────

/**
 * Formats the user turn from a GardenProfile.
 * @param {object} profile - Validated GardenProfile
 * @returns {string} Formatted user message
 */
export function buildUserMessage(profile) {
  const goalList = profile.goals.map(g => GOAL_LABELS[g]).join(', ');
  const HORIZON_LABELS = { '2yr': 'Quick impact (2 years)', '5yr': 'Balanced (5 years)', '10yr': 'Legacy (10+ years)' };
  const horizonLine = profile.horizon && HORIZON_LABELS[profile.horizon]
    ? `\n- Growth horizon: ${HORIZON_LABELS[profile.horizon]}`
    : '';
  return `My garden profile:
- Location: ${profile.location}
- Soil type: ${SOIL_LABELS[profile.soil]}
- Aspect: ${ASPECT_LABELS[profile.aspect]}
- What I want: ${goalList}${horizonLine}

Please give me personalised plant recommendations and garden design ideas for my specific conditions.`;
}

// ─────────────────────────────────────────────
// Prompt clause builders (single responsibility)
// ─────────────────────────────────────────────

/**
 * Builds the growth horizon context clause.
 * @param {string|null} horizon - '2yr', '5yr', or '10yr'
 * @returns {string} Prompt fragment or empty string
 */
export function buildGrowthHorizonContext(horizon) {
  const HORIZON_FRAGMENTS = {
    '2yr': '\n\nGROWTH HORIZON — QUICK IMPACT (2 years): The gardener wants results fast. Prioritise plants that establish and perform within 1–2 seasons: fast-growing perennials, annual fillers, container-ready plants, and shrubs known for quick establishment. Flag the expected year-1 and year-2 appearance for each key recommendation. Avoid slow-growing trees or shrubs that take 5+ years to reach impact. If a slow plant is essential, note the timeline honestly.',
    '5yr': '\n\nGROWTH HORIZON — BALANCED (5 years): The gardener wants a garden that builds steadily and looks good throughout. Mix fast-establishing plants for early colour with medium-term structural shrubs and perennials that mature in 3–5 years. Note which plants provide immediate interest vs. which are the backbone at year 5. Avoid plants that take a decade or more to reach their statement size unless they are small-garden staples.',
    '10yr': '\n\nGROWTH HORIZON — LEGACY (10+ years): The gardener is planting for the long term. Include statement trees, large structural shrubs, and slow-maturing plants that will define the garden in a decade. Provide a layered planting plan: fast annuals/perennials for years 1–3, medium shrubs for years 3–7, and the legacy trees/large shrubs as the eventual centrepiece. Be explicit about what the garden will look like at year 1, year 5, and year 10+'
  };

  if (!horizon || !HORIZON_FRAGMENTS[horizon]) return '';
  return HORIZON_FRAGMENTS[horizon];
}

/**
 * Builds the fix-mode context clause for existing garden advisory.
 * Switches AI framing from "plan from scratch" to "keep/remove/add/timing".
 * @param {string} existingPlants - Free text describing what's already there
 * @param {string} problems - Free text describing what's going wrong
 * @returns {string} Prompt fragment or empty string
 */
export function buildFixModeContext(existingPlants = '', problems = '') {
  if (!existingPlants && !problems) return '';
  const plantClause = existingPlants ? `\n- Existing plants: ${existingPlants}` : '';
  const problemClause = problems ? `\n- Current problems: ${problems}` : '';
  return `\n\nFIX MY GARDEN MODE: This gardener has an existing garden, not a blank canvas. Structure ALL advice as four clear sections:
1. KEEP — plants or features worth retaining and why
2. REMOVE — what to take out, with reasons (invasive, wrong place, diseased, etc.)
3. ADD — new plants that fill gaps, solve problems, or improve the space
4. TIMING — when to do each action, in order of priority

Do NOT give generic "plan a new border" advice. Address the specific existing situation directly.${plantClause}${problemClause}`;
}

/**
 * Builds the safety constraint clause.
 * @param {string[]} safety - Array of safety constraint keys
 * @returns {string} Prompt fragment or empty string
 */
export function buildSafetyClause(safety = []) {
  if (!safety || safety.length === 0) return '';

  const TOXIC_FOR = {
    dogs: 'dogs (exclude all plants toxic to dogs including: Narcissus/Daffodil, Tulipa/Tulip, Rhododendron/Azalea, Digitalis/Foxglove, Taxus/Yew, Laburnum, Convallaria/Lily of the Valley, Vinca/Periwinkle, Euphorbia, Iris)',
    cats: 'cats (exclude all plants toxic to cats — particularly ALL Lilium/Lily species which cause kidney failure, also Narcissus, Tulipa, Digitalis, Taxus, Colchicum, Euphorbia)',
    'young-children': 'young children (exclude plants with toxic berries, leaves or sap including: Digitalis/Foxglove, Taxus/Yew, Laburnum, Aconitum/Monkshood, Solanum/Nightshade, Euphorbia — flag any plant with sap that causes skin irritation)',
    hayfever: 'hayfever and pollen allergies (avoid high-pollen wind-pollinated plants; prioritise low-allergen insect-pollinated species; avoid Betula/Birch, Corylus/Hazel, grasses in flower, Artemisia)',
    'skin-irritants': 'skin irritants (exclude Euphorbia/spurges due to caustic sap, Heracleum mantegazzianum/Giant Hogweed, Ruta/Rue, Primula obconica, Dictamnus/Burning Bush)'
  };

  const safetyItems = safety
    .filter(s => s !== 'bees-important' && TOXIC_FOR[s])
    .map(s => TOXIC_FOR[s]);

  let clause = '';

  if (safetyItems.length > 0) {
    clause += `\n\nSAFETY CONSTRAINTS — MANDATORY: Never recommend any plant excluded below. If mentioning any plant, confirm it is safe for the following users: ${safetyItems.join('; ')}. If you are uncertain about any plant's safety for these users, omit it.`;
  }

  if (safety.includes('bees-important')) {
    clause += '\n\nBEE-FRIENDLY PRIORITY: Actively prioritise plants with the RHS "Plants for Pollinators" award or strong bee-foraging value. For each recommended plant, note whether it is particularly valuable for bees, bumblebees, or other pollinators.';
  }

  return clause;
}

/**
 * Builds the garden style/archetype clause.
 * @param {string|null} style - Style key
 * @returns {string} Prompt fragment or empty string
 */
export function buildStyleClause(style = null) {
  if (!style) return '';

  const STYLE_MAP = {
    'natural-wild':
      'Natural and wild — meadow feel, self-seeding plants, naturalistic drifts, embracing "controlled chaos". Think Piet Oudolf and Beth Chatto. Prioritise species plants over cultivars where possible. Include grasses, umbellifers, and plants that move in the wind.',
    'meticulous':
      'Meticulous and formal — clean lines, structured planting, clipped topiary, strong repetition, everything in its appointed place. Include at least one clipped element (Buxus, Taxus, Carpinus). Geometry and symmetry over informality.',
    'cottage':
      'Cottage garden — tumbling abundance, old roses, foxgloves, hollyhocks, sweet peas, lupins, delphiniums. Romantic, informal, slightly unruly but intentionally so. Think Sissinghurst and Hidcote.',
    'mediterranean':
      'Mediterranean — drought-tolerant, gravel mulch, lavender, rosemary, cistus, Phlomis, Salvia, terracotta tones, silver foliage. Sun-loving plants that thrive in free-draining soil. Minimal irrigation once established.',
    'modern-minimal':
      'Modern and minimal — architectural plants, severely limited palette (2-3 species maximum in any one area), clean geometry, structural grasses, specimen trees or shrubs, bold foliage over flower colour.',
    'japanese-zen':
      'Japanese and Zen — contemplative atmosphere, restrained palette, moss, bamboo (in containers to control spread), Japanese maples (Acer palmatum), raked gravel or stone elements, clipped evergreen mounds (Buxus, Ilex). Every plant chosen deliberately.'
  };

  if (!STYLE_MAP[style]) return '';
  return `\n\nGARDEN STYLE: ${STYLE_MAP[style]} Let this style philosophy shape all plant choices and design ideas. Plants that don't fit this style should not be recommended even if they would otherwise suit the conditions.`;
}

/**
 * Builds the colour palette clause.
 * @param {string[]} colours - Array of colour palette keys
 * @returns {string} Prompt fragment or empty string
 */
export function buildColourClause(colours = []) {
  if (!colours || colours.length === 0) return '';

  const COLOUR_MAP = {
    'hot-bold':         'hot and bold colours (deep reds, magenta, crimson, vivid orange, hot pink — think exotic and dramatic)',
    'soft-pastel':      'soft pastels (blush pink, lilac, pale lavender, soft apricot, cream — gentle and romantic)',
    'cool-purple-blue': 'cool purples and blues (lavender, violet, deep indigo, blue-purple, silver-blue — calming and sophisticated)',
    'white-silver':     'white and silver/grey (pure white flowers, silver foliage, grey-leafed plants — moon garden palette, elegant and timeless)',
    'yellow-orange':    'yellows and warm oranges (sunshine yellow, burnt orange, golden tones — cheerful and high-energy)',
    'green-foliage':    'greens and foliage texture (focus on leaf shape, texture and green tones rather than flowers — lush, tropical, or architectural)'
  };

  const chosen = colours.map(c => COLOUR_MAP[c]).filter(Boolean);
  if (chosen.length === 0) return '';

  return `\n\nCOLOUR PALETTE: Strictly focus on plants that provide ${chosen.join(' and ')}. Check every plant recommendation against this palette before including it. Plants with flowers or foliage that clash significantly with this palette should be replaced with alternatives that fit.`;
}

/**
 * Builds the plant type filter clause.
 * @param {string[]} plantTypes - Array of plant type keys
 * @returns {string} Prompt fragment or empty string
 */
export function buildPlantTypeClause(plantTypes = []) {
  if (!plantTypes || plantTypes.length === 0) return '';

  const TYPE_MAP = {
    perennials:      'perennials (herbaceous plants that return year after year)',
    annuals:         'annuals (plants grown fresh each year for maximum seasonal colour)',
    shrubs:          'shrubs (woody plants providing permanent structure)',
    trees:           'trees (including small ornamental trees, standards, and multi-stems suitable for gardens)',
    climbers:        'climbers and wall plants (plants to cover fences, walls, arches, or pergolas)',
    grasses:         'ornamental grasses and ferns (for texture, movement, and structure)',
    bulbs:           'bulbs (tulips, alliums, daffodils, dahlias, lilies etc for seasonal impact)',
    'fast-growing':  null, // handled separately below
    'evergreen':     null  // handled separately below
  };

  const standardTypes = plantTypes
    .filter(t => t !== 'fast-growing' && t !== 'evergreen' && TYPE_MAP[t])
    .map(t => TYPE_MAP[t]);

  let clause = '';

  if (standardTypes.length > 0) {
    clause += `\n\nPLANT TYPES REQUESTED: Weight your recommendations heavily towards ${standardTypes.join(', ')}. Include at least 2 options from each requested type.`;
  }

  if (plantTypes.includes('fast-growing')) {
    clause += '\n\nFAST-GROWING ONLY: Every single plant recommended must establish and provide meaningful visual impact within 1-2 growing seasons. Explicitly exclude slow-growing plants (oaks, magnolias, wisterias before year 5, etc.). Mention the approximate time to establishment for each plant.';
  }

  if (plantTypes.includes('evergreen')) {
    clause += '\n\nEVERGREEN ONLY: Every plant recommended must retain its foliage throughout the year. No deciduous plants. Confirm evergreen status for each recommendation.';
  }

  return clause;
}

/**
 * Builds the extras clause (companion planting, bad combinations, invasives, succession).
 * @param {string[]} extras - Array of extra knowledge request keys
 * @returns {string} Prompt fragment or empty string
 */
export function buildExtrasClause(extras = []) {
  if (!extras || extras.length === 0) return '';

  let clause = '';

  if (extras.includes('companion-planting')) {
    clause += '\n\nCOMPANION PLANTING: Include a dedicated "Companion planting" section after the main plant list. Name at least 3 beneficial plant pairs from your recommendations, explaining the mechanism (pest deterrence, pollinator attraction, nitrogen-fixing, physical support, etc.).';
  }

  if (extras.includes('avoid-combinations')) {
    clause += '\n\nBAD COMBINATIONS: Include a "Planting conflicts to avoid" section. Name at least 2 plant combinations from your recommendations that should NOT be placed in proximity, explaining why (allelopathy, competition for resources, disease transmission, or incompatible care requirements).';
  }

  if (extras.includes('invasive-warning')) {
    clause += '\n\nINVASIVE SPECIES: If any plant you recommend has invasive tendencies in UK gardens, flag it clearly with a warning icon or note. Include management advice (e.g. plant in containers, deadhead before seed set, annual root barrier inspection). Common UK garden invasives to flag if recommended: Buddleja davidii, Lysimachia punctata, running bamboos, Fallopia japonica, Rhododendron ponticum, Persicaria species.';
  }

  if (extras.includes('seasonal-succession')) {
    clause += '\n\nSEASONAL SUCCESSION: After the main plant list, include a "Seasonal interest calendar" section with a brief month-by-month or season-by-season breakdown. For each season, name 2-3 plants from your recommendations that provide peak interest in that period. The goal is to show the garden has something happening in every season.';
  }

  return clause;
}

// ─────────────────────────────────────────────
// Main system prompt composer
// ─────────────────────────────────────────────

const BASE_PROMPT = `You are a friendly, expert UK garden advisor with 25 years of horticultural knowledge. You know British soil types, RHS hardiness zones, regional rainfall and frost patterns, companion planting, and the best plants for every situation.

Your job is to give personalised, practical garden advice based on the user's specific conditions. Your recommendations must:
- Be genuinely tailored to the exact combination of location + soil + aspect + goals described
- Name specific cultivar-level plant varieties that will actually thrive (not just genus — give the full name e.g. Rosa 'Gertrude Jekyll' not just "rose")
- For each plant: give the common name, Latin name, and a brief practical note (height, spread, when it flowers, any care tips specific to their conditions)
- Include structural backbone plants, seasonal interest across multiple seasons, and direct responses to the user's stated goals
- Reference specific UK regional conditions where relevant (northern gardens, coastal exposure, chalk downland, urban heat island effects)
- Be warm, encouraging, and written in plain English — explain any technical terms immediately
- Feel like advice from a knowledgeable and enthusiastic friend, not a textbook`;

const FORMAT_INSTRUCTIONS = `

FORMAT your response with clear markdown headers (##). Always include:

## Your garden conditions
A warm, specific read of their combination of conditions (3-4 sentences). Mention anything unusual, particularly challenging, or particularly advantageous about their specific combination.

## Recommended plants
At least 10 named plant varieties. For each: **bold the name**, then give a 2-3 sentence note covering why it works for their specific conditions, when it looks its best, and one practical tip.

## Design ideas
2-3 concrete design approaches that directly respond to their stated goals. Be specific — name plant combinations, suggest planting distances, mention structural decisions.

## Watch out for
1-2 things specific to their conditions — common mistakes, plants that look right but won't thrive, timing issues, or local pest and disease pressures.

Keep the total response focused and readable on a phone screen. Do not pad or repeat.`;

/**
 * Assembles the complete system prompt for a garden advisory request.
 * This is the ONLY function that should assemble system prompts.
 * @param {object} profile - Validated GardenProfile (optional, for future use)
 * @param {object} refinements - Refinements object or null
 * @returns {string} Complete system prompt
 */
export function buildSystemPrompt(profile = null, refinements = null, date = new Date()) {
  const clauses = [
    BASE_PROMPT,
    buildSeasonalContext(profile?.location, date),
    buildGrowthHorizonContext(profile?.horizon),
    profile?.wizardMode === 'fix' ? buildFixModeContext(profile?.existingPlants, profile?.problems) : '',
    buildSafetyClause(refinements?.safety),
    buildStyleClause(refinements?.style),
    buildColourClause(refinements?.colours),
    buildPlantTypeClause(refinements?.plantTypes),
    buildExtrasClause(refinements?.extras),
    FORMAT_INSTRUCTIONS
  ];

  return clauses.filter(c => c && c.length > 0).join('');
}

// ─────────────────────────────────────────────
// Landscaper prompt (Phase 3)
// ─────────────────────────────────────────────

export function buildLandscaperSystemPrompt(clientBrief = '') {
  return `You are a professional horticultural consultant producing a client-ready garden planting plan. Output must be structured, accurate, and suitable for direct client presentation.

For every plant recommended, provide:
- Common name
- Latin name (genus species 'Cultivar')
- Pot size typically available at purchase (e.g. 2L, 3L, 5L, 10L)
- Recommended spacing (cm)
- Approximate units needed per 10m²
- Approximate RRP per unit (UK garden centre prices, GBP)
- Brief client note (plain English, not technical)

Also provide:
- A schedule of works summary (phases: preparation, planting, establishment)
- Any soil preparation notes
- First-year care instructions

${clientBrief ? `Client brief: ${clientBrief}` : ''}

Format as a structured professional document with clear sections. Use markdown headers.`;
}

// ─────────────────────────────────────────────
// Seasonal awareness (YGW-019, YGW-020)
// ─────────────────────────────────────────────

/**
 * Returns the current UK season and UI strings for the given date.
 * Pure function — takes optional date for testability.
 */
export function getCurrentUKSeason(date = new Date()) {
  const month = date.getMonth() + 1; // 1–12
  if (month >= 3 && month <= 5)  return { season: 'spring', label: 'Spring', cta: 'Get your spring garden plan', loading: "Checking what's emerging..." };
  if (month >= 6 && month <= 8)  return { season: 'summer', label: 'Summer', cta: 'Get your summer garden plan', loading: 'Finding what loves the heat...' };
  if (month >= 9 && month <= 11) return { season: 'autumn', label: 'Autumn', cta: 'Get your autumn garden plan', loading: 'Checking what needs doing before frost...' };
  return { season: 'winter', label: 'Winter', cta: 'Plan your spring garden now', loading: 'Thinking ahead to spring...' };
}

/**
 * Builds a seasonal context clause injected into system prompts.
 * Tells the AI what month/season it is so advice is time-relevant.
 */
export function buildSeasonalContext(location, date = new Date()) {
  const { season } = getCurrentUKSeason(date);
  const month = date.toLocaleString('en-GB', { month: 'long' });
  return `\n\nSEASONAL CONTEXT: It is currently ${month} in the UK (${season}). Weight all recommendations toward what the gardener should DO NOW and PLANT NOW for their conditions. Include specific timing (e.g. "plant tulip bulbs before ground freezes", "cut back now before new growth"). Do not give advice that was relevant in a different season.`;
}

// ─────────────────────────────────────────────
// Seasonal prompt (Phase 2 — email updates)
// ─────────────────────────────────────────────

export function buildSeasonalPrompt(profile, season) {
  const seasonMap = {
    spring: 'spring (March–May)',
    summer: 'summer (June–August)',
    autumn: 'autumn (September–November)',
    winter: 'winter (December–February)'
  };
  const seasonLabel = seasonMap[season] || season;
  const goalList = profile.goals.map(g => GOAL_LABELS[g] || g).join(', ');

  return `You are a UK garden advisor sending a helpful seasonal update to a gardener. Keep it friendly, specific, and actionable.

Their garden: ${profile.location}, ${SOIL_LABELS[profile.soil]}, ${ASPECT_LABELS[profile.aspect]}, goals: ${goalList}

It is now ${seasonLabel}. Give them:
1. Three specific things to do in their garden THIS season (tailored to their conditions)
2. One plant that is at its best right now and that would suit their garden
3. One thing to watch out for or prepare for in the coming season

Keep it brief — this is an email, not an article. Warm, friendly tone.`;
}

// ─────────────────────────────────────────────
// Quantity estimator (Phase 3)
// ─────────────────────────────────────────────

const SPACING_CM = {
  groundcover: 30,
  perennial_small: 45,
  perennial_medium: 60,
  perennial_large: 90,
  shrub_small: 80,
  shrub_medium: 120,
  shrub_large: 200,
  tree: 300,
  bulb: 15,
  annual: 25,
  grass: 50,
  climber_linear: 100
};

/**
 * Estimates plant quantities for a given bed area.
 * Pure function — no AI required.
 * @param {string} plantType - Key from SPACING_CM
 * @param {number} bedAreaM2 - Bed area in square metres
 * @returns {{ spacingCm, quantityPer10m2, totalQuantity }}
 */
export function estimatePlantQuantity(plantType, bedAreaM2) {
  const spacing = SPACING_CM[plantType];
  if (!spacing || !bedAreaM2 || bedAreaM2 <= 0) return null;

  const spacingM = spacing / 100;
  const quantityPer1m2 = 1 / (spacingM * spacingM);
  const quantityPer10m2 = Math.ceil(quantityPer1m2 * 10);
  const totalQuantity = Math.ceil(quantityPer1m2 * bedAreaM2);

  return { spacingCm: spacing, quantityPer10m2, totalQuantity };
}

// ─────────────────────────────────────────────
// UI utilities (markdown, share, pills)
// ─────────────────────────────────────────────

/**
 * Renders markdown-ish text to safe HTML.
 * Handles: headers, bold, italic, unordered lists, numbered lists, paragraphs.
 * Does NOT use innerHTML unsafely — input is AI-generated, treat with care.
 */
export function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^[\-\*] (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*?<\/li>\n?)+/g, m => '<ul>' + m + '</ul>')
    .replace(/\n\n+/g, '</p><p>')
    .replace(/^(?!<[hup])/gm, '')
    .replace(/(<\/h3>|<\/ul>)\n/g, '$1')
    .replace(/^([^<\n].+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[hul])/g, '$1')
    .replace(/(<\/[hul][^>]*>)<\/p>/g, '$1');
}

/**
 * Formats the share text for clipboard/native share.
 * @param {object} profile - GardenProfile
 * @param {string} result - AI result text
 * @param {string} url - Current page URL
 * @returns {string} Share text
 */
export function formatShareText(profile, result, url) {
  const soilShort = { clay:'clay', sandy:'sandy', loam:'loam', chalky:'chalky', peaty:'peaty', unknown:'unknown soil' };
  const aspectShort = { south:'south-facing', north:'north-facing', east:'east-facing', west:'west-facing', mixed:'mixed aspect' };

  const preview = result
    ? result.replace(/[#*]/g, '').trim().substring(0, 500) + '...'
    : '';

  return `🌿 My Garden Plan — Your Green Gardening Wizard

📍 ${profile.location} · ${soilShort[profile.soil] || profile.soil} soil · ${aspectShort[profile.aspect] || profile.aspect}
🎯 Goals: ${profile.goals.map(g => GOAL_LABELS[g] || g).join(', ')}

${preview}

Get your own free garden plan → ${url}`;
}

// ─────────────────────────────────────────────
// Knowledge base injection (YGW-004)
// Loads knowledge files and injects relevant fragments into prompts.
// Uses dynamic import for browser compatibility with ES modules.
// In Node.js (tests): uses fs.readFileSync.
// In browser: uses fetch() against the /knowledge/ path.
// ─────────────────────────────────────────────

/**
 * Builds a knowledge-augmented system prompt by injecting relevant
 * knowledge base sections based on the user's garden profile.
 *
 * This is the upgraded version of buildSystemPrompt() that uses
 * the knowledge base files. It runs async because it fetches files.
 *
 * @param {object} profile - Validated GardenProfile
 * @param {object} refinements - Refinements or null
 * @param {Function} loadKnowledge - Async function(path) => string
 *   Caller provides the loader so this stays pure/testable.
 *   Browser: (path) => fetch(path).then(r => r.text())
 *   Node tests: (path) => fs.readFileSync(path, 'utf8')
 * @returns {Promise<string>} Complete system prompt with knowledge injected
 */
export async function buildAugmentedSystemPrompt(profile, refinements = null, loadKnowledge, date = new Date()) {
  const fragments = [
    BASE_PROMPT,
    buildSeasonalContext(profile?.location, date),
    profile?.wizardMode === 'fix' ? buildFixModeContext(profile?.existingPlants, profile?.problems) : '',
  ].filter(Boolean);

  // Soil knowledge — inject only the relevant section
  if (profile && profile.soil) {
    try {
      const soilKnowledge = await loadKnowledge('./knowledge/tier1/soil-types.md');
      const soilSection = extractSection(soilKnowledge, soilSectionTitle(profile.soil));
      if (soilSection) {
        fragments.push(`\n\nSOIL KNOWLEDGE — ${profile.soil.toUpperCase()}:\n${soilSection}`);
      }
    } catch { /* knowledge file optional — degrade gracefully */ }
  }

  // Aspect knowledge — inject only the relevant section
  if (profile && profile.aspect) {
    try {
      const aspectKnowledge = await loadKnowledge('./knowledge/tier1/aspect-effects.md');
      const aspectSection = extractSection(aspectKnowledge, aspectSectionTitle(profile.aspect));
      if (aspectSection) {
        fragments.push(`\n\nASPECT KNOWLEDGE — ${profile.aspect.toUpperCase()}-FACING:\n${aspectSection}`);
      }
    } catch { /* degrade gracefully */ }
  }

  // Safety knowledge — inject toxic plant lists if safety constraints active
  if (refinements && refinements.safety && refinements.safety.length > 0) {
    try {
      const hazardKnowledge = await loadKnowledge('./knowledge/tier1/hazardous-plants.md');
      const sections = refinements.safety
        .map(s => extractHazardSection(hazardKnowledge, s))
        .filter(Boolean);
      if (sections.length > 0) {
        fragments.push(`\n\nSAFETY KNOWLEDGE BASE:\n${sections.join('\n\n')}`);
      }
    } catch { /* degrade gracefully */ }
  }

  // Invasive species knowledge
  if (refinements && refinements.extras && refinements.extras.includes('invasive-warning')) {
    try {
      const invasiveKnowledge = await loadKnowledge('./knowledge/tier1/invasive-species.md');
      const flagSection = extractSection(invasiveKnowledge, 'Commonly sold but garden-invasive');
      if (flagSection) {
        fragments.push(`\n\nINVASIVE SPECIES REFERENCE:\n${flagSection}`);
      }
    } catch { /* degrade gracefully */ }
  }

  // Companion planting knowledge
  if (refinements && refinements.extras) {
    const needsCompanion = refinements.extras.includes('companion-planting') ||
                           refinements.extras.includes('avoid-combinations');
    if (needsCompanion) {
      try {
        const companionKnowledge = await loadKnowledge('./knowledge/tier1/companion-planting.md');
        fragments.push(`\n\nCOMPANION PLANTING KNOWLEDGE BASE:\n${companionKnowledge.substring(0, 3000)}`);
      } catch { /* degrade gracefully */ }
    }
  }

  // Style knowledge — inject full style file when style selected
  if (refinements && refinements.style) {
    const styleFile = styleKnowledgeFile(refinements.style);
    if (styleFile) {
      try {
        const styleKnowledge = await loadKnowledge(`./knowledge/tier2/${styleFile}`);
        fragments.push(`\n\nSTYLE KNOWLEDGE BASE — ${refinements.style.toUpperCase()}:\n${styleKnowledge.substring(0, 2500)}`);
      } catch { /* degrade gracefully */ }
    }
  }

  // Add standard clause functions (safety, colour, plant type, extras)
  fragments.push(buildSafetyClause(refinements?.safety));
  fragments.push(buildStyleClause(refinements?.style));
  fragments.push(buildColourClause(refinements?.colours));
  fragments.push(buildPlantTypeClause(refinements?.plantTypes));
  fragments.push(buildExtrasClause(refinements?.extras));
  fragments.push(FORMAT_INSTRUCTIONS);

  return fragments.filter(f => f && f.length > 0).join('');
}

// ── Knowledge extraction helpers ──

function extractSection(content, sectionTitle) {
  if (!content || !sectionTitle) return null;
  const lines = content.split('\n');
  let inSection = false;
  const sectionLines = [];

  for (const line of lines) {
    if (line.includes(sectionTitle)) {
      inSection = true;
      sectionLines.push(line);
      continue;
    }
    if (inSection) {
      // Stop at next ## heading of same or higher level
      if (line.startsWith('## ') && sectionLines.length > 1) break;
      if (line.startsWith('---') && sectionLines.length > 3) break;
      sectionLines.push(line);
    }
  }

  return sectionLines.length > 2 ? sectionLines.join('\n').trim() : null;
}

function extractHazardSection(content, safetyKey) {
  const sectionMap = {
    dogs:             'Dogs — toxic plants',
    cats:             'Cats — toxic plants',
    'young-children': 'Young children',
    hayfever:         'Hayfever and pollen',
    'skin-irritants': 'Skin irritants',
    'bees-important': 'Bee-friendly'
  };
  return extractSection(content, sectionMap[safetyKey] || safetyKey);
}

function soilSectionTitle(soil) {
  const map = {
    clay:    'Heavy clay',
    sandy:   'Sandy',
    loam:    'Loam',
    chalky:  'Chalk',
    peaty:   'Peaty',
    unknown: 'Soil diagnostic'
  };
  return map[soil];
}

function aspectSectionTitle(aspect) {
  const map = {
    south: 'South-facing',
    north: 'North-facing',
    east:  'East-facing',
    west:  'West-facing',
    mixed: 'Mixed aspect'
  };
  return map[aspect];
}

function styleKnowledgeFile(style) {
  const map = {
    'natural-wild':   'style-natural-wild.md',
    'cottage':        'style-cottage.md',
    'mediterranean':  'style-mediterranean.md',
    'modern-minimal': 'style-modern-minimal.md',
    'meticulous':     'style-meticulous.md',
    'japanese-zen':   'style-japanese-zen.md'
  };
  return map[style] || null;
}

// ─────────────────────────────────────────────
// Share card generation (YGW-018)
// ─────────────────────────────────────────────

/**
 * Extracts up to 5 bold plant names from AI recommendation markdown.
 * @param {string} markdown - AI result text with **bold** plant names
 * @returns {string[]} Up to 5 plant names, names >30 chars truncated with ellipsis
 */
export function extractSharePlants(markdown) {
  if (!markdown) return [];
  const matches = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    const name = match[1].trim();
    if (name.length > 0) {
      matches.push(name.length > 30 ? name.substring(0, 29) + '\u2026' : name);
    }
    if (matches.length >= 5) break;
  }
  return matches;
}

/**
 * Draws a filled rounded rectangle on a Canvas 2D context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x @param {number} y @param {number} w @param {number} h @param {number} r
 */
function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Generates a 1080x1080 PNG share card as a Blob.
 * Uses injected createCanvas for testability (browser passes document.createElement).
 * @param {object|null} profile - GardenProfile
 * @param {string} result - AI recommendation text
 * @param {object|null} refinements - Refinements or null
 * @param {object} deps - Dependency injection
 * @param {Function} deps.createCanvas - Returns a canvas element
 * @returns {Promise<Blob|null>} PNG blob, or null if canvas not supported
 */
export async function generateShareCard(profile, result, refinements = null, { createCanvas } = {}) {
  if (!createCanvas) return null;

  let canvas, ctx;
  try {
    canvas = createCanvas();
    ctx = canvas.getContext('2d');
    if (!ctx) return null;
  } catch {
    return null;
  }

  canvas.width = 1080;
  canvas.height = 1080;

  const plants = extractSharePlants(result || '');
  const DARK_GREEN = '#1a3a2a';
  const SAGE      = '#52b788';
  const CREAM     = '#f5f0e8';
  const MINT      = '#74c69d';

  // Background
  ctx.fillStyle = DARK_GREEN;
  ctx.fillRect(0, 0, 1080, 1080);

  // Subtle diagonal stripes
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 2;
  for (let i = -1080; i < 2160; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 1080, 1080);
    ctx.stroke();
  }
  ctx.restore();

  // Top accent bar
  ctx.fillStyle = SAGE;
  ctx.fillRect(0, 0, 1080, 8);

  // Brand name
  ctx.fillStyle = CREAM;
  ctx.font = 'italic 54px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Your Green Gardening Wizard', 540, 104);

  // Subtitle
  ctx.fillStyle = SAGE;
  ctx.font = '28px Arial, sans-serif';
  ctx.fillText('My Garden Plan', 540, 152);

  // Horizontal divider
  ctx.strokeStyle = 'rgba(82,183,136,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 178);
  ctx.lineTo(1000, 178);
  ctx.stroke();

  // Profile pills
  if (profile) {
    const soilShort   = { clay:'Clay soil', sandy:'Sandy soil', loam:'Rich loam', chalky:'Chalky soil', peaty:'Peaty soil', unknown:'Unknown soil' };
    const aspectShort = { south:'South-facing', north:'North-facing', east:'East-facing', west:'West-facing', mixed:'Mixed aspect' };
    const pills = [
      profile.location,
      soilShort[profile.soil]   || profile.soil,
      aspectShort[profile.aspect] || profile.aspect
    ].filter(Boolean);

    ctx.font = '22px Arial, sans-serif';
    let pillX = 80;
    const pillY = 222;
    const pillH = 36;

    for (const pill of pills) {
      const textW = ctx.measureText(pill).width;
      const pillW = textW + 32;
      if (pillX + pillW > 1000) break;
      ctx.fillStyle = SAGE;
      drawRoundRect(ctx, pillX, pillY - 26, pillW, pillH, 18);
      ctx.fill();
      ctx.fillStyle = DARK_GREEN;
      ctx.textAlign = 'left';
      ctx.fillText(pill, pillX + 16, pillY);
      pillX += pillW + 12;
    }
  }

  // Section label
  ctx.fillStyle = SAGE;
  ctx.font = '24px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Your recommended plants', 80, 308);

  // Section divider
  ctx.strokeStyle = 'rgba(82,183,136,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 322);
  ctx.lineTo(1000, 322);
  ctx.stroke();

  // Plant list
  if (plants.length > 0) {
    plants.forEach((name, i) => {
      const y = 370 + i * 104;
      ctx.fillStyle = MINT;
      ctx.font = '28px Arial, sans-serif';
      ctx.fillText('\uD83C\uDF3F', 80, y);
      ctx.fillStyle = CREAM;
      ctx.font = '500 36px Arial, sans-serif';
      ctx.fillText(name, 134, y);
    });
  } else {
    ctx.fillStyle = 'rgba(245,240,232,0.5)';
    ctx.font = 'italic 28px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Your personalised garden plan', 540, 560);
  }

  // Bottom bar
  ctx.fillStyle = SAGE;
  ctx.fillRect(0, 980, 1080, 100);
  ctx.fillStyle = DARK_GREEN;
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Get your free garden plan', 540, 1022);
  ctx.font = '20px Arial, sans-serif';
  ctx.fillText('your-green-gardening-wizard.leanspirited.workers.dev', 540, 1050);

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}
