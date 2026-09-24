/**
 * Mission: Sangreal — runtime migrations.
 *
 * Patch 1 (issues #54 / #57): worlds that imported the briefs before the attaché
 * contents redaction keep the old "communion ampoules" text. Rewrite the old
 * sentences in place on first load instead of forcing a manual re-import.
 */
const MODULE_ID = 'neon-relic-mission-sangreal';
const PATCH_FLAG = 'briefRedactionApplied';

/** The game system this module requires. */
const SYSTEM_ID = 'neon-relic';

/**
 * Is this module running under its required game system?
 * @returns {boolean}
 */
function systemIsSupported() {
  return game?.system?.id === SYSTEM_ID;
}

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

Hooks.once('init', () => {
  if (!systemIsSupported()) return;
  // NOTE: game.world does not implement getFlag/setFlag in Foundry v14, so the
  // one-shot markers live as hidden world settings instead.
  game.settings.register(MODULE_ID, PATCH_FLAG, {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  });
  game.settings.register(MODULE_ID, 'briefRedactionDiagnostics', {
    scope: 'world',
    config: false,
    type: Object,
    default: {},
  });
});

Hooks.once('ready', async () => {
  if (!systemIsSupported()) return;
  if (!game.user.isGM) return;
  if (game.settings.get(MODULE_ID, PATCH_FLAG)) return;
  const diagnostics = await runBriefRedaction();
  // Client-side ground truth, readable afterwards from the world settings store.
  diagnostics.client = {
    systemVersion: game.system?.version ?? null,
    moduleVersion: game.modules?.get(MODULE_ID)?.version ?? null,
    esmodules: game.modules?.get(MODULE_ID)?.esmodules ?? null,
    menuRegistered: !!game.settings?.menus?.get(`${MODULE_ID}.installer`),
    caseBoardTypeLabel: 'caseBoard' in (CONFIG.Item?.typeLabels ?? {}),
    itemTypeLabels: Object.keys(CONFIG.Item?.typeLabels ?? {}).join(','),
  };
  try {
    await game.settings.set(MODULE_ID, 'briefRedactionDiagnostics', diagnostics);
    await game.settings.set(MODULE_ID, PATCH_FLAG, true);
  } catch (err) {
    console.error(`${MODULE_ID} | failed to stamp redaction flag`, err);
  }
});

/* -------------------------------------------- */
/*  Content installer                             */
/* -------------------------------------------- */

/**
 * Import plan: pack → destination subfolder under the shared root.
 * Folders are created per document collection (Items, Actors, Journals, Tables, Scenes).
 * @type {Array<{pack: string, folder: string|null}>}
 */
const INSTALL_PLAN = [
  { pack: 'sangreal-briefs', folder: 'Briefs & Board' },
  { pack: 'sangreal-npcs', folder: 'NPCs' },
  { pack: 'sangreal-clues', folder: 'Clues' },
  { pack: 'sangreal-sites', folder: 'Sites' },
  { pack: 'sangreal-relics', folder: 'Relics' },
  { pack: 'sangreal-scenes', folder: null },
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
 * Reconcile a Scene update against the world document before writing it.
 *
 * Scene records changed shape between the first v14 imports and the current
 * pack format (background textures moved from the Scene onto its embedded
 * Level), so a plain overwrite can (a) deactivate the scene the table is
 * currently on, (b) create a duplicate Level instead of updating the existing
 * one, and (c) re-hide a scene the GM already revealed to the players
 * (navigation and ownership carry that reveal state). Keep world-side
 * activation and reveal state authoritative, and always write the pack's
 * background onto the world's *initial* level so a scene that was imported
 * before this fix (empty placeholder level) heals in place. Any extra
 * GM-authored levels are left untouched (`diff: false` never deletes).
 * @param {foundry.documents.Scene} existing The scene already in the world.
 * @param {object} data The incoming pack scene source data.
 * @param {{repaired: number}} stats Mutable counter for scenes repaired.
 * @returns {object} Scene data prepared for `existing.update`.
 */
function prepareSceneUpdate(existing, data, stats) {
  const update = data;
  // Activation and reveal state are world state — never deactivate the
  // current scene or hide one the GM already revealed.
  if (existing.active) delete update.active;
  delete update.navigation;
  delete update.ownership;
  const worldLevels = existing.levels?.contents ?? [];
  const packLevels = Array.isArray(update.levels) ? update.levels : [];
  const packLevel = packLevels.length === 1 ? packLevels[0] : null;
  if (!packLevel) return update;
  // Heal a broken import without depending on the pack read being fresh: when
  // the incoming level carries no texture, fall back to the scene's thumb
  // (authored as the background path for every scene in this module).
  if (!packLevel.background?.src && typeof update.thumb === 'string' && update.thumb.includes(MODULE_ID)) {
    packLevel.background = { ...packLevel.background, src: update.thumb };
  }
  const initialLevel = existing.initialLevel;
  const levelId = initialLevel?.id ?? worldLevels[0]?.id;
  if (levelId) {
    // Reuse the world's initial level ID so legacy/migrated levels (for
    // example the `defaultLevel0000` created by v14's scene migration) are
    // updated in place instead of duplicated, and keep the initial level on
    // it — including scenes left with an empty placeholder level by an
    // earlier import.
    if (!initialLevel?.background?.src) stats.repaired++;
    update.levels = [{ ...packLevel, _id: levelId }];
    update.initialLevel = levelId;
  }
  return update;
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
  if (!systemIsSupported()) {
    ui.notifications.error(
      `Mission: Sangreal requires the "${SYSTEM_ID}" game system — this world runs "${game.system.id}".`,
    );
    return;
  }
  const notification = ui.notifications.info('Mission: Sangreal — installing content…', { permanent: true });
  let created = 0;
  let updated = 0;
  let failed = 0;
  const sceneStats = { repaired: 0 };

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
          const update = doc.documentName === 'Scene' ? prepareSceneUpdate(existing, data, sceneStats) : data;
          await existing.update(update, { diff: false });
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

  // Bring up the module landing page when the world has no active scene yet.
  if (!game.scenes.active) {
    const landing = game.scenes.find(s => s.getFlag(MODULE_ID, 'landingPage'));
    if (landing) {
      try {
        await landing.activate();
      } catch (err) {
        console.warn(`${MODULE_ID} | installer: could not activate landing scene`, err);
      }
    }
  }

  notification?.remove?.();
  const summary = `Mission: Sangreal — content ready (${created} new, ${updated} updated${
    sceneStats.repaired ? `, ${sceneStats.repaired} scenes repaired` : ''
  }${failed ? `, ${failed} failed` : ''}).`;
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
        <li>The module <strong>landing scene</strong> is imported, and activated automatically when the world has no active scene.</li>
        <li>Safe to re-run after module updates — no duplicates are created.</li>
      </ul>
      <p>Content: briefs, case board, NPCs, clues, sites, relics, tables, journals, and 27 scenes (landing, 16 atmosphere views, 10 maps).</p>`,
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
  if (!systemIsSupported()) return;
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

Hooks.once('ready', () => {
  if (systemIsSupported()) return;
  const msg = `Mission: Sangreal requires the "${SYSTEM_ID}" game system — this world runs "${game.system.id}" and the module is inactive. Disable it in Manage Modules.`;
  console.warn(`${MODULE_ID} | ${msg}`);
  if (game.user?.isGM) ui.notifications.warn(msg, { permanent: true });
});
