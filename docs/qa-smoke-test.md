# Foundry VTT Smoke Test — Mission: Sangreal 0.1.0

**Date:** 2026-09-11
**Foundry:** 14.367 (local, Linux)
**System:** neon-relic 0.9.3
**Module:** neon-relic-mission-sangreal 0.1.0 (deployed via `tools/push-local.sh --link`)

## Verified

| Check | Result |
| --- | --- |
| Module discovered by Foundry setup | ✅ `neon-relic-mission-sangreal` listed |
| Manifest parsed (id, title, version) | ✅ `Mission: Sangreal` 0.1.0 |
| All 7 compendium packs registered | ✅ briefs, npcs, clues, sites, relics, tables, journals |
| `Mission: Sangreal` pack folder parsed (name, sorting, color) | ✅ |
| System dependency (`relationships.systems` → neon-relic ≥ 0.9.3) parsed | ✅ system 0.9.3 present |
| Module-related console errors | ✅ none (only a headless viewport-size warning unrelated to the module) |
| Pack LevelDB layout (via `npm run audit`) | ✅ 53 documents, 72 keys, v14 journal-page/table-result entries, deterministic across builds |

## In-world checklist (remaining manual pass)

These require a GM session with a world running; the headless harness cannot join a world. Exact steps:

1. Setup → launch a world with the **neon-relic** system.
2. Manage Modules → enable **Mission: Sangreal** → reload.
3. Compendium sidebar → `Mission: Sangreal` folder → open each pack:
   - DA Case Brief + Player Case Brief sheets render
   - VC-16 relic sheets render with the containment-truth grid
   - Information cards show front/back and reveal toggle
   - Location and Organization sheets render with tabs
   - NPC and mob sheets render
   - Journal pages open (Start Here, Handouts, Bridge)
   - `Phial Fracture (d6)` opens and rolls (1–2 / 3–4 / 5 / 6)
4. Drag an NPC onto an organization tab and an info card onto a location tab to confirm linking.
5. Import the mission into a clean world; confirm GM-only defaults.

## Findings (fixed or informational)

1. **Pack source filenames must match manifest pack paths** — compiled as `packs/briefs` while the manifest declared `packs/sangreal-briefs`. Fixed in #5 by renaming sources to `sangreal-*.yaml`; `npm run audit` now guards this class of mismatch.
2. **Foundry rescans packages at startup only** — a module added while Foundry is running will not appear until the server restarts. Informational; no action needed.
3. **Headless verification needs WebGL** — Foundry's initialisation fails in browsers without WebGL; `google-chrome --headless=new --use-angle=swiftshader --enable-unsafe-swiftshader` works and exposes `game.data` for automated checks.
