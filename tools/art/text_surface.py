"""Deterministic, separately composited clue lettering. Does not alter source files."""
import math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
MONO='/usr/share/fonts/opentype/urw-base35/NimbusMonoPS-Regular.otf'
SCRIPT='/usr/share/fonts/opentype/urw-base35/Z003-MediumItalic.otf'
def solve(A,b):
 for i in range(len(b)):
  j=max(range(i,len(b)),key=lambda j:abs(A[j][i]));A[i],A[j]=A[j],A[i];b[i],b[j]=b[j],b[i]
  d=A[i][i];A[i]=[v/d for v in A[i]];b[i]/=d
  for j in range(len(b)):
   if j==i:continue
   d=A[j][i];A[j]=[v-d*w for v,w in zip(A[j],A[i])];b[j]-=d*b[i]
 return b

def lettering(im,text,quad,style='carbon',seed=1987):
 """Place exact text into TL,TR,BR,BL quadrilateral with surface-aware ink."""
 rng=random.Random(seed);S=3;size=60;pad=16
 font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf' if style in ('metal','plate','tiny') else MONO,size)
 advance=sum(font.getlength(c) for c in text)
 mask=Image.new('L',(int(advance+pad*2+40),110))
 x=pad
 for i,c in enumerate(text):
  char=Image.new('L',(100,110));draw=ImageDraw.Draw(char)
  jitter=2.5 if style=='hand' else 1.1
  draw.text((20,15+rng.uniform(-jitter,jitter)),c,font=font,fill=int(rng.uniform(155,240)),stroke_width=0)
  char=char.rotate(rng.uniform(-4,4) if style=='hand' else rng.uniform(-.7,.7),resample=Image.Resampling.BICUBIC)
  mask.paste(ImageChops.lighter(mask.crop((int(x)-20,0,int(x)+80,110)),char),(int(x)-20,0))
  x+=font.getlength(c)+(rng.uniform(-1.8,1.8) if style=='hand' else 0)
 box=mask.getbbox();mask=mask.crop((box[0]-3,box[1]-3,box[2]+3,box[3]+3))
 if style=='hand':
  from handwritten_label import draw_label
  mask=draw_label(text,seed)
 # Broken ribbon / rubbed paint, clustered wear, not uniformly lowered opacity.
 pix=mask.load()
 for y in range(mask.height):
  for x in range(mask.width):
   if pix[x,y]:
    wave=.80+.16*math.sin(x*.075+y*.23)
    pix[x,y]=int(pix[x,y]*wave*rng.uniform(.68,1))
 draw=ImageDraw.Draw(mask)
 for _ in range(int(mask.width/14)):
  x=rng.randrange(mask.width);y=rng.randrange(mask.height);r=rng.choice([1,1,2])
  draw.ellipse((x,y,x+r*2,y+r),fill=0)
 # Exact inverse homography, destination quadrilateral -> text mask.
 A=[];b=[]
 for (x,y),(u,v) in zip([(x*3,y*3) for x,y in quad],[(0,0),(mask.width,0),(mask.width,mask.height),(0,mask.height)]):
  A.extend([[x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]]);b.extend([u,v])
 coeff=solve(A,b)
 full=mask.transform((im.width*3,im.height*3),Image.Transform.PERSPECTIVE,coeff,Image.Resampling.BICUBIC).resize(im.size,Image.Resampling.LANCZOS)
 blur={'carbon':.32,'hand':.27,'metal':.38,'plate':.48,'tiny':.35}.get(style,.3)
 full=full.filter(ImageFilter.GaussianBlur(blur))
 box=full.getbbox();base=im.crop(box);alpha=full.crop(box);bp=base.load();ap=alpha.load()
 for y in range(base.height):
  for x in range(base.width):
   if not ap[x,y]:continue
   rgb=bp[x,y];lum=sum(rgb)/3
   # Preserve scratches, local light, paper fibers through the ink.
   ap[x,y]=min(255,int(ap[x,y]*(.95+.30*rng.random())))
 if style in ('metal','plate','tiny'):
  # Incised type picks up a faint lower edge reflection, only within the lettering.
  shine=ImageChops.offset(full,0,1);shine=ImageChops.subtract(shine,full).point(lambda v:int(v*.48))
  im.paste(Image.new('RGB',im.size,(205,185,141) if style!='plate' else (220,219,200)),(0,0),shine)
 for y in range(base.height):
  for x in range(base.width):
   a=ap[x,y]/255
   if not a:continue
   r,g,b=bp[x,y]
   if style=='carbon': ink=(r*.26,g*.24,b*.37)
   elif style=='hand':ink=(r*.16,g*.24,b*.35)
   else:ink=(r*.17,g*.17,b*.15)
   bp[x,y]=tuple(round(old*(1-a)+new*a) for old,new in zip((r,g,b),ink))
 im.paste(base,box)
 return {'text':text,'quad':quad,'style':style,'seed':seed,'font':'hand-drawn canonical glyph strokes' if style=='hand' else font.path}
