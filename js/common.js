/* ===================================================
   HOTEL YOUCEF · common.js — shared by every page
   =================================================== */

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Smooth scroll (Lenis) wired into GSAP ScrollTrigger ──
let lenis = null;
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true }); // the phone address bar showing/hiding must not re-layout the hero
}
if (!REDUCED && window.Lenis) {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  if (window.gsap) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const loop = t => { lenis.raf(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
}

function scrollToTarget(target) {
  const el = typeof target === 'string' ? $(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -70 });
  else el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
}

document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.getAttribute('href').length < 2) return;
  const el = $(a.getAttribute('href'));
  if (!el) return;
  e.preventDefault();
  closeMenu();
  scrollToTarget(el);
});

// ── Header & menu ──
const header = $('#header');
const menuBtn = $('#menuBtn');
function closeMenu() {
  document.body.classList.remove('menu-open');
  menuBtn?.setAttribute('aria-expanded', 'false');
}
menuBtn?.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

let lastY = 0;
function onScroll() {
  const y = scrollY;
  header?.classList.toggle('scrolled', y > 40);
  header?.classList.toggle('hidden', y > lastY && y > 600 && !document.body.classList.contains('menu-open'));
  lastY = y;
  const bar = $('#scrollBar');
  if (bar) bar.style.transform = `scaleX(${y / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Contact bindings: <a data-hotel="phone|email|address|wa|maps|directions"> ──
function bindContacts(root = document) {
  $$('.wa-ico', root).forEach(el => { if (!el.innerHTML) el.innerHTML = WA_ICON; });
  $$('[data-hotel]', root).forEach(el => {
    const k = el.dataset.hotel;
    if (k === 'phone') { el.href = `tel:${HOTEL.phoneRaw}`; if (!el.children.length) el.textContent = HOTEL.phone; }
    if (k === 'email') { el.href = `mailto:${HOTEL.email}`; el.textContent = HOTEL.email; }
    if (k === 'address') el.textContent = HOTEL.address;
    if (k === 'wa') el.href = waLink();
    if (k === 'maps') el.href = HOTEL.mapsUrl;
    if (k === 'directions') el.href = HOTEL.directionsUrl;
    if (k === 'checkin') el.textContent = HOTEL.checkIn;
    if (k === 'checkout') el.textContent = HOTEL.checkOut;
  });
  const year = $('#year', root);
  if (year) year.textContent = new Date().getFullYear();
}

// ── Toast ──
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

// ── Motion on scroll ──
// data-reveal: fade up · data-split: words rise one by one (whole words, so Arabic letters stay joined)
// data-clip: image opens like a curtain · data-pop: icon tiles pop in · data-count: numbers count up
function splitWords(el) {
  if (el.dataset.splitDone) return;
  el.dataset.splitDone = '1';
  let i = 0;
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.append(part);
        const w = document.createElement('span');
        w.className = 'w';
        w.innerHTML = `<span style="--i:${i++}">${part}</span>`;
        frag.append(w);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
  });
  walk(el);
}
function countUp(el) {
  const end = +el.dataset.count, suf = el.dataset.suffix || '';
  if (REDUCED) { el.textContent = end + suf; return; }
  const t0 = performance.now(), dur = 1400;
  const step = t => {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(end * e) + suf;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const revealIO = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      $$('[data-count]', en.target).forEach(countUp);
      revealIO.unobserve(en.target);
    }), { rootMargin: '0px 0px -10% 0px' })
  : null;
function observeReveals(root = document) {
  $$('[data-split]', root).forEach(splitWords);
  const groups = new Map();
  $$('[data-reveal]:not(.in), [data-split]:not(.in), [data-clip]:not(.in), [data-pop]:not(.in)', root).forEach(el => {
    // stagger siblings that share a parent
    const n = groups.get(el.parentElement) || 0;
    groups.set(el.parentElement, n + 1);
    el.style.setProperty('--d', `${Math.min(n, 6) * 80}ms`);
    revealIO && !REDUCED ? revealIO.observe(el) : (el.classList.add('in'), $$('[data-count]', el).forEach(countUp));
  });
}
// Gentle parallax on framed photos (desktop only — phones stay still and smooth)
function parallax(root = document) {
  if (REDUCED || !window.gsap || matchMedia('(max-width: 760px)').matches) return;
  $$('[data-parallax]', root).forEach(img => gsap.fromTo(img, { yPercent: -7 }, {
    yPercent: 7, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
  }));
}

// ── Room card ──
function roomCardHTML(r) {
  const people = r.guests > 2 ? 'أشخاص' : r.guests === 2 ? 'شخصان' : 'شخص';
  return `
  <article class="room-card" data-reveal>
    <a class="room-media" href="room.html?id=${r.id}" aria-label="${r.name}">
      <img loading="lazy" decoding="async" src="${pic(img(r.photos[0], 900, 680))}" alt="${r.name}">
      ${r.popular ? '<span class="chip chip-gold">الأكثر طلباً</span>' : ''}
      ${r.pano ? '<span class="chip chip-360"><i data-lucide="rotate-3d"></i>360°</span>' : ''}
      <span class="room-price"><b>${fmt(r.price)}</b> ${HOTEL.currency} <small>/ الليلة</small></span>
    </a>
    <div class="room-body">
      <p class="room-latin">${r.latin}</p>
      <h3 class="room-title"><a href="room.html?id=${r.id}">${r.name}</a></h3>
      <p class="room-short">${r.short}</p>
      <ul class="specs">
        <li><i data-lucide="users"></i>${r.guests} ${people}</li>
        <li><i data-lucide="maximize-2"></i>${r.size} م²</li>
        <li><i data-lucide="bed-double"></i>${r.bed}</li>
      </ul>
      <div class="room-actions">
        <a class="link-arrow" href="room.html?id=${r.id}">التفاصيل <i data-lucide="arrow-left"></i></a>
        <a class="btn btn-dark btn-sm" href="${document.body.classList.contains('page-home') ? '#booking' : 'index.html#booking'}" data-book="${r.id}">احجز</a>
      </div>
    </div>
  </article>`;
}

// ── Lightbox (shared) ──
const Lightbox = (() => {
  const lb = $('#lightbox');
  if (!lb) return { open() {} };
  const imgEl = $('.lb-stage img', lb), cap = $('.lb-cat', lb), count = $('.lb-count', lb), thumbs = $('.lb-thumbs', lb);
  let items = [], i = 0, lastFocus = null;
  function show(k) {
    i = (k + items.length) % items.length;
    imgEl.src = items[i].src.replace(/w=\d+/, 'w=1800');
    imgEl.alt = items[i].alt;
    cap.textContent = items[i].alt;
    count.textContent = `${i + 1} / ${items.length}`;
    $$('button', thumbs).forEach((b, n) => b.setAttribute('aria-current', String(n === i)));
    $$('button', thumbs)[i]?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
  function open(list, k = 0) {
    items = list;
    thumbs.innerHTML = items.map((it, n) => `<button type="button" aria-label="صورة ${n + 1}"><img src="${it.src.replace(/w=\d+/, 'w=200')}" alt=""></button>`).join('');
    $$('button', thumbs).forEach((b, n) => b.addEventListener('click', () => show(n)));
    lastFocus = document.activeElement;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    lenis?.stop();
    show(k);
    $('.lb-close', lb).focus();
  }
  function close() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    lenis?.start();
    lastFocus?.focus();
  }
  $('.lb-close', lb).addEventListener('click', close);
  $('.lb-prev', lb).addEventListener('click', () => show(i - 1));
  $('.lb-next', lb).addEventListener('click', () => show(i + 1));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) close(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i + 1); // RTL: left = next
    if (e.key === 'ArrowRight') show(i - 1);
    if (e.key === 'Tab') {
      const f = $$('button', lb);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  });
  let sx = 0;
  lb.addEventListener('touchstart', e => (sx = e.touches[0].clientX), { passive: true });
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(i + (dx > 0 ? 1 : -1)); });
  return { open };
})();

function refreshIcons() { window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } }); }

bindContacts();
refreshIcons();
