# neon-relic-mission-sangreal-foundry

Foundry VTT v14 content module for **Neon Relic** — *Mission: Sangreal*.

A stolen Vatican attaché carrying the Twelve Phials of Gethsemane is brokered across Western Europe while an embedded double agent steers the Covenant toward a manufactured vampire outbreak. This module ships the complete investigation: DA case brief and player dossier, 14-day case board, information web (77 linked information cards), sixteen illustrated NPC cards, 24 optional investigator snapshots, location and faction dossiers, relics with VC-16 containment sheets and field kit, four journals (including the day-by-day DA Walkthrough and player handouts), roll tables, and a landing scene.

## Requirements

- **Foundry VTT** v14
- **Neon Relic** system v0.11.1 or newer (manifest URL below)

The module is built exclusively for the *Neon Relic* system. If it is enabled in a world running any other system, it stays inert and shows a warning instead of loading.

## Install in Foundry VTT

1. **System first** — Setup → Game Systems → Install System, manifest URL:

   `https://github.com/bruceamoser/foundry-neon-relic-system/releases/latest/download/system.json`

2. **Module** — Setup → Add-on Modules → Install Module → Manifest URL:

   `https://github.com/bruceamoser/neon-relic-mission-sangreal-foundry/releases/latest/download/module.json`

3. Enable the module in your world, then open **Configure Settings → Module Settings → Mission: Sangreal → Content Installer** and run it. Content is imported (and kept up to date) in a `Mission: Sangreal` folder tree, one subfolder per kind of document: *Briefs & Board*, *Clues* (I), *Cast Cards* (N), *Photographic Evidence* (F), *NPC Portraits* (NP), *Investigator Photos* (C), *NPCs*, *Sites*, *Relics*, *Sound Effects*, with roll tables, journals and scenes at the root. The landing scene is added to the Scenes directory and activated automatically if the world has no active scene.

## Content overview

| Content | Details |
| --- | --- |
| Briefs & board | DA Case Brief (VC-17) — the master reference, opening with **the truth in plain words**, the horror stated plainly, and a *who wants what / what they will do* table for all nine players — plus a **How to run this case** section and *what the players must work out*; Player Dossier, Case Board (14-day countdown, 2 faction tracks + 7 off-camera person tracks, case-journey relic milestones), Information Web |
| Information cards | 77 cards in three families, filed in their own world folders: **I01–I45** clues, evidence and containment truths with found-at / known-by cross-links, reveal state and DA notes covering retrieval, image reading and hidden clues; **N01–N16** cast cards — player-showable NPC dossiers whose clean portraits are ready for the Examine Photo viewer; and **F01–F16** photographic evidence (the superseded portraits, kept as the photographs themselves: the tells, eggs and pairings). A separate *NPC Portraits* pack carries the plain introduction portraits |
| Investigator photos | **C01–C24 optional snapshots** the players may take themselves — 16 ordinary photographs and 8 visible observations, one per investigation subject (gate, vault cradle, desk drawers, drilled safe, bank counter, ward, booth, hangar, NPCs). Neutral player-facing text, GM-only access/timing notes, and an *Investigator Photos — GM Index* page in the walkthrough; cues sit at the beats where each subject is reachable |
| NPCs | Corvi, Claudia Vane, Hausmann, Dr. Graf, Sabbatini, Ghiberti, and more — 15 actors plus a mob, each with an **At the table** block: look, wants, will not, and what they know (volunteered, traded, the lie and the tell) |
| Sites | Seven location dossiers (Vault IX, Corvi's quarters, UBS Geneva, Sonnenberg clinic, Lingotto works, San Nazzaro retreat, CDF palace) and two faction dossiers (the Holy Alliance, the Talamasca) — each with a **Read aloud** passage, a *who is here* block for its cast, gates in house mechanics style, and *behaviour toward the cell / what gives them away / what they know* for the factions |
| Relics | The attaché, the Lodestone of St. Jude, the Veil of Veronica's Thread — each with a VC-16 containment sheet — plus field kit (revolver, Beretta 70, UV floodlight, phosphorus flare) |
| Journals | Start Here, **player handouts**, the Mission 2 teaser, and the **DA Walkthrough** — a 14-page running script for the GM rather than a summary. It opens with **The Case — DA Background**: the whole truth of the mission in one place (what the blood really is, who wants what, the four facts the players must assemble, the fixed dates, and the five habits the journal assumes). Every act then gives *the act in one line*, **the truth of this act** (what is really happening off camera), a **Read aloud** passage written to be spoken verbatim, and per beat: the scene (with its art and sound links), **who is present — what they look like, what they want, and what they know**, every clue with **the condition for getting it** and **layered success** on the tests that reveal more, the **tests** to call with their failure costs, **what the cell should learn**, and **where it leads next**, plus per-location *If the investigators take photographs* cues for the 24 optional snapshots |
| Scene | 27 backgrounds — *Sangreal Landing* (landing-page behaviour) plus 16 theater-of-the-mind views and 10 gridless battle maps, each on a Foundry v14 Level; the **Scene Art — GM Index** page catalogues them |
| Sound effects | **Sangreal Sound Effects** — a 25-track playlist (looping ambience beds, props and stings) cued beat-by-beat, with the **Sound Effects — Cue Sheet** page in the DA Walkthrough; licensing record ships in `assets/audio/CREDITS.md` |

## Development

| Command | Description |
| --- | --- |
| `npm run build` | Compile `src/packs/*.yaml` → `dist/packs/*` and copy static files |
| `npm run validate` | Validate pack sources (cross-links, schema, references) |
| `npm run audit` | Audit the build output (packs, document counts, coverage) |
| `npm run scenes:verify` | Verify scene Levels, background files and the migration stamp |
| `npm run emit:uuids` | Print the deterministic slug → compendium UUID map |
| `./tools/push-local.sh` | Build and push the module to a local Foundry VTT data directory for testing |

## Releases

Releases are cut with the procedure in [`.github/skills/create-release/SKILL.md`](.github/skills/create-release/SKILL.md): pre-flight checks, semver bump (`package.json` + `static/module.json`), build, tag `v<major>.<minor>.<patch>`, and `gh release create` with `module.json` + `neon-relic-mission-sangreal.zip` assets. `.github/workflows/release.yml` rebuilds and re-attaches artifacts on publish.

The manifest URL is stable across releases — install it once and Foundry will offer updates:

`https://github.com/bruceamoser/neon-relic-mission-sangreal-foundry/releases/latest/download/module.json`
