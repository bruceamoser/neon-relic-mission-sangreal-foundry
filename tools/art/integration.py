"""Reviewable, approved-only Foundry integration; no deployment assumptions."""
import html
from pathlib import Path
import os
import re
import shutil
import subprocess
from pipeline import ART,ROOT,read,write,digest,now,safe,dimensions

PREFIX='modules/neon-relic-mission-sangreal/assets/art/'

def replace_block(text,slug,change):
 pattern=re.compile(r'(?ms)^- _id: '+re.escape(slug)+r'\n.*?(?=^- _id: |\Z)')
 match=pattern.search(text)
 if not match:raise ValueError('Missing record '+slug)
 return text[:match.start()]+change(match.group())+text[match.end():]

def set_image(block,url,token=False):
 # Preserve YAML comments, descriptions and game mechanics byte-for-byte.
 if re.search(r'^  img:',block,re.M):block=re.sub(r'^  img:.*$', '  img: '+url,block,flags=re.M)
 else:block=block.replace('\n  type:', '\n  img: '+url+'\n  type:',1)
 if token:
  if re.search(r'^  prototypeToken:',block,re.M):
   if not re.search(r'^    texture:\s*\n      src:',block,re.M):raise ValueError('Unexpected prototypeToken structure; review manually')
   block=re.sub(r'(^    texture:\s*\n      src:).*',lambda m:m[1]+' '+url,block,flags=re.M)
  else:block=block.replace('\n  type:', '\n  prototypeToken:\n    texture:\n      src: '+url+'\n  type:',1)
 return block

def plan(m):
 repo=Path(m['module_repository']);stage=ART/'work/integration-stage'
 if stage.exists():shutil.rmtree(stage)
 stage.mkdir(parents=True)
 paths=['src/packs/sangreal-clues.yaml','src/packs/sangreal-npcs.yaml','src/packs/sangreal-briefs.yaml','src/packs/sangreal-relics.yaml']
 original={p:(repo/p).read_text() for p in paths};content=original.copy();files=[];blocked=[];selected=[];new=[]
 for a in m['assets']:
  if a['status']!='APPROVED' or a['category']=='reference':continue
  src=safe(a['output']['path'])
  if digest(src)!=a['lock']['sha256']:raise ValueError('Changed approved image '+a['id'])
  dimensions(src,a);mode=a['integration']['mode'];slug=a['integration']['item_id'];url=PREFIX+a['output']['path'].removeprefix('src/assets/art/')
  try:
   if mode=='npc':
    key=paths[1];content[key]=replace_block(content[key],slug,lambda b:set_image(b,url,True))
   elif mode=='existing_card':
    key=paths[0];content[key]=replace_block(content[key],slug,lambda b:set_image(b,url))
   elif mode=='detail':
    # Keep N01 as the primary I-13 image; additional detail goes into the same card's content.
    key=paths[0]
    def detail(b):
     if '    content: >' not in b:raise ValueError('Unexpected I-13 content shape')
     return b.replace('    content: >','    content: >\n      <p><img src="'+url+'" alt="Forensic neck detail" /></p>',1)
    content[key]=replace_block(content[key],slug,detail)
   elif mode=='new_card':
    key=paths[0]
    if re.search(r'^- _id: '+re.escape(slug)+r'$',content[key],re.M):raise ValueError('New-card ID already exists; review before replacing')
    draft=ART/f'integration/cards/{a["id"]}.yaml'
    if not draft.exists():raise ValueError('Missing reviewed player-facing card draft '+str(draft.relative_to(ROOT)))
    card=read(draft)
    if card['_id']!=slug or card['type']!='informationCard' or card['system']['cardId']!=a['integration']['card_id']:raise ValueError('Card draft identity mismatch')
    card['img']=url
    import yaml
    content[key]+='\n'+yaml.safe_dump([card],sort_keys=False,allow_unicode=True,width=110)
    new.append(slug)
   elif mode=='relic':
    key=paths[3];old=PREFIX+a['output']['filename'].replace('.webp','.svg')
    if old not in content[key]:raise ValueError('No matching relic image reference')
    content[key]=content[key].replace(old,url)
   else:raise ValueError('Unsupported integration mode')
  except ValueError as e:blocked.append({'asset':a['id'],'reason':str(e)});continue
  dest=stage/a['output']['path'];dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src,dest)
  target=repo/a['output']['path']
  if target.exists() and digest(target)!=digest(dest):blocked.append({'asset':a['id'],'reason':'Existing target image differs; explicit direction required'});continue
  files.append({'path':a['output']['path'],'before_sha256':digest(target) if target.exists() else None,'after_sha256':digest(dest)})
  selected.append(a['id'])
 if new:
  def append_slugs(b):
   pat=r'(^    informationCardSlugs: \[)([^\]]*)(\])'
   match=re.search(pat,b,re.M)
   if not match:raise ValueError('Unexpected informationCardSlugs representation')
   existing=[x.strip() for x in match[2].split(',')];values=existing+[x for x in new if x not in existing]
   return b[:match.start()]+match[1]+', '.join(values)+match[3]+b[match.end():]
  for slug in ['sangreal-case-board','sangreal-information-web']:content[paths[2]]=replace_block(content[paths[2]],slug,append_slugs)
 for p in paths:
  if content[p]==original[p]:continue
  dest=stage/p;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(content[p])
  files.append({'path':p,'before_sha256':digest(repo/p),'after_sha256':digest(dest)})
 result={'created_at':now(),'repository':str(repo),'assets':selected,'files':files,'blocked':blocked,
 'review':'Review staged YAML diff, player/DA separation, I-13 detail placement and all image files. Record final_integration checkpoint against this exact plan before applying.'}
 write(ART/'work/integration-plan.yaml',result)
 print(f'Integration plan: {len(selected)} approved assets, {len(files)} files, {len(blocked)} blocked. No module files changed.')

def build(m):
 repo=Path(m['module_repository']);logs=[]
 for command in [['npm','run','build'],['npm','run','validate'],['npm','run','audit']]:
  result=subprocess.run(command,cwd=repo,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
  logs.append({'command':command,'exit_code':result.returncode,'output':result.stdout})
  write(ART/'work/build-validation.yaml',{'at':now(),'repository':str(repo),'commands':logs})
  print(result.stdout)
  if result.returncode:raise ValueError('Repository check failed; inspect art/work/build-validation.yaml')

def apply(m):
 planpath=ART/'work/integration-plan.yaml';p=read(planpath);checkpoint=m['checkpoints']['final_integration']
 if checkpoint['status']!='APPROVED' or checkpoint.get('plan_sha256')!=digest(planpath):raise ValueError('Human approval of this exact integration plan required')
 if p['blocked'] or not p['files']:raise ValueError('Integration plan empty or blocked')
 repo=Path(m['module_repository']).resolve();stage=ART/'work/integration-stage'
 if Path(p['repository']).resolve()!=repo:raise ValueError('Repository changed')
 for aid in p['assets']:
  a=next(a for a in m['assets'] if a['id']==aid)
  if a['status']!='APPROVED' or digest(safe(a['output']['path']))!=a['lock']['sha256']:raise ValueError('Asset approval changed')
 for f in p['files']:
  dst=(repo/f['path']).resolve();src=(stage/f['path']).resolve()
  if not dst.is_relative_to(repo) or not src.is_relative_to(stage.resolve()):raise ValueError('Path escape')
  if (digest(dst) if dst.exists() else None)!=f['before_sha256'] or digest(src)!=f['after_sha256']:raise ValueError('Files changed since integration review: '+f['path'])
 backup=ART/('work/integration-backup-'+now().replace(':','-'));backup.mkdir(parents=True)
 write(backup/'transaction.yaml',p)
 applied=[]
 try:
  for f in p['files']:
   dst=repo/f['path'];old=backup/f['path'];old.parent.mkdir(parents=True,exist_ok=True)
   if dst.exists():shutil.copyfile(dst,old)
   dst.parent.mkdir(parents=True,exist_ok=True)
   tmp=dst.with_name(dst.name+'.art-tmp');shutil.copyfile(stage/f['path'],tmp);os.replace(tmp,dst);applied.append(f)
  build(m)
 except Exception:
  for f in reversed(applied):
   dst=repo/f['path'];old=backup/f['path']
   if old.exists():shutil.copyfile(old,dst)
   else:dst.unlink(missing_ok=True)
  write(backup/'result.yaml',{'status':'ROLLED_BACK','at':now(),'note':'Source files restored. dist may contain failed build output; rebuild before local installation.'})
  raise
 for a in m['assets']:
  if a['id'] in p['assets']:a['status']='INTEGRATED'
 write(backup/'result.yaml',{'status':'INTEGRATED','at':now()})
 print('Integration and build/validate/audit passed. Local push and in-world installer are separate environment-specific operations.')
