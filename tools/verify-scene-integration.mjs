import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { ClassicLevel } from 'classic-level';
import YAML from 'js-yaml';
import { toFoundryId, SCENE_SCHEMA_CORE_VERSION } from './lib/pack-lib.mjs';
const root=path.resolve(import.meta.dirname,'..');
const read=async p=>fs.readFile(path.join(root,p),'utf8');
const manifest=JSON.parse(await read('art/scene-production/manifest.json'));
async function entries(pack){const db=new ClassicLevel(path.join(root,'dist/packs',pack),{keyEncoding:'utf8',valueEncoding:'json'});try{return new Map(await db.iterator().all())}finally{await db.close()}}
const scenes=await entries('sangreal-scenes');const journals=await entries('sangreal-journals');
const sites=YAML.load(await read('src/packs/sangreal-sites.yaml'));
const journalSource=await read('src/packs/sangreal-journals.yaml');
let total=0;
// Foundry persists a re-stamped `_stats.coreVersion` (the running core version) when it
// opens a pack, so the gate only requires the stamp to be present and no older than the
// schema version the scenes were authored at (v14.353).
const versionAtLeast=(v,min)=>{const a=String(v).split('.').map(Number),b=String(min).split('.').map(Number);for(let i=0;i<Math.max(a.length,b.length);i++){const d=(a[i]??0)-(b[i]??0);if(d)return d>0}return true};
const gateOk=s=>s._stats?.coreVersion&&versionAtLeast(s._stats.coreVersion,SCENE_SCHEMA_CORE_VERSION);
const landing=scenes.get('!scenes!4W0BYBBwqjV7ChPk');
assert(landing,`landing scene missing`);
assert(gateOk(landing),`landing: scene missing migration-gate coreVersion (got ${landing._stats?.coreVersion})`);
for(const a of manifest.assets){
 const id=toFoundryId('sangreal-scene-'+a.id.toLowerCase()),s=scenes.get('!scenes!'+id);
 assert(s,`${a.id}: missing scene`);assert.equal(s.navigation,false);assert.equal(s.active,false);assert.equal(s.ownership.default,0);
 assert(gateOk(s),`${a.id}: scene missing migration-gate coreVersion (got ${s._stats?.coreVersion})`);
 assert.deepEqual([s.width,s.height],a.dimensions);assert.equal(s.grid.type,0);assert.equal(s.tokenVision,false);assert.equal(s.fog.mode,0);
 assert.equal(typeof s.initial,'object');assert.equal(s.levels.length,1);
 const l=scenes.get(`!scenes.levels!${id}.${s.levels[0]}`);assert(l,`${a.id}: missing level`);
 assert.equal(l.background.src,'modules/neon-relic-mission-sangreal/'+a.path);
 assert(journals.has(`!journal.pages!${s.journal}.${s.journalEntryPage}`),`${a.id}: broken scene journal`);
 assert(journalSource.includes(a.scene_uuid),`${a.id}: missing index link`);
 if(/^L[1-7]$/.test(a.location)) assert(sites.find(s=>s.system?.locationId===a.location).system.description.includes(a.scene_uuid));
 for(const base of ['src','dist']){const b=await fs.readFile(path.join(root,base,a.path));assert.equal(crypto.createHash('sha256').update(b).digest('hex'),a.sha256);if(base==='dist')total+=b.length}
}
assert.equal(manifest.assets.length,26);assert(total<8_000_000,'Scene image budget exceeded');
const files=await fs.readdir(path.join(root,'dist/assets/art/scenes'),{recursive:true});assert.equal(files.filter(f=>f.endsWith('.webp')).length,26);assert(!files.some(f=>/\.(png|jpe?g)$/i.test(f)),'Uncompressed scene master shipped');
for(const pack of ['sangreal-sites','sangreal-journals']) for(const [,doc] of await entries(pack)){
 for(const match of JSON.stringify(doc).matchAll(/@UUID\[Compendium\.neon-relic-mission-sangreal\.sangreal-scenes\.Scene\.([A-Za-z0-9]+)\]/g))assert(scenes.has('!scenes!'+match[1]),'Broken scene UUID');
}
console.log(`PASS: 26 scene backgrounds, embedded Levels, journal backlinks, location/index links, matching hashes; ${(total/1e6).toFixed(2)} MB, no masters shipped.`);
