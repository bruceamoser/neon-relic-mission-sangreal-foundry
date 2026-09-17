"""Lossless source extraction plus reviewed production annotations. No generation."""
import re
from pathlib import Path

MEDIUM_IDS = ['cctv_16mm','evidence_35mm','polaroid_sx70','passport_id','archival_bw','photocopy_carbon','telephoto_stakeout','aerial_recon']
CHARACTER_NAMES = ['corvi','vane','sabbatini','graf','hausmann','ghiberti','mercier','entita-operative','basarab-operative','basarab-elder','feral-ghoul','gendarme-officer','logistics-officer','wayfinder-analyst','watcher','turin-intermediary']
CHARACTERS = {
 'R01':['corvi','vane'], 'R02':['watcher'], 'R08':['corvi'], 'R09':['corvi'],
 'G01':['corvi','mercier','watcher'], 'G02':['mercier'], 'G05':['corvi','watcher'],
 'Z01':['hausmann'], 'Z02':['hausmann'], 'Z05':['hausmann'],
 'T01':['corvi','vane'], 'T02':['corvi'], 'N01':['vane'], 'N02':['vane'],
 'N06':['basarab-elder'], 'V02':['sabbatini','entita-operative'], 'V03':['entita-operative'],
}
EXTRA_TEXT = {
 'npc-gendarme-officer':['04:02'], 'npc-logistics-officer':['Geneva','Zurich','Turin'],
 'R02':['04:02'], 'R04':['SANGREAL'], 'R06':['IV-I I-V III-II …','Roma Termini'],
 'R08':['06:14'], 'R10':['Geneva','Zurich','Turin'],
 'G01':['22:41','17 September 1987'], 'G03':['CHF 500,000','Sonnenberg Privatklinik','Vaduz','Union de Banques Suisses'],
 'G04':['02:10'], 'Z05':['02:40'],
 'Z07':['subject 09-H attempted to drink from the sharps bin, 02:40','4 °C'],
 'T02':['6','Fiat'], 'T03':['Hotel Bristol, Geneva'], 'N05':['01:15','YR-BAS'], 'V04':['SANGREAL'],
}
# R08's 06:14 follows the explicit two-hours-after-03:14 rule; flagged for source clarification too.
ISSUES = {
 'R08':['Passport subject is 58, but Egg 3 says same session/tie as the 1962 photograph of a much younger Corvi. Resolve session/age/costume before generation.'],
 'R09':['R08 demands same photo session; V04 calls the older R09 prelate young. Lock archival ages/identity after clarification.'],
 'V04':['Egg 3 calls the R09 prelate young, whereas R09 describes an older prelate. Resolve age; then use approved R09 as supervisor identity reference.'],
 'G06':['Exact Turin extension number is not specified in the art brief or I-8; supply canonical number before compositing.'],
 'N02':['Caliper readout must be composited but no numeric measurement is specified. Supply canonical value and units.'],
 'N07':['Toll time is ninety minutes before death, but a precise death time is not supplied; resolve exact toll timestamp.'],
 'relic-lodestone':['Suppressed shelf-mark wording is not specified. Resolve before compositing tag.'],
}
NOTES = {
 'relic-phials':['Prompt says twelve phials while Egg says one slot empty/count eleven. Apply user creative priority: twelve-slot rack, eleven visible phials; retain both source statements for review.'],
 'G01':['Recurring Egg-A adds the arriving grey Lancia beyond the local prompt. Egg-E mentions calendar timestamps while local requirement specifies 17 September 1987; preserve date and flag timestamp ambiguity for QA.'],
 'Z03':['An intruding second Polaroid edge is a natural scene prop explicitly required by the source; output remains one standalone photograph.'],
 'N07':['The grid of belongings is an evidence-table arrangement, not a multi-asset image sheet.'],
 'V03':['Egg refers to a phosphorus canister vignette in Z06, which Z06 does not describe. Use shared canister reference; do not silently add a new Z06 vignette.'],
 'V05':['Recurring Egg-H additionally requires white calcified ash in sealed crate refuse.'],
}
REFS = {
 'ref-sangreal-case':('The Twelve Phials case', 'Single documentary photograph of the closed 1964 brushed-steel attaché case with dual combination deadbolts, small tarnished SANGREAL brass plaque and leather carry-strap. One object, one view; no inset.', ['SANGREAL']),
 'ref-ouroboros-eye':('The Ouroboros-Eye','Single macro documentary photograph of a signet device: a serpent eating its tail encircling an open eye. Lock the motif geometry for embossing, stamping, rings and enamel.', []),
 'ref-basarab-crest':('The Basarab crest','Single macro documentary photograph of a small signet bearing a stylized dragon-wolf with a cross in its jaws, Wallachian noble arms.', []),
 'ref-grey-lancia-scv47':('The grey Lancia Flavia 2000','Single documentary photograph of the grey Lancia Flavia 2000 with a white Vatican diplomatic plate, black SCV 47 characters. One car, one natural view.', ['SCV 47']),
 'ref-green-railway-pass':('Green railway pass','Single top-down evidence photograph of a green Italian State Railways pass; leave the route line clean for exact text.', ['EC 30 (Romulus) — Roma Termini → Genève Cornavin']),
 'ref-ubs-key-tag':('Locker key tag','Single macro evidence photograph of a brass locker key tag; reserve the stamping area for compositing.', ['UBS 4409-C']),
 'ref-rosary-thread-sheath':('Vane rosary','Single macro photograph of the plain wooden rosary with one bead an empty needle holder. Establish the intact sheath used by Vane, not a collection of alternate states.', []),
 'ref-phosphorus-canister':('Phosphorus grenade cylinder','Single documentary photograph of the black phosphorus grenade cylinder clipped to a grey wool overcoat concealing a tactical vest; period 1987. No face or explanatory diagram.', []),
 'ref-phial':('Roman-glass phial','Single forensic photograph of one thick Roman-glass phial holding 50 ml dark un-coagulated blood, red beeswax seal, cursive Aramaic scratched into glass. Do not invent readable clue wording.', []),
 'ref-sonnenberg-logo':('Sonnenberg clinic logo','Single photograph of a small period-appropriate printed Sonnenberg Privatklinik logo sample on aged clinic stationery. Design proposal for human locking; the source does not specify its geometry.', []),
}
REF_USE = {
 'ref-sangreal-case':['npc-corvi','relic-phials','R01','R04','G01','G05','T01','T02','V04'],
 'ref-ouroboros-eye':['npc-watcher','R02','R09','R10','G01','G05','G06','N07','V01'],
 'ref-basarab-crest':['npc-basarab-elder','npc-turin-intermediary','N03','N05','N06','V01','V05'],
 'ref-grey-lancia-scv47':['G01','Z06','T01','V03'],
 'ref-green-railway-pass':['R01','G05'], 'ref-ubs-key-tag':['npc-mercier','G03','G04'],
 'ref-rosary-thread-sheath':['npc-vane','relic-veronica','T06','N07'],
 'ref-phosphorus-canister':['npc-entita-operative','V03'],
 'ref-phial':['relic-phials','Z02','Z07','N01'],
 'ref-sonnenberg-logo':['G03','Z01'],
}
EXTRA_EGGS = {
 'G01':['Recurring Egg-A: grey Lancia Flavia 2000, white Vatican plates SCV 47, arriving cameo.'],
 'G06':['Recurring Egg-C: transcript handwriting connects to the Order; match the R05 charge-card handwriting.'],
 'N07':['Recurring Egg-C: ouroboros-eye on the Talamasca card.'],
 'V05':['Recurring Egg-H: white calcified ash visible in sealed crate refuse.'],
}

def section(text, start, end):
 return text.split(start,1)[1].split(end,1)[0].strip()

def extract(spec):
 style = section(spec,'## 2. Style Bible','## 3. Character')
 fragments = re.findall(r'^\| \*\*[^\n]+?\*\* \| `([^`]+)` \|',style,re.M)
 assert len(fragments)==8, 'Medium recipe extraction changed'
 charsec=section(spec,'## 3. Character reference blocks','## 4. NPC Portraits')
 blocks = re.findall(r'`([^`]+)`',charsec)
 assert len(blocks)==17, 'Character block extraction changed'
 descriptions = dict(zip(CHARACTER_NAMES[:4],blocks[:4]))
 descriptions['hausmann']={'before':blocks[4],'after':blocks[5]}
 descriptions.update(dict(zip(CHARACTER_NAMES[5:14],blocks[6:15])))
 descriptions['watcher']=blocks[15]; descriptions['turin-intermediary']=blocks[16]
 bible={'global_primer':re.findall(r'> `([^`]+)`',style)[0],
        'negative_prompt':re.findall(r'> `([^`]+)`',style)[1],
        'medium_recipes':dict(zip(MEDIUM_IDS,fragments)), 'characters':descriptions,
        'motifs_source':section(style,'### 2.4 Recurring visual motifs','\0') if '\0' in style else style.split('### 2.4 Recurring visual motifs',1)[1].strip(),
        'continuity_source':section(spec,'## 6. Recurring continuity easter eggs','## 7. Clue index'),
        'clue_index_source':section(spec,'## 7. Clue index','## 8. Import checklist')}
 matches=list(re.finditer(r'^\*\*(?:(?P<intel>[RGZTNV]\d{2}) · )?`(?P<filename>(?:intel/|npc-|relic-)[^`]+\.webp)`[^\n]*',spec,re.M))
 assets=[]
 for idx,m in enumerate(matches):
  end=matches[idx+1].start() if idx+1<len(matches) else spec.index('\n---',m.end())
  raw=spec[m.start():end].split('\n### ',1)[0].split('\n---',1)[0].strip()
  aid=m['intel'] or Path(m['filename']).stem; category='intel' if m['intel'] else aid.split('-')[0]
  header=raw.splitlines()[0]; ratio=re.search(r'\b([1-5]:[1-5])\b',header).group(1)
  p=re.search(r'Prompt: `([^`]+)`',raw)
  if not p: p=re.search(r'· `([^`]+)`',raw)
  assert p, aid
  eggraw=raw.split('Eggs:',1)[1].split('\nPrompt:',1)[0].strip()
  pieces=re.split(r'\(\d+\)\s*',eggraw) if re.search(r'\(\d+\)',eggraw) else re.split(r';\s*',eggraw)
  pieces=[x.strip(' ;') for x in pieces if x.strip(' ;')]
  pieces+=EXTRA_EGGS.get(aid,[])
  text=list(dict.fromkeys(re.findall(r'`([^`]+)`',raw.replace(p.group(0),''))[1:]+EXTRA_TEXT.get(aid,[])))
  # Filename is the first remaining code span. All subsequent spans are clue text.
  chars=CHARACTERS.get(aid,[aid[4:]] if category=='npc' else [])
  medium='evidence_35mm'
  if category=='npc': medium='documentary_portrait'
  elif aid in ['R01','R02','G01','Z05','T02']: medium='cctv_16mm'
  elif aid=='Z03': medium='polaroid_sx70'
  elif aid in ['R08','G02','Z01']: medium='passport_id'
  elif aid in ['R09','T04','V04']: medium='archival_bw'
  elif aid in ['R05','G03','G04','Z04','T05','N05']: medium='photocopy_carbon'
  elif aid in ['G05','Z06','T01','N06','V02','V03']: medium='telephoto_stakeout'
  elif aid=='V06': medium='aerial_recon'
  act={'R':'Rome','G':'Geneva','Z':'Zurich','T':'Turin','N':'Novara','V':'Vatican'}.get(aid[0],'References' if category=='npc' else 'Relics')
  refs=['npc-'+x for x in chars if 'npc-'+x!=aid]
  refs += [r for r,ids in REF_USE.items() if aid in ids]
  if aid=='V04': refs+=['R09']
  if aid=='G06': refs+=['R05']
  if aid=='G03': text=[t for t in text if t!='1 of 12']
  for rid in refs:
   if rid in ['ref-sangreal-case','ref-grey-lancia-scv47'] or (rid=='ref-green-railway-pass' and aid=='R01'):
    text += REFS[rid][2]
  text=list(dict.fromkeys(text))
  card=re.search(r'(?:New card|Extend|detail for) I-(\d+)',header)
  mode='new_card' if 'New card' in header else 'detail' if 'detail for' in header else 'existing_card' if category=='intel' else category
  name=re.search(r'New card I-\d+: "([^"]+)"',header)
  name=name.group(1) if name else re.search(r'Extend I-\d+ \(([^)]+)\)',header).group(1) if 'Extend' in header else aid
  assets.append(dict(id=aid,name=name,category=category,act=act,optional=('optional' in header or category=='relic'),
   output={'filename':Path(m['filename']).name,'path':'src/assets/art/'+m['filename']},aspect_ratio=ratio,medium=medium,
   source_section=f'§4 / {aid}' if category!='intel' else f'§5 / {act} / {aid}', source_line=spec[:m.start()].count('\n')+1,
   source_excerpt=raw,asset_prompt=p.group(1),shows=re.search(r'^Shows: (.+)$',raw,re.M).group(1) if 'Shows:' in raw else '',
   characters=chars,reference_assets=[x+'.webp' if not re.match(r'^[RGZTNV]\d',x) else x for x in refs],reference_ids=refs,
   continuity_elements=[r.removeprefix('ref-') for r in refs if r.startswith('ref-')],
   eggs=[{'id':f'{aid}-E{i+1}','requirement':v,'mandatory':True,'composite_text':bool(re.search(r'`|timestamp|reads|readout|label|number|wording|annotation|cities|entry at',v,re.I))} for i,v in enumerate(pieces)],
   exact_text=text,text_requirements_unresolved=ISSUES.get(aid,[]),notes=NOTES.get(aid,[]),
   integration={'mode':mode,'card_id':f'I-{card.group(1)}' if card else None,'item_id':f'sangreal-ic{int(card.group(1)):02d}' if card else ('sangreal-mob-feralghouls' if aid=='npc-feral-ghoul' else 'sangreal-'+aid if category=='npc' else None)},
   status='BLOCKED' if aid in ISSUES else 'REFERENCE_REQUIRED' if refs else 'PENDING',
   generation={'attempts':0,'approved_attempt':None,'prompt_file':f'art/prompts/{aid}.md'},qa={'status':'PENDING','notes':[]},lock=None))
 for aid,(name,prompt,text) in REFS.items():
  assets.append(dict(id=aid,name=name,category='reference',act='References',optional=False,
   output={'filename':aid+'.webp','path':f'art/references/{aid}.webp'},aspect_ratio='3:2',medium='evidence_35mm',
   source_section='§2.4 + production request §9 (internal reference)',source_line=None,source_excerpt=prompt,
   asset_prompt=prompt,shows=prompt,characters=[],reference_assets=[],reference_ids=[],continuity_elements=[aid.removeprefix('ref-')],
   eggs=[{'id':aid+'-E1','requirement':prompt,'mandatory':True,'composite_text':bool(text)}],exact_text=text,text_requirements_unresolved=[],notes=[],
   integration={'mode':'internal','card_id':None,'item_id':None},status='PENDING',generation={'attempts':0,'approved_attempt':None,'prompt_file':f'art/prompts/{aid}.md'},qa={'status':'PENDING','notes':[]},lock=None))
 bible['medium_recipes']['documentary_portrait']='Photographic environmental portrait; honor the asset-specific setting and illumination, 4:5, keep the face and eyes usable for Foundry square crops without excluding mandatory props.'
 return assets,bible
