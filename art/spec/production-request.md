# Mission: Sangreal Art Production Pipeline

You are setting up and operating an automated image-production pipeline for the **Mission: Sangreal** module for **Project Neon Relic**.

The repository contains an art-production specification named:

`intel-art-prompts.md`

Treat that document as the **canonical source of truth** for all requested visual assets.

Your job is to build a repeatable production system that:

1. Extracts every requested image from the specification.
2. Tracks every image as an independent production job.
3. Generates exactly **one standalone image per asset**.
4. Maintains consistent characters, props, symbols, vehicles, locations, and period details across the entire set.
5. Performs visual QA against the specification after generation.
6. Uses targeted image edits when possible rather than regenerating good images unnecessarily.
7. Handles exact text separately from image generation when appropriate.
8. Saves approved images under the exact required filenames.
9. Updates the Foundry VTT module after asset approval.
10. Runs the repository's build and validation tools after integration.

Do not generate contact sheets, grids, collages, storyboards, multi-panel images, or multiple image variants inside one file.

---

# 1. SOURCE AUTHORITY

The canonical art specification is:

`intel-art-prompts.md`

Read the entire document before creating the pipeline.

The specification contains:

* global Style Bible
* negative prompt guidance
* photographic medium recipes
* recurring visual motifs
* character reference descriptions
* NPC portrait requests
* relic plate requests
* intel-card images
* filenames
* aspect ratios
* hidden visual clues called **Eggs**
* continuity rules
* clue meanings
* Foundry integration instructions

Do not silently rewrite, reinterpret, simplify, or replace these requirements.

If the specification and this instruction file conflict, `intel-art-prompts.md` wins for asset-specific creative requirements.

These instructions control the **production process**.

---

# 2. CORE PRODUCTION PRINCIPLE

Every asset is its own job.

One manifest record.

One image-generation request.

One output image.

One QA result.

Never combine several requested assets into a single generated image.

This rule is absolute.

Forbidden outputs include:

* contact sheets
* grids
* collages
* four-up image sheets
* before/after panels
* mood boards
* multiple variations inside one canvas
* comic-style panels
* storyboard sequences
* portrait collections

If an asset requires multiple visible subjects, they may appear naturally within the same scene because the specification requires them.

That is different from combining multiple requested assets.

---

# 3. REQUIRED PIPELINE ARCHITECTURE

Implement the following logical stages:

```text
SPECIFICATION
      |
      v
ART MANIFEST
      |
      v
REFERENCE LOCKING
      |
      v
IMAGE GENERATION
      |
      v
VISUAL QA
      |
      +---- FAIL ----> EDIT / REGENERATE
      |                    |
      |                    v
      +<-------------------+
      |
      v
TEXT COMPOSITING
      |
      v
FINAL QA
      |
      v
APPROVED ASSET
      |
      v
FOUNDRY INTEGRATION
      |
      v
BUILD + VALIDATE
```

Do not skip QA.

A successfully generated image is not automatically a completed asset.

---

# 4. CREATE AN ART MANIFEST

Create:

`art/art-manifest.yaml`

If `art/` does not exist, create it.

Extract every requested asset from `intel-art-prompts.md`.

The manifest should contain one entry per requested image.

Include:

```yaml
assets:

  - id: R01

    name: CCTV Reel #87-04

    category: intel

    act: Rome

    output:
      filename: i02-cctv-porta-santanna-0314.webp
      path: src/assets/art/intel/i02-cctv-porta-santanna-0314.webp

    aspect_ratio: "4:3"

    medium: cctv_16mm

    source_section: "Act I — Rome / R01"

    characters:
      - corvi
      - vane

    reference_assets:
      - npc-corvi.webp
      - npc-vane.webp
      - ref-sangreal-case.webp

    continuity_elements:
      - green-railway-pass
      - sangreal-case

    eggs:
      - id: R01-E1
        requirement: "Corvi casts a faint shadow while the case casts a pitch-black shadow."
        mandatory: true

      - id: R01-E2
        requirement: "Green railway pass protrudes from Corvi's coat."
        mandatory: true

      - id: R01-E3
        requirement: "Vane is visible at the far left of frame."
        mandatory: true

      - id: R01-E4
        requirement: "Timestamp reads 03:14 17-IX-87."
        mandatory: true
        composite_text: true

    exact_text:
      - "03:14 17-IX-87"

    status: PENDING

    generation:
      attempts: 0
      approved_attempt: null
      prompt_file: null

    qa:
      status: PENDING
      notes: []
```

Apply the same structure to every asset.

---

# 5. ASSET CATEGORIES

At minimum support:

```text
npc
relic
intel
reference
```

Expected production assets include approximately:

* 16 NPC portraits
* 3 optional relic plates
* 43 intel-card images

The specification is authoritative if counts differ.

Do not assume the count.

Parse the document.

---

# 6. CREATE A STATUS SYSTEM

Every manifest item must have exactly one current status.

Supported statuses:

```text
PENDING
REFERENCE_REQUIRED
READY
GENERATING
GENERATED
QA_FAILED
NEEDS_EDIT
NEEDS_REGENERATION
TEXT_COMPOSITE
FINAL_QA
APPROVED
INTEGRATED
BLOCKED
```

Use the manifest as the authoritative production tracker.

Never overwrite an APPROVED image automatically.

Approved assets are immutable unless explicitly instructed otherwise.

---

# 7. CREATE PRODUCTION DIRECTORIES

Create:

```text
art/
art/prompts/
art/qa/
art/references/
art/work/
art/composite/
art/rejected/
```

Purpose:

```text
art/prompts/
    Final assembled prompts used for generation.

art/qa/
    QA reports for each generated asset.

art/references/
    Internal reference images used for continuity.

art/work/
    Intermediate generations.

art/composite/
    Intermediate images requiring exact text.

art/rejected/
    Failed generations preserved for auditing.
```

Final shipping assets still belong in the locations defined by the art specification.

Examples:

```text
src/assets/art/npc-*.webp

src/assets/art/relic-*.webp

src/assets/art/intel/*.webp
```

---

# 8. REFERENCE LOCKING

Do not immediately generate all intel images.

The first production stage is establishing visual continuity.

Generate and approve recurring characters first.

These should include the NPC portraits defined in the specification.

Once approved, an NPC portrait becomes the authoritative visual reference for that character.

Examples:

```text
npc-corvi.webp
npc-vane.webp
npc-sabbatini.webp
npc-graf.webp
npc-hausmann.webp
npc-basarab-elder.webp
npc-ghiberti.webp
npc-mercier.webp
npc-entita-operative.webp
npc-basarab-operative.webp
npc-watcher.webp
```

Use all characters defined by the source document.

Approved portraits must later be supplied as visual references to scenes containing those characters whenever the image-generation system permits reference images.

Do not independently reinterpret a locked character.

---

# 9. CREATE INTERNAL REFERENCE ASSETS

Recurring objects and symbols should also receive locked reference artwork before large-scale generation.

Create internal production references for at least:

```text
ref-sangreal-case.webp
ref-ouroboros-eye.webp
ref-basarab-crest.webp
ref-grey-lancia-scv47.webp
ref-green-railway-pass.webp
```

Also create references for other highly recurring props if doing so materially improves continuity.

These are production assets.

They do not necessarily ship with the Foundry module.

Store them under:

```text
art/references/
```

---

# 10. CHARACTER CONTINUITY

The character blocks inside `intel-art-prompts.md` are canonical.

Every generation containing a known character must use:

1. the character description from the specification
2. the approved visual reference image, when available

Preserve:

* facial identity
* apparent age
* ethnicity/nationality presentation where specified
* build
* hair
* costume
* distinguishing props
* scars
* jewelry
* posture
* demeanor

Do not progressively reinterpret a character as the project continues.

The Corvi in Rome must look like the Corvi in Geneva and Turin.

The Vane in a portrait must clearly be the same person seen in CCTV or surveillance images.

---

# 11. PROP AND MOTIF CONTINUITY

Recurring motifs are clue language.

They are not generic decoration.

The following must remain visually consistent across appearances:

* Ouroboros-Eye
* SANGREAL brass plaque
* green EC 30 railway pass
* UBS 4409-C key tag
* Basarab crest
* Vatican diplomatic plates
* Twelve Phials case
* grey Lancia Flavia 2000
* recurring Watcher identity
* recurring Basarab identifiers

Read the recurring motifs and Easter Egg section of the specification carefully.

Once a visual design is approved, lock it.

---

# 12. GLOBAL PERIOD RULE

Everything must appear to exist in **1987 or earlier** unless explicitly stated otherwise.

Reject imagery containing obvious post-1987 details.

Examples:

* smartphones
* modern flat-screen displays
* LEDs
* digital cameras
* contemporary vehicles
* modern clothing
* modern security cameras
* modern hospital monitors
* contemporary office equipment
* modern signage
* modern street furniture
* modern tactical equipment

CRT displays are acceptable.

Analog film cameras are acceptable.

Reel-to-reel equipment is acceptable.

Microfiche is acceptable.

Typewriters are acceptable.

Photocopiers and carbon copies appropriate to the period are acceptable.

---

# 13. GLOBAL IMAGE STYLE

The Style Bible inside `intel-art-prompts.md` is canonical.

Every generation should incorporate its global primer.

Images should generally appear:

* photorealistic
* analog
* found rather than staged
* imperfect
* forensic or documentary
* visually plausible for 1987
* restrained rather than cinematic fantasy

Typical palette:

* tobacco brown
* olive
* faded red
* cold fluorescent green
* muted film color

Avoid:

* HDR
* perfect studio lighting
* excessive dramatic grading
* oversaturation
* modern Instagram aesthetics
* glossy CGI appearance
* obvious AI skin
* overly perfect teeth
* illustration unless specifically requested

---

# 14. MEDIUM RECIPES

Extract all medium recipes from the source document and represent them programmatically.

Suggested IDs:

```text
cctv_16mm
evidence_35mm
polaroid_sx70
passport_id
archival_bw
photocopy_carbon
telephoto_stakeout
aerial_recon
```

For each asset, assemble the final image prompt using:

```text
GLOBAL STYLE
+
MEDIUM RECIPE
+
CHARACTER REFERENCES
+
CHARACTER DESCRIPTION
+
PROP REFERENCES
+
ASSET PROMPT
+
VISIBLE EGG REQUIREMENTS
+
PERIOD CONSTRAINTS
```

Save the assembled prompt as:

```text
art/prompts/<asset-id>.md
```

Example:

```text
art/prompts/R01.md
```

---

# 15. IMAGE GENERATION JOB FORMAT

Every generation job should operate on exactly one manifest asset.

Pseudo-operation:

```text
load asset R01
load global Style Bible
load CCTV medium recipe
load Corvi character block
load Vane character block
load approved Corvi reference image
load approved Vane reference image
load approved SANGREAL case reference

assemble prompt
generate one image
save working image
increment attempt count
send to QA
```

Never send an entire Act's images as one generation request.

Parallel workers may each generate different assets.

Each individual worker still generates one image at a time.

---

# 16. PROMPT ASSEMBLY

Each generated prompt should explicitly state near the end:

```text
Create exactly ONE standalone image.

This is not a contact sheet.

Do not create multiple panels, alternate views, variations, comparison images, or inset images.

All requested details must exist naturally within the same single photograph.
```

This instruction should be included in every image-generation request.

---

# 17. EGG REQUIREMENTS ARE ACCEPTANCE CRITERIA

Every image's **Eggs** are required QA criteria.

Do not treat them as optional flavor.

After generation, inspect the resulting image.

For each Egg assign:

```text
PASS
FAIL
AMBIGUOUS
```

Example QA:

```yaml
asset: R01
attempt: 2

eggs:

  R01-E1:
    status: PASS
    notes: "Case shadow clearly darker than Corvi's."

  R01-E2:
    status: FAIL
    notes: "No visible railway pass."

  R01-E3:
    status: PASS
    notes: "Nun visible along left edge."

  R01-E4:
    status: AMBIGUOUS
    notes: "Timestamp exists but reads incorrectly."

overall: QA_FAILED
```

Save this to:

```text
art/qa/R01-attempt-002.yaml
```

---

# 18. QA MUST INSPECT THE IMAGE

Never grade an image based only on the prompt.

The generated image itself must be inspected visually.

Check:

* mandatory Eggs
* character identity
* recurring prop identity
* period accuracy
* expected photographic medium
* image composition
* aspect ratio
* clue visibility
* anatomy
* hands
* faces
* accidental duplicate objects
* unwanted modern objects
* unintended text
* distorted vehicles
* malformed symbols
* incorrect numbers
* impossible object geometry

---

# 19. QA DECISION RULES

Use:

```text
APPROVED
NEEDS_EDIT
NEEDS_REGENERATION
```

Choose `NEEDS_EDIT` when:

* composition is otherwise excellent
* only one or two details are missing
* clue placement needs correction
* a prop should be added
* something modern should be removed
* lighting needs small adjustment
* character identity needs minor correction

Choose `NEEDS_REGENERATION` when:

* scene composition is fundamentally wrong
* character identity is substantially wrong
* medium is incorrect
* too many Eggs are absent
* historical setting is badly wrong
* AI artifacts dominate the image
* image became a contact sheet or collage

---

# 20. PREFER TARGETED EDITS

Do not throw away a strong generation because one Egg is missing.

Prefer image editing when possible.

Example:

```text
Preserve the image exactly as it is except for the following change:

Add a small green Italian State Railways pass protruding naturally from Corvi's left coat pocket.

The pass should be visible but subtle.

Do not change Corvi's face, clothing, attaché case, lighting, camera position, background, timestamp area, or Vane's position.
```

Targeted edits should explicitly preserve all unrelated image content.

After editing, run QA again.

---

# 21. EXACT TEXT POLICY

Generative text must not be trusted for gameplay-critical wording.

If players are expected to read exact wording, numbers, codes, dates, registrations, signatures, case IDs, stamps, or labels, composite them separately.

Examples include:

```text
03:14 17-IX-87
SANGREAL
UBS 4409-C
VANE, C.
XII-1 / 12
YR-BAS
REGISTRY 16 — AMSTERDAM
SCV 47
```

The source document explicitly identifies document assets where compositing is preferred.

Extend this principle whenever textual accuracy affects gameplay.

---

# 22. COMPOSITING WORKFLOW

For an asset requiring exact text:

1. Generate the underlying artifact.
2. Preserve a visually plausible clean area.
3. Add exact source text afterward.
4. Match:

   * typewriter font
   * carbon copy
   * rubber stamp
   * handwritten ink
   * timestamp burn-in
   * archival notation
   * label printer
   * stencil
5. Add modest imperfection.
6. Do not make text digitally pristine unless context requires it.
7. Run final visual QA.

Do not invent additional clue wording.

---

# 23. DO NOT OVER-TEXT IMAGES

Only composite wording explicitly required by the source or necessary for gameplay.

Do not fill documents with large amounts of fake text.

Most surrounding document text should remain:

* softly blurred
* cropped
* visually plausible
* unreadable
* partial

The exact clue should remain readable.

---

# 24. CALIBRATION PHASE

Do not begin full production immediately.

First produce a representative calibration set.

Choose approximately six assets containing different mediums:

1. NPC portrait
2. CCTV frame
3. 35mm evidence photograph
4. document or photocopy
5. Polaroid
6. telephoto surveillance shot

Good candidates from the source include examples such as:

```text
npc-corvi
R01
R03
G03
Z03
T01
```

The exact calibration set may vary.

The purpose is to establish:

* color
* grain
* period accuracy
* clue visibility
* darkness level
* character realism
* photographic imperfection
* text-compositing conventions

Do not mass-produce the remaining set until the calibration assets are approved.

---

# 25. PARALLEL PRODUCTION

Once calibration and reference locking are complete, parallelize by Act.

Suggested workstreams:

```text
Rome Agent
Geneva Agent
Zurich Agent
Turin Agent
Novara Agent
Vatican Agent
```

Each worker:

* reads the same manifest
* reads the same Style Bible
* uses the same locked character references
* uses the same locked prop references
* writes only its assigned assets
* generates one image per generation request
* runs QA
* updates manifest state safely

Do not let workers independently redesign recurring elements.

---

# 26. CONCURRENCY SAFETY

Avoid simultaneous edits to the same manifest file if parallel workers cannot coordinate file locking.

If necessary, each worker writes status changes into:

```text
art/work/status/<agent>/<asset>.yaml
```

Then a coordinator merges state into:

```text
art/art-manifest.yaml
```

Do not risk corrupting the manifest.

---

# 27. APPROVAL LOCK

Once:

```yaml
status: APPROVED
```

the final image becomes immutable.

Before overwriting an approved asset:

* stop
* flag the attempted change
* require explicit direction

Never automatically regenerate approved work during later bulk runs.

---

# 28. FOUNDRY INTEGRATION

Only integrate assets with:

```text
status: APPROVED
```

Follow the paths and Foundry instructions in `intel-art-prompts.md`.

Existing information cards should receive updated image paths.

Example:

```yaml
img: modules/neon-relic-mission-sangreal/assets/art/intel/i02-cctv-porta-santanna-0314.webp
```

New information cards should be created where required.

Do not change clue-writing or game logic beyond what the source instructs.

---

# 29. NPC INTEGRATION

For approved portraits:

* replace old SVG references where required
* point NPC records at `.webp`
* update actor portrait paths
* update prototype token texture sources
* retain canonical filenames

Do not delete original source art until replacement references are verified.

---

# 30. IMAGE FORMAT

Final shipping files should be WebP unless the repository establishes another explicit requirement.

Preserve enough quality that visual clues remain legible.

Do not aggressively compress evidence photos.

Recommended minimum short edge:

```text
1536 px preferred
1024 px absolute minimum
```

unless image-generation limitations dictate otherwise.

---

# 31. ASPECT RATIOS

Honor the ratios in the source.

Examples:

```text
NPC portrait          4:5
CCTV                  4:3
Evidence photo        3:2
Polaroid              1:1
Document              3:4
Telephoto             3:2
Archival              3:2
```

Do not casually crop after generation if the crop removes required Eggs.

---

# 32. PRODUCTION COMMANDS

Create scripts where useful.

Suggested:

```text
tools/art/manifest.py
tools/art/status.py
tools/art/build-prompt.py
tools/art/qa-report.py
tools/art/composite.py
tools/art/integrate.py
```

Optionally expose commands such as:

```bash
npm run art:manifest
npm run art:status
npm run art:prompt -- R01
npm run art:qa -- R01
npm run art:integrate
```

Use the repository's existing tooling conventions where possible.

Do not add unnecessary dependencies.

---

# 33. STATUS REPORT

Create a human-readable production report:

`art/STATUS.md`

Example:

```markdown
# Mission Sangreal Art Status

## Summary

Total: 62
Approved: 8
Generated / Awaiting QA: 2
Needs Edit: 3
Needs Regeneration: 1
Pending: 48

## Characters

| Asset | Status |
|---|---|
| npc-corvi | APPROVED |
| npc-vane | APPROVED |
| npc-sabbatini | READY |

## Rome

| ID | Asset | Status | Attempts |
|---|---|---|---:|
| R01 | Porta Sant'Anna CCTV | APPROVED | 2 |
| R02 | Second Descent | NEEDS_EDIT | 1 |
```

Rebuild this report whenever manifest state changes.

---

# 34. LOG GENERATION HISTORY

For every attempt record:

* asset ID
* date/time
* model used
* prompt file
* reference images
* source image if edited
* operation:

  * generate
  * edit
  * composite
* QA result
* rejection reason

Store logs under:

```text
art/work/history/
```

Do not rely on chat history as the production record.

---

# 35. DO NOT DELETE FAILED WORK IMMEDIATELY

Move rejected attempts under:

```text
art/rejected/<asset-id>/
```

This allows later comparison and prevents expensive repeated mistakes.

---

# 36. FINAL QA

Before integration, every asset must pass two levels.

## Visual QA

Check:

* composition
* identity
* clues
* motifs
* period detail
* aspect ratio
* medium
* artifacts

## Production QA

Check:

* exact filename
* exact output directory
* valid WebP
* minimum dimensions
* no duplicate filename
* manifest marked APPROVED
* references resolve correctly

Only then integrate.

---

# 37. BUILD AND VALIDATE

After integration, run the project's required validation commands.

The source currently specifies commands equivalent to:

```bash
npm run build
npm run validate
```

Use any additional repository validation already present.

If available:

```bash
./tools/push-local.sh
```

should only be used when explicitly appropriate to the local environment.

Do not assume deployment credentials or destinations.

---

# 38. DO NOT CHANGE GAME CONTENT CASUALLY

This task is primarily an art-production workflow.

Do not independently rewrite:

* clue contents
* card descriptions
* game rules
* NPC history
* mission timeline
* factions
* character relationships
* artifact behavior
* Foundry schema

If integration exposes an apparent contradiction, report it rather than silently correcting it.

---

# 39. ERROR HANDLING

If generation cannot satisfy an Egg after repeated attempts:

1. mark asset `BLOCKED`
2. preserve best attempt
3. identify failed requirement
4. recommend:

   * targeted edit
   * manual composite
   * manual Photoshop/GIMP intervention
   * simplified visual representation

Do not endlessly regenerate an asset.

---

# 40. CREATIVE PRIORITIES

When requirements compete, use this order:

1. Correct clue
2. Character/prop continuity
3. Historical accuracy
4. Correct photographic medium
5. Scene composition
6. Mood
7. Decorative detail

A beautiful image with a missing clue fails.

A slightly rough analog photograph containing all required evidence succeeds.

---

# 41. HORROR TONE

The horror should generally remain:

* forensic
* uncanny
* restrained
* documentary
* unsettling through implication

Avoid gratuitous gore.

The Novara section should remain especially clinical.

The viewer should feel they are looking at evidence recovered from a real operation.

---

# 42. USER REVIEW CHECKPOINTS

Structure production so a human can approve:

### Checkpoint 1

Style calibration

### Checkpoint 2

Character references

### Checkpoint 3

Recurring props and symbols

### Checkpoint 4

First complete Act

### Checkpoint 5

Remaining Acts

### Checkpoint 6

Final integration

Do not require human approval after every single image unless explicitly requested.

---

# 43. INITIAL TASKS

Start by doing the following.

## Step 1

Read:

`intel-art-prompts.md`

completely.

## Step 2

Inspect repository structure and determine:

* module paths
* existing art
* NPC YAML
* clue YAML
* information web
* case board
* existing build scripts

Do not change anything yet.

## Step 3

Create:

```text
art/art-manifest.yaml
art/STATUS.md
art/prompts/
art/qa/
art/references/
art/work/
art/composite/
art/rejected/
```

## Step 4

Populate the complete manifest from `intel-art-prompts.md`.

Do not omit optional assets; mark them as optional.

## Step 5

Produce a summary containing:

```text
total assets
NPC portraits
optional relics
intel images
existing-card replacements
new-card images
assets requiring exact text
recurring characters
recurring visual motifs
```

## Step 6

Identify which reference assets should be generated and locked before production.

## Step 7

Recommend the six-image calibration batch.

Do not start mass generation yet.

---

# 44. AFTER SETUP

Once setup is complete, the intended command/workflow should allow a human to say something equivalent to:

```text
Produce R01
```

or:

```text
Produce all READY Rome assets.
```

The system should then:

```text
assemble prompt
load references
generate one image
inspect image
record QA
edit/regenerate if appropriate
composite exact text if required
perform final QA
save approved output
update manifest
update STATUS.md
```

At no point should "produce all Rome assets" mean creating one multi-image sheet.

It means executing multiple independent image jobs.

---

# 45. FINAL DEFINITION OF DONE

The art-production system is considered correctly established when:

* every requested image exists in the manifest
* every image is individually addressable
* characters and recurring props have a reference-lock mechanism
* prompts can be reproducibly assembled
* every generation produces one image only
* visual QA checks Eggs against actual generated images
* exact clue text can be composited separately
* failed generations are tracked rather than silently replaced
* approved images cannot be accidentally overwritten
* Foundry integration only consumes approved assets
* repository build and validation can run after integration
* production status can be understood without reading chat history

Build the system around these requirements.
