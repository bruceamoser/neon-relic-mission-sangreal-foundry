#!/usr/bin/env node
/** Generate the SFX playlist pack YAML + licensing docs from the fetch manifest. */
import fs from 'node:fs';
import path from 'node:path';

const REPO = '/mnt/disk4/repos/neon-relic-mission-sangreal-foundry';
const MODULE_ID = 'neon-relic-mission-sangreal';
const manifest = JSON.parse(fs.readFileSync('/tmp/sfx-out/manifest.json', 'utf8'));

/** Playlist presentation per track: friendly name, volume, loop. */
const PRESENTATION = {
  'sfx-vault-lift-descent': ['Ambience — Vault lift descent (Days 14–13)', 0.5, true],
  'sfx-underground-drone': ['Ambience — Underground vault drone (Vault IX)', 0.4, true],
  'sfx-lift-door': ['Prop — Lift gates closing', 0.5, false],
  'sfx-corridor-hum': ['Ambience — Fluorescent corridor hum (clinic)', 0.35, true],
  'sfx-wind-sheeting': ['Ambience — Wind under sheeting (blacked-out ward)', 0.45, true],
  'sfx-conduit-scrape': ['Sting — Something in the ceiling conduits', 0.5, false],
  'sfx-rain-street': ['Ambience — Rain on stone steps (Geneva / Rome)', 0.45, true],
  'sfx-storm-wind': ['Ambience — Storm wind (rooftops, abbey approach)', 0.45, true],
  'sfx-rail-corridor': ['Ambience — Night-train corridor (EC 30)', 0.4, true],
  'sfx-prop-plane': ['Ambience — Airfield prop plane at night (Novara)', 0.45, true],
  'sfx-creature-growl': ['Sting — The thing in the ceiling / the feral predator', 0.55, false],
  'sfx-gunshots': ['SFX — Gunfire', 0.65, false],
  'sfx-pistol-9mm': ['SFX — Single 9 mm shot', 0.6, false],
  'sfx-sirens-distant': ['Ambience — Distant civil-defence siren (cordon in the rain)', 0.45, true],
  'sfx-fire-alarm': ['Sting — Alarm / fire alarm (Lingotto, abbey)', 0.5, false],
  'sfx-church-bell': ['Prop — Abbey bell toll', 0.5, false],
  'sfx-clock-tick': ['Ambience — Clock ticking (Operations Board)', 0.3, true],
  'sfx-typewriter': ['Prop — Typewriter (office, analysis)', 0.5, false],
  'sfx-telephone-ring': ['Prop — Period telephone ring', 0.5, false],
  'sfx-metal-clang': ['SFX — Metal clang (vault machinery, catwalk, hangar)', 0.55, false],
  'sfx-abbey-door': ['Prop — Heavy door, spring lock (abbey, vault)', 0.5, false],
  'sfx-glass-break': ['SFX — Glass breaking (tubes, windows)', 0.6, false],
  'sfx-power-down': ['Sting — Power down / lamps going out', 0.5, false],
  'sfx-flash-ring': ['Sting — The daylight flash at the parley', 0.55, false],
  'sfx-thread-snap': ['Sting — Claudia’s thread snaps', 0.5, false],
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const yamlQuote = (s) => `'${String(s).replace(/'/g, "''")}'`;

/** ---- playlist pack YAML ---- */
const lines = [];
lines.push('# Mission: Sangreal — Sound Effects (Playlist pack)');
lines.push('# Playlists: playlist');
lines.push('#');
lines.push('# One playlist per module: “Sangreal Sound Effects”. Every track is a short');
lines.push('# ambience bed, prop or sting keyed to a beat of the DA walkthrough — the cue sheet');
lines.push('# (phase → track) is the “Sound Effects — Cue Sheet” page of the DA Walkthrough');
lines.push('# journal, and the licensing record ships in assets/audio/CREDITS.md.');
lines.push('#');
lines.push('# The installer imports this pack into the world as a folder named “Sound Effects”.');
lines.push('# Ambience beds use repeat: true (they loop until stopped); one-shots do not.');
lines.push('---');
lines.push('- _id: sangreal-sfx');
lines.push('  name: Sangreal Sound Effects');
lines.push('  type: playlist');
lines.push(
  `  description: ${yamlQuote(
    'Cue-keyed ambience, props and stings for the fourteen days of the Sangreal case. Ambience beds loop; stings play once. Volume trims are starting points — ride them live at the table.',
  )}`,
);
lines.push('  mode: 0 # 0 = sequential, 1 = simultaneous, 2 = shuffle');
lines.push('  playing: false');
lines.push('  fade: 2000');
lines.push("  sorting: 'a'");
lines.push('  sounds:');
for (const t of manifest.tracks) {
  const [friendly, volume, repeat] = PRESENTATION[t.name] ?? [t.name, 0.5, false];
  lines.push(`    - _id: ${slug(t.name)}`);
  lines.push(`      name: ${yamlQuote(friendly)}`);
  lines.push(`      path: modules/${MODULE_ID}/assets/audio/sfx/${t.name}.mp3`);
  lines.push(`      repeat: ${repeat}`);
  lines.push(`      volume: ${volume}`);
  lines.push('      playing: false');
}
fs.mkdirSync(path.join(REPO, 'src/packs'), { recursive: true });
fs.writeFileSync(path.join(REPO, 'src/packs/sangreal-sfx.yaml'), lines.join('\n') + '\n');

/** ---- shipped credits ---- */
const credited = manifest.tracks.filter((t) => t.origin === 'wikimedia-commons');
const original = manifest.tracks.filter((t) => t.origin !== 'wikimedia-commons');
const creditLines = [];
creditLines.push('# Sound effect credits — Mission: Sangreal');
creditLines.push('');
creditLines.push('All audio in `sfx/` is free to use and redistribute. Each recording is a public-domain,');
creditLines.push('CC0 or Creative Commons (BY / BY-SA) file from Wikimedia Commons, trimmed and');
creditLines.push('loudness-normalised for playback (mono MP3). The share-alike/attribution files keep');
creditLines.push('their licence terms — they are redistributed here unmodified in substance.');
creditLines.push('');
creditLines.push('## Third-party recordings');
creditLines.push('');
creditLines.push('| Track | Source (Wikimedia Commons) | Licence | Author |');
creditLines.push('| --- | --- | --- | --- |');
for (const t of credited) {
  creditLines.push(
    `| \`${t.name}.mp3\` | [${t.title}](${t.sourceUrl}) | ${t.license}${t.licenseUrl ? ` ([deed](${t.licenseUrl}))` : ''} | ${t.author || '—'} |`,
  );
}
creditLines.push('');
creditLines.push('## Synthesized originals');
creditLines.push('');
creditLines.push('Generated with ffmpeg for this module (no third-party rights — use freely):');
creditLines.push('');
for (const t of original) creditLines.push(`- \`${t.name}.mp3\` — ${t.use}`);
creditLines.push('');
fs.writeFileSync(path.join(REPO, 'src/assets/audio/CREDITS.md'), creditLines.join('\n'));

/** ---- docs/sound-effects.md ---- */
const docLines = [];
docLines.push('# Sound Effects — Mission: Sangreal');
docLines.push('');
docLines.push('The DA walkthrough cues sound at specific beats ("Play the lift on the way — the');
docLines.push('hydraulic cage groaning through forty feet of rock"). This page is the cue sheet');
docLines.push('the module ships as a Foundry playlist: **Sangreal Sound Effects** (compendium pack');
docLines.push('*Sound Effects*, installed into a world folder of the same name).');
docLines.push('');
docLines.push('## Cue sheet');
docLines.push('');
docLines.push('| Beat / cue in the walkthrough | Track | Length | Loop | Volume |');
docLines.push('| --- | --- | --- | --- | --- |');
for (const t of manifest.tracks) {
  const [friendly, volume, repeat] = PRESENTATION[t.name] ?? [t.name, 0.5, false];
  docLines.push(
    `| ${t.use} | ${friendly} | ${t.seconds}s | ${repeat ? 'yes' : '—'} | ${volume} |`,
  );
}
docLines.push('');
docLines.push('## How it is delivered');
docLines.push('');
docLines.push('- Audio ships in `src/assets/audio/sfx/*.mp3` (mono, loudness-normalised, 96–128 kbps).');
docLines.push('- `src/packs/sangreal-sfx.yaml` compiles to the `Sound Effects` compendium pack (one');
docLines.push('  playlist, `Sangreal Sound Effects`), which the Content Installer imports into a world');
docLines.push('  folder of the same name. Re-running the installer refreshes the playlist.');
docLines.push('- Licensing: see `src/assets/audio/CREDITS.md` (also shipped) — public domain, CC0,');
docLines.push('  CC BY or CC BY-SA per track; the synthesized beds are original works.');
docLines.push('');
docLines.push('## Adding or replacing a track');
docLines.push('');
docLines.push('1. Drop the file in `src/assets/audio/sfx/` (q85-ish mono mp3, ~40 s beds, 1–8 s stings).');
docLines.push('2. Add a sound to the playlist in `src/packs/sangreal-sfx.yaml` (name, path, volume,');
docLines.push('   repeat) and, if it is third-party, a row to `src/assets/audio/CREDITS.md`.');
docLines.push('3. `npm run validate && npm run build && npm run audit`.');
docLines.push('');
fs.mkdirSync(path.join(REPO, 'docs'), { recursive: true });
fs.writeFileSync(path.join(REPO, 'docs/sound-effects.md'), docLines.join('\n'));

console.log(`playlist pack: ${manifest.tracks.length} sounds`);
console.log(`credited recordings: ${credited.length} | synthesized: ${original.length}`);
