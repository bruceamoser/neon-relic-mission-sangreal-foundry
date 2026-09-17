#!/usr/bin/env python3
"""Sangreal one-asset production ledger. Built-in image generation stays agent-operated."""
import argparse
import collections
import contextlib
import datetime as dt
import fcntl
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import yaml
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from catalog import extract

ROOT=Path(__file__).resolve().parents[2]
ART=ROOT/'art'
MANIFEST=ART/'art-manifest.yaml'
STATES='PENDING REFERENCE_REQUIRED READY GENERATING GENERATED QA_FAILED NEEDS_EDIT NEEDS_REGENERATION TEXT_COMPOSITE FINAL_QA APPROVED INTEGRATED BLOCKED'.split()
CHECKS='composition identity props motifs period medium aspect_ratio clue_visibility anatomy hands faces duplicates modern_objects unintended_text vehicle_geometry symbol_geometry numbers object_geometry'.split()
CALIBRATION=['npc-corvi','R01','R03','G03','Z03','T01']
ONE='Create exactly ONE standalone image.\nThis is not a contact sheet.\nDo not create multiple panels, alternate views, variations, comparison images, or inset images.\nAll requested details must exist naturally within the same single photograph.'

def now(): return dt.datetime.now(dt.timezone.utc).isoformat()
def digest(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p): return yaml.safe_load(Path(p).read_text())
def write(p,data):
 p=Path(p); p.parent.mkdir(parents=True,exist_ok=True)
 fd,tmp=tempfile.mkstemp(dir=p.parent,prefix='.'+p.name)
 try:
  with os.fdopen(fd,'w') as f: yaml.safe_dump(data,f,sort_keys=False,allow_unicode=True,width=110)
  os.replace(tmp,p)
 finally:
  if os.path.exists(tmp): os.unlink(tmp)
def safe(path):
 p=(ROOT/path).resolve()
 if not p.is_relative_to(ROOT): raise ValueError('Pipeline path escapes workspace: '+str(path))
 return p
@contextlib.contextmanager
def locked():
 ART.mkdir(exist_ok=True)
 with (ART/'.pipeline.lock').open('a') as f:
  fcntl.flock(f,fcntl.LOCK_EX); yield

def get(m,aid):
 for a in m['assets']:
  if a['id']==aid:return a
 raise ValueError('Unknown asset '+aid)
def immutable(a):
 if a['lock'] or a['status'] in ['APPROVED','INTEGRATED']: raise ValueError('Approved asset is immutable; explicit user direction and a separately versioned revision are required.')
def verify_source(m):
 if digest(safe(m['source']['snapshot']))!=m['source']['sha256']: raise ValueError('Source snapshot changed; reconcile manifest explicitly.')
 origin=Path(m['source']['canonical'])
 if origin.exists() and digest(origin)!=m['source']['sha256']: raise ValueError('Canonical specification changed; reconcile manifest explicitly.')
def report(m):
 counts=collections.Counter(a['status'] for a in m['assets'])
 cats=collections.Counter(a['category'] for a in m['assets'])
 modes=collections.Counter(a['integration']['mode'] for a in m['assets'])
 lines=['# Mission: Sangreal Art Status','',f'Updated: {m["updated_at"]}','',
 f'Total production jobs: {len(m["assets"])}. Source-requested images: {sum(v for k,v in cats.items() if k!="reference")}. Internal references: {cats["reference"]}.',
 f'NPC portraits: {cats["npc"]} (Watcher optional). Optional relics: {cats["relic"]}. Intel: {cats["intel"]}.',
 f'Existing-card replacements: {modes["existing_card"]}. New-card images: {modes["new_card"]}. Additional I-13 detail: {modes["detail"]}.',
 f'Exact-text/compositing jobs: {sum(bool(a["exact_text"] or a["text_requirements_unresolved"]) for a in m["assets"])} (includes unresolved wording).','',
 ', '.join(f'{k}: {counts[k]}' for k in STATES if counts[k]),'',
 'No generation or QA result is inferred from a prompt. READY authorizes job preparation only.','',
 '## Human checkpoints','']
 lines += [f'- {k}: {v["status"]}' for k,v in m['checkpoints'].items()]
 for group in ['References','Relics','Rome','Geneva','Zurich','Turin','Novara','Vatican']:
  lines += ['',f'## {group}','','| ID | Asset | Status | Attempts | Optional |','|---|---|---|---:|---|']
  for a in m['assets']:
   if a['act']==group: lines.append(f'| {a["id"]} | {a["name"].replace("|","/")} | {a["status"]} | {a["generation"]["attempts"]} | {"yes" if a["optional"] else "no"} |')
 lines += ['','## Versioned revision history','']
 for a in m['assets']:
  for revision in a.get('revisions',[]):
   lines.append(f'- **{a["id"]} / {revision["id"]}**: visual QA {revision["visual_qa"]}; human review {revision["human_review"]}. [Review image]({str(safe(revision["image"]))}). Approved original preserved.')
 lines += ['','## Unresolved source requirements','']
 for a in m['assets']:
  lines += [f'- **{a["id"]}**: {x}' for x in a['text_requirements_unresolved']]
 lines += ['','See [README.md](README.md) for commands, checkpoints, integration limitations and the calibration proposal.','']
 (ART/'STATUS.md').write_text('\n'.join(lines))
def save(m):
 m['updated_at']=now(); write(MANIFEST,m); report(m)
def references(m,a):
 result=[]
 for rid in a['reference_ids']:
  r=get(m,rid)
  if not r['lock']: raise ValueError(f'{a["id"]} requires locked reference {rid}')
  p=safe(r['output']['path'])
  if not p.exists() or digest(p)!=r['lock']['sha256']: raise ValueError('Missing or changed reference '+rid)
  result.append({'id':rid,'path':str(p),'sha256':r['lock']['sha256']})
 return result

def prompt(m,a):
 bible=read(ART/'style-bible.yaml')
 parts=[f'# {a["id"]} — {a["name"]}', 'Use case: historical-scene',
  'Global style: '+bible['global_primer'], 'Avoid: '+bible['negative_prompt'],
  'Medium: '+bible['medium_recipes'][a['medium']],f'Aspect ratio: {a["aspect_ratio"]}. Minimum short edge 1024 px, prefer 1536–2048 px.',
  'Period interpretation: period CRTs, film cameras, fluorescent tubes and analog equipment explicitly requested by the asset are permitted. No post-1987 electronics or objects.']
 for c in a['characters']:
  desc=bible['characters'][c]
  if isinstance(desc,dict):desc=desc['before'] if a['id']=='Z01' else desc['after']
  parts.append(f'Canonical character {c}: {desc}')
 parts+=['Reference inputs (identity/prop references, never panels or inserted pictures):']
 for rid in a['reference_ids']:
  r=get(m,rid); parts.append(f'- {rid}: '+(str(safe(r['output']['path'])) if r['lock'] else 'NOT LOCKED — generation blocked'))
 parts += ['Asset prompt (verbatim): '+a['asset_prompt'],'Scene requirements: '+a['shows'], 'Mandatory visible Eggs:']
 parts += [f'- {e["id"]}: {e["requirement"]}' for e in a['eggs']]
 if a['continuity_elements']: parts+=['Canonical recurring motif descriptions:',bible['motifs_source']]
 if a['exact_text']:
  parts+=['Exact text is a separate compositing stage. Generate suitable clean surfaces in their natural scene positions; no invented clue wording. The following source wording will be added later:', *['- '+t for t in a['exact_text']]]
 if a['notes']:parts+=['Production interpretation notes:',*a['notes']]
 for decision in a.get('source_resolutions',[]):parts+=['Explicit user resolution: '+decision['instructions']]
 if a['text_requirements_unresolved']: parts+=['BLOCKED — unresolved canonical requirements:',*a['text_requirements_unresolved']]
 parts += ['Restrained forensic horror; no gratuitous gore. Priority: correct clues, continuity, period, medium, composition, mood, decoration.',ONE]
 out=safe(a['generation']['prompt_file']);out.parent.mkdir(parents=True,exist_ok=True);out.write_text('\n\n'.join(parts)+'\n')
 return out

def init(args):
 if MANIFEST.exists():raise ValueError('Manifest already exists; init never replaces production state.')
 source=Path(args.spec).resolve(); spec=source.read_text(); assets,bible=extract(spec)
 for d in ['prompts','qa','references','work/history','work/status','composite','rejected','spec']:(ART/d).mkdir(parents=True,exist_ok=True)
 snapshot=ART/'spec/intel-art-prompts.md'
 if source!=snapshot:snapshot.write_text(spec)
 m={'schema_version':1,'source':{'canonical':str(source),'snapshot':str(snapshot.relative_to(ROOT)),'sha256':digest(source)},
 'module_repository':str(Path(args.repo).resolve()),'supported_statuses':STATES,'calibration':CALIBRATION,
 'checkpoints':{k:{'status':'PENDING','reviewer':None,'evidence':None} for k in ['style_calibration','character_references','prop_references','first_act','remaining_acts','final_integration']},'assets':assets,'updated_at':now()}
 write(ART/'style-bible.yaml',bible)
 for a in assets:prompt(m,a)
 save(m);print(f'Extracted {len(assets)} jobs, including {sum(a["category"]=="reference" for a in assets)} internal references.')

def validate(m):
 verify_source(m); ids=[a['id'] for a in m['assets']]; paths=[a['output']['path'] for a in m['assets']]
 assert len(ids)==len(set(ids)) and len(paths)==len(set(paths)), 'Duplicate ID or output'
 parsed,_=extract(safe(m['source']['snapshot']).read_text())
 assert set(ids)=={a['id'] for a in parsed}, 'Source coverage mismatch'
 for a in m['assets']:
  assert a['status'] in STATES and a['eggs'],a['id']
  assert set(a['reference_ids'])<=set(ids),a['id']
  safe(a['output']['path'])
  if a['lock']:
   assert digest(safe(a['output']['path']))==a['lock']['sha256'], 'Lock changed '+a['id']
   assert a['status'] in ['APPROVED','INTEGRATED']
  assert ONE in safe(a['generation']['prompt_file']).read_text()
 def visit(a,stack):
  assert a['id'] not in stack,'Reference dependency cycle'
  for r in a['reference_ids']:visit(get(m,r),stack+[a['id']])
 for a in m['assets']:visit(a,[])
 print(f'Validated {len(ids)} unique jobs, source coverage, dependency DAG, paths, prompts and approved hashes.')

def job_history(a):return ART/f'work/history/{a["id"]}-attempt-{a["generation"]["attempts"]:03d}.yaml'
def begin(m,a,args):
 immutable(a);verify_source(m)
 if a['text_requirements_unresolved']:raise ValueError('Resolve canonical requirements before producing '+a['id'])
 if a['status'] not in ['PENDING','REFERENCE_REQUIRED','READY','NEEDS_EDIT','NEEDS_REGENERATION']:raise ValueError('Invalid generation state '+a['status'])
 if a['category']=='intel' and a['id'] not in CALIBRATION:
  gates=['style_calibration','character_references','prop_references']+(['first_act'] if a['act']!='Rome' else [])
  for k in gates:
   if m['checkpoints'][k]['status']!='APPROVED':raise ValueError('Checkpoint pending: '+k)
 if args.operation=='edit' and a['status']!='NEEDS_EDIT':raise ValueError('Targeted edit requires NEEDS_EDIT QA decision.')
 if args.operation=='generate' and a['status']=='NEEDS_EDIT':raise ValueError('Use targeted edit for NEEDS_EDIT.')
 refs=references(m,a); p=prompt(m,a)
 n=a['generation']['attempts']+1
 attempt_prompt=ART/f'prompts/{a["id"]}-attempt-{n:03d}.md'
 if args.operation=='edit':
  if not args.instructions:raise ValueError('Edit requires --instructions with targeted correction.')
  source=safe(a['generation']['working_image']);
  if digest(source)!=a['generation']['working_sha256']:raise ValueError('Edit source changed')
  attempt_prompt.write_text(p.read_text()+'\nEDIT TARGET: '+str(source)+'\nChange only: '+args.instructions+'\nPreserve all unrelated content, identity, lighting, composition and already-passing clues.\n')
 else: source=None;shutil.copyfile(p,attempt_prompt)
 history={'asset':a['id'],'attempt':n,'started_at':now(),'model':'built-in image_gen (backend model not exposed)',
 'operation':args.operation,'prompt_file':str(attempt_prompt.relative_to(ROOT)),'prompt_sha256':digest(attempt_prompt),
 'references':refs,'source_image':str(source) if source else None,'source_sha256':digest(source) if source else None,
 'output_image':None,'qa_result':'PENDING','rejection_reason':None}
 a['generation']['attempts']=n;a['status']='GENERATING';a['qa']={'status':'PENDING','notes':[]};write(job_history(a),history)
 print(json.dumps({'asset':a['id'],'prompt_file':str(attempt_prompt),'referenced_image_paths':([str(source)] if source else [])+[r['path'] for r in refs],
 'instruction':'Inspect each local input with view_image; call built-in image_gen once for this asset. Then record returned local output using ingest. Do not submit this envelope as one combined-image request.'},indent=2))

def dimensions(path,a):
 with Image.open(path) as im:
  im.verify()
 with Image.open(path) as im:
  if getattr(im,'n_frames',1)!=1:raise ValueError('Animated/multi-frame output forbidden')
  w,h=im.size
  x,y=map(int,a['aspect_ratio'].split(':'))
  if abs(w/h-x/y)/(x/y)>.01:raise ValueError(f'Aspect ratio wrong: {w}x{h}; wanted {a["aspect_ratio"]}')
  if min(w,h)<1024:raise ValueError('Short edge below 1024; record an explicit generator limitation before changing policy.')
 return w,h

def ingest(m,a,args):
 immutable(a)
 if a['status']!='GENERATING':raise ValueError('begin must precede ingest')
 src=Path(args.image).resolve()
 # Preserve the tool output even if production dimensions fail; QA must then reject it.
 with Image.open(src) as im:
  if getattr(im,'n_frames',1)!=1:raise ValueError('Multiple frames forbidden')
 out=ART/f'work/{a["id"]}/attempt-{a["generation"]["attempts"]:03d}{src.suffix.lower()}'
 out.parent.mkdir(parents=True,exist_ok=True)
 if out.exists():raise ValueError('Attempt output already exists')
 shutil.copyfile(src,out)
 a['generation']['working_image']=str(out.relative_to(ROOT));a['generation']['working_sha256']=digest(out);a['status']='GENERATED'
 h=read(job_history(a));h.update(output_image=str(out.relative_to(ROOT)),output_sha256=digest(out),generated_at=now());write(job_history(a),h)
 template(a,False);print(out)

def template(a,final):
 src=safe(a['generation']['working_image'])
 out=ART/f'qa/{a["id"]}-attempt-{a["generation"]["attempts"]:03d}{"-final" if final else ""}.yaml'
 if out.exists():raise ValueError('QA report already exists; edit it rather than overwrite evidence')
 write(out,{'asset':a['id'],'attempt':a['generation']['attempts'],'stage':'final' if final else 'visual','image':str(src.relative_to(ROOT)),
 'image_sha256':digest(src),'inspected_visually':False,'reviewer':None,'inspected_at':None,
 'eggs':{e['id']:{'status':'AMBIGUOUS','notes':''} for e in a['eggs']},
 'checks':{c:{'status':'AMBIGUOUS','notes':''} for c in CHECKS},
 'exact_text':{t:{'status':'AMBIGUOUS','notes':''} for t in a['exact_text']} if final else {},
 'overall':'QA_FAILED','notes':[]})
 print('Visual inspection required; complete '+str(out))

def check_report(a,q,stage):
 src=safe(a['generation']['working_image'])
 if not(q.get('asset')==a['id'] and q.get('attempt')==a['generation']['attempts'] and q.get('stage')==stage):raise ValueError('QA asset/attempt/stage mismatch')
 if not q.get('inspected_visually') or not q.get('reviewer') or not q.get('inspected_at'):raise ValueError('Actual visual inspection, reviewer and time are required')
 if q.get('image_sha256')!=digest(src) or safe(q['image'])!=src:raise ValueError('QA describes another image')
 if set(q['eggs'])!={e['id'] for e in a['eggs']} or set(q['checks'])!=set(CHECKS):raise ValueError('Incomplete QA criteria')
 for item in list(q['eggs'].values())+list(q['checks'].values())+list(q.get('exact_text',{}).values()):
  if item['status'] not in ['PASS','FAIL','AMBIGUOUS'] or not item.get('notes'):raise ValueError('Each criterion needs PASS/FAIL/AMBIGUOUS and observed evidence')
 if stage=='final' and set(q['exact_text'])!=set(a['exact_text']):raise ValueError('Final QA must cover each exact string')

def qa(m,a,args):
 immutable(a)
 if a['status'] not in ['GENERATED','FINAL_QA']:raise ValueError('QA is not available in '+a['status'])
 stage='final' if a['status']=='FINAL_QA' else 'visual';q=read(args.report);check_report(a,q,stage)
 if q['overall'] not in ['APPROVED','NEEDS_EDIT','NEEDS_REGENERATION']:raise ValueError('Choose an explicit QA decision')
 groups=list(q['eggs'].values())+list(q['checks'].values())+list(q.get('exact_text',{}).values())
 if q['overall']=='APPROVED':
  # During base-art QA, text-marked Eggs may await compositing; every other criterion must pass.
  allowed={e['id'] for e in a['eggs'] if e['composite_text']} if stage=='visual' and a['exact_text'] else set()
  if any(v['status']!='PASS' for k,v in q['eggs'].items() if k not in allowed) or any(v['status']!='PASS' for v in q['checks'].values()) or any(v['status']!='PASS' for v in q.get('exact_text',{}).values()):raise ValueError('Non-passing criteria prevent approval')
  dimensions(safe(a['generation']['working_image']),a)
  if stage=='visual':
   a['qa'].pop('final_pass',None)
   a['status']='TEXT_COMPOSITE' if a['exact_text'] else 'FINAL_QA'
  else:a['qa']['final_pass']=True
 else:
  a['status']=q['overall'];rej=ART/f'rejected/{a["id"]}';rej.mkdir(parents=True,exist_ok=True)
  src=safe(a['generation']['working_image']);dest=rej/src.name
  if not dest.exists():shutil.copyfile(src,dest)
 a['qa'].update(status=q['overall'],notes=q.get('notes',[]),report=str(Path(args.report).resolve()),image_sha256=q['image_sha256'])
 h=read(job_history(a));h['qa_result']=q['overall'];h['rejection_reason']=q.get('notes') if q['overall']!='APPROVED' else None
 h.setdefault('qa_reports',[]).append({'stage':stage,'report':q,'recorded_at':now()});write(job_history(a),h)

# Deterministic text overlay is explicitly requested by the user; no generative text is trusted.
def composite(m,a,args):
 immutable(a)
 if a['status']!='TEXT_COMPOSITE':raise ValueError('Visual QA must pass before text compositing')
 layout=read(args.layout);src=safe(a['generation']['working_image'])
 if layout['image_sha256']!=digest(src):raise ValueError('Layout references another base image')
 layers=layout['layers']
 if set(x['text'] for x in layers)!=set(a['exact_text']):raise ValueError('Layout must contain all and only canonical exact text')
 im=Image.open(src).convert('RGB')
 for item in layers:
  font=ImageFont.truetype(item['font'],int(item['size']))
  text=item['text'];box=font.getbbox(text);pad=16
  layer=Image.new('RGBA',(box[2]-box[0]+pad*2,box[3]-box[1]+pad*2))
  ImageDraw.Draw(layer).text((pad-box[0],pad-box[1]),text,font=font,fill=tuple(item.get('color',[45,38,32,220])))
  if item.get('mirror'):layer=layer.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
  layer=layer.filter(ImageFilter.GaussianBlur(float(item.get('blur',.35))))
  layer=layer.rotate(float(item.get('rotation',0)),expand=True,resample=Image.Resampling.BICUBIC)
  x,y=map(int,item['xy'])
  if x<0 or y<0 or x+layer.width>im.width or y+layer.height>im.height:raise ValueError('Text layer outside image bounds')
  im.paste(layer,(x,y),layer)
 out=ART/f'composite/{a["id"]}-attempt-{a["generation"]["attempts"]:03d}.webp'
 if out.exists():raise ValueError('Composite already exists; preserve it and use a new reviewed attempt')
 im.save(out,format='WEBP',lossless=True)
 a['generation']['working_image']=str(out.relative_to(ROOT));a['generation']['working_sha256']=digest(out);a['status']='FINAL_QA'
 h=read(job_history(a));h.setdefault('composites',[]).append({'at':now(),'operation':'composite','model':'Pillow deterministic text','source_image':str(src.relative_to(ROOT)),'source_sha256':digest(src),'layout':layout,'output':str(out.relative_to(ROOT)),'sha256':digest(out)});write(job_history(a),h)
 template(a,True)

def approve(m,a,args):
 immutable(a)
 if a['status']!='FINAL_QA' or not a['qa'].get('final_pass'):raise ValueError('Final visual QA must pass before approval')
 src=safe(a['generation']['working_image'])
 if digest(src)!=a['qa']['image_sha256']:raise ValueError('Image changed after final QA')
 if a['text_requirements_unresolved']:raise ValueError('Unresolved canonical requirements')
 dimensions(src,a);out=safe(a['output']['path']);out.parent.mkdir(parents=True,exist_ok=True)
 if out.exists():raise ValueError('Existing final file will not be overwritten')
 # Lossless WebP guarantees pixel identity after final QA; conversion is not a new visual edit.
 with Image.open(src) as im: im.convert('RGB').save(out,format='WEBP',lossless=True)
 dimensions(out,a)
 with Image.open(src) as before,Image.open(out) as after:
  if before.convert('RGB').tobytes()!=after.convert('RGB').tobytes():raise ValueError('Final conversion altered pixels')
 a['lock']={'sha256':digest(out),'approved_at':now(),'reviewer':args.reviewer,'final_qa':a['qa']['report']}
 a['status']='APPROVED';a['generation']['approved_attempt']=a['generation']['attempts']
 h=read(job_history(a));h['approval']=a['lock'];write(job_history(a),h)
 print('Approved and locked '+str(out))

def checkpoint(m,args):
 c=args.checkpoint
 if not args.evidence or not args.reviewer:raise ValueError('Record the human approval evidence and reviewer')
 required=CALIBRATION if c=='style_calibration' else [a['id'] for a in m['assets'] if a['category']=='npc'] if c=='character_references' else [a['id'] for a in m['assets'] if a['category']=='reference'] if c=='prop_references' else [a['id'] for a in m['assets'] if a['act']=='Rome'] if c=='first_act' else [a['id'] for a in m['assets'] if a['category']=='intel'] if c=='remaining_acts' else []
 missing=[i for i in required if not get(m,i)['lock']]
 if missing:raise ValueError('Checkpoint lacks approved images: '+', '.join(missing))
 if c=='final_integration':
  plan=read(ART/'work/integration-plan.yaml')
  if not plan['files'] or plan['blocked']:raise ValueError('Prepare a non-empty resolved integration plan first')
  m['checkpoints'][c]['plan_sha256']=digest(ART/'work/integration-plan.yaml')
 m['checkpoints'][c].update(status='APPROVED',reviewer=args.reviewer,evidence=args.evidence,at=now())

def ready(m):
 for a in m['assets']:
  if a['status'] not in ['PENDING','REFERENCE_REQUIRED','READY']:continue
  try:
   references(m,a)
   allowed=a['category']!='intel' or a['id'] in CALIBRATION or all(m['checkpoints'][k]['status']=='APPROVED' for k in (['style_calibration','character_references','prop_references']+(['first_act'] if a['act']!='Rome' else [])))
   a['status']='READY' if allowed else 'PENDING'
  except ValueError:a['status']='REFERENCE_REQUIRED'

def recover(m,a,args):
 immutable(a)
 if a['status'] not in ['GENERATING','GENERATED','TEXT_COMPOSITE','FINAL_QA','NEEDS_EDIT','NEEDS_REGENERATION']:raise ValueError('No active attempt to recover')
 if not args.reason:raise ValueError('Recovery requires an audit reason')
 h=read(job_history(a));h['rejection_reason']=args.reason;h['qa_result']='BLOCKED' if args.blocked else 'NEEDS_REGENERATION';h['ended_at']=now();write(job_history(a),h)
 if 'working_image' in a['generation']:
  src=safe(a['generation']['working_image']);dest=ART/f'rejected/{a["id"]}/{src.name}';dest.parent.mkdir(parents=True,exist_ok=True)
  if not dest.exists():shutil.copyfile(src,dest)
 a['status']=h['qa_result'];a['qa']={'status':h['qa_result'],'notes':[args.reason]}

def resolve(m,a,args):
 immutable(a)
 if a['status']!='BLOCKED':raise ValueError('Only blocked source requirements can be resolved')
 decision=read(args.decision)
 if decision.get('asset')!=a['id'] or not all(decision.get(k) for k in ['reviewer','evidence','instructions']):raise ValueError('Resolution needs asset, human reviewer, exact authorization evidence and instructions')
 decision['original_requirements']=a['text_requirements_unresolved'];decision['at']=now()
 a.setdefault('source_resolutions',[]).append(decision)
 a['exact_text']=list(dict.fromkeys(a['exact_text']+decision.get('exact_text_additions',[])))
 a['text_requirements_unresolved']=[];a['status']='REFERENCE_REQUIRED' if a['reference_ids'] else 'PENDING'
 write(ART/f'work/status/resolutions/{a["id"]}-{len(a["source_resolutions"]):03d}.yaml',decision)
 prompt(m,a)

def composite_external(m,a,args):
 immutable(a)
 if a['status']!='TEXT_COMPOSITE':raise ValueError('Visual QA must pass before compositing')
 provenance=read(args.provenance);src=safe(a['generation']['working_image'])
 if provenance.get('base_sha256')!=digest(src) or set(provenance.get('exact_text',[]))!=set(a['exact_text']) or not provenance.get('editor') or not provenance.get('notes'):raise ValueError('External composite requires matching base hash, canonical strings, editor and notes')
 incoming=Path(args.image).resolve();dimensions(incoming,a)
 out=ART/f'composite/{a["id"]}-attempt-{a["generation"]["attempts"]:03d}.webp'
 if out.exists():raise ValueError('Composite already exists')
 with Image.open(incoming) as im:im.convert('RGB').save(out,format='WEBP',lossless=True)
 a['generation']['working_image']=str(out.relative_to(ROOT));a['generation']['working_sha256']=digest(out);a['status']='FINAL_QA'
 h=read(job_history(a));h.setdefault('composites',[]).append({'at':now(),'operation':'composite','model':provenance['editor'],'provenance':provenance,'source_image':str(src.relative_to(ROOT)),'output':str(out.relative_to(ROOT)),'sha256':digest(out)});write(job_history(a),h)
 template(a,True)

def main():
 p=argparse.ArgumentParser(description=__doc__);s=p.add_subparsers(dest='cmd',required=True)
 q=s.add_parser('init');q.add_argument('--spec',required=True);q.add_argument('--repo',required=True)
 for c in ['status','validate','refresh','integration-plan','integrate','build-validate']:s.add_parser(c)
 q=s.add_parser('prompt');q.add_argument('id')
 q=s.add_parser('queue');q.add_argument('--act');q.add_argument('--status',default='READY',choices=STATES)
 q=s.add_parser('begin');q.add_argument('id');q.add_argument('--operation',choices=['generate','edit'],default='generate');q.add_argument('--instructions')
 q=s.add_parser('ingest');q.add_argument('id');q.add_argument('image')
 q=s.add_parser('qa-template');q.add_argument('id');q.add_argument('--final',action='store_true')
 q=s.add_parser('qa');q.add_argument('id');q.add_argument('report')
 q=s.add_parser('composite');q.add_argument('id');q.add_argument('layout')
 q=s.add_parser('resolve');q.add_argument('id');q.add_argument('decision')
 q=s.add_parser('composite-external');q.add_argument('id');q.add_argument('image');q.add_argument('provenance')
 q=s.add_parser('approve');q.add_argument('id');q.add_argument('--reviewer',required=True)
 q=s.add_parser('checkpoint');q.add_argument('checkpoint',choices=['style_calibration','character_references','prop_references','first_act','remaining_acts','final_integration']);q.add_argument('--reviewer',required=True);q.add_argument('--evidence',required=True)
 q=s.add_parser('recover');q.add_argument('id');q.add_argument('--reason',required=True);q.add_argument('--blocked',action='store_true')
 args=p.parse_args()
 with locked():
  if args.cmd=='init':init(args);return
  m=read(MANIFEST)
  if args.cmd=='status':report(m);print((ART/'STATUS.md').read_text());return
  if args.cmd=='validate':validate(m);return
  if args.cmd=='queue':print('\n'.join(a['id'] for a in m['assets'] if a['status']==args.status and (not args.act or a['act']==args.act)));return
  if args.cmd=='refresh':ready(m)
  elif args.cmd=='checkpoint':checkpoint(m,args)
  elif args.cmd in ['integration-plan','integrate','build-validate']:
   from integration import plan,apply,build
   {'integration-plan':plan,'integrate':apply,'build-validate':build}[args.cmd](m)
  else:
   a=get(m,args.id)
   if args.cmd=='prompt':print(prompt(m,a));return
   if args.cmd=='qa-template':template(a,args.final);return
   {'begin':begin,'ingest':ingest,'qa':qa,'composite':composite,'approve':approve,'recover':recover,'resolve':resolve,'composite-external':composite_external}[args.cmd](m,a,args)
  save(m)
if __name__=='__main__':
 try:main()
 except (ValueError,AssertionError,KeyError,FileNotFoundError) as e:print('ERROR:',e,file=sys.stderr);sys.exit(1)
