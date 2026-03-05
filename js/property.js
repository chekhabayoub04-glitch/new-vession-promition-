/* ===================================================
   ANNABA IMMO | property.js
   =================================================== */

const saleProps = [
  { id:1, title:"شقة فاخرة F4 – البوني هيتس", location:"البوني، عنابة", area:110, rooms:3, baths:2, floor:5, price:"28 500 000", currency:"دج", type:"sale", img:"images/apt1_5.png", imgs:["images/apt1_5.png","images/apt1_6.png","images/apt1_7.png","images/apt1_8.png","images/apt1_1.png"], desc:"شقة راقية بتشطيبات عصرية فائقة الجودة في قلب البوني. أرضيات رخامية لامعة، إضاءة LED مدمجة في الأسقف، مرآة بإطار أسود أنيق، وباب أمان فاخر. المبنى مجهز بمصعدين، أمن على مدار الساعة." },
  { id:2, title:"شقة F3 – صالون كبير + شرفة", location:"البوني، عنابة", area:90, rooms:2, baths:1, floor:3, price:"19 800 000", currency:"دج", type:"sale", img:"images/apt1_6.png", imgs:["images/apt1_6.png","images/apt1_7.png","images/apt1_8.png","images/apt1_1.png","images/apt1_2.png"], desc:"شقة عائلية بصالون فسيح وإضاءة طبيعية ممتازة، تطل على شرفة واسعة. تشطيبات حديثة مع أرضية رخامية ووحدة تلفزيون مدمجة بإضاءة خلفية." },
  { id:3, title:"شقة F4 – مدخل فاخر + موقف", location:"البوني، عنابة", area:115, rooms:3, baths:2, floor:7, price:"31 000 000", currency:"دج", type:"sale", img:"images/apt1_7.png", imgs:["images/apt1_7.png","images/apt1_8.png","images/apt1_5.png","images/apt1_6.png","images/apt1_3.png"], desc:"شقة فاخرة بمدخل رئيسي مُصمَّم بعناية مع ألواح خشبية دافئة وباب أمان متعدد النقاط. موقف سيارة خاص في الطابق السفلي." },
  { id:4, title:"شقة F5 – تشطيب VIP", location:"البوني، عنابة", area:135, rooms:4, baths:2, floor:9, price:"38 500 000", currency:"دج", type:"sale", img:"images/apt1_8.png", imgs:["images/apt1_8.png","images/apt1_5.png","images/apt1_6.png","images/apt1_7.png","images/apt1_2.png"], desc:"شقة بنتهاوس بتشطيبات VIP كاملة: سقف مستعار مع إضاءة مخفية، وحدة تلفزيون ضخمة بإضاءة جانبية، أرضيات رخامية بيضاء فائقة الجودة." },
  { id:5, title:"شقة F3 – ممر واسع + حمامان", location:"البوني، عنابة", area:95, rooms:2, baths:2, floor:4, price:"22 000 000", currency:"دج", type:"sale", img:"images/apt1_2.png", imgs:["images/apt1_2.png","images/apt1_3.png","images/apt1_4.png","images/apt1_1.png","images/apt1_5.png"], desc:"شقة مميزة بممر طويل وأنيق مع مرآة ضخمة بإطار أسود، أرضية رخامية بيضاء لامعة، حمامان بتشطيبات عالية الجودة." },
  { id:6, title:"شقة F4 – واجهة زجاجية حديثة", location:"البوني، عنابة", area:120, rooms:3, baths:2, floor:6, price:"33 000 000", currency:"دج", type:"sale", img:"images/apt1_3.png", imgs:["images/apt1_3.png","images/apt1_4.png","images/apt1_1.png","images/apt1_2.png","images/apt1_6.png"], desc:"شقة ذات تصميم عصري بواجهة زجاجية تسمح بدخول ضوء طبيعي وفير. مطبخ أمريكي مفتوح، غرف نوم واسعة مع خزائن بناء." },
  { id:7, title:"شقة F3 – طابق أول + حديقة", location:"البوني، عنابة", area:85, rooms:2, baths:1, floor:1, price:"18 000 000", currency:"دج", type:"sale", img:"images/apt1_4.png", imgs:["images/apt1_4.png","images/apt1_1.png","images/apt1_2.png","images/apt1_3.png","images/apt1_5.png"], desc:"شقة أرضية مميزة بمدخل مباشر من الحديقة المشتركة. تشطيبات محترفة مع أرضية رخامية لامعة وإضاءة LED مضمنة في السقف." },
  { id:8, title:"شقة F4 – إطلالة على المدينة", location:"البوني، عنابة", area:125, rooms:3, baths:2, floor:11, price:"35 000 000", currency:"دج", type:"sale", img:"images/apt1_1.png", imgs:["images/apt1_1.png","images/apt1_2.png","images/apt1_3.png","images/apt1_4.png","images/apt1_7.png"], desc:"شقة بإطلالة خلابة على عنابة من الطابق الحادي عشر. تشطيبات حديثة راقية، تكييف مركزي، أمن على مدار الساعة." }
];
const rentProps = [
  { id:101, title:"شقة F3 – إيجار البوني", location:"البوني، عنابة", area:85, rooms:2, baths:1, floor:3, price:"65 000", currency:"دج/شهر", type:"rent", img:"images/apt2_1.png", imgs:["images/apt2_1.png","images/apt2_2.png","images/apt2_3.png","images/apt2_4.png"], desc:"شقة للإيجار بممر واسع وغرف مريحة، طابق عاشر بمصعد، أمن على مدار الساعة، بالقرب من الجامعات والمراكز التجارية." },
  { id:102, title:"شقة F4 مجهزة – وسط البوني", location:"البوني، عنابة", area:110, rooms:3, baths:2, floor:5, price:"90 000", currency:"دج/شهر", type:"rent", img:"images/apt2_2.png", imgs:["images/apt2_2.png","images/apt2_3.png","images/apt2_4.png","images/apt2_5.png"], desc:"شقة مجهزة بالكامل، تشطيبات عالية، أبواب أمان، مدخل مرمري، مصعد حديث، حراسة ليلية ونهارية." },
  { id:103, title:"شقة F3 طابق 7 – هادئة", location:"البوني، عنابة", area:80, rooms:2, baths:1, floor:7, price:"58 000", currency:"دج/شهر", type:"rent", img:"images/apt2_3.png", imgs:["images/apt2_3.png","images/apt2_4.png","images/apt2_5.png","images/apt2_6.png"], desc:"شقة هادئة بعيدة عن الضوضاء، أرضية رخامية لامعة، نوافذ بانورامية، قريبة من النقل العام وجميع المرافق." },
  { id:104, title:"شقة F2 استوديو عصري", location:"البوني، عنابة", area:55, rooms:1, baths:1, floor:4, price:"42 000", currency:"دج/شهر", type:"rent", img:"images/apt2_4.png", imgs:["images/apt2_4.png","images/apt2_5.png","images/apt2_6.png","images/apt2_1.png"], desc:"استوديو أنيق مثالي للطلاب والمهنيين، تصميم ذكي يستغل كل المساحة، موبيلية حديثة، مدخل البناية مرمري." },
  { id:105, title:"شقة F5 – عائلية كبيرة", location:"البوني، عنابة", area:140, rooms:4, baths:3, floor:2, price:"115 000", currency:"دج/شهر", type:"rent", img:"images/apt2_5.png", imgs:["images/apt2_5.png","images/apt2_6.png","images/apt2_1.png","images/apt2_2.png"], desc:"شقة عائلية فسيحة بأربع غرف نوم وثلاثة حمامات، صالون كبير، مطبخ مجهز، طابق ثاني هادئ." },
  { id:106, title:"شقة F3 – مطبخ مجهز", location:"البوني، عنابة", area:75, rooms:2, baths:1, floor:6, price:"55 000", currency:"دج/شهر", type:"rent", img:"images/apt2_6.png", imgs:["images/apt2_6.png","images/apt2_1.png","images/apt2_2.png","images/apt2_3.png"], desc:"شقة مجهزة بمطبخ أوروبي كامل مع خزائن خشبية داكنة وكاونتر غرانيت. صالون مريح مع إضاءة طبيعية." },
  { id:107, title:"شقة F4 – طابق رفيع + مصعد", location:"البوني، عنابة", area:100, rooms:3, baths:2, floor:9, price:"80 000", currency:"دج/شهر", type:"rent", img:"images/apt3_1.png", imgs:["images/apt3_1.png","images/apt3_2.png","images/apt3_3.png","images/apt3_4.png"], desc:"شقة في طابق رفيع بإطلالة ممتازة، ممر طويل مضاء بإضاءة LED خطية، خزائن بناء، حمام عصري مع دوش زجاجي." },
  { id:108, title:"شقة F3 – مدخل أنيق", location:"البوني، عنابة", area:78, rooms:2, baths:1, floor:5, price:"50 000", currency:"دج/شهر", type:"rent", img:"images/apt3_2.png", imgs:["images/apt3_2.png","images/apt3_3.png","images/apt3_4.png","images/apt3_5.png"], desc:"شقة بمدخل بناية مرمري فاخر بإضاءة كلاسيكية، مصعد حديث، صالون مريح مع نافذة بانورامية وشرفة صغيرة." }
];
const allProps = [...saleProps, ...rentProps];

// ── LOAD ─────────────────────────────────────────
let prop = null;
try { prop = JSON.parse(sessionStorage.getItem('prop')); } catch(e) {}
if (!prop) prop = saleProps[0];

// ── LIGHTBOX ─────────────────────────────────────
let lbImgs = [], lbIdx = 0;
function openLB(idx) { lbIdx = idx; updateLB(); document.getElementById('lb').classList.add('on'); }
function updateLB() {
  document.getElementById('lbImg').src = lbImgs[lbIdx];
  document.getElementById('lbCtr').textContent = `${lbIdx+1} / ${lbImgs.length}`;
}
document.getElementById('lbX').addEventListener('click', () => document.getElementById('lb').classList.remove('on'));
document.getElementById('lbP').addEventListener('click', () => { lbIdx = (lbIdx-1+lbImgs.length)%lbImgs.length; updateLB(); });
document.getElementById('lbN').addEventListener('click', () => { lbIdx = (lbIdx+1)%lbImgs.length; updateLB(); });
document.getElementById('lb').addEventListener('click', function(e){ if(e.target===this) this.classList.remove('on'); });
document.addEventListener('keydown', e => {
  if (!document.getElementById('lb').classList.contains('on')) return;
  if (e.key==='Escape') document.getElementById('lb').classList.remove('on');
  if (e.key==='ArrowRight') { lbIdx=(lbIdx-1+lbImgs.length)%lbImgs.length; updateLB(); }
  if (e.key==='ArrowLeft')  { lbIdx=(lbIdx+1)%lbImgs.length; updateLB(); }
});

// ── RENDER ───────────────────────────────────────
function render(p) {
  const isRent = p.type === 'rent';
  lbImgs = p.imgs;
  const similar = allProps.filter(x => x.id !== p.id && x.type === p.type).slice(0, 3);
  const feats = ['أرضيات رخامية','إضاءة LED','باب أمان','مصعد حديث','أمن 24/24','موقف سيارة','تكييف مركزي','خزائن بناء','حمام عصري','نظام إنترنت'];

  document.getElementById('detailRoot').innerHTML = `
    <!-- BREADCRUMB -->
    <div style="display:flex;align-items:center;gap:8px;color:var(--muted);font-size:13px;margin-bottom:28px">
      <a href="index.html" style="color:var(--gold);text-decoration:none">الرئيسية</a>
      <i class="fas fa-chevron-left" style="font-size:10px"></i>
      <a href="index.html#${isRent?'rental':'properties'}" style="color:var(--gold);text-decoration:none">${isRent?'شقق للإيجار':'شقق للبيع'}</a>
      <i class="fas fa-chevron-left" style="font-size:10px"></i>
      <span>${p.title}</span>
    </div>

    <!-- GALLERY -->
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:10px;margin-bottom:46px;border-radius:14px;overflow:hidden">
      <div style="position:relative;height:460px;overflow:hidden;cursor:zoom-in" onclick="openLB(0)">
        <img src="${p.imgs[0]}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
        <span style="position:absolute;top:14px;right:14px;background:${isRent?'#27ae60':'var(--gold)'};color:${isRent?'#0a1f0f':'var(--bg-deep)'};font-size:12px;font-weight:700;padding:6px 18px;border-radius:50px">${isRent?'للإيجار':'للبيع'}</span>
      </div>
      <div style="display:grid;grid-template-rows:repeat(2,1fr);gap:10px">
        ${p.imgs.slice(1,3).map((img,i)=>`<div style="overflow:hidden;cursor:zoom-in;border-radius:4px" onclick="openLB(${i+1})"><img src="${img}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.4s" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"></div>`).join('')}
      </div>
    </div>
    ${p.imgs.length>3?`<div style="display:flex;gap:8px;margin-bottom:40px;flex-wrap:wrap">${p.imgs.slice(3).map((img,i)=>`<div onclick="openLB(${i+3})" style="width:80px;height:60px;border-radius:6px;overflow:hidden;cursor:zoom-in;border:2px solid var(--border);transition:border-color 0.2s" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--border)'"><img src="${img}" style="width:100%;height:100%;object-fit:cover"></div>`).join('')}</div>`:''}

    <!-- CONTENT GRID -->
    <div style="display:grid;grid-template-columns:1fr 350px;gap:36px;align-items:start">
      <!-- LEFT -->
      <div>
        <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(201,168,76,0.1);border:1px solid var(--border);border-radius:50px;padding:6px 16px;font-size:11px;color:var(--gold);font-weight:700;margin-bottom:14px"><span style="width:6px;height:6px;border-radius:50%;background:var(--gold);display:inline-block"></span> ${isRent?'عقار للإيجار':'عقار للبيع'}</div>
        <h1 style="font-size:clamp(20px,3vw,34px);font-weight:900;margin-bottom:10px;line-height:1.2">${p.title}</h1>
        <div style="display:flex;align-items:center;gap:8px;color:var(--muted);font-size:14px;margin-bottom:26px"><i class="fas fa-map-marker-alt" style="color:var(--gold)"></i> ${p.location}</div>

        <!-- PRICE BOX -->
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:22px 26px;margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px">
          <div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:5px">${isRent?'الإيجار الشهري':'سعر البيع'}</div>
            <div style="font-size:36px;font-weight:900;color:var(--gold)">${p.price} <span style="font-size:15px;font-weight:500;color:var(--muted)">${p.currency}</span></div>
          </div>
          <button onclick="shareP()" style="display:inline-flex;align-items:center;gap:8px;color:var(--muted);font-size:13px;background:none;border:1px solid var(--border);border-radius:6px;padding:10px 16px;cursor:pointer;font-family:'Cairo',sans-serif;transition:all 0.3s" onmouseover="this.style.color='var(--gold)';this.style.borderColor='var(--gold)'" onmouseout="this.style.color='var(--muted)';this.style.borderColor='var(--border)'"><i class="fas fa-share-alt"></i> مشاركة</button>
        </div>

        <!-- SPECS -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:36px">
          ${[['fas fa-expand-arrows-alt',p.area,'م²'],['fas fa-bed',p.rooms,'غرف نوم'],['fas fa-bath',p.baths,'حمامات'],['fas fa-layer-group',p.floor,'الطابق']].map(([ic,v,l])=>`
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:18px;text-align:center;transition:all 0.3s" onmouseover="this.style.borderColor='var(--border-h)'" onmouseout="this.style.borderColor='var(--border)'">
            <i class="${ic}" style="font-size:22px;color:var(--gold);margin-bottom:8px;display:block"></i>
            <div style="font-size:20px;font-weight:800;margin-bottom:3px">${v}</div>
            <div style="font-size:11px;color:var(--muted)">${l}</div>
          </div>`).join('')}
        </div>

        <!-- DESC -->
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:28px;margin-bottom:22px">
          <h3 style="font-size:17px;font-weight:700;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:9px"><i class="fas fa-info-circle" style="color:var(--gold);font-size:15px"></i> وصف العقار</h3>
          <p style="color:var(--muted);font-size:14px;line-height:1.95">${p.desc}</p>
          <p style="color:var(--muted);font-size:14px;line-height:1.95;margin-top:14px">يقع العقار في حي البوني الراقي بعنابة، من أرقى الأحياء السكنية. سهولة التنقل إلى جميع أنحاء عنابة عبر المترو والحافلات، وقرب من الجامعات، المستشفيات والمراكز التجارية الكبرى.</p>
        </div>

        <!-- FEATURES -->
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:28px;margin-bottom:22px">
          <h3 style="font-size:17px;font-weight:700;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:9px"><i class="fas fa-star" style="color:var(--gold);font-size:15px"></i> المميزات والمرافق</h3>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:11px">
            ${feats.map(f=>`<div style="display:flex;align-items:center;gap:10px;font-size:13px;color:var(--light)"><i class="fas fa-check-circle" style="color:var(--gold);font-size:12px"></i> ${f}</div>`).join('')}
          </div>
        </div>

        <!-- MAP -->
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:28px">
          <h3 style="font-size:17px;font-weight:700;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:9px"><i class="fas fa-map-marked-alt" style="color:var(--gold);font-size:15px"></i> الموقع</h3>
          <div style="width:100%;height:230px;background:linear-gradient(135deg,#181818,#222);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border:1px dashed var(--border)">
            <i class="fas fa-map-marker-alt" style="font-size:34px;color:var(--gold)"></i>
            <p style="color:var(--muted);font-size:13px">حي البوني، عنابة</p>
            <a href="https://maps.google.com/?q=El+Bouni+Annaba" target="_blank" style="color:var(--gold);font-size:12px;text-decoration:none;border:1px solid var(--border);padding:7px 16px;border-radius:6px">فتح في خرائط Google <i class="fas fa-external-link-alt"></i></a>
          </div>
        </div>
      </div>

      <!-- SIDEBAR -->
      <div style="position:sticky;top:80px">
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:14px;overflow:hidden">
          <div style="background:linear-gradient(135deg,var(--gold),var(--gold-dim));padding:22px 26px">
            <h3 style="font-size:17px;font-weight:700;color:var(--bg-deep);margin-bottom:4px">اطلب استشارة مجانية</h3>
            <p style="font-size:12px;color:rgba(10,10,10,0.65)">سنرد عليك في أقل من ساعة</p>
          </div>
          <div style="padding:26px">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:22px;padding-bottom:20px;border-bottom:1px solid var(--border)">
              <div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-dim));display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--bg-deep);flex-shrink:0"><i class="fas fa-user-tie"></i></div>
              <div>
                <div style="font-size:14px;font-weight:700">كريم بن علي</div>
                <div style="font-size:11px;color:var(--muted);margin-top:2px">مستشار عقاري – البوني</div>
                <div style="display:flex;align-items:center;gap:3px;margin-top:3px;color:var(--gold);font-size:10px"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i><span style="color:var(--muted);margin-right:4px">4.8</span></div>
              </div>
            </div>
            <div style="margin-bottom:14px">
              <label style="display:block;font-size:12px;font-weight:600;color:var(--muted);margin-bottom:6px">الاسم الكامل</label>
              <input id="cName" type="text" placeholder="اسمك الكامل" style="width:100%;background:var(--bg-section);border:1px solid var(--border);border-radius:7px;color:var(--white);font-family:'Cairo',sans-serif;font-size:13px;padding:11px 14px;outline:none;transition:border-color 0.2s" onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--border)'">
            </div>
            <div style="margin-bottom:14px">
              <label style="display:block;font-size:12px;font-weight:600;color:var(--muted);margin-bottom:6px">رقم الهاتف</label>
              <input id="cPhone" type="tel" placeholder="05x xx xx xx xx" style="width:100%;background:var(--bg-section);border:1px solid var(--border);border-radius:7px;color:var(--white);font-family:'Cairo',sans-serif;font-size:13px;padding:11px 14px;outline:none;transition:border-color 0.2s" onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--border)'">
            </div>
            <div style="margin-bottom:18px">
              <label style="display:block;font-size:12px;font-weight:600;color:var(--muted);margin-bottom:6px">رسالة</label>
              <textarea id="cMsg" rows="3" style="width:100%;background:var(--bg-section);border:1px solid var(--border);border-radius:7px;color:var(--white);font-family:'Cairo',sans-serif;font-size:13px;padding:11px 14px;outline:none;transition:border-color 0.2s;resize:vertical" onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--border)'">أريد الاستفسار عن: ${p.title}</textarea>
            </div>
            <button onclick="sendMsg()" style="width:100%;background:linear-gradient(135deg,var(--gold),var(--gold-dim));color:var(--bg-deep);font-family:'Cairo',sans-serif;font-size:15px;font-weight:700;padding:15px;border:none;border-radius:8px;cursor:pointer;transition:all 0.3s;display:flex;align-items:center;justify-content:center;gap:9px" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 10px 28px rgba(201,168,76,0.35)'" onmouseout="this.style.transform='none';this.style.boxShadow='none'"><i class="fas fa-paper-plane"></i> إرسال الاستفسار</button>
            <div id="successMsg" style="display:none;background:rgba(39,174,96,0.14);border:1px solid rgba(39,174,96,0.38);border-radius:7px;padding:14px;color:#27ae60;text-align:center;font-size:13px;margin-top:14px"><i class="fas fa-check-circle"></i> تم إرسال رسالتك! سنتواصل معك قريباً.</div>
          </div>
          <div style="padding:0 26px 26px;display:grid;grid-template-columns:1fr 1fr;gap:9px">
            <a href="tel:+213551234567" style="display:flex;align-items:center;justify-content:center;gap:7px;padding:11px;border:1px solid var(--border);border-radius:8px;color:var(--light);font-size:12px;font-weight:600;text-decoration:none;transition:all 0.3s" onmouseover="this.style.borderColor='var(--gold)';this.style.color='var(--gold)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--light)'"><i class="fas fa-phone-alt"></i> اتصل</a>
            <a href="https://wa.me/213551234567" style="display:flex;align-items:center;justify-content:center;gap:7px;padding:11px;border:1px solid var(--border);border-radius:8px;color:var(--light);font-size:12px;font-weight:600;text-decoration:none;transition:all 0.3s" onmouseover="this.style.borderColor='#25D366';this.style.color='#25D366'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--light)'"><i class="fab fa-whatsapp" style="color:#25D366"></i> واتساب</a>
          </div>
        </div>
      </div>
    </div>

    <!-- SIMILAR -->
    <div style="margin-top:55px">
      <h2 style="font-size:22px;font-weight:900;margin-bottom:7px">عقارات مشابهة</h2>
      <div style="width:48px;height:3px;background:linear-gradient(90deg,var(--gold),transparent);margin-bottom:28px"></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
        ${similar.map(s=>`
        <div onclick="loadProp(${s.id},'${s.type}')" style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;overflow:hidden;cursor:pointer;transition:all 0.35s" onmouseover="this.style.transform='translateY(-4px)';this.style.borderColor='var(--border-h)'" onmouseout="this.style.transform='none';this.style.borderColor='var(--border)'">
          <img src="${s.img}" alt="${s.title}" style="width:100%;height:155px;object-fit:cover">
          <div style="padding:15px">
            <div style="font-size:13px;font-weight:700;margin-bottom:6px">${s.title}</div>
            <div style="font-size:11px;color:var(--muted);margin-bottom:9px"><i class="fas fa-map-marker-alt" style="color:var(--gold)"></i> ${s.location}</div>
            <div style="font-size:16px;font-weight:800;color:var(--gold)">${s.price} <span style="font-size:11px;font-weight:500;color:var(--muted)">${s.currency}</span></div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  `;
  document.title = `${p.title} | عنابة إيمو`;
  setupLB(p.imgs);
}

function setupLB(imgs) { lbImgs = imgs; }
function sendMsg() {
  const n = document.getElementById('cName').value.trim();
  const ph = document.getElementById('cPhone').value.trim();
  if (!n || !ph) { alert('الرجاء ملء الاسم والهاتف'); return; }
  document.getElementById('successMsg').style.display = 'block';
  document.getElementById('cName').value = '';
  document.getElementById('cPhone').value = '';
  document.getElementById('cMsg').value = '';
}
function shareP() {
  if (navigator.share) navigator.share({ title: prop.title, url: location.href });
  else { navigator.clipboard.writeText(location.href); alert('تم نسخ رابط العقار!'); }
}
function loadProp(id, type) {
  const p = allProps.find(x => x.id === id);
  if (p) { prop = p; sessionStorage.setItem('prop', JSON.stringify(p)); render(p); scrollTo({top:0,behavior:'smooth'}); }
}

render(prop);
