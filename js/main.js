/* ===================================================
   HOTEL YOUCEF · main.js — home page
   =================================================== */

// ── Hero film: plays on its own in the arch; paused off screen; pause button ──
(() => {
  const video = $('#heroVideo'), btn = $('#heroPlay');
  if (!video) return;
  let paused = REDUCED, visible = true;
  const sync = () => {
    paused || !visible ? video.pause() : video.play().catch(() => {});
    btn.setAttribute('aria-pressed', String(paused));
    btn.setAttribute('aria-label', paused ? 'تشغيل الفيديو' : 'إيقاف الفيديو');
    btn.innerHTML = `<i data-lucide="${paused ? 'play' : 'pause'}"></i>`;
    refreshIcons();
  };
  btn.addEventListener('click', () => { paused = !paused; sync(); });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.15 }).observe(video);
  if (REDUCED) sync();
})();

// ── Quick availability bar (hero) → fills the booking form ──
const booking = initBooking($('#bookForm'));
initConcierge($('#aiForm'), booking);
(() => {
  const q = $('#quickBook');
  if (!q) return;
  const t = new Date();
  $('#qArrive').min = isoDate(t);
  $('#qArrive').value = isoDate(new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1));
  $('#qDepart').value = isoDate(new Date(t.getFullYear(), t.getMonth(), t.getDate() + 3));
  q.addEventListener('submit', e => {
    e.preventDefault();
    const a = parseISO($('#qArrive').value), d = parseISO($('#qDepart').value), g = +$('#qGuests').value;
    booking?.apply({ arrive: a, depart: d > a ? d : new Date(a.getTime() + 864e5), guests: g, room: g <= 1 ? 'single' : g === 2 ? 'double' : g === 3 ? 'suite' : 'family' });
    scrollToTarget('#booking');
  });
})();

// ── Rooms ──
(() => {
  const grid = $('#roomsGrid');
  if (!grid) return;
  grid.innerHTML = ROOMS.map(roomCardHTML).join('');
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
      <figure class="offer-media"><img src="${img(o.photo, 800, 900)}" alt="${o.title}" loading="lazy"></figure>
      <div class="offer-body">
        <p class="offer-tags">${o.tags}</p>
        <h3>${o.title}</h3>
        <p class="muted">${o.text}</p>
        <div class="offer-foot">
          <p class="price"><small>من</small> ${fmt(o.price)} <small>${HOTEL.currency} · ${nightsLabel(o.nights)}</small></p>
          <a class="link-arrow" href="${waLink(text)}" target="_blank" rel="noopener">استفسر <i data-lucide="arrow-left"></i></a>
        </div>
      </div>
    </article>`;
  }).join('');
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
        <img src="${g.src.replace(/w=\d+/, 'w=900')}" alt="${g.alt}" loading="lazy">
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

// ── Live: local time + weather in Khenchela (Open-Meteo, no key) ──
(() => {
  const time = $('#liveTime');
  if (!time) return;
  const tick = () => (time.textContent = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Algiers' }).format(new Date()));
  tick();
  setInterval(tick, 30000);

  const WX = c => c === 0 ? ['sun', 'مشمس'] : c <= 2 ? ['cloud-sun', 'غائم جزئياً'] : c === 3 ? ['cloud', 'غائم'] : c <= 48 ? ['cloud-fog', 'ضباب']
    : c <= 67 ? ['cloud-rain', 'ممطر'] : c <= 77 ? ['snowflake', 'ثلوج'] : c <= 82 ? ['cloud-rain', 'زخات'] : c <= 86 ? ['snowflake', 'ثلوج'] : ['cloud-lightning', 'عواصف'];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${HOTEL.lat}&longitude=${HOTEL.lng}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Africa%2FAlgiers&forecast_days=4`;
  fetch(url).then(r => r.json()).then(d => {
    const [ico, label] = WX(d.current.weather_code);
    $('#liveWeather').innerHTML = `<i data-lucide="${ico}"></i><span>${label}</span><b>${Math.round(d.current.temperature_2m)}°</b>`;
    $('#forecast').innerHTML = d.daily.time.map((t, i) => {
      const [fi, fl] = WX(d.daily.weather_code[i]);
      const day = i === 0 ? 'اليوم' : parseISO(t).toLocaleDateString('ar-DZ', { weekday: 'long' });
      return `<div class="fc-row"><span>${day}</span><i data-lucide="${fi}" title="${fl}"></i><b>${Math.round(d.daily.temperature_2m_max[i])}°</b><small>${Math.round(d.daily.temperature_2m_min[i])}°</small></div>`;
    }).join('');
    refreshIcons();
  }).catch(() => {
    $('#liveWeather').hidden = true;
    $('#forecast').remove();
  });
})();

bindContacts();
refreshIcons();
observeReveals();
