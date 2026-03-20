/**
 * js/plot-store.js
 * Persistent plot save/load/update/delete via localStorage.
 * Pure functions — storage injected for testability (default: window.localStorage).
 * YGW-056 (save), YGW-057 (load/list), YGW-058 (update), YGW-059 (delete).
 */

const STORAGE_KEY = 'ygw_plots';

/** Canvas state fields persisted to storage. Transient UI fields excluded. */
export const PLOT_FIELDS = [
  'season', 'boundary', 'boundaryClosed', 'plants',
  'archetypeKey', 'scale', 'offsetX', 'offsetY',
];

function pickFields(state) {
  const out = {};
  PLOT_FIELDS.forEach(k => { if (k in state) out[k] = state[k]; });
  return out;
}

function readAll(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeAll(plots, storage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(plots));
}

/**
 * Save a new named plot. Returns the generated plot id.
 * @param {object} state  — canvas state object
 * @param {string} name   — display name chosen by user
 * @param {object} storage — injectable storage (default: localStorage)
 */
export function savePlot(state, name, storage = localStorage) {
  const plots = readAll(storage);
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  plots.push({ id, name, createdAt: now, updatedAt: now, ...pickFields(state) });
  writeAll(plots, storage);
  return id;
}

/**
 * List all saved plots (summary — all fields are included).
 * @param {object} storage
 * @returns {Array<{id, name, createdAt, updatedAt, ...}>}
 */
export function listPlots(storage = localStorage) {
  return readAll(storage);
}

/**
 * Load a single plot by id.
 * @param {string} id
 * @param {object} storage
 * @returns {object|null}
 */
export function loadPlot(id, storage = localStorage) {
  return readAll(storage).find(p => p.id === id) ?? null;
}

/**
 * Overwrite the canvas state fields on an existing plot. Preserves name + createdAt.
 * @param {string} id
 * @param {object} state  — new canvas state
 * @param {object} storage
 */
export function updatePlot(id, state, storage = localStorage) {
  const plots = readAll(storage).map(p =>
    p.id === id
      ? { ...p, ...pickFields(state), updatedAt: new Date().toISOString() }
      : p
  );
  writeAll(plots, storage);
}

/**
 * Delete a plot by id. No-op if id not found.
 * @param {string} id
 * @param {object} storage
 */
export function deletePlot(id, storage = localStorage) {
  writeAll(readAll(storage).filter(p => p.id !== id), storage);
}
