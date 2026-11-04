// booking.js — form.booking → §10 WhatsApp message (mailto: fallback)
import { $$, json, ready, roomName, waLink, waForm, site } from './main.js';

const message = f => ['السلام عليكم، أريد الحجز في فندق يوسف.',
  `الغرفة: ${f.room.value ? f.room.selectedOptions[0].text : 'يقترحها الاستقبال'}`,
  `الوصول: ${f.arrive.value} — المغادرة: ${f.depart.value}`,
  `الأشخاص: ${f.adults.value} كبار، ${f.children.value} أطفال`,
  `الفطور: ${f.breakfast.checked ? 'نعم' : 'لا'}`,
  `الاسم: ${f.guest.value.trim()}`].join('\n');

ready.then(() => json('data/rooms.json')).then(rooms => {
  for (const f of $$('form.booking')) {
    f.room.insertAdjacentHTML('beforeend', rooms.map((r, i) => `<option value="${r.id}">${roomName(r, i)}</option>`).join(''));
    f.room.value = new URLSearchParams(location.search).get('room') || '';
    f.arrive.onchange = () => (f.depart.min = f.arrive.value);
    waForm(f, (f, btn) => btn?.dataset.via === 'mail'
      ? (location.href = `mailto:${site.email || ''}?subject=${encodeURIComponent('طلب حجز — فندق يوسف')}&body=${encodeURIComponent(message(f))}`)
      : open(waLink(message(f)), '_blank', 'noopener'));
  }
});
