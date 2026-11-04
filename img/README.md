# img/ — image manifest

**How a photo reaches the site:** put the original in `img/src/<slot>.jpg` (or .png/.webp), run `python3 tools/images.py`.
The tool writes `img/<slot>-640/960/1280/1920.{avif,webp,jpg}` + `img/<slot>.avif` and lists the slot in `data/images.json`.
A slot not listed there shows a sand arch placeholder with its file name printed in it.

| File | Ratio | Min width | Subject |
|---|---|---|---|
| `hero-poster` | 16:9 | 1920 | first frame of the drone shot (LCP — keep the AVIF < 120 KB) |
| `facade` | 3:2 | 1600 | façade, red dome + mashrabiya |
| `lobby-dome` | 4:5 | 1200 | atrium gypsum dome + chandelier |
| `pool` | 3:2 | 1600 | outdoor pool, daylight |
| `restaurant-01` | 3:2 | 1600 | dining room, tables laid |
| `cafe` | 3:2 | 1200 | café corner |
| `menu-card` | 3:4 | 1400 | the printed menu card (also transcribe it into `data/menu.json`) |
| `dish-hero` | 16:9 | 1920 | the most photogenic dish or a laid table |
| `dish-01` … `dish-08` | 4:3 | 1200 | plated dishes — one set: same light, same angle, same surface |
| `hall-wedding-01` … `03` | 3:2 | 1600 | event hall, round tables, lit chandeliers |
| `salon-meeting-01` … `02` | 3:2 | 1600 | meeting salon, U-shape / boardroom setup |
| `salon-lounge-01` | 3:2 | 1400 | smaller reception salon |
| `room-{1..7}-01` … `04` | 3:2 | 1600 | each room type: wide, bed detail, bathroom, view |
| `corridor` | 4:5 | 1200 | corridor, gold railings |
| `reception` | 3:2 | 1400 | reception desk |
| `og.jpg` | 1.91:1 | 1200 | social share card (plain JPEG, not processed by the tool) |
| `360/<id>.jpg` + `360/<id>-m.jpg` | 2:1 | 4096 / 2048 | equirectangular 360° photos (not processed by the tool) |

Alt texts are Arabic and descriptive; they live next to each slot (`data-alt` in the pages, `alt` in `data/gallery.json`).
`img/src/` keeps the originals; they are never loaded by the pages.
