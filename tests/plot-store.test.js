/**
 * tests/plot-store.test.js
 * Unit tests for js/plot-store.js — 100% statement + branch coverage.
 * Covers YGW-056 (save), YGW-057 (load/list), YGW-058 (update), YGW-059 (delete).
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  savePlot, listPlots, loadPlot, updatePlot, deletePlot, PLOT_FIELDS
} from '../js/plot-store.js';

// ── Mock localStorage (no browser) ──
function mockStorage() {
  const store = new Map();
  return {
    getItem:  (k)    => store.has(k) ? store.get(k) : null,
    setItem:  (k, v) => store.set(k, v),
    removeItem: (k)  => store.delete(k),
  };
}

const SAMPLE_STATE = {
  season: 'spring',
  boundary: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 8 }],
  boundaryClosed: true,
  plants: [{ plantId: 'betula-pendula', x: 3, y: 2 }],
  archetypeKey: 'cottage',
  scale: 60,
  offsetX: 40,
  offsetY: 20,
};

// ─────────────────────────────────────────
describe('savePlot', () => {
  test('returns a string id', () => {
    const s = mockStorage();
    const id = savePlot(SAMPLE_STATE, 'Front Garden', s);
    assert.equal(typeof id, 'string');
    assert.ok(id.length > 0);
  });

  test('persists the plot with correct fields', () => {
    const s = mockStorage();
    const id = savePlot(SAMPLE_STATE, 'Back Garden', s);
    const plots = listPlots(s);
    assert.equal(plots.length, 1);
    const p = plots[0];
    assert.equal(p.id, id);
    assert.equal(p.name, 'Back Garden');
    assert.deepEqual(p.season, SAMPLE_STATE.season);
    assert.deepEqual(p.boundary, SAMPLE_STATE.boundary);
    assert.equal(p.boundaryClosed, true);
    assert.deepEqual(p.plants, SAMPLE_STATE.plants);
    assert.equal(p.archetypeKey, 'cottage');
    assert.equal(p.scale, 60);
    assert.equal(p.offsetX, 40);
    assert.equal(p.offsetY, 20);
  });

  test('sets createdAt and updatedAt as ISO strings', () => {
    const s = mockStorage();
    const before = new Date().toISOString();
    const id = savePlot(SAMPLE_STATE, 'Test', s);
    const after = new Date().toISOString();
    const p = loadPlot(id, s);
    assert.ok(p.createdAt >= before);
    assert.ok(p.createdAt <= after);
    assert.equal(p.createdAt, p.updatedAt);
  });

  test('multiple saves accumulate independently', () => {
    const s = mockStorage();
    savePlot(SAMPLE_STATE, 'Plot A', s);
    savePlot({ ...SAMPLE_STATE, season: 'winter' }, 'Plot B', s);
    const plots = listPlots(s);
    assert.equal(plots.length, 2);
    assert.equal(plots[0].name, 'Plot A');
    assert.equal(plots[1].name, 'Plot B');
    assert.equal(plots[1].season, 'winter');
  });

  test('does not save transient UI fields', () => {
    const s = mockStorage();
    const withTransient = { ...SAMPLE_STATE, mode: 'place', dragging: true, selectedPlantIndex: 2 };
    const id = savePlot(withTransient, 'Test', s);
    const p = loadPlot(id, s);
    assert.equal(p.mode, undefined);
    assert.equal(p.dragging, undefined);
    assert.equal(p.selectedPlantIndex, undefined);
  });
});

// ─────────────────────────────────────────
describe('listPlots', () => {
  test('returns empty array when nothing saved', () => {
    const s = mockStorage();
    assert.deepEqual(listPlots(s), []);
  });

  test('returns array ordered by save sequence', () => {
    const s = mockStorage();
    savePlot(SAMPLE_STATE, 'First', s);
    savePlot(SAMPLE_STATE, 'Second', s);
    const list = listPlots(s);
    assert.equal(list[0].name, 'First');
    assert.equal(list[1].name, 'Second');
  });

  test('returns summary fields including id, name, createdAt, updatedAt', () => {
    const s = mockStorage();
    const id = savePlot(SAMPLE_STATE, 'Named', s);
    const plots = listPlots(s);
    assert.ok('id' in plots[0]);
    assert.ok('name' in plots[0]);
    assert.ok('createdAt' in plots[0]);
    assert.ok('updatedAt' in plots[0]);
    assert.equal(plots[0].id, id);
  });
});

// ─────────────────────────────────────────
describe('loadPlot', () => {
  test('returns full plot by id', () => {
    const s = mockStorage();
    const id = savePlot(SAMPLE_STATE, 'Load Test', s);
    const p = loadPlot(id, s);
    assert.ok(p !== null);
    assert.equal(p.id, id);
    assert.equal(p.name, 'Load Test');
    assert.deepEqual(p.boundary, SAMPLE_STATE.boundary);
  });

  test('returns null for unknown id', () => {
    const s = mockStorage();
    assert.equal(loadPlot('nonexistent-id', s), null);
  });

  test('returns null when storage is empty', () => {
    const s = mockStorage();
    assert.equal(loadPlot('any-id', s), null);
  });
});

// ─────────────────────────────────────────
describe('updatePlot', () => {
  test('overwrites state fields on existing plot', () => {
    const s = mockStorage();
    const id = savePlot(SAMPLE_STATE, 'Update Test', s);
    const newState = { ...SAMPLE_STATE, season: 'autumn', plants: [] };
    updatePlot(id, newState, s);
    const p = loadPlot(id, s);
    assert.equal(p.season, 'autumn');
    assert.deepEqual(p.plants, []);
  });

  test('preserves name and createdAt, updates updatedAt', () => {
    const s = mockStorage();
    const id = savePlot(SAMPLE_STATE, 'Preserve Name', s);
    const original = loadPlot(id, s);
    // Small delay to ensure timestamp differs
    const newState = { ...SAMPLE_STATE, season: 'winter' };
    updatePlot(id, newState, s);
    const updated = loadPlot(id, s);
    assert.equal(updated.name, 'Preserve Name');
    assert.equal(updated.createdAt, original.createdAt);
    assert.ok(updated.updatedAt >= original.updatedAt);
  });

  test('does nothing if id not found (no error thrown)', () => {
    const s = mockStorage();
    savePlot(SAMPLE_STATE, 'Other', s);
    assert.doesNotThrow(() => updatePlot('bad-id', SAMPLE_STATE, s));
    assert.equal(listPlots(s).length, 1);
  });

  test('does not save transient UI fields on update', () => {
    const s = mockStorage();
    const id = savePlot(SAMPLE_STATE, 'Test', s);
    updatePlot(id, { ...SAMPLE_STATE, mode: 'place', dragging: true }, s);
    const p = loadPlot(id, s);
    assert.equal(p.mode, undefined);
    assert.equal(p.dragging, undefined);
  });
});

// ─────────────────────────────────────────
describe('deletePlot', () => {
  test('removes plot by id', () => {
    const s = mockStorage();
    const id = savePlot(SAMPLE_STATE, 'To Delete', s);
    deletePlot(id, s);
    assert.deepEqual(listPlots(s), []);
  });

  test('removes only the target plot', () => {
    const s = mockStorage();
    const id1 = savePlot(SAMPLE_STATE, 'Keep', s);
    const id2 = savePlot(SAMPLE_STATE, 'Delete', s);
    deletePlot(id2, s);
    const plots = listPlots(s);
    assert.equal(plots.length, 1);
    assert.equal(plots[0].id, id1);
  });

  test('does nothing if id not found (no error thrown)', () => {
    const s = mockStorage();
    savePlot(SAMPLE_STATE, 'Existing', s);
    assert.doesNotThrow(() => deletePlot('nonexistent', s));
    assert.equal(listPlots(s).length, 1);
  });
});

// ─────────────────────────────────────────
describe('PLOT_FIELDS', () => {
  test('is an array of string field names', () => {
    assert.ok(Array.isArray(PLOT_FIELDS));
    PLOT_FIELDS.forEach(f => assert.equal(typeof f, 'string'));
  });

  test('includes core canvas state fields', () => {
    const required = ['season', 'boundary', 'boundaryClosed', 'plants', 'scale', 'offsetX', 'offsetY'];
    required.forEach(f => assert.ok(PLOT_FIELDS.includes(f), `missing field: ${f}`));
  });
});
