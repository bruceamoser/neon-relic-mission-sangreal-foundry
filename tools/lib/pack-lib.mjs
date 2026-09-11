/**
 * Shared pack utilities for Mission: Sangreal.
 *
 * Mirrors the Neon Relic system's `gulpfile.js` pack compiler so module
 * compendium packs match the system's Foundry VTT v14 LevelDB format exactly:
 *   - deterministic 16-char document IDs (SHA-256 → Base62) from YAML `_id` slugs
 *   - journals store pages as separate `!journal.pages!<id>.<pageId>` entries
 *   - roll tables store results as separate `!tables.results!<id>.<resultId>` entries
 *   - items fall back to the system's per-type default icons
 *
 * @module tools/lib/pack-lib
 */
import crypto from 'node:crypto';

/* ------------------------------------------ */
/*  Document type sets                        */
/* ------------------------------------------ */

/** Item sub-types provided by the neon-relic system. */
export const ITEM_TYPES = new Set([
  'weapon',
  'armor',
  'gear',
  'consumable',
  'artifact',
  'talent',
  'criticalInjury',
  'anchor',
  'darkSecret',
  'upgrade',
  'location',
  'informationCard',
  'playerCaseBrief',
  'daCaseBrief',
  'subdivision',
  'organization',
  'relicSheet',
]);

/** Actor sub-types provided by the neon-relic system. */
export const ACTOR_TYPES = new Set(['agent', 'npc', 'mob', 'vehicle', 'headquarters']);

/**
 * Default icon per item type — paths point at the neon-relic system's assets.
 * Kept in sync with `foundry-neon-relic-system/src/system/item-icons.mjs`.
 */
export const ITEM_DEFAULT_ICONS = {
  weapon: 'systems/neon-relic/assets/icons/weapon-default.svg',
  armor: 'systems/neon-relic/assets/icons/armor-default.svg',
  gear: 'systems/neon-relic/assets/icons/gear-default.svg',
  talent: 'systems/neon-relic/assets/icons/talent-default.svg',
  artifact: 'systems/neon-relic/assets/icons/artifact-default.svg',
  upgrade: 'systems/neon-relic/assets/icons/facility-default.svg',
  consumable: 'systems/neon-relic/assets/icons/consumable-default.svg',
  criticalInjury: 'systems/neon-relic/assets/icons/critical-injury-default.svg',
  anchor: 'systems/neon-relic/assets/icons/anchor-default.svg',
  darkSecret: 'systems/neon-relic/assets/icons/dark-secret-default.svg',
  location: 'systems/neon-relic/assets/icons/location-default.svg',
  informationCard: 'systems/neon-relic/assets/icons/information-card-default.svg',
  playerCaseBrief: 'systems/neon-relic/assets/icons/player-case-brief-default.svg',
  daCaseBrief: 'systems/neon-relic/assets/icons/da-case-brief-default.svg',
  subdivision: 'systems/neon-relic/assets/icons/subdivision-default.svg',
  organization: 'systems/neon-relic/assets/icons/organization-default.svg',
  relicSheet: 'systems/neon-relic/assets/icons/relic-sheet-default.svg',
};

/* ------------------------------------------ */
/*  ID generation                             */
/* ------------------------------------------ */

// Characters used by Foundry's randomID()
const ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generate a deterministic 16-character Foundry-compatible ID from a slug.
 * Uses SHA-256 to map arbitrary slugs to the Base62 alphabet Foundry expects.
 * @param {string} slug - Human-readable ID from YAML (e.g. "sangreal-l1").
 * @returns {string} 16-character alphanumeric ID.
 */
export function toFoundryId(slug) {
  const hash = crypto.createHash('sha256').update(slug).digest();
  let id = '';
  for (let i = 0; i < 16; i++) {
    id += ID_CHARS[hash[i] % ID_CHARS.length];
  }
  return id;
}

/* ------------------------------------------ */
/*  Document transform                        */
/* ------------------------------------------ */

/**
 * Transform a YAML source document into Foundry-native LevelDB entries.
 * Returns an array of { key, data } entries. Journals and roll tables emit
 * additional entries for pages/results (Foundry V14 requirement).
 * @param {object} doc - Parsed YAML document.
 * @returns {Array<{key: string, data: object}>|null} Entries, or null if the type is unknown.
 */
export function transformDocument(doc) {
  const id = toFoundryId(doc._id);

  if (ITEM_TYPES.has(doc.type)) {
    return [
      {
        key: `!items!${id}`,
        data: {
          _id: id,
          name: doc.name,
          type: doc.type,
          img: doc.img || ITEM_DEFAULT_ICONS[doc.type] || '',
          system: doc.system || {},
          effects: doc.effects || [],
          flags: doc.flags || {},
          folder: doc.folder || null,
          sort: doc.sort || 0,
          ownership: doc.ownership || { default: 0 },
          _stats: doc._stats || {},
        },
      },
    ];
  }

  if (ACTOR_TYPES.has(doc.type)) {
    return [
      {
        key: `!actors!${id}`,
        data: {
          _id: id,
          name: doc.name,
          type: doc.type,
          img: doc.img || '',
          system: doc.system || {},
          items: doc.items || [],
          effects: doc.effects || [],
          flags: doc.flags || {},
          folder: doc.folder || null,
          sort: doc.sort || 0,
          ownership: doc.ownership || { default: 0 },
          prototypeToken: doc.prototypeToken || {},
          _stats: doc._stats || {},
        },
      },
    ];
  }

  if (doc.type === 'macro') {
    return [
      {
        key: `!macros!${id}`,
        data: {
          _id: id,
          name: doc.name,
          type: doc.system?.macroType || 'script',
          img: doc.img || 'icons/svg/dice-target.svg',
          command: doc.system?.script || '',
          flags: doc.flags || {},
          folder: doc.folder || null,
          sort: doc.sort || 0,
          ownership: doc.ownership || { default: 0 },
          _stats: doc._stats || {},
        },
      },
    ];
  }

  if (doc.type === 'rollTable') {
    const results = (doc.system?.entries || []).map((e, i) => ({
      _id: toFoundryId(`${doc._id}r${String(i + 1).padStart(3, '0')}`),
      type: 0,
      text: e.result,
      range: e.range,
      weight: 1,
      drawn: false,
      flags: {},
    }));

    // Foundry V14: table results are stored as separate LevelDB entries
    // (similar to journal pages), referenced by ID in the parent document.
    const entries = [
      {
        key: `!tables!${id}`,
        data: {
          _id: id,
          name: doc.name,
          img: doc.img || 'icons/svg/d20-grey.svg',
          formula: doc.system?.formula || '1d6',
          replacement: true,
          displayRoll: true,
          results: results.map((r) => r._id),
          flags: doc.flags || {},
          folder: doc.folder || null,
          sort: doc.sort || 0,
          ownership: doc.ownership || { default: 0 },
          _stats: doc._stats || {},
        },
      },
    ];

    for (const result of results) {
      entries.push({
        key: `!tables.results!${id}.${result._id}`,
        data: result,
      });
    }

    return entries;
  }

  if (doc.type === 'journalEntry' || doc.type === 'JournalEntry') {
    let pages;
    if (Array.isArray(doc.pages)) {
      pages = doc.pages.map((p, i) => ({
        _id: toFoundryId(`${doc._id}p${String(i + 1).padStart(3, '0')}`),
        name: p.name,
        type: p.type || 'text',
        text: { content: p.text?.content || '', format: 1 },
        sort: i * 100000,
        flags: {},
        ownership: { default: -1 },
        _stats: {},
      }));
    } else {
      pages = [
        {
          _id: toFoundryId(`${doc._id}p001`),
          name: doc.name,
          type: 'text',
          text: { content: doc.system?.summary || '', format: 1 },
          sort: 0,
          flags: {},
          ownership: { default: -1 },
          _stats: {},
        },
      ];
    }

    // Foundry V14: pages are stored as separate LevelDB entries AND referenced
    // by ID in the journal document's pages array.
    const entries = [
      {
        key: `!journal!${id}`,
        data: {
          _id: id,
          name: doc.name,
          pages: pages.map((p) => p._id),
          flags: doc.flags || {},
          folder: doc.folder || null,
          sort: doc.sort || 0,
          ownership: doc.ownership || { default: 0 },
          _stats: doc._stats || {},
        },
      },
    ];

    for (const page of pages) {
      entries.push({
        key: `!journal.pages!${id}.${page._id}`,
        data: page,
      });
    }

    return entries;
  }

  return null;
}
