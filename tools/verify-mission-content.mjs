import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'js-yaml';
import { ClassicLevel } from 'classic-level';
const root=path.resolve(import.meta.dirname,'..');
const manifest=JSON.parse(await fs.readFile(path.join(root,'dist/module.json'),'utf8'));
const targets=new Set(),records=[];
const prefixes={'!items!':'Item','!actors!':'Actor','!scenes!':'Scene','!journal!':'JournalEntry','!playlists!':'Playlist','!tables!':'RollTable'};
for(const pack of manifest.packs){
 const db=new ClassicLevel(path.join(root,'dist',pack.path),{keyEncoding:'utf8',valueEncoding:'json'});
 try {for(const [key,doc] of await db.iterator().all()){
  records.push(doc);
  for(const [prefix,type] of Object.entries(prefixes))if(key.startsWith(prefix))targets.add(`Compendium.${manifest.id}.${pack.name}.${type}.${doc._id}`);
  if(key.startsWith('!journal.pages!')){const [,parent,page]=key.split('!').at(-1).match(/^([^.]+)\.([^.]+)$/)??[];targets.add(`Compendium.${manifest.id}.${pack.name}.JournalEntry.${parent}.JournalEntryPage.${page}`);}
 }}finally{await db.close();}
}
let refs=0,media=0;
for(const doc of records){
 const text=JSON.stringify(doc);
 for(const [,uuid] of text.matchAll(/@UUID\[([^\]]+)\]/g))if(uuid.startsWith(`Compendium.${manifest.id}.`)){assert(targets.has(uuid),`Missing inline link: ${uuid}`);refs++;}
 for(const [,asset] of text.matchAll(/modules\/neon-relic-mission-sangreal\/([^"\\<>\s]+)/g)){
  if(!/\.(webp|png|svg|jpg|jpeg|mp3|ogg|wav)$/.test(asset))continue;
  await fs.access(path.join(root,'dist',asset));media++;
 }
}
const load=async name=>YAML.load(await fs.readFile(path.join(root,`src/packs/sangreal-${name}.yaml`),'utf8'));
const clues=await load('clues');const cipher=clues.find(d=>d._id==='sangreal-ic04').system.content;
const pairs=cipher.match(/\b[IV]+-[IV]+\b/g);assert.equal(pairs.length,22);
const roman={I:1,II:2,III:3,IV:4,V:5},alphabet='ABCDEFGHIKLMNOPQRSTUVWXYZ';
const decoded=pairs.map(p=>{const [r,c]=p.split('-').map(x=>roman[x]);return alphabet[(r-1)*5+c-1]}).join('');
assert.equal(decoded,'GENEUAUBSHAUSMANNDDKIC');
const number=decoded.slice(17,21).split('').map(c=>'1234567890'['ABCDEFGHIK'.indexOf(c)]).join('');
assert.equal(number,'4409');
const briefs=await load('briefs');assert.deepEqual(briefs.find(d=>d.type==='daCaseBrief').system.relicMilestones,briefs.find(d=>d.type==='caseBoard').system.relicMilestones);
const photos=await load('investigator-photos');assert.equal(photos.length,24);assert.equal(new Set(photos.map(d=>d.system.cardId)).size,24);
const journals=await load('journals'),walk=journals.find(d=>d._id==='sangreal-journal-walkthrough');assert.equal(walk.pages.length,14);assert(walk.pages[0].text.content.includes('They have not searched Corvi'));
assert(walk.pages[6].text.content.includes('refused'));assert(walk.pages[8].text.content.includes('Intervene'));
console.log(`PASS: ${refs} inline module links and ${media} media references resolve; cipher yields GENEUA / UBS / HAUSMANN / DDKI / C → GENEVA / UBS / HAUSMANN / 4409 / C; matching clocks and 24 photo cards.`);
