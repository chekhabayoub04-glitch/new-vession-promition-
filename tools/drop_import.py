#!/usr/bin/env python3
"""
HOTEL YOUCEF · hand-picked photos from img/src/drop/ → slots (img/src/<slot>.jpg), then run images.py.

    python3 tools/drop_import.py && python3 tools/images.py

Chosen by eye (see the list below). Two treatments:
  tone  — interiors / daylight: white balance + levels (tools/rooms_import.correct)
  keep  — low-key on purpose (studio dishes on dark wood, night pool): colours untouched, only sharpened
Every photo narrower than 1920 px is enlarged to 1920 (Lanczos + unsharp mask) so the big film never shows it soft.
Watermarks of the photographers (Aures Photographie, MSC) are kept as they are.
"""
import json, sys
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps

sys.path.insert(0, str(Path(__file__).parent))
from rooms_import import correct  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
DROP, SRC = ROOT / 'img/src/drop', ROOT / 'img/src'
F = '1_restaurant_cafeteria_food/restaurant and food /'
P = '2_pool/pecine/'
H = '6_hotel/'  # screenshots: 1.2 % trimmed on every side (thin dark screen edges)
PICKS = [  # slot, file, treatment, alt
    ('dish-hero', F + '476103792_3881242385477513_8424593077086761451_n.jpg', 'tone', 'بيتزا على طاولة بجانب المسبح، وواجهة فندق يوسف خلفها'),
    ('restaurant-01', F + '136081546_2768216830113413_6720973881525060254_n.jpg', 'tone', 'قاعة المطعم والطاولات مفروشة بالأحمر والأبيض'),
    ('restaurant-02', F + '125985968_2732606063674490_7289964073260116932_n.jpg', 'tone', 'طاولة مستديرة جاهزة في قاعة المطعم'),
    ('restaurant-03', F + '141819303_2781648845436878_8007197571106598474_n.jpg', 'tone', 'طاولات المطعم بين الأعمدة الرخامية'),
    ('restaurant-04', F + '141985814_2781648715436891_2311585234008988109_n.jpg', 'tone', 'طاولة لشخصين في المطعم'),
    ('restaurant-05', F + '136043690_2768217066780056_7408191414383570857_n.jpg', 'tone', 'طاولة مزيّنة أمام نافذة تطلّ على المسبح'),
    ('dish-01', F + '150585083_2796466360621793_5192768724301522470_n.jpg', 'keep', 'طبق لحم مع خضار مشوية'),
    ('dish-02', F + '149431410_2796466793955083_1080942630241079543_n.jpg', 'keep', 'سلطة بالتونة والخضار الطازجة'),
    ('dish-03', F + '150069429_2796466363955126_3088566927008535233_n.jpg', 'keep', 'طبق خضار متبّلة في صحن طويل'),
    ('dish-04', F + '150192666_2796465943955168_8211035195831041220_n.jpg', 'keep', 'طبق بالخضار والليمون'),
    ('dish-05', F + '150005055_2796465413955221_1432520728200423562_n.jpg', 'keep', 'طبق دجاج مع صلصة وخضار'),
    ('dish-06', F + '149438137_2796466717288424_8735411226278346842_n.jpg', 'keep', 'سمك مشوي بالليمون'),
    ('dish-07', F + '136963505_2771004149834681_1231251960090929926_n.jpg', 'keep', 'عصائر وكوكتيلات ملوّنة'),
    ('dish-08', F + '134936194_2765230987078664_4329699871089582229_n.jpg', 'tone', 'لحم مشوي مع البطاطا'),
    ('dining-pool-01', F + '169238352_2833234546944974_7880034737903263676_n.jpg', 'tone', 'بيتزا ومشروبات على العشب بجانب المسبح'),
    ('dining-pool-02', F + '169517514_2833234500278312_8273880023738352163_n.jpg', 'tone', 'مشروبات على طاولة بيضاء أمام المسبح'),
    ('pool-01', P + 'Hôtel illuminé au bord de la piscine.png', 'keep', 'المسبح والفندق مضاءان في الليل'),
    ('pool-02', P + '125936749_2732606900341073_6237805764045716694_n.jpg', 'keep', 'المسبح ليلاً بين أجنحة الفندق'),
    ('pool-03', P + 'Cour d’hôtel avec piscine ensoleillée.png', 'tone', 'المسبح والفناء من أعلى في يوم مشمس'),
    ('pool-04', P + '480556239_1172931437960390_8842901691854912949_n.jpg', 'tone', 'جلسات بيضاء على العشب بجانب المسبح'),
    ('hotel-01', H + 'Screenshot 2026-11-05 at 4.49.51 PM.png', 'tone', 'واجهة فندق يوسف ومدخله بالمشربيات البيضاء'),
    ('hotel-02', H + 'Screenshot 2026-11-05 at 4.52.06 PM.png', 'tone', 'بهو الاستقبال والنافورة الرخامية تحت الأروقة المنقوشة'),
    ('hotel-03', H + 'Screenshot 2026-11-05 at 4.52.50 PM.png', 'tone', 'الأروقة الدائرية والبهو من الأعلى'),
    ('hotel-04', H + 'Screenshot 2026-11-05 at 4.53.14 PM.png', 'tone', 'القبّة والأروقة من بهو الفندق'),
    ('hotel-05', H + 'Screenshot 2026-11-05 at 4.53.05 PM.png', 'tone', 'ممرّ الغرف'),
]


def treat(im, how, trim=False):
    im = ImageOps.exif_transpose(im).convert('RGB')
    if trim:
        dx, dy = round(im.width * .012), round(im.height * .012)
        im = im.crop((dx, dy, im.width - dx, im.height - dy))
    im = correct(im) if how == 'tone' else im.filter(ImageFilter.UnsharpMask(radius=1.0, percent=35, threshold=3))
    if im.width < 1920:
        im = im.resize((1920, round(im.height * 1920 / im.width)), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.4, percent=40, threshold=2))
    return im


def main():
    alts = {}
    for slot, f, how, alt in PICKS:
        src = DROP / f
        if not src.exists():  # macOS screenshot names have a narrow no-break space before «PM»
            src = next(src.parent.glob(src.name.replace(' PM', '?PM').replace(' AM', '?AM')))
        treat(Image.open(src), how, f.startswith(H)).save(SRC / f'{slot}.jpg', quality=92, subsampling=0)
        alts[slot] = alt
        print(f'{slot:15} ← {Path(f).name[:44]}  ({how})')
    (ROOT / 'tools/drop_alts.json').write_text(json.dumps(alts, ensure_ascii=False, indent=1) + '\n')


if __name__ == '__main__':
    main()
