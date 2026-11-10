#!/usr/bin/env python3
"""
HOTEL YOUCEF · French and English versions, generated from the Arabic pages (the Arabic pages stay the source).

    python3 tools/build_i18n.py          (tools/build_fr.py runs the same thing)

  pages  index rooms room venues restaurant gallery contact  →  fr/<page>.html, en/<page>.html   (dir="ltr")
  data   data/*.json                                         →  data/fr/*.json, data/en/*.json
  words  tools/i18n/<lang>.json  {arabic text: translation}; every Arabic text still left is listed at the end —
         add it to the file and run again.
Also: the language switch (ع | FR | EN) in every header, hreflang alternates, canonical/og URLs, og:locale.
The JS reads <html lang> (js/main.js → LANG, LTR, BASE, tt) for its own few strings, paths and the reading direction.
"""
import json, re
import seo
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://hotelyoucefkhenchela.com/'
PAGES = ['index', 'rooms', 'room', 'venues', 'restaurant', 'gallery', 'contact']
LANGS = {'fr': {'locale': 'fr_DZ', 'name': 'Français', 'label': 'FR'},
         'en': {'locale': 'en_GB', 'name': 'English', 'label': 'EN'}}
AR = re.compile(r'[؀-ۿ]')
ISO = str.maketrans('', '', '⁦⁩')
GROUP = 'اللغة · Langue · Language'


def words(lang):
    d = {k.translate(ISO): v for k, v in json.loads((ROOT / f'tools/i18n/{lang}.json').read_text()).items()}
    return d, sorted(d, key=len, reverse=True)


def url(page, lang):
    return SITE + ('' if lang == 'ar' else f'{lang}/') + ('' if page == 'index' else f'{page}.html')


def switch(page, cur):
    """ع | FR | EN — the current one is a span, the others are links (relative, so they work on localhost too)."""
    up = '' if cur == 'ar' else '../'
    out = []
    for lang, label, name in [('ar', 'ع', 'العربية')] + [(k, v['label'], v['name']) for k, v in LANGS.items()]:
        if lang == cur:
            out.append(f'<span aria-current="true" lang="{lang}">{label}</span>')
        else:
            href = up + ('' if lang == 'ar' else f'{lang}/') + ('' if page == 'index' else f'{page}.html')  # home: the folder (/en/), never /en/index.html
            out.append(f'<a href="{href}" hreflang="{lang}" lang="{lang}" data-lang aria-label="{name}">{label}</a>')
    # phones (≤440 px): one globe button opening the three full names — <details> works without JS
    items = []
    for lang, name in [('ar', 'العربية')] + [(k, v['name']) for k, v in LANGS.items()]:
        href = up + ('' if lang == 'ar' else f'{lang}/') + ('' if page == 'index' else f'{page}.html')  # home: the folder (/en/), never /en/index.html
        items.append(f'<span aria-current="true" lang="{lang}">{name}<svg class="i" aria-hidden="true"><use href="{up}img/icons.svg#check"/></svg></span>' if lang == cur
                     else f'<a href="{href}" hreflang="{lang}" lang="{lang}" data-lang>{name}</a>')
    menu = (f'<details class="lang-m"><summary aria-label="{GROUP}"><svg class="i" aria-hidden="true"><use href="{up}img/icons.svg#globe"/></svg></summary>'
            f'<div class="lang-menu">{"".join(items)}</div></details>')
    return f'<div class="lang" role="group" aria-label="{GROUP}">{"".join(out)}</div>\n      {menu}'


def chrome(t, page, cur):
    """Language switch + hreflang, on every version (idempotent)."""
    t = re.sub(r'<div class="lang" role="group".*?</div>\s*', '', t, flags=re.S)
    t = re.sub(r'<details class="lang-m">.*?</details>\s*', '', t, flags=re.S)
    t = t.replace('<div class="header-cta">\n', '<div class="header-cta">\n      ' + switch(page, cur) + '\n', 1)
    t = re.sub(r'<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n', '', t)
    alt = ''.join(f'<link rel="alternate" hreflang="{h}" href="{url(page, h)}">\n' for h in ('ar', *LANGS)) + f'<link rel="alternate" hreflang="x-default" href="{url(page, "ar")}">\n'
    return t.replace('<meta name="theme-color"', alt + '<meta name="theme-color"', 1)


def translate(t, D, KEYS, missing):
    for k in KEYS:
        v = D[k].replace('&', '&amp;') if '<' not in D[k] else D[k]
        t = re.sub(r'([>"]\s*)' + re.escape(k) + r'(\s*[<"])', lambda m: m.group(1) + v + m.group(2), t)
    for m in re.finditer(r'>([^<>]*[؀-ۿ][^<>]*)<|"([^"<>]*[؀-ۿ][^"<>]*)"', t):
        s = (m.group(1) or m.group(2)).strip()
        if s and s not in ('ع', 'العربية', GROUP):
            missing.add(s)
    return t


def page_ltr(page, lang, D, KEYS, missing):
    t = seo.strip((ROOT / f'{page}.html').read_text())
    t = t.replace('<html lang="ar" dir="rtl">', f'<html lang="{lang}" dir="ltr">', 1)
    t = t.replace('content="ar_DZ"', f'content="{LANGS[lang]["locale"]}"')
    t = t.replace(f'href="{url(page, "ar")}"', f'href="{url(page, lang)}"', 1)  # canonical
    t = t.replace(f'property="og:url" content="{url(page, "ar")}"', f'property="og:url" content="{url(page, lang)}"')
    t = re.sub(re.escape(SITE) + r'(?=(?:rooms|room|venues|restaurant|gallery|contact)\.html|")', SITE + f'{lang}/', t)  # JSON-LD items
    t = re.sub(r'(["\s,(])(?=(?:img|js|fonts|video|data)/|styles\.css|site\.webmanifest)', r'\1../', t)  # assets live one level up
    # Latin pages read the Latin subsets: preload those instead of the Arabic ones
    t = t.replace('href="../fonts/messiri-arabic.woff2"', 'href="../fonts/cormorant-600-latin.woff2"').replace('href="../fonts/plex-400-arabic.woff2"', 'href="../fonts/plex-400-latin.woff2"')
    seen = set()
    t = re.sub(r'<link rel="preload" href="([^"]+)"[^>]*>\n', lambda m: '' if m.group(1) in seen or seen.add(m.group(1)) else m.group(0), t)
    t = chrome(t, page, lang)
    t = translate(t, D, KEYS, missing)
    # hero: under «Hotel Youcef» the Latin line would only repeat it — the Arabic name keeps the two-script identity
    t = t.replace('<span lang="en">HOTEL YOUCEF</span></h1>', '<span lang="ar" dir="rtl">فندق يوسف</span></h1>', 1)
    return seo.inject(t, page, lang)  # JSON-LD Hotel, geo + Open Graph extras


def walk(o, D, missing):
    if isinstance(o, str):
        if not AR.search(o):
            return o
        k = o.translate(ISO)
        if k in D:
            return D[k]
        missing.add(k)
        return o
    if isinstance(o, dict):
        return {k: (v if k.startswith('_') else walk(v, D, missing)) for k, v in o.items()}
    if isinstance(o, list):
        return [walk(v, D, missing) for v in o]
    return o


def main():
    for page in PAGES:
        src = ROOT / f'{page}.html'
        src.write_text(seo.inject(chrome(src.read_text(), page, 'ar'), page, 'ar'))
    report = {}
    for lang in LANGS:
        D, KEYS = words(lang)
        missing = report[lang] = set()
        (ROOT / lang).mkdir(exist_ok=True)
        (ROOT / 'data' / lang).mkdir(exist_ok=True)
        for page in PAGES:
            (ROOT / lang / f'{page}.html').write_text(page_ltr(page, lang, D, KEYS, missing))
        for f in sorted((ROOT / 'data').glob('*.json')):
            (ROOT / 'data' / lang / f.name).write_text(json.dumps(walk(json.loads(f.read_text()), D, missing), ensure_ascii=False, indent=1) + '\n')
        print(f'{lang}: {len(PAGES)} pages → {lang}/, data → data/{lang}/')
    import stamp; stamp.main()  # cache-busting for every language
    for lang, missing in report.items():
        if missing:
            print(f'{len(missing)} Arabic texts without an entry in tools/i18n/{lang}.json:')
            for s in sorted(missing):
                print('  ', s[:110])


if __name__ == '__main__':
    main()
