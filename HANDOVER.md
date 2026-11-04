# HANDOVER — فندق يوسف · Phase A → Phase B

Everything you send in Phase B goes into **JSON files** or **photo files**. No HTML, CSS or JS changes.
`grep -rn "TODO:FILL" *.html` lists every slot in the pages; this file is the same list, grouped by what you edit.

A `null` in a JSON file shows on the site as **«عند الطلب»** or **«يُحدَّد عند الحجز»**, never as an empty box.

---

## 1. `data/site.json` — the hotel (one value each)

✅ From the hotel's price card: `phoneE164` / `phoneDisplay` (032 73 15 40), `faxDisplay` (032 73 13 66), `email` (hotelyoucef@gmail.com), `streetAddress` (الحامة، خنشلة 40016), `breakfastIncluded` (every rate includes breakfast).

| # | Key | What to send | Shown where |
|---|---|---|---|
| 1 | `whatsappE164` | **The WhatsApp number** (mobile), e.g. `+2136XXXXXXXX`. 032 73 15 40 is a landline, so it is not used for WhatsApp | Every WhatsApp button and the booking form. Until it is set, WhatsApp opens without a recipient and «أرسل بالبريد» goes to hotelyoucef@gmail.com |
| 2 | `checkin` / `checkout` | Times, e.g. `14:00` / `12:00` | Room pages, location block, footer, JSON-LD |
| 3 | `cancellation` | One sentence | Room pages «قبل وصولك» |
| 4 | `reviewsUrl` | Confirm the Google Maps link | «آراء النزلاء على Google» |
| 5 | `stats.roomsCount`, `stats.hallCapacity`, `stats.yearOpened` | Numbers only. `roomTypes` is already 7 | Counters (a `null` stat is hidden, never shows 0) |

## 2. `data/rooms.json` — the 7 room types ✅ (price card + photo folders)

Order, names, beds, prices (TTC, breakfast included) and the card's amenities (wifi, coffre-fort, petit-déjeuner) come from **TARIFS HEBERGEMENT**:

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
**Still needed per room:** `sizeM2`, `maxGuests`, `view`, `floor` (shown as «عند الطلب» until set).

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
| 8 | No sticky mobile CTA | WhatsApp + «احجز الآن» bar under 900px (safe-area aware); room pages pre-fill the room. |
| 9 | Clock + weather widgets | Deleted. |
| 10 | Unsplash photo for the hall | Deleted. Arch placeholder naming `img/hall-wedding-01.avif` until the real photo arrives. No third-party stock anywhere. |
| 11 | Anchors under the sticky header | `scroll-margin-block-start` on every section with an id. |

Also: GSAP, Lenis, Lucide and Three.js removed (no dependency); the 360° viewer was rewritten in plain WebGL; fonts are self-hosted; the WhatsApp message follows §10 exactly; invented data from the old site (prices, room names, email, offers) is gone.

## Assumptions (also marked `ASSUMPTION` in the files)

1. **Hero, by the client's choice:** the brief's §6 autoplay video (hidden on phones) was replaced by the previous cinematic hero — intro screen, then the drone film scrubbed by scroll on desktop **and phones**, holding on the fountain while «فندق يوسف» appears. Cost: +3.7 KB of JS (28.6 KB total, brief asked < 25 KB) and ~3.8 MB (phones) / 8.6 MB (desktop) of frames loaded progressively. Measured: 60 fps while scrolling on iPhone 13 / Pixel 5 / iPhone SE with a 4× slower CPU.
2. `room-4`'s photo type is unknown; meeting-salon layouts/equipment come from the brief.
3. The booking form has no `action="mailto:"`: Chrome flags a `mailto:` form on an https page as mixed content (Lighthouse Best Practices). With JS the form sends to WhatsApp or opens the email app; without JS it shows two direct links (email · WhatsApp) instead.
4. Data pages need a web server (GitHub Pages, VS Code Live Server). Opening `index.html` straight from the disk (`file://`) blocks the JSON — the pages still show their static content and placeholders.
