"""
Cut the alphabet sheets into individual letters.

Saadan supplied three ransom-note alphabet sheets. Each letter sits on its own
coloured paper tile against a ruled cream background, which makes them cleanly
separable: threshold away the background, label what is left, and every letter
comes out as one blob.

Output is public/letters/<set>-<CH>.png, each a tight crop with the background
knocked out, plus letters.json describing what was found so the film can pick
a letter without guessing at filenames.

Run: python3 score/letters.py
"""

import json
import os
import string

import numpy as np
from PIL import Image
from scipy import ndimage

SHEETS = [
    # (file, how many rows the sheet is laid out in)
    ("/tmp/claude-0/ransom/5495313.jpg", "a"),
    ("/tmp/claude-0/ransom/5521798.jpg", "b"),
    ("/tmp/claude-0/ransom/5523891.jpg", "c"),
]
OUT = "public/letters"
os.makedirs(OUT, exist_ok=True)

index: dict[str, list[dict]] = {}


def background_mask(rgb: np.ndarray) -> np.ndarray:
    """
    True where the pixel is the sheet rather than a letter tile.

    The three sheets do not share a background: one is near-white, one is
    cream, and one is dark teal. So the sheet colour is taken from the border,
    which is background on all of them, and everything far from that colour is
    a tile. Testing for "pale and unsaturated" only worked on the first sheet
    and classified the whole of the dark one as foreground.
    """
    f = rgb.astype(np.float64)
    h, w = f.shape[:2]
    edge = np.concatenate(
        [
            f[:8].reshape(-1, 3),
            f[-8:].reshape(-1, 3),
            f[:, :8].reshape(-1, 3),
            f[:, -8:].reshape(-1, 3),
        ]
    )
    bg = np.median(edge, axis=0)
    dist = np.sqrt(((f - bg) ** 2).sum(axis=2))
    # Comfortably past the ruled lines, comfortably short of any tile.
    return dist < 46


for path, tag in SHEETS:
    img = Image.open(path).convert("RGB")
    rgb = np.asarray(img)
    h, w = rgb.shape[:2]

    fg = ~background_mask(rgb)
    # The ruled lines on two of the sheets are far enough off the paper
    # colour to read as foreground, and they run the full width, so they
    # bridged every tile in a row into one blob that then failed the width
    # test. An opening removes anything only a few pixels thick and leaves
    # the tiles, which are two hundred.
    fg = ndimage.binary_opening(fg, structure=np.ones((9, 9)))
    fg = ndimage.binary_closing(fg, structure=np.ones((5, 5)))

    lab, n = ndimage.label(fg)
    objs = ndimage.find_objects(lab)

    boxes = []
    for i, sl in enumerate(objs, start=1):
        if sl is None:
            continue
        ys, xs = sl
        bh, bw = ys.stop - ys.start, xs.stop - xs.start
        area = int((lab[sl] == i).sum())
        # Letters are a decent fraction of the sheet; specks and the ruling are
        # not, and neither is anything the width of the whole page.
        if bh < h * 0.045 or bw < w * 0.015 or bw > w * 0.28 or bh > h * 0.6 or area < 1800:
            continue
        boxes.append((i, ys.start, ys.stop, xs.start, xs.stop))

    if not boxes:
        print(f"{tag}: nothing found")
        continue

    # Reading order: group into rows by vertical overlap, then sort each row
    # left to right. The sheets are laid out A-Z in rows.
    boxes.sort(key=lambda b: b[1])
    rows: list[list[tuple]] = []
    for b in boxes:
        placed = False
        for row in rows:
            ref = row[0]
            if b[1] < (ref[1] + ref[2]) / 2 < b[2]:
                row.append(b)
                placed = True
                break
        if not placed:
            rows.append([b])
    for row in rows:
        row.sort(key=lambda b: b[3])

    ordered = [b for row in rows for b in row]
    names = list(string.ascii_uppercase)
    written = []

    # Identity here comes from reading order, so a short count does not mean
    # a few missing letters: it means every letter after the gap is named
    # wrong. Better to reject the sheet than to spell words with the wrong
    # glyphs.
    if len(ordered) != len(names):
        print(f"{tag}: found {len(ordered)} blobs, expected {len(names)} - skipped")
        continue

    for k, (i, y0, y1, x0, x1) in enumerate(ordered[: len(names)]):
        ch = names[k]
        crop = rgb[y0:y1, x0:x1]
        mask = (lab[y0:y1, x0:x1] == i).astype(np.uint8) * 255
        # A one-pixel feather, so the cut edge is not aliased hard against
        # whatever it is laid on in the film.
        alpha = Image.fromarray(mask).filter(
            __import__("PIL.ImageFilter", fromlist=["ImageFilter"]).GaussianBlur(0.6)
        )
        out = np.dstack([crop, np.asarray(alpha)])
        name = f"{tag}-{ch}.png"
        Image.fromarray(out, mode="RGBA").save(os.path.join(OUT, name))
        # Dimensions travel with the entry: the film lays letters out by
        # aspect ratio, and it cannot measure an image it has not loaded.
        index.setdefault(ch, []).append({"file": name, "w": int(x1 - x0), "h": int(y1 - y0)})
        written.append(ch)

    print(f"{tag}: {len(written)} letters ({written[0]}..{written[-1]}) from {len(ordered)} blobs")

with open(os.path.join(OUT, "index.json"), "w") as f:
    json.dump(index, f, indent=1, sort_keys=True)

print(f"index: {len(index)} distinct characters, {sum(len(v) for v in index.values())} files")
