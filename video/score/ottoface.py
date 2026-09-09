"""
Otto's head.

Otto is a collage: a tall man cut from paper with a photographed face pasted
onto the head. Saadan cut the face out himself, so this follows his cut rather
than imposing one — the alpha is simply wherever the page is not white, very
lightly feathered.

The screen is a magazine's rather than a broadsheet's: finer, and angled off
the horizontal so the dots read as texture and not as a grid.

Source: a photograph of Dr. Osman Gültekin, used with his consent.
Run: python3 score/ottoface.py  ->  public/otto-face.png
"""

import numpy as np
import pymupdf
from PIL import Image, ImageEnhance, ImageFilter

SRC = "/root/.claude/uploads/70379a78-53df-5489-8836-71c3a5e391ce/358940df-642bc4036c5d489d86ece6f3ab24c264.pdf"
CELL = 3.1
ANGLE = 15.0

doc = pymupdf.open(SRC)
# 150dpi, not 400. The photograph inside this pdf is only 442px wide, so a
# 400dpi render is a four-times upscale of soft data, and screening soft data
# plugs every midtone into mud. This is close to the real detail.
pm = doc[0].get_pixmap(dpi=150)
page = Image.frombytes("RGB", (pm.width, pm.height), pm.samples)

# His cut is the silhouette: everything that is not the white of the page.
arr = np.asarray(page).astype(np.float64)
ink = arr.min(axis=2) < 233
ys, xs = np.where(ink)
if len(ys) == 0:
    raise SystemExit("nothing on the page")
pad = 8
y0, y1 = max(0, ys.min() - pad), min(page.height, ys.max() + pad)
x0, x1 = max(0, xs.min() - pad), min(page.width, xs.max() + pad)

face = page.crop((x0, y0, x1, y1))
mask = Image.fromarray((ink[y0:y1, x0:x1] * 255).astype(np.uint8))

grey = ImageEnhance.Contrast(face.convert("L")).enhance(1.18)
grey = ImageEnhance.Brightness(grey).enhance(1.08)
grey = grey.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=2))

a = np.asarray(grey, dtype=np.float64) / 255.0
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

# Smaller maximum dot: the midtones have to stay open or the face closes up.
dots = dist < np.sqrt(np.clip(1.0 - tone, 0, 1)) * 0.56
screen = np.where(dots, 0.14, 0.965)
screen = (
    np.asarray(
        Image.fromarray((screen * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.5)),
        dtype=np.float64,
    )
    / 255.0
)

rng = np.random.default_rng(23)
sheet = np.clip(screen + rng.normal(0, 0.018, (h, w)), 0, 1)
rgb = np.stack([sheet * 238, sheet * 232, sheet * 214], axis=-1).astype(np.uint8)

# A hair of feather so the cut edge is not aliased against the paper it is
# laid on, and nothing more: the shape of the cut is his.
alpha = np.asarray(mask.filter(ImageFilter.GaussianBlur(1.1)), dtype=np.uint8)

Image.fromarray(np.dstack([rgb, alpha]), mode="RGBA").save("public/otto-face.png")
print(f"public/otto-face.png  {w}x{h}  cell {CELL}px @ {ANGLE:.0f}deg")
