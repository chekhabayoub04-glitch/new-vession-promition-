// rooms.js — cards, comparison table, room.html
import { $, $$, json, ready, pic, hasImg, icon, esc, fmt, roomName, reveal, site, ld, ROOT, ASK, tt, step } from './main.js?v=54e25dbd';
import { lightbox } from './gallery.js?v=54e25dbd';

const AMEN = { 'تكييف': 'air-vent', 'حمام خاص': 'shower-head', 'حوض استحمام': 'shower-head', 'واي فاي مجاني': 'wifi', 'تلفاز': 'tv', 'خزنة': 'lock', 'ميني بار': 'refrigerator', 'الفطور مشمول': 'coffee',
  'ركن شاي وقهوة': 'coffee', 'شرفة': 'sun', 'صالون جلوس': 'sofa', 'صالون واسع': 'sofa', 'صالون طعام': 'utensils', 'كرسي تدليك': 'armchair',
  'Climatisation': 'air-vent', 'Baignoire': 'shower-head', 'Wi-Fi gratuit': 'wifi', 'Télévision': 'tv', 'Coffre-fort': 'lock', 'Petit-déjeuner inclus': 'coffee',
  'Coin thé et café': 'coffee', 'Balcon': 'sun', 'Coin salon': 'sofa', 'Vaste salon': 'sofa', 'Salle à manger': 'utensils', 'Fauteuil de massage': 'armchair',
  'Air conditioning': 'air-vent', 'Bathtub': 'shower-head', 'Free Wi-Fi': 'wifi', 'TV': 'tv', 'Safe': 'lock', 'Breakfast included': 'coffee',
  'Tea and coffee corner': 'coffee', 'Balcony': 'sun', 'Seating area': 'sofa', 'Spacious lounge': 'sofa', 'Dining lounge': 'utensils', 'Massage chair': 'armchair' };
const val = v => (v == null || v === '' ? ASK : esc(v));
const size = r => (r.sizeM2 ? `${r.sizeM2} ${tt('م²', 'm²', 'm²')}` : ASK);
const ppl = n => (n ? tt(`${n} ${n > 2 ? 'أشخاص' : n > 1 ? 'شخصان' : 'شخص'}`, `${n} ${n > 1 ? 'personnes' : 'personne'}`, `${n} ${n > 1 ? 'guests' : 'guest'}`) : ASK);
const price = r => `<p class="price">${r.priceFrom ? `${fmt(r.priceFrom)} ${r.currency} <small>/ ${tt('الليلة', 'nuit', 'night')}</small>` : `<span class="tbd">${tt('السعر عند الطلب', 'Prix sur demande', 'Price on request')}</span>`}</p>`;

const specs = r => [r.beds && ['bed-double', esc(r.beds)], r.maxGuests && ['users', ppl(r.maxGuests)], r.sizeM2 && ['maximize-2', size(r)], ...r.amenities.map(a => [AMEN[a] || 'check', esc(a)])]
  .filter(Boolean).slice(0, 3).map(([n, t]) => `<li>${icon(n)}${t}</li>`).join('');
export const card = (r, i) => `<article class="card reveal">
  <div class="slot vt-img" style="--vt:${r.id}">${pic(r.images[0], roomName(r, i), '(min-width: 900px) 280px, 80vw')}</div>
  <h3>${roomName(r, i)}</h3>${price(r)}
  <ul class="specs">${specs(r)}</ul>
  <a class="btn btn--ghost btn--sm" href="room.html?id=${r.id}">${tt('تفاصيل الغرفة', 'Voir la chambre', 'View room')}</a></article>`;


function roomPage(rooms, el) {
  const i = Math.max(0, rooms.findIndex(r => r.id === new URLSearchParams(location.search).get('id')));
  const r = rooms[i], name = roomName(r, i), set = (k, h) => $$(`[data-r="${k}"]`, el).forEach(n => (n.innerHTML = h));
  const shots = r.images.map((s, k) => ({ slot: s, alt: `${name} — ${r.alts?.[k] || `${tt('صورة', 'photo', 'photo')} ${k + 1}`}` })), real = shots.filter(s => hasImg(s.slot));
  const line = r.shortLine || tt('غرفة مكيّفة بحمّام خاص وواي فاي مجاني، في فندق يوسف بولاية خنشلة.', 'Chambre climatisée avec salle de bains privée et Wi-Fi gratuit, à l\'Hôtel Youcef, Khenchela.', 'Air-conditioned room with a private bathroom and free Wi-Fi at Hotel Youcef, Khenchela.');
  const bf = r.breakfastPerPerson ?? site.breakfastPerPerson;
  document.title = `${name} — ${tt('فندق يوسف، خنشلة', 'Hôtel Youcef, Khenchela', 'Hotel Youcef, Khenchela')}`;
  $('.crumbs [aria-current]', el).textContent = name;
  // each room is its own page for Google and for link previews: canonical, hreflang, og:url and description carry the id
  const url = `${ROOT}room.html?id=${r.id}`;
  $('link[rel=canonical]') || document.head.insertAdjacentHTML('beforeend', '<link rel="canonical">');
  $('link[rel=canonical]').href = url;
  $$('link[rel=alternate][hreflang]').forEach(l => (l.href = `${l.href.split('?')[0]}?id=${r.id}`));
  $('meta[property="og:url"]')?.setAttribute('content', url);
  $$('meta[name=description], meta[property="og:description"], meta[name="twitter:description"]').forEach(m => m.setAttribute('content', line));
  $$('meta[property="og:title"], meta[name="twitter:title"]').forEach(m => m.setAttribute('content', document.title));
  set('name', name); set('line', esc(line)); set('size', size(r)); set('beds', val(r.beds)); set('guests', ppl(r.maxGuests));
  set('view', val(r.view)); set('floor', val(r.floor)); set('price', price(r));
  const known = { size: r.sizeM2, beds: r.beds, guests: r.maxGuests, view: r.view, floor: r.floor };
  $$('.spec-row > div', el).forEach(d => (d.hidden = !known[$('b', d).dataset.r]));
  set('breakfast', r.breakfastIncluded ? tt('الفطور مشمول · السعر شامل الرسوم (TTC)', 'Petit-déjeuner inclus · prix TTC', 'Breakfast included · taxes included') : bf ? tt(`الفطور +${fmt(bf)} دج للشخص`, `Petit-déjeuner +${fmt(bf)} DA par personne`, `Breakfast +${fmt(bf)} DZD per person`) : tt('الفطور: السعر عند الطلب', 'Petit-déjeuner : prix sur demande', 'Breakfast: price on request'));
  set('amen', r.amenities.map(a => `<li>${icon(AMEN[a] || 'check')}${esc(a)}</li>`).join(''));
  set('proof', shots.slice(1).map(s => `<div class="slot">${pic(s.slot, s.alt, '260px')}</div>`).join(''));
  set('others', rooms.map((x, k) => (x === r ? '' : card(x, k))).filter(Boolean).slice(0, 3).join(''));
  $$('[data-book]').forEach(a => ((a.dataset.book = r.id), (a.dataset.subject = tt(`طلب حجز: ${name} — فندق يوسف`, `Demande de réservation : ${name} — Hôtel Youcef`, `Booking request: ${name} — Hotel Youcef`))));

  const main = $('.gal-main', el), thumbs = $('.thumbs', el);
  main.style.setProperty('--vt', r.id);
  thumbs.innerHTML = shots.map((s, k) => `<button type="button" data-k="${k}" aria-label="${s.alt}"><span class="slot">${pic(s.slot, '', '104px')}</span></button>`).join('');
  const tb = $$('button', thumbs);
  const show = k => { main.dataset.k = k; main.innerHTML = pic(shots[k].slot, shots[k].alt, '(min-width: 900px) 800px, 100vw', true); tb.forEach((b, n) => b.setAttribute('aria-current', n === k)); };
  tb.forEach((b, k) => (b.onclick = () => show(k)));
  thumbs.onkeydown = e => { const d = step(e.key); if (d) { const k = (tb.indexOf(document.activeElement) + d + tb.length) % tb.length; tb[k].focus(); show(k); } };
  main.onclick = () => lightbox(real, Math.max(0, real.indexOf(shots[main.dataset.k])), main);
  show(0);

  const room = { '@context': 'https://schema.org', '@type': 'HotelRoom', name, description: line, containedInPlace: { '@type': 'Hotel', name: tt('فندق يوسف', 'Hôtel Youcef', 'Hotel Youcef'), url: ROOT },
    amenityFeature: r.amenities.map(a => ({ '@type': 'LocationFeatureSpecification', name: a, value: true })), image: real.map(s => `${ROOT}img/${s.slot}.avif`) };
  if (r.beds) room.bed = r.beds;
  if (r.maxGuests) room.occupancy = { '@type': 'QuantitativeValue', maxValue: r.maxGuests };
  if (r.sizeM2) room.floorSize = { '@type': 'QuantitativeValue', value: r.sizeM2, unitCode: 'MTK' };
  if (r.priceFrom) room.offers = { '@type': 'Offer', priceSpecification: { '@type': 'UnitPriceSpecification', price: r.priceFrom, priceCurrency: 'DZD', unitText: 'NIGHT' } };
  ld(room);
  ld({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [[tt('الرئيسية', 'Accueil', 'Home'), ''], [tt('الغرف', 'Chambres', 'Rooms'), 'rooms.html'], [name, `room.html?id=${r.id}`]]
    .map(([n, u], k) => ({ '@type': 'ListItem', position: k + 1, name: n, item: ROOT + u })) });
}

ready.then(() => json('data/rooms.json')).then(rooms => {
  const fill = (s, h) => { const n = $(s); if (n) n.innerHTML = h; };
  fill('#home-rooms', rooms.slice(0, 4).map(card).join(''));
  fill('#all-rooms', rooms.map(card).join(''));
  // a column shows once at least one room has the value
  const has = { size: rooms.some(r => r.sizeM2), guests: rooms.some(r => r.maxGuests), view: rooms.some(r => r.view) };
  $$('[data-col]').forEach(th => (th.hidden = !has[th.dataset.col]));
  const td = (k, h) => (has[k] ? `<td>${h}</td>` : '');
  fill('#compare', rooms.map((r, i) => `<tr><th scope="row"><a href="room.html?id=${r.id}">${roomName(r, i)}</a></th><td>${r.priceFrom ? `${fmt(r.priceFrom)} ${r.currency}` : ASK}</td>${td('size', size(r))}<td>${val(r.beds)}</td>${td('guests', ppl(r.maxGuests))}${td('view', val(r.view))}</tr>`).join(''));
  if ($('#room')) roomPage(rooms, $('#room'));
  reveal();
});
