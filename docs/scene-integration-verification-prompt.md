# Verification prompt for the next LLM

Verify the completed Mission: Sangreal scene-art integration in `/mnt/disk4/repos/neon-relic-mission-sangreal-foundry`. Work from the current working tree; do not reset user changes or regenerate/recompress approved artwork. Fix concrete integration defects and report exactly what was checked. Do not publish, release, or modify a campaign world without authorization; use a disposable Foundry v14 test world for runtime checks.

The user approved 26 new backgrounds: 16 theater-of-the-mind images and 10 gridless battle maps. They are installed under `src/assets/art/scenes/{totm,maps}` as q85 WebP at native generated dimensions. They total 6,550,646 bytes. The complete built `dist/assets/art` currently totals 17,478,207 bytes. Keep this compression pass: no PNG masters, alternate versions or production references should ship. Lossless masters belong only in `art/scene-production/masters` and the external QA workspace.

Implementation to inspect:
- `src/packs/sangreal-scenes.yaml`: 27 Scene documents, including the original landing page. New scenes are inactive, navigation false, ownership default 0, gridless, fog disabled, token vision disabled, native width/height. No walls, lights, encounter tokens or automatic reveals were authored. Grid size 100 is a configurable token-placement starting point, not calibrated architectural scale.
- `tools/lib/pack-lib.mjs`: v14 backgrounds serialize to embedded Level documents under `!scenes.levels!parentId.levelId`, referenced by the parent Scene. Initial view is an object rather than the old boolean. Check this against the actual installed Foundry v14 schema, including the landing scene regression. Official references: https://foundryvtt.com/api/v14/classes/foundry.documents.Level.html and https://foundryvtt.com/api/interfaces/foundry.documents.types.SceneData.html .
- `src/packs/sangreal-sites.yaml`: all L1–L7 descriptions include an appropriate atmosphere image and links to their associated scenes.
- `src/packs/sangreal-journals.yaml`: Start Here has an appended fifth page, “Scene Art — GM Index”, linking all 26 scenes; existing page order/IDs are preserved. Relevant DA walkthrough pages and The Tarmac bridge link the corresponding scenes. Each new scene links back to the GM index using deterministic journal/page IDs. Player handouts should remain free of a spoiler-filled scene index.
- `static/module.json`: scene pack renamed “Mission Scenes”. The existing Content Installer imports all 27 through its existing import plan. No new automatic installation hooks were added.
- `art/scene-production/manifest.json`: approved assets, exact paths/dimensions/hashes, scene UUIDs and provenance. It is a production manifest, not shipped runtime data.
- `tools/verify-scene-integration.mjs`: additional build verification exposed as `npm run scenes:verify`.

Run `npm run validate`, `npm run build`, `npm run audit`, `npm run scenes:verify`, and `git diff --check`. Independently inspect compiled LevelDB, image dimensions and file hashes; do not rely solely on passing tests. Confirm all scene UUID links resolve, scene journal/page references exist, original landing ID is stable, existing journal pages retain IDs, source and built artwork match, and no lossless masters ship.

In an available disposable Foundry v14 + Neon Relic world:
1. Enable module, invoke the existing Content Installer, and confirm 27 scenes import without schema warnings or missing backgrounds. Re-run once and confirm no duplicate scenes. Examine existing-scene update behavior and report any risk to world-authored walls/tokens/levels or active scene state; do not test overwrites in a real campaign.
2. View the landing scene, every new background, and representative maps. Check actual rendering, correct aspect ratio, token drag/drop visibility, absence of black fog, and whether the scene journal button opens the GM index. Check both factory views separately.
3. Open location previews and scene UUID links from Start Here, walkthrough and Tarmac. Compendium links intentionally open originals; installed world scenes are used for play.
4. Verify a player does not gain access to GM index, unrevealed scene navigation or hidden interiors simply by installation. The GM deliberately activates scenes at reveal time.
5. Record any remaining manual map setup: token-scale calibration, walls, dynamic lighting and encounter placement were not part of this integration.

Deliver a concise verification report listing fixes, commands/results, actual payload size and live checks performed. If live Foundry is unavailable, explicitly mark runtime rendering/import/player visibility unverified instead of claiming full validation. Preserve the 6.55 MB scene image budget and existing approved evidence art.
