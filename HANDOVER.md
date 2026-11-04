# HANDOVER — فندق يوسف · Phase A → Phase B

Everything you send in Phase B goes into **JSON files** or **photo files**. No HTML, CSS or JS changes.
`grep -rn "TODO:FILL" *.html` lists every slot in the pages; this file is the same list, grouped by what you edit.

A `null` in a JSON file shows on the site as **«عند الطلب»** or **«يُحدَّد عند الحجز»**, never as an empty box.

---

## 1. `data/site.json` — the hotel (one value each)

| # | Key | What to send | Shown where |
|---|---|---|---|
| 1 | `phoneE164` | Phone/WhatsApp in international form, e.g. `+21332XXXXXX` | Every WhatsApp button, `tel:` links, Hotel JSON-LD |
| 2 | `phoneDisplay` | The same number as people write it, e.g. `032 XX XX XX` | Contact lists, footer |
| 3 | `email` | Reservations email | Booking form email fallback, footer |
| 4 | `streetAddress` | Street / neighbourhood (the pages already say «ولاية خنشلة، الجزائر») | Location block, JSON-LD |
| 5 | `checkin` / `checkout` | Times, e.g. `14:00` / `12:00` | Room pages, location block, footer, JSON-LD |
| 6 | `cancellation` | One sentence | Room pages «قبل وصولك» |
| 7 | `breakfastPerPerson` | Price in دج (number) | Room pages price block |
| 8 | `reviewsUrl` | Confirm the Google Maps link (set to the hotel's place page) | «آراء النزلاء على Google» |
| 9 | `stats.roomsCount`, `stats.hallCapacity`, `stats.yearOpened` | Numbers only. `roomTypes` is already 7 | Counters (a `null` stat is hidden, never shows 0) |

## 2. `data/rooms.json` — the 7 room types

Each room: `name`, `shortLine` (one sentence: what the room is and who it is for), `priceFrom` (دج / night), `sizeM2`, `beds`, `maxGuests`, `view`, `floor`, `amenities` (list), `breakfastPerPerson` (if different from the hotel's).
The `id`s `room-1` … `room-7` are the URLs (`room.html?id=room-3`) — keep them; reorder the array to reorder the site.

| Room | What is already there (from your Google Maps links) | Still needed |
|---|---|---|
| `room-1` | name «غرفة بسرير واحد», beds «سرير واحد», 2 photos, TV seen in photo | everything else |
| `room-2` | 2 photos + a 360° view (the room decorated with the swans) | **name**, beds, everything else |
| `room-3` | name «غرفة بسريرين», beds «سريران», 1 photo | everything else |
| `room-4` | 1 photo (large bed, green headboard) — <!-- ASSUMPTION --> type unknown, filed as room 4 | **name**, everything |
| `room-5` … `room-7` | nothing | **everything** |

Photos per room: `room-{n}-01` (wide), `-02` (bed detail), `-03` (bathroom), `-04` (view) — see §6.
If a room has a 360° photo, set `"pano": "room-n"` and add it to `data/panos.json` (§5).

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
| `room-{1..7}-01…04` | 3:2 | 1600 | wide · bed · bathroom · view | ✅ 6 of 28 (room-1 ×2, room-2 ×2, room-3, room-4) |
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
