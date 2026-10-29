/* ===================================================
   HOTEL YOUCEF · room.js — room detail page (?id=double)
   =================================================== */

(() => {
  const main = $('#roomMain');
  const id = new URLSearchParams(location.search).get('id');
  const r = roomById(id);

  if (!r) {
    main.innerHTML = `<div class="empty-state"><h1 class="h2">الغرفة غير موجودة</h1><p class="muted">ربما تغيّر الرابط.</p><a class="btn btn-gold" href="index.html#rooms">عرض كل الغرف</a></div>`;
    refreshIcons();
    return;
  }

  document.title = `${r.name} · فندق يوسف — خنشلة`;
  const photos = r.photos.map((p, i) => ({ src: img(p, 1400), alt: `${r.name} — صورة ${i + 1}` }));
  const people = n => `${n} ${n > 2 ? 'أشخاص' : n === 2 ? 'شخصان' : 'شخص'}`;

  main.innerHTML = `
    <nav class="crumbs" aria-label="مسار التصفح"><a href="index.html">الرئيسية</a><span>/</span><a href="index.html#rooms">الغرف</a><span>/</span><span aria-current="page">${r.name}</span></nav>

    <div class="gallery">
      ${photos.slice(0, 3).map((p, i) => `<button type="button" class="g-item" data-i="${i}" aria-label="تكبير الصورة ${i + 1}"><img src="${p.src}" alt="${p.alt}" ${i ? 'loading="lazy"' : ''}></button>`).join('')}
      <div class="g-actions">
        <button type="button" class="btn btn-glass btn-sm" data-i="0"><i data-lucide="images"></i> ${photos.length} صور</button>
        ${r.pano ? '<button type="button" class="btn btn-gold btn-sm" data-pano><i data-lucide="rotate-3d"></i> جولة 360°</button>' : ''}
      </div>
    </div>

    <div class="room-layout">
      <article>
        <header class="room-head">
          <div class="chips">${r.popular ? '<span class="chip chip-gold">الأكثر طلباً</span>' : ''}<span class="chip">${r.view}</span></div>
          <p class="room-latin">${r.latin}</p>
          <h1>${r.name}</h1>
        </header>
        <div class="key-specs">
          <div><i data-lucide="users"></i><b>${people(r.guests)}</b><span>السعة القصوى</span></div>
          <div><i data-lucide="maximize-2"></i><b>${r.size} م²</b><span>المساحة</span></div>
          <div><i data-lucide="bed-double"></i><b>${r.bed}</b><span>السرير</span></div>
          <div><i data-lucide="eye"></i><b>${r.view}</b><span>الإطلالة</span></div>
        </div>
        <section class="room-block"><h2>عن الغرفة</h2><p>${r.desc}</p></section>
        <section class="room-block">
          <h2>المرافق</h2>
          <ul class="feature-list">${r.amenities.map(a => `<li><i data-lucide="${AMENITIES[a][0]}"></i>${AMENITIES[a][1]}</li>`).join('')}</ul>
        </section>
        ${r.pano ? `<section class="room-block"><h2>جولة 360°</h2>
          <button type="button" class="pano-cta" data-pano><img src="${img(r.photos[0], 1400)}" alt="" loading="lazy"><span><i data-lucide="rotate-3d"></i>ادخل الغرفة وانظر حولك</span></button></section>` : ''}
        <section class="room-block">
          <h2>معلومات الإقامة</h2>
          <div class="policies">
            <div><span>تسجيل الدخول</span><b>ابتداءً من ${HOTEL.checkIn}</b></div>
            <div><span>المغادرة</span><b>قبل ${HOTEL.checkOut}</b></div>
            <div><span>الدفع</span><b>عند الوصول</b></div>
          </div>
        </section>
      </article>

      <aside class="aside-card card-glass" id="book">
        <p class="aside-price"><small>من</small> ${fmt(r.price)} <small>${HOTEL.currency} / الليلة</small></p>
        <form id="bookForm" data-room="${r.id}" novalidate>
          <div class="bf-grid">
            <div class="field"><label for="bArrive">الوصول</label><input id="bArrive" type="date" required></div>
            <div class="field"><label for="bDepart">المغادرة</label><input id="bDepart" type="date" required></div>
            <div class="field"><label for="bGuests">البالغون</label>
              <div class="stepper"><button type="button" data-step="-1" aria-label="إنقاص">−</button><input id="bGuests" type="number" min="1" max="${r.guests}" value="${Math.min(2, r.guests)}" inputmode="numeric"><button type="button" data-step="1" aria-label="زيادة">+</button></div></div>
            <div class="field"><label for="bKids">الأطفال</label>
              <div class="stepper"><button type="button" data-step="-1" aria-label="إنقاص">−</button><input id="bKids" type="number" min="0" max="3" value="0" inputmode="numeric"><button type="button" data-step="1" aria-label="زيادة">+</button></div></div>
          </div>
          <label class="switch"><input type="checkbox" id="bBreakfast"><span></span> فطور الصباح <small class="muted">(<span id="bfPrice"></span>)</small></label>
          <div class="field"><label for="bName">الاسم الكامل</label><input id="bName" autocomplete="name" required></div>
          <div class="summary" id="bSummary" aria-live="polite"></div>
          <p class="err" id="bErr"></p>
          <div class="send-row">
            <button class="btn btn-wa" type="submit" data-via="whatsapp"><span class="wa-ico"></span> احجز عبر واتساب</button>
          </div>
          <div class="aside-alt">
            <button class="btn btn-ghost btn-sm" type="submit" data-via="email"><i data-lucide="mail"></i> البريد</button>
            <a class="btn btn-ghost btn-sm" data-hotel="phone"><i data-lucide="phone"></i> اتصل</a>
          </div>
        </form>
      </aside>
    </div>

    <section class="others">
      <h2>غرف أخرى</h2>
      <div class="rooms-grid">${ROOMS.filter(x => x.id !== r.id).slice(0, 3).map(roomCardHTML).join('')}</div>
    </section>`;

  $('#mobileBar').innerHTML = `
    <p class="price"><small>من</small> ${fmt(r.price)} <small>${HOTEL.currency}</small></p>
    <a class="btn btn-gold" href="#book"><i data-lucide="calendar-check"></i> احجز الآن</a>`;

  initBooking($('#bookForm'));

  main.addEventListener('click', e => {
    const g = e.target.closest('[data-i]');
    if (g) Lightbox.open(photos, +g.dataset.i);
    if (e.target.closest('[data-pano]')) openPano();
  });

  // 360 modal — mounted on first open
  const modal = $('#panoModal');
  let viewer = null, lastFocus = null;
  function openPano() {
    if (!window.mountTour) return toast('جارٍ تحميل الجولة…');
    lastFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    lenis?.stop();
    viewer ||= window.mountTour($('.tour', modal), r.pano);
    $('#panoClose').focus();
  }
  function closePano() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    lenis?.start();
    lastFocus?.focus();
  }
  $('#panoClose').addEventListener('click', closePano);
  addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closePano(); });

  bindContacts();
  refreshIcons();
  observeReveals();
})();
