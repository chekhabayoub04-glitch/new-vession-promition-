#!/usr/bin/env python3
"""
HOTEL YOUCEF · image pipeline (Phase B helper — the site itself has no build step).

Put an original photo in img/src/ named after its slot (see img/README.md),
e.g. img/src/pool.jpg, img/src/room-1-02.jpg, img/src/hall-wedding-01.png
then run:

    pip install pillow          # once (Pillow ≥ 11.2 includes AVIF)
    python3 tools/images.py

For every original it writes AVIF + WebP + JPEG at 640/960/1280/1920 px wide
(never wider than the original), plus img/<slot>.avif at full size, and records
the slot in data/images.json. The pages read data/images.json: a slot that is
listed shows the photo, a slot that is not listed shows the sand arch placeholder.
No HTML, CSS or JS needs to change.
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT, MANIFEST = ROOT / 'img/src', ROOT / 'img', ROOT / 'data/images.json'
WIDTHS = [640, 960, 1280, 1920]
EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff'}


def save(im, path, fmt):
    if fmt == 'avif':
        im.save(path, 'AVIF', quality=52, speed=6)
    elif fmt == 'webp':
        im.save(path, 'WEBP', quality=78, method=6)
    else:
        im.save(path, 'JPEG', quality=80, optimize=True, progressive=True)


def main():
    data = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    for f in sorted(SRC.iterdir()):
        if f.suffix.lower() not in EXTS:
            continue
        slot = f.stem
        im = ImageOps.exif_transpose(Image.open(f)).convert('RGB')
        w, h = im.size
        top = min(w, 1920)
        widths = [x for x in WIDTHS if x < top] + [top]  # the original width is the last step
        for x in widths:
            r = im.resize((x, round(h * x / w)), Image.LANCZOS) if x != w else im
            for fmt in ('avif', 'webp', 'jpg'):
                save(r, OUT / f'{slot}-{x}.{fmt}', fmt)
        full = im if w <= 1920 else im.resize((1920, round(h * 1920 / w)), Image.LANCZOS)
        save(full, OUT / f'{slot}.avif', 'avif')
        data[slot] = {'w': widths[-1], 'h': round(h * widths[-1] / w), 'widths': widths}
        print(f'{slot:22} {w}x{h} → {widths}')
    MANIFEST.write_text(json.dumps(dict(sorted(data.items())), ensure_ascii=False, indent=1) + '\n')
    print(f'{len(data)} slots in {MANIFEST.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
