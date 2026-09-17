"""Hand-drawn lowercase strokes for the canonical histology annotation."""
import random,math
from PIL import Image,ImageDraw,ImageFilter
GLYPHS={
'f':[[(.25,1.1),(.30,.2),(.42,-.15),(.66,-.2),(.74,-.12)],[(.04,.38),(.62,.34)]],
'o':[[(.65,.38),(.45,.22),(.17,.35),(.08,.66),(.20,.93),(.48,.99),(.70,.79),(.73,.52),(.65,.38)]],
'r':[[(.10,.98),(.20,.28),(.18,.58),(.39,.30),(.59,.25),(.70,.34)]],
'e':[[(.12,.62),(.67,.49),(.63,.29),(.37,.24),(.15,.42),(.10,.72),(.29,.97),(.57,.96),(.73,.84)]],
'i':[[(.27,.35),(.22,.84),(.30,.99),(.42,.95)],[(.32,.03),(.34,.02)]],
'g':[[(.68,.38),(.47,.25),(.21,.34),(.10,.63),(.18,.89),(.40,.98),(.63,.79),(.72,.34),(.65,1.12),(.55,1.48),(.29,1.57),(.10,1.44)]],
'n':[[(.10,.99),(.20,.31),(.15,.69),(.43,.29),(.61,.28),(.72,.49),(.65,.97)]],
'a':[[(.63,.34),(.40,.25),(.16,.40),(.09,.74),(.26,.96),(.49,.88),(.68,.37),(.61,.84),(.73,.99)]],
 't':[[(.39,-.03),(.23,.78),(.30,.99),(.53,.92)],[(.06,.35),(.64,.30)]],
 'c':[[(.67,.35),(.44,.25),(.21,.36),(.09,.64),(.19,.90),(.42,1.00),(.67,.88)]],
'—':[[(.03,.62),(1.05,.57)]]}
def draw_label(text,seed=88):
 rng=random.Random(seed);im=Image.new('L',(2600,150));d=ImageDraw.Draw(im);x=12
 for c in text:
  if c==' ':x+=43;continue
  w=37 if c=='i' else 62;h=rng.uniform(56,63);baseline=30+rng.uniform(-4,4)
  for stroke in GLYPHS[c]:
   pts=[(x+u*w+v*8,baseline+v*h) for u,v in stroke]
   # Catmull-Rom curves through control points, softly irregular pen pressure.
   ext=[pts[0]]+pts+[pts[-1]];out=[]
   for j in range(1,len(ext)-2):
    p0,p1,p2,p3=ext[j-1:j+3]
    for k in range(12):
     t=k/12;out.append(tuple(.5*((2*p1[z])+(-p0[z]+p2[z])*t+(2*p0[z]-5*p1[z]+4*p2[z]-p3[z])*t*t+(-p0[z]+3*p1[z]-3*p2[z]+p3[z])*t*t*t) for z in [0,1]))
   out.append(pts[-1]);d.line(out,fill=rng.randint(185,245),width=rng.choice([5,6,6]),joint='curve')
  x+=w*.88+rng.uniform(-2,3)
 return im.crop(im.getbbox())
