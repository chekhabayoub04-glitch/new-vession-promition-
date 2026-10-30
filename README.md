# HOTEL YOUCEF · فندق يوسف — Khenchela

A cinematic Arabic (RTL) website for Hotel Youcef in Khenchela, Algeria. It opens on the hotel's own film, played by the mouse wheel, and has 360° room views, direct booking through WhatsApp, and a smart booking assistant.

## ✨ Features

| | |
|---|---|
| **Intro** | The maroon mark draws itself, «HOTEL YOUCEF» appears letter by letter (brown + maroon), then a curtain opens on the film |
| **Hero** | Full-screen film (sky → facade → doors → fountain) driven by scroll as a WebP image sequence on a canvas — smooth on phones too. It holds on the fountain while the hotel introduces itself |
| **Design** | Maroon, warm brown and cream; El Messiri headings; words rise one by one, photos open like curtains, icons pop in, numbers count up |
| **360° views** | On the double room page: drag, gyroscope, zoom, full screen; scenes: lobby, upper gallery, double room |
| **Rooms** | 5 room types. Each card has Book, Enquire (WhatsApp), and Details buttons |
| **Packages** | A carousel of packages: wedding night, family, business, Aurès winter |
| **Smart booking** | Write your request in Arabic, Darija, French, or English, for example «جناح لعائلة من 4 نهاية الأسبوع مع فطور». It fills the dates, nights, guests, and room, and suggests a bigger room when needed. A live estimated total updates as you go, and the request is sent through WhatsApp or email |
| **1-2-3 pillars** | Three promises with numbered tabs and images that change automatically |
| **Services** | A carousel of photos, each with a short line |
| **A day at the hotel** | A timeline from 06:00 to 21:00 |
| **Banquet hall** | A quote request for an event (type, date, number of guests) through WhatsApp |
| **Gallery** | Filters by category, plus a lightbox with keyboard and swipe |
| **Khenchela** | Places to discover, the local time, and live weather with a 4-day forecast (Open-Meteo, no key needed) |
| **Location** | A map with the exact coordinates, directions, and a link to the reviews on Google |
| **Quality** | Responsive from 375 to 1440+, `prefers-reduced-motion` support, keyboard navigation, ARIA, Schema.org `Hotel` markup, lazy loading, and the 360° views stop rendering when they are off screen |

## ⚠️ To do before going live (TODO)

Everything is in **`js/data.js`**:

- [ ] **Phone, WhatsApp, email** in `HOTEL`. They are placeholders right now.
- [ ] **Check-in and check-out times, and the breakfast price.**
- [ ] **Room types, prices, sizes** in `ROOMS`. These are estimates.
- [ ] **Packages and their prices** in `OFFERS`.
- [ ] Confirm the services the hotel actually offers (restaurant, café, parking, 24/7 reception…).

## 📸 Adding the hotel's real photos

1. Put the photos in `assets/img/`, for example `assets/img/lobby.jpg`.
2. In `js/data.js`, swap the image for the local path: `{ src: 'assets/img/lobby.jpg', … }`.
   - For rooms: put the path straight into `photos`, e.g. `photos: ['assets/img/suite-1.jpg', …]`.

## 🌐 Adding the hotel's 360° photos

1. Download each panorama as an **equirectangular (2:1) JPG**, for example 6000×3000.
   - From Google Maps: open the 360° photo, then use a downloader such as *Street View Download 360*, or ask the hotel for the original files.
2. Put it in `assets/360/`, for example `assets/360/lobby.jpg`.
   Optional: a lighter copy for phones, `lobby-m.jpg` at 2048×1024.
3. Add a line to `PANOS` in `js/data.js`:
   ```js
   { id: 'lobby', title: 'البهو', icon: 'sofa', src: 'assets/360/lobby.jpg', srcMobile: 'assets/360/lobby-m.jpg' }
   ```
4. To show it in a room's page, set `pano: 'lobby'` in `ROOMS`.

> `lobby`, `atrium` and `room` are the hotel's own photos from Google Maps. `pool` is still a free CC0 demo photo from Poly Haven. Replace them with the hotel's.

## 🗂️ Structure

```
index.html        Home page
room.html         Room page (?id=single|double|twin|family|suite)
css/style.css     Design system (night navy · champagne gold)
js/data.js        All the hotel data ← edit here
js/common.js      Smooth scroll, header, room cards, lightbox
js/booking.js     Booking form + smart assistant
js/main.js        Home page: hero video, rooms, offers, gallery, weather
js/pano.js        360° viewer
js/tour.js        360° tour UI
js/room.js        Room page
assets/img/       Hotel photos
assets/frames/    Hero film frames (d = desktop 16:9, m = phones 7:9 crop)
assets/360/       360° panoramas
assets/video/     film.mp4 + film-m.mp4 (the drone film section); the .mov sources are not used by the site
```

## ▶️ Running it

The 360° viewer uses ES modules, so open the site **through a local server**:

```bash
npx serve .        # or VS Code Live Server, or: python3 -m http.server 8000
```

Deploying: the site is fully static, so it works on Netlify, Vercel, or GitHub Pages.

## 🧰 Stack

Three.js 0.170 · GSAP 3.12 + ScrollTrigger · Lenis · Lucide · Open-Meteo · OpenStreetMap · HTML/CSS/JS with no build step.
