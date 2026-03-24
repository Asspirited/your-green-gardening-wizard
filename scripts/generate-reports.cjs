#!/usr/bin/env node
/**
 * scripts/generate-reports.js
 * Generates two stakeholder reports from docs/ygw-backlog.md and docs/ygw-wastelog.md
 * Outputs dated Markdown files to /mnt/c/Users/roden/Downloads/
 *
 * Usage:
 *   node scripts/generate-reports.js
 *
 * Outputs:
 *   ygw-backlog-report-YYYY-MM-DD.md   — Open / Completed / Deferred sections
 *   ygw-waste-report-YYYY-MM-DD.md     — Open / Resolved sections
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT     = path.resolve(__dirname, '..');
const OUT_DIR  = '/mnt/c/Users/roden/Downloads';
const TODAY    = new Date().toISOString().slice(0, 10);

// ── 1. Parse backlog ──────────────────────────────────────────────────────────

function parseBacklog(text) {
  const items = [];

  // Collect notes: lines like  > **YGW-NNN:** description text
  const notes = {};
  const noteRe = /^> \*\*(YGW-\d+):\*\* ([^\n]+)/gm;
  let m;
  while ((m = noteRe.exec(text)) !== null) {
    notes[m[1]] = m[2].trim();
  }

  // Collect table rows — any pipe-delimited line whose first non-pipe token is YGW-\d+
  const lines = text.split('\n');
  for (const line of lines) {
    if (!line.includes('YGW-') || line.startsWith('|---') || line.startsWith('| ID') || line.startsWith('| Rank')) continue;
    const cols = line.split('|').map(c => c.trim()).filter(Boolean);

    // Find the ID column
    const id = cols.find(c => /^YGW-\d+$/.test(c));
    if (!id) continue;

    const idIdx = cols.indexOf(id);
    const title = cols[idIdx + 1] || '';
    if (!title || title === 'Title') continue;

    // Score: first column that looks like a number (e.g. 8.0, 11.5)
    const scoreCol = cols.find(c => /^\d+(\.\d+)?$/.test(c));
    const score    = scoreCol ? parseFloat(scoreCol) : 0;

    // Status: column containing a status emoji
    const statusCol = cols.find(c => /✅|📋|⏸|💡|🔨/.test(c)) || '';
    let status = 'Unknown';
    if (statusCol.includes('✅'))     status = 'Done';
    else if (statusCol.includes('🔨')) status = 'Building';
    else if (statusCol.includes('📋')) status = 'Open';
    else if (statusCol.includes('⏸')) status = 'Deferred';
    else if (statusCol.includes('💡')) status = 'Idea';

    // Description: from > **YGW-NNN:** note, else trim title
    const description = notes[id] || title;

    items.push({ id, title: title.replace(/\*\*/g, ''), score, status, description });
  }

  // Deduplicate (same ID can appear in EPIC table and priority queue)
  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

// ── 2. Parse waste log ────────────────────────────────────────────────────────

function parseWasteLog(text) {
  const items = [];
  // Split on ## WL- section headers
  const sections = text.split(/(?=^## WL-)/m).filter(s => s.startsWith('## WL-'));

  for (const section of sections) {
    const idTitleMatch = section.match(/^## (WL-\d+) — (.+)/m);
    if (!idTitleMatch) continue;
    const id    = idTitleMatch[1];
    const title = idTitleMatch[2].trim();

    const statusMatch   = section.match(/\*\*Status:\*\*\s*(.+)/);
    const severityMatch = section.match(/\*\*Severity:\*\*\s*(\d+)/);
    const costMatch     = section.match(/### What it cost\n([\s\S]+?)(?=\n###|\n---|\n## |$)/);
    const happenedMatch = section.match(/### What happened\n([\s\S]+?)(?=\n###|\n---|\n## |$)/);

    const rawStatus = statusMatch ? statusMatch[1].trim() : 'Open';
    const isFixed   = rawStatus.toLowerCase().startsWith('fixed');
    const fixedDate = isFixed ? (rawStatus.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '') : '';
    const status    = isFixed ? 'Fixed' : 'Open';
    const severity  = severityMatch ? parseInt(severityMatch[1], 10) : 0;
    // Prefer "What it cost"; fall back to "What happened"
    const costText = costMatch     ? costMatch[1].replace(/\n/g, ' ').trim() : '';
    const hapText  = happenedMatch ? happenedMatch[1].replace(/\n/g, ' ').trim() : '';
    const cost     = costText || hapText;

    items.push({ id, title, status, severity, fixedDate, description: cost });
  }

  return items.sort((a, b) => {
    const numA = parseInt(a.id.replace('WL-', ''), 10);
    const numB = parseInt(b.id.replace('WL-', ''), 10);
    return numA - numB;
  });
}

// ── 3. Format helpers ─────────────────────────────────────────────────────────

function truncate(str, n) {
  if (!str) return '—';
  return str.length <= n ? str : str.slice(0, n - 1) + '…';
}

function mdTable(headers, rows) {
  if (!rows.length) return '_None._\n';
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map(r => (r[i] || '').length)));
  const pad    = (s, w) => (s || '').padEnd(w);
  const sep    = widths.map(w => '-'.repeat(w));
  const fmt    = row => '| ' + row.map((c, i) => pad(c, widths[i])).join(' | ') + ' |';
  return [fmt(headers), fmt(sep), ...rows.map(fmt)].join('\n') + '\n';
}

// ── 4. Generate backlog report ────────────────────────────────────────────────

function generateBacklogReport(items) {
  const open      = items.filter(i => i.status === 'Open' || i.status === 'Building').sort((a, b) => b.score - a.score);
  const done      = items.filter(i => i.status === 'Done');
  const deferred  = items.filter(i => i.status === 'Deferred' || i.status === 'Idea');

  const headers = ['ID', 'Title', 'Description', 'CD3'];

  const toRow = i => [i.id, truncate(i.title, 55), truncate(i.description, 80), i.score ? i.score.toFixed(1) : '—'];

  return `# YGW Backlog Report
**Generated:** ${TODAY}
**Product:** Your Green Gardening Wizard
**Formula:** CD3 = (Customer value + Dependencies − Complexity) + (SWOT × 1.5)

---

## Open — prioritised by CD3 score

${mdTable(headers, open.map(toRow))}

---

## Completed

${mdTable(headers, done.map(toRow))}

---

## Deferred / Descoped

${mdTable(headers, deferred.map(toRow))}

---

_${items.length} total items · ${open.length} open · ${done.length} completed · ${deferred.length} deferred_
`;
}

// ── 5. Generate waste report ──────────────────────────────────────────────────

function generateWasteReport(items) {
  const open   = items.filter(i => i.status === 'Open').sort((a, b) => b.severity - a.severity);
  const fixed  = items.filter(i => i.status === 'Fixed').sort((a, b) => (b.fixedDate || '').localeCompare(a.fixedDate || ''));

  const headers = ['ID', 'Title', 'Description (cost)', 'Severity'];
  const toRow   = i => [i.id, truncate(i.title, 55), truncate(i.description, 80), i.severity ? `${i.severity}/10` : '—'];

  return `# YGW Waste Log Report
**Generated:** ${TODAY}
**Product:** Your Green Gardening Wizard
**Severity scale:** 1–10 (10 = whole session lost / commercial damage)

---

## Open — prioritised by severity

${mdTable(headers, open.map(toRow))}

---

## Resolved

${mdTable(headers, fixed.map(toRow))}

---

_${items.length} total items · ${open.length} open · ${fixed.length} resolved_
`;
}

// ── 6. Main ───────────────────────────────────────────────────────────────────

function main() {
  const backlogText = fs.readFileSync(path.join(ROOT, 'docs', 'ygw-backlog.md'), 'utf8');
  const wasteText   = fs.readFileSync(path.join(ROOT, 'docs', 'ygw-wastelog.md'), 'utf8');

  const backlogItems = parseBacklog(backlogText);
  const wasteItems   = parseWasteLog(wasteText);

  const backlogReport = generateBacklogReport(backlogItems);
  const wasteReport   = generateWasteReport(wasteItems);

  const backlogOut = path.join(OUT_DIR, `ygw-backlog-report-${TODAY}.md`);
  const wasteOut   = path.join(OUT_DIR, `ygw-waste-report-${TODAY}.md`);

  fs.writeFileSync(backlogOut, backlogReport, 'utf8');
  fs.writeFileSync(wasteOut,   wasteReport,   'utf8');

  console.log(`✅  Backlog report → ${backlogOut}`);
  console.log(`    ${backlogItems.filter(i => i.status === 'Open' || i.status === 'Building').length} open · ${backlogItems.filter(i => i.status === 'Done').length} done · ${backlogItems.filter(i => i.status === 'Deferred' || i.status === 'Idea').length} deferred`);
  console.log(`✅  Waste report   → ${wasteOut}`);
  console.log(`    ${wasteItems.filter(i => i.status === 'Open').length} open · ${wasteItems.filter(i => i.status === 'Fixed').length} resolved`);
}

main();
