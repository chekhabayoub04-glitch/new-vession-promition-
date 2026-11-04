// main.js — shared: data, image slots, contact fields, menu, booking sheet, forms, reveal, counters, hero film
const cache = {};
export const json = p => (cache[p] ||= fetch(p).then(r => (r.ok ? r.json() : Promise.reject(p))));
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = s => String(s ?? '').replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`);
export const icon = n => `<svg class="i" aria-hidden="true"><use href="img/icons.svg#${n}"/></svg>`;
export const fmt = n => n.toLocaleString('fr-FR').replace(/\s/g, ' ');
export const ASK = '<span class="tbd">عند الطلب</span>';
export const ROOT = 'https://chekhabayoub04-glitch.github.io/new-vession-promition-/';
export const ld = o => document.head.insertAdjacentHTML('beforeend', `<script type="application/ld+json">${JSON.stringify(o)}</script>`);
export const day = () => new Date().toISOString().slice(0, 10);
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export let site = {};
let IMG = {};
export const ready = Promise.all([json('data/site.json'), json('data/images.json').catch(() => ({}))]).then(([s, i]) => ((IMG = i), (site = s)));

// Listed slot → AVIF/WebP/JPEG; else the arch placeholder naming the file
export function pic(slot, alt = '', sizes = '100vw', eager) {
  const m = IMG[slot];
  if (!m) return `<span class="ph" ${alt ? `role="img" aria-label="${esc(alt)}"` : 'aria-hidden="true"'}><span>img/${slot}.avif</span></span>`;
  const set = f => m.widths.map(w => `img/${slot}-${w}.${f} ${w}w`).join();
  return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img src="img/${slot}-${m.widths.at(-1)}.jpg" srcset="${set('jpg')}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
}
export const hasImg = s => !!IMG[s];
export const roomName = (r, i) => r.name || `نوع الغرفة ${i + 1}`;
export const waLink = t => `https://wa.me/${(site.phoneE164 || '').replace(/\D/g, '')}?text=${encodeURIComponent(t)}`;

// Forms: data-err-* messages shown inline via aria-describedby
export function waForm(f, build) {
  f.noValidate = true;
  $$('[type=date]', f).forEach(d => (d.min = day()));
  f.onsubmit = e => {
    e.preventDefault();
    let first;
    for (const el of $$('[aria-describedby]', f)) {
      const v = el.value.trim(), d = el.dataset;
      const msg = !v ? d.errEmpty : (el.type === 'date' && v < day() ? d.errPast : el.min && +v < +el.min ? d.errEmpty : d.after && v <= f.elements[d.after].value ? d.errAfter : el.type === 'tel' && v.replace(/\D/g, '').length < 9 ? d.errEmpty : '') || '';
      el.setAttribute('aria-invalid', !!msg);
      $(`#${el.getAttribute('aria-describedby')}`).textContent = msg;
      first ||= msg && el;
    }
    first ? first.focus() : build(f, e.submitter);
  };
}
// Message: form data-wa, then «label: value» per field
export const lines = f => [f.dataset.wa, ...$$('[name]', f).map(el => `${$(`label[for="${el.id}"]`).textContent}: ${el.value}`)].join('\n');

function fillSite(s) {
  const link = (el, href, text) => (href ? ((el.href = href), (el.textContent = text)) : (el.removeAttribute('href'), (el.innerHTML = ASK)));
  for (const el of $$('[data-site]')) {
    const k = el.dataset.site;
    if (k === 'phone') link(el, s.phoneE164 && `tel:${s.phoneE164}`, s.phoneDisplay || s.phoneE164);
    else if (k === 'email') link(el, s.email && `mailto:${s.email}`, s.email);
    else if (k === 'wa') el.href = waLink(`السلام عليكم، أستفسر عن ${s.nameAr}.`);
    else if (k === 'reviews') el.href = s.reviewsUrl;
    else if (k === 'address') el.textContent = [s.streetAddress, s.region].filter(Boolean).join('، ');
    else if (k === 'year') el.textContent = new Date().getFullYear();
    else if (s[k]) el.textContent = s[k];
  }
}

// Reveal once, 40 ms stagger (max 6); counters: real stats only
const io = !reduced && new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target), count(e.target))), { rootMargin: '0px 0px -10% 0px' });
export function reveal(root = document) {
  const n = new Map();
  for (const el of $$('.reveal:not(.in)', root)) {
    const k = n.get(el.parentElement) || 0;
    n.set(el.parentElement, k + 1);
    el.style.setProperty('--stagger', `${Math.min(k, 5) * 40}ms`);
    io ? io.observe(el) : (el.classList.add('in'), count(el));
  }
}
function count(el) {
  for (const b of $$('[data-stat]', el.parentElement)) {
    const v = site.stats?.[b.dataset.stat];
    if (v == null) { b.closest('.stat').hidden = true; continue; }
    const t0 = performance.now(), step = t => { const k = reduced ? 1 : Math.min(1, (t - t0) / 280); b.textContent = Math.round(v * (1 - (1 - k) ** 4)); k < 1 && requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
}

const menu = $('.menu-btn'), setMenu = o => (document.body.classList.toggle('nav-open', o), menu.setAttribute('aria-expanded', o));
menu.onclick = () => setMenu(!document.body.classList.contains('nav-open'));
$('.nav').onclick = e => e.target.closest('a') && setMenu(false);
addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

// [data-book] opens the sheet; without JS it links to contact.html#booking
addEventListener('click', e => {
  const a = e.target.closest('[data-book]'), dlg = $('#book'), f = $('form.booking');
  if (!a || !f) return;
  e.preventDefault();
  if (a.dataset.book) f.room.value = a.dataset.book;
  dlg ? ((dlg.from = a), dlg.showModal()) : f.scrollIntoView();
});
$$('dialog').forEach(d => d.addEventListener('close', () => d.from?.focus()));
addEventListener('click', e => e.target.closest('[data-close]')?.closest('dialog').close());

// Hero film after load; skipped on phones, reduced motion, Save-Data, 2g/3g
const film = $('.hero__media'), c = navigator.connection;
film && addEventListener('load', () => (reduced || innerWidth <= 768 || c?.saveData || /2g|3g/.test(c?.effectiveType)
  ? film.remove() : ((film.preload = 'auto'), film.play().catch(() => film.remove()))));

ready.then(s => {
  fillSite(s);
  $$('[data-slot]').forEach(el => $('picture', el) || (el.innerHTML = pic(el.dataset.slot, el.dataset.alt, el.dataset.sizes)));
  reveal();
  if (document.body.dataset.ld) ld({ '@context': 'https://schema.org', '@type': 'Hotel', name: s.nameAr, alternateName: s.name, url: ROOT,
    telephone: s.phoneE164 || undefined, checkinTime: s.checkin || undefined, checkoutTime: s.checkout || undefined,
    image: ['facade', 'lobby-dome', 'pool', 'reception'].filter(hasImg).map(k => `${ROOT}img/${k}.avif`),
    address: { '@type': 'PostalAddress', addressRegion: 'خنشلة', addressCountry: 'DZ', streetAddress: s.streetAddress || undefined },
    geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng },
    amenityFeature: s.amenities.map(name => ({ '@type': 'LocationFeatureSpecification', name, value: true })) });
}, () => reveal());
