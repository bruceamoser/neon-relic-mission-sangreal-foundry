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

/**
 * One-shot world patch: rewrite the pre-redaction brief/handout sentences in
 * imported documents. Individual failures are captured, never abort the run.
 * @returns {Promise<object>} Diagnostic report.
 */
async function runBriefRedaction() {
  const diagnostics = { items: 0, actorItems: 0, pages: 0, errors: [] };

  const patchItems = async (items, key) => {
    for (const item of items) {
      try {
        const updates = {};
        for (const [field, value] of Object.entries(item.system ?? {})) {
          const next = redact(value);
          if (next !== null) updates[`system.${field}`] = next;
        }
        if (Object.keys(updates).length) {
          await item.update(updates);
          diagnostics[key]++;
        }
      } catch (err) {
        diagnostics.errors.push(`${key}:${item?.name ?? item?.id}: ${err?.message ?? err}`);
      }
    }
  };

  await patchItems(game.items ?? [], 'items');
  for (const actor of game.actors ?? []) await patchItems(actor.items, 'actorItems');

  for (const journal of game.journal ?? []) {
    for (const page of journal.pages) {
      try {
        const next = redact(page.text?.content);
        if (next === null) continue;
        await page.update({ 'text.content': next });
        diagnostics.pages++;
      } catch (err) {
        diagnostics.errors.push(
          `page:${journal?.name ?? journal?.id}/${page?.name ?? page?.id}: ${err?.message ?? err}`,
        );
      }
    }
  }

  diagnostics.timestamp = new Date().toISOString();
  console.log(`${MODULE_ID} | brief redaction`, diagnostics);
  return diagnostics;
}

Hooks.once('ready', async () => {
  if (!game.user.isGM) return;
  if (game.world.getFlag(MODULE_ID, PATCH_FLAG)) return;
  const diagnostics = await runBriefRedaction();
  // Client-side ground truth, readable afterwards from world.json flags.
  diagnostics.client = {
    systemVersion: game.system?.version ?? null,
    moduleVersion: game.modules?.get(MODULE_ID)?.version ?? null,
    esmodules: game.modules?.get(MODULE_ID)?.esmodules ?? null,
    menuRegistered: !!game.settings?.menus?.get(`${MODULE_ID}.installer`),
    caseBoardTypeLabel: 'caseBoard' in (CONFIG.Item?.typeLabels ?? {}),
    itemTypeLabels: Object.keys(CONFIG.Item?.typeLabels ?? {}).join(','),
  };
  try {
    await game.world.setFlag(MODULE_ID, PATCH_FLAG, true);
    await game.world.setFlag(MODULE_ID, 'briefRedactionDiagnostics', diagnostics);
  } catch (err) {
    console.error(`${MODULE_ID} | failed to stamp redaction flag`, err);
  }
});

/* -------------------------------------------- */
/*  Content installer                             */
/* -------------------------------------------- */

/**
 * Import plan: pack → destination subfolder under the shared root.
 * Folders are created per document collection (Items, Actors, Journals, Tables).
 * @type {Array<{pack: string, folder: string|null}>}
 */
const INSTALL_PLAN = [
  { pack: 'sangreal-briefs', folder: 'Briefs & Board' },
  { pack: 'sangreal-npcs', folder: 'NPCs' },
  { pack: 'sangreal-clues', folder: 'Clues' },
  { pack: 'sangreal-sites', folder: 'Sites' },
  { pack: 'sangreal-relics', folder: 'Relics' },
  { pack: 'sangreal-tables', folder: null },
  { pack: 'sangreal-journals', folder: null },
];

const ROOT_FOLDER_NAME = 'Mission: Sangreal';

/**
 * Find or create a folder in a document collection.
 * @param {string} name
 * @param {string} type - Collection type (Item, Actor, JournalEntry, RollTable).
 * @param {string|null} [parentId]
 * @returns {Promise<string>} The folder id.
 */
async function ensureFolder(name, type, parentId = null) {
  const existing = game.folders.find(
    f => f.type === type && f.name === name && (f.folder?.id ?? null) === parentId,
  );
  if (existing) return existing.id;
  const folder = await Folder.create({ name, type, folder: parentId, sorting: 'a' });
  return folder.id;
}

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

  for (const { pack: packName, folder: subfolderName } of INSTALL_PLAN) {
    const pack = game.packs.get(`${MODULE_ID}.${packName}`);
    if (!pack) {
      console.warn(`${MODULE_ID} | installer: pack ${packName} not found, skipping`);
      continue;
    }

    // Resolve the destination folder structure for this pack's collection
    let folderId = null;
    try {
      const rootId = await ensureFolder(ROOT_FOLDER_NAME, pack.metadata.type);
      folderId = subfolderName ? await ensureFolder(subfolderName, pack.metadata.type, rootId) : rootId;
    } catch (err) {
      console.warn(`${MODULE_ID} | installer: folder setup failed for ${packName}`, err);
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
      if (folderId) data.folder = folderId;
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
        <li>Content is organised into a <strong>Mission: Sangreal</strong> folder with per-category subfolders (Briefs &amp; Board, NPCs, Clues, Sites, Relics) — existing documents are moved there too.</li>
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
  try {
    game.settings.registerMenu(MODULE_ID, 'installer', {
      name: 'Content Installer',
      label: 'Import / Update Content',
      hint: 'Import Mission: Sangreal compendium content into this world. Existing documents are overwritten by ID; new documents are added. Run after updating the module.',
      icon: 'fa-solid fa-file-import',
      type: SangrealInstaller,
      restricted: true,
    });
    console.log(`${MODULE_ID} | content installer menu registered`);
  } catch (err) {
    console.error(`${MODULE_ID} | failed to register content installer menu`, err);
  }

  // Console/macro escape hatch:
  //   game.modules.get('neon-relic-mission-sangreal').api.installContent()
  //   game.modules.get('neon-relic-mission-sangreal').api.runBriefRedaction()
  const module = game.modules.get(MODULE_ID);
  if (module) module.api = { installContent, runBriefRedaction };
});
