/* ===================================================
   ANNABA IMMO | main.js
   =================================================== */

// ── DATA ──────────────────────────────────────────
const saleProps = [
  {
    id: 1,
    title: "شقة فاخرة F4 – البوني هيتس",
    location: "البوني، عنابة",
    area: 110, rooms: 3, baths: 2, floor: 5,
    price: "28 500 000", currency: "دج",
    type: "sale",
    img: "images/apt1_5.png",
    imgs: ["images/apt1_5.png","images/apt1_6.png","images/apt1_7.png","images/apt1_8.png","images/apt1_1.png"],
    desc: "شقة راقية بتشطيبات عصرية فائقة الجودة في قلب البوني. أرضيات رخامية لامعة، إضاءة LED مدمجة في الأسقف، مرآة بإطار أسود أنيق، وباب أمان فاخر. المبنى مجهز بمصعدين، أمن على مدار الساعة."
  },
  {
    id: 2,
    title: "شقة F3 – صالون كبير + شرفة",
    location: "البوني، عنابة",
    area: 90, rooms: 2, baths: 1, floor: 3,
    price: "19 800 000", currency: "دج",
    type: "sale",
    img: "images/apt1_6.png",
    imgs: ["images/apt1_6.png","images/apt1_7.png","images/apt1_8.png","images/apt1_1.png","images/apt1_2.png"],
    desc: "شقة عائلية بصالون فسيح وإضاءة طبيعية ممتازة، تطل على شرفة واسعة. تشطيبات حديثة مع أرضية رخامية ووحدة تلفزيون مدمجة بإضاءة خلفية."
  },
  {
    id: 3,
    title: "شقة F4 – مدخل فاخر + موقف",
    location: "البوني، عنابة",
    area: 115, rooms: 3, baths: 2, floor: 7,
    price: "31 000 000", currency: "دج",
    type: "sale",
    img: "images/apt1_7.png",
    imgs: ["images/apt1_7.png","images/apt1_8.png","images/apt1_5.png","images/apt1_6.png","images/apt1_3.png"],
    desc: "شقة فاخرة بمدخل رئيسي مُصمَّم بعناية مع ألواح خشبية دافئة وباب أمان متعدد النقاط. موقف سيارة خاص في الطابق السفلي."
  },
  {
    id: 4,
    title: "شقة F5 – تشطيب VIP",
    location: "البوني، عنابة",
    area: 135, rooms: 4, baths: 2, floor: 9,
    price: "38 500 000", currency: "دج",
    type: "sale",
    img: "images/apt1_8.png",
    imgs: ["images/apt1_8.png","images/apt1_5.png","images/apt1_6.png","images/apt1_7.png","images/apt1_2.png"],
    desc: "شقة بنتهاوس بتشطيبات VIP كاملة: سقف مستعار مع إضاءة مخفية، وحدة تلفزيون ضخمة بإضاءة جانبية، أرضيات رخامية بيضاء فائقة الجودة. إطلالة بانورامية على مدينة عنابة."
  },
  {
    id: 5,
    title: "شقة F3 – ممر واسع + حمامان",
    location: "البوني، عنابة",
    area: 95, rooms: 2, baths: 2, floor: 4,
    price: "22 000 000", currency: "دج",
    type: "sale",
    img: "images/apt1_2.png",
    imgs: ["images/apt1_2.png","images/apt1_3.png","images/apt1_4.png","images/apt1_1.png","images/apt1_5.png"],
    desc: "شقة مميزة بممر طويل وأنيق مع مرآة ضخمة بإطار أسود، أرضية رخامية بيضاء لامعة، حمامان بتشطيبات عالية الجودة."
  },
  {
    id: 6,
    title: "شقة F4 – واجهة زجاجية حديثة",
    location: "البوني، عنابة",
    area: 120, rooms: 3, baths: 2, floor: 6,
    price: "33 000 000", currency: "دج",
    type: "sale",
    img: "images/apt1_3.png",
    imgs: ["images/apt1_3.png","images/apt1_4.png","images/apt1_1.png","images/apt1_2.png","images/apt1_6.png"],
    desc: "شقة ذات تصميم عصري بواجهة زجاجية تسمح بدخول ضوء طبيعي وفير. مطبخ أمريكي مفتوح، غرف نوم واسعة مع خزائن بناء."
  },
  {
    id: 7,
    title: "شقة F3 – طابق أول + حديقة",
    location: "البوني، عنابة",
    area: 85, rooms: 2, baths: 1, floor: 1,
    price: "18 000 000", currency: "دج",
    type: "sale",
    img: "images/apt1_4.png",
    imgs: ["images/apt1_4.png","images/apt1_1.png","images/apt1_2.png","images/apt1_3.png","images/apt1_5.png"],
    desc: "شقة أرضية مميزة بمدخل مباشر من الحديقة المشتركة. تشطيبات محترفة مع أرضية رخامية لامعة وإضاءة LED مضمنة في السقف."
  },
  {
    id: 8,
    title: "شقة F4 – إطلالة على المدينة",
    location: "البوني، عنابة",
    area: 125, rooms: 3, baths: 2, floor: 11,
    price: "35 000 000", currency: "دج",
    type: "sale",
    img: "images/apt1_1.png",
    imgs: ["images/apt1_1.png","images/apt1_2.png","images/apt1_3.png","images/apt1_4.png","images/apt1_7.png"],
    desc: "شقة بإطلالة خلابة على مدينة عنابة من الطابق الحادي عشر. تشطيبات حديثة راقية، تكييف مركزي، أمن على مدار الساعة."
  }
];

const rentProps = [
  {
    id: 101,
    title: "شقة F3 – إيجار البوني",
    location: "البوني، عنابة",
    area: 85, rooms: 2, baths: 1, floor: 3,
    price: "65 000", currency: "دج/شهر",
    type: "rent",
    img: "images/apt2_1.png",
    imgs: ["images/apt2_1.png","images/apt2_2.png","images/apt2_3.png","images/apt2_4.png"],
    desc: "شقة للإيجار بممر واسع وغرف مريحة، طابق عاشر بمصعد، أمن على مدار الساعة، بالقرب من الجامعات والمراكز التجارية."
  },
  {
    id: 102,
    title: "شقة F4 مجهزة – وسط البوني",
    location: "البوني، عنابة",
    area: 110, rooms: 3, baths: 2, floor: 5,
    price: "90 000", currency: "دج/شهر",
    type: "rent",
    img: "images/apt2_2.png",
    imgs: ["images/apt2_2.png","images/apt2_3.png","images/apt2_4.png","images/apt2_5.png"],
    desc: "شقة مجهزة بالكامل، تشطيبات عالية، أبواب أمان، مدخل مرمري، مصعد حديث، حراسة ليلية ونهارية."
  },
  {
    id: 103,
    title: "شقة F3 طابق 7 – هادئة",
    location: "البوني، عنابة",
    area: 80, rooms: 2, baths: 1, floor: 7,
    price: "58 000", currency: "دج/شهر",
    type: "rent",
    img: "images/apt2_3.png",
    imgs: ["images/apt2_3.png","images/apt2_4.png","images/apt2_5.png","images/apt2_6.png"],
    desc: "شقة هادئة بعيدة عن الضوضاء، أرضية رخامية لامعة، نوافذ بانورامية، قريبة من النقل العام وجميع المرافق."
  },
  {
    id: 104,
    title: "شقة F2 استوديو عصري",
    location: "البوني، عنابة",
    area: 55, rooms: 1, baths: 1, floor: 4,
    price: "42 000", currency: "دج/شهر",
    type: "rent",
    img: "images/apt2_4.png",
    imgs: ["images/apt2_4.png","images/apt2_5.png","images/apt2_6.png","images/apt2_1.png"],
    desc: "استوديو أنيق مثالي للطلاب والمهنيين، تصميم ذكي يستغل كل المساحة، موبيلية حديثة، مدخل البناية مرمري."
  },
  {
    id: 105,
    title: "شقة F5 – عائلية كبيرة",
    location: "البوني، عنابة",
    area: 140, rooms: 4, baths: 3, floor: 2,
    price: "115 000", currency: "دج/شهر",
    type: "rent",
    img: "images/apt2_5.png",
    imgs: ["images/apt2_5.png","images/apt2_6.png","images/apt2_1.png","images/apt2_2.png"],
    desc: "شقة عائلية فسيحة بأربع غرف نوم وثلاثة حمامات، صالون كبير، مطبخ مجهز، طابق ثاني هادئ."
  },
  {
    id: 106,
    title: "شقة F3 – مطبخ مجهز",
    location: "البوني، عنابة",
    area: 75, rooms: 2, baths: 1, floor: 6,
    price: "55 000", currency: "دج/شهر",
    type: "rent",
    img: "images/apt2_6.png",
    imgs: ["images/apt2_6.png","images/apt2_1.png","images/apt2_2.png","images/apt2_3.png"],
    desc: "شقة مجهزة بمطبخ أوروبي كامل مع خزائن خشبية داكنة وكاونتر غرانيت. صالون مريح مع إضاءة طبيعية."
  },
  {
    id: 107,
    title: "شقة F4 – طابق رفيع + مصعد",
    location: "البوني، عنابة",
    area: 100, rooms: 3, baths: 2, floor: 9,
    price: "80 000", currency: "دج/شهر",
    type: "rent",
    img: "images/apt3_1.png",
    imgs: ["images/apt3_1.png","images/apt3_2.png","images/apt3_3.png","images/apt3_4.png"],
    desc: "شقة في طابق رفيع بإطلالة ممتازة، ممر طويل مضاء بإضاءة LED خطية، خزائن بناء، حمام عصري مع دوش زجاجي."
  },
  {
    id: 108,
    title: "شقة F3 – مدخل أنيق",
    location: "البوني، عنابة",
    area: 78, rooms: 2, baths: 1, floor: 5,
    price: "50 000", currency: "دج/شهر",
    type: "rent",
    img: "images/apt3_2.png",
    imgs: ["images/apt3_2.png","images/apt3_3.png","images/apt3_4.png","images/apt3_5.png"],
    desc: "شقة بمدخل بناية مرمري فاخر بإضاءة كلاسيكية، مصعد حديث، صالون مريح مع نافذة بانورامية وشرفة صغيرة."
  }
];

const allProps = [...saleProps, ...rentProps];

// ── RENDER CARDS ──────────────────────────────────
function renderCards(props, gridId, type) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = props.map(p => `
    <div class="pcard reveal" onclick="goDetail(${p.id},'${type}')">
      <div class="pcard-img">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
        <span class="pbadge ${type==='sale'?'pbadge-sale':'pbadge-rent'}">${type==='sale'?'للبيع':'للإيجار'}</span>
        <button class="pfav" onclick="event.stopPropagation();favToggle(this)"><i class="far fa-heart"></i></button>
      </div>
      <div class="pcard-body">
        <h3 class="ptitle">${p.title}</h3>
        <div class="ploc"><i class="fas fa-map-marker-alt"></i> ${p.location}</div>
        <div class="pspecs">
          <div class="pspec"><i class="fas fa-expand-arrows-alt"></i> ${p.area} م²</div>
          <div class="pspec"><i class="fas fa-bed"></i> ${p.rooms} غ</div>
          <div class="pspec"><i class="fas fa-bath"></i> ${p.baths} ح</div>
        </div>
        <div class="pfoot">
          <div class="pprice">${p.price} <span>${p.currency}</span></div>
          <button class="pdetail" onclick="event.stopPropagation();goDetail(${p.id},'${type}')">التفاصيل <i class="fas fa-arrow-left"></i></button>
        </div>
      </div>
    </div>
  `).join('');
}

renderCards(saleProps, 'saleGrid', 'sale');
renderCards(rentProps, 'rentGrid', 'rent');

// ── FAVORITE ──────────────────────────────────────
function favToggle(btn) {
  btn.classList.toggle('active');
  btn.querySelector('i').className = btn.classList.contains('active') ? 'fas fa-heart' : 'far fa-heart';
}

// ── NAVIGATE TO DETAIL ────────────────────────────
function goDetail(id, type) {
  const prop = allProps.find(p => p.id === id);
  if (!prop) return;
  sessionStorage.setItem('prop', JSON.stringify(prop));
  window.location.href = 'property.html';
}

// ── NAVBAR SCROLL ─────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ── MOBILE NAV ────────────────────────────────────
document.getElementById('navToggle').addEventListener('click', function() {
  const nl = document.getElementById('navLinks');
  nl.classList.toggle('open');
  this.innerHTML = nl.classList.contains('open') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// ── SMOOTH SCROLL ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior:'smooth', block:'start' });
      document.getElementById('navLinks').classList.remove('open');
      document.getElementById('navToggle').innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
});

// ── INTERSECTION OBSERVER ─────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

function observeAll() { document.querySelectorAll('.reveal').forEach(el => obs.observe(el)); }
observeAll();
setTimeout(observeAll, 120);
