// gallery.js — lightbox, gallery filters, home strip
import { $, $$, json, ready, pic, hasImg, esc, reveal, step } from './main.js?v=bf57734e';

const dlg = $('dialog.lightbox');
let list = [], at = 0;
const go = d => {
  at = (at + d + list.length) % list.length;
  $('.lb-img', dlg).innerHTML = pic(list[at].slot, list[at].alt, '100vw', 1);
  $('figcaption', dlg).textContent = list[at].alt;
  $('.lb-count', dlg).textContent = `${at + 1} / ${list.length}`;
};
if (dlg) {
  $('.lb-prev', dlg).onclick = () => go(-1);
  $('.lb-next', dlg).onclick = () => go(1);
  dlg.onkeydown = e => { const d = step(e.key); d && (e.preventDefault(), go(d)); }; // RTL: ← = next
  dlg.onclick = e => e.target === dlg && dlg.close();
}
export function lightbox(items, i, from) {
  if (!dlg || !items.length) return;
  list = items; at = i; dlg.from = from;
  $$('.lb-nav', dlg).forEach(b => (b.hidden = items.length < 2));
  go(0); dlg.showModal();
}
const tile = (g, i, r, sizes) => `<button type="button" class="reveal" data-i="${i}"><span class="slot" style="--r:${r}">${pic(g.slot, '', sizes)}</span><span>${esc(g.alt)}</span></button>`;
const open = (b, shown) => { const real = shown.filter(g => hasImg(g.slot)); lightbox(real, Math.max(0, real.indexOf(shown[b.dataset.i])), b); };

ready.then(() => json('data/gallery.json')).then(({ cats, items }) => {
  const strip = $('#strip'), grid = $('#gallery-grid'), tabs = $('#gallery-tabs');
  if (strip) {
    // 8 photos taken in turn from each category (hotel, dining, pool, events, rooms…), so every part of the hotel shows
    const by = {}, shown = []; // (no Object.groupBy: iOS < 17.4)
    items.filter(g => hasImg(g.slot)).forEach(g => (by[g.cat] ||= []).push(g));
    const lists = Object.values(by);
    for (let k = 0; shown.length < 8 && lists.some(l => l[k]); k++) lists.forEach(l => l[k] && shown.length < 8 && shown.push(l[k]));
    strip.innerHTML = shown.map((g, i) => tile(g, i, '4 / 5', '320px')).join('');
    strip.onclick = e => { const b = e.target.closest('[data-i]'); b && open(b, shown); };
  }
  if (!grid) return reveal();
  let cat = new URLSearchParams(location.search).get('f') || 'all', shown;
  const draw = () => {
    shown = items.filter(g => cat === 'all' || g.cat === cat);
    grid.innerHTML = shown.map((g, i) => tile(g, i, i % 3 ? '4 / 3' : '4 / 5', '(min-width: 900px) 33vw, 50vw')).join('');
    $$('button', tabs).forEach(b => b.setAttribute('aria-pressed', b.dataset.f === cat));
    reveal(grid);
  };
  tabs.innerHTML = Object.entries(cats).filter(([k]) => k === 'all' || items.some(g => g.cat === k)).map(([k, v]) => `<button type="button" data-f="${k}">${v}</button>`).join('');
  tabs.onclick = e => { const b = e.target.closest('[data-f]'); if (b) { cat = b.dataset.f; draw(); } };
  grid.onclick = e => { const b = e.target.closest('[data-i]'); b && open(b, shown); };
  draw();
});
