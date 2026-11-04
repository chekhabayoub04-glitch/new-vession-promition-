// content.js — venues.html + restaurant.html
import { $, $$, json, ready, pic, esc, fmt, waLink, waForm, lines, reveal, ld, ROOT, ASK } from './main.js';

const send = f => open(waLink(lines(f)), '_blank', 'noopener');

ready.then(async () => {
  $$('form[data-wa]').forEach(f => waForm(f, send));

  const zones = $('#zones');
  if (zones) {
    const venues = await json('data/venues.json'), tpl = $('#zone-tpl').content.firstElementChild;
    zones.replaceChildren(...venues.map((v, i) => {
      const z = tpl.cloneNode(true), set = (k, h) => ($(`[data-z=${k}]`, z).innerHTML = h);
      z.id = v.id;
      $('.zone-media', z).innerHTML = v.images.map((s, k) => `<div class="slot">${pic(s, `${v.name} — صورة ${k + 1}`, k ? '30vw' : '(min-width: 860px) 40vw, 90vw')}</div>`).join('');
      set('n', `0${i + 1}`); set('name', esc(v.name)); set('line', esc(v.line));
      set('uses', v.uses.map(u => `<li>${esc(u)}</li>`).join(''));
      set('cap', v.capacity ? `${fmt(v.capacity)} ضيف` : ASK);
      set('lay', v.layouts.map(esc).join(' · ')); set('eq', v.equipment.map(esc).join(' · '));
      $('[data-z=lay-box]', z).hidden = !v.layouts.length; $('[data-z=eq-box]', z).hidden = !v.equipment.length;
      $('a', z).onclick = () => ($('#quote form').occasion.value = v.uses[0]);
      return z;
    }));
  }

  const menuEl = $('#menu');
  if (!menuEl) return reveal();
  const menu = await json('data/menu.json');
  const items = menu.sections.flatMap(s => s.items.map(it => ({ ...it, s: s.id })));
  const name = it => (it.name ? esc(it.name) : '<span class="tbd">طبق يُضاف قريباً</span>');
  const cost = it => (it.price ? `${fmt(it.price)} دج` : ASK);

  const one = '12345678'.replace(/./g, k => `<li><div class="slot">${pic(`dish-0${k}`, '', '220px')}</div></li>`);
  $('#marquee ul').innerHTML = one + one;

  const rail = $('#rail'), tabs = $('#rail-tabs'), [prev, next] = $$('#rail-arrows button');
  let sec = menu.sections[0].id;
  const ends = () => { const x = Math.abs(rail.scrollLeft), max = rail.scrollWidth - rail.clientWidth; prev.disabled = x < 4; next.disabled = x > max - 4; };
  const step = d => rail.scrollBy({ left: -d * (rail.firstElementChild?.offsetWidth || 300), behavior: 'smooth' });
  const draw = () => {
    rail.innerHTML = items.filter(it => it.s === sec).map(it => `<article class="dish"><div class="slot">${pic(it.img, it.name || '', '340px')}</div><div><h3>${name(it)}</h3><p class="price">${cost(it)}</p>${it.desc ? `<p class="muted">${esc(it.desc)}</p>` : ''}</div></article>`).join('');
    $$('button', tabs).forEach(b => b.setAttribute('aria-pressed', b.dataset.s === sec));
    rail.scrollLeft = 0; ends();
  };
  tabs.innerHTML = menu.sections.map(s => `<button type="button" data-s="${s.id}">${esc(s.name)}</button>`).join('');
  tabs.onclick = e => { const b = e.target.closest('[data-s]'); if (b) { sec = b.dataset.s; draw(); } };
  prev.onclick = () => step(-1); next.onclick = () => step(1);
  rail.onscroll = ends;
  rail.onkeydown = e => { const d = { ArrowLeft: 1, ArrowRight: -1 }[e.key]; d && (e.preventDefault(), step(d)); };
  draw();

  menuEl.innerHTML = menu.sections.map(s => `<section aria-labelledby="m-${s.id}"><h2 id="m-${s.id}">${esc(s.name)}</h2><ul>${s.items.map(it => `<li><span>${name(it)}</span><b>${cost(it)}</b>${it.desc ? `<small>${esc(it.desc)}</small>` : ''}</li>`).join('')}</ul></section>`).join('');
  const secs = menu.sections.map(s => ({ '@type': 'MenuSection', name: s.name, hasMenuItem: s.items.filter(it => it.name).map(it => ({ '@type': 'MenuItem', name: it.name, description: it.desc || undefined,
    offers: it.price ? { '@type': 'Offer', price: it.price, priceCurrency: 'DZD' } : undefined })) })).filter(s => s.hasMenuItem.length);
  ld({ '@context': 'https://schema.org', '@type': 'Restaurant', name: 'مطعم فندق يوسف', url: `${ROOT}restaurant.html`, address: { '@type': 'PostalAddress', addressRegion: 'خنشلة', addressCountry: 'DZ' }, servesCuisine: menu.servesCuisine, acceptsReservations: false,
    priceRange: menu.priceRange || undefined, hasMenu: secs.length ? { '@type': 'Menu', hasMenuSection: secs } : undefined });
  reveal();
});
