"""
Otto's clipping.

The film is drawings; Otto is a photograph. A photograph in a newspaper is
not a greyed-down picture, it is a screen of dots on rough paper, and the
difference is the whole reason the clipping reads as a clipping. So the
screen is baked into the asset at high resolution rather than faked with a
blur filter at render time.

Source: a photograph of Dr. Osman Gültekin, supplied by Saadan.
Run: python3 score/halftone.py <source.png>  ->  public/otto.png
"""

import sys

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

SRC = sys.argv[1] if len(sys.argv) > 1 else "/tmp/claude-0/otto-src-0-0.png"

# Head and shoulders, the way a paper crops a portrait.
CROP = (96, 2, 428, 296)
# The screen is drawn far larger than it will be shown, so the dots stay
# crisp when the clipping is scaled up in frame.
OUT_W = 1400
# Cell size of the imaginary press. Larger is coarser and more obviously
# newsprint; this is about right for a broadsheet photograph.
CELL = 7.0
ANGLE = 45.0

img = Image.open(SRC).convert("L").crop(CROP)
scale = OUT_W / img.width
img = img.resize((OUT_W, int(img.height * scale)), Image.LANCZOS)

# Newsprint has a short tonal range: the blacks plug and the whites blow out.
img = ImageEnhance.Contrast(img).enhance(1.35)
img = ImageEnhance.Brightness(img).enhance(1.06)
img = img.filter(ImageFilter.UnsharpMask(radius=3, percent=110, threshold=2))

a = np.asarray(img, dtype=np.float64) / 255.0
h, w = a.shape

# The screen: a grid rotated off the horizontal, one dot per cell, its radius
# set by how dark that cell is. Rotating it is what stops the dots reading as
# a digital artefact.
yy, xx = np.mgrid[0:h, 0:w].astype(np.float64)
th = np.radians(ANGLE)
u = xx * np.cos(th) + yy * np.sin(th)
v = -xx * np.sin(th) + yy * np.cos(th)

cu = np.floor(u / CELL) + 0.5
cv = np.floor(v / CELL) + 0.5
du = u / CELL - cu
dv = v / CELL - cv
dist = np.hypot(du, dv)

# Cell tone, sampled at the cell centre rather than per pixel, so every dot in
# a cell agrees about how big it should be.
cx = np.clip((cu * CELL * np.cos(th) - cv * CELL * np.sin(th)).astype(int), 0, w - 1)
cy = np.clip((cu * CELL * np.sin(th) + cv * CELL * np.cos(th)).astype(int), 0, h - 1)
tone = a[cy, cx]

radius = np.sqrt(np.clip(1.0 - tone, 0, 1)) * 0.62
ink = dist < radius

# Slight softness at the dot edge: ink spreads into paper, it does not stop.
out = np.where(ink, 0.10, 0.96)
out = (
    np.asarray(
        Image.fromarray((out * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)),
        dtype=np.float64,
    )
    / 255.0
)

# Print it on paper rather than on white: warm, uneven, and slightly foxed.
rng = np.random.default_rng(11)
fibre = rng.normal(0, 0.022, (h, w))
sheet = np.clip(out + fibre, 0, 1)

paper = np.stack(
    [
        np.clip(sheet * 0.94 + 0.06, 0, 1) * 232,
        np.clip(sheet * 0.95 + 0.05, 0, 1) * 224,
        np.clip(sheet * 0.97 + 0.03, 0, 1) * 199,
    ],
    axis=-1,
).astype(np.uint8)

Image.fromarray(paper).save("public/otto.png")
print(f"public/otto.png  {w}x{h}  cell {CELL}px @ {ANGLE:.0f}deg")
