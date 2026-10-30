/* ===================================================
   HOTEL YOUCEF · main.js — home page
   =================================================== */

const root = document.documentElement;
const PORTRAIT = matchMedia('(max-aspect-ratio: 4/5)').matches;

// ── Hero film as an image sequence on a canvas: smooth scrubbing on every phone ──
const Hero = (() => {
  const hero = $('.hero'), canvas = $('#heroCanvas');
  if (!hero || !canvas) return null;
  const ctx = canvas.getContext('2d');
  const COUNT = 125, dir = PORTRAIT ? 'm' : 'd';
  const src = i => `assets/frames/${dir}/${String(i + 1).padStart(3, '0')}.webp`;
  const frames = new Array(COUNT), asked = new Set();
  let current = -1, want = 0, firstReady;
  const first = new Promise(r => (firstReady = r));

  function load(i) {
    if (asked.has(i)) return;
    asked.add(i);
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => { frames[i] = im; if (i === 0) firstReady(); if (i === want || current < 0) { current = -1; draw(want); } };
    im.src = src(i);
  }
  // First frame now, the fountain next, then coarse-to-fine so scrubbing works before everything is loaded
  load(0); load(COUNT - 1);
  const rest = () => [16, 8, 4, 2, 1].forEach(step => { for (let i = 0; i < COUNT; i += step) load(i); });
  first.then(() => (window.requestIdleCallback || setTimeout)(rest));

  function nearest(i) {
    for (let d = 0; d < COUNT; d++) {
      if (frames[i - d]?.complete) return frames[i - d];
      if (frames[i + d]?.complete) return frames[i + d];
    }
  }
  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = w;
    canvas.height = h;
    current = -1;
    draw(want);
  }
  function draw(i) {
    want = i;
    const im = nearest(i);
    if (!im || (i === current && im === frames[i])) return;
    current = i;
    const cw = canvas.width, ch = canvas.height, r = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
    const w = im.naturalWidth * r, h = im.naturalHeight * r;
    ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
  }
  addEventListener('resize', size);
  size();
  return { COUNT, draw, first };
})();

// ── Intro: the mark draws itself, the name appears, then the curtain opens on the film ──
(() => {
  const loader = $('#loader');
  if (!loader) return;
  const bar = $('#loaderBar');
  root.classList.add('is-loading');
  lenis?.stop();
  const minTime = new Promise(r => setTimeout(r, REDUCED ? 200 : 2300));
  const ready = Promise.race([Hero ? Hero.first : Promise.resolve(), new Promise(r => setTimeout(r, 5000))]);
  requestAnimationFrame(() => loader.classList.add('play'));
  bar.style.transitionDuration = REDUCED ? '0.2s' : '2.1s';
  requestAnimationFrame(() => requestAnimationFrame(() => (bar.style.transform = 'scaleX(1)')));
  Promise.all([minTime, ready]).then(() => {
    loader.classList.add('open');
    root.classList.remove('is-loading');
    root.classList.add('loaded');
    lenis?.start();
    setTimeout(() => loader.remove(), 1400);
  });
})();

// ── Hero scroll: sky → facade → doors → fountain, then the hotel introduces itself ──
(() => {
  const hero = $('.hero');
  if (!hero || !Hero) return;
  const start = $('#heroStart'), end = $('#heroEnd'), veil = $('#heroVeil'), bar = $('#heroBar'), header = $('#header');
  const clamp01 = v => Math.min(1, Math.max(0, v));
  const FILM_END = 0.68; // the film reaches the fountain here; the rest of the scroll holds on it

  function render(p) {
    Hero.draw(Math.round(clamp01(p / FILM_END) * (Hero.COUNT - 1)));
    const s = 1 - clamp01(p / 0.1);
    start.style.opacity = s;
    start.style.transform = `translateY(${(1 - s) * -30}px)`;
    const e = clamp01((p - FILM_END) / 0.14);
    end.style.opacity = e;
    end.style.visibility = e > 0.01 ? 'visible' : 'hidden';
    end.classList.toggle('on', e > 0.35);
    veil.style.setProperty('--dim', e);
    bar.style.transform = `scaleX(${p})`;
  }

  if (REDUCED || !window.ScrollTrigger) {
    hero.classList.add('static');
    Hero.first.then(() => Hero.draw(Hero.COUNT - 1));
    render(1);
    return;
  }
  // Smooth the scrub on top of Lenis so frames glide instead of stepping
  let target = 0, shown = 0, raf = 0;
  const tick = () => {
    shown += (target - shown) * 0.2;
    if (Math.abs(target - shown) < 0.0005) shown = target;
    render(shown);
    raf = shown !== target ? requestAnimationFrame(tick) : 0;
  };
  ScrollTrigger.create({
    trigger: hero, start: 'top top', end: 'bottom bottom',
    onUpdate: st => { target = st.progress; raf ||= requestAnimationFrame(tick); },
    onToggle: st => root.classList.toggle('in-hero', st.isActive)
  });
  // Header stays transparent while the film plays
  const onHero = () => header.classList.toggle('over-hero', scrollY < hero.offsetHeight - innerHeight - 10);
  addEventListener('scroll', onHero, { passive: true });
  onHero();
  root.classList.add('in-hero');
  render(0);
})();

// ── Film section: plays only while visible ──
(() => {
  const v = $('#filmVideo'), btn = $('#filmPlay');
  if (!v) return;
  let paused = REDUCED, visible = false, loaded = false;
  const sync = () => {
    if (visible && !loaded) { v.src = (matchMedia('(max-width: 760px)').matches && v.dataset.srcMobile) || v.dataset.src; loaded = true; }
    paused || !visible ? v.pause() : v.play().catch(() => {});
    btn.setAttribute('aria-pressed', String(paused));
    btn.setAttribute('aria-label', paused ? 'تشغيل الفيلم' : 'إيقاف الفيلم');
    btn.innerHTML = `<i data-lucide="${paused ? 'play' : 'pause'}"></i>`;
    refreshIcons();
  };
  btn.addEventListener('click', () => { paused = !paused; sync(); });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { rootMargin: '200px 0px' }).observe(v);
})();

// ── 360 tour: the viewer (Three.js) loads near the section on desktop; on phones only when tapped
// (no scroll stutter, no wasted data, and finger-drag never fights the page scroll) ──
(() => {
  const el = $('.tour-sec .tour'), btn = $('#tourStart');
  if (!el) return;
  const mount = () => {
    if (el.classList.contains('mounted')) return;
    if (!window.mountTour) return setTimeout(mount, 200);
    el.classList.add('mounted');
    window.mountTour(el, el.dataset.initial);
  };
  btn.addEventListener('click', mount);
  if (matchMedia('(pointer: coarse)').matches) return;
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    (window.requestIdleCallback || setTimeout)(mount);
  }, { rootMargin: '300px 0px' });
  io.observe(el);
})();

// ── Rooms: swipeable track ──
const booking = initBooking($('#bookForm'));
initConcierge($('#aiForm'), booking);
(() => {
  const grid = $('#roomsGrid');
  if (!grid) return;
  grid.innerHTML = ROOMS.map(roomCardHTML).join('');
  $$('.track-arrows[data-for="roomsGrid"] button').forEach(b => b.addEventListener('click', () => {
    const step = grid.firstElementChild.getBoundingClientRect().width + 24;
    grid.scrollBy({ left: -step * +b.dataset.dir, behavior: REDUCED ? 'auto' : 'smooth' }); // RTL: "next" moves left
  }));
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-book]');
    if (b) booking?.pick(b.dataset.book);
  });
})();

// ── Offers ──
(() => {
  const grid = $('#offersGrid');
  if (!grid) return;
  grid.innerHTML = OFFERS.map(o => {
    const text = `السلام عليكم، أنا مهتم بعرض «${o.title}» (${nightsLabel(o.nights)}) في ${HOTEL.nameAr}. هل هو متاح؟`;
    return `
    <article class="offer" data-reveal>
      <figure class="offer-media"><img src="${img(o.photo, 800, 1000)}" alt="${o.title}" loading="lazy"><span class="offer-nights">${nightsLabel(o.nights)}</span></figure>
      <div class="offer-body">
        <p class="offer-tags">${o.tags}</p>
        <h3>${o.title}</h3>
        <p class="offer-text">${o.text}</p>
        <div class="offer-foot">
          <p class="price"><small>من</small> ${fmt(o.price)} <small>${HOTEL.currency}</small></p>
          <a class="link-arrow" href="${waLink(text)}" target="_blank" rel="noopener">استفسر <i data-lucide="arrow-left"></i></a>
        </div>
      </div>
    </article>`;
  }).join('');
})();

// ── Gallery with filters ──
(() => {
  const grid = $('#galleryGrid'), tabs = $('#galleryTabs');
  if (!grid) return;
  let cat = 'all';
  tabs.innerHTML = Object.entries(GALLERY_CATS)
    .filter(([k]) => k === 'all' || GALLERY.some(g => g.cat === k))
    .map(([k, v]) => `<button type="button" role="tab" data-cat="${k}" aria-selected="${k === cat}">${v}</button>`).join('');
  const list = () => GALLERY.filter(g => cat === 'all' || g.cat === cat);
  function render() {
    grid.innerHTML = list().map((g, i) => `
      <button type="button" class="g-tile${g.tall ? ' tall' : ''}" data-i="${i}" aria-label="تكبير: ${g.alt}">
        <img src="${g.src}" alt="${g.alt}" loading="lazy">
        <span class="g-cap">${g.alt}</span>
      </button>`).join('');
  }
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    cat = b.dataset.cat;
    $$('button', tabs).forEach(x => x.setAttribute('aria-selected', String(x === b)));
    render();
  });
  grid.addEventListener('click', e => {
    const b = e.target.closest('.g-tile');
    if (b) Lightbox.open(list(), +b.dataset.i);
  });
  render();
})();

// ── Events: quote request ──
$('#eventForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const type = $('#eType').value, date = $('#eDate').value, n = $('#eGuests').value;
  const text = [
    `السلام عليكم، أود الاستفسار عن قاعة حفلات ${HOTEL.nameAr}:`,
    `• المناسبة: ${type}`,
    date && `• التاريخ: ${arDate(date)}`,
    `• عدد المدعوين: ${n}`,
    'ما هي الأسعار والخدمات المتوفرة؟ شكراً.'
  ].filter(Boolean).join('\n');
  window.open(waLink(text), '_blank', 'noopener');
});

// ── Live: local time + weather in Khenchela (Open-Meteo, no key) ──
(() => {
  const time = $('#liveTime');
  if (!time) return;
  const tick = () => (time.textContent = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Algiers' }).format(new Date()));
  tick();
  setInterval(tick, 30000);
  const WX = c => c === 0 ? ['sun', 'مشمس'] : c <= 2 ? ['cloud-sun', 'غائم جزئياً'] : c === 3 ? ['cloud', 'غائم'] : c <= 48 ? ['cloud-fog', 'ضباب']
    : c <= 67 ? ['cloud-rain', 'ممطر'] : c <= 77 ? ['snowflake', 'ثلوج'] : c <= 82 ? ['cloud-rain', 'زخات'] : c <= 86 ? ['snowflake', 'ثلوج'] : ['cloud-lightning', 'عواصف'];
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${HOTEL.lat}&longitude=${HOTEL.lng}&current=temperature_2m,weather_code&timezone=Africa%2FAlgiers`)
    .then(r => r.json())
    .then(d => {
      const [ico, label] = WX(d.current.weather_code);
      $('#liveWeather').innerHTML = `<i data-lucide="${ico}"></i> ${label} <b>${Math.round(d.current.temperature_2m)}°</b>`;
      refreshIcons();
    })
    .catch(() => ($('#liveWeather').hidden = true));
})();

bindContacts();
refreshIcons();
observeReveals();
parallax();
