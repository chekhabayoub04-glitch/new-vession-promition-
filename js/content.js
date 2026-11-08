// content.js — venues.html + restaurant.html
import { $, $$, json, ready, pic, hasImg, esc, icon, fmt, reveal, ld, ROOT, ASK, tt } from './main.js?v=54e25dbd';
import { lightbox } from './gallery.js?v=54e25dbd';

ready.then(async () => {
  const zones = $('#zones');
  if (zones) {
    const venues = await json('data/venues.json'), tpl = $('#zone-tpl').content.firstElementChild;
    zones.replaceChildren(...venues.map((v, i) => {
      const z = tpl.cloneNode(true), set = (k, h) => ($(`[data-z=${k}]`, z).innerHTML = h);
      z.id = v.id;
      $('.zone-media', z).innerHTML = v.images.map((s, k) => `<div class="slot">${pic(s, `${v.name} — ${tt('صورة', 'photo', 'photo')} ${k + 1}`, k ? '30vw' : '(min-width: 860px) 40vw, 90vw')}</div>`).join('')
        + (v.pano ? `<div class="slot pano pano-tile" data-initial="${v.pano[0]}" data-only="${v.pano}" role="region" aria-label="${esc(v.name)} — ${tt('جولة 360°', 'visite 360°', '360° tour')}">${pic(v.panoPoster, '', '30vw')}<p class="pano-hint">${icon('hand')}${tt('اسحب للاستكشاف', 'Faites glisser pour explorer', 'Drag to explore')}</p><button type="button" class="pano-start" aria-label="${tt(`ادخل ${esc(v.name)} بزاوية 360°`, `Entrer dans : ${esc(v.name)}, en 360°`, `Step inside the ${esc(v.name)} in 360°`)}">${icon('rotate-3d')}<b>360°</b></button><div class="pano-scenes" role="group" aria-label="${tt('اختر الزاوية', 'Choisir l\'angle', 'Choose the view')}"></div></div>` : '');
      set('n', `0${i + 1}`); set('name', esc(v.name)); set('line', esc(v.line));
      set('uses', v.uses.map(u => `<li>${esc(u)}</li>`).join(''));
      set('cap', v.capacity ? `${typeof v.capacity === 'number' ? `${fmt(v.capacity)} ${tt('شخصاً', 'personnes', 'guests')}` : esc(v.capacity)}` : ASK);
      set('lay', v.layouts.map(esc).join(' · ')); set('eq', v.equipment.map(esc).join(' · '));
      $('[data-z=lay-box]', z).hidden = !v.layouts.length; $('[data-z=eq-box]', z).hidden = !v.equipment.length;
      return z;
    }));
  }

  const menuEl = $('#menu');
  if (!menuEl) return reveal();
  const menu = await json('data/menu.json');
  const items = menu.sections.flatMap(s => s.items.map(it => ({ ...it, s: s.id })));
  // until the printed menu is transcribed (names + prices), the dishes show by their photo caption and without a price,
  // in one rail (no course tabs), and the price list stays hidden — no «coming soon» rows on a finished site
  const named = items.some(it => it.name);
  const name = it => esc(it.name || it.imgAlt || '');
  const cost = it => (it.price ? `${fmt(it.price)} ${tt('دج', 'DA', 'DZD')}` : '');

  // the restaurant and its dishes in turn — room, plate, room, plate… — photos only (no dish names), tap to enlarge
  const { items: pics } = await json('data/gallery.json');
  const dining = pics.filter(g => g.cat === 'dining' && hasImg(g.slot)), food = dining.filter(g => g.slot.startsWith('dish')), room = dining.filter(g => !g.slot.startsWith('dish'));
  const mixed = Array.from({ length: Math.max(food.length, room.length) }, (_, k) => [room[k], food[k]]).flat().filter(Boolean);
  const rail = $('#rail');
  // a grid, every photo in view at once; the room shots and the plates alternate, portraits and landscapes in turn
  rail.innerHTML = mixed.map((g, i) => `<button type="button" class="reveal" data-i="${i}" aria-label="${esc(g.alt)}"><span class="slot" style="--r:${i % 3 ? '4 / 3' : '4 / 5'}">${pic(g.slot, '', '(min-width: 900px) 33vw, 50vw')}</span></button>`).join('');
  rail.onclick = e => { const b = e.target.closest('[data-i]'); b && lightbox(mixed, +b.dataset.i, b); };

  const menuSec = $('#menu-sec');
  menuSec.hidden = !named;
  menuSec.previousElementSibling?.classList.contains('divider') && (menuSec.previousElementSibling.hidden = !named);
  const card = $('[data-slot="menu-card"]', menuSec);
  card && (card.parentElement.hidden = !hasImg('menu-card'));
  menuEl.innerHTML = menu.sections.map(s => `<section aria-labelledby="m-${s.id}"><h2 id="m-${s.id}">${esc(s.name)}</h2><ul>${s.items.filter(it => it.name).map(it => `<li><span>${name(it)}</span><b>${cost(it) || ASK}</b>${it.desc ? `<small>${esc(it.desc)}</small>` : ''}</li>`).join('')}</ul></section>`).join('');
  const secs = menu.sections.map(s => ({ '@type': 'MenuSection', name: s.name, hasMenuItem: s.items.filter(it => it.name).map(it => ({ '@type': 'MenuItem', name: it.name, description: it.desc || undefined,
    offers: it.price ? { '@type': 'Offer', price: it.price, priceCurrency: 'DZD' } : undefined })) })).filter(s => s.hasMenuItem.length);
  ld({ '@context': 'https://schema.org', '@type': 'Restaurant', name: tt('مطعم فندق يوسف', 'Restaurant de l\'Hôtel Youcef', 'Hotel Youcef Restaurant'), url: `${ROOT}restaurant.html`, address: { '@type': 'PostalAddress', addressRegion: tt('خنشلة', 'Khenchela', 'Khenchela'), addressCountry: 'DZ' }, servesCuisine: menu.servesCuisine, acceptsReservations: false,
    priceRange: menu.priceRange || undefined, hasMenu: secs.length ? { '@type': 'Menu', hasMenuSection: secs } : undefined });
  reveal();
});
