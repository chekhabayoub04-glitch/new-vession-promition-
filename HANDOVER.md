# HANDOVER — فندق يوسف · Phase A → Phase B

Everything you send in Phase B goes into **JSON files** or **photo files**. No HTML, CSS or JS changes.
`grep -rn "TODO:FILL" *.html` lists every slot in the pages; this file is the same list, grouped by what you edit.

A `null` in a JSON file is never shown as an empty box: room facts (size, guests, view, floor) and empty table columns are **hidden** until filled; the cancellation line and the VIP capacity read «يُحدَّد عند الحجز» / «عند الطلب»; the restaurant price list stays hidden until the menu is transcribed.

**No booking forms and no WhatsApp** (the hotel's choice, against fake requests): every «احجز» opens a small sheet with the reservations address (copy button), «اكتب لنا عبر Gmail» (Gmail compose on a computer, the phone's mail app on a phone; only the subject is pre-filled, e.g. the room name or «طلب عرض سعر») and «اتصل بنا». The restaurant has no table request. Local preview: `python3 tools/serve.py` → http://localhost:8765/.

---

## 1. `data/site.json` — the hotel (one value each)

✅ From the hotel's handwritten contact note: `phoneE164` / `phoneDisplay` (030 56 43 40), `faxE164` / `faxDisplay` (030 56 46 76), `email` (hotelyoucef@gmail.com), `bookingEmail` (reservation.hotelyoucef@gmail.com). They replace 032 73 15 40 / 032 73 13 66 of the older price card.
✅ Reception sign: `checkin` 14:00, `checkout` 11:00 (the printed house guide in the footer still says rooms are freed at 12h00 — to be aligned by the hotel).
✅ Price card: `streetAddress` (الحامة، خنشلة 40016), `breakfastIncluded`.

| # | Key | What to send | Shown where |
|---|---|---|---|
| 1 | `cancellation` | One sentence | Room pages «قبل وصولك» |
| 2 | `reviewsUrl` | Confirm the Google Maps link | «آراء النزلاء على Google» |
| 3 | `stats.yearOpened` | Year | Counter (hidden while `null`) |

## 2. `data/rooms.json` — the 7 room types ✅ (price card + photo folders)

Site order: suites first (Royal, Sénior, Junior), then rooms by beds (Single, Double, Twin, Triple) — the array order in `rooms.json`; the ids keep the card numbering. Names, beds, prices (TTC, breakfast included) and the card's amenities (wifi, coffre-fort, petit-déjeuner) come from **TARIFS HEBERGEMENT**:

| id | Card | Arabic name | دج / night | Photos |
|---|---|---|---|---|
| `room-1` | Chambre Single | غرفة فردية | 7 600 | 4 + tea tray |
| `room-2` | Chambre Double Grand Lit | غرفة مزدوجة بسرير كبير | 11 400 | 6 + tray |
| `room-3` | Chambre Double / Twin | غرفة مزدوجة بسريرين | 12 400 | 7 + tray |
| `room-4` | Chambre Triple | غرفة ثلاثية | 17 900 | 5 + tray |
| `room-5` | Suite de luxe Junior | جناح جونيور | 15 800 | 5 + tray |
| `room-6` | Suite de luxe Sénior | جناح سينيور | 19 000 | 7 + tray |
| `room-7` | Suite de luxe Royal | الجناح الملكي | 20 700 | 9 + tray |

Amenities seen in the photos (TV, air-conditioning vents, bathtub, tea/coffee tray, balcony, bathrobe) are listed too. <!-- ASSUMPTION --> TV / air-con / bathtub / tray are listed for every type because they appear in every folder.
**Still needed per room:** `sizeM2`, `maxGuests`, `view`, `floor` (hidden until set). Every room also lists «ميني بار» (minibar) and «خزنة» (safe), confirmed by the hotel.

Photos: originals in `img/src/rooms/<folder>/` → `python3 tools/rooms_import.py` (white balance + levels + sharpening, gentle) → `img/src/room-<n>-<kk>.jpg` → `python3 tools/images.py`. Each photo's Arabic alt is in `alts`, in the same order as `images`.
The old 360° `room-2` (the room with the swans) stays in the gallery as «إحدى غرف الفندق» — tell me its type to attach it to a room.

## 3. `data/venues.json` — the three spaces

| # | Venue | Needed |
|---|---|---|
| 1 | `hall` قاعة الحفلات | `capacity` (guests). Confirm `layouts`/`equipment` |
| 2 | `meeting` صالونات الاجتماعات | `capacity`. Confirm the layouts (U / مسرحي / طاولة اجتماعات) and equipment (جهاز عرض، واي فاي، استراحة قهوة) — <!-- ASSUMPTION --> taken from the brief, not verified |
| 3 | `lounge` صالونات اللقاء | `capacity`, layouts, equipment |

## 4. `data/menu.json` — the restaurant

- Transcribe the printed menu card: for each section (مقبلات، أطباق رئيسية، مشاوي، حلويات، مشروبات) a list of `{ "name", "desc", "price" }`. Add or remove items freely.
- `img` on an item links it to a dish photo (`dish-01` … `dish-08`).
- `hours`, `cafeHours`, `priceRange` (e.g. `"800–2500 دج"`).
- Only items with a `name` go into the Restaurant/Menu JSON-LD.
- **Dish photos must look like one set** (same white balance, same angle family, same surface). If yours are mixed, tell me which ones and I will say which to re-shoot.

## 5. `data/gallery.json` and `data/panos.json`

- Gallery: add `{ "slot": "<photo name>", "cat": "hotel|rooms|pool|dining|events", "alt": "وصف بالعربية" }`. Items whose photo does not exist yet show the placeholder in the gallery page and are skipped in the home strip.
- 360°: add `{ "id": "pool", "title": "المسبح", "yaw": 0, "pitch": 0 }` and two files: `img/360/pool.jpg` (4096×2048) and `img/360/pool-m.jpg` (2048×1024), equirectangular 2:1. `room-2`'s title becomes the room name once you send it.

## 6. Photos — put the original in `img/src/<slot>.jpg`, then run `python3 tools/images.py`

| Slot | Ratio | Min width | Subject | Status |
|---|---|---|---|---|
| `hero-poster` | 16:9 | 1920 | first frame of the drone shot | ✅ 1280 (the drone master is 1280×720) |
| `facade` | 3:2 | 1600 | façade, red dome + mashrabiya | ✅ 1280, frame of the drone film — a real photo is better |
| `lobby-dome` | 4:5 | 1200 | atrium dome + chandelier | ✅ 720, frame of the drone film — a real photo is better |
| `pool` | 3:2 | 1600 | outdoor pool, daylight | ✅ 720 portrait — **send a 3:2 photo** |
| `reception` | 3:2 | 1400 | reception desk | ✅ 1832 |
| `corridor` | 4:5 | 1200 | corridor, gold railings | ✅ 1832 (landscape) |
| `fountain` | — | — | the fountain (gallery) | ✅ 1280 |
| `restaurant-01` | 3:2 | 1600 | dining room, tables laid | ❌ |
| `cafe` | 3:2 | 1200 | café corner | ❌ |
| `menu-card` | 3:4 | 1400 | the printed menu card | ❌ |
| `dish-hero` | 16:9 | 1920 | the best dish or a laid table | ❌ |
| `dish-01` … `dish-08` | 4:3 | 1200 | plated dishes, consistent light | ❌ |
| `hall-wedding-01` … `03` | 3:2 | 1600 | event hall, round tables, chandeliers lit | ❌ |
| `salon-meeting-01` … `02` | 3:2 | 1600 | meeting salon, U-shape / boardroom | ❌ |
| `salon-lounge-01` | 3:2 | 1400 | smaller reception salon | ❌ |
| `room-{1..7}-NN`, `room-tea` | 3:4 | 1440 | every room type | ✅ 43 + 1 (from the 7 folders) |
| `img/og.jpg` | 1.91:1 | 1200 | social share card | ✅ (from the hero poster) |

Every alt text is already written in Arabic in the JSON / pages.

## 7. Outside the repo

- **Domain:** `robots.txt` only counts at a domain root. On `*.github.io/new-vession-promition-/` crawlers read `chekhabayoub04-glitch.github.io/robots.txt`, not ours — fine for now; when you move to a real domain, it works as is (update the absolute URLs: search for `chekhabayoub04-glitch.github.io`).
- **Video on a CDN:** see README → «الفيديو».
- **Google Search Console:** submit `sitemap.xml`.

---

## What changed and why (brief §3)

| §3 | Problem | Fix |
|---|---|---|
| 1 | «Scroll to enter» splash before the hero | Deleted. The page opens on the hero. |
| 2 | 12 stacked sections | Homepage = 6 blocks: hero · trust strip · rooms · experience · gallery + 360° · location. Depth moved to `rooms`, `venues`, `restaurant`, `gallery`, `contact`. |
| 3 | Counters showing `0` | Counters read `data/site.json → stats`; only real numbers; a `null` hides the counter. |
| 4 | Four sections telling the same story | One asymmetric experience grid + one gallery strip. |
| 5 | Duplicate `#film` section | Deleted. The drone film stays in the hero only. |
| 6 | Two forms on the homepage | Events quote form → `venues.html`. Booking = sheet on every page + `contact.html#booking`. |
| 7 | Empty `room.html` | Rebuilt in the brief's order: breadcrumb, gallery + thumbnails + lightbox, one sentence, specs, price, amenities, proof photos, policies, sticky booking card / bar, other rooms, JSON-LD. |
| 8 | No sticky mobile CTA | «اتصل بنا» (phone) + «احجز الآن» bar under 900px (safe-area aware); room pages pre-fill the room. |
| 9 | Clock + weather widgets | Deleted. |
| 10 | Unsplash photo for the hall | Deleted. Arch placeholder naming `img/hall-wedding-01.avif` until the real photo arrives. No third-party stock anywhere. |
| 11 | Anchors under the sticky header | `scroll-margin-block-start` on every section with an id. |

Also: GSAP, Lenis, Lucide and Three.js removed (no dependency); the 360° viewer was rewritten in plain WebGL; fonts are self-hosted; the WhatsApp message follows §10 exactly; invented data from the old site (prices, room names, email, offers) is gone.

## Assumptions (also marked `ASSUMPTION` in the files)

1. **Hero, by the client's choice:** the brief's §6 autoplay video (hidden on phones) was replaced by the previous cinematic hero — intro screen, then the drone film scrubbed by scroll on desktop **and phones**, holding on the fountain while «فندق يوسف» appears. Cost: +3.7 KB of JS (28.6 KB total, brief asked < 25 KB) and ~3.8 MB (phones) / 8.6 MB (desktop) of frames loaded progressively. Measured: 60 fps while scrolling on iPhone 13 / Pixel 5 / iPhone SE with a 4× slower CPU.
2. `room-4`'s photo type is unknown; meeting-salon layouts/equipment come from the brief.
3. The booking form has no `action="mailto:"`: Chrome flags a `mailto:` form on an https page as mixed content (Lighthouse Best Practices). With JS the form sends to WhatsApp or opens the email app; without JS it shows two direct links (email · WhatsApp) instead.
4. Data pages need a web server (GitHub Pages, VS Code Live Server). Opening `index.html` straight from the disk (`file://`) blocks the JSON — the pages still show their static content and placeholders.

## 8. Photo drop folders → `img/src/drop/` (not deployed)

| Folder | Becomes | Shown in |
|---|---|---|
| `1_restaurant_cafeteria_food` | `dining-NN` | home «لحظات» chapter المطعم والكافيتيريا, gallery |
| `2_pool` | `pool-NN` | «لحظات» المسبح, gallery |
| `3_conference_room` | `conference-NN` | venues.html قاعة المؤتمرات (120–135 pax), «لحظات» القاعات, gallery |
| `4_vip_salon` | `vip-NN` | venues.html صالون VIP, «لحظات» القاعات, gallery |
| `5_parking` | `parking-NN` | «لحظات» الفندق, gallery |
| `6_hotel` | `hotel-NN` | «لحظات» الفندق, gallery |
| `7_logo` | by hand → header/footer mark + gold palette | every page |
| `8_certificate` | by hand → slot `certificate` | footer button «شهادة الاعتماد الرسمية» on every page (hidden until it exists) |

`python3 tools/curate.py` ranks each folder (sharpness, exposure, duplicates), keeps the best 10, corrects them, writes `img/src/drop/_review-<prefix>.jpg`, and updates `data/showcase.json`, `data/gallery.json`, `data/venues.json`. Then `python3 tools/images.py`. Review every kept photo by eye before publishing; rewrite the generic alts.

«لحظات» (`#moments`, `js/showcase.js`): full-screen on phones, crossfade + slow zoom, gold progress bars, chapter tabs, pause button (WCAG 2.2.2), swipe/arrows, pauses off-screen / hidden tab / mouse hover; reduced motion = no autoplay. A chapter with no photo is hidden.
Also from the client: 84 rooms (`stats.roomsCount`), conference room 120–135 pax, VIP meeting salon, cafeteria, parking. Footer: «جميع الحقوق محفوظة» + RC / NIF from the price card. <!-- ASSUMPTION --> the wedding hall (قاعة الحفلات) is kept from the earlier site; confirm it exists.

## 9. Visual identity (from the official logo, 2026-11-05)

- Logo: `img/src/drop/7_logo/hotel-youcef-logo.png` → `python3 tools/logo.py <file>` → `img/logo.png|webp` (full), `logo-360.webp` (footer), `logo-crest.webp` (intro, 400 px), `logo-mark.webp` (header, 160 px), icons/favicon. Specks and the red fringe are cleaned automatically.
- Palette (CSS tokens): ivory `--sand-*`, black `--ink-950/900`, gold `--gold-800 … --gold-200` + `--gold-grad` (sampled #BD7108 → #FDE864). Text gold on ivory = `--gold-700` #8A5A08 (5.7:1); gold on black = `--gold-300` #F2C14E (11.3:1). Primary button: black + gold, gold gradient on hover.
- Intro (`#loader`): the crest fills with gold from the bottom, a gleam crosses it, 4 stars, HOTEL YOUCEF in gold letters, curtain. 3 s, once per session (sessionStorage `hy-intro`), skipped under reduced motion.
- 4 stars: from the official logo → trust strip + Hotel JSON-LD `starRating`.

## 10. Arabic + French + English

- Arabic pages at the root are the source. `python3 tools/build_i18n.py` (or the old name `tools/build_fr.py`) writes `fr/*.html` and `en/*.html` (dir="ltr") and `data/fr/`, `data/en/` from them, using `tools/i18n/fr.json` and `tools/i18n/en.json` (Arabic text → translation). After any Arabic change, run it again; it lists every Arabic text still missing in either file. English is British spelling; room names follow the price card (Royal Suite, Senior Suite, Junior Suite…).
- Language switch «ع | FR | EN» in every header (keeps the same room: `room.html?id=…`). On phones (≤440 px) it folds into one globe button that opens the three full names (العربية · Français · English) — a `<details>` menu, works without JS. hreflang ar/fr/en + x-default, canonical per language, all three in `sitemap.xml`.
- JS: `js/main.js` exports `LANG`, `FR`, `EN`, `LTR`, `BASE` (`../` in fr/ and en/), `tt(ar, fr, en)` for the few strings built in JS, and `step()` so ← / → and swipes follow the reading direction.
- Fonts: Arabic headings El Messiri; French and English headings Cormorant Garamond (the logo's serif); body IBM Plex Sans Arabic (has Latin). On the French and English home pages the line under the hero title is the Arabic name «فندق يوسف».

## 11. Night mode

- Follows the phone (`prefers-color-scheme`) until the visitor taps the moon/sun button in the header; the choice is saved (`localStorage hy-theme`) and shared by all three languages.
- No white flash: a one-line script in `<head>` sets `data-theme` before the CSS paints. Two `theme-color` metas (day ivory / night black) colour the phone's browser bar.
- One set of night values in `styles.css` (`:root[data-theme="dark"]` and the same values under `@media (prefers-color-scheme: dark)`): background #0E0C09, cards #1A1610, text #F3EDE3, accents in bright gold. Every text colour goes through these tokens — all pages pass WCAG AA in both modes.
- The switch is a single View Transition crossfade (GPU, 0.32 s), not colour transitions on every element; reduced motion = instant.
