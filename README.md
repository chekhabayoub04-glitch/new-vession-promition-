# فندق يوسف · HOTEL YOUCEF — Khenchela

Static Arabic (RTL) site for Hotel Youcef, Khenchela Province. Vanilla HTML + one `styles.css` + ES modules (28.6 KB of JS, no library, no build step). Hosted on GitHub Pages under `/new-vession-promition-/`.

**Phase A** (this version): the structure, with every piece of content as a named slot. **Phase B**: fill the slots — see [`HANDOVER.md`](HANDOVER.md).

## Pages

| Page | Content from |
|---|---|
| `index.html` — hero, trust strip, rooms, experience, gallery + 360°, location | `data/site.json`, `rooms.json`, `gallery.json`, `panos.json` |
| `rooms.html` — all rooms + comparison table | `data/rooms.json` |
| `room.html?id=room-1` … `room-7` — the conversion page | `data/rooms.json` |
| `venues.html` — hall, meeting salons, lounges + quote form | `data/venues.json` |
| `restaurant.html` — dish strip, dish rail, menu, table request | `data/menu.json` |
| `gallery.html` — filterable gallery + 360° | `data/gallery.json`, `panos.json` |
| `contact.html` — map, contact, booking form, FAQ | `data/site.json` |
| `404.html`, `sitemap.xml`, `robots.txt`, `site.webmanifest` | — |

## Add or change a room

Edit `data/rooms.json`. Each entry renders on the homepage (first 4), `rooms.html`, the comparison table, the booking `<select>` and `room.html?id=<id>`. Keep the `id` stable — it is the URL.

## Add or swap a photo

1. Put the original in `img/src/<slot>.jpg` — the slot names are listed in [`img/README.md`](img/README.md) (e.g. `room-5-01`, `hall-wedding-02`, `dish-03`).
2. Run once: `pip install pillow` (Pillow ≥ 11.2 has AVIF), then `python3 tools/images.py`.
3. Done — the tool writes AVIF/WebP/JPEG at 640/960/1280/1920 and lists the slot in `data/images.json`. Commit `img/` and `data/images.json`.

## The hero (intro + film scrubbed by scroll)

- **Intro** (`#loader` in `index.html`): the HY mark draws itself, HOTEL (brown) YOUCEF (maroon) appears letter by letter, then a curtain opens. At least 2.3 s, at most until the first frame is ready (5 s cap). Skipped under reduced motion.
- **Film**: `video/frames/d/001…125.webp` (desktop, 1600×900) and `video/frames/m/…` (phones, a 560×720 centre crop so the film fills a portrait screen). `js/hero.js` draws them on a canvas as you scroll — sky → façade → doors → fountain at 68 % of the scroll — then holds on the fountain while «فندق يوسف» and the description appear. Frames load first/last first, then coarse-to-fine, so scrolling works before everything has arrived.
- **New master film** (`master.mov`, any length): regenerate the frames, keeping the names:

```bash
ffmpeg -i master.mov -vf "scale=1600:900:flags=lanczos,eq=contrast=1.05:saturation=1.06,unsharp=5:5:0.5" -c:v libwebp -quality 72 video/frames/d/%03d.webp
ffmpeg -i master.mov -vf "crop=ih*7/9:ih:(iw-ih*7/9)/2:0,scale=560:720,eq=contrast=1.05:saturation=1.06,unsharp=5:5:0.6" -c:v libwebp -quality 74 video/frames/m/%03d.webp
```
  If the new film has a different frame count, change `COUNT` at the top of `js/hero.js`.

## Run locally

The pages read JSON with `fetch`, so open them through a server, not by double-clicking:
VS Code **Live Server**, or `python3 -m http.server` in this folder → `http://localhost:8000`.

## Stack and budgets

HTML · CSS (`@layer`, logical properties, `color-mix`, `:has`, view transitions) · ES modules · WebGL (360°) · self-hosted Reem Kufi + IBM Plex Sans Arabic · inline-SVG sprite (`img/icons.svg`, Lucide ISC).
Budgets: JS 28.6 KB (25 KB brief + the cinematic hero the client asked to keep), CSS < 45 KB (44), no third-party script, no analytics, no cookie banner.

```
index.html rooms.html room.html venues.html restaurant.html gallery.html contact.html 404.html
styles.css
js/      main.js (shared) · hero.js · booking.js · rooms.js · gallery.js · pano.js · content.js
data/    site.json · rooms.json · venues.json · menu.json · gallery.json · panos.json · images.json
img/     icons.svg · favicon.svg · icons · og.jpg · 360/ · src/ (originals) · <slot>-<w>.{avif,webp,jpg}
video/   frames/d (desktop) · frames/m (phones) — 125 WebP frames each
fonts/   Reem Kufi · IBM Plex Sans Arabic (woff2, Arabic + Latin subsets)
tools/   images.py (photo pipeline for Phase B)
```
