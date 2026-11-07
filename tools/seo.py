#!/usr/bin/env python3
"""
HOTEL YOUCEF · search & social tags, written into the HTML at build time (tools/build_i18n.py calls inject()).

  Schema.org JSON-LD «Hotel» (index + contact): what Google Search / Google Maps read — name, address, geo, phone,
      fax, email, star rating, rooms + prices (Offers), check-in/out, halls with capacity, amenities, pets, languages.
      Static HTML on purpose: Facebook, Bing and AI crawlers do not run JavaScript.
  Local SEO meta (every page): geo.region / geo.placename / geo.position / ICBM.
  Open Graph extras (every page, read by Facebook, WhatsApp, Messenger, LinkedIn): image size + alt, the other two locales.
Only facts from data/*.json — a null is left out, never guessed. Social profiles go in data/site.json → sameAs.
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://chekhabayoub04-glitch.github.io/new-vession-promition-/'
LOCALE = {'ar': 'ar_DZ', 'fr': 'fr_DZ', 'en': 'en_GB'}
NAME = {'ar': 'فندق يوسف', 'fr': 'Hôtel Youcef', 'en': 'Hotel Youcef'}
PLACE = {'ar': ('الحامة', 'خنشلة'), 'fr': ('El Hamma', 'Khenchela'), 'en': ('El Hamma', 'Khenchela')}
OG_ALT = {'ar': 'فندق يوسف في ولاية خنشلة', 'fr': 'L\'Hôtel Youcef, wilaya de Khenchela', 'en': 'Hotel Youcef, Khenchela Province'}
ISO = str.maketrans('', '', '⁦⁩')
BLOCK = re.compile(r'<script type="application/ld\+json" data-seo="hotel">.*?</script>\n', re.S)
EXTRA = re.compile(r'<meta (?:name="(?:geo\.[a-z]+|ICBM)"|property="og:(?:image:(?:width|height|alt)|locale:alternate)") content="[^"]*">\n')


def data(name, lang):
    return json.loads((ROOT / 'data' / ('' if lang == 'ar' else lang) / f'{name}.json').read_text())


def strip(t):
    return EXTRA.sub('', BLOCK.sub('', t))


def hotel(lang):
    s, rooms, venues, imgs = data('site', lang), data('rooms', lang), data('venues', lang), data('images', 'ar')
    base = SITE + ('' if lang == 'ar' else f'{lang}/')
    town, region = PLACE[lang]
    jpg = lambda k: f'{SITE}img/{k}-{imgs[k]["widths"][-1]}.jpg'
    prices = [r['priceFrom'] for r in rooms if r.get('priceFrom')]
    cap = lambda v: max(map(int, re.findall(r'\d+', (v or '').translate(ISO))), default=None)
    o = {
        '@context': 'https://schema.org', '@type': 'Hotel', '@id': SITE + '#hotel',
        'name': NAME[lang], 'alternateName': ['HOTEL YOUCEF', 'فندق يوسف', 'Hôtel Youcef'],
        'url': base, 'logo': SITE + 'img/logo.png',
        'image': [jpg(k) for k in ('hotel-06', 'hotel-01', 'hotel-02', 'pool-01', 'hotel-04') if k in imgs],
        'telephone': s.get('phoneE164'), 'faxNumber': s.get('faxE164'), 'email': s.get('email'),
        'address': {'@type': 'PostalAddress', 'streetAddress': town, 'addressLocality': town, 'postalCode': '40016', 'addressRegion': region, 'addressCountry': 'DZ'},
        'geo': {'@type': 'GeoCoordinates', 'latitude': s['lat'], 'longitude': s['lng']},
        'hasMap': s.get('mapsUrl'),
        'starRating': {'@type': 'Rating', 'ratingValue': 4},
        'numberOfRooms': (s.get('stats') or {}).get('roomsCount'),
        'checkinTime': s.get('checkin'), 'checkoutTime': s.get('checkout'),
        'priceRange': f'{min(prices)}–{max(prices)} DZD' if prices else None, 'currenciesAccepted': 'DZD',
        'petsAllowed': False,  # house guide (Le guide de l'hôtel), rule 7
        'availableLanguage': ['ar', 'fr', 'en'],
        'amenityFeature': [{'@type': 'LocationFeatureSpecification', 'name': a.translate(ISO), 'value': True} for a in s.get('amenities', [])],
        'makesOffer': [{'@type': 'Offer', 'name': r['name'], 'url': f'{base}room.html?id={r["id"]}', 'price': r['priceFrom'], 'priceCurrency': 'DZD',
                        'itemOffered': {'@type': 'HotelRoom', 'name': r['name']}} for r in rooms if r.get('priceFrom')],
        'containsPlace': [{'@type': 'MeetingRoom', 'name': v['name'], 'maximumAttendeeCapacity': cap(v.get('capacity'))} for v in venues if cap(v.get('capacity'))],
        'sameAs': s.get('sameAs') or None,
    }
    o = {k: v for k, v in o.items() if v not in (None, [], '')}
    return f'<script type="application/ld+json" data-seo="hotel">{json.dumps(o, ensure_ascii=False)}</script>\n'


def inject(t, page, lang):
    t = strip(t)
    s = data('site', 'ar')
    extra = (f'<meta name="geo.region" content="DZ-40">\n<meta name="geo.placename" content="{", ".join(PLACE[lang])}">\n'
             f'<meta name="geo.position" content="{s["lat"]};{s["lng"]}">\n<meta name="ICBM" content="{s["lat"]}, {s["lng"]}">\n'
             f'<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'
             f'<meta property="og:image:alt" content="{OG_ALT[lang]}">\n'
             + ''.join(f'<meta property="og:locale:alternate" content="{v}">\n' for k, v in LOCALE.items() if k != lang))
    t = t.replace('<meta name="twitter:card"', extra + '<meta name="twitter:card"', 1)
    if page in ('index', 'contact'):
        t = t.replace('</head>', hotel(lang) + '</head>', 1)
    return t
