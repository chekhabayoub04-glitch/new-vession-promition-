#!/usr/bin/env python3
"""
HOTEL YOUCEF · pick the best photos from the drop folders, correct them, and wire them into the site.

    python3 tools/curate.py [--keep 10]   then   python3 tools/images.py

img/src/drop/1_restaurant_cafeteria_food → dining-NN · 2_pool → pool-NN · 3_conference_room → conference-NN\n· 4_vip_salon → vip-NN · 5_parking → parking-NN · 6_hotel → hotel-NN  (7_logo, 8_certificate: done by hand)
Score (Pillow only): sharpness (edge variance) × exposure (mid-grey, few clipped pixels) × contrast,
photos under 1000 px on the short side are dropped, near-duplicates (dHash ≤ 6 bits) keep the best one.
Writes img/src/<slot>.jpg (same gentle correction as the room photos), a contact sheet
img/src/drop/_review-<cat>.jpg (kept ✓ / dropped ✗ with the score), the slides in data/showcase.json
and the gallery items in data/gallery.json. Review the sheet, then fix alts/order in the JSON by hand.
"""
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageStat

sys.path.insert(0, str(Path(__file__).parent))
from rooms_import import correct  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
DROP, SRC = ROOT / 'img/src/drop', ROOT / 'img/src'
CATS = [  # folder, slot prefix, showcase chapter id, gallery cat, default alt, venue id (its page photos)
    ('1_restaurant_cafeteria_food', 'dining', 'dining', 'dining', 'من مطعم وكافيتيريا فندق يوسف', None),
    ('2_pool', 'pool', 'pool', 'pool', 'مسبح فندق يوسف', None),
    ('3_conference_room', 'conference', 'venues', 'events', 'قاعة المؤتمرات في فندق يوسف', 'meeting'),
    ('4_vip_salon', 'vip', 'venues', 'events', 'صالون VIP للاجتماعات', 'lounge'),
    ('5_parking', 'parking', 'hotel', 'hotel', 'موقف سيارات فندق يوسف', None),
    ('6_hotel', 'hotel', 'hotel', 'hotel', 'فندق يوسف', None),
]
EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'}


def dhash(im):
    g = im.convert('L').resize((9, 8), Image.LANCZOS).getdata()
    g = list(g)
    return sum(1 << i for i in range(64) if g[(i // 8) * 9 + i % 8] > g[(i // 8) * 9 + i % 8 + 1])


def score(im):
    s = im.copy()
    s.thumbnail((640, 640))
    l = s.convert('L')
    sharp = ImageStat.Stat(l.filter(ImageFilter.FIND_EDGES)).var[0] ** .5
    st = ImageStat.Stat(l)
    mean, contrast = st.mean[0] / 255, st.stddev[0] / 255
    h, n = l.histogram(), l.width * l.height
    clipped = (sum(h[:4]) + sum(h[-4:])) / n
    exposure = max(0.05, 1 - abs(mean - .5) * 1.6) * max(0.05, 1 - clipped * 4)
    return sharp * exposure * (.5 + min(contrast, .3) / .3 * .5)


def main():
    keep = int(sys.argv[sys.argv.index('--keep') + 1]) if '--keep' in sys.argv else 10
    show = json.loads((ROOT / 'data/showcase.json').read_text())
    gal = json.loads((ROOT / 'data/gallery.json').read_text())
    venues = json.loads((ROOT / 'data/venues.json').read_text())
    for folder, prefix, chap, cat, alt, venue in CATS:
        files = [f for f in sorted((DROP / folder).iterdir()) if f.suffix.lower() in EXTS] if (DROP / folder).exists() else []
        if not files:
            print(f'{folder}: empty')
            continue
        rows = []
        for f in files:
            im = ImageOps.exif_transpose(Image.open(f)).convert('RGB')
            small = min(im.size) < 1000
            rows.append({'f': f, 'im': im, 's': 0 if small else score(im), 'h': dhash(im), 'why': 'small' if small else ''})
        rows.sort(key=lambda r: -r['s'])
        chosen = []
        for r in rows:
            if r['why']:
                continue
            if any(bin(r['h'] ^ c['h']).count('1') <= 6 for c in chosen):
                r['why'] = 'duplicate'
            elif len(chosen) < keep:
                chosen.append(r)
            else:
                r['why'] = 'rank'
        for old in SRC.glob(f'{prefix}-[0-9][0-9].jpg'):
            old.unlink()
        slots = []
        for k, r in enumerate(chosen, 1):
            slot = f'{prefix}-{k:02d}'
            correct(r['im']).save(SRC / f'{slot}.jpg', quality=92, subsampling=0)
            slots.append(slot)
            print(f'{slot:10} ← {r["f"].name}  ({r["s"]:.0f})')
        # contact sheet
        W, H = 260, 300
        sheet = Image.new('RGB', (W * 6, H * ((len(rows) + 5) // 6)), 'white')
        d = ImageDraw.Draw(sheet)
        for i, r in enumerate(rows):
            t = r['im'].copy()
            t.thumbnail((W - 8, H - 34))
            x, y = i % 6 * W, i // 6 * H
            sheet.paste(t, (x + 4, y + 4))
            d.text((x + 6, y + H - 26), f"{'OK' if r in chosen else 'x ' + r['why']} {r['s']:.0f} {r['f'].name[:24]}", fill='black')
        sheet.save(DROP / f'_review-{prefix}.jpg', quality=80)
        # wire into the site
        ch = next(c for c in show['chapters'] if c['id'] == chap)
        ch['slides'] = [{'slot': s, 'alt': alt} for s in slots] + [x for x in ch['slides'] if not x['slot'].startswith(prefix + '-')]
        if venue:
            next(v for v in venues if v['id'] == venue)['images'] = slots[:4]
        gal['items'] = [i for i in gal['items'] if not i['slot'].startswith(prefix + '-')] + [{'slot': s, 'cat': cat, 'alt': alt} for s in slots]
    (ROOT / 'data/showcase.json').write_text(json.dumps(show, ensure_ascii=False, indent=1) + '\n')
    (ROOT / 'data/venues.json').write_text(json.dumps(venues, ensure_ascii=False, indent=1) + '\n')
    (ROOT / 'data/gallery.json').write_text(json.dumps(gal, ensure_ascii=False, indent=1) + '\n')


if __name__ == '__main__':
    main()
