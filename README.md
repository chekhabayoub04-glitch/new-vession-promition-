# فندق يوسف · HOTEL YOUCEF — Khenchela

Static Arabic (RTL) site for Hotel Youcef, Khenchela Province. Vanilla HTML + one `styles.css` + ES modules (24.9 KB of JS, no library, no build step). Hosted on GitHub Pages under `/new-vession-promition-/`.

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

## The hero film

`video/drone-720.webm` and `video/drone-720.mp4`: 1280×720, silent, 10.4 s loop (the 5.2 s drone master played forward then backward), each under 2 MB.
It starts only after the page has loaded, and never on phones, with reduced motion, Save-Data or 2g/3g — those visitors see `img/hero-poster` (AVIF, 47 KB).

Re-encode from a new master `master.mov` (8–14 s, no audio):

```bash
# MP4 (H.264) — target < 2 MB
ffmpeg -i master.mov -an -vf "scale=1280:720:flags=lanczos,fps=24,format=yuv420p" \
  -c:v libx264 -preset slower -crf 30 -profile:v high -movflags +faststart video/drone-720.mp4
# WebM (VP9), two passes — target < 2 MB
ffmpeg -i master.mov -an -vf "scale=1280:720:flags=lanczos,fps=24" -c:v libvpx-vp9 -b:v 1300k -maxrate 1500k -minrate 900k -row-mt 1 -pass 1 -f webm /dev/null
ffmpeg -i master.mov -an -vf "scale=1280:720:flags=lanczos,fps=24" -c:v libvpx-vp9 -b:v 1300k -maxrate 1500k -minrate 900k -row-mt 1 -pass 2 video/drone-720.webm
# Poster = first frame
ffmpeg -i master.mov -frames:v 1 img/src/hero-poster.jpg && python3 tools/images.py
```

The current loop is made from a 5 s master with: `-filter_complex "[0:v]scale=1280:720,format=yuv420p,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,fps=24"`.

**Moving the video off GitHub** (recommended once the site has real traffic): upload the master to Cloudflare Stream or bunny.net Stream, then replace the two `<source src="video/…">` lines in `index.html` with the CDN's MP4/WebM URLs. Keep the poster local — it is the LCP.

## Run locally

The pages read JSON with `fetch`, so open them through a server, not by double-clicking:
VS Code **Live Server**, or `python3 -m http.server` in this folder → `http://localhost:8000`.

## Stack and budgets

HTML · CSS (`@layer`, logical properties, `color-mix`, `:has`, view transitions) · ES modules · WebGL (360°) · self-hosted Reem Kufi + IBM Plex Sans Arabic · inline-SVG sprite (`img/icons.svg`, Lucide ISC).
Budgets: JS < 25 KB (24.9), CSS < 45 KB (36), no third-party script, no analytics, no cookie banner.

```
index.html rooms.html room.html venues.html restaurant.html gallery.html contact.html 404.html
styles.css
js/      main.js (shared) · booking.js · rooms.js · gallery.js · pano.js · content.js
data/    site.json · rooms.json · venues.json · menu.json · gallery.json · panos.json · images.json
img/     icons.svg · favicon.svg · icons · og.jpg · 360/ · src/ (originals) · <slot>-<w>.{avif,webp,jpg}
video/   drone-720.webm · drone-720.mp4
fonts/   Reem Kufi · IBM Plex Sans Arabic (woff2, Arabic + Latin subsets)
tools/   images.py (photo pipeline for Phase B)
```
