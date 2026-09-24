#!/usr/bin/env node
/**
 * Fetch, trim and transcode the Sangreal sound-effect set into the module.
 *
 * Real recordings come from Wikimedia Commons (public domain / CC0 / CC-BY) —
 * each one's license and author is recorded in the manifest. The industrial
 * ambiences that have no good free equivalent (fluorescent hum, machine-room
 * drone, wind under sheeting, conduit scraping, power-down, flash ring, thread
 * snap) are synthesized with ffmpeg and are therefore original works.
 *
 * Usage: node /tmp/fetch-sfx.mjs <output-dir>
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(process.argv[2] ?? '/tmp/sfx-out');
fs.mkdirSync(OUT, { recursive: true });

const UA = 'NeonRelicSfxFetch/1.0 (https://github.com/bruceamoser/neon-relic-mission-sangreal-foundry)';
const API = 'https://commons.wikimedia.org/w/api.php';

/** Commons recordings to use: local name, source file, trim window, credit note. */
const RECORDINGS = [
  { out: 'sfx-vault-lift-descent', file: 'Hydraulic elevator ride.ogg', ss: 8, t: 32, use: 'Days 14–13 — the hydraulic cage down to Vault IX' },
  { out: 'sfx-vault-hum', file: 'Heavy breathing 3.ogg', ss: 0, t: 0, skip: true },
  { out: 'sfx-rain-street', file: 'Rain (1).ogg', ss: 0, t: 40, use: 'Geneva steps / Rome street rain' },
  { out: 'sfx-storm-wind', file: 'Killiney Hill Storm Floris 20250804 1537.ogg', ss: 6, t: 40, use: 'Storm wind — rooftops, abbey approach' },
  { out: 'sfx-sirens-distant', file: 'Civil-defense-siren-waver.ogg', ss: 20, t: 28, use: 'Cordon lights through the rain (Days 4–3, Epilogue)' },
  { out: 'sfx-fire-alarm', file: 'Motorsirene - Feuerwehralarm.ogg', ss: 4, t: 18, use: 'Lingotto fire / abbey alarm' },
  { out: 'sfx-gunshots', file: 'Gunshots 8.ogg', ss: 0, t: 6, use: 'Firefights (ward, abbey, tarmac)' },
  { out: 'sfx-pistol-9mm', file: '9 mm gunshot-mike-koenig-123.wav', ss: 0, t: 2, use: 'Single 9 mm shot' },
  { out: 'sfx-typewriter', file: 'WWS Typewriter.ogg', ss: 4, t: 24, use: 'Office work, Wayfinder analysis' },
  { out: 'sfx-telephone-ring', file: 'Model 500 Telephone British ring.ogg', ss: 0, t: 22, use: 'Period telephone — Covenant calls' },
  { out: 'sfx-rail-corridor', file: 'Taiwan railways EP727 traincars sounds.ogg', ss: 30, t: 40, use: 'EC 30 night-train corridor' },
  { out: 'sfx-church-bell', file: 'Samariter Church Bell II (g).ogg', ss: 0, t: 20, use: 'Abbey bell; “lamps went out one at a time”' },
  { out: 'sfx-clock-tick', file: 'Clock ticking.ogg', ss: 0, t: 18, use: 'Operations-board clock' },
  { out: 'sfx-glass-break', file: 'Glass breaking (Gravity Sound).wav', ss: 0, t: 2, use: 'Smashed fluorescent tubes / windows' },
  { out: 'sfx-prop-plane', file: 'Propeller-plane-flying-steady-01.wav', ss: 0, t: 20, use: 'Novara-Cameri airfield at night' },
  { out: 'sfx-metal-clang', file: 'Metal Clanging Noises.ogg', ss: 0, t: 8, use: 'Vault machinery, catwalk, hangar' },
  { out: 'sfx-abbey-door', file: 'Springlocked cellar door.ogg', ss: 0, t: 12, use: 'Abbey doors, vault door' },
  { out: 'sfx-creature-growl', file: 'Boar.Grwls(1).ogg', ss: 2, t: 14, use: 'The feral predator; the thing on the ceiling' },
  { out: 'sfx-lift-door', file: 'Elevator door closing.ogg', ss: 0, t: 8, use: 'Lift gates closing' },
];

/** ffmpeg-synthesized originals — no third-party licence applies. */
const SYNTHS = [
  {
    out: 'sfx-corridor-hum',
    use: 'Play the corridor before the room — fluorescent buzz',
    filter: 'sine=frequency=100:sample_rate=44100:duration=30[hum];anoisesrc=color=pink:duration=30:amplitude=0.04[s1];[hum][s1]amix=inputs=2:normalize=0,tremolo=f=6:d=0.25,aecho=0.8:0.9:60:0.25,volume=1.4',
    inputs: 2,
  },
  {
    out: 'sfx-underground-drone',
    use: 'Vault IX / cold rooms — sub-bass machine drone',
    filter: 'sine=frequency=43:sample_rate=44100:duration=45[lo];anoisesrc=color=brown:duration=45:amplitude=0.5[br];[br]lowpass=f=220[bz];[lo][bz]amix=inputs=2:normalize=0,tremolo=f=0.15:d=0.4,volume=1.1',
    inputs: 2,
  },
  {
    out: 'sfx-wind-sheeting',
    use: 'Wind moving under polythene sheeting (blacked-out ward)',
    filter: 'anoisesrc=color=pink:duration=40:amplitude=0.6[n];[n]bandpass=f=700:width_type=o:w=1.4,tremolo=f=0.35:d=0.85,aecho=0.8:0.7:120:0.3,volume=1.3',
    inputs: 1,
  },
  {
    out: 'sfx-conduit-scrape',
    use: 'Something moving in the ceiling conduits',
    filter: 'anoisesrc=color=white:duration=20:amplitude=0.9[n];[n]highpass=f=900,bandpass=f=2400:width_type=o:w=1,tremolo=f=9:d=0.95,aecho=0.8:0.6:70:0.35,volume=0.9',
    inputs: 1,
  },
  {
    out: 'sfx-power-down',
    use: 'The abbey lamps go out one at a time',
    filter: 'sine=frequency=420:sample_rate=44100:duration=3,volume=0.5[v];anoisesrc=color=brown:duration=3:amplitude=0.4[n];[v][n]amix=inputs=2:normalize=0,asetrate=44100*1,atempo=1',
    inputs: 2,
    extra: '-af "volume=1.2"',
  },
  {
    out: 'sfx-flash-ring',
    use: 'The daylight flash at the Lingotto parley',
    filter: 'sine=frequency=1800:sample_rate=44100:duration=4.5,volume=0.6[v];anoisesrc=color=white:duration=4.5:amplitude=0.7[n];[n]highpass=f=1200[bz];[v][bz]amix=inputs=2:normalize=0,aecho=0.8:0.9:400:0.4',
    inputs: 2,
  },
  {
    out: 'sfx-thread-snap',
    use: 'The room goes quiet enough to hear Claudia’s thread snap',
    filter: 'sine=frequency=2400:sample_rate=44100:duration=1.2,volume=0.4[v];anoisesrc=color=white:duration=1.2:amplitude=0.9[n];[n]highpass=f=3000[bz];[v][bz]amix=inputs=2:normalize=0,volume=1.1',
    inputs: 2,
  },
];

const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const log = (...a) => console.log(...a);

/** Pull author/licence metadata for a Commons file. */
async function commonsMeta(fileName, attempt = 1) {
  const url = `${API}?action=query&titles=${encodeURIComponent(`File:${fileName}`)}&prop=imageinfo&iiprop=url|extmetadata&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    if (attempt < 4) {
      await new Promise((r) => setTimeout(r, 5000));
      return commonsMeta(fileName, attempt + 1);
    }
    throw new Error(`metadata failed for ${fileName}: ${text.slice(0, 80)}`);
  }
  const page = Object.values(data.query?.pages ?? {})[0] ?? {};
  const md = (page.imageinfo ?? [])[0]?.extmetadata ?? {};
  return {
    title: page.title?.replace(/^File:/, '') ?? fileName,
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(page.title?.replace(/^File:/, '') ?? fileName)}`,
    license: md.LicenseShortName?.value ?? 'unknown',
    licenseUrl: md.LicenseUrl?.value ?? '',
    author: (md.Artist?.value ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
    credit: (md.Credit?.value ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 80),
    description: (md.ImageDescription?.value ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160),
  };
}

const manifest = { generated: new Date().toISOString(), tracks: [] };

log(`\n== fetching ${RECORDINGS.filter((r) => !r.skip).length} Commons recordings → ${OUT}`);
for (const rec of RECORDINGS) {
  if (rec.skip) continue;
  const target = path.join(OUT, `${rec.out}.mp3`);
  const tmp = path.join(OUT, `.src-${rec.out}`);
  const meta = await commonsMeta(rec.file);
  const srcUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(rec.file)}`;
  try {
    sh('curl', ['-sL', '--fail', '--max-time', '180', '-A', UA, '-o', tmp, srcUrl]);
  } catch (err) {
    log(`  FAILED download ${rec.file}: ${err.message}`);
    continue;
  }
  // Normalise to mono 44.1 kHz mp3: ambience @96 kbps, short SFX @128 kbps.
  const bitrate = rec.t <= 6 ? '128k' : '96k';
  const args = ['-y', '-hide_banner', '-loglevel', 'error'];
  if (rec.ss) args.push('-ss', String(rec.ss));
  if (rec.t) args.push('-t', String(rec.t));
  args.push(
    '-i', tmp,
    '-vn', '-ac', '1', '-ar', '44100',
    '-af', 'highpass=f=40,loudnorm=I=-20:TP=-3:LRA=11',
    '-c:a', 'libmp3lame', '-b:a', bitrate,
    target,
  );
  try {
    sh('ffmpeg', args);
  } catch (err) {
    log(`  FAILED encode ${rec.out}: ${(err.stderr ?? '').toString().slice(-200)}`);
    continue;
  }
  fs.rmSync(tmp, { force: true });
  const probe = JSON.parse(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size', '-of', 'json', target]));
  const dur = Number(probe.format.duration).toFixed(1);
  log(`  ${rec.out.padEnd(26)} ${dur}s ${Math.round(Number(probe.format.size) / 1024)}KB  [${meta.license}]`);
  manifest.tracks.push({
    file: `sfx/${rec.out}.mp3`,
    name: rec.out,
    use: rec.use,
    seconds: Number(dur),
    origin: 'wikimedia-commons',
    ...meta,
  });
  await new Promise((r) => setTimeout(r, 1200));
}

log(`\n== synthesizing ${SYNTHS.length} original ambiences`);
for (const s of SYNTHS) {
  const target = path.join(OUT, `${s.out}.mp3`);
  const args = ['-y', '-hide_banner', '-loglevel', 'error'];
  // Each synth's filter graph references its own sources.
  args.push('-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono:d=1');
  args.push('-filter_complex', `anullsrc=r=44100:cl=mono:d=1[a];[a]${''}null[z]`);
  // Simpler: build graphs directly from lavfi sources listed in s.filter.
  args.length = 0;
  args.push('-y', '-hide_banner', '-loglevel', 'error');
  const duration = /duration=([0-9.]+)/.exec(s.filter)?.[1] ?? '10';
  args.push('-f', 'lavfi', '-t', duration, '-i', `anullsrc=r=44100:cl=mono`);
  args.push('-filter_complex', `${s.filter}[out]`);
  args.push('-map', '[out]', '-ac', '1', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '96k', target);
  try {
    sh('ffmpeg', args);
  } catch (err) {
    log(`  FAILED synth ${s.out}: ${(err.stderr ?? '').toString().slice(-300)}`);
    continue;
  }
  const probe = JSON.parse(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size', '-of', 'json', target]));
  const vol = sh('ffmpeg', ['-hide_banner', '-i', target, '-af', 'volumedetect', '-f', 'null', '-']).toString();
  const mean = /mean_volume: ([-\d.]+)/.exec(vol)?.[1] ?? '?';
  log(`  ${s.out.padEnd(26)} ${Number(probe.format.duration).toFixed(1)}s ${Math.round(Number(probe.format.size) / 1024)}KB  mean ${mean} dB`);
  manifest.tracks.push({
    file: `sfx/${s.out}.mp3`,
    name: s.out,
    use: s.use,
    seconds: Number(Number(probe.format.duration).toFixed(1)),
    origin: 'synthesized (original work, ffmpeg-generated)',
    license: 'Original — generated for this module (no third-party rights)',
    licenseUrl: '',
    author: 'Generated with ffmpeg for Neon Relic',
    sourceUrl: '',
    description: `Synthesized ambience: ${s.filter.split(',')[0]}`,
  });
}

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
const totalKb = manifest.tracks.reduce((n, t) => n + fs.statSync(path.join(OUT, `${path.basename(t.file)}`)).size, 0);
log(`\n== ${manifest.tracks.length} tracks, ${(totalKb / 1048576).toFixed(2)} MB total → ${path.join(OUT, 'manifest.json')}`);
