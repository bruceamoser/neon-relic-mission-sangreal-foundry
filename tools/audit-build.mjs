#!/usr/bin/env node
/**
 * Build audit for Mission: Sangreal.
 *
 * Verifies the compiled `dist/` against the module manifest and the mission's
 * content inventory. Run after `npm run build`:
 *
 *   npm run audit
 *
 * Checks:
 *   1. Manifest pack list ↔ dist/packs directories match exactly (no orphans).
 *   2. Per-pack document counts match the content plan.
 *   3. LevelDB key formats match the Foundry v14 layout
 *      (!items!, !actors!, !journal!, !journal.pages!, !tables!, !tables.results!).
 *   4. Coverage sweep over source YAML: I1–I17, L1–L7, O1–O2, M1–M5, CT1–CT3,
 *      and the fracture table.
 *
 * Exit codes: 0 = audit passed, 1 = gaps found.
 */
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ClassicLevel } from 'classic-level';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PACKS_DIR = path.join(DIST, 'packs');
const SRC_PACKS = path.join(ROOT, 'src', 'packs');

/** Expected top-level document counts per pack (children excluded). */
const EXPECTED_DOCS = {
  'sangreal-briefs': 4,
  'sangreal-npcs': 16,
  'sangreal-clues': 45,
  'sangreal-sites': 9,
  'sangreal-relics': 10,
  'sangreal-tables': 1,
  'sangreal-journals': 4,
  'sangreal-scenes': 1,
};

/** Expected child-entry counts (journal pages, table results). */
const EXPECTED_CHILDREN = {
  'sangreal-tables': { prefix: '!tables.results!', count: 4 },
  'sangreal-journals': { prefix: '!journal.pages!', count: 25 },
};

/** Cross-reference UUID array fields produced from authoring slug fields. */
const LINK_FIELDS = [
  'npcUuids',
  'locationUuids',
  'organizationUuids',
  'informationCardUuids',
  'foundAtUuids',
  'knownByUuids',
  'startingKnowledgeUuids',
  'gainedKnowledgeUuids',
];

const errors = [];
const notes = [];

/** Read all entries of a LevelDB pack as [key, value] pairs. */
async function packEntries(packPath) {
  const db = new ClassicLevel(packPath, { keyEncoding: 'utf8', valueEncoding: 'json' });
  const entries = [];
  for await (const [key, value] of db.iterator()) entries.push([key, value]);
  await db.close();
  return entries.sort((a, b) => a[0].localeCompare(b[0]));
}

async function audit() {
  // 1. Manifest ↔ dist sync.
  const manifest = await fs.readJSON(path.join(DIST, 'module.json'));
  const declaredPaths = manifest.packs.map((p) => path.basename(p.path)).sort();
  const actualDirs = (await fs.readdir(PACKS_DIR)).sort();
  if (JSON.stringify(declaredPaths) !== JSON.stringify(actualDirs)) {
    errors.push(`manifest packs [${declaredPaths}] ≠ dist/packs dirs [${actualDirs}]`);
  } else {
    notes.push(`pack sync: ${declaredPaths.length} declared packs all present`);
  }

  // 2 + 3. Per-pack counts, key formats, and cross-links.
  let linkCount = 0;
  const badLinks = [];
  for (const [pack, expected] of Object.entries(EXPECTED_DOCS)) {
    const packPath = path.join(PACKS_DIR, pack);
    if (!(await fs.pathExists(packPath))) {
      errors.push(`${pack}: missing compiled pack directory`);
      continue;
    }
    const entries = await packEntries(packPath);
    const keys = entries.map(([key]) => key);
    const top = keys.filter((k) => !k.slice(1).includes('.'));
    if (top.length !== expected) {
      errors.push(`${pack}: expected ${expected} documents, found ${top.length}`);
    } else {
      notes.push(`${pack}: ${expected} documents`);
    }

    const childSpec = EXPECTED_CHILDREN[pack];
    if (childSpec) {
      const children = keys.filter((k) => k.startsWith(childSpec.prefix));
      if (children.length !== childSpec.count) {
        errors.push(`${pack}: expected ${childSpec.count} ${childSpec.prefix} entries, found ${children.length}`);
      } else {
        notes.push(`${pack}: ${childSpec.count} ${childSpec.prefix} entries`);
      }
    }

    for (const key of keys) {
      const ok = /^!(items|actors|journal|journal\.pages|tables|tables\.results|macros|scenes)!/u.test(key);
      if (!ok) errors.push(`${pack}: unexpected key format "${key}"`);
    }

    // Cross-link integrity: no unresolved authoring fields, UUIDs point inside this module.
    for (const [key, value] of entries) {
      if (!(key.startsWith('!items!') || key.startsWith('!actors!'))) continue;
      const sys = value?.system ?? {};
      for (const [field, v] of Object.entries(sys)) {
        if (field.endsWith('Slugs')) badLinks.push(`${key}: unresolved authoring field "${field}"`);
        if (!LINK_FIELDS.includes(field)) continue;
        if (!Array.isArray(v)) continue;
        linkCount += v.length;
        for (const uuid of v) {
          if (typeof uuid !== 'string' || !uuid.startsWith(`Compendium.${manifest.id}.`)) {
            badLinks.push(`${key}.${field}: bad uuid "${uuid}"`);
          }
        }
      }
    }
  }
  if (badLinks.length) errors.push(...badLinks.slice(0, 10));
  if (linkCount < 40) errors.push(`cross-links: expected at least 40 populated UUIDs, found ${linkCount}`);
  else notes.push(`cross-links: ${linkCount} UUIDs populated and well-formed`);

  // 4. Coverage sweep over source YAML.
  const sourceText = (
    await Promise.all(
      (await fs.readdir(SRC_PACKS))
        .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
        .map((f) => fs.readFile(path.join(SRC_PACKS, f), 'utf8')),
    )
  ).join('\n');

  const coverage = [];
  for (let i = 1; i <= 17; i++) coverage.push([`card I-${i}`, `cardId: I-${i}`]);
  for (let i = 1; i <= 7; i++) coverage.push([`location L${i}`, `locationId: L${i}`]);
  coverage.push(['org O1', 'organizationId: O1'], ['org O2', 'organizationId: O2']);
  // Relic milestones M1–M5 fire on days 10, 8, 6, 4, 2; day 1 is the terminal window.
  for (const d of [10, 8, 6, 4, 2, 1]) coverage.push([`milestone day ${d}`, `day: ${d}`]);
  for (let t = 1; t <= 3; t++) coverage.push([`containment truth CT${t}`, `CT${t}`]);

  const missing = coverage.filter(([, needle]) => !sourceText.includes(needle)).map(([label]) => label);
  if (missing.length) {
    errors.push(`coverage sweep missing: ${missing.join(', ')}`);
  } else {
    notes.push(`coverage sweep: ${coverage.length} checks passed`);
  }
  if (!sourceText.includes('Phial Fracture (d6)')) errors.push('coverage sweep missing: fracture table');

  // Report.
  for (const n of notes) console.log(`audit | OK — ${n}`);
  if (errors.length) {
    console.error(`audit | FAILED — ${errors.length} gap(s):`);
    for (const e of errors) console.error(`  ✖ ${e}`);
    process.exit(1);
  }
  console.log('audit | PASS — build, packs, and coverage verified');
}

audit().catch((err) => {
  console.error('audit | crashed');
  console.error(err);
  process.exit(1);
});
