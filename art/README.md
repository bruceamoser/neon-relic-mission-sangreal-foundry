# Mission: Sangreal art production

This is the setup stage requested in §43 of `spec/production-request.md`. No production images have been generated, visually graded, approved or integrated. The canonical creative brief is `docs/intel-art-prompts.md` in the module repository. `spec/intel-art-prompts.md` preserves the exact inspected bytes; the manifest records its SHA-256 and original path. Source drift stops generation until explicitly reconciled.

## Inventory

| Class | Jobs | Notes |
|---|---:|---|
| NPC portraits | 16 | 6 SVG replacements, 10 additions; Watcher is optional for shipping but needed as an internal continuity reference |
| Relic plates | 3 | All optional; all retained in the manifest |
| Intel images | 43 | Rome 10, Geneva 6, Zurich 8, Turin 6, Novara 7, Vatican/wrap 6 |
| Internal references | 10 | Production assets, never automatically installed into Foundry |
| Total | 72 | 62 source-requested images plus 10 internal references |

Intel includes **14 primary existing-card replacements**, **28 new-card images (I-18–I-45)** and **one additional detail image for I-13 (N02)**. N01 and N02 are separate jobs and separate files. N02 must not overwrite N01 as the primary card art.

**48 source images and 4 internal references** have exact-text work or unresolved textual requirements. This deliberately extends compositing beyond the four documents called out in the source. Labels inherited from a locked case or vehicle also need exact wording where visible. No extra clue prose is invented.

`art-manifest.yaml` is the authoritative ledger. Each entry preserves the complete source excerpt, original prompt, Shows line, individual mandatory Eggs, exact text, aspect, medium, references, optional flag, integration target, state and attempt count. `STATUS.md` is regenerated whenever commands change the manifest. `style-bible.yaml` preserves all eight source medium recipes plus a portrait assembly recipe, all 16 character identities (both Hausmann states), motifs, recurring Eggs and the clue index.

## Repository inspection

- Source packs: `src/packs/sangreal-npcs.yaml`, `sangreal-clues.yaml`, `sangreal-relics.yaml`.
- NPC actors and prototype tokens are in `sangreal-npcs.yaml`; there is no separate actors YAML.
- Both `sangreal-case-board` and `sangreal-information-web` live in `sangreal-briefs.yaml`.
- Source art has six NPC SVGs and three relic SVGs; no approved WebP replacements were present.
- Existing clues are I-1 through I-17.
- The ghoul portrait maps to `sangreal-mob-feralghouls`.
- Gendarme Officer, Logistics Officer, Wayfinder Analyst, Turin Intermediary and Watcher have **no actor record in this NPC pack**. Their portraits remain valid production jobs. Integration reports the missing record instead of inventing actors, statistics or history.
- Build tools: `npm run build`, `npm run validate`, `npm run audit`. `tools/push-local.sh` exists but is not called by this pipeline. Its destination must be verified for a separately authorized local installation, followed by the in-world Content Installer.
- Existing untracked `docs/handouts/` and the source brief were observed and preserved.

## Reference locking and calibration

First establish these single-image prop references: `ref-sangreal-case`, `ref-ouroboros-eye`, `ref-basarab-crest`, `ref-grey-lancia-scv47`, `ref-green-railway-pass`. Additional continuity references are `ref-ubs-key-tag`, `ref-rosary-thread-sheath`, `ref-phosphorus-canister`, `ref-phial` and `ref-sonnenberg-logo`. The clinic logo is a **design proposal** because the source requires recurring logo identity without specifying its geometry; human prop review locks the selected design.

All 16 portrait identities are represented: Corvi, Vane, Sabbatini, Graf, Hausmann, Ghiberti, Mercier, L’Entità operative, Basarab operative, Basarab Elder, feral ghoul, gendarme officer, logistics officer, Wayfinder analyst, Grey Watcher and Turin intermediary. A portrait becomes an immutable visual reference after final QA and asset approval. Human checkpoint approval is recorded for the character set, rather than requested for every image.

Recommended six-image calibration batch:

| Job | Medium | Required locked inputs |
|---|---|---|
| npc-corvi | Documentary portrait | Case |
| R01 | 16 mm CCTV | Corvi, Vane, case, green railway pass |
| R03 | 35 mm evidence | None |
| G03 | Carbon document | UBS key-tag typography, clinic logo |
| Z03 | SX-70 Polaroid | None |
| T01 | Telephoto stakeout | Corvi, Vane, case, grey Lancia |

Generate the necessary props and Vane portrait as prerequisites; they are additional standalone reference jobs, not panels within the six calibration images. Review grain, muted palette, shadow readability, 1987 detail, identity, medium, aspect, every Egg and composited wording. Then record the human `style_calibration` checkpoint. Complete and review the remaining character and prop references before bulk Rome production. Complete and review Rome before remaining Acts.

## Unresolved requirements and interpretations

Seven jobs are BLOCKED on source questions, with exact reasons in the manifest:

- R08/R09/V04: R08 depicts Corvi at 58 but requires the same photo session/tie as the much younger Corvi in 1962. V04 calls R09’s older prelate young. Resolve age/session/costume and lock the archival identity. Do not force a present-day portrait onto a younger face.
- G06: the existing I-8 supplies the cultured voice’s words, but neither it nor the art brief supplies the Turin telephone extension. The full transcript is not invented.
- N02: no canonical caliper value or units are provided.
- N07: the toll timestamp is relative to death, without a precise death time.
- relic-lodestone: no exact suppressed shelf-mark is provided.

Additional review notes are retained rather than silently changing the brief:

- `relic-phials`: the prompt says twelve phials and its Egg says eleven. Following the user’s clue-first priority, assemble a twelve-slot rack with eleven visible phials. Both source statements remain preserved.
- G01: include the Lancia cameo required by recurring Egg-A. The local calendar date is 17 September 1987; recurring Egg-E’s reference to calendar timestamps remains a review note.
- V03 references a canister vignette in Z06 that Z06 does not specify. Share the canister design without adding an unsolicited Z06 inset.
- V05: include the white-ash refuse required by recurring Egg-H.
- Z03’s intruding second Polaroid edge and N07’s grid of physical belongings are natural props required by the brief, not multi-image outputs.
- R08’s provisional 06:14 stamp derives arithmetically from “two hours after” 03:14; the asset stays blocked for the archival contradiction.

## Commands

Run from the module repository. Python 3, PyYAML and Pillow are required; the installed environment already provided them. `tools/art/requirements.txt` documents dependency ranges. No API key is required for the built-in image tool.

```bash
python3 tools/art/pipeline.py status
python3 tools/art/pipeline.py validate
python3 tools/art/pipeline.py refresh
python3 tools/art/pipeline.py queue --act Rome --status READY
python3 tools/art/pipeline.py prompt R01
```

`init --spec docs/intel-art-prompts.md --repo .` is for a fresh ledger only and refuses to overwrite an existing manifest. `refresh` recalculates readiness without changing generated or approved work. Source changes require explicit reconciliation that preserves production history; do not delete/reinitialize an active ledger.

The image generator is **Codex’s built-in image_gen tool**, operated by the agent following `OPERATOR.md`. The CLI supplies a durable one-job envelope; it does not pretend to call the tool from Python or offer an unattended API daemon. “Produce R01” means prepare that job, call the tool once, visually inspect its output, and carry it through the recorded stages. “Produce all READY Rome assets” means repeating that operation for each ID from the queue.

```bash
python3 tools/art/pipeline.py begin R01
# Agent reads the immutable attempt prompt, inspects inputs, and calls image_gen once.
python3 tools/art/pipeline.py ingest R01 /absolute/path/returned-by-imagegen.png
# Inspect the actual image, then complete the generated YAML report.
python3 tools/art/pipeline.py qa R01 art/qa/R01-attempt-001.yaml
```

After a NEEDS_EDIT decision:

```bash
python3 tools/art/pipeline.py begin R01 --operation edit --instructions 'Add only the missing pass; preserve the rest of the photograph.'
```

Use `recover ID --reason 'tool failure or production issue'` if a tool call fails or an attempt cannot continue. `--blocked` stops further production on that job and preserves the reason. Failed outputs remain under `art/rejected/<id>/`; history remains under `art/work/history/`.

### Exact text and final QA

For a flat/rotated surface, create a YAML layout with the base image SHA-256 and one layer per required text occurrence. `layers` may repeat a canonical string where the source requires repeated entries, but may not introduce a new string. Each layer has `text`, `font` (an actual local font path), `size`, `xy`, and optional RGBA `color`, `rotation`, `blur`, `mirror`. Coordinates are chosen **after inspecting the image**; no guessed coordinates are auto-approved. Use mirror mode for R06. Keep a worn typewriter, carbon, stamp, pencil or clock appearance appropriate to each surface.

```bash
python3 tools/art/pipeline.py composite R01 art/composite/R01-layout.yaml
```

For perspective, masking, curved paper or handwriting that requires a proper image editor, use a separately edited file plus provenance YAML containing `base_sha256`, `exact_text`, `editor`, `notes`:

```bash
python3 tools/art/pipeline.py composite-external R01 /absolute/path/composited.png art/composite/R01-provenance.yaml
```

Both paths require passed base visual QA and produce a separate intermediate with mandatory final visual inspection. They do not certify text correctness automatically. A base-image QA report can defer only text-marked Eggs to compositing; final QA permits no FAIL or AMBIGUOUS criteria.

For an image with no text, create its second QA report explicitly after visual QA:

```bash
python3 tools/art/pipeline.py qa-template R03 --final
python3 tools/art/pipeline.py qa R03 art/qa/R03-attempt-001-final.yaml
python3 tools/art/pipeline.py approve R03 --reviewer 'Codex visual QA'
```

Approval verifies dimensions, aspect, image hash and final QA, then saves a lossless WebP under the exact shipping filename and locks its hash. Minimum short edge is 1024 px; 1536–2048 is preferred. Never crop away Eggs. A below-minimum generation is preserved and rejected; any actual tool limitation requires explicit recorded policy adjustment rather than silently passing it.

### Human decisions

Only record a checkpoint after the user actually approves the concrete review set. `--evidence` quotes or identifies that approval; it is not a mechanism for inventing permission.

```bash
python3 tools/art/pipeline.py checkpoint style_calibration --reviewer 'USER_NAME' --evidence 'Actual approval message'
```

The six checkpoints are `style_calibration`, `character_references`, `prop_references`, `first_act`, `remaining_acts`, `final_integration`. Approval guards require the relevant assets first; final integration approval hashes the exact staged plan.

To resolve a blocked creative requirement after an explicit user answer, use `resolve ID art/work/decision.yaml`. The decision contains `asset`, `reviewer`, `evidence`, `instructions` and optional `exact_text_additions`. It preserves the original unresolved requirements in an audit record and appends the authorized resolution to future prompts. It never edits the canonical brief or an approved image.

## Foundry integration

`art/integration/cards/` holds 28 **drafts**, derived from the source Shows lines for players and Eggs for DA notes. No drafts have been added to the module. Review wording, clue visibility, `foundAtSlugs` and the template’s `hqFallback: 12` before approving the integration plan. V05/V06 are provisionally placed at Novara (L6), consistent with their pictured airfield evidence; review this placement in the wrap section.

```bash
python3 tools/art/pipeline.py integration-plan
# Review art/work/integration-stage/ against src/ and the plan's blocked list.
python3 tools/art/pipeline.py checkpoint final_integration --reviewer 'USER_NAME' --evidence 'Actual approval of this plan'
python3 tools/art/pipeline.py integrate
```

Only APPROVED shipping images enter a plan. Existing YAML descriptions and game mechanics remain byte-preserved by targeted image updates. NPC portrait and prototype token are updated together. New-card slugs are added to both board and web. N02 is proposed as an embedded detail in I-13 content, leaving N01 as its primary image; this placement is part of integration review. Missing NPC records block their integration without fabricating actors. Original SVGs remain.

Before applying, every source and staged file hash must still match the reviewed plan. Existing target art is never overwritten with a different image. Backups and transaction records are kept. Integration runs build, validate and audit; a failure restores the changed source files and leaves assets APPROVED. A failed build may leave `dist/` requiring a fresh build before any installation. A process termination during integration requires consulting `art/work/integration-backup-*/transaction.yaml` and reconciling the saved originals; do not blindly retry a partial transaction.

The build-only command is `python3 tools/art/pipeline.py build-validate`. No push-local or in-world action is automatic.

## Concurrency and tests

All mutating CLI commands take an exclusive filesystem lock, write manifests atomically and refresh the human status report. Generation happens outside that lock so multiple agents may each own a different begun job. Never edit the YAML ledger concurrently by hand. After calibration and reference checkpoints, assign remaining production by Act as requested, with one image per tool call and the same locked inputs. Keep each assigned job exclusively owned through its current attempt.

```bash
python3 -m unittest discover -s tools/art -p 'test_*.py'
```

Tests use temporary synthetic images solely to exercise approval, file integrity and rollback. These are not artwork and never enter the real manifest or count as visual QA.

## Surface lettering revisions

Review current candidates in [TEXT-REVISION-REVIEW.md](TEXT-REVISION-REVIEW.md). `tools/art/text_surface.py` exposes `lettering(image, exact_text, quadrilateral, style, seed)`: four corners are top-left, top-right, bottom-right, bottom-left. It renders pressure variation and wear into a supersampled perspective mask and blends with local material texture. Styles are carbon, hand, metal, plate and tiny. The hand style uses the explicitly drawn glyph vocabulary for the Z03 annotation; extend and visually review glyphs before using other text. Save into a new file, record provenance, then use `composite-external` for active jobs. Locked jobs receive separate manifest revision records and must not be overwritten. Every lettering result still needs visual QA at native size.
