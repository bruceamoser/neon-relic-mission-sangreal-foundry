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
