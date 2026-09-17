"""Safety and lifecycle tests use synthetic solid images only in temporary directories."""
import argparse
import copy
import importlib
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from PIL import Image
import pipeline as p
from catalog import extract

SPEC=(p.ART/'spec/intel-art-prompts.md').read_text()
REPOSITORY=Path(p.read(p.MANIFEST)['module_repository'])
class CatalogTests(unittest.TestCase):
 def test_complete_independent_source_inventory(self):
  assets,bible=extract(SPEC)
  self.assertEqual(len(assets),72)
  self.assertEqual(sum(a['category']=='npc' for a in assets),16)
  self.assertEqual(sum(a['category']=='relic' for a in assets),3)
  self.assertEqual(sum(a['category']=='intel' for a in assets),43)
  for prefix,count in [('R',10),('G',6),('Z',8),('T',6),('N',7),('V',6)]:
   self.assertEqual({a['id'] for a in assets if a['id'].startswith(prefix)},{f'{prefix}{n:02d}' for n in range(1,count+1)})
  self.assertEqual(len(bible['characters']),16)
  self.assertEqual(len(bible['medium_recipes']),9)
 def test_optional_and_detail(self):
  assets,_=extract(SPEC);m={'assets':assets}
  self.assertEqual(sum(a['optional'] for a in assets),4)
  self.assertEqual(p.get(m,'N02')['integration']['mode'],'detail')
  self.assertEqual(p.get(m,'N01')['integration']['item_id'],'sangreal-ic13')
  self.assertEqual(p.get(m,'N02')['integration']['item_id'],'sangreal-ic13')
 def test_eggs_and_text(self):
  assets,_=extract(SPEC);m={'assets':assets}
  self.assertEqual(len(p.get(m,'R01')['eggs']),4)
  self.assertEqual(len(p.get(m,'G01')['eggs']),4)
  self.assertEqual(len(p.get(m,'V05')['eggs']),4)
  self.assertIn('…SPECIMEN MUST BE FLOWN TO CARPATHIAN FACILITY… PROTECT THE BLOODLINE',p.get(m,'N04')['exact_text'])
  self.assertTrue(p.get(m,'N02')['text_requirements_unresolved'])
 def test_character_blocks(self):
  _,b=extract(SPEC)
  self.assertTrue(b['characters']['ghiberti'].startswith('Italian priest, 55'))
  self.assertTrue(b['characters']['watcher'].startswith('utterly forgettable man'))
  self.assertIn('Swiss man, 62',b['characters']['hausmann']['before'])

class LifecycleTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name)
  self.patch=patch.multiple(p,ROOT=self.root,ART=self.root/'art',MANIFEST=self.root/'art/art-manifest.yaml');self.patch.start()
  (p.ART/'spec').mkdir(parents=True);(p.ART/'spec/intel-art-prompts.md').write_text(SPEC)
  p.init(argparse.Namespace(spec=str(p.ART/'spec/intel-art-prompts.md'),repo=str(self.root/'repo')))
  self.m=p.read(p.MANIFEST);self.a=p.get(self.m,'R03')
 def tearDown(self):self.patch.stop();self.tmp.cleanup()
 def begin(self):p.begin(self.m,self.a,argparse.Namespace(operation='generate',instructions=None))
 def generated(self):
  self.begin();src=self.root/'fixture.png';Image.new('RGB',(1536,1024),'grey').save(src)
  p.ingest(self.m,self.a,argparse.Namespace(image=str(src)))
 def qa(self,stage,decision='APPROVED',fail=None):
  if stage=='final':p.template(self.a,True)
  path=p.ART/f'qa/R03-attempt-001{"-final" if stage=="final" else ""}.yaml';q=p.read(path)
  q.update(inspected_visually=True,reviewer='synthetic test fixture; not production QA',inspected_at=p.now(),overall=decision)
  for group in ['eggs','checks','exact_text']:
   for v in q[group].values():v.update(status='PASS',notes='Synthetic test fixture assertion only')
  if fail:q['eggs'][fail]['status']='FAIL'
  p.write(path,q);p.qa(self.m,self.a,argparse.Namespace(report=str(path)))
 def test_roundtrip_and_immutable(self):
  self.generated();self.qa('visual');self.assertEqual(self.a['status'],'FINAL_QA')
  with self.assertRaises(ValueError):p.approve(self.m,self.a,argparse.Namespace(reviewer='test'))
  self.qa('final');p.approve(self.m,self.a,argparse.Namespace(reviewer='test'))
  self.assertEqual(self.a['status'],'APPROVED')
  with self.assertRaises(ValueError):self.begin()
 def test_cannot_approve_uninspected(self):
  self.generated();path=p.ART/'qa/R03-attempt-001.yaml'
  with self.assertRaises(ValueError):p.qa(self.m,self.a,argparse.Namespace(report=str(path)))
 def test_missing_egg_rejected(self):
  self.generated()
  with self.assertRaises(ValueError):self.qa('visual',fail='R03-E1')
 def test_stale_image_qa_rejected(self):
  self.generated();self.qa('visual');self.qa('final')
  Image.new('RGB',(1536,1024),'black').save(p.safe(self.a['generation']['working_image']))
  with self.assertRaises(ValueError):p.approve(self.m,self.a,argparse.Namespace(reviewer='test'))
 def test_references_and_mass_gate(self):
  self.a=p.get(self.m,'R01')
  with self.assertRaises(ValueError):self.begin()
  self.a=p.get(self.m,'R07')
  with self.assertRaises(ValueError):self.begin()
 def test_failed_work_preserved_and_edit(self):
  self.generated();self.qa('visual',decision='NEEDS_EDIT',fail='R03-E1')
  self.assertTrue((p.ART/'rejected/R03/attempt-001.png').exists())
  with self.assertRaises(ValueError):self.begin()
  p.begin(self.m,self.a,argparse.Namespace(operation='edit',instructions='Correct only sulfur residue.'))
  self.assertEqual(self.a['generation']['attempts'],2)
  self.assertNotIn('final_pass',self.a['qa'])
 def test_path_traversal_and_dimensions(self):
  with self.assertRaises(ValueError):p.safe('../outside')
  src=self.root/'square.png';Image.new('RGB',(1024,1024)).save(src)
  with self.assertRaises(ValueError):p.dimensions(src,self.a)
 def test_idempotent_init(self):
  with self.assertRaises(ValueError):p.init(argparse.Namespace(spec=str(p.ART/'spec/intel-art-prompts.md'),repo='x'))
 def test_pending_checkpoint(self):
  with self.assertRaises(ValueError):p.checkpoint(self.m,argparse.Namespace(checkpoint='style_calibration',reviewer='test',evidence='test'))
 def test_source_drift(self):
  (p.ART/'spec/intel-art-prompts.md').write_text(SPEC+'changed')
  with self.assertRaises(ValueError):self.begin()
 def test_empty_integration(self):
  import integration as it
  repo=self.root/'repo';(repo/'src/packs').mkdir(parents=True)
  for f in ['clues','npcs','briefs','relics']:(repo/f'src/packs/sangreal-{f}.yaml').write_text('[]\n')
  with patch.multiple(it,ART=p.ART,ROOT=p.ROOT):
   it.plan(self.m)
   plan=p.read(p.ART/'work/integration-plan.yaml');self.assertFalse(plan['files'])
   with self.assertRaises(ValueError):it.apply(self.m)
 def test_exact_text_rejects_invented_wording(self):
  self.generated();self.a['status']='TEXT_COMPOSITE';self.a['exact_text']=['CANONICAL']
  layout=self.root/'layout.yaml';p.write(layout,{'image_sha256':self.a['generation']['working_sha256'],'layers':[{'text':'INVENTED'}]})
  with self.assertRaises(ValueError):p.composite(self.m,self.a,argparse.Namespace(layout=str(layout)))

class IntegrationTests(LifecycleTests):
 def setup_repo(self):
  import shutil
  repo=self.root/'repo';(repo/'src/packs').mkdir(parents=True)
  source=REPOSITORY
  for name in ['clues','npcs','briefs','relics']:shutil.copyfile(source/f'src/packs/sangreal-{name}.yaml',repo/f'src/packs/sangreal-{name}.yaml')
  self.generated();self.qa('visual');self.qa('final');p.approve(self.m,self.a,argparse.Namespace(reviewer='test'))
  return repo
 def test_existing_card_and_actor_content_preserved(self):
  import integration as it
  repo=self.setup_repo();before=p.read(repo/'src/packs/sangreal-clues.yaml')
  with patch.multiple(it,ART=p.ART,ROOT=p.ROOT):
   it.plan(self.m)
   p.checkpoint(self.m,argparse.Namespace(checkpoint='final_integration',reviewer='synthetic test',evidence='synthetic reviewed plan'))
   with patch.object(it,'build') as build:it.apply(self.m);build.assert_called_once()
  after=p.read(repo/'src/packs/sangreal-clues.yaml')
  expected=copy.deepcopy(before);expected[0]['img']='modules/neon-relic-mission-sangreal/assets/art/intel/i01-vault-altar-forensic.webp'
  self.assertEqual(after,expected);self.assertEqual(self.a['status'],'INTEGRATED')
 def test_changed_review_plan_blocked(self):
  import integration as it
  repo=self.setup_repo()
  with patch.multiple(it,ART=p.ART,ROOT=p.ROOT):
   it.plan(self.m);p.checkpoint(self.m,argparse.Namespace(checkpoint='final_integration',reviewer='test',evidence='test'))
   target=repo/'src/packs/sangreal-clues.yaml';target.write_text(target.read_text()+'# Concurrent edit\n')
   with self.assertRaises(ValueError):it.apply(self.m)
   self.assertIn('Concurrent edit',target.read_text())
 def test_build_failure_rolls_back_sources(self):
  import integration as it
  repo=self.setup_repo();target=repo/'src/packs/sangreal-clues.yaml';before=target.read_bytes()
  with patch.multiple(it,ART=p.ART,ROOT=p.ROOT):
   it.plan(self.m);p.checkpoint(self.m,argparse.Namespace(checkpoint='final_integration',reviewer='test',evidence='test'))
   with patch.object(it,'build',side_effect=ValueError('synthetic validation failure')):
    with self.assertRaises(ValueError):it.apply(self.m)
  self.assertEqual(target.read_bytes(),before);self.assertEqual(self.a['status'],'APPROVED')
  self.assertFalse((repo/self.a['output']['path']).exists())

if __name__=='__main__':unittest.main()
