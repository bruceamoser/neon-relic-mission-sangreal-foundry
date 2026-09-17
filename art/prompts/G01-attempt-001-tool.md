# G01 — Night Deposit

Use case: historical-scene

Global style: 1987 analog documentary photography, shot on film, no electronics or modern objects, historically accurate period detail, natural imperfections, dust and scratches, muted 1980s color palette of tobacco browns, olive, faded red and cold fluorescent green, high detail, photorealistic

Avoid: modern smartphones, digital cameras, LCD screens, LED lighting, modern cars, contemporary fashion, plastic, clean studio lighting, HDR, oversaturated colors, Instagram filter, text watermark, signature, cartoon, illustration, anime, 3D render, AI artifacts, extra fingers, warped hands, shiny skin, perfectly symmetric teeth

Medium: black-and-white 16mm surveillance film frame, heavy silver grain, high contrast, slight motion blur, slight lens vignette, wall-clock timestamp burned into the corner, camera mounted high looking down, grainy photocopy of a single film frame

Aspect ratio: 4:3. Minimum short edge 1024 px, prefer 1536–2048 px.

Period interpretation: period CRTs, film cameras, fluorescent tubes and analog equipment explicitly requested by the asset are permitted. No post-1987 electronics or objects.

Canonical character corvi: Italian man, 58, tall and gaunt, thinning grey hair combed back, deep-set dark eyes with bruised hollows, grey stubble, slightly hunched from exhaustion and low fever, black clerical simar with red piping and white collar, wire-rimmed reading glasses on a cord, ink-stained fingers, a worn leather strap across his chest, faint sweat sheen; carries an antique .32 revolver rarely visible

Canonical character mercier: Swiss-French man, 44, immaculate charcoal three-piece suit, manicured nails, thinning hair combed flat, gold dress watch, polite tight smile, faint sweat at the temples, carries a leather document tray

Canonical character watcher: utterly forgettable man, 45, grey gabardine raincoat, plain face, thinning hair, reading a folded newspaper, gold signet ring with a serpent-and-eye device barely visible; he appears in the background of surveillance photos in Rome, Geneva, Zurich and Turin

Reference inputs (identity/prop references, never panels or inserted pictures):

- npc-corvi: /mnt/disk4/repos/neon-relic-mission-sangreal-foundry/src/assets/art/npc-corvi.webp

- npc-mercier: /mnt/disk4/repos/neon-relic-mission-sangreal-foundry/src/assets/art/npc-mercier.webp

- npc-watcher: /mnt/disk4/repos/neon-relic-mission-sangreal-foundry/src/assets/art/npc-watcher.webp

- ref-sangreal-case: /mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/references/ref-sangreal-case.webp

- ref-ouroboros-eye: /mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/references/ref-ouroboros-eye.webp

- ref-grey-lancia-scv47: /mnt/disk4/repos/neon-relic-mission-sangreal-foundry/art/references/ref-grey-lancia-scv47.webp

Asset prompt (verbatim): CCTV still of a neoclassical Swiss bank lobby at night, an exhausted monsignor in a black cassock at the counter with a steel attaché case, a clerk in an immaculate suit attending him, polished marble floor reflecting a seated man in a grey raincoat reading a newspaper, wall clock and calendar, 16mm black-and-white surveillance grain, high contrast, slight motion blur.

Scene requirements: bank lobby CCTV, 22:41 — Corvi at the counter with the attaché, Mercier attending; two reflections in the polished marble.

Mandatory visible Eggs:

- G01-E1: in the marble reflection a grey raincoated man sits in the waiting chairs, newspaper on his knee — the Watcher

- G01-E2: the case on the counter sits on a bank cloth that Mercier has positioned precisely — he knows what it is worth

- G01-E3: a wall calendar reads 17 September 1987.

- G01-E4: Recurring Egg-A: grey Lancia Flavia 2000, white Vatican plates SCV 47, arriving cameo.

Exact text is a separate compositing stage. Generate suitable clean surfaces in their natural scene positions; no invented clue wording. The following source wording will be added later:

- 22:41

- 17 September 1987

- SANGREAL

- SCV 47

Production interpretation notes:

Recurring Egg-A adds the arriving grey Lancia beyond the local prompt. Egg-E mentions calendar timestamps while local requirement specifies 17 September 1987; preserve date and flag timestamp ambiguity for QA.

Restrained forensic horror; no gratuitous gore. Priority: correct clues, continuity, period, medium, composition, mood, decoration.

Create exactly ONE standalone image.
This is not a contact sheet.
Do not create multiple panels, alternate views, variations, comparison images, or inset images.
All requested details must exist naturally within the same single photograph.

Generation clarification: Reference images establish Corvi, Mercier, the seated Watcher, the closed steel case, the eye ring, and the grey Lancia only. Compose one high-mounted black-and-white bank CCTV frame. Corvi and Mercier must be clearly recognizable in profile or three-quarter view at the counter. Put the closed case squarely on a dark folded bank cloth. The polished floor must show the seated Watcher as a distinct second reflection, with newspaper on his knee. Through the glass entrance, show the grey Lancia arriving, small but identifiable, with a blank white plate reserved for later lettering. Include a wall clock and a blank calendar page large enough for later exact date. Leave a dark corner for a later optical 22:41 timestamp. Do not generate clue text, calendar date, plate characters, or case lettering.
