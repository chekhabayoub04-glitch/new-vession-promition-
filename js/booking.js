/* ===================================================
   HOTEL YOUCEF · booking.js
   Booking form + "AI" concierge: a natural-language parser (Arabic, Darija, French, English)
   that turns "غرفة لشخصين من 12 إلى 15 نوفمبر مع فطور" into a filled booking.
   =================================================== */

const Concierge = (() => {
  const norm = s => s.toLowerCase()
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[ً-ْ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ـ/g, '')
    .replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a').replace(/[ûù]/g, 'u').replace(/ô/g, 'o');

  const MONTHS = [
    ['جانفي', 'يناير', 'janvier', 'janv', 'january', 'jan'],
    ['فيفري', 'فبراير', 'fevrier', 'fevr', 'february', 'feb', 'fev'],
    ['مارس', 'mars', 'march', 'mar'],
    ['افريل', 'ابريل', 'avril', 'april', 'apr', 'avr'],
    ['ماي', 'مايو', 'mai', 'may'],
    ['جوان', 'يونيو', 'juin', 'june', 'jun'],
    ['جويليه', 'يوليو', 'juillet', 'juil', 'july', 'jul'],
    ['اوت', 'اغسطس', 'aout', 'august', 'aug'],
    ['سبتمبر', 'septembre', 'september', 'sept', 'sep'],
    ['اكتوبر', 'octobre', 'october', 'oct'],
    ['نوفمبر', 'novembre', 'november', 'nov'],
    ['ديسمبر', 'decembre', 'december', 'dec']
  ];
  const monthRe = MONTHS.flat().sort((a, b) => b.length - a.length).join('|');
  const monthOf = w => MONTHS.findIndex(m => m.includes(w));
  const WORD_NUM = { واحد: 1, اثنين: 2, زوج: 2, ثلاث: 3, ثلاثه: 3, اربع: 4, اربعه: 4, خمس: 5, خمسه: 5, un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, one: 1, two: 2, three: 3, four: 4, five: 5 };
  const num = w => (/^\d+$/.test(w) ? +w : WORD_NUM[w]);

  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const dated = (day, month) => {
    const t = today();
    let d = new Date(t.getFullYear(), month, day);
    if (d < t) d = new Date(t.getFullYear() + 1, month, day);
    return d;
  };

  function parse(raw) {
    const s = norm(raw);
    const out = {};
    let m;

    // Dates — "12 الى 15 نوفمبر", "du 12 au 15 nov", "12 nov - 15 nov", "12/11 - 15/11"
    if ((m = s.match(new RegExp(`(\\d{1,2})\\s*(${monthRe})?\\s*(?:الى|لـ?|حتى|au|to|until|-|–)\\s*(\\d{1,2})\\s*(${monthRe})`)))) {
      const m2 = monthOf(m[4]), m1 = m[2] ? monthOf(m[2]) : m2;
      out.arrive = dated(+m[1], m1);
      out.depart = dated(+m[3], m2);
      if (out.depart <= out.arrive) out.depart = new Date(out.depart.getFullYear() + 1, m2, +m[3]);
    } else if ((m = s.match(/(\d{1,2})[/.](\d{1,2})\s*(?:الى|حتى|au|to|-|–)\s*(\d{1,2})[/.](\d{1,2})/))) {
      out.arrive = dated(+m[1], +m[2] - 1);
      out.depart = dated(+m[3], +m[4] - 1);
    } else if ((m = s.match(new RegExp(`(\\d{1,2})\\s*(${monthRe})`)))) {
      out.arrive = dated(+m[1], monthOf(m[2]));
    } else if (/بعد غد|apres[- ]demain|day after tomorrow/.test(s)) out.arrive = addDays(today(), 2);
    else if (/غدو?ا|غدوه|demain|tomorrow/.test(s)) out.arrive = addDays(today(), 1);
    else if (/الليله|اليوم|ce soir|aujourd|tonight|today/.test(s)) out.arrive = today();
    else if (/نهايه الاسبوع|ويكاند|ويك اند|week-?end/.test(s)) {
      const t = today();
      out.arrive = addDays(t, ((4 - t.getDay() + 7) % 7) || 7); // Thursday evening → Saturday (Algerian weekend)
      out.nights = 2;
    }

    // Nights
    if ((m = s.match(/(\d+|\p{L}+)\s*(?:ليالي|ليال|ليله|nuits?|nights?)/u)) && num(m[1])) out.nights = num(m[1]);
    else if (/ليلتين|deux nuits/.test(s)) out.nights = 2;
    else if (!out.nights && /اسبوع|semaine|week(?!-?end)/.test(s)) out.nights = 7;
    if (out.arrive && !out.depart) out.depart = addDays(out.arrive, out.nights || 1);
    if (out.arrive && out.depart) out.nights = Math.round((out.depart - out.arrive) / 864e5);

    // Guests & children
    if ((m = s.match(/(\d+|\p{L}+)\s*(?:اشخاص|شخص|افراد|فرد|personnes?|pers|people|persons|adultes?|adults?)/u)) && num(m[1])) out.guests = num(m[1]);
    else if ((m = s.match(/(?:عائله|famille|family)\s*(?:من|de|of)?\s*(\d)/))) out.guests = +m[1];
    else if (/شخصين|لشخصين|زوجين|عرسان|couple|deux personnes|two people|انا وزوجتي|انا و زوجتي/.test(s)) out.guests = 2;
    else if (/وحدي|لوحدي|seul|alone|myself/.test(s)) out.guests = 1;
    if ((m = s.match(/(\d+)\s*(?:اطفال|طفل|enfants?|kids|children)/))) out.kids = +m[1];
    else if (/طفلين|deux enfants/.test(s)) out.kids = 2;
    else if (/مع طفل|avec (?:un )?enfant|with a (?:kid|child)/.test(s)) out.kids = 1;

    // Room type
    if (/جناح|سويت|suite/.test(s)) out.room = 'suite';
    else if (/عائل|famil/.test(s)) out.room = 'family';
    else if (/سريرين|twin|lits? separes|separate beds/.test(s)) out.room = 'twin';
    else if (/فردي|single|individuel/.test(s)) out.room = 'single';
    else if (/مزدوج|double|زوجين|couple/.test(s)) out.room = 'double';
    if (/عائله|famille|family/.test(s) && !out.guests) out.guests = 4;

    if (/فطور|petit[- ]?dej|breakfast/.test(s)) out.breakfast = true;

    const notes = [];
    if (/مسبح|piscine|pool/.test(s)) notes.push('إطلالة على المسبح');
    if (/هادئ|calme|quiet/.test(s)) notes.push('غرفة هادئة');
    if (/عمل|travail|business|mission/.test(s)) notes.push('رحلة عمل');
    if (/عرس|حفل|mariage|wedding/.test(s)) notes.push('قادمون لحضور حفل');
    if (notes.length) out.note = notes.join('، ');

    // Fit the room to the party size
    const party = (out.guests || 0) + Math.ceil((out.kids || 0) / 2);
    if (!out.room && party) out.room = party <= 1 ? 'single' : party === 2 ? 'double' : party === 3 ? 'suite' : 'family';
    if (out.room && party > roomById(out.room).guests) {
      out.upgraded = roomById(out.room).name;
      out.room = ROOMS.filter(r => r.guests >= party).sort((a, b) => a.price - b.price)[0]?.id || 'family';
    }
    return out;
  }

  return { parse };
})();

function initBooking(form) {
  if (!form) return;
  const f = id => form.querySelector('#' + id);
  const arrive = f('bArrive'), depart = f('bDepart'), guests = f('bGuests'), kids = f('bKids'), bf = f('bBreakfast'), name = f('bName');
  const summary = f('bSummary'), err = f('bErr'), options = f('roomOptions');
  const fixedRoom = form.dataset.room;
  let room = fixedRoom || 'double', note = '';

  const t = new Date();
  arrive.min = isoDate(t);
  arrive.value ||= isoDate(new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1));
  depart.value ||= isoDate(new Date(t.getFullYear(), t.getMonth(), t.getDate() + 3));
  const bfPrice = form.querySelector('#bfPrice');
  if (bfPrice) bfPrice.textContent = money(HOTEL.breakfast);

  if (options) {
    options.innerHTML = ROOMS.map(r => `
      <label class="room-opt">
        <input type="radio" name="room" value="${r.id}" ${r.id === room ? 'checked' : ''}>
        <img src="${img(r.photos[0], 160, 120)}" alt="" loading="lazy">
        <span><b>${r.name}</b><small>${fmt(r.price)} ${HOTEL.currency} · حتى ${r.guests} ${r.guests > 2 ? 'أشخاص' : r.guests === 2 ? 'شخصين' : 'شخص'}</small></span>
      </label>`).join('');
    options.addEventListener('change', e => { room = e.target.value; render(); });
  }

  form.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => {
    const input = b.parentElement.querySelector('input');
    input.value = Math.min(+input.max, Math.max(+input.min, +input.value + +b.dataset.step));
    render();
  }));

  const state = () => ({
    room, arrive: arrive.value, depart: depart.value,
    nights: nightsBetween(arrive.value, depart.value),
    guests: +guests.value || 1, kids: +kids.value || 0, breakfast: bf.checked, note
  });

  function render() {
    if (arrive.value) depart.min = isoDate(new Date(parseISO(arrive.value).getTime() + 864e5));
    const s = state(), r = roomById(s.room), q = quote(s);
    const party = s.guests + Math.ceil(s.kids / 2);
    options?.querySelectorAll('.room-opt').forEach(l => l.classList.toggle('small', roomById(l.querySelector('input').value).guests < party));
    if (!q) { summary.innerHTML = '<p class="muted">اختر تاريخي الوصول والمغادرة لرؤية التقدير.</p>'; return; }
    summary.innerHTML = `
      <div class="sum-row"><span>${r.name} × ${nightsLabel(s.nights)}</span><b>${money(q.rooms)}</b></div>
      ${q.bf ? `<div class="sum-row"><span>فطور الصباح × ${s.guests}</span><b>${money(q.bf)}</b></div>` : ''}
      ${party > r.guests ? `<p class="sum-warn"><i data-lucide="alert-triangle"></i> هذه الغرفة لـ ${r.guests} ${r.guests > 2 ? 'أشخاص' : 'شخص'} كحد أقصى — جرّب الغرفة العائلية.</p>` : ''}
      <div class="sum-total"><span>المجموع التقديري</span><b>${money(q.total)}</b></div>
      <p class="sum-note">${arDate(s.arrive)} ← ${arDate(s.depart)} · الدفع عند الوصول</p>`;
    refreshIcons();
  }

  form.addEventListener('input', render);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const s = state();
    let msg = '';
    if (!s.arrive || !s.depart || s.nights < 1) msg = 'تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول.';
    else if (!name.value.trim()) { msg = 'أدخل اسمك من فضلك.'; name.setAttribute('aria-invalid', 'true'); name.focus(); }
    err.textContent = msg;
    if (msg) return;
    name.removeAttribute('aria-invalid');
    const text = `${bookingText(s)}\n— ${name.value.trim()}`;
    if (e.submitter?.dataset.via === 'email') location.href = mailLink(`طلب حجز — ${roomById(s.room).name}`, text);
    else window.open(waLink(text), '_blank', 'noopener');
    toast('تم تجهيز طلبك — أكمل الإرسال في التطبيق');
  });

  // Public: apply a parsed request / pick a room
  function apply(p) {
    if (p.room && !fixedRoom) { room = p.room; const r = options?.querySelector(`input[value="${room}"]`); if (r) r.checked = true; }
    if (p.arrive) arrive.value = isoDate(p.arrive);
    if (p.depart) depart.value = isoDate(p.depart);
    else if (p.nights && arrive.value) depart.value = isoDate(new Date(parseISO(arrive.value).getTime() + p.nights * 864e5));
    if (p.guests) guests.value = Math.min(6, p.guests);
    if (p.kids !== undefined) kids.value = Math.min(4, p.kids);
    if (p.breakfast) bf.checked = true;
    if (p.note) note = p.note;
    render();
    form.classList.remove('flash'); void form.offsetWidth; form.classList.add('flash');
  }
  function pick(id) { if (fixedRoom) return; room = id; const r = options?.querySelector(`input[value="${id}"]`); if (r) r.checked = true; render(); }

  render();
  return { apply, pick };
}

function initConcierge(aiForm, booking) {
  if (!aiForm || !booking) return;
  const input = aiForm.querySelector('input');
  const out = aiForm.querySelector('.ai-parsed');
  const run = () => {
    const q = input.value.trim();
    if (!q) return;
    const p = Concierge.parse(q);
    const chips = [];
    if (p.arrive) chips.push(['calendar', `${arDate(isoDate(p.arrive))}${p.nights ? ` · ${nightsLabel(p.nights)}` : ''}`]);
    if (p.guests) chips.push(['users', `${p.guests} ${p.guests > 2 ? 'أشخاص' : p.guests === 2 ? 'شخصان' : 'شخص'}${p.kids ? ` + ${p.kids} أطفال` : ''}`]);
    if (p.room) chips.push(['bed-double', roomById(p.room).name]);
    if (p.breakfast) chips.push(['coffee', 'مع الفطور']);
    if (p.note) chips.push(['message-circle', p.note]);
    if (!chips.length) {
      out.innerHTML = '<span class="ai-understood">لم أفهم التفاصيل — جرّب مثلاً: «غرفة لشخصين من 12 إلى 15 نوفمبر».</span>';
      return;
    }
    out.innerHTML = `<span class="ai-understood"><i data-lucide="sparkles"></i> فهمت:</span>${chips.map(([i, t]) => `<span class="tag"><i data-lucide="${i}"></i>${t}</span>`).join('')}
      ${p.upgraded ? `<span class="ai-understood">اقترحت غرفة أوسع من «${p.upgraded}» لتناسب العدد.</span>` : ''}`;
    refreshIcons();
    booking.apply(p);
  };
  aiForm.addEventListener('submit', e => { e.preventDefault(); run(); });
  aiForm.querySelectorAll('.ai-examples button').forEach(b => b.addEventListener('click', () => { input.value = b.textContent; run(); }));
}
