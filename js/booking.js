// booking.js — «احجز» without a form (no auto-filled, fake requests): the visitor writes the email himself.
// Computer: Gmail opens on a new message to the reservations desk. Phone: the phone's mail app (Gmail on Android).
// Only the subject is set, so the hotel sees at once what the message is about (stay, a given room, an event quote).
import { $, $$, ready, site, tt, MODAL } from './main.js?v=15c5ec84';

const phone = matchMedia('(pointer: coarse)').matches;
const to = () => site.bookingEmail || site.email || 'reservation.hotelyoucef@gmail.com';

export function compose(box, subject = box.dataset.subject) {
  const su = encodeURIComponent(subject || '');
  $$('[data-compose]', box).forEach(a => {
    a.href = phone ? `mailto:${to()}?subject=${su}` : `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to())}&su=${su}`;
    phone ? a.removeAttribute('target') : (a.target = '_blank');
    $('span', a).textContent = phone ? tt('اكتب لنا رسالة', 'Nous écrire', 'Write to us') : tt('اكتب لنا عبر Gmail', 'Nous écrire via Gmail', 'Write to us in Gmail');
  });
}

ready.then(() => $$('.reach').forEach(b => compose(b)));

addEventListener('click', async e => {
  // copy the address (for webmail users or to write later)
  const c = e.target.closest('[data-copy]');
  if (c) {
    const done = $('.reach-done', c.closest('.reach'));
    try { await navigator.clipboard.writeText(to()); done.textContent = tt('نُسخ البريد الإلكتروني.', 'Adresse e-mail copiée.', 'Email address copied.'); }
    catch { done.textContent = to(); }
    clearTimeout(done.t); done.t = setTimeout(() => (done.textContent = ''), 3000);
    return;
  }
  // [data-book] opens the sheet; its subject follows the button (a room, a quote…). Without JS: contact.html#booking
  const a = e.target.closest('[data-book]'), dlg = $('#book');
  if (!a || !dlg || !MODAL) return; // no <dialog> support: the link itself leads to contact.html#booking
  e.preventDefault();
  compose($('.reach', dlg), a.dataset.subject || $('.reach', dlg).dataset.subject);
  dlg.from = a;
  dlg.showModal();
});
