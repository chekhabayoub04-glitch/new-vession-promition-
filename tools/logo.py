#!/usr/bin/env python3
"""
HOTEL YOUCEF · official logo → clean web assets.

    python3 tools/logo.py img/src/drop/7_logo/<logo>.png

1. alpha: drop specks (components < 400 px) and the faint haze (alpha < 24)
2. defringe: edge pixels (alpha < 235) recoloured from the logo's own gold ramp, so no red halo on dark backgrounds
3. trim, then write
   img/logo.png / .webp       full logo (crest + stars + HOTEL YOUCEF), 900 px wide
   img/logo-crest.png / .webp crest only (shield + laurel), 512 px — header, loader, footer
   img/apple-touch-icon.png   180 px crest on black · img/icon-512.png · img/favicon-32.png
   prints the gold palette sampled from the shield
"""
import sys
from collections import deque
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'img'


def clean(im):
    a = np.array(im.convert('RGBA')).astype(np.float32)
    al = a[..., 3]
    al[al < 24] = 0
    mask = al > 40
    h, w = mask.shape
    seen = np.zeros_like(mask)
    for y0, x0 in zip(*np.nonzero(mask)):
        if seen[y0, x0]:
            continue
        q, comp = deque([(y0, x0)]), [(y0, x0)]
        seen[y0, x0] = True
        while q:
            y, x = q.popleft()
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    q.append((ny, nx)); comp.append((ny, nx))
        if len(comp) < 400:
            ys, xs = zip(*comp)
            al[list(ys), list(xs)] = 0
    # pixels near a dropped speck that were under the 40 threshold
    keep = np.zeros_like(mask)
    keep[seen & (al > 0)] = True
    from PIL import ImageFilter
    grow = np.array(Image.fromarray((keep * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 0
    al[~grow] = 0
    # defringe with the gold ramp sampled from solid pixels
    rgb = a[..., :3]
    solid = (al > 250)
    lum = rgb @ np.array([.299, .587, .114])
    gold = solid & (rgb[..., 0] > rgb[..., 2] + 60) & (lum > 60)
    idx = np.clip(lum[gold].astype(int), 0, 255)
    ramp = np.zeros((256, 3)); cnt = np.zeros(256)
    np.add.at(ramp, idx, rgb[gold]); np.add.at(cnt, idx, 1)
    known = cnt > 0
    for c in range(3):
        ramp[:, c] = np.interp(np.arange(256), np.nonzero(known)[0], ramp[known, c] / cnt[known])
    edge = (al > 0) & (al < 235)
    li = np.clip(lum[edge].astype(int), 0, 255)
    rgb[edge] = ramp[li]
    a[..., 3] = al
    out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGBA')
    return out.crop(out.getbbox()), rgb[gold]


def main(src):
    im, golds = clean(Image.open(src))
    w, h = im.size
    full = im.resize((900, round(h * 900 / w)), Image.LANCZOS)
    full.save(OUT / 'logo.png', optimize=True); full.save(OUT / 'logo.webp', quality=90, method=6)
    # crest = everything above the stars (first fully empty band below 45 % of the height)
    al = np.array(im.getchannel('A')) > 0
    rows = al.any(axis=1)
    cut = next(y for y in range(int(h * .45), h) if not rows[y])
    crest = im.crop((0, 0, w, cut)); crest = crest.crop(crest.getbbox())
    cw, ch = crest.size
    c512 = crest.resize((512, round(ch * 512 / cw)), Image.LANCZOS)
    c512.save(OUT / 'logo-crest.png', optimize=True); c512.save(OUT / 'logo-crest.webp', quality=90, method=6)
    for size, name, bg in ((180, 'apple-touch-icon.png', (17, 14, 10, 255)), (512, 'icon-512.png', (17, 14, 10, 255)), (32, 'favicon-32.png', (0, 0, 0, 0))):
        tile = Image.new('RGBA', (size, size), bg)
        pad = round(size * (.12 if bg[3] else .02)); box = size - 2 * pad
        c = crest.copy(); c.thumbnail((box, box), Image.LANCZOS)
        tile.alpha_composite(c, ((size - c.width) // 2, (size - c.height) // 2))
        tile.save(OUT / name, optimize=True)
    q = np.percentile(golds, [10, 35, 60, 85, 97], axis=0).astype(int)
    print('crest', c512.size, 'logo', full.size)
    print('gold ramp (dark→light):', ['#%02X%02X%02X' % tuple(x) for x in q])


if __name__ == '__main__':
    main(sys.argv[1])
