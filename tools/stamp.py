#!/usr/bin/env python3
"""
HOTEL YOUCEF · cache-busting: every CSS/JS URL gets ?v=<hash of the CSS+JS content>.

    python3 tools/stamp.py        (tools/build_i18n.py runs it at the end)

A browser that kept an old main.js would run it with a new hero.js (French pages need the new one: wrong paths,
the film never plays). With ?v= the URLs change whenever the code changes, so old and new never mix:
  - <link href="styles.css?v=…">, <script src="js/x.js?v=…"> in every page (root, fr/, en/)
  - import … from './main.js?v=…' inside the modules (one URL per module, so it still runs once)
  - data/*.json: js/main.js fetches them with ?v=<hash of all JSON> (const DV)
"""
import hashlib, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
V = re.compile(r'\?v=[0-9a-f]+')


def main():
    js = sorted((ROOT / 'js').glob('*.js'))
    h = hashlib.sha1()
    for f in [ROOT / 'styles.css', *js]:
        h.update(V.sub('', f.read_text()).encode())
    v = h.hexdigest()[:8]
    dh = hashlib.sha1()
    for f in sorted((ROOT / 'data').rglob('*.json')):
        dh.update(f.read_bytes())
    dv = dh.hexdigest()[:8]
    m = ROOT / 'js/main.js'
    m.write_text(re.sub(r"const DV = '\?v=[0-9a-f]+'", f"const DV = '?v={dv}'", m.read_text()))
    for f in js:
        t = f.read_text()
        t2 = re.sub(r"(from '\./[a-z]+\.js)(?:\?v=[0-9a-f]+)?'", rf"\1?v={v}'", t)
        if t2 != t: f.write_text(t2)
    pages = list(ROOT.glob('*.html')) + [f for d in ('fr', 'en') for f in (ROOT / d).glob('*.html')]
    for f in pages:
        t = f.read_text()
        t2 = re.sub(r'((?:\.\./)?(?:styles\.css|js/[a-z]+\.js))(?:\?v=[0-9a-f]+)?"', rf'\1?v={v}"', t)
        if t2 != t: f.write_text(t2)
    print('stamp', v, 'data', dv, '→', len(js), 'modules,', len(pages), 'pages')


if __name__ == '__main__':
    main()
