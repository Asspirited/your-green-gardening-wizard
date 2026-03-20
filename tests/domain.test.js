/**
 * tests/domain.test.js
 * Unit tests for domain.js — must achieve 100% statement and branch coverage.
 * Run with: node --experimental-vm-modules tests/domain.test.js
 * Or:       node --test tests/domain.test.js
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildGardenProfile,
  buildUserMessage,
  buildSystemPrompt,
  buildAugmentedSystemPrompt,
  buildSafetyClause,
  buildStyleClause,
  buildColourClause,
  buildPlantTypeClause,
  buildExtrasClause,
  buildGrowthHorizonContext,
  buildSeasonalPrompt,
  getCurrentUKSeason,
  buildSeasonalContext,
  estimatePlantQuantity,
  renderMarkdown,
  formatShareText,
  extractSharePlants,
  generateShareCard,
  SOIL_LABELS,
  ASPECT_LABELS,
  GOAL_LABELS
} from '../domain.js';

// ─────────────────────────────────────────────
// buildGardenProfile
// ─────────────────────────────────────────────
describe('buildGardenProfile', () => {

  test('returns null for null input', () => {
    assert.strictEqual(buildGardenProfile(null), null);
  });

  test('returns null for empty location', () => {
    assert.strictEqual(buildGardenProfile({ location: '', soil: 'clay', aspect: 'south', goals: ['colour'] }), null);
  });

  test('returns null for single char location', () => {
    assert.strictEqual(buildGardenProfile({ location: 'A', soil: 'clay', aspect: 'south', goals: ['colour'] }), null);
  });

  test('returns null for invalid soil', () => {
    assert.strictEqual(buildGardenProfile({ location: 'York', soil: 'mud', aspect: 'south', goals: ['colour'] }), null);
  });

  test('returns null for invalid aspect', () => {
    assert.strictEqual(buildGardenProfile({ location: 'York', soil: 'clay', aspect: 'diagonal', goals: ['colour'] }), null);
  });

  test('returns null for empty goals array', () => {
    assert.strictEqual(buildGardenProfile({ location: 'York', soil: 'clay', aspect: 'south', goals: [] }), null);
  });

  test('returns null for missing goals', () => {
    assert.strictEqual(buildGardenProfile({ location: 'York', soil: 'clay', aspect: 'south' }), null);
  });

  test('returns valid profile for correct input', () => {
    const profile = buildGardenProfile({ location: 'York', soil: 'clay', aspect: 'north', goals: ['colour', 'wildlife'] });
    assert.ok(profile !== null);
    assert.strictEqual(profile.location, 'York');
    assert.strictEqual(profile.soil, 'clay');
    assert.strictEqual(profile.aspect, 'north');
    assert.deepStrictEqual(profile.goals, ['colour', 'wildlife']);
  });

  test('trims whitespace from location', () => {
    const profile = buildGardenProfile({ location: '  Bristol  ', soil: 'loam', aspect: 'west', goals: ['colour'] });
    assert.strictEqual(profile.location, 'Bristol');
  });

  test('filters out invalid goal keys', () => {
    const profile = buildGardenProfile({ location: 'York', soil: 'clay', aspect: 'south', goals: ['colour', 'invalid-goal'] });
    assert.deepStrictEqual(profile.goals, ['colour']);
  });

  test('handles all valid soil types', () => {
    ['clay', 'sandy', 'loam', 'chalky', 'peaty', 'unknown'].forEach(soil => {
      assert.ok(buildGardenProfile({ location: 'York', soil, aspect: 'south', goals: ['colour'] }) !== null);
    });
  });

  test('handles all valid aspect types', () => {
    ['south', 'north', 'east', 'west', 'mixed'].forEach(aspect => {
      assert.ok(buildGardenProfile({ location: 'York', soil: 'clay', aspect, goals: ['colour'] }) !== null);
    });
  });

});

// ─────────────────────────────────────────────
// buildUserMessage
// ─────────────────────────────────────────────
describe('buildUserMessage', () => {

  const profile = { location: 'Bristol', soil: 'clay', aspect: 'north', goals: ['colour', 'wildlife'] };

  test('includes location', () => {
    assert.ok(buildUserMessage(profile).includes('Bristol'));
  });

  test('includes soil label', () => {
    assert.ok(buildUserMessage(profile).includes('heavy clay'));
  });

  test('includes aspect label', () => {
    assert.ok(buildUserMessage(profile).includes('north-facing'));
  });

  test('includes goal labels', () => {
    const msg = buildUserMessage(profile);
    assert.ok(msg.includes('colour and flowers'));
    assert.ok(msg.includes('wildlife and pollinators'));
  });

  test('multiple goals joined with comma', () => {
    const msg = buildUserMessage(profile);
    assert.ok(msg.includes(','));
  });

});

// ─────────────────────────────────────────────
// buildSafetyClause
// ─────────────────────────────────────────────
describe('buildSafetyClause', () => {

  test('returns empty string for empty array', () => {
    assert.strictEqual(buildSafetyClause([]), '');
  });

  test('returns empty string for null', () => {
    assert.strictEqual(buildSafetyClause(null), '');
  });

  test('dogs clause excludes Foxglove', () => {
    const clause = buildSafetyClause(['dogs']);
    assert.ok(clause.includes('Foxglove') || clause.includes('Digitalis'));
  });

  test('dogs clause excludes Yew', () => {
    const clause = buildSafetyClause(['dogs']);
    assert.ok(clause.includes('Yew') || clause.includes('Taxus'));
  });

  test('dogs clause excludes Laburnum', () => {
    assert.ok(buildSafetyClause(['dogs']).includes('Laburnum'));
  });

  test('dogs clause excludes Daffodil', () => {
    const clause = buildSafetyClause(['dogs']);
    assert.ok(clause.includes('Daffodil') || clause.includes('Narcissus'));
  });

  test('cats clause excludes Lily', () => {
    const clause = buildSafetyClause(['cats']);
    assert.ok(clause.includes('Lily') || clause.includes('Lilium'));
  });

  test('children clause excludes Monkshood', () => {
    const clause = buildSafetyClause(['young-children']);
    assert.ok(clause.includes('Monkshood') || clause.includes('Aconitum'));
  });

  test('bees-important adds pollinator priority', () => {
    const clause = buildSafetyClause(['bees-important']);
    assert.ok(clause.includes('pollinator') || clause.includes('bee'));
  });

  test('bees-important alone does not add exclusion text', () => {
    const clause = buildSafetyClause(['bees-important']);
    assert.ok(!clause.includes('MANDATORY'));
  });

  test('multiple safety constraints combined', () => {
    const clause = buildSafetyClause(['dogs', 'cats', 'young-children']);
    assert.ok(clause.includes('dogs'));
    assert.ok(clause.includes('cats'));
    assert.ok(clause.includes('children'));
  });

  test('hayfever clause references pollen', () => {
    const clause = buildSafetyClause(['hayfever']);
    assert.ok(clause.includes('pollen') || clause.includes('allergen'));
  });

  test('skin-irritants clause references Euphorbia', () => {
    assert.ok(buildSafetyClause(['skin-irritants']).includes('Euphorbia'));
  });

});

// ─────────────────────────────────────────────
// buildStyleClause
// ─────────────────────────────────────────────
describe('buildStyleClause', () => {

  test('returns empty string for null', () => {
    assert.strictEqual(buildStyleClause(null), '');
  });

  test('returns empty string for unknown style', () => {
    assert.strictEqual(buildStyleClause('grunge'), '');
  });

  test('natural-wild mentions Oudolf', () => {
    assert.ok(buildStyleClause('natural-wild').includes('Oudolf'));
  });

  test('meticulous mentions clipped or formal element', () => {
    const clause = buildStyleClause('meticulous');
    assert.ok(clause.includes('clipped') || clause.includes('formal') || clause.includes('Buxus'));
  });

  test('cottage mentions roses or foxgloves', () => {
    const clause = buildStyleClause('cottage');
    assert.ok(clause.includes('rose') || clause.includes('foxglove') || clause.includes('Sissinghurst'));
  });

  test('mediterranean mentions lavender or rosemary', () => {
    const clause = buildStyleClause('mediterranean');
    assert.ok(clause.includes('lavender') || clause.includes('rosemary'));
  });

  test('modern-minimal mentions limited palette', () => {
    const clause = buildStyleClause('modern-minimal');
    assert.ok(clause.includes('palette') || clause.includes('minimal') || clause.includes('architectural'));
  });

  test('japanese-zen mentions moss or bamboo', () => {
    const clause = buildStyleClause('japanese-zen');
    assert.ok(clause.includes('bamboo') || clause.includes('moss') || clause.includes('maple'));
  });

  test('all valid styles return non-empty string', () => {
    ['natural-wild', 'meticulous', 'cottage', 'mediterranean', 'modern-minimal', 'japanese-zen'].forEach(style => {
      assert.ok(buildStyleClause(style).length > 0);
    });
  });

});

// ─────────────────────────────────────────────
// buildColourClause
// ─────────────────────────────────────────────
describe('buildColourClause', () => {

  test('returns empty string for empty array', () => {
    assert.strictEqual(buildColourClause([]), '');
  });

  test('returns empty string for null', () => {
    assert.strictEqual(buildColourClause(null), '');
  });

  test('white-silver palette mentioned', () => {
    assert.ok(buildColourClause(['white-silver']).includes('white'));
  });

  test('hot-bold palette mentioned', () => {
    const clause = buildColourClause(['hot-bold']);
    assert.ok(clause.includes('red') || clause.includes('bold') || clause.includes('dramatic'));
  });

  test('multiple palettes combined', () => {
    const clause = buildColourClause(['soft-pastel', 'cool-purple-blue']);
    assert.ok(clause.includes('pastel') || clause.includes('pink'));
    assert.ok(clause.includes('purple') || clause.includes('blue'));
  });

  test('filters out unknown colour keys', () => {
    const clause = buildColourClause(['rainbow', 'hot-bold']);
    assert.ok(clause.length > 0); // hot-bold valid
  });

  test('returns empty if all keys invalid', () => {
    assert.strictEqual(buildColourClause(['rainbow', 'invisible']), '');
  });

});

// ─────────────────────────────────────────────
// buildPlantTypeClause
// ─────────────────────────────────────────────
describe('buildPlantTypeClause', () => {

  test('returns empty string for empty array', () => {
    assert.strictEqual(buildPlantTypeClause([]), '');
  });

  test('fast-growing adds establishment timing requirement', () => {
    const clause = buildPlantTypeClause(['fast-growing']);
    assert.ok(clause.includes('season') || clause.includes('fast') || clause.includes('establish'));
  });

  test('evergreen adds year-round foliage requirement', () => {
    const clause = buildPlantTypeClause(['evergreen']);
    assert.ok(clause.includes('evergreen') || clause.includes('foliage'));
  });

  test('perennials mentioned for standard type', () => {
    assert.ok(buildPlantTypeClause(['perennials']).includes('perennial'));
  });

  test('climbers mentioned for climber type', () => {
    const clause = buildPlantTypeClause(['climbers']);
    assert.ok(clause.includes('climber') || clause.includes('wall'));
  });

  test('multiple types combined', () => {
    const clause = buildPlantTypeClause(['perennials', 'bulbs', 'grasses']);
    assert.ok(clause.includes('perennial'));
    assert.ok(clause.includes('bulb') || clause.includes('grass'));
  });

});

// ─────────────────────────────────────────────
// buildExtrasClause
// ─────────────────────────────────────────────
describe('buildExtrasClause', () => {

  test('returns empty string for empty array', () => {
    assert.strictEqual(buildExtrasClause([]), '');
  });

  test('companion-planting requests pairs', () => {
    const clause = buildExtrasClause(['companion-planting']);
    assert.ok(clause.includes('pair') || clause.includes('companion') || clause.includes('beneficial'));
  });

  test('avoid-combinations requests conflict section', () => {
    const clause = buildExtrasClause(['avoid-combinations']);
    assert.ok(clause.includes('conflict') || clause.includes('NOT') || clause.includes('avoid'));
  });

  test('invasive-warning mentions Buddleja', () => {
    assert.ok(buildExtrasClause(['invasive-warning']).includes('Buddleja'));
  });

  test('seasonal-succession requests calendar', () => {
    const clause = buildExtrasClause(['seasonal-succession']);
    assert.ok(clause.includes('season') || clause.includes('calendar') || clause.includes('month'));
  });

  test('all extras combined returns non-empty', () => {
    const clause = buildExtrasClause(['companion-planting', 'avoid-combinations', 'invasive-warning', 'seasonal-succession']);
    assert.ok(clause.length > 100);
  });

});

// ─────────────────────────────────────────────
// buildSystemPrompt
// ─────────────────────────────────────────────
describe('buildSystemPrompt', () => {

  test('returns non-empty string with no args', () => {
    assert.ok(buildSystemPrompt().length > 100);
  });

  test('includes base prompt content', () => {
    const prompt = buildSystemPrompt();
    assert.ok(prompt.includes('UK garden advisor'));
  });

  test('includes format instructions', () => {
    const prompt = buildSystemPrompt();
    assert.ok(prompt.includes('## Your garden conditions'));
  });

  test('includes safety clause when provided', () => {
    const prompt = buildSystemPrompt(null, { safety: ['dogs'] });
    assert.ok(prompt.includes('Foxglove') || prompt.includes('Digitalis'));
  });

  test('includes style clause when provided', () => {
    const prompt = buildSystemPrompt(null, { style: 'cottage' });
    assert.ok(prompt.includes('cottage') || prompt.includes('Sissinghurst'));
  });

  test('no extra whitespace when no refinements', () => {
    const prompt = buildSystemPrompt(null, null);
    assert.ok(!prompt.includes('\n\n\n')); // no triple newlines
  });

  test('handles empty refinements object', () => {
    const prompt = buildSystemPrompt(null, {});
    assert.ok(prompt.length > 100);
  });

});

// ─────────────────────────────────────────────
// buildSeasonalPrompt
// ─────────────────────────────────────────────
describe('buildSeasonalPrompt', () => {

  const profile = { location: 'Glasgow', soil: 'clay', aspect: 'west', goals: ['wildlife'] };

  test('includes location in prompt', () => {
    assert.ok(buildSeasonalPrompt(profile, 'spring').includes('Glasgow'));
  });

  test('includes season in prompt', () => {
    assert.ok(buildSeasonalPrompt(profile, 'spring').includes('spring'));
  });

  test('includes soil label', () => {
    assert.ok(buildSeasonalPrompt(profile, 'autumn').includes('clay') || buildSeasonalPrompt(profile, 'autumn').includes('heavy'));
  });

  test('all seasons produce non-empty output', () => {
    ['spring', 'summer', 'autumn', 'winter'].forEach(season => {
      assert.ok(buildSeasonalPrompt(profile, season).length > 50);
    });
  });

});

// ─────────────────────────────────────────────
// estimatePlantQuantity
// ─────────────────────────────────────────────
describe('estimatePlantQuantity', () => {

  test('returns null for unknown plant type', () => {
    assert.strictEqual(estimatePlantQuantity('magic-plant', 10), null);
  });

  test('returns null for zero area', () => {
    assert.strictEqual(estimatePlantQuantity('perennial_medium', 0), null);
  });

  test('returns null for negative area', () => {
    assert.strictEqual(estimatePlantQuantity('perennial_medium', -5), null);
  });

  test('returns null for null inputs', () => {
    assert.strictEqual(estimatePlantQuantity(null, 10), null);
  });

  test('bulb spacing is 15cm', () => {
    const result = estimatePlantQuantity('bulb', 10);
    assert.strictEqual(result.spacingCm, 15);
  });

  test('tree spacing is 300cm', () => {
    const result = estimatePlantQuantity('tree', 100);
    assert.strictEqual(result.spacingCm, 300);
  });

  test('quantity scales with area', () => {
    const small = estimatePlantQuantity('perennial_medium', 10);
    const large = estimatePlantQuantity('perennial_medium', 20);
    assert.ok(large.totalQuantity > small.totalQuantity);
  });

  test('total quantity is ceiling (never fractional)', () => {
    const result = estimatePlantQuantity('perennial_large', 7);
    assert.strictEqual(result.totalQuantity, Math.ceil(result.totalQuantity));
  });

  test('all defined plant types return valid result', () => {
    ['groundcover','perennial_small','perennial_medium','perennial_large','shrub_small',
     'shrub_medium','shrub_large','tree','bulb','annual','grass','climber_linear'].forEach(type => {
      const r = estimatePlantQuantity(type, 20);
      assert.ok(r !== null, `${type} should return result`);
      assert.ok(r.spacingCm > 0);
      assert.ok(r.totalQuantity > 0);
    });
  });

});

// ─────────────────────────────────────────────
// renderMarkdown
// ─────────────────────────────────────────────
describe('renderMarkdown', () => {

  test('returns empty string for empty input', () => {
    assert.strictEqual(renderMarkdown(''), '');
  });

  test('returns empty string for null', () => {
    assert.strictEqual(renderMarkdown(null), '');
  });

  test('converts ## headers to h3', () => {
    assert.ok(renderMarkdown('## My heading').includes('<h3>'));
  });

  test('converts **bold** to strong', () => {
    assert.ok(renderMarkdown('**bold text**').includes('<strong>'));
  });

  test('converts - lists to ul/li', () => {
    const result = renderMarkdown('- item one\n- item two');
    assert.ok(result.includes('<ul>'));
    assert.ok(result.includes('<li>'));
  });

  test('escapes HTML entities', () => {
    const result = renderMarkdown('A & B < C > D');
    assert.ok(result.includes('&amp;'));
    assert.ok(result.includes('&lt;'));
    assert.ok(result.includes('&gt;'));
  });

  test('does not allow raw script tags', () => {
    const result = renderMarkdown('<script>alert("xss")</script>');
    assert.ok(!result.includes('<script>'));
  });

});

// ─────────────────────────────────────────────
// formatShareText
// ─────────────────────────────────────────────
describe('formatShareText', () => {

  const profile = { location: 'Leeds', soil: 'clay', aspect: 'east', goals: ['colour', 'scent'] };
  const result = 'Some wonderful plant recommendations here...';
  const url = 'https://ygw.pages.dev';

  test('includes location', () => {
    assert.ok(formatShareText(profile, result, url).includes('Leeds'));
  });

  test('includes soil type', () => {
    assert.ok(formatShareText(profile, result, url).includes('clay'));
  });

  test('includes aspect', () => {
    assert.ok(formatShareText(profile, result, url).includes('east'));
  });

  test('includes URL', () => {
    assert.ok(formatShareText(profile, result, url).includes(url));
  });

  test('includes result preview', () => {
    assert.ok(formatShareText(profile, result, url).includes('wonderful'));
  });

  test('handles null result gracefully', () => {
    const text = formatShareText(profile, null, url);
    assert.ok(text.length > 0);
    assert.ok(text.includes(url));
  });

  test('truncates long result to 500 chars', () => {
    const longResult = 'x'.repeat(1000);
    const text = formatShareText(profile, longResult, url);
    assert.ok(text.includes('...'));
  });

});

// ─────────────────────────────────────────────
// Label map completeness checks
// ─────────────────────────────────────────────
describe('Label maps', () => {

  test('SOIL_LABELS has all 6 soil types', () => {
    ['clay','sandy','loam','chalky','peaty','unknown'].forEach(k => {
      assert.ok(SOIL_LABELS[k], `Missing soil label: ${k}`);
    });
  });

  test('ASPECT_LABELS has all 5 aspects', () => {
    ['south','north','east','west','mixed'].forEach(k => {
      assert.ok(ASPECT_LABELS[k], `Missing aspect label: ${k}`);
    });
  });

  test('GOAL_LABELS has all 8 goals', () => {
    ['colour','wildlife','veg','low-maintenance','privacy','entertaining','scent','year-round'].forEach(k => {
      assert.ok(GOAL_LABELS[k], `Missing goal label: ${k}`);
    });
  });

});

// ─────────────────────────────────────────────
// buildAugmentedSystemPrompt
// ─────────────────────────────────────────────
describe('buildAugmentedSystemPrompt', () => {

  const profile = { location: 'Bristol', soil: 'clay', aspect: 'north', goals: ['colour'] };

  // Mock loader that returns controlled content
  function mockLoader(files) {
    return async (path) => {
      const key = path.replace('./', '');
      if (files[key] !== undefined) return files[key];
      throw new Error(`Mock: file not found: ${path}`);
    };
  }

  test('returns a non-empty string for valid profile', async () => {
    const loader = mockLoader({});
    const result = await buildAugmentedSystemPrompt(profile, null, loader);
    assert.ok(typeof result === 'string');
    assert.ok(result.length > 0);
  });

  test('includes base prompt content', async () => {
    const loader = mockLoader({});
    const result = await buildAugmentedSystemPrompt(profile, null, loader);
    assert.ok(result.includes('garden') || result.includes('UK'));
  });

  test('injects soil knowledge when loader returns soil file', async () => {
    const loader = mockLoader({
      'knowledge/tier1/soil-types.md':
        '## Heavy clay\nSticky when wet. Amend with grit.\nWorks well with astilbe and hostas.\nAvoid drought-tolerant plants.'
    });
    const result = await buildAugmentedSystemPrompt(profile, null, loader);
    assert.ok(result.includes('SOIL KNOWLEDGE'));
    assert.ok(result.includes('Sticky when wet'));
  });

  test('injects aspect knowledge when loader returns aspect file', async () => {
    const loader = mockLoader({
      'knowledge/tier1/aspect-effects.md':
        '## North-facing\nChoose shade-tolerant species.\nFerns and hostas thrive here.\nAvoid sun-loving Mediterranean plants.'
    });
    const result = await buildAugmentedSystemPrompt(profile, null, loader);
    assert.ok(result.includes('ASPECT KNOWLEDGE'));
    assert.ok(result.includes('shade-tolerant'));
  });

  test('injects safety knowledge for dogs constraint', async () => {
    const refinements = { safety: ['dogs'] };
    const loader = mockLoader({
      'knowledge/tier1/hazardous-plants.md':
        '## Dogs — toxic plants\nFoxglove (Digitalis) — cardiac glycosides.\nYew (Taxus) — all parts toxic.\nLaburnum — seeds especially dangerous.'
    });
    const result = await buildAugmentedSystemPrompt(profile, refinements, loader);
    assert.ok(result.includes('SAFETY KNOWLEDGE'));
    assert.ok(result.includes('Foxglove'));
  });

  test('injects invasive species knowledge when invasive-warning extra set', async () => {
    const refinements = { extras: ['invasive-warning'] };
    const loader = mockLoader({
      'knowledge/tier1/invasive-species.md': '## Commonly sold but garden-invasive\nBuddleja spreads aggressively.'
    });
    const result = await buildAugmentedSystemPrompt(profile, refinements, loader);
    assert.ok(result.includes('INVASIVE SPECIES'));
    assert.ok(result.includes('Buddleja'));
  });

  test('injects companion planting knowledge for companion-planting extra', async () => {
    const refinements = { extras: ['companion-planting'] };
    const loader = mockLoader({
      'knowledge/tier1/companion-planting.md': 'Tomatoes grow well with basil.'
    });
    const result = await buildAugmentedSystemPrompt(profile, refinements, loader);
    assert.ok(result.includes('COMPANION PLANTING'));
    assert.ok(result.includes('basil'));
  });

  test('injects style knowledge when style set', async () => {
    const refinements = { style: 'natural-wild' };
    const loader = mockLoader({
      'knowledge/tier2/style-natural-wild.md': 'Oudolf planting philosophy. Use Piet Oudolf grasses.'
    });
    const result = await buildAugmentedSystemPrompt(profile, refinements, loader);
    assert.ok(result.includes('STYLE KNOWLEDGE BASE'));
    assert.ok(result.includes('Oudolf'));
  });

  test('degrades gracefully when soil loader throws', async () => {
    const loader = async () => { throw new Error('Network error'); };
    const result = await buildAugmentedSystemPrompt(profile, null, loader);
    assert.ok(typeof result === 'string');
    assert.ok(result.length > 0);
    assert.ok(!result.includes('SOIL KNOWLEDGE'));
  });

  test('degrades gracefully when all loaders throw', async () => {
    const loader = async () => { throw new Error('All files missing'); };
    const result = await buildAugmentedSystemPrompt(profile, null, loader);
    assert.ok(typeof result === 'string');
    assert.ok(result.length > 0);
  });

  test('null profile does not throw', async () => {
    const loader = mockLoader({});
    const result = await buildAugmentedSystemPrompt(null, null, loader);
    assert.ok(typeof result === 'string');
  });

  test('null refinements does not throw', async () => {
    const loader = mockLoader({});
    const result = await buildAugmentedSystemPrompt(profile, null, loader);
    assert.ok(typeof result === 'string');
  });

  test('empty refinements object does not throw', async () => {
    const loader = mockLoader({});
    const result = await buildAugmentedSystemPrompt(profile, {}, loader);
    assert.ok(typeof result === 'string');
  });

  test('combines soil, aspect, and safety knowledge in one call', async () => {
    const refinements = { safety: ['cats'] };
    const loader = mockLoader({
      'knowledge/tier1/soil-types.md':
        '## Heavy clay\nClay soil guidance here.\nAmend with organic matter.\nAvoid compaction.',
      'knowledge/tier1/aspect-effects.md':
        '## North-facing\nNorth-facing guidance here.\nChoose shade-tolerant species.\nAim for ferns and hostas.',
      'knowledge/tier1/hazardous-plants.md':
        '## Cats — toxic plants\nAll Lilium species are fatal to cats.\nDaffodil bulbs cause vomiting.\nYew berries are toxic.'
    });
    const result = await buildAugmentedSystemPrompt(profile, refinements, loader);
    assert.ok(result.includes('SOIL KNOWLEDGE'));
    assert.ok(result.includes('ASPECT KNOWLEDGE'));
    assert.ok(result.includes('SAFETY KNOWLEDGE'));
    assert.ok(result.includes('Lilium'));
  });

});

// ─────────────────────────────────────────────
// getCurrentUKSeason
// ─────────────────────────────────────────────
describe('getCurrentUKSeason', () => {

  const cases = [
    [3, 'spring'], [4, 'spring'], [5, 'spring'],
    [6, 'summer'], [7, 'summer'], [8, 'summer'],
    [9, 'autumn'], [10, 'autumn'], [11, 'autumn'],
    [12, 'winter'], [1, 'winter'], [2, 'winter']
  ];

  cases.forEach(([month, expectedSeason]) => {
    test(`month ${month} returns ${expectedSeason}`, () => {
      const date = new Date(2026, month - 1, 15);
      const result = getCurrentUKSeason(date);
      assert.strictEqual(result.season, expectedSeason);
    });
  });

  test('returns label string', () => {
    const result = getCurrentUKSeason(new Date(2026, 3, 1)); // April = spring
    assert.ok(typeof result.label === 'string' && result.label.length > 0);
  });

  test('returns cta string', () => {
    const result = getCurrentUKSeason(new Date(2026, 6, 1)); // July = summer
    assert.ok(result.cta.toLowerCase().includes('summer'));
  });

  test('returns loading string', () => {
    const result = getCurrentUKSeason(new Date(2026, 9, 1)); // October = autumn
    assert.ok(typeof result.loading === 'string' && result.loading.length > 0);
  });

  test('defaults to current date when no arg supplied', () => {
    const result = getCurrentUKSeason();
    assert.ok(['spring', 'summer', 'autumn', 'winter'].includes(result.season));
  });

});

// ─────────────────────────────────────────────
// buildSeasonalContext
// ─────────────────────────────────────────────
describe('buildSeasonalContext', () => {

  test('includes SEASONAL CONTEXT header', () => {
    const result = buildSeasonalContext('Bristol', new Date(2026, 2, 15)); // March = spring
    assert.ok(result.includes('SEASONAL CONTEXT'));
  });

  test('includes the correct month name', () => {
    const result = buildSeasonalContext('Bristol', new Date(2026, 9, 15)); // October
    assert.ok(result.includes('October'));
  });

  test('includes the correct season', () => {
    const result = buildSeasonalContext('Bristol', new Date(2026, 9, 15)); // autumn
    assert.ok(result.includes('autumn'));
  });

  test('includes DO NOW directive', () => {
    const result = buildSeasonalContext('Bristol', new Date(2026, 5, 1)); // June = summer
    assert.ok(result.includes('DO NOW'));
  });

  test('works without a location argument', () => {
    const result = buildSeasonalContext(undefined, new Date(2026, 0, 15)); // January = winter
    assert.ok(result.includes('winter'));
  });

  test('all four seasons produce output > 100 chars', () => {
    [[3, 2026], [6, 2026], [9, 2026], [12, 2026]].forEach(([month, year]) => {
      const result = buildSeasonalContext('London', new Date(year, month - 1, 1));
      assert.ok(result.length > 100);
    });
  });

  test('buildSystemPrompt includes seasonal context', () => {
    const profile = { location: 'Leeds', soil: 'loam', aspect: 'south', goals: ['colour'] };
    const date = new Date(2026, 9, 1); // October
    const prompt = buildSystemPrompt(profile, null, date);
    assert.ok(prompt.includes('SEASONAL CONTEXT'));
    assert.ok(prompt.includes('October'));
  });

});

// ─────────────────────────────────────────────
// extractSharePlants
// ─────────────────────────────────────────────
describe('extractSharePlants', () => {

  test('returns empty array for null', () => {
    assert.deepStrictEqual(extractSharePlants(null), []);
  });

  test('returns empty array for text with no bold', () => {
    assert.deepStrictEqual(extractSharePlants('Some plain text here'), []);
  });

  test('extracts bold plant names', () => {
    const result = extractSharePlants("Try **Rosa 'Gertrude Jekyll'** and **Salvia nemorosa**.");
    assert.ok(result.includes("Rosa 'Gertrude Jekyll'"));
    assert.ok(result.includes('Salvia nemorosa'));
  });

  test('returns maximum 5 names', () => {
    const text = '**Plant1** **Plant2** **Plant3** **Plant4** **Plant5** **Plant6**';
    assert.strictEqual(extractSharePlants(text).length, 5);
  });

  test('truncates names longer than 30 chars with ellipsis', () => {
    const longName = 'Abutilon megapotamicum Variegatum Extra';
    const result = extractSharePlants(`**${longName}**`);
    assert.ok(result[0].length <= 30);
    assert.ok(result[0].endsWith('\u2026'));
  });

  test('names of exactly 30 chars are not truncated', () => {
    const name30 = 'A'.repeat(30);
    const result = extractSharePlants(`**${name30}**`);
    assert.strictEqual(result[0], name30);
    assert.ok(!result[0].endsWith('\u2026'));
  });

  test('skips empty bold matches', () => {
    const result = extractSharePlants('** ** some text **Rosa canina**');
    assert.ok(!result.includes(''));
    assert.ok(result.includes('Rosa canina'));
  });

});

// ─────────────────────────────────────────────
// generateShareCard
// ─────────────────────────────────────────────
describe('generateShareCard', () => {

  function makeMockCanvas() {
    const ctx = {
      fillStyle: '', strokeStyle: '', lineWidth: 1, font: '', textAlign: 'left',
      fillRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {},
      save() {}, restore() {}, fill() {}, fillText() {},
      quadraticCurveTo() {}, closePath() {},
      measureText(t) { return { width: t.length * 10 }; }
    };
    return {
      width: 0, height: 0,
      getContext(type) { return type === '2d' ? ctx : null; },
      toBlob(cb, mime) { cb(new Blob(['fake'], { type: mime || 'image/png' })); }
    };
  }

  const profile = { location: 'Bristol', soil: 'clay', aspect: 'north', goals: ['colour'] };
  const result  = "**Rosa 'Gertrude Jekyll'** is perfect. **Salvia nemorosa** adds purple.";

  test('returns null when createCanvas not provided', async () => {
    const blob = await generateShareCard(profile, result, null, {});
    assert.strictEqual(blob, null);
  });

  test('returns null when createCanvas throws', async () => {
    const blob = await generateShareCard(profile, result, null, {
      createCanvas: () => { throw new Error('Canvas not supported'); }
    });
    assert.strictEqual(blob, null);
  });

  test('returns null when getContext returns null', async () => {
    const blob = await generateShareCard(profile, result, null, {
      createCanvas: () => ({ width: 0, height: 0, getContext: () => null })
    });
    assert.strictEqual(blob, null);
  });

  test('returns a Blob for valid profile and result', async () => {
    const blob = await generateShareCard(profile, result, null, {
      createCanvas: makeMockCanvas
    });
    assert.ok(blob instanceof Blob);
  });

  test('returns a Blob for null profile', async () => {
    const blob = await generateShareCard(null, result, null, {
      createCanvas: makeMockCanvas
    });
    assert.ok(blob instanceof Blob);
  });

  test('returns a Blob for empty result string', async () => {
    const blob = await generateShareCard(profile, '', null, {
      createCanvas: makeMockCanvas
    });
    assert.ok(blob instanceof Blob);
  });

  test('returns a Blob when result is null', async () => {
    const blob = await generateShareCard(profile, null, null, {
      createCanvas: makeMockCanvas
    });
    assert.ok(blob instanceof Blob);
  });

  test('sets canvas dimensions to 1080x1080', async () => {
    let capturedCanvas;
    await generateShareCard(profile, result, null, {
      createCanvas: () => {
        const c = makeMockCanvas();
        capturedCanvas = c;
        return c;
      }
    });
    assert.strictEqual(capturedCanvas.width, 1080);
    assert.strictEqual(capturedCanvas.height, 1080);
  });

});

// ─────────────────────────────────────────────
// buildGrowthHorizonContext
// ─────────────────────────────────────────────
describe('buildGrowthHorizonContext', () => {

  test('returns empty string for null', () => {
    assert.strictEqual(buildGrowthHorizonContext(null), '');
  });

  test('returns empty string for undefined', () => {
    assert.strictEqual(buildGrowthHorizonContext(undefined), '');
  });

  test('returns empty string for invalid value', () => {
    assert.strictEqual(buildGrowthHorizonContext('20yr'), '');
  });

  test('returns empty string for empty string', () => {
    assert.strictEqual(buildGrowthHorizonContext(''), '');
  });

  test('2yr returns fragment mentioning quick/fast', () => {
    const result = buildGrowthHorizonContext('2yr');
    assert.ok(result.length > 0);
    assert.ok(result.toLowerCase().includes('quick') || result.toLowerCase().includes('fast'));
  });

  test('5yr returns fragment mentioning balanced', () => {
    const result = buildGrowthHorizonContext('5yr');
    assert.ok(result.length > 0);
    assert.ok(result.toLowerCase().includes('balanced') || result.toLowerCase().includes('steadily'));
  });

  test('10yr returns fragment mentioning legacy or long', () => {
    const result = buildGrowthHorizonContext('10yr');
    assert.ok(result.length > 0);
    assert.ok(result.toLowerCase().includes('legacy') || result.toLowerCase().includes('long term'));
  });

  test('buildSystemPrompt injects horizon clause when profile has horizon', () => {
    const profile = { location: 'London', horizon: '10yr' };
    const prompt = buildSystemPrompt(profile, null, new Date('2025-06-01'));
    assert.ok(prompt.includes('LEGACY'));
  });

  test('buildSystemPrompt omits horizon clause when profile has no horizon', () => {
    const profile = { location: 'London', horizon: null };
    const prompt = buildSystemPrompt(profile, null, new Date('2025-06-01'));
    assert.ok(!prompt.includes('GROWTH HORIZON'));
  });

  test('buildGardenProfile passes valid horizon through', () => {
    const state = { location: 'Bristol', soil: 'clay', aspect: 'south', goals: ['colour'], horizon: '5yr' };
    const profile = buildGardenProfile(state);
    assert.strictEqual(profile.horizon, '5yr');
  });

  test('buildGardenProfile sets horizon null for invalid value', () => {
    const state = { location: 'Bristol', soil: 'clay', aspect: 'south', goals: ['colour'], horizon: 'bad' };
    const profile = buildGardenProfile(state);
    assert.strictEqual(profile.horizon, null);
  });

  test('buildGardenProfile sets horizon null when absent', () => {
    const state = { location: 'Bristol', soil: 'clay', aspect: 'south', goals: ['colour'] };
    const profile = buildGardenProfile(state);
    assert.strictEqual(profile.horizon, null);
  });

  test('buildUserMessage includes horizon line when set', () => {
    const profile = { location: 'Bristol', soil: 'clay', aspect: 'south', goals: ['colour'], horizon: '2yr' };
    const msg = buildUserMessage(profile);
    assert.ok(msg.includes('Growth horizon'));
    assert.ok(msg.includes('Quick impact'));
  });

  test('buildUserMessage omits horizon line when null', () => {
    const profile = { location: 'Bristol', soil: 'clay', aspect: 'south', goals: ['colour'], horizon: null };
    const msg = buildUserMessage(profile);
    assert.ok(!msg.includes('Growth horizon'));
  });

});
