/* ===================================================
   HOTEL YOUCEF · main.js — home page
   =================================================== */

const root = document.documentElement;

// ── Preloader: wait for the hero film (or give up gracefully) ──
(() => {
  const pre = $('#preloader');
  if (!pre) return;
  const bar = $('#plBar');
  let pct = 0;
  const tick = setInterval(() => { pct = Math.min(90, pct + Math.random() * 14); bar.style.width = pct + '%'; }, 110);
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    clearInterval(tick);
    bar.style.width = '100%';
    setTimeout(() => { pre.classList.add('gone'); root.classList.add('loaded'); }, 300);
  };
  addEventListener('hero:ready', finish);
  setTimeout(finish, 4000);
})();

// ── Hero film: the mouse wheel plays it forward and back; the hotel's story appears on the way ──
(() => {
  const hero = $('.hero'), video = $('#heroVideo');
  if (!hero || !video) return;
  const chapters = $$('.chapter', hero), steps = $$('.hero-steps span', hero);
  const foot = $('#heroFoot'), bar = $('#heroBar'), shade = $('.hero-shade', hero);
  const blur = $('#heroBlur'), ctx = blur.getContext('2d');
  const ready = () => dispatchEvent(new CustomEvent('hero:ready'));
  const clamp01 = v => Math.min(1, Math.max(0, v));
  $$('.brand-reveal span:not(.sp)', hero).forEach((s, i) => s.style.setProperty('--i', i));

  // Blurred backdrop on wide screens: the current frame, tiny and stretched
  const paintBlur = () => { if (video.readyState >= 2 && blur.offsetParent) ctx.drawImage(video, 0, 0, blur.width, blur.height); };
  video.addEventListener('seeked', paintBlur);

  // Load as a blob so seeking is instant on any host
  fetch(video.dataset.src).then(r => { if (!r.ok) throw 0; return r.blob(); })
    .then(blob => {
      video.addEventListener('loadeddata', () => { video.pause(); paintBlur(); root.classList.add('hero-ready'); ready(); }, { once: true });
      video.src = URL.createObjectURL(blob);
    })
    .catch(ready);

  const fade = (p, a, b, w = 0.04) => clamp01(Math.min((p - a) / w, (b - p) / w));
  function render(p) {
    chapters.forEach(ch => {
      const a = +ch.dataset.in, b = +ch.dataset.out;
      const o = a === 0 ? clamp01((b - p) / 0.06) : fade(p, a, b);
      ch.style.opacity = o;
      ch.style.transform = `translateY(${(1 - o) * 26}px)`;
      ch.style.visibility = o > 0.01 ? 'visible' : 'hidden';
      ch.classList.toggle('active', o > 0.5);
    });
    const f = clamp01((0.1 - p) / 0.06);
    foot.style.opacity = f;
    foot.style.visibility = f > 0.01 ? 'visible' : 'hidden';
    steps.forEach((s, i) => {
      const next = steps[i + 1] ? +steps[i + 1].dataset.at : 2;
      s.classList.toggle('on', p >= +s.dataset.at && p < next);
    });
    bar.style.transform = `scaleX(${p})`;
    shade.style.setProperty('--dim', clamp01((p - 0.7) / 0.08));
  }

  if (REDUCED || !window.ScrollTrigger) {
    hero.classList.add('static');
    render(0);
    return;
  }

  // Smoothed seeking: the film glides to where the wheel left it
  let target = 0, current = 0, raf = 0;
  function tick() {
    current += (target - current) * 0.16;
    if (video.duration) {
      const t = current * (video.duration - 0.05);
      if (Math.abs(video.currentTime - t) > 0.015 && !video.seeking) video.currentTime = t;
    }
    raf = Math.abs(target - current) > 0.0005 ? requestAnimationFrame(tick) : 0;
  }
  ScrollTrigger.create({
    trigger: hero, start: 'top top', end: 'bottom bottom',
    onUpdate: st => { target = st.progress; raf ||= requestAnimationFrame(tick); render(st.progress); },
    onToggle: st => root.classList.toggle('in-hero', st.isActive)
  });
  root.classList.add('in-hero');
  render(0);
})();

// ── Rooms ──
const booking = initBooking($('#bookForm'));
initConcierge($('#aiForm'), booking);
(() => {
  const grid = $('#roomsGrid');
  if (!grid) return;
  grid.innerHTML = ROOMS.map(roomCardHTML).join('');
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-book]');
    if (b) booking?.pick(b.dataset.book);
  });
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
(() => {
  if (REDUCED || !window.gsap) return;
  gsap.fromTo('.events-media img', { scale: 1.2, yPercent: -6 }, {
    scale: 1, yPercent: 6, ease: 'none',
    scrollTrigger: { trigger: '.events', start: 'top bottom', end: 'bottom top', scrub: true }
  });
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
      <button type="button" class="m-item${g.tall ? ' tall' : ''}" data-i="${i}" aria-label="تكبير: ${g.alt}">
        <img src="${g.src.replace(/w=\d+/, 'w=900')}" alt="${g.alt}" loading="lazy">
        <span class="m-cap">${g.real ? '<i data-lucide="badge-check"></i>' : ''}${g.alt}</span>
      </button>`).join('');
    refreshIcons();
  }
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    cat = b.dataset.cat;
    $$('button', tabs).forEach(x => x.setAttribute('aria-selected', String(x === b)));
    render();
  });
  grid.addEventListener('click', e => {
    const b = e.target.closest('.m-item');
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
    $('#forecast').innerHTML = `<h3>توقعات الطقس</h3>` + d.daily.time.map((t, i) => {
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

// ── Quick availability bar (hero) → fills the main booking form ──
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

// ── Carousels (offers, services): native scroll-snap + arrows ──
function carousel(trackId) {
  const track = $('#' + trackId);
  $$(`.car-arrows[data-for="${trackId}"] button`).forEach(b => b.addEventListener('click', () => {
    const card = track.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 18 : 300;
    track.scrollBy({ left: -step * +b.dataset.dir, behavior: REDUCED ? 'auto' : 'smooth' }); // RTL: "next" goes left
  }));
}

(() => {
  const t = $('#offersTrack');
  if (!t) return;
  t.innerHTML = OFFERS.map(o => {
    const text = `السلام عليكم، أنا مهتم بعرض «${o.title}» (${nightsLabel(o.nights)}) في ${HOTEL.nameAr}. هل هو متاح؟`;
    return `
    <article class="offer" data-reveal>
      <div class="offer-media"><img src="${img(o.photo, 900, 1100)}" alt="${o.title}" loading="lazy"><span class="chip">${nightsLabel(o.nights)}</span></div>
      <div class="offer-body">
        <p class="offer-tags">${o.tags}</p>
        <h3>${o.title}</h3>
        <p class="muted">${o.text}</p>
        <div class="offer-foot">
          <p class="price"><small>من</small> ${fmt(o.price)} <small>${HOTEL.currency}</small></p>
          <a class="btn btn-ghost btn-sm" href="${waLink(text)}" target="_blank" rel="noopener"><span class="wa-ico"></span> استفسر</a>
        </div>
      </div>
    </article>`;
  }).join('');
  carousel('offersTrack');
})();

(() => {
  const tabs = $('.pillar-tabs'), panel = $('#pillarPanel'), media = $('#pillarMedia');
  if (!tabs) return;
  tabs.innerHTML = PILLARS.map((p, i) => `<button type="button" role="tab" id="pt${i}" aria-controls="pillarPanel" aria-selected="${i === 0}">${p.n}</button>`).join('');
  media.innerHTML = PILLARS.map((p, i) => `<img src="${p.photo}" alt="" loading="lazy" class="${i ? '' : 'on'}">`).join('');
  let cur = 0, auto = 0;
  function show(i) {
    cur = i;
    const p = PILLARS[i];
    $$('button', tabs).forEach((b, n) => b.setAttribute('aria-selected', String(n === i)));
    $$('img', media).forEach((m, n) => m.classList.toggle('on', n === i));
    panel.setAttribute('aria-labelledby', 'pt' + i);
    panel.innerHTML = `<h3>${p.title}</h3><p>${p.text}</p><a class="link-arrow" href="${p.href}">${p.cta} <i data-lucide="arrow-left"></i></a>`;
    panel.classList.remove('in'); void panel.offsetWidth; panel.classList.add('in');
    refreshIcons();
  }
  tabs.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { clearInterval(auto); show($$('button', tabs).indexOf(b)); } });
  tabs.addEventListener('keydown', e => {
    const d = { ArrowLeft: 1, ArrowRight: -1 }[e.key];
    if (!d) return;
    clearInterval(auto);
    show((cur + d + PILLARS.length) % PILLARS.length);
    $$('button', tabs)[cur].focus();
  });
  show(0);
  if (!REDUCED) {
    new IntersectionObserver(([en]) => {
      clearInterval(auto);
      if (en.isIntersecting) auto = setInterval(() => show((cur + 1) % PILLARS.length), 7000);
    }, { threshold: 0.4 }).observe(media);
  }
})();

(() => {
  const t = $('#servicesTrack');
  if (!t) return;
  t.innerHTML = SERVICES.map(s => `
    <article class="service" data-reveal>
      <img src="${s.photo}" alt="${s.title}" loading="lazy" style="object-position:${s.pos || 'center'}">
      <div><h3>${s.title}</h3><p>${s.line}</p></div>
    </article>`).join('');
  carousel('servicesTrack');
})();

(() => {
  const list = $('#timeline');
  if (!list) return;
  list.innerHTML = DAY.map(d => `
    <li class="tl-item" data-reveal>
      <div class="tl-time"><b>${d.time}</b></div>
      <figure class="tl-media"><img src="${d.photo}" alt="${d.title}" loading="lazy"></figure>
      <div class="tl-copy"><h3>${d.title}</h3><p>${d.text}</p></div>
    </li>`).join('');
  if (!REDUCED && window.gsap) {
    gsap.fromTo('.timeline', { '--tl': 0 }, { '--tl': 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: true } });
  }
})();

bindContacts();
refreshIcons();
observeReveals();
