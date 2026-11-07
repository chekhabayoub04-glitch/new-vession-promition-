// hero.js — intro (mark draws, name appears, curtain opens) + the drone film scrubbed by scroll
// 125 WebP frames drawn on a canvas (portrait crop on phones): smooth on every phone, holds on the fountain.
import { $, reduced, BASE } from './main.js?v=2ee4318a';

const root = document.documentElement, hero = $('.hero'), canvas = $('#heroCanvas');
const COUNT = 125, FILM_END = 0.68; // the film reaches the fountain at 68 % of the scroll; the rest holds on it
const dir = matchMedia('(max-aspect-ratio: 4/5)').matches ? 'm' : 'd';
const frames = [], asked = new Set(), ctx = canvas.getContext('2d');
let current = -1, want = 0, firstReady;
const first = new Promise(r => (firstReady = r));

function load(i) {
  if (asked.has(i)) return;
  asked.add(i);
  const im = new Image();
  im.decoding = 'async';
  // decoded off the main thread before it can be drawn: drawing a still-compressed frame decodes it on the spot (a stall)
  const ready = () => { frames[i] = im; i || firstReady(); if (i === want || current < 0) { current = -1; draw(want); } };
  im.onload = () => (im.decode ? im.decode().catch(() => {}).then(ready) : ready());
  im.src =`${BASE}video/frames/${dir}/${String(i + 1).padStart(3, '0')}.webp`;
}
// First frame, then the fountain, then coarse-to-fine so scrubbing works before everything has arrived.
// Mobile data: only every 8th frame (≈ 0.5 MB) loads while the visitor looks at the opening shot; the fine frames
// follow on the first scroll or touch — a visitor who never scrolls the film never pays for it.
// Data Saver / 2G: the film stops at every 4th frame (still smooth enough, a third of the weight).
const net = navigator.connection || {}, lite = net.saveData || /2g/.test(net.effectiveType || '');
// frames are asked for in small slices (≤ 6 ms each, in idle time) — a hundred image requests in one go blocked the
// first scroll on mid-range phones for ~90 ms
const queue = [], idle = window.requestIdleCallback ? f => requestIdleCallback(f, { timeout: 150 }) : f => setTimeout(f, 16);
const pump = () => { const t = performance.now(); while (queue.length && performance.now() - t < 6) load(queue.shift()); queue.length && idle(pump); };
const steps = s => { const busy = queue.length; s.forEach(k => { for (let i = 0; i < COUNT; i += k) asked.has(i) || queue.includes(i) || queue.push(i); }); busy || idle(pump); };
load(0); load(COUNT - 1);
first.then(() => (window.requestIdleCallback || setTimeout)(() => steps([16, 8])));
const more = () => { removeEventListener('scroll', more); removeEventListener('touchstart', more); first.then(() => steps(lite ? [4] : [4, 2, 1])); };
addEventListener('scroll', more, { passive: true }); addEventListener('touchstart', more, { passive: true });

const near = i => { for (let d = 0; d < COUNT; d++) { if (frames[i - d]) return frames[i - d]; if (frames[i + d]) return frames[i + d]; } };
function draw(i) {
  want = i;
  const im = near(i);
  if (!im || (i === current && im === frames[i])) return;
  current = i;
  const cw = canvas.width, ch = canvas.height, k = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
  ctx.drawImage(im, (cw - im.naturalWidth * k) / 2, (ch - im.naturalHeight * k) / 2, im.naturalWidth * k, im.naturalHeight * k);
}
function size() {
  // phone frames are 560×720: a 3× canvas only burns GPU, 1.5× is already sharper than the frames
  const d = Math.min(devicePixelRatio || 1, dir === 'm' ? 1.5 : 2), w = Math.round(canvas.clientWidth * d), h = Math.round(canvas.clientHeight * d);
  if (w === canvas.width && h === canvas.height) return;
  canvas.width = w; canvas.height = h; current = -1; draw(want);
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
  draw(Math.round(clamp(p / FILM_END) * (COUNT - 1)));
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
