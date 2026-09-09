"""
Otto's head.

Otto is not a newspaper page in the film, he is a figure: a tall man cut from
paper with a photographed face scissored out and pasted onto the head. So what
this makes is the pasted piece — a head-shaped cut with a real edge and
nothing outside it.

The face keeps a magazine screen on it, coarser than a broadsheet's because a
magazine is printed better and the cut is smaller, so the dots read as texture
rather than as pattern.

Source: a photograph of Dr. Osman Gültekin, used with his consent.
Run: python3 score/ottoface.py  ->  public/otto-face.png
"""

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

SRC = "/tmp/claude-0/otto-src-0-0.png"
# Head only: brow to chin, ear to ear, with a little of the collar.
CROP = (168, 2, 348, 196)
OUT_W = 900
CELL = 4.6
ANGLE = 15.0

img = Image.open(SRC).convert("L").crop(CROP)
img = img.resize((OUT_W, int(img.height * OUT_W / img.width)), Image.LANCZOS)
img = ImageEnhance.Contrast(img).enhance(1.28)
img = ImageEnhance.Brightness(img).enhance(1.1)
img = img.filter(ImageFilter.UnsharpMask(radius=3, percent=130, threshold=2))

a = np.asarray(img, dtype=np.float64) / 255.0
h, w = a.shape

yy, xx = np.mgrid[0:h, 0:w].astype(np.float64)
th = np.radians(ANGLE)
u = xx * np.cos(th) + yy * np.sin(th)
v = -xx * np.sin(th) + yy * np.cos(th)
cu = np.floor(u / CELL) + 0.5
cv = np.floor(v / CELL) + 0.5
dist = np.hypot(u / CELL - cu, v / CELL - cv)
cx = np.clip((cu * CELL * np.cos(th) - cv * CELL * np.sin(th)).astype(int), 0, w - 1)
cy = np.clip((cu * CELL * np.sin(th) + cv * CELL * np.cos(th)).astype(int), 0, h - 1)
tone = a[cy, cx]

ink = dist < np.sqrt(np.clip(1.0 - tone, 0, 1)) * 0.60
screen = np.where(ink, 0.12, 0.95)
screen = (
    np.asarray(
        Image.fromarray((screen * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.55)),
        dtype=np.float64,
    )
    / 255.0
)

rng = np.random.default_rng(23)
sheet = np.clip(screen + rng.normal(0, 0.02, (h, w)), 0, 1)
rgb = np.stack([sheet * 236, sheet * 230, sheet * 212], axis=-1).astype(np.uint8)

# The cut. A head scissored out of a page is an oval that the hand did not
# quite hold: it wanders, and it leaves a sliver of the page all round.
cxm, cym = w * 0.5, h * 0.52
rx, ry = w * 0.455, h * 0.485
ang = np.arctan2(yy - cym, xx - cxm)
wobble = (
    1.0
    + 0.030 * np.sin(ang * 5 + 0.7)
    + 0.022 * np.sin(ang * 9 + 2.1)
    + 0.014 * np.sin(ang * 14 + 4.3)
)
r = np.hypot((xx - cxm) / (rx * wobble), (yy - cym) / (ry * wobble))
alpha = np.clip((1.0 - r) * 26 + 0.5, 0, 1)

out = np.dstack([rgb, (alpha * 255).astype(np.uint8)])
Image.fromarray(out, mode="RGBA").save("public/otto-face.png")
print(f"public/otto-face.png  {w}x{h}  cell {CELL}px @ {ANGLE:.0f}deg")
