/**
 * Mission: Sangreal — runtime migrations.
 *
 * Patch 1 (issues #54 / #57): worlds that imported the briefs before the attaché
 * contents redaction keep the old "communion ampoules" text. Rewrite the old
 * sentences in place on first load instead of forcing a manual re-import.
 */
const MODULE_ID = 'neon-relic-mission-sangreal';
const PATCH_FLAG = 'briefRedactionApplied';

const REPLACEMENTS = [
  {
    find: 'The Holy See formally certifies that the attaché contains twelve sealed communion ampoules dating to the late Roman period, and guarantees the following:',
    replace:
      'The Holy See refuses to describe the contents of the attaché, and will provide no further information. The single detail on record: a tarnished brass sign fixed below the electromagnetic mooring plinth where the case was stored in Vault IX, reading one word — <strong>SANGREAL</strong>. Church officials decline to explain it. The Holy See guarantees the following:',
  },
  {
    find: 'The Church certifies the attaché holds twelve sealed communion ampoules of late Roman origin, and guarantees:',
    replace:
      'The Church refuses to describe what the attaché holds; no further information will be provided. The single detail on record: a tarnished brass sign below the electromagnetic mooring plinth where the case was stored, reading one word — <strong>SANGREAL</strong>. The Church guarantees:',
  },
];

/**
 * Apply the redaction replacements to a string.
 * @param {string} text
 * @returns {string|null} The patched text, or null when nothing matched.
 */
function redact(text) {
  if (typeof text !== 'string' || !text.includes('communion ampoules')) return null;
  let out = text;
  for (const { find, replace } of REPLACEMENTS) out = out.split(find).join(replace);
  return out === text ? null : out;
}

Hooks.once('ready', async () => {
  if (!game.user.isGM) return;
  if (game.world.getFlag(MODULE_ID, PATCH_FLAG)) return;

  let count = 0;

  const patchItems = async items => {
    for (const item of items) {
      const updates = {};
      for (const [key, value] of Object.entries(item.system ?? {})) {
        const next = redact(value);
        if (next !== null) updates[`system.${key}`] = next;
      }
      if (Object.keys(updates).length) {
        await item.update(updates);
        count++;
      }
    }
  };

  await patchItems(game.items ?? []);
  for (const actor of game.actors ?? []) await patchItems(actor.items);

  const pageUpdates = [];
  for (const journal of game.journal ?? []) {
    for (const page of journal.pages) {
      const next = redact(page.text?.content);
      if (next !== null) pageUpdates.push(page.update({ 'text.content': next }));
    }
  }
  await Promise.all(pageUpdates);
  count += pageUpdates.length;

  await game.world.setFlag(MODULE_ID, PATCH_FLAG, true);
  if (count) console.log(`${MODULE_ID} | brief redaction patched ${count} document(s)`);
});

/* -------------------------------------------- */
/*  Content installer                             */
/* -------------------------------------------- */

/**
 * All packs shipped by this module, in display order.
 * @type {string[]}
 */
const INSTALL_PACKS = [
  'sangreal-briefs',
  'sangreal-npcs',
  'sangreal-clues',
  'sangreal-sites',
  'sangreal-relics',
  'sangreal-tables',
  'sangreal-journals',
];

/**
 * Import or refresh every module pack into the world.
 *
 * Patterned on the neon-relic system's world setup (`pack.getDocuments()` +
 * `create(..., { keepId: true })`), but with overwrite semantics: world
 * documents whose IDs match a pack document are UPDATED in place, so running
 * the installer after a module update refreshes existing content without
 * creating duplicates.
 * @returns {Promise<void>}
 */
async function installContent() {
  const notification = ui.notifications.info('Mission: Sangreal — installing content…', { permanent: true });
  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const packName of INSTALL_PACKS) {
    const pack = game.packs.get(`${MODULE_ID}.${packName}`);
    if (!pack) {
      console.warn(`${MODULE_ID} | installer: pack ${packName} not found, skipping`);
      continue;
    }

    let docs;
    try {
      docs = await pack.getDocuments();
    } catch (err) {
      console.error(`${MODULE_ID} | installer: failed to read pack ${packName}`, err);
      failed++;
      continue;
    }

    for (const doc of docs) {
      const data = doc.toObject();
      const collection = game.collections.get(doc.documentName);
      const existing = collection?.get(doc.id);
      try {
        if (existing) {
          // Overwrite in place, keeping the pack ID and any world-side
          // additions the update does not touch (diff: false = no deletions).
          await existing.update(data, { diff: false });
          updated++;
        } else {
          await doc.constructor.create(data, { keepId: true });
          created++;
        }
      } catch (err) {
        failed++;
        console.error(`${MODULE_ID} | installer: ${packName}/${doc.name} (${doc.id})`, err);
      }
    }
  }

  notification?.remove?.();
  const summary = `Mission: Sangreal — content ready (${created} new, ${updated} updated${
    failed ? `, ${failed} failed` : ''
  }).`;
  console.log(`${MODULE_ID} | installer: ${summary}`);
  if (failed) {
    ui.notifications.error(`${failed} document(s) failed to install — see the console for details.`);
  }
  ui.notifications.info(summary, { permanent: true });
  ChatMessage.create({ content: `<p>${summary}</p>`, whisper: [game.user.id] });
}

/**
 * Settings-menu dialog for the content installer.
 */
class SangrealInstaller extends foundry.applications.api.DialogV2 {
  /** @override */
  static DEFAULT_OPTIONS = {
    id: 'sangreal-content-installer',
    window: { title: 'Mission: Sangreal — Content Installer', resizable: false },
    position: { width: 480, height: 'auto' },
    content: `<p>Import the Mission: Sangreal compendium content into this world.</p>
      <ul>
        <li>Documents already in this world with matching IDs are <strong>overwritten</strong> with the current pack versions.</li>
        <li>New documents are added, keeping their pack IDs.</li>
        <li>Safe to re-run after module updates — no duplicates are created.</li>
      </ul>
      <p>Content: briefs, case board, NPCs, clues, sites, relics, tables, and journals.</p>`,
    buttons: [
      {
        action: 'install',
        label: 'Import / Update Content',
        icon: 'fa-solid fa-file-import',
        default: true,
        callback: () => installContent(),
      },
      {
        action: 'cancel',
        label: 'Cancel',
        icon: 'fa-solid fa-xmark',
      },
    ],
  };
}

Hooks.once('init', () => {
  game.settings.registerMenu(MODULE_ID, 'installer', {
    name: 'Content Installer',
    label: 'Import / Update Content',
    hint: 'Import Mission: Sangreal compendium content into this world. Existing documents are overwritten by ID; new documents are added. Run after updating the module.',
    icon: 'fa-solid fa-file-import',
    type: SangrealInstaller,
    restricted: true,
  });

  // Console/macro escape hatch: game.modules.get('neon-relic-mission-sangreal').api.installContent()
  const module = game.modules.get(MODULE_ID);
  if (module) module.api = { installContent };
});
