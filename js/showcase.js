// showcase.js — «لحظات»: full-bleed photo film under the rooms. Chapters (dining · pool · suites · hotel) from data/showcase.json.
// Crossfade + slow Ken Burns; the gold bar is the timer (its animationend advances). Pause button, swipe, arrows,
// pauses off-screen / in a hidden tab / on mouse hover; reduced motion = no autoplay, no zoom.
import { $, $$, json, ready, pic, hasImg, esc, icon, reduced, tt, step, LTR } from './main.js?v=2ee4318a';

const sec = $('#moments');
if (sec) ready.then(() => json('data/showcase.json')).then(({ chapters }) => {
  const chaps = chapters.map(c => ({ ...c, slides: c.slides.filter(s => hasImg(s.slot)) })).filter(c => c.slides.length);
  if (!chaps.length) return;
  const all = chaps.flatMap((c, ci) => c.slides.map((s, k) => ({ ...s, ci, k })));
  const stage = $('.cine-stage', sec), chap = $('.cine-chap', sec), line = $('.cine-line', sec), link = $('.cine-link', sec);
  const bars = $('.cine-bars', sec), tabs = $('.cine-tabs', sec), count = $('.cine-count', sec), status = $('.cine-status', sec), pauseBtn = $('.cine-pause', sec);
  stage.innerHTML = all.map((s, i) => `<figure class="cine-slide" style="--dx:${i % 2 ? -2 : 2}%" aria-hidden="true"></figure>`).join('');
  tabs.innerHTML = chaps.map((c, ci) => `<button type="button" data-ci="${ci}">${esc(c.title)}</button>`).join('');
  const figs = $$('.cine-slide', stage), tb = $$('button', tabs);
  const fill = i => { const f = figs[(i + all.length) % all.length]; f.firstChild || (f.innerHTML = pic(all[(i + all.length) % all.length].slot, '', '100vw')); };
  let at = -1, ci = -1, userPaused = reduced, held = 0;

  const paused = () => userPaused || held > 0;
  const sync = () => {
    sec.classList.toggle('paused', paused());
    pauseBtn.innerHTML = icon(userPaused ? 'play' : 'pause');
    pauseBtn.setAttribute('aria-label', userPaused ? tt('تشغيل العرض', 'Lire le diaporama', 'Play slideshow') : tt('إيقاف العرض', 'Mettre en pause', 'Pause slideshow'));
    status.setAttribute('aria-live', userPaused ? 'polite' : 'off');
  };
  function show(i) {
    i = (i + all.length) % all.length;
    if (i === at) return;
    const prev = figs[at];
    figs.forEach(f => f.classList.remove('was'));
    prev?.classList.replace('on', 'was'); // keeps its Ken Burns running while it fades out
    at = i; fill(i); fill(i + 1);
    figs[i].classList.add('on');
    figs.forEach((f, n) => f.setAttribute('aria-hidden', n !== i));
    const s = all[i], c = chaps[s.ci];
    if (s.ci !== ci) {
      ci = s.ci;
      chap.textContent = c.title; line.textContent = c.line;
      link.href = c.link; link.firstChild.textContent = c.cta + ' ';
      [chap, line].forEach(n => { n.classList.remove('in'); void n.offsetWidth; n.classList.add('in'); });
      tb.forEach((b, n) => b.setAttribute('aria-pressed', n === ci));
      bars.innerHTML = c.slides.map(() => '<i><b></b></i>').join('');
    }
    $$('i', bars).forEach((b, n) => (b.className = n < s.k ? 'done' : ''));
    const now = $$('i', bars)[s.k]; void now.offsetWidth; now.className = 'now';
    now.firstChild.onanimationend = () => show(at + 1);
    count.textContent = `${String(ci + 1).padStart(2, '0')} / ${String(chaps.length).padStart(2, '0')}`;
    status.textContent = `${c.title} — ${s.alt} (${s.k + 1} ${tt('من', 'sur', 'of')} ${c.slides.length})`;
  }

  // controls
  $('.cine-next', sec).onclick = () => show(at + 1);
  $('.cine-prev', sec).onclick = () => show(at - 1);
  pauseBtn.onclick = () => { userPaused = !userPaused; sync(); };
  tb.forEach((b, n) => (b.onclick = () => show(all.findIndex(s => s.ci === n))));
  sec.onkeydown = e => { const d = step(e.key); d && (e.preventDefault(), show(at + d)); }; // RTL: ← = next
  let x0 = null;
  stage.onpointerdown = e => (x0 = e.clientX);
  stage.onpointerup = e => { const dx = e.clientX - x0; x0 = null; Math.abs(dx) > 40 && show(at + ((dx > 0) !== LTR ? 1 : -1)); }; // swipe toward the reading direction = next
  stage.onpointercancel = () => (x0 = null);

  // hold while off-screen, tab hidden or hovered (mouse)
  const hold = (on, why) => { sec.dataset[why] = on ? 1 : ''; held = ['off', 'hover'].filter(k => sec.dataset[k]).length + (document.hidden ? 1 : 0); sync(); };
  new IntersectionObserver(([e]) => hold(e.intersectionRatio < 0.35, 'off'), { threshold: [0, 0.35, 0.6] }).observe(sec);
  document.addEventListener('visibilitychange', () => hold(sec.dataset.off, 'off'));
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) { sec.onmouseenter = () => hold(1, 'hover'); sec.onmouseleave = () => hold(0, 'hover'); }

  sec.hidden = false;
  show(0); sync();
});
