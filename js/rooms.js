// rooms.js — cards, comparison table, room.html
import { $, $$, json, ready, pic, hasImg, icon, esc, fmt, roomName, waLink, reveal, site, ld, ROOT, ASK } from './main.js';
import { lightbox } from './gallery.js';

const AMEN = { 'تكييف': 'air-vent', 'حمام خاص': 'shower-head', 'حوض استحمام': 'shower-head', 'واي فاي مجاني': 'wifi', 'تلفاز': 'tv', 'خزنة': 'lock', 'الفطور مشمول': 'coffee',
  'ركن شاي وقهوة': 'coffee', 'شرفة': 'sun', 'صالون جلوس': 'sofa', 'صالون واسع': 'sofa', 'صالون طعام': 'utensils', 'كرسي تدليك': 'armchair' };
const val = v => (v == null || v === '' ? ASK : esc(v));
const size = r => (r.sizeM2 ? `${r.sizeM2} م²` : ASK);
const ppl = n => (n ? `${n} ${n > 2 ? 'أشخاص' : n > 1 ? 'شخصان' : 'شخص'}` : ASK);
const price = r => `<p class="price">${r.priceFrom ? `${fmt(r.priceFrom)} ${r.currency} <small>/ الليلة</small>` : '<span class="tbd">السعر عند الطلب</span>'}</p>`;

const specs = r => [r.beds && ['bed-double', esc(r.beds)], r.maxGuests && ['users', ppl(r.maxGuests)], r.sizeM2 && ['maximize-2', size(r)], ...r.amenities.map(a => [AMEN[a] || 'check', esc(a)])]
  .filter(Boolean).slice(0, 3).map(([n, t]) => `<li>${icon(n)}${t}</li>`).join('');
export const card = (r, i) => `<article class="card reveal">
  <div class="slot vt-img" style="--vt:${r.id}">${pic(r.images[0], roomName(r, i), '(min-width: 900px) 280px, 80vw')}</div>
  <h3>${roomName(r, i)}</h3>${price(r)}
  <ul class="specs">${specs(r)}</ul>
  <a class="btn btn--ghost btn--sm" href="room.html?id=${r.id}">تفاصيل الغرفة</a></article>`;


function roomPage(rooms, el) {
  const i = Math.max(0, rooms.findIndex(r => r.id === new URLSearchParams(location.search).get('id')));
  const r = rooms[i], name = roomName(r, i), set = (k, h) => $$(`[data-r="${k}"]`, el).forEach(n => (n.innerHTML = h));
  const shots = r.images.map((s, k) => ({ slot: s, alt: `${name} — ${r.alts?.[k] || `صورة ${k + 1}`}` })), real = shots.filter(s => hasImg(s.slot));
  const line = r.shortLine || 'غرفة مكيّفة بحمّام خاص وواي فاي مجاني، في فندق يوسف بولاية خنشلة.';
  const bf = r.breakfastPerPerson ?? site.breakfastPerPerson;
  document.title = `${name} — فندق يوسف، خنشلة`;
  $('.crumbs [aria-current]', el).textContent = name;
  set('name', name); set('line', esc(line)); set('size', size(r)); set('beds', val(r.beds)); set('guests', ppl(r.maxGuests));
  set('view', val(r.view)); set('floor', val(r.floor)); set('price', price(r));
  set('breakfast', r.breakfastIncluded ? 'الفطور مشمول · السعر شامل الرسوم (TTC)' : bf ? `الفطور +${fmt(bf)} دج للشخص` : 'الفطور: السعر عند الطلب');
  set('amen', r.amenities.map(a => `<li>${icon(AMEN[a] || 'check')}${esc(a)}</li>`).join(''));
  set('proof', shots.slice(1).map(s => `<div class="slot">${pic(s.slot, s.alt, '260px')}</div>`).join(''));
  set('others', rooms.map((x, k) => (x === r ? '' : card(x, k))).filter(Boolean).slice(0, 3).join(''));
  $$('[data-room-wa]').forEach(a => (a.href = waLink(`السلام عليكم، أريد حجز «${name}» في فندق يوسف.`)));
  $$('[data-book]').forEach(a => (a.dataset.book = r.id));

  const main = $('.gal-main', el), thumbs = $('.thumbs', el);
  main.style.setProperty('--vt', r.id);
  thumbs.innerHTML = shots.map((s, k) => `<button type="button" data-k="${k}" aria-label="${s.alt}"><span class="slot">${pic(s.slot, '', '104px')}</span></button>`).join('');
  const tb = $$('button', thumbs);
  const show = k => { main.dataset.k = k; main.innerHTML = pic(shots[k].slot, shots[k].alt, '(min-width: 900px) 800px, 100vw', true); tb.forEach((b, n) => b.setAttribute('aria-current', n === k)); };
  tb.forEach((b, k) => (b.onclick = () => show(k)));
  thumbs.onkeydown = e => { const d = { ArrowLeft: 1, ArrowRight: -1 }[e.key]; if (d) { const k = (tb.indexOf(document.activeElement) + d + tb.length) % tb.length; tb[k].focus(); show(k); } };
  main.onclick = () => lightbox(real, Math.max(0, real.indexOf(shots[main.dataset.k])), main);
  show(0);

  const room = { '@context': 'https://schema.org', '@type': 'HotelRoom', name, description: line, containedInPlace: { '@type': 'Hotel', name: 'فندق يوسف', url: ROOT },
    amenityFeature: r.amenities.map(a => ({ '@type': 'LocationFeatureSpecification', name: a, value: true })), image: real.map(s => `${ROOT}img/${s.slot}.avif`) };
  if (r.beds) room.bed = r.beds;
  if (r.maxGuests) room.occupancy = { '@type': 'QuantitativeValue', maxValue: r.maxGuests };
  if (r.sizeM2) room.floorSize = { '@type': 'QuantitativeValue', value: r.sizeM2, unitCode: 'MTK' };
  if (r.priceFrom) room.offers = { '@type': 'Offer', priceSpecification: { '@type': 'UnitPriceSpecification', price: r.priceFrom, priceCurrency: 'DZD', unitText: 'NIGHT' } };
  ld(room);
  ld({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['الرئيسية', ''], ['الغرف', 'rooms.html'], [name, `room.html?id=${r.id}`]]
    .map(([n, u], k) => ({ '@type': 'ListItem', position: k + 1, name: n, item: ROOT + u })) });
}

ready.then(() => json('data/rooms.json')).then(rooms => {
  const fill = (s, h) => { const n = $(s); if (n) n.innerHTML = h; };
  fill('#home-rooms', rooms.slice(0, 4).map(card).join(''));
  fill('#all-rooms', rooms.map(card).join(''));
  fill('#compare', rooms.map((r, i) => `<tr><th scope="row"><a href="room.html?id=${r.id}">${roomName(r, i)}</a></th><td>${r.priceFrom ? `${fmt(r.priceFrom)} ${r.currency}` : ASK}</td><td>${size(r)}</td><td>${val(r.beds)}</td><td>${ppl(r.maxGuests)}</td><td>${val(r.view)}</td></tr>`).join(''));
  if ($('#room')) roomPage(rooms, $('#room'));
  reveal();
});
