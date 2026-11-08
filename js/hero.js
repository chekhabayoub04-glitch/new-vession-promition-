// hero.js — intro (mark draws, name appears, curtain opens) + the drone film scrubbed by scroll
// 125 frames drawn on a canvas (1920×1080; phones: 720×1200 centre crop), Real-ESRGAN upscaled, AVIF (WebP where AVIF
// is not supported): smooth on every phone, holds on the fountain.
import { $, reduced, BASE } from './main.js?v=54e25dbd';

const root = document.documentElement, hero = $('.hero'), canvas = $('#heroCanvas');
const COUNT = 125, FILM_END = 0.68; // the film reaches the fountain at 68 % of the scroll; the rest holds on it
const dir = matchMedia('(max-aspect-ratio: 4/5)').matches ? 'm' : 'd';
const frames = [], asked = new Set(), ctx = canvas.getContext('2d');
let want = 0, painted = '', moving = false, firstReady;
const first = new Promise(r => (firstReady = r));
// AVIF: the same sharpness for ~25 % fewer bytes than WebP — the film arrives sooner on mobile data. A 2×2 test image
// tells within a few ms whether this browser decodes it (Safari 16+, Chrome, Firefox); otherwise WebP.
const EXT = await new Promise(r => { const t = new Image(); t.onload = () => r(t.width === 2 ? 'avif' : 'webp'); t.onerror = () => r('webp');
  t.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADrbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAAAAAAAOcGl0bQAAAAAAAQAAAB5pbG9jAAAAAEQAAAEAAQAAAAEAAAETAAAAGgAAAChpaW5mAAAAAAABAAAAGmluZmUCAAAAAAEAAGF2MDFDb2xvcgAAAABqaXBycAAAAEtpcGNvAAAAFGlzcGUAAAAAAAAAAgAAAAIAAAAQcGl4aQAAAAADCAgIAAAADGF2MUOBAAwAAAAAE2NvbHJuY2x4AAEADQAGgAAAABdpcG1hAAAAAAAAAAEAAQQBAoMEAAAAIm1kYXQSAAoFGAA2BCAyDxgACiiihAAAsBIP6AEfIA=='; });

function load(i) {
  if (asked.has(i)) return;
  asked.add(i);
  const im = new Image();
  im.decoding = 'async';
  // decoded off the main thread before it can be drawn: drawing a still-compressed frame decodes it on the spot (a stall)
  const ready = () => { frames[i] = im; i || firstReady(); redraw(); };
  im.onload = () => (im.decode ? im.decode().catch(() => {}).then(ready) : ready());
  im.src = `${BASE}video/frames/${dir}/${String(i + 1).padStart(3, '0')}.${EXT}?hd2`; // ?hd2: this film (a cached older frame never mixes in)
}
// First frame, then the fountain, then coarse-to-fine (every 16th, 8th, 4th, 2nd, then all) so scrubbing works before
// everything has arrived. Everything starts at once, during the 4 s intro: on a first visit the film is (nearly)
// complete before the first swipe — waiting for the swipe made the first run jumpy while the second one, from cache,
// was smooth. Data Saver / 2G: the film stops at every 4th frame (crossfaded, see draw), a third of the weight.
const net = navigator.connection || {}, lite = net.saveData || /2g/.test(net.effectiveType || '');
// frames are asked for in small slices (≤ 6 ms each, in idle time) — a hundred image requests in one go blocked the
// first scroll on mid-range phones for ~90 ms
const queue = [], idle = window.requestIdleCallback ? f => requestIdleCallback(f, { timeout: 150 }) : f => setTimeout(f, 16);
const pump = () => { const t = performance.now(); while (queue.length && performance.now() - t < 6) load(queue.shift()); queue.length && idle(pump); };
const steps = s => { const busy = queue.length; s.forEach(k => { for (let i = 0; i < COUNT; i += k) asked.has(i) || queue.includes(i) || queue.push(i); }); busy || idle(pump); };
load(0); load(COUNT - 1);
first.then(() => steps(lite ? [16, 8, 4] : [16, 8, 4, 2, 1]));

// f is a fractional frame position. Drawn as the two nearest frames that have arrived, crossfaded by distance:
// a missing frame never shows as a jump, only as a softer blend. Two neighbours that are both here are never blended:
// the camera moves between them, and a mix would show a double image (the sign twice) — the nearer one is drawn.
// The blend over a gap only happens while the film moves (it reads as motion); once the finger stops, the nearest
// real frame is shown, always sharp.
const below = i => { for (let k = i; k >= 0; k--) if (frames[k]) return k; return -1; };
const above = i => { for (let k = i; k < COUNT; k++) if (frames[k]) return k; return -1; };
const cover = (im, alpha) => {
  const cw = canvas.width, ch = canvas.height, k = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
  ctx.globalAlpha = alpha;
  ctx.drawImage(im, (cw - im.naturalWidth * k) / 2, (ch - im.naturalHeight * k) / 2, im.naturalWidth * k, im.naturalHeight * k);
};
function draw(f) {
  want = f;
  let a = below(Math.floor(f)), b = above(Math.ceil(f));
  if (a < 0 && b < 0) return;
  if (a < 0) a = b;
  if (b < 0) b = a;
  if (b - a <= 1 || !moving) a = b = f - a < b - f ? a : b;
  const t = b === a ? 0 : Math.round(((f - a) / (b - a)) * 40) / 40; // 40 blend steps: no redraw for invisible changes
  const key = `${a}:${b}:${t}`;
  if (key === painted) return;
  painted = key;
  cover(frames[a], 1);
  t && cover(frames[b], t);
  ctx.globalAlpha = 1;
}
// a frame that arrives may sharpen what is on screen: repaint once per animation frame, however many arrive
let pending = 0;
const redraw = () => (pending ||= requestAnimationFrame(() => { pending = 0; painted = ''; draw(want); }));
function size() {
  // a 3× canvas only burns GPU; 2× shows every pixel of the 720×1200 / 1920×1080 frames
  const d = Math.min(devicePixelRatio || 1, 2), w = Math.round(canvas.clientWidth * d), h = Math.round(canvas.clientHeight * d);
  if (w === canvas.width && h === canvas.height) return;
  canvas.width = w; canvas.height = h; painted = ''; draw(want);
}
addEventListener('resize', size);
size();

// Intro: the gold crest fills, the full name appears (≥ 4 s, at most until the first frame, 5 s cap); once per session; reduced motion skips it
const loader = $('#loader');
let seen = false;
try { seen = sessionStorage.getItem('hy-intro') === '1'; sessionStorage.setItem('hy-intro', '1'); } catch {}
if (loader && seen) { loader.remove(); root.classList.add('loaded'); }
else if (loader) {
  root.classList.add('is-loading');
  requestAnimationFrame(() => requestAnimationFrame(() => loader.classList.add('play')));
  Promise.all([new Promise(r => setTimeout(r, reduced ? 0 : 4000)), Promise.race([first, new Promise(r => setTimeout(r, 5000))])]).then(() => {
    loader.classList.add('open');
    root.classList.replace('is-loading', 'loaded');
    setTimeout(() => loader.remove(), 1400);
  });
} else root.classList.add('loaded');

// Scroll: sky → façade → doors → fountain, then «فندق يوسف» appears
const start = $('#heroStart'), end = $('#heroEnd'), veil = $('#heroVeil'), bar = $('#heroBar'), header = $('.site-header');
const clamp = v => Math.min(1, Math.max(0, v));
function render(p) {
  draw(clamp(p / FILM_END) * (COUNT - 1));
  const s = 1 - clamp(p / 0.1), e = clamp((p - FILM_END) / 0.14);
  start.style.opacity = s;
  start.style.transform = `translateY(${(1 - s) * -30}px)`;
  end.style.opacity = e;
  end.style.visibility = e > 0.01 ? 'visible' : 'hidden';
  end.classList.toggle('on', e > 0.35);
  veil.style.setProperty('--dim', e);
  bar.style.transform = `scaleX(${p})`;
}
if (reduced) {
  hero.classList.add('static');
  first.then(() => draw(COUNT - 1));
  render(1);
  const onScroll = () => header.classList.toggle('over-hero', hero.getBoundingClientRect().bottom > 80); // white text only over the photo
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
} else {
  let target = 0, shown = 0, raf = 0;
  const tick = () => {
    shown += (target - shown) * 0.2;
    if (Math.abs(target - shown) < 5e-4) shown = target;
    moving = shown !== target;
    render(shown);
    raf = shown !== target ? requestAnimationFrame(tick) : 0;
  };
  const onScroll = () => {
    const run = hero.offsetHeight - innerHeight, y = -hero.getBoundingClientRect().top;
    target = clamp(y / run);
    root.classList.toggle('in-hero', y < run);
    header.classList.toggle('over-hero', y < run - 10);
    raf ||= requestAnimationFrame(tick);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  render(target);
}
