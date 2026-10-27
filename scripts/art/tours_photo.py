"""Kinneret's own street illustration for "סיורים ומפגשים" (2026-10-27): only the colours are nudged to the site palette
and the flat background is made transparent; nothing else in the picture changes. Source: her upload, kept in
/mnt/project-files/page-headers/tours_source.png. Output: public/headers/tours.webp (used by street_image() in header_cats.py)."""
import sys
import numpy as np
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/page-headers/tours_source.png'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'public/headers/tours.webp'
CROP = (20, 130, 1770, 780)  # the street and its pavement, without the empty margins

def h(c): return np.array([int(c[i:i + 2], 16) for i in (1, 3, 5)], float)
# (colour in her picture, palette colour it moves to); shades around each colour move by the same amount
ANCHORS = [
    ((172, 212, 244), h('#DDEEF6')),   # light blue walls and glass
    ((140, 188, 220), h('#8FBAD0')),   # darker blue
    ((252, 220, 132), h('#FCF0B4')),   # yellow building: the soft yellow (Kinneret 27.10 evening)
    ((28, 76, 92), h('#1C4F66')),      # dark doors, signs, lamp
    ((20, 60, 76), h('#173F52')),
    ((236, 226, 203), h('#F2E8CC')),   # pavement
    ((252, 244, 220), h('#F2E8CC')),   # cream building
    ((180, 220, 188), h('#CBEBD5')),   # light green (tree, awning) -> sage
    ((148, 196, 164), h('#E8F2B2')),   # green (potted plants) -> lime (Kinneret 27.10 evening: lime and sage)
    ((255, 255, 255), h('#FFFFFF')),
]
src = np.array([a for a, _ in ANCHORS], float); delta = np.array([b - np.array(a, float) for a, b in ANCHORS])

im = np.array(Image.open(SRC).convert('RGB').crop(CROP)).astype(float)
px = im.reshape(-1, 3)
d2 = ((px[:, None, :] - src[None]) ** 2).sum(2)
w = np.exp(-d2 / (2 * 22.0 ** 2)) + 1e-9
shift = (w[:, :, None] * delta[None]).sum(1) / w.sum(1, keepdims=True)
near = w.max(1, keepdims=True) > 1e-4          # far from every anchor (e.g. the barber pole stripes): leave as is
out = np.where(near, px + shift, px).clip(0, 255)

bg = np.array([251, 248, 240], float)
dist = np.abs(px - bg).sum(1)
alpha = ((dist - 6) / 8).clip(0, 1) * 255
rgba = np.concatenate([out, alpha[:, None]], 1).reshape(im.shape[0], im.shape[1], 4).astype(np.uint8)
Image.fromarray(rgba, 'RGBA').save(OUT, 'WEBP', quality=90, method=6)
print(OUT, rgba.shape)
