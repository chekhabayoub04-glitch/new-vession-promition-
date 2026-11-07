#!/usr/bin/env python3
"""
HOTEL YOUCEF · room photos: the 7 catalogue folders (img/src/rooms/) → img/src/room-<n>-<kk>.jpg (corrected), then run images.py.

    python3 tools/rooms_import.py && python3 tools/images.py

Order = the hotel's price card (TARIFS HEBERGEMENT): room-1 Single … room-7 Suite Royal.
Correction (Pillow only, gentle — the rooms' warm light and pink walls are real, not a cast):
  1. white balance: gray-world, 35 % strength, gains capped ±8 %
  2. tone: one shared levels curve (0.4 % / 99.6 % clip, 70 % strength) → contrast up, hue unchanged
  3. long edge ≤ 2560 px (Lanczos), light unsharp mask
"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps, ImageStat

ROOT = Path(__file__).resolve().parent.parent
IMG, SRC = ROOT / 'img/src/rooms', ROOT / 'img/src'

# folder, files in display order (first = card cover)
ROOMS = [
    ('05_Single', ['01_cover_lit', '02_chambre_vue', '03_coin_bureau_tv', '04_sdb_baignoire']),
    ('04_Double_Grand_Lit', ['01_cover_lit_vue', '02_lit_face', '03_coin_bureau_tv', '05_balcon_vue', '04_sdb_baignoire', '06_entree']),
    ('06_Twin', ['01_cover_chambre_vue', '02_chambre_ensemble', '03_lits_detail', '04_coin_bureau_tv', '05_balcon_vue', '06_vue_hotel_piscine', '07_sdb_baignoire']),
    ('07_Triple', ['01_cover_chambre_ensemble', '02_chambre_vue', '03_coin_assise_fenetre', '04_coin_bureau_tv', '05_sdb_baignoire']),
    ('03_Suite_Junior', ['01_cover_lit', '02_chambre_vue', '04_coin_bureau_tv', '03_dressing_coffre', '05_sdb_baignoire']),
    ('02_Suite_Senior', ['01_cover_lit', '02_salon', '03_coin_salon_lustre', '04_vue_ensemble', '05_chambre_vue_ensemble', '06_sdb_baignoire', '07_sdb_toilette']),
    ('01_Suite_Royal', ['01_cover_lit', 'Screenshot', '04_salon_fauteuil_massage', '06_salle_a_manger', '02_chambre_vue_arche', '03_salon_lustre_canapes', '07_balcon_vue', '08_sdb_baignoire', '09_sdb_vasque']),
]
SHARED = ('01_Suite_Royal', '10_commodites_the_cafe', 'room-tea')  # same tray photo in every folder


def correct(im):
    im = ImageOps.exif_transpose(im).convert('RGB')
    if max(im.size) > 2560:
        k = 2560 / max(im.size)
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    # 1. gray-world white balance, partial
    r, g, b = ImageStat.Stat(im).mean
    grey = (r + g + b) / 3
    gains = [min(1.08, max(0.92, 1 + ((grey / c) - 1) * 0.35)) for c in (r, g, b)]
    im = Image.merge('RGB', [ch.point(lambda v, k=k: min(255, round(v * k))) for ch, k in zip(im.split(), gains)])
    # 2. levels on luminance, same curve on R/G/B so hue is kept
    h = im.convert('L').histogram()
    n, acc, lo, hi = sum(h), 0, 0, 255
    for i, c in enumerate(h):
        acc += c
        if acc >= n * 0.004:
            lo = i
            break
    acc = 0
    for i in range(255, -1, -1):
        acc += h[i]
        if acc >= n * 0.004:
            hi = i
            break
    if hi - lo > 40:
        lut = [round(v + (min(255, max(0, (v - lo) * 255 / (hi - lo))) - v) * 0.7) for v in range(256)]
        im = im.point(lut * 3)
    # 3. crisp
    return im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=45, threshold=3))


def main():
    SRC.mkdir(exist_ok=True)
    jobs = [(IMG / folder, name, f'room-{n}-{k:02d}') for n, (folder, files) in enumerate(ROOMS, 1) for k, name in enumerate(files, 1)]
    jobs.append((IMG / SHARED[0], SHARED[1], SHARED[2]))
    for folder, name, slot in jobs:
        f = next(p for p in sorted(folder.glob(name + '*')) if p.suffix.lower() in {'.jpg', '.jpeg', '.png'})
        correct(Image.open(f)).save(SRC / f'{slot}.jpg', quality=92, subsampling=0)
        print(f'{slot:12} ← {folder.name}/{f.name}')


if __name__ == '__main__':
    main()
