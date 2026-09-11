# neon-relic-mission-sangreal-foundry

Foundry VTT v14 content module for **Neon Relic** — *Mission: Sangreal*.

A stolen Vatican attaché carrying the Twelve Phials of Gethsemane is brokered across Western Europe while an embedded double agent steers the Covenant toward a manufactured vampire outbreak. This module ships the complete investigation: DA case brief and player dossier, case board, information web (17 linked information cards), NPC cards, locations, relics, journals, and roll tables.

## Install in Foundry VTT

1. **System first** — Setup → Game Systems → Install System, manifest URL:

   `https://github.com/bruceamoser/foundry-neon-relic-system/releases/latest/download/system.json`

2. **Module** — Setup → Add-on Modules → Install Module → Manifest URL:

   `https://github.com/bruceamoser/neon-relic-mission-sangreal-foundry/releases/latest/download/module.json`

3. Enable the module in your world, then open **Configure Settings → Module Settings → Mission: Sangreal → Content Installer** and run it. Content is imported (and kept up to date) in a `Mission: Sangreal` folder tree: *Briefs & Board*, *NPCs*, *Clues*, *Sites*, *Relics*.

## Content overview

| Content | Details |
| --- | --- |
| Briefs & board | DA Case Brief (VC-17), Player Dossier, Case Board (14-day countdown, faction tracks, case-journey relic milestones), Information Web |
| Information cards | I1–I17 with found-at / known-by cross-links and reveal state |
| NPCs | Corvi, Claudia Vane, Hausmann, Dr. Graf, Sabbatini, Ghiberti, and more |
| Sites | Vatican Vault IX, Geneva depository, Sonnenberg clinic, Lingotto works, Novara safehouse |
| Relics | The attaché, the Lodestone of St. Jude, the Veil of Veronica's Thread |

## Development

| Command | Description |
| --- | --- |
| `npm run build` | Compile `src/packs/*.yaml` → `dist/packs/*` and copy static files |
| `npm run validate` | Validate pack sources (cross-links, schema, references) |
| `npm run audit` | Audit the build output (packs, document counts, coverage) |
| `npm run emit:uuids` | Print the deterministic slug → compendium UUID map |
| `./tools/push-local.sh` | Build and push the module to a local Foundry VTT data directory for testing |

## Releases

Releases are cut with the procedure in [`.github/skills/create-release/SKILL.md`](.github/skills/create-release/SKILL.md): pre-flight checks, semver bump (`package.json` + `static/module.json`), build, tag `v<major>.<minor>.<patch>`, and `gh release create` with `module.json` + `neon-relic-mission-sangreal.zip` assets. `.github/workflows/release.yml` rebuilds and re-attaches artifacts on publish.

The manifest URL is stable across releases — install it once and Foundry will offer updates:

`https://github.com/bruceamoser/neon-relic-mission-sangreal-foundry/releases/latest/download/module.json`
