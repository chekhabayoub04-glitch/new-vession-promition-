/* ===================================================
   HOTEL YOUCEF · data.js — every editable fact lives here
   ⚠️ Values marked TODO are placeholders: confirm them with the hotel.
   =================================================== */

const HOTEL = {
  name: 'HOTEL YOUCEF',
  nameAr: 'فندق يوسف',
  city: 'Khenchela',
  cityAr: 'خنشلة',
  address: 'ولاية خنشلة، الجزائر',
  lat: 35.4633375,
  lng: 7.0939309,
  mapsUrl: 'https://www.google.com/maps/place/HOTEL+YOUCEF/@35.4633375,7.0939309,17z/data=!4m6!3m5!1s0x12f727f3eaa196c1:0xa45dd537eee57736!8m2!3d35.4633375!4d7.0939309',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=35.4633375,7.0939309',
  phone: '032 XX XX XX',          // TODO: the hotel's real number
  phoneRaw: '+21332000000',       // TODO
  whatsapp: '213000000000',       // TODO: international format, no "+"
  email: 'reservation@hotel-youcef.dz', // TODO
  checkIn: '14:00',               // TODO
  checkOut: '12:00',              // TODO
  breakfast: 800,                 // TODO: DZD per person per night
  currency: 'دج'
};

// Unsplash ID → URL; a local path (assets/…) is returned as is
const img = (id, w = 1200, h) => (id.includes('/') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=75`);
// Large local photos also have a 900px copy in assets/img/sm/ — phones load that one (faster download and decode)
const SMALL = ['atrium', 'lobby', 'room-1', 'room-360', 'room-bed', 'single-2', 'twin-1'];
const PHONE = matchMedia('(max-width: 760px)').matches;
const pic = p => {
  const m = /^assets\/img\/([\w-]+)\.jpg$/.exec(p);
  return PHONE && m && SMALL.includes(m[1]) ? `assets/img/sm/${m[1]}.jpg` : p;
};
const LOCAL = { pool: 'assets/img/hotel-pool.jpg', lobby: 'assets/img/lobby.jpg', atrium: 'assets/img/atrium.jpg', room: 'assets/img/room-1.jpg',
  roomWide: 'assets/img/room-360.jpg', roomBed: 'assets/img/room-bed.jpg',
  twin: 'assets/img/twin-1.jpg', single1: 'assets/img/single-1.jpg', single2: 'assets/img/single-2.jpg'
};

const AMENITIES = {
  wifi: ['wifi', 'واي فاي مجاني'],
  ac: ['air-vent', 'تكييف وتدفئة'],
  tv: ['tv', 'تلفاز بشاشة مسطحة'],
  shower: ['shower-head', 'حمّام خاص بدُش'],
  bathtub: ['bath', 'حوض استحمام'],
  balcony: ['sun', 'شرفة خاصة'],
  minibar: ['refrigerator', 'ثلاجة صغيرة'],
  safe: ['lock', 'خزنة'],
  desk: ['lamp-desk', 'مكتب عمل'],
  kettle: ['coffee', 'ركن قهوة وشاي'],
  sofa: ['sofa', 'صالون جلوس'],
  service: ['concierge-bell', 'خدمة الغرف']
};

// TODO: real prices, sizes and photos of each room type
const ROOMS = [
  {
    id: 'single', name: 'غرفة فردية', latin: 'Chambre Single', price: 6500, guests: 1, size: 18,
    bed: 'سرير فردي واسع', view: 'إطلالة على المدينة',
    short: 'هادئة وعملية — مثالية لرحلات العمل والإقامة القصيرة.',
    desc: 'غرفة مريحة بتصميم بسيط وإضاءة دافئة، مكتب عمل وإنترنت سريع، وحمّام خاص. خيار ذكي لمن يزور خنشلة في مهمة عمل.',
    amenities: ['wifi', 'ac', 'tv', 'shower', 'desk', 'kettle'],
    photos: [LOCAL.single1, LOCAL.single2, '1552321554-5fefe8c9ef14']
  },
  {
    id: 'double', name: 'غرفة مزدوجة', latin: 'Chambre Double', price: 8500, guests: 2, size: 24,
    bed: 'سرير مزدوج كبير', view: 'إطلالة على المسبح', pano: 'room', popular: true,
    short: 'سرير كبير وشرفة تطل على المسبح — الأكثر طلباً.',
    desc: 'غرفة رحبة بسرير مزدوج كبير وشرفة خاصة بحاجز زجاجي تطل على المسبح والحديقة. تشطيبات أنيقة، تكييف، وحمّام عصري.',
    amenities: ['wifi', 'ac', 'tv', 'shower', 'balcony', 'minibar', 'kettle'],
    photos: [LOCAL.room, LOCAL.roomBed, LOCAL.roomWide, '1584622650111-993a426fbf0a']
  },
  {
    id: 'twin', name: 'غرفة بسريرين', latin: 'Chambre Twin', price: 8500, guests: 2, size: 24,
    bed: 'سريران منفصلان', view: 'إطلالة على المدينة',
    short: 'سريران منفصلان — للأصدقاء والزملاء.',
    desc: 'نفس راحة الغرفة المزدوجة مع سريرين منفصلين. مناسبة للزملاء في رحلة عمل أو للأصدقاء.',
    amenities: ['wifi', 'ac', 'tv', 'shower', 'balcony', 'kettle'],
    photos: [LOCAL.twin, '1590490360182-c33d57733427', '1552321554-5fefe8c9ef14']
  },
  {
    id: 'family', name: 'غرفة عائلية', latin: 'Chambre Familiale', price: 13000, guests: 4, size: 34,
    bed: 'سرير مزدوج + سريران', view: 'إطلالة على المسبح',
    short: 'مساحة للجميع — العائلة كلها تحت سقف واحد.',
    desc: 'غرفة واسعة بسرير مزدوج وسريرين فرديين وركن جلوس، مع شرفة على المسبح. مثالية للعائلات القادمة لزيارة خنشلة أو لحضور حفلة.',
    amenities: ['wifi', 'ac', 'tv', 'shower', 'balcony', 'sofa', 'minibar', 'kettle'],
    photos: ['1590490360182-c33d57733427', '1540518614846-7eded433c457', '1620626011761-996317b8d101']
  },
  {
    id: 'suite', name: 'الجناح', latin: 'Suite Junior', price: 16000, guests: 3, size: 42,
    bed: 'سرير كبير جداً + صالون', view: 'إطلالة بانورامية',
    short: 'صالون منفصل، حوض استحمام وإطلالة بانورامية.',
    desc: 'أرقى إقامة في الفندق: غرفة نوم بسرير كبير جداً، صالون مستقل، حمّام بحوض استحمام، وشرفة واسعة بإطلالة على المسبح وجبال الأوراس.',
    amenities: ['wifi', 'ac', 'tv', 'bathtub', 'balcony', 'sofa', 'minibar', 'safe', 'kettle', 'service'],
    photos: ['1578683010236-d716f9a3f461', '1611892440504-42a792e24d32', '1620626011761-996317b8d101', '1505693416388-ac5ce068fe85']
  }
];

// 360° panoramas (equirectangular 2:1). Add the hotel's own: { id, title, src, srcMobile }
const PANOS = [
  { id: 'lobby', title: 'بهو الاستقبال', icon: 'sofa', src: 'assets/360/hotel.jpg', srcMobile: 'assets/360/hotel-m.jpg', poster: LOCAL.lobby, yaw: -1.62, pitch: 0.08, real: true },
  { id: 'atrium', title: 'الرواق العلوي', icon: 'landmark', src: 'assets/360/hotel2.jpg', srcMobile: 'assets/360/hotel2-m.jpg', poster: LOCAL.atrium, yaw: -1.78, pitch: 0.04, real: true },
  { id: 'room', title: 'غرفة مزدوجة', icon: 'bed-double', src: 'assets/360/hotel3.jpg', srcMobile: 'assets/360/hotel3-m.jpg', poster: LOCAL.roomWide, yaw: -1.7, pitch: -0.16, real: true },
  { id: 'pool', title: 'المسبح', icon: 'waves', src: 'assets/360/pool.jpg', srcMobile: 'assets/360/pool-m.jpg' }
];

const GALLERY = [
  { src: LOCAL.lobby, cat: 'hotel', alt: 'بهو الاستقبال والنافورة الرخامية', real: true },
  { src: LOCAL.room, cat: 'rooms', alt: 'غرفة مزدوجة', tall: true, real: true },
  { src: LOCAL.atrium, cat: 'hotel', alt: 'الرواق العلوي وطوابق الجبس المنقوش', real: true },
  { src: LOCAL.pool, cat: 'pool', alt: 'المسبح والواجهة', real: true },
  { src: LOCAL.roomWide, cat: 'rooms', alt: 'غرفة مزدوجة مزيّنة للعرسان', real: true },
  { src: LOCAL.single1, cat: 'rooms', alt: 'غرفة فردية', tall: true, real: true },
  { src: LOCAL.twin, cat: 'rooms', alt: 'غرفة بسريرين', real: true },
  { src: 'assets/img/hero-fountain.webp', cat: 'hotel', alt: 'النافورة في قلب البهو', real: true },
  { src: LOCAL.single2, cat: 'rooms', alt: 'ركن المكتب والجلوس في الغرفة الفردية', tall: true, real: true },
  { src: LOCAL.roomBed, cat: 'rooms', alt: 'سرير الغرفة المزدوجة', real: true }
];
const GALLERY_CATS = { all: 'الكل', hotel: 'الفندق', rooms: 'الغرف', pool: 'المسبح', dining: 'المطعم', events: 'الحفلات' };

const roomById = id => ROOMS.find(r => r.id === id);
const fmt = n => n.toLocaleString('fr-FR').replace(/[   ]/g, ' ');
const nightsLabel = n => (n === 1 ? 'ليلة واحدة' : n === 2 ? 'ليلتان' : n <= 10 ? `${n} ليالٍ` : `${n} ليلة`);
const money = n => `${fmt(n)} ${HOTEL.currency}`;

// Dates as local YYYY-MM-DD (input[type=date] format)
const isoDate = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parseISO = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const nightsBetween = (a, b) => (a && b ? Math.round((parseISO(b) - parseISO(a)) / 864e5) : 0);
const arDate = s => parseISO(s).toLocaleDateString('ar-DZ', { weekday: 'long', day: 'numeric', month: 'long' });

function quote({ room, nights, guests, breakfast }) {
  const r = roomById(room);
  if (!r || nights < 1) return null;
  const rooms = r.price * nights;
  const bf = breakfast ? HOTEL.breakfast * guests * nights : 0;
  return { rooms, bf, total: rooms + bf };
}

function bookingText(b) {
  const r = roomById(b.room);
  const q = quote(b);
  return [
    `السلام عليكم، أود حجز إقامة في ${HOTEL.nameAr}:`,
    r && `• الغرفة: ${r.name} (${r.latin})`,
    b.arrive && `• الوصول: ${arDate(b.arrive)}`,
    b.depart && `• المغادرة: ${arDate(b.depart)}${b.nights ? ` — ${nightsLabel(b.nights)}` : ''}`,
    `• الأشخاص: ${b.guests}${b.kids ? ` + ${b.kids} أطفال` : ''}`,
    b.breakfast && '• مع فطور الصباح',
    q && `• التقدير: ${money(q.total)}`,
    b.note && `• ملاحظة: ${b.note}`,
    'هل الغرفة متاحة؟ شكراً.'
  ].filter(Boolean).join('\n');
}

const waLink = text => `https://wa.me/${HOTEL.whatsapp}?text=${encodeURIComponent(text || `السلام عليكم، أود الاستفسار عن ${HOTEL.nameAr}.`)}`;
const mailLink = (subject, body) => `mailto:${HOTEL.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.22 4.25-9.46 9.48-9.46a9.42 9.42 0 0 1 9.46 9.47c0 5.22-4.25 9.46-9.46 9.46zm8.05-17.52A11.3 11.3 0 0 0 12.04.65C5.77.65.66 5.75.66 12.02c0 2 .52 3.96 1.52 5.68L.57 23.35l5.79-1.52a11.36 11.36 0 0 0 5.67 1.45h.01c6.27 0 11.37-5.1 11.38-11.37 0-3.04-1.18-5.9-3.33-8.04z"/></svg>';


// ── Packages — TODO: real offers & prices ──
const OFFERS = [
  { title: 'ليلة العرسان', tags: 'أعراس · رومانسية', nights: 1, price: 18000, photo: LOCAL.roomBed, text: 'الغرفة مزيّنة، فطور في الغرفة، ومغادرة متأخرة.' },
  { title: 'عطلة العائلة', tags: 'عائلة · مسبح · نهاية الأسبوع', nights: 2, price: 24000, photo: LOCAL.twin, text: 'غرفة عائلية، فطور للجميع، ووقت بلا حدود في المسبح.' },
  { title: 'رحلة عمل', tags: 'عمل · واي فاي · هدوء', nights: 1, price: 7500, photo: LOCAL.single2, text: 'غرفة هادئة بمكتب، فطور مبكر وفاتورة باسم الشركة.' },
  { title: 'شتاء الأوراس', tags: 'شتاء · طبيعة · شيليا', nights: 3, price: 27000, photo: LOCAL.atrium, text: 'ثلاث ليالٍ، فطور، ونصائح الاستقبال لاكتشاف الأوراس وحمّام الصالحين.' }
];

// ── Three pillars (1-2-3) ──
const PILLARS = [
  { n: '01', title: 'أولاً: الهدوء.', text: 'غرف بعزل جيد، أسرّة مريحة وستائر معتمة. هنا تنام كما يجب — بعيداً عن ضجيج الطريق.', cta: 'اكتشف الغرف', href: '#rooms', photo: LOCAL.room },
  { n: '02', title: 'ثانياً: اللمّة.', text: 'مطعم، مقهى وقاعة حفلات — لأن أجمل اللحظات في خنشلة تُعاش مع العائلة والأصدقاء.', cta: 'قاعة الحفلات', href: '#events', photo: img('1517248135467-4c7edcad34c4', 1400) },
  { n: '03', title: 'ثالثاً: الأوراس.', text: 'جبال شيليا، غابات الأرز وحمّام الصالحين — كلها قريبة. نحن نقطة انطلاقك.', cta: 'اكتشف خنشلة', href: '#khenchela', photo: img('1506905925346-21bda4d32df4', 1400) }
];

// ── Service tiles (carousel) ──
const SERVICES = [
  { title: 'المسبح', line: 'ماء. شمس. هدوء.', photo: LOCAL.pool, pos: 'center 70%' },
  { title: 'المطعم', line: 'نكهة جزائرية. لمسة عالمية.', photo: img('1414235077428-338989a2e8c0', 900) },
  { title: 'المقهى', line: 'قهوة الصباح وهواء الأوراس.', photo: img('1554118811-1e0d58224f24', 900) },
  { title: 'قاعة الحفلات', line: 'ليلة العمر.', photo: img('1511795409834-ef04bbd61622', 900) },
  { title: 'الجناح', line: 'أرقى إقامة في الفندق.', photo: img('1611892440504-42a792e24d32', 900) },
  { title: 'البهو', line: 'استقبال على مدار الساعة.', photo: LOCAL.lobby }
];

// ── A day at the hotel ──
const DAY = [
  { time: '06:00', title: 'فجرٌ فوق الأوراس', text: 'افتح ستارة الشرفة: الضوء الأول يلامس قمم الجبال، والمدينة ما زالت نائمة.', photo: img('1506905925346-21bda4d32df4', 1100) },
  { time: '08:00', title: 'فطور على مهل', text: 'قهوة، خبز الدار، عسل وزيت زيتون — فطور جزائري يبدأ به يومك.', photo: img('1495474472287-4d71bcdd2085', 1100) },
  { time: '11:00', title: 'المسبح لك', text: 'كرسي تحت المظلة، ماء صافٍ وكتاب تحبه. لا شيء آخر مطلوب.', photo: LOCAL.pool },
  { time: '14:00', title: 'غداء في المطعم', text: 'أطباق من المطبخ الجزائري والعالمي، تُحضَّر طازجة في مطعم الفندق.', photo: img('1414235077428-338989a2e8c0', 1100) },
  { time: '17:00', title: 'إلى الأوراس', text: 'جولة نحو غابات شيليا أو حمّام الصالحين — الاستقبال يرشدك إلى الطريق.', photo: img('1464822759023-fed622ff2c3b', 1100) },
  { time: '21:00', title: 'ليلة هادئة', text: 'المسبح مضاء، الشرفات دافئة، والفندق يهمس: تصبح على خير.', photo: img('1542314831-068cd1dbfeeb', 1100) }
];
