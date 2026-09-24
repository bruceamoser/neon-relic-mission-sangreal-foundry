# Sound Effects — Mission: Sangreal

The DA walkthrough cues sound at specific beats ("Play the lift on the way — the
hydraulic cage groaning through forty feet of rock"). This page is the cue sheet
the module ships as a Foundry playlist: **Sangreal Sound Effects** (compendium pack
*Sound Effects*, installed into a world folder of the same name).

## Cue sheet

| Beat / cue in the walkthrough | Track | Length | Loop | Volume |
| --- | --- | --- | --- | --- |
| Abbey doors, vault door | Prop — Heavy door, spring lock (abbey, vault) | 12s | — | 0.5 |
| Abbey bell; “lamps went out one at a time” | Prop — Abbey bell toll | 20s | — | 0.5 |
| Operations-board clock | Ambience — Clock ticking (Operations Board) | 18s | yes | 0.3 |
| Something moving in the ceiling conduits | Sting — Something in the ceiling conduits | 20.1s | — | 0.5 |
| Play the corridor before the room — fluorescent buzz | Ambience — Fluorescent corridor hum (clinic) | 30.1s | yes | 0.35 |
| The feral predator; the thing on the ceiling | Sting — The thing in the ceiling / the feral predator | 14s | — | 0.55 |
| Lingotto fire / abbey alarm | Sting — Alarm / fire alarm (Lingotto, abbey) | 18s | — | 0.5 |
| The daylight flash at the Lingotto parley | Sting — The daylight flash at the parley | 4.9s | — | 0.55 |
| Smashed fluorescent tubes / windows | SFX — Glass breaking (tubes, windows) | 1.5s | — | 0.6 |
| Firefights (ward, abbey, tarmac) | SFX — Gunfire | 5.9s | — | 0.65 |
| Lift gates closing | Prop — Lift gates closing | 8s | — | 0.5 |
| Vault machinery, catwalk, hangar | SFX — Metal clang (vault machinery, catwalk, hangar) | 8s | — | 0.55 |
| Single 9 mm shot | SFX — Single 9 mm shot | 1.7s | — | 0.6 |
| The abbey lamps go out one at a time | Sting — Power down / lamps going out | 3s | — | 0.5 |
| Novara-Cameri airfield at night | Ambience — Airfield prop plane at night (Novara) | 20s | yes | 0.45 |
| EC 30 night-train corridor | Ambience — Night-train corridor (EC 30) | 40s | yes | 0.4 |
| Geneva steps / Rome street rain | Ambience — Rain on stone steps (Geneva / Rome) | 40s | yes | 0.45 |
| Cordon lights through the rain (Days 4–3, Epilogue) | Ambience — Distant civil-defence siren (cordon in the rain) | 28s | yes | 0.45 |
| Storm wind — rooftops, abbey approach | Ambience — Storm wind (rooftops, abbey approach) | 40s | yes | 0.45 |
| Period telephone — Covenant calls | Prop — Period telephone ring | 22s | — | 0.5 |
| The room goes quiet enough to hear Claudia’s thread snap | Sting — Claudia’s thread snaps | 1.2s | — | 0.5 |
| Office work, Wayfinder analysis | Prop — Typewriter (office, analysis) | 21.9s | — | 0.5 |
| Vault IX / cold rooms — sub-bass machine drone | Ambience — Underground vault drone (Vault IX) | 45s | yes | 0.4 |
| Days 14–13 — the hydraulic cage down to Vault IX | Ambience — Vault lift descent (Days 14–13) | 32s | yes | 0.5 |
| Wind moving under polythene sheeting (blacked-out ward) | Ambience — Wind under sheeting (blacked-out ward) | 40.1s | yes | 0.45 |

## How it is delivered

- Audio ships in `src/assets/audio/sfx/*.mp3` (mono, loudness-normalised, 96–128 kbps).
- `src/packs/sangreal-sfx.yaml` compiles to the `Sound Effects` compendium pack (one
  playlist, `Sangreal Sound Effects`), which the Content Installer imports into a world
  folder of the same name. Re-running the installer refreshes the playlist.
- Licensing: see `src/assets/audio/CREDITS.md` (also shipped) — public domain, CC0,
  CC BY or CC BY-SA per track; the synthesized beds are original works.

## Adding or replacing a track

1. Drop the file in `src/assets/audio/sfx/` (q85-ish mono mp3, ~40 s beds, 1–8 s stings).
2. Add a sound to the playlist in `src/packs/sangreal-sfx.yaml` (name, path, volume,
   repeat) and, if it is third-party, a row to `src/assets/audio/CREDITS.md`.
3. `npm run validate && npm run build && npm run audit`.
