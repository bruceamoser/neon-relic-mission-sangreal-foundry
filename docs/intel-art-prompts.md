# Mission: Sangreal — Intel Art Prompt Pack

**Purpose:** a complete generation brief for the player-facing intel handouts — photographic information cards, documents, and NPC portraits — for *Mission: Sangreal* (SANGREAL-87-091). Feed each prompt (plus the Style Bible and the character reference blocks) to your image generator, one asset at a time.

**Contents**

1. How to use this pack (workflow, naming, sizing, imports)
2. Style Bible — global primer, negative prompts, medium recipes
3. Character reference blocks (paste into any prompt the character appears in)
4. NPC portraits — 6 replacements (replace the current SVG art) + 10 additions
5. Intel card images — 43 assets across all seven locations/acts
6. Recurring continuity "easter eggs" (the details sharp players will catch)
7. Clue index — what each hidden detail proves
8. Import checklist — filenames, Foundry wiring, new-card YAML

---

## 1. How to use this pack

**Workflow**

1. Generate at the largest size your tool allows (minimum 1024 px on the short edge; 1536–2048 px preferred).
2. Check the asset against its **Eggs** line — regenerate until every hidden detail is actually visible and readable enough to spot.
3. Name the file with the exact filename given; drop it in the folder given.
4. For the four document-type assets where exact wording matters (escrow slip, telex, flight clearance, Sabbatini memo), it is easier and cleaner to **composite the text**: generate the blank artifact/photocopy texture, then type the real wording over it in an image editor at the stated spot. Prompts for those assets say *“leave clean paper area for composited text.”*
5. When a batch is done, use §8 to wire the images into Foundry (existing cards get their `img` set; new cards get created in `sangreal-clues.yaml`).

**Aspect ratios & targets**

| Asset type | Ratio | Notes |
| --- | --- | --- |
| NPC portraits / ID photos | 4:5 portrait | Face centered, head-and-shoulders; Foundry crops square — keep eyes in the middle third |
| CCTV stills | 4:3 | Slight fisheye, timestamp bar |
| Evidence / crime-scene photos | 3:2 | 35 mm flash look |
| Polaroids | 1:1 + white border | SX-70 frame with chemical edge |
| Document scans | 3:4 or A5 landscape | Flat, top-down, photocopy texture |
| Stakeout / telephoto | 3:2 | Long-lens compression, haze |
| Archival photos | 3:2 | B/W or faded color, scratches |

**Where files live**

- NPC portraits → `src/assets/art/npc-<slug>.webp` (same basenames as the existing SVGs — drop-in replacements)
- Relic plates (optional) → `src/assets/art/relic-<slug>.webp`
- Intel card images → `src/assets/art/intel/<id>-<slug>.webp` (folder does not exist yet — create it)
- All are served in Foundry as `modules/neon-relic-mission-sangreal/assets/art/…`

**Tone guardrails**

- Everything is **1987 or earlier**. No smartphones, no digital cameras, no LED anything, no modern cars. Televisions are CRT; cameras are film; paperwork is typed, carbon-copied, or hand-written.
- Photographs must look **found, not composed**: evidence-angle lighting, evidence tags, dust, stains, marginal notes.
- Horror is implied and forensic, never gore-porn. The Novara assets are grim but clinical.

---

## 2. Style Bible

### 2.1 Global primer (prefix every prompt)

> `1987 analog documentary photography, shot on film, no electronics or modern objects, historically accurate period detail, natural imperfections, dust and scratches, muted 1980s color palette of tobacco browns, olive, faded red and cold fluorescent green, high detail, photorealistic`

### 2.2 Global negative prompt

> `modern smartphones, digital cameras, LCD screens, LED lighting, modern cars, contemporary fashion, plastic, clean studio lighting, HDR, oversaturated colors, Instagram filter, text watermark, signature, cartoon, illustration, anime, 3D render, AI artifacts, extra fingers, warped hands, shiny skin, perfectly symmetric teeth`

### 2.3 Medium recipes (append after the global primer)

| Medium | Prompt fragment |
| --- | --- |
| **CCTV (16 mm film transfer)** | `black-and-white 16mm surveillance film frame, heavy silver grain, high contrast, slight motion blur, slight lens vignette, wall-clock timestamp burned into the corner, camera mounted high looking down, grainy photocopy of a single film frame` |
| **35 mm evidence photo** | `35mm color negative, on-camera flash, harsh falloff into darkness, evidence ruler and marker card in frame, slight overexposure on close surfaces, film grain, institutional evidence documentation` |
| **SX-70 Polaroid** | `SX-70 Polaroid, white instant-photo border with chemical staining along the edge, muted crushed colors, slight focus softness, held slightly askew when photographed` |
| **ID / passport photo** | `passport-style frontal headshot, flat direct flash, slightly overexposed, plain institutional backdrop, 1980s passport photograph pasted onto a document, visible paper texture` |
| **Archival B/W** | `archival black-and-white photograph, 1950s–60s press grain, slight vignette, emulsion scratches, white border with handwritten archive notation on the sleeve` |
| **Photocopy / carbon** | `top-down photograph of a photocopied or carbon-copied typed document on a desk, visible grime and fingerprints, weak contrast, occasional typewriter strike-throughs, stray staple holes, leave a clean area of paper for composited text` |
| **Telephoto stakeout** | `surveillance photograph shot through a 400mm telephoto lens from a parked car, atmospheric haze, foreground window-frame edge intruding, slight handheld motion, grain pushed one stop` |
| **Aerial** | `low-altitude aerial photograph from a light aircraft, slightly tilted horizon, haze, airfield with period hangars, printed as a reconnaissance briefing sheet with annotation marks` |

### 2.4 Recurring visual motifs (use exactly these — they are the clue language)

- **The Ouroboros-Eye** — a serpent eating its tail encircling an open eye; embossed in leather, stamped on a card, cast in a signet ring, enameled as a lapel pin. (Talamasca / The Order of the Watchers.)
- **The SANGREAL brass sign** — small, tarnished, one word in stamped capitals, screw holes in the corners.
- **Green railway pass** — Italian State Railways, route `EC 30 (Romulus) — Roma Termini → Genève Cornavin`.
- **Locker key tag** — brass, stamped `UBS 4409-C`.
- **The Basarab crest** — a stylized dragon-wolf with a cross in its jaws (Wallachian noble arms), always small: a signet ring, a crate stencil, a tail-fin decal.
- **Vatican diplomatic plates** — white plate, black `SCV` prefix.
- **The Twelve Phials case** — 1964 brushed-steel attaché, dual combination deadbolts, small brass plaque; interior (when shown) molded blue velvet, twelve thick Roman-glass phials sealed in red beeswax, filled with dark un-coagulated blood.
- **The grey Lancia Flavia 2000** — Vatican diplomatic plates `SCV 47`; it follows the cell from city to city.

---

## 3. Character reference blocks

> Paste the matching block into any prompt where that character appears (portrait, CCTV, stakeout, crime scene). Keep one physical description per character across **all** assets — the players will compare.

**CORVI — Monsignor Matteo Corvi**
`Italian man, 58, tall and gaunt, thinning grey hair combed back, deep-set dark eyes with bruised hollows, grey stubble, slightly hunched from exhaustion and low fever, black clerical simar with red piping and white collar, wire-rimmed reading glasses on a cord, ink-stained fingers, a worn leather strap across his chest, faint sweat sheen; carries an antique .32 revolver rarely visible`

**VANE — Sister Claudia Vane**
`woman, early 30s, composed and perfectly still, pale grey eyes that never widen, dark chestnut hair completely hidden under a plain black veil, modest black-and-grey religious dress, small silver cross at the throat, plain wooden rosary at the belt, immaculate practical shoes, hands usually folded; a faint scar on her right knuckles; carries a slim leather document folio`

**SABBATINI — Cardinal Enrico Sabbatini**
`Italian cardinal, 64, silver hair slicked back, heavy jaw, hooded pale eyes, black cassock with scarlet piping and scarlet fascia, pectoral cross, gold signet ring, imperious stillness, half his face lit by a green banker's lamp`

**GRAF — Dr. Elizabeth Graf**
`Swiss-German woman, 41, blonde hair loosely tied back, sharp cheekbones, deep exhaustion shadows, white lab coat over blue surgical scrubs, reading glasses pushed up into her hair, a slide box clutched in both hands, hands faintly trembling`

**HAUSMANN — Kurt Hausmann (before / after)**
Before: `Swiss man, 62, formerly heavyset now gaunt from illness, thinning grey hair, expensive charcoal suit and silk tie, gold watch, banker's soft hands`
After: `same man transformed — pale grey waxy skin with mottled fluorescent burns on face and hands, fully dilated black pupils with no reaction to light, patches of missing hair, blood-crusted mouth and fingers, torn collar, immaculately tailored suit now filthy, posture wrong — utterly still, or a predatory crouch`

**GHIBERTI — Father Ghiberti**
`Italian priest, 55, thin and nervous, round wire glasses taped at one hinge, dusty black cassock, an archive cardigan underneath, clutching a cardboard file folder against his chest, mid-flinch smile`

**MERCIER — Jean-Paul Mercier**
`Swiss-French man, 44, immaculate charcoal three-piece suit, manicured nails, thinning hair combed flat, gold dress watch, polite tight smile, faint sweat at the temples, carries a leather document tray`

**L'ENTITÀ OPERATIVE**
`Swiss man, 38, military build, cropped dark hair, colourless eyes, grey wool overcoat over a concealed tactical vest, black leather gloves, compact submachine gun carried low and out of sight, a phosphorus grenade canister clipped to the vest, completely impassive face`

**BASARAB OPERATIVE**
`ageless vampire presenting as late 30s, androgynous and exact, pale olive skin, black eyes with a faint red catchlight only in darkness, black hair to the collar, high-collared black wool coat over dark 1980s clothing, kidskin gloves, unnaturally still — appears in one asset standing on a vertical wall`

**BASARAB ELDER**
`vampire elder presenting as late 60s, aristocratic, aquiline nose, swept-back grey-white hair, deep facial lines, long black wool greatcoat with a high collar, signet ring bearing a small dragon-wolf crest, regarding the viewer with mild, patient curiosity, lit by candlelight only`

**FERAL GHOUL**
`reanimated human husk, charred grey skin split like old leather, slack jaw, clouded eyes, one arm hanging at an impossible jointless angle, hospital bracelet still on the wrist, moving mid-lunge`

**Supporting contacts (briefing NPCs)**
Gendarme Duty Officer: `Vatican gendarme, 45, navy uniform with white gloves and brass buttons, peaked cap, weary clerk's face, brass clipboard chain`
Logistics Officer: `woman, 52, field jacket over a turtleneck, short cropped grey hair, a clipboard and a thermos, windburnt practical face`
Wayfinder Analyst: `man, 60, shirtsleeves and loosened tie, headphones around his neck, reading glasses, a reel-to-reel machine behind him, myopic intensity`

**THE GREY WATCHER (continuity egg)**
`utterly forgettable man, 45, grey gabardine raincoat, plain face, thinning hair, reading a folded newspaper, gold signet ring with a serpent-and-eye device barely visible; he appears in the background of surveillance photos in Rome, Geneva, Zurich and Turin`

**THE TURIN INTERMEDIARY**
`Italian man, 50s, elegant camel overcoat and silk scarf, leather gloves, a paper-banded cigar, face always half-turned from camera or in shadow — identifiable only by the coat, the cigar, and a ring of grey hair`

---

## 4. NPC Portraits

> Format: **filename · aspect**. Each is a Foundry item portrait. Replacements should be visually distinct from the current flat SVGs — fully painterly/photographic.

### Replacements (replace the existing SVG art)

**`npc-corvi.webp` — 4:5 portrait**
Prompt: `Character portrait of CORVI (see reference) seated in a dim baroque archive at night, surrounded by leather-bound volumes, holding a fountain pen; lit by a single desk lamp, warm tungsten against cold shadow, fever-sweat on his brow, a locked attaché case barely visible at the edge of frame; expression: a man who has read something he cannot unread.`
Eggs: on the desk, face down, a photograph with the corner turned up (the 1962 photo, §5 R09).

**`npc-vane.webp` — 4:5 portrait**
Prompt: `Character portrait of VANE (see reference) in a vault corridor, composed and still, hands folded over her folio; cold fluorescent lighting from above, slight vignette; expression: serene, unreadable, eyes fixed on the viewer a fraction too long.`
Eggs: the wooden rosary at her belt has one bead replaced with an empty needle holder (the Thread's sheath — visible on close inspection).

**`npc-sabbatini.webp` — 4:5 portrait**
Prompt: `Character portrait of SABBATINI (see reference) behind his desk in the Council Chamber, Renaissance ceiling frescoes out of focus above, green banker's lamp, walnut panelling; expression: condescending patience.`
Eggs: a dossier on the desk stamped `REGISTRY 16 — AMSTERDAM` half-covered by his hand.

**`npc-graf.webp` — 4:5 portrait**
Prompt: `Character portrait of GRAF (see reference) standing among smashed fluorescent tubes in a blacked-out hospital ward, clutching a slide box; hard side light from a torch, deep shadows; expression: terror held together by professionalism.`
Eggs: the slide box label reads `09-H MARROW` in her handwriting.

**`npc-hausmann.webp` — 4:5 portrait**
Prompt: `Character portrait of HAUSMANN AFTER (see reference) crouched in the corner of a dark clinic room, head tilted, listening; the only light is a sliver under the door; skin pale grey, eyes fully black.`
Eggs: he still wears his gold wristwatch — recognizable from the intake photo (§5 Z01) as the same man.

**`npc-basarab-elder.webp` — 4:5 portrait**
Prompt: `Character portrait of the BASARAB ELDER (see reference) standing in a candle-lit stone cellar, hands clasped behind his back; candlelight only, deep chiaroscuro; expression: mild, patient curiosity, as if examining furniture.`
Eggs: a dragon-wolf signet ring; a Wallachian boyar's fur collar under the coat, three centuries out of date.

### Additions

**`npc-ghiberti.webp` — 4:5** · `Character portrait of GHIBERTI (see reference) in the Archivio Segreto among mahogany card catalogs, a drawer open beside him; overhead archival lamp; expression: nervous, precise, about to close the drawer.` Eggs: a torn index card corner on the floor at his feet.

**`npc-mercier.webp` — 4:5** · `Character portrait of MERCIER (see reference) in a wood-paneled bank viewing booth, bank documents on the table; warm lamp, slight sweat; expression: professionally pleasant, privately terrified.` Eggs: his pocket has a carbon copy slipping out — `UBS 4409-C`.

**`npc-entita-operative.webp` — 4:5** · `Character portrait of the L'ENTITÀ OPERATIVE (see reference) standing in a Vatican corridor at night, hands clasped in front; dim sconce light, one side of his face in darkness; expression: absolutely bland.` Eggs: a phosphorus grenade cylinder clipped under the coat.

**`npc-basarab-operative.webp` — 4:5** · `Character portrait of the BASARAB OPERATIVE (see reference) in a dark abbey refectory, standing far too still beside a candle; only the candle lights the frame.` Eggs: two fingers of the right glove are missing, the hand beneath slightly wrong.

**`npc-feral-ghoul.webp` — 4:5** · `Character portrait of a FERAL GHOUL (see reference) in a mortuary alcove, caught mid-lunge by a flash; harsh flash falloff to black.` Eggs: a toe tag flutters at its wrist: `SONNENBERG — UNCLAIMED`.

**`npc-gendarme-officer.webp` — 4:5** · `Character portrait of the VATICAN GENDARME DUTY OFFICER (see reference) at the Campo Santo Teutonico gate house, logbook open; dull daylight; expression: a man counting hours.` Eggs: the gate log shows a second entry at 04:02 (see §5 R02).

**`npc-logistics-officer.webp` — 4:5** · `Character portrait of the COVENANT LOGISTICS OFFICER (see reference) beside a folding map table in a safehouse, a field telephone and packed crates behind her; practical lamplight.` Eggs: the map has three cities ringed: Geneva, Zurich, Turin.

**`npc-wayfinder-analyst.webp` — 4:5** · `Character portrait of the WAYFINDER REMOTE-SENSING ANALYST (see reference) in a signals room of reel-to-reel machines and oscilloscopes, headphones on; green CRT glow and tungsten.` Eggs: a printout on the desk reads `VAULT IX — LAST STABLE READING`.

**`npc-turin-intermediary.webp` — 4:5** · `Character portrait of the TURIN INTERMEDIARY (see reference) at the Lingotto works, face half-turned away from camera, cigar lit; industrial gloom, rain on skylights.` Eggs: a Basarab crest on his cufflink, tiny and easy to miss.

**`npc-watcher.webp` — 4:5** *(optional, for the DA)* · `Character portrait of THE GREY WATCHER (see reference) seated at a café table with a newspaper, entirely unmemorable; overcast Roman light; expression: none — he is reading.` Eggs: the signet ring is the only distinguishing feature.

### Bonus: relic plates (optional)

**`relic-phials.webp` — 4:5** · `Top-down forensic photograph of the open 1964 brushed-steel attaché case: molded blue velvet rack, twelve thick Roman glass phials sealed in imperial red beeswax, cursive Aramaic scratched into the glass, each holding 50 ml of dark un-coagulated blood; evidence ruler alongside, lead-antimony foil peeled back.` Eggs: one rack slot is empty — the count is already eleven.

**`relic-lodestone.webp` — 4:5** · `Macro photograph on black velvet of a thumb-sized magnetite nodule banded with tarnished first-century Judaean silver wire; archival tag reading a suppressed shelf-mark; cold museum light.` Eggs: a faint sulfur residue on the silver.

**`relic-veronica.webp` — 4:5** · `Macro photograph of a three-inch frayed linen thread, pale ochre, threaded through an unadorned silver sewing needle, laid on dark linen next to a plain wooden rosary; cold archival light.` Eggs: the thread is already frayed two-thirds through — it has been prepared for use.

---

## 5. Intel card images

> 43 assets, grouped by act. Each entry: **ID · filename · ratio** — where it appears, what the image is, the hidden eggs, and the prompt. "Extend" means the image is set as the existing card's art; "New card" means it should be created in `sangreal-clues.yaml` (IDs continue from I-17).

### Act I — Rome (L1 Vault IX, L2 Corvi's Quarters)

**R01 · `intel/i02-cctv-porta-santanna-0314.webp` · 4:3** — *Extend I-2 (CCTV Reel #87-04)*
Shows: the Porta Sant'Anna gate, 03:14 AM. Corvi exits on foot carrying the attaché, backlit by a single lamp above the arch.
Eggs: (1) in the puddle, Corvi casts a faint shadow but the case casts a pitch-black one; (2) the green railway pass protrudes from his coat; (3) at the far left, half out of frame, a nun's veil catches the light — Vane, forty metres behind; (4) timestamp `03:14 17-IX-87` in the burned-in clock bar.
Prompt: `CCTV still, high mounted gate camera looking down at the Porta Sant'Anna arch in Vatican City at night, a lone monsignor in a black cassock walks out carrying a heavy steel attaché case, single lamp above the arch, wet cobblestones with puddles, a nun's figure at the far left edge of frame, heavy grain, timestamp bar burned into the lower corner reading "03:14 17-IX-87", 16mm surveillance film, black and white, high contrast.`

**R02 · `intel/i18-cctv-second-descent-0402.webp` · 4:3** — *New card I-18: "Second Descent"*
Shows: the private hydraulic lift vestibule behind the Longinus Crossing Pier, 04:02 AM. An empty frame except for a single figure at the stair head, face lost in shadow, one hand on the rail.
Eggs: the figure's hand bears a signet ring with an eye device (the Watcher/Talamasca went down after Corvi); the lift indicator shows the platform called from below — someone else was already inside.
Prompt: `CCTV still from a small elevator vestibule inside St. Peter's at night, a single figure descending stone steps seen from behind, one hand on an iron rail catching the light with a signet ring, deep shadow across the face, burned-in timestamp "04:02", heavy 16mm grain, black and white, high contrast.`

**R03 · `intel/i01-vault-altar-forensic.webp` · 3:2** — *Extend I-1 (The Burnt Electromagnet Relay)*
Shows: the octagonal vault chamber; the melted copper induction cradle on its black granite altar, scorch marks on the ancient brick, lead-sheeted walls beaded with condensation.
Eggs: a glitter of sulfurous residue inside the copper slag; the empty mooring plinth is darker than the surrounding granite — scorched from beneath.
Prompt: `35mm evidence photograph of a subterranean octagonal vault, melted copper induction coils on a black granite altar, scorch marks on ancient Roman brick, condensation on lead-sheeted walls, evidence ruler and marker card in frame, harsh on-camera flash into darkness, cold blue-green cast, film grain.`

**R04 · `intel/i19-plinth-sign-macro.webp` · 3:2** — *New card I-19: "The Name Below the Plinth"*
Shows: extreme close-up of the tarnished brass sign bolted below the empty plinth — one word, `SANGREAL` — with screw holes and green verdigris.
Eggs: the plinth face is scratched by a case-shaped outline; beneath the sign's lower screw, a scrap of lead-antimony foil is trapped — the case that sat here had been opened *in situ* before the theft.
Prompt: `Extreme close-up photograph of a small tarnished brass plaque with one word stamped in capitals — SANGREAL — fixed below an empty rectangular stone plinth in a dark vault, verdigris around the screw holes, a scrap of grey metal foil trapped under one screw, a faint case-shaped scratch outline on the stone, harsh flash, deep shadow, dust, film grain.`

**R05 · `intel/i03-register-excised-card.webp` · 3:2** — *Extend I-3 (The Excised Codex Register)*
Shows: the mahogany catalog drawer in the Archivio Segreto; one index card excised with a scalpel; in its place a red charge card in Latin cursive.
Eggs: the excised stub shows the shelf-mark `MS-Vat-Heb-418`; the red card reads `Extractum per Breve Apostolicum — Anno Domini 1582 — Ad Capsam XII-SANG-00` (composite this text); dust has settled on the surrounding cards but not on the red one — it was placed recently.
Prompt: `Top-down photograph of an open mahogany card-catalog drawer in a Vatican archive, one index card removed leaving a clean scalpel-cut stub, in its place a single red card; surrounding cards dusty, faint overhead archive lamp, aged paper textures, shallow depth of field, film grain; leave the red card's centre clean for composited Latin text.`

**R06 · `intel/i04-corvi-desk-blotter.webp` · 3:2** — *Extend I-4 (The Polybius Vulgate Cipher)*
Shows: Corvi's desk — a 1592 Clementine Vulgate open at John 6 with a slip of rag paper tucked in; a leather desk-blotter mirror-writing impressions beneath raking light.
Eggs: (1) the rag slip shows the Polybius numeral grid (IV-I I-V III-II …); (2) the blotter's mirror-writing shows `GENEVA` and `4409` reversed; (3) a train ticket corner pokes from under the blotter — Roma Termini.
Prompt: `35mm photograph of a scholar's desk in a baroque apartment at night, a 1592 Vulgate Bible open at the Gospel of John, a slip of 17th century rag paper with a grid of Roman numerals, a leather desk blotter under raking lamp light showing reversed ink impressions, a torn train ticket edge under the blotter, warm tungsten light, deep shadows, film grain.`

**R07 · `intel/i20-corvi-safe-drilled.webp` · 3:2** — *New card I-20: "The Clean Drill"*
Shows: the open wall safe behind the Saint Sebastian painting, combination dial drilled precisely at the spindle; drawers searched but nothing taken.
Eggs: the drill swarf is fine and bright — a professional tool, not a panic job; a second set of scuff marks on the skirting shows someone knelt here recently and recently again; a woman's compact mirror left under the desk edge (Vane searched here before the cell did).
Prompt: `35mm flash photograph of an open wall safe hidden behind a painting of Saint Sebastian in a baroque library, the combination dial drilled cleanly at the spindle, fine metal swarf on the shelf, drawers pulled open and searched, scuff marks on the parquet, a small ladies' compact mirror half-shadowed under the desk, harsh flash, deep shadows, film grain.`

**R08 · `intel/i21-corvi-passport.webp` · 3:4** — *New card I-21: "Diplomatic Passport"*
Shows: Corvi's Vatican diplomatic passport ID page, photo + typewritten fields, a border stamp page.
Eggs: (1) admission stamp for `CHIASSO` timed two hours after the gate CCTV; (2) a handwritten marginal note in another pen: `accompagné` — he was not alone; (3) the passport photo is the same session as R09 — same tie.
Prompt: `ID photo of an Italian man, 58, gaunt with deep-set eyes, seen on a Vatican diplomatic passport page, flat frontal flash, plain institutional backdrop, typewritten fields, an ink border stamp reading CHIASSO, a handwritten marginal note in a different hand, aged paper, slight overexposure; leave the data fields clean for composited text.`

**R09 · `intel/i22-corvi-1962.webp` · 3:2** — *New card I-22: "The Archive, 1962"*
Shows: B/W archival photo — a much younger Corvi beside an older prelate at the Secret Archives, both in cassocks, both holding catalog cards.
Eggs: the older prelate wears the ouroboros-eye ring (the lineage of watchers inside the Vatican); on the table between them lies a folder marked `XII-SANG`; someone has drawn a red X over the prelate's face since.
Prompt: `archival black-and-white photograph, 1962, two priests at a card catalog in the Vatican Secret Archives — a young gaunt scholar and an older prelate with a signet ring, a folder with faded lettering on the table between them, press grain, vignette, emulsion scratches, a red grease-pencil X drawn over the older man's face decades later.`

**R10 · `intel/i05-map-casing-hallmark.webp` · 3:2** — *Extend I-5 (The Watcher's Hallmark)*
Shows: Claudia's diocesan road map of Northern Italy partially unrolled, leather casing below; the embossed stamp pressed into the hide: open eye within an ouroboros, tiny initials `T.O.W.`
Eggs: the map has three locations circled faintly in pencil that match the operational clock: Geneva, Zurich, Turin; the casing stitching hides a second, fainter impression — the stamp has been used before.
Prompt: `Top-down photograph of a diocesan road map of Northern Italy, partially unrolled beside its worn leather casing, an embossed stamp pressed into the hide showing an open eye inside a serpent biting its own tail with tiny initials T.O.W., faint pencil circles on the map around Geneva, Zurich and Turin, warm desk lamp, shallow depth of field, film grain.`

### Act II — Geneva (L3 Union de Banques Suisses)

**G01 · `intel/i23-ubs-lobby-cctv.webp` · 4:3** — *New card I-23: "Night Deposit"*
Shows: bank lobby CCTV, 22:41 — Corvi at the counter with the attaché, Mercier attending; two reflections in the polished marble.
Eggs: (1) in the marble reflection a grey raincoated man sits in the waiting chairs, newspaper on his knee — the Watcher; (2) the case on the counter sits on a bank cloth that Mercier has positioned precisely — he knows what it is worth; (3) a wall calendar reads 17 September 1987.
Prompt: `CCTV still of a neoclassical Swiss bank lobby at night, an exhausted monsignor in a black cassock at the counter with a steel attaché case, a clerk in an immaculate suit attending him, polished marble floor reflecting a seated man in a grey raincoat reading a newspaper, wall clock and calendar, 16mm black-and-white surveillance grain, high contrast, slight motion blur.`

**G02 · `intel/i24-mercier-staff-id.webp` · 4:5** — *New card I-24: "Bank Staff Record"*
Shows: Mercier's employee ID card laid on a desk blotter: photo, thumbprint, typed details.
Eggs: (1) on the blotter beside it, the carbon of a telegraphic transfer half-visible: `CHF 500,000` and `4409-C`; (2) the ID is stamped `AUTORISÉ — COFFRES` — his access is exactly why he was approached.
Prompt: `passport-style ID photograph of a Swiss-French bank clerk, 44, immaculate three-piece suit, thinning flat-combed hair, polite tight smile, pasted onto an employee record card with a thumbprint and typed fields, lying on a leather desk blotter beside the blurred carbon copy of a telegraphic transfer form, warm desk lamp, slight overexposure on the photo, film grain; leave the record card fields clean for composited text.`

**G03 · `intel/i06-escrow-slip-carbon.webp` · 3:4** — *Extend I-6 (The Escrow Transfer Slip)*
Shows: top-down carbon-leaf escrow receipt on bank stationery: locker `4409-C`, telegraphic transfer of CHF 500,000 from Sonnenberg Privatklinik to an ecclesiastical escrow account in Vaduz.
Eggs: the memo line reads `Acquisition of Primary Specimen (1 of 12) — Experimental Oncology Protocol` (composite this text); a pencilled clerk's tick beside `1 of 12` — he noticed the number; the carbon is slightly folded at the corner where it was kept in a jacket.
Prompt: `Top-down photograph of a carbon-copied bank escrow receipt on Union de Banques Suisses letterhead, faint purple carbon typing, a locker number, a telegraphic transfer amount, a small pencilled tick in the margin, folded corner, a fountain pen beside it on a leather blotter, warm lamp light, grain; leave the memo line clean for composited text.`

**G04 · `intel/i25-locker-ledger-4409c.webp` · 3:4** — *New card I-25: "The Ledger Page"*
Shows: the page of the safe-deposit access ledger for box 4409-C, Mercier's neat handwriting.
Eggs: (1) three access entries — two by `K. HAUSMANN`, one struck through with correction fluid, a different name faintly showing beneath: `VANE, C.` (composite); (2) the times show an access at 02:10 on the night the case moved; (3) the page number `4409` in the corner is circled twice.
Prompt: `Top-down photograph of a handwritten banking ledger page on aged ruled paper, neat clerical handwriting listing safe-deposit box access entries, one entry struck through with white correction fluid with a different name faintly visible beneath the smear, a circled box number in the corner, bank stamp, warm light, shallow depth of field, film grain; leave the entry rows clean for composited text.`

**G05 · `intel/i26-cornavin-platform.webp` · 3:2** — *New card I-26: "The 06:40 to Geneva"*
Shows: telephoto stakeout photo — the Cornavin platform, Corvi climbing aboard with the attaché; steam and departure boards.
Eggs: (1) a figure a carriage behind in a grey raincoat, same newspaper; (2) the carriage board reads `EC 30 ROMULUS`; (3) a porter's trolley carries a pasteboard label `VATICAN COURIER`.
Prompt: `Telephoto surveillance photograph through a long lens from across a Swiss station platform, a gaunt monsignor in a black cassock climbing into a train carriage carrying a steel attaché case, steam, a destination board, a man in a grey raincoat far down the platform reading a newspaper, hazy 1987 film color pushed one stop, handheld grain, frame edge of a carriage window intruding.`

**G06 · `intel/i08-wiretap-reel.webp` · 3:2** — *Extend I-8 (The Swiss PTT Intercept Tape)*
Shows: a Swiss PTT reel-to-reel tape in its box on a switchboard desk, with a typed transcript page clipped beneath.
Eggs: (1) the transcript's final line is the "cultured voice" phone response with a Turin extension number circled; (2) a second tape box is labelled with the same hand as the transcript — and the same hand appears on the red charge card in R05 (the Watcher again).
Prompt: `35mm photograph of a reel-to-reel audio tape in its cardboard box on a Swiss telephone switchboard desk, a typed transcript page clipped beneath weighted by a pencil, cables and Bakelite handsets behind, cold fluorescent light, dust on the reels, film grain; leave the transcript page clean for composited text.`

### Act III — Zurich (L4 Privatklinik Sonnenberg)

**Z01 · `intel/i27-hausmann-intake.webp` · 4:5** — *New card I-27: "Intake Photograph, 09-H"* (supports I-7)
Shows: the clinic's intake photo of Hausmann before the treatment: gaunt but composed, hospital gown, ID board.
Eggs: (1) the ID board reads `09-H`; (2) he wears the same gold wristwatch seen in the AFTER portrait; (3) in the corner of the frame an IV stand carries the clinic's logo — the same logo that appears on the letterhead of the escrow slip (continuity).
Prompt: `Clinical intake photograph of a gaunt Swiss banker, 62, hospitalized in a plain gown holding an ID board reading 09-H, thin hair combed flat, expensive watch still on his wrist, neutral clinic background, flat institutional flash, slight overexposure, 1987 film color, small printed clinic logo on the frame edge, grain.`

**Z02 · `intel/i28-hausmann-burns.webp` · 3:2** — *New card I-28: "Photophobia Test 02:40"*
Shows: documentation photo of Hausmann's forearm and face under a fluorescent bank — mottled first-degree burns where the light fell; his pupils fully dilated, no reaction.
Eggs: (1) the IV insertion site is ringed in inflammation with a batch tag still taped to his arm: `XII-1 / 12` (composite); (2) a nurse's hand at frame edge withdraws — nobody wants to stay in the room; (3) the light switch is taped over.
Prompt: `Clinical documentation photograph of an elderly patient's forearm and face under a bank of fluorescent lights, mottled red burns where the light falls, fully dilated black pupils with no reaction to the flash, an IV site with a taped batch label on his arm, a nurse's hand withdrawing at the edge of frame, a light switch taped over in the background, harsh flash, clinical 1987 film, grain.`

**Z03 · `intel/i09-histology-polaroid.webp` · 1:1** — *Extend I-9 (Histopathology Log: Marrow Graft)*
Shows: an SX-70 polaroid of a bone-marrow slide under a microscope field, annotated in margins by Graf.
Eggs: (1) within the marrow field, dark fibrous filament structures that should not exist; (2) her annotation across the bottom — `foreign graft — not infection` (composite); (3) a second polaroid edge intrudes at the frame — she took more than one, and kept one.
Prompt: `SX-70 Polaroid of a microscope field showing human bone marrow tissue at high magnification, dark fibrous filament structures woven through the cells, a few barely legible handwritten annotations in the white border, the photo lying on a lab bench among more polaroids, chemical staining along the frame edge, muted crushed colors, slight focus softness.`

**Z04 · `intel/i29-injection-log.webp` · 3:4** — *New card I-29: "The Injection Log"*
Shows: a single page from the trial chart: typewritten drug line, witness signature, Graf's initials.
Eggs: (1) the drug name field reads `PROGENITOR VECTOR — BATCH XII-1/12`; (2) the "sponsor" line reads `Sonnenberg Privatklinik, Zürich — Trust Account (Vaduz)` — same account as the escrow; (3) the room number `3.14` is scrawled beside the line — the same digits as the CCTV timestamp.
Prompt: `Top-down photograph of a single page from a 1987 clinical trial chart, typewritten drug administration line, a witness signature and doctor's initials in blue ink, a sponsor line referencing a Vaduz trust account, a room number scrawled beside it, coffee ring at the edge, paper-clip impressions, dim clinic light, film grain; leave the chart lines clean for composited text.`

**Z05 · `intel/i30-ward-hallway-cctv.webp` · 4:3** — *New card I-30: "Ward 3 — Corridor Camera"*
Shows: the third-floor ward corridor: windows taped with black polyethylene, smashed fluorescents, wheelchair overturned.
Eggs: (1) on the ceiling, at the top edge of frame, an impossible silhouette holds position against gravity — Hausmann watching; (2) the clock shows 02:40; (3) a mop bucket has been kicked across the floor in a spray pattern that points, unnervingly, down.
Prompt: `CCTV still of a hospital corridor at night, windows taped over with black plastic sheeting, smashed fluorescent tubes, an overturned wheelchair and a kicked mop bucket, dark smear patterns on the floor, a barely visible humanoid silhouette clinging to the ceiling at the very top edge of frame, burned-in clock 02:40, 16mm black-and-white grain, high contrast.`

**Z06 · `intel/i31-sonnenberg-stakeout.webp` · 3:2** — *New card I-31: "Sonnenberg, Observed"*
Shows: night telephoto from the tree line: the white modernist clinic, one floor blacked out; observation post in the foreground.
Eggs: (1) a grey Lancia with white Vatican plates `SCV 47` parked on the access road — the Holy Alliance is already watching the clinic; (2) on the dash of the stakeout car in the foreground, a thermos and a camera with a newspaper folded under it — the Watcher's newspaper; (3) third-floor window: a single black gap where the tape has been pulled inward.
Prompt: `Telephoto nighttime surveillance photograph of a modernist white concrete clinic among dark forest, one floor's windows covered with black sheeting, shot from a parked car with the tree line in the foreground, a grey 1960s sedan with white diplomatic plates parked on the access road, a thermos and a long-lens camera visible on the dashboard in the frame edge, haze, pushed film grain.`

**Z07 · `intel/i11-resonance-freezer.webp` · 3:2** — *Extend I-11 (The Resonance Field, CT2)*
Shows: the lab cold room — a stainless freezer sled with a single unshielded phial in a rack, blood bags in the background swelling and discolored.
Eggs: (1) the blood bags closest to the sled have visibly spoiled, one ruptured dark; (2) a chart on the wall logs "subject 09-H attempted to drink from the sharps bin, 02:40"; (3) a thermometer reads 4 °C — the quiescence threshold from I16.
Prompt: `35mm photograph inside a clinical cold room, a stainless steel tray holding a single small glass phial sealed with red wax resting on a rack, blood bags on shelves behind it visibly discolored and one swollen past bursting, a chart clipboard on the wall, thermometer reading 4 degrees, cold green fluorescent cast, condensation, film grain.`

**Z08 · `intel/i32-daylight-test.webp` · 3:2** — *New card I-32: "Daylight Test — Combustion"*
Shows: a concrete fume hood with a fused glass crucible and a scorch burst pattern of white ash; the sash is drawn.
Eggs: (1) the crucible's glass has boiled and collapsed; the ash is literally white and fine; (2) the log card in the hood reads `DAYLIGHT TEST 07:12 — COMPLETE COMBUSTION` (composite); (3) beside the hood, a box of unbleached linen strips and a jar labelled `GALL / VINEGAR / MYRRH` — the Vatican's own quiescence kit, already present in a Swiss clinic.
Prompt: `35mm photograph inside a laboratory fume hood, a fused and collapsed glass crucible with a radial burst of fine white ash across the concrete, scorch marks, a small log card in the hood, and on the bench beside it a box of unbleached linen strips and a glass jar of dark herbs and vinegar, cold clinical light, flash fill, film grain; leave the log card clean for composited text.`

### Act IV — Turin (L5 Lingotto Assembly Complex)

**T01 · `intel/i33-lingotto-rooftop.webp` · 3:2** — *New card I-33: "Lingotto, Rooftop, Rain"*
Shows: telephoto at dusk through rain: the famous rooftop test track on the long plant, one glass supervisor's booth lit high above the assembly floor; two figures inside.
Eggs: (1) the two silhouettes — Corvi at the booth glass and Vane positioned precisely between him and the only exit; (2) below, on the access road, a grey Lancia parked with its wipers up; (3) the rain has broken a skylight and inside the booth window a **second** suitcase-sized case is visible beside the attaché (his papers, doubling the decoy tension).
Prompt: `Telephoto surveillance photograph at dusk through rain of the rooftop test track of the vast Lingotto factory in Turin, a single lit glass supervisor's booth high on the facade with two figures silhouetted — a hunched man at the glass and a nun standing behind him — the wet track curving away, broken skylights below, a grey 1960s sedan parked on the access road, hazy film color, handheld grain.`

**T02 · `intel/i34-lingotto-floor-cctv.webp` · 4:3** — *New card I-34: "Assembly Hall Camera 6"*
Shows: the flooded assembly hall CCTV — Corvi crossing the floor with the attaché, water pouring through broken skylights.
Eggs: (1) a hairline crack in the case's deadbolt, dressed with fresh tape — the case has been under stress; (2) oil drum stencils behind him read in faded Fiat livery; (3) the puddles reflect only the lights, not Corvi's shadow — a subtle, deniable occult tell (DA's choice when to reveal).
Prompt: `CCTV still of a vast abandoned car factory assembly hall, rain pouring through broken skylights into dark puddles, a hunched monsignor in a black cassock crossing the floor carrying a steel attaché case with taped hardware, rusted Fiat-era machinery and oil drums, burned-in camera label "6", 16mm black-and-white grain, high contrast, motion blur on the figure.`

**T03 · `intel/i12-palimpsest-uv.webp` · 3:2** — *Extend I-12 (The Ebionite Palimpsest)*
Shows: Corvi's workbench under an ultraviolet inspection lamp: the codex page beneath a sheet of glass, his notebook open beside it.
Eggs: (1) under UV, a second script shows through beneath the first — the palimpsest; (2) his notebook margin carries a single Latin line — `sanguis remedium, non sacramentum` (blood is remedy, not sacrament); (3) a spent matchbook from the Hotel Bristol, Geneva — his trail, pinned down.
Prompt: `35mm photograph of a makeshift conservation bench under ultraviolet inspection light, an ancient parchment codex page pressed under glass showing faint older script beneath the visible text, an open ruled notebook beside it with dark handwriting, glass slides and cotton gloves, deep violet UV glow with warm flashlight fill, dust motes, film grain.`

**T04 · `intel/i35-breve-1582.webp` · 3:4** — *New card I-35: "Breve Apostolicum, 1582"*
Shows: photographic reproduction of the 1582 papal brief: cursive chancery hand, lead seal, marginalia.
Eggs: (1) the shelf-mark `MS-Vat-Heb-418` in the corner, matching the excised register card; (2) the seal has been cracked and repaired with wax — it was opened after sealing; (3) the marginalia identifies the capsule as `CAPSAM XII-SANG-00` — the case's catalog identity since the sixteenth century.
Prompt: `Archival photographic reproduction of a 1582 papal brief on aged parchment, dense Latin chancery cursive, a cracked lead seal on a cord repaired with red wax, marginal annotations in a second hand, foxing and iron-gall burn-through, photographed flat under even archive lighting with a scale bar, fine grain; leave the text areas soft and illegible rather than garbled.`

**T05 · `intel/i36-lodestone-index.webp` · 3:2** — *New card I-36: "Suppressed Index Card"*
Shows: the Secret Archives index card for the Lodestone of St. Jude, with a 1930s catalog photograph of the nodule attached.
Eggs: (1) the card is stamped `SUPPRESSED — CONS. DOCT. FIDEI` in big red letters; (2) the catalog photo's scale bar, at macro, shows the nodule is thumb-sized — the same object sold into the theft; (3) a handling note: `corrosive to ferrous circuitry — by order of the Prefect` — the Church knew what it could do to the vault's electromagnets.
Prompt: `Top-down photograph of an old archive index card with a small pre-war black-and-white photograph of a thumb-sized black mineral nodule banded with silver wire attached by a rusted paperclip, a large faded red stamp across the card, typewritten notes, and a thin pencil annotation at the bottom, aged paper, archive lamp, film grain; leave the stamp and note lines clean for composited text.`

**T06 · `intel/i37-rosary-open.webp` · 3:2** — *New card I-37: "The Empty Needle"*
Shows: forensic macro of Claudia's wooden rosary, one bead split open along its grain; the needle is gone; frayed ochre thread fibers remain inside.
Eggs: (1) the split is a clean, deliberate cut — she opened it herself; (2) ochre linen fibers in the cavity; (3) a fine line of phosphorus burn on the bead's outer surface — the Thread was snapped not long ago, and near here.
Prompt: `Forensic macro photograph of a plain wooden rosary on dark linen, one bead split cleanly open showing an empty cavity with a few ochre linen fibres inside, a faint scorch mark on the bead's outer surface, a millimetre scale card and evidence tag at the frame edge, harsh flash, shallow depth of field, film grain.`

### Act V — Novara (L6 The Fortified Retreat of San Nazzaro)

> Keep these clinical and restrained; the horror is in the stillness, not gore.

**N01 · `intel/i13-slaughter-hall.webp` · 3:2** — *Extend I-13 (The Novara Slaughter)*
Shows: the stone-flagged dining hall of the abbey; Vane laid across the table, arms folded by the killer; a single kerosene lantern; broken carriage doors behind.
Eggs: (1) two severed metacarpals on the terracotta tiles have gone to white calcified ash — half-fingerprints still legible on one; (2) a broken phial soaks into the floor; (3) the attaché case is gone — but its leather carry-strap is still looped on the table edge, cut clean; (4) a second wine glass, unused, stands at the head of the table.
Prompt: `35mm flash photograph of an eleventh-century stone dining hall at night, a dead woman in a religious habit laid out on the long oak table with her arms folded, a single kerosene lantern throwing hard shadows, broken oak doors with iron hinges behind her, shards of a broken glass phial in a dark stain on the terracotta floor, two calcified white finger bones, an empty wine glass at the head of the table, a cut leather strap on the table edge, flash falloff, cold cinematic, restrained and forensic.`

**N02 · `intel/i13-carotid-detail.webp` · 3:2** — *Punch-in detail for I-13*
Shows: pathology macro of the neck wounds with measuring calipers.
Eggs: (1) the punctures are elongated dental tears; the calipers show inter-canine breadth far beyond human anatomy (composite the readout); (2) the table edge under the head has fine parallel scratches — she was pinned first, then struck; (3) a wisp of grey animal hair caught in the collar — the retrieval pack was not alone.
Prompt: `Forensic macro photograph of two elongated puncture wounds on a neck, calipers holding a measurement across the wounds, a paper scale card, complete exsanguination visible in the skin tone, oak table grain beneath, harsh flash, clinical and restrained, film grain; leave a small card area clean for composited measurement text.`

**N03 · `intel/i38-ash-fingers.webp` · 3:2** — *New card I-38: "Two Fingers, Calcified"*
Shows: close-up of the severed metacarpals reduced to white calcified ash-structure, half-embedded in a dried dark stain.
Eggs: (1) one finger's whorl ridge pattern is still legible — the killer left a printable partial; (2) the ash fracture lines are radial, as if the bone aged a century in seconds; (3) beside it, a tiny fused ring of metal — a signet ring's dragon crest, melted into the ash.
Prompt: `Forensic macro photograph of two severed human finger bones transformed into brittle white calcified material with radial fracture lines, half embedded in a dried dark stain on terracotta tiles, a tiny melted metal ring with a faint dragon crest fused into the ash beside them, an evidence arrow card, harsh flash, shallow focus, film grain.`

**N04 · `intel/i14-telex-strip.webp` · 3:2** — *Extend I-14 (Telex Dispatch: Registry 16)*
Shows: the charred telex strip pulled from the stove grate, its curl holding shape, edges burned.
Eggs: (1) legible fragment: `…SPECIMEN MUST BE FLOWN TO CARPATHIAN FACILITY… PROTECT THE BLOODLINE` (composite); (2) the perforated top edge shows the sequence hole pattern of the Amsterdam machine; (3) a melted strip of wax paper on the grate has an unburned corner with a second message's opening line — `RENDEZVOUS 'BASARAB' …` — the word is the key.
Prompt: `35mm photograph of a curled, partially charred telex paper strip lying on the iron grate of a wood stove, typewritten capital letters fading into burn, perforated top edge, ash and soot around it, another melted strip of paper at the grate corner with one unburned line, harsh flash, soot dust, film grain; leave a short legible area clean for composited text.`

**N05 · `intel/i15-flight-clearance.webp` · 3:4** — *Extend I-15 (Flight Clearance: YR-BAS)*
Shows: the flight clearance form on the dispatch desk: typed fields, aerodrome stamp, pilot signature.
Eggs: (1) owner line: `Basarab Holdings S.A. (Bucharest)` — with a small dragon-wolf crest printed beside it (composite text; the crest is the mural detail); (2) cargo: `Ecclesiastical Medical Supplies — Ten Consignment Units`; (3) departure 01:15; a second, earlier form beneath is stamped `CANCELLED — WEATHER`.
Prompt: `Top-down photograph of a typed 1987 military airfield flight clearance form on a wooden dispatch desk, carbon-copy type, aerodrome ink stamp, a pilot's signature, a small printed heraldic crest beside the operator field, a second cancelled form beneath it, a mug ring and a paper punch on the desk, tin lamp light, film grain; leave the form fields clean for composited text.`

**N06 · `intel/i39-tarmac-0115.webp` · 3:2** — *New card I-39: "Tarmac, 01:15"*
Shows: telephoto stakeout from beyond the perimeter fence: a Cessna 421 on the tarmac, engines glowing, two figures lifting a metal case into the cabin door; hangar light spill.
Eggs: (1) the tail registration `YR-BAS`; (2) the loading crate stencil: a small dragon-wolf; (3) a third figure stands apart from the loading — tall, black-coated, face turned directly toward the camera, as if aware of the watcher (the Elder).
Prompt: `Telephoto nighttime surveillance photograph through a chain-link fence of a small twin-engine 1980s aircraft on an airfield tarmac with cabin lights on and propellers turning, two figures loading a metal case through the cabin door, a tall motionless figure in a long black coat standing apart and facing the camera, hangar floods and haze, perimeter fence wire in the foreground, pushed film grain.`

**N07 · `intel/i40-claudia-kit.webp` · 3:2** — *New card I-40: "Her Effects, Laid Out"*
Shows: the evidence table: Claudia's belongings laid in a grid — rosary, Beretta 70, diplomatic papers, transit folio, key ring.
Eggs: (1) the Talamasca card among her papers — plain paper, the motto `We watch, and we are always there` (composite); (2) a toll stub from the Turin–Novara autostrada, time-stamped ninety minutes before death; (3) a small ring of grey animal hair wound around the Beretta's trigger guard — the pack checked her weapon before she could reach it.
Prompt: `Top-down evidence photograph of a woman's effects laid out in a neat grid on grey paper: a plain wooden rosary, a compact Beretta pistol, folded diplomatic papers, a leather transit folio, a key ring, toll stubs, a plain business card; evidence numbers and a ruler at the frame edge, even overhead light, flash fill, film grain; leave the business card clean for composited text.`

### Act VI — Vatican (L7 CDF offices) & wrap

**V01 · `intel/i17-sabbatini-memo.webp` · 3:2** — *Extend I-17 (The Basarab Extortion File)*
Shows: the tin dispatch box open on a convent floorboard: microfiche rolls, typewritten Vatican memos, Sabbatini's memo on top under a paperweight.
Eggs: (1) the memo line — `We hold the Gethsemane vessels as an iron nail driven into their heads…` (composite); (2) a microfiche strip held to the light shows the Basarab crest beside a land registry; (3) the box lid's underside bears the ouroboros-eye burned into the tin — someone else has read this file.
Prompt: `35mm flash photograph of an open tin dispatch box on a convent floorboard revealing microfiche rolls and typewritten Vatican memos, top memo weighted by a glass paperweight, one microfiche strip held up to the lamplight showing a land registry and a small heraldic crest, the box lid's underside faintly scorched with a symbol, deep shadows, dust, film grain; leave the top memo clean for composited text.`

**V02 · `intel/i41-council-chamber.webp` · 3:2** — *New card I-41: "The Green Lamp"*
Shows: telephoto across the Piazza to the CDF Council Chamber window at night: Sabbatini at his desk under a green banker's lamp, a dossier open; frescoes above.
Eggs: (1) the dossier's cover is stamped `REGISTRY 16 — AMSTERDAM`; (2) a second silhouette waits — standing, hands clasped, at the edge of the lamplight: the L'Entità operative; (3) the window transom catches a reflection of three more standing figures — it is already too late.
Prompt: `Telephoto night photograph of a Renaissance palazzo window from across St. Peter's Square, a cardinal in scarlet-piped black at a desk under a green banker's lamp with an open dossier, a standing silhouette waiting at the edge of the lamplight, faint reflections in the window glass of further figures behind, painted ceiling out of focus, cold ambient light with warm lamp pool, long-lens haze, grain.`

**V03 · `intel/i42-entita-team-1987.webp` · 3:2** — *New card I-42: "L'Entità Team, Surveillance Frame"*
Shows: grainy surveillance photo of three plainclothes operatives from a neighbouring rooftop, mid-scene in Rome — one checking a wristwatch, one at a car's wing mirror, one mid-air over a wall.
Eggs: (1) the operative checking the watch wears a Vatican gendarme's issue watch — small papal crest on the dial; (2) their car is the grey Lancia `SCV 47` — the recurring tail; (3) one carries a black cylinder at his belt far too casually — the phosphorus grenade canister, same silhouette as the vignette in Z06.
Prompt: `Grainy surveillance photograph of three men in plain grey overcoats moving with professional discipline in a Roman street at dusk, one checking his wristwatch, one adjusting a car wing mirror, one vaulting a low wall, a grey 1960s sedan with white diplomatic plates at the kerb, shot from a roof with compressed perspective, pushed black-and-white film grain, slight motion blur.`

**V04 · `intel/i43-attache-1964.webp` · 3:2** — *New card I-43: "The Case, 1964"*
Shows: B/W archival photo of the attaché under construction in a Vatican workshop: gloved hands lining the shell with lead-antimony foil, the brass SANGREAL plaque on the bench beside it.
Eggs: (1) the plaque is already stamped — the name predates the case; (2) a workshop order pinned behind reads `XII phials — Gethsemane lot — destroyed if opened`; (3) the workshop supervisor's face is the young prelate from R09 — the lineage closes.
Prompt: `archival black-and-white photograph, 1964, inside a Vatican workshop: gloved hands lining a brushed-steel attaché case shell with grey metal foil, tools and clamps on the bench, a small brass plaque with one word waiting beside it, a typewritten workshop order pinned to the wall behind, high-contrast shop lighting, press grain, vignette, scratches.`

**V05 · `intel/i44-basarab-crate.webp` · 3:2** — *New card I-44: "Consignment Markings"*
Shows: the metal cargo crate photographed after a partial unload: stencil marks, chalk manifest numbers, customs ties.
Eggs: (1) the crate carries the dragon-wolf stencil and `BASARAB HOLDINGS S.A.` stencilled letters; (2) the chalk tally reads `10/12` — two phials unaccounted for before the aircraft even leaves Europe; (3) a customs tie is intact but a second, older mark beneath the stencil shows through: `VATICAN MUSEUMS — storeroom 9` — the crate was in the Vatican before it was in Romania.
Prompt: `35mm photograph of a dented grey metal cargo crate on an airfield tarmac after partial unloading, stencilled lettering partly chalked over, a stencilled dragon-wolf crest, customs security ties intact, older stencilled lettering faintly showing through the paint, wet concrete, sodium lights, film grain; leave the stencil areas clean for composited text.`

**V06 · `intel/i45-novara-aerial.webp` · 3:2** — *New card I-45: "Airfield Briefing Sheet"*
Shows: low-altitude aerial of Novara-Cameri airfield at dawn, printed as a reconnaissance briefing sheet with grease-pencil annotations.
Eggs: (1) a single parked Cessna circled in red grease pencil; (2) a second aircraft crossed out beside the service hangar — the decoy traffic a tailing cell would chase; (3) the sheet's margin carries the printed classification `COVENANT WAYFINDER — RECON 18-IX` and a handwritten note: `wheels up 01:15 confirmed`.
Prompt: `Low-altitude aerial reconnaissance photograph of a small Italian military airfield at dawn, hangars and a control tower, one small parked twin-engine aircraft circled in red grease pencil, a second aircraft crossed out beside a service hangar, printed as a briefing sheet with a margin block and handwritten notes, slightly tilted horizon, haze, faded 1987 print, film grain; leave the margin block clean for composited text.`

---

## 6. Recurring continuity easter eggs

> These recur across the whole set. Note them in the DA's notes and let players discover them.

| Coding | Motif | Appears in | Meaning |
| --- | --- | --- | --- |
| **Egg-A** | The grey Lancia Flavia, Vatican plates `SCV 47` | Z06, V03 (identity), plus parked cameos: G01 (arriving), T01 (access road) | L'Entità is tailing the cell the entire case — the sanitization squad already had eyes on every scene |
| **Egg-B** | The Grey Watcher (raincoat, newspaper, ouroboros-eye ring) | G01 (reflection), G05 (platform), Z06 (car dash), plus any street scene as cameo | The Talamasca has its own eyes on the phials — independent of Claudia |
| **Egg-C** | The ouroboros-eye (serpent + eye) | R10 (map casing), R09 (ring), N07 (card in effects), V01 (box lid), G06 (transcript hand) | The Order of the Watchers connects the mentor, the mole, and the memo — a 25-year thread |
| **Egg-D** | The green railway pass `EC 30 Romulus` | R01 (coat pocket), G05 (carriage board) | Confirms Corvi's route and re-verifies the timeline |
| **Egg-E** | Timestamps `03:14 / 04:02` | R01, R02, G01's calendar, Z04's room number `3.14` | A second visitor descended to the vault; the numbers recur as a quiet refrain |
| **Egg-F** | Basarab dragon-wolf crest | N03 (melted ring), N05 (form crest), N06 (crate stencil + Elder), V05 (crate), Turin intermediary's cufflink (npc-*) | The threads connect Novara, the aircraft and Mission 2 — and the intermediary was bought long before the cell knew |
| **Egg-G** | Phial arithmetic: `12 → 11 → 10` | relic-phials (11 in rack), Z02 batch `XII-1/12`, N01 (broken + missing), V05 chalk `10/12` | The count is the clock: players can reconstruct the whole chain of custody |
| **Egg-H** | White calcified ash | Z08 (combustion test), N01/N03 (fingers), V05 (sealed crate refuse) | The cure's finality — the vector reaches vampires, not just corpse-husks |
| **Egg-I** | The empty wine glass / two glasses at Novara | N01 | Someone was with her before the pack, or the pack paused — a DA-facing ambiguity that seeds Mission 2 |

---

## 7. Clue index (what each hidden detail proves)

| Asset | Hidden clue | Proves |
| --- | --- | --- |
| R01 | Pitch-black case shadow in the puddle | Lead-antimony shielding — the case is a containment vessel, not a diplomatic bag |
| R02 | Second descent at 04:02 | Someone followed Corvi into the vault; the breach was assisted |
| R04 | Foil scrap under the SANGREAL sign | The case was opened in the vault before it was stolen |
| R05 | Fresh red card among dusty catalogs | The register was doctored recently — inside job |
| R06 | Blotter mirror-writing `GENEVA 4409` | Corvi's coordinates — unlocks L3 without the cipher |
| R07 | Ladies' compact under the desk | Vane searched Corvi's rooms before the Covenant did |
| R09 | Ouroboros ring on the mentor | The Order has been inside the Vatican for decades |
| R10 | Faint second impression in the leather | The stamp is not decorative, it is an operating mark |
| G01 | Watcher's reflection | Independent surveillance of the phials — the Talamasca's own eyes |
| G04 | Correction fluid over `VANE, C.` | Vane accessed locker 4409-C herself; her ledger entry was scrubbed |
| Z02 | Batch tag `XII-1/12` | The injection is traceable to the first phial — the chain of custody starts here |
| Z04 | Sponsor account matches the escrow | The clinic's "trust" is the same money — Vatican-connected laundering |
| Z05 | Silhouette on the ceiling | Hausmann's disorder is vertical and predatory — not human violence |
| Z08 | Gall/vinegar/myrrh kit in a Swiss clinic | The Church's quiescence protocol is already in play — Rome knew about Zurich |
| T03 | `sanguis remedium, non sacramentum` | Corvi understood the truth — the "blood is a cure" inversion |
| T05 | "Corrosive to ferrous circuitry" | The Lodestone was ordered against the vault specifically — premeditation |
| T06 | Frayed thread, snapped | The Veil of Veronica's Thread has been spent — Claudia's escape kit is empty |
| N03 | Melted dragon-crest ring | A vampire touched the spilled phial and died — CT1 kills their kind |
| N06 | The Elder facing the camera | They know they are being watched — and do not care |
| N07 | Grey animal hair on the trigger guard | A predator handled her weapon before she could |
| V05 | `VATICAN MUSEUMS — storeroom 9` under the stencil | The crate moved through the Vatican first — the rip goes deeper than Novara |
| V06 | Second aircraft crossed out | The airfield has decoy traffic — chasing it costs the 40-minute window |

---

## 8. Import checklist (after generation)

**Step 1 — Files.**
```
src/assets/art/npc-*.webp          (portraits; same basenames as the old SVGs)
src/assets/art/relic-*.webp        (optional relic plates)
src/assets/art/intel/<id>-<slug>.webp   (card images)
```

**Step 2 — Wire existing cards.** Set the `img` field on the existing `informationCard` items in `src/packs/sangreal-clues.yaml`, e.g.:
```yaml
- _id: sangreal-ic02
  name: 'I2 — CCTV Reel #87-04'
  type: informationCard
  img: modules/neon-relic-mission-sangreal/assets/art/intel/i02-cctv-porta-santanna-0314.webp
```

**Step 3 — Add new cards (I-18 … I-45).** Template for each new card:
```yaml
- _id: sangreal-ic18
  name: 'I18 — Second Descent'
  type: informationCard
  img: modules/neon-relic-mission-sangreal/assets/art/intel/i18-cctv-second-descent-0402.webp
  system:
    cardId: I-18
    cardType: supportingIntel
    foundAtSlugs: [sangreal-l1]
    content: >
      <p>Player-facing text describing the photograph and what the cell can read from it.
      Include the physical clues but never name the conclusion.</p>
    hqFallback: 12
    daNotes: >
      <p>What the clues actually mean — DA only.</p>
    foundAtUuids: []
    knownByUuids: []
    npcUuids: []
```

**Step 4 — Update the information web.** Add the new items to the `sangreal-case-board` and `sangreal-information-web` `informationCardSlugs` lists, then rebuild:
`npm run build && npm run validate` → `./tools/push-local.sh` → re-run the Content Installer in-world.

**Step 5 — NPC portraits.** Swap `src/assets/art/npc-*.svg` references in `sangreal-npcs.yaml` to the `.webp` files, and update each actor's `prototypeToken.texture.src`. The 4 new NPCs (Ghiberti, Mercier, L'Entità, Basarab operative) have no `img` yet — add the new path.

---

*Pack v1 · SANGREAL-87-091 · The Verdant Covenant, Wayfinder Division.*
